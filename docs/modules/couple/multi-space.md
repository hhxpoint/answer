# 多关系空间（Multi-Space）设计与实施记录

> 将「我们的小火苗」从“一人一个双人空间”升级为“一人可拥有多个双人关系空间”
> （父亲/母亲/恋人/闺蜜/死党等），每个空间独立拥有小火苗、悄悄话、时光、纪念日、侧耳倾听。
>
> 状态：**Phase A（服务端）已完成并部署，客户端开发中**。
> 记录时间：2026-11-18。

---

## 1. 目标与原则

| 目标 | 说明 |
|---|---|
| 多空间 | 一个用户可加入多个双人空间，每个空间 2 人 |
| 单元化 | 所有空间复用同一套宠物/消息/时光/纪念日/语音服务与页面 |
| 数据隔离 | 每个请求必须校验 space 成员身份，任何页面不能跨空间读写 |
| 旧客户端兼容 | 旧版本不带 space 参数时使用“默认空间”，不崩溃 |
| 可回滚 | 数据库只加列/索引；服务端开关 `MULTI_SPACE_ENABLED`；迁移前备份 |

---

## 2. 数据模型（加法式）

物理表继续使用 `couples` / `couple_members` / `couple_id`，代码/API 语义改为 **space（空间）**，避免大范围改表名与数据迁移风险。

### couples 新增

| 字段 | 说明 |
|---|---|
| `relation_type` | `family` / `partner` / `friend` / `custom` / `unset` |
| `title` | 空间自定义名称（可空） |
| `created_by` | 创建者 user_id |
| `last_active_at` | 最近活跃时间（大厅排序） |

### couple_members 新增

| 字段 | 说明 |
|---|---|
| `relation_label` | 该成员在这个空间里的身份：父亲/女儿/恋人/闺蜜… |
| `alias` | 预留：对方备注 |
| `last_read_message_id` | 已读游标（大厅未读数） |
| `pinned` | 预留：置顶 |

### 迁移记录

`schema_migrations` 表记录 `002_multi_space`；旧数据默认 `relation_type='unset'`、标签空、`last_active_at=updated_at`，不改变既有语义。

---

## 3. 服务端实现（Phase A，已上线）

### 3.1 新增文件/函数

- `src/db.js`：迁移列 + 索引 + `schema_migrations`
- `src/repo.js`：`spacesOfUser` / `primarySpaceOfUser` / `spaceById` / `membership` / `spaceList` / `spaceView` / `setMemberLabel` / `deleteSpaceData` / `touchSpace`
- `src/app.js`：`resolveSpace` 中间件 + `/spaces` API + 旧接口兼容
- `src/ws.js`：WebSocket 支持 `space_id`，按空间分房间
- `tests/multi_space.test.js`：22 项集成测试

### 3.2 空间解析（隔离生命线）

```text
X-Space-Id header（新客户端）
  → query space_id（兼容）
  → 默认空间（旧客户端）
  → 校验成员身份：非成员 403 NOT_MEMBER，不存在 404 SPACE_NOT_FOUND
```

所有业务接口只使用 `req.space.id`，禁止再用“猜第一个空间”的方式。

### 3.3 新增 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/couple-api/spaces` | 我的空间列表（含对方、宠物摘要、最近消息、未读） |
| POST | `/couple-api/spaces` | 创建空间 `{relation_type, my_label, title?}` |
| POST | `/couple-api/spaces/join` | 加入 `{code, my_label}` |
| GET | `/couple-api/spaces/:id` | 空间详情 |
| PATCH | `/couple-api/spaces/:id` | 修改标题/关系类型/自己的标签 |
| POST | `/couple-api/spaces/:id/leave` | 解除关系（需 `{confirm:true}`，双方数据删除） |
| POST | `/couple-api/messages/read` | 标记已读（大厅未读数） |

限制：
- 每用户最多 **8 个空间**
- 每空间最多 **2 人**
- 创建 12 次/分钟、加入 10 次/分钟、退出 5 次/分钟
- 标签/标题走 `msgSecCheck`（失败放行，与现有策略一致）

### 3.4 旧接口兼容

| 旧接口 | 行为 |
|---|---|
| `/couple-api/me` | 保留 `user/couple/pet/...`，新增 `spaces` + `active_space_id` |
| `/couple/create` | 已有空间则返回默认空间，不新增 |
| `/couple/join` | 保持旧语义（已有一个空间则 ALREADY_BOUND） |
| `/couple/unbind` | 按当前默认/指定空间退出；无人后删除数据 |
| WebSocket | 不传 `space_id` 使用默认空间；事件带 `space_id` |

### 3.5 开关

`.env`：

```bash
MULTI_SPACE_ENABLED=1   # 0 = 旧行为；1 = 启用 /spaces 与 X-Space-Id
```

生产已开启；客户端上线前保持开启，旧客户端照常使用默认空间。

---

## 4. 部署记录

- 迁移前备份：`/home/point/couple/backups/pre-multispace-consistent-*.db`
- 迁移前后数据量一致：users=7, couples=1, members=2, pets=1, messages=17, diaries=3, anniversaries=3, voices=4
- 新列/迁移记录已确认；`couple.service` active，health 200
- 服务端测试：**22 passed, 0 failed**（临时 DB，不污染生产）
  - 创建/加入、多空间大厅、旧接口兼容、越权 403、满员、修改标签、解除关系、空间上限

---

## 5. 客户端（Phase B，下一步）

```text
packageCouple/pages/spaces/spaces        关系空间大厅
  ├─ pages/create/create                 创建（关系类型 + 我的身份 + 邀请）
  ├─ pages/join/join                     加入（邀请码 + 我的身份）
  └─ pages/home/home?space=<id>          进入空间
```

- `utils/space.js`：当前空间、spaces 缓存、`X-Space-Id` 注入
- `couple-api.js` / `couple-ws.js`：自动带 space 上下文
- 所有页面从 space 上下文取数据；切换空间清页面栈
- 大厅 UI：关系卡（类型徽章/对方头像/小火苗摘要/最近活跃/未读）+ 新建卡
- 关系类型：家人（父亲/母亲/孩子/兄弟姐妹）、恋人、朋友（闺蜜/死党/挚友）、自定义
- 用词克制：关系空间 / 一起养火苗 / 邀请对方；不做公开匹配

---

## 6. 回滚

1. 服务端：`.env` 设 `MULTI_SPACE_ENABLED=0`，重启（旧行为）
2. 如迁移异常：停服务 → 用 `pre-multispace-consistent-*.db` 恢复 → 回退旧代码 → 启动
3. 客户端：回退到 1.28.0（旧版本仍可用默认空间）
4. 数据库回滚会丢失迁移后新空间数据，执行前必须确认

---

## 7. 版本管理

- 公共仓库分支：`feature/multi-space`（客户端/文档），Phase 完成后合并 main
- 服务端代码同步到私有仓库 `private/server/code`
- 每个 Phase：提交 → 推送 → 更新 changelog → 打里程碑 tag
- 数据库迁移脚本/测试必须与代码同批提交
