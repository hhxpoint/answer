# 小火苗服务端与后台（全量说明）

> 服务端是独立项目，不在本仓库内（小程序仓库只包含前端与文档）。
> 本文记录其**生产配置、接口、数据库、后台、内容安全、部署与运维**，用于交接与回溯。
>
> ⚠️ 本文不包含任何真实密码/Token/AppSecret，统一用 `<在服务器 .env 中配置>` 占位。

---

## 1. 总体部署

| 项 | 值 |
|---|---|
| 域名 | `https://hhxpoint.me` |
| 服务器 | Azure VM（Linux，当前系统 Ubuntu 22.04） |
| 运行时 | Node.js 20 |
| 框架 | Express 4 + better-sqlite3 + ws |
| 本地端口 | `127.0.0.1:5011`（只监听本机，由 nginx 反代） |
| 服务管理 | systemd：`couple.service` |
| 站点入口 | nginx `hhxpoint` vhost 下新增 3 个 location |
| 数据 | `/home/point/couple/data/app.db`（SQLite） |
| 文件 | `/home/point/couple/uploads/`（avatars / diaries / voices） |
| 备份 | `/home/point/couple/backups/`（每日 04:10，保留 7 份） |

### 1.1 nginx 路由

```nginx
location /couple-api   { proxy_pass http://127.0.0.1:5011; ... }   # REST + 静态文件
location /couple-ws    { proxy_pass http://127.0.0.1:5011; ... }   # WebSocket（upgrade）
location /couple-admin { proxy_pass http://127.0.0.1:5011; ... }   # 独立管理面板（Basic Auth）
```

- `/couple-api/files/...` 由 Express 静态服务提供（支持 Range，音频可拖进度条）
- 修改 nginx 前会备份：`hhxpoint.bak-couple-<时间戳>`，`nginx -t` 通过后 `reload`

### 1.2 systemd 单元（要点）

```ini
[Service]
User=point
WorkingDirectory=/home/point/couple
ExecStart=/usr/bin/node /home/point/couple/src/app.js
EnvironmentFile=/home/point/couple/.env
Restart=always
RestartSec=5
MemoryMax=220M
[Install]
WantedBy=multi-user.target
```

常用命令：

```bash
sudo systemctl restart couple
sudo systemctl status couple --no-pager
sudo journalctl -u couple -n 200 --no-pager
```

---

## 2. 目录与文件

```text
/home/point/couple/
├─ src/
│  ├─ app.js         # 入口：REST 路由、静态文件、内容安全回调、WS 挂载
│  ├─ db.js          # SQLite 连接、建表、字段迁移（ensureColumn）
│  ├─ repo.js        # 数据访问：用户/空间/宠物/互动
│  ├─ pet.js         # 宠物等级、动作、心情规则
│  ├─ auth.js        # 自定义 token 签发/校验（HMAC）
│  ├─ wx.js          # 微信登录/access_token/msgSecCheck/mediaCheckAsync/回调签名解密
│  ├─ ws.js          # WebSocket 房间与广播
│  ├─ panel.js       # 独立管理面板 /couple-admin
│  └─ backup.js      # 每日备份
├─ data/app.db       # SQLite（WAL）
├─ uploads/
│  ├─ avatars/       # 用户头像
│  ├─ diaries/       # 时光图片
│  └─ voices/        # 语音 mp3
├─ backups/          # 备份文件（app-YYYYMMDD.db 等）
├─ .env              # 密钥配置（chmod 600，**严禁提交**）
└─ package.json
```

---

## 3. 环境变量（.env）

| 变量 | 说明 |
|---|---|
| `PORT` | 本地端口，默认 `5011` |
| `DB_PATH` | SQLite 路径 |
| `UPLOAD_DIR` | 上传根目录 |
| `WX_APPID` | 小程序 AppID `wx0c0dcd5aec680fb9` |
| `WX_SECRET` | 小程序 AppSecret（**密钥，仅服务器/CI 环境持有**） |
| `TOKEN_SECRET` | 自定义登录 token 的 HMAC 密钥（随机 32 字节 hex） |
| `ADMIN_USER` / `ADMIN_PASS` | 独立面板 `/couple-admin/` Basic Auth 账号 |
| `WX_MSG_TOKEN` | 微信消息推送 Token（与公众平台配置一致） |
| `WX_MSG_AES_KEY` | 微信消息推送 EncodingAESKey（43 位） |

> `.env` 由部署脚本生成/补全，权限 600；任何情况下不要把内容贴到仓库/聊天/文档。

---

## 4. 数据库结构（SQLite）

> 说明：以实际 `PRAGMA table_info` 为准；下表为逻辑字段。迁移策略为 `ensureColumn`（只加列，不破坏旧数据）。

### users
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 自增 |
| openid | TEXT | 微信 openid（唯一身份） |
| nickname | TEXT | 昵称（微信昵称或自定义） |
| avatar | TEXT | 头像 URL（`/couple-api/files/avatars/...`） |
| created_at / last_login | INTEGER | 毫秒时间戳 |

### couples / couple_members
| 表 | 字段 | 说明 |
|---|---|---|
| couples | id, invite_code, created_at, updated_at | 双人空间，invite_code 邀请码 |
| couple_members | couple_id, user_id, joined_at | 成员关系（最多 2 人） |

### pets
| 字段 | 说明 |
|---|---|
| id, couple_id | 空间唯一宠物 |
| name | 小火苗名字（为空时前端显示「小火苗」） |
| level, exp, streak, mood, hunger | 等级/经验/连续守护/心情/饱腹 |
| last_interact_at, created_at, updated_at | 时间戳 |

### interactions / checkins
| 表 | 字段 |
|---|---|
| interactions | id, couple_id, user_id, type(feed/pet/hug/checkin), exp_delta, created_at |
| checkins | id, couple_id, user_id, day(YYYY-MM-DD), created_at |

### messages（悄悄话）
| 字段 | 说明 |
|---|---|
| id, couple_id, user_id, type, content | 消息 |
| created_at | 毫秒 |
| recalled, recalled_at | 是否撤回/撤回时间（2 分钟窗口） |
| reply_to | 引用的消息 id（0 表示无） |

### diaries（我们的时光）
| 字段 | 说明 |
|---|---|
| id, couple_id, user_id | 归属 |
| content | 文本 ≤1000 |
| images | JSON 数组，最多 9 个 `/couple-api/files/diaries/...` |
| created_at | 毫秒 |

### anniversaries（纪念日）
| 字段 | 说明 |
|---|---|
| id, couple_id, title | 名称 ≤20 字 |
| date | `YYYY-MM-DD`（原始日期） |
| repeat_yearly | 0/1 |
| created_at | 毫秒 |

> 下一次日期/倒计时不落库，由服务端按北京时间实时计算；闰年 2/29 收敛到 2/28。

### voice_messages（侧耳倾听）
| 字段 | 说明 |
|---|---|
| id, couple_id, user_id | 归属 |
| url | `/couple-api/files/voices/...` |
| duration_ms | **服务端 ffprobe 校验后的真实时长**（≤60s） |
| size_bytes | 文件大小（≤1.5MB） |
| recalled, recalled_at | 撤回（2 分钟窗口） |
| trace_id | 微信 `mediaCheckAsync` 受理编号 |
| check_status | `pending` / `pass` / `review` / `risky` / `skipped` |
| check_label | 检测标签（可能为空） |
| hidden | 是否下架（违规=1，双方不可见） |
| checked_at | 检测完成时间 |

### 索引
- `couple_members(couple_id)`、`messages(couple_id, id)`、`diaries(couple_id, id)`、`voice_messages(couple_id, id)` 等
- 具体以 `db.js` 为准

---

## 5. REST 接口一览

> Base URL：`https://hhxpoint.me/couple-api`
> 鉴权：除 `/health`、`/login`、`/files/*`、`/wx/callback` 外，均需 `Authorization: Bearer <token>`
> 响应：`{ ok: true, ... }` / `{ ok: false, error: { code, msg } }`

### 5.1 登录与用户
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| POST | `/login` | 微信 code 换 openid → token |
| GET | `/me` | 用户 + 空间 + 宠物 + 各模块计数（含 `diary_count/voice_count/anniversary_count/next_anniversary`） |
| POST | `/profile` | 保存昵称/头像（base64，≤800KB；昵称内容安全） |

### 5.2 空间
| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/couple/create` | 创建空间，生成邀请码 |
| POST | `/couple/join` | `{code}` 加入 |
| POST | `/couple/unbind` | 解绑 |

### 5.3 小火苗
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/pet` | 宠物状态 |
| POST | `/pet/interact` | `{type: feed/pet/hug/checkin}`，服务端校验每日上限 |
| POST | `/pet/rename` | `{name}` 1–12 字，内容安全 |

### 5.4 悄悄话
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/messages?after=&limit=` | 增量拉取 |
| GET | `/messages/recent?limit=` | 最近 N 条（对账） |
| POST | `/messages` | `{content, reply_to?}`，文本内容安全 |
| POST | `/messages/:id/recall` | 撤回自己的消息（2 分钟内） |

### 5.5 时光
| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/upload` | 图片 base64（≤1.2MB），返回 URL |
| GET | `/diaries?before=&limit=` | 游标分页 |
| POST | `/diaries` | `{content, images[]}`，图片地址必须真实存在 |
| DELETE | `/diaries/:id` | 仅自己的记录，同步删图片文件 |

### 5.6 纪念日
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/anniversaries` | 列表（含下次日期/剩余天数/是否今天） |
| POST | `/anniversaries` | `{title, date, repeat_yearly}` |
| PUT | `/anniversaries/:id` | 更新 |
| DELETE | `/anniversaries/:id` | 删除（双方都可删） |

### 5.7 侧耳倾听
| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/voice` | `{audio: dataURL}`，ffprobe 校验 ≤60s，单接口落库 |
| GET | `/voice?before=&limit=` | 游标分页（撤回/违规下架后 URL 不返回） |
| POST | `/voice/:id/recall` | 撤回自己的语音（2 分钟内） |

### 5.8 内容安全回调
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/wx/callback` | 微信验证 URL（明文/安全模式） |
| POST | `/wx/callback` | 接收 `wxa_media_check` 事件（JSON/XML、明文/密文） |

### 5.9 静态文件
| 路径 | 说明 |
|---|---|
| `/couple-api/files/avatars/*` | 头像 |
| `/couple-api/files/diaries/*` | 时光图片 |
| `/couple-api/files/voices/*` | 语音（支持 Range） |

### 5.10 限流（内存桶）
- 登录/发送消息/上传/改名/撤回等接口均有独立限流
- 例：消息 20 条/分钟；上传 40 次/分钟；改名 10 次/分钟；撤回 30 次/分钟

---

## 6. 管理后台

### 6.1 OJ 管理后台子模块（主要使用）

- 地址：`https://hhxpoint.me/admin/couple/`（用 OJ 管理员账号登录 OJ 后台）
- 代码：`/home/point/pro/couple_admin.py` + `/home/point/pro/templates/admin/couple.html`、`couple_space.html`
- 注册：`app.py` 中 `from .couple_admin import couple_admin_bp` + `app.register_blueprint(couple_admin_bp)`
- 侧边栏：`templates/admin/base.html` 增加「小火苗数据」入口
- 数据：以 `mode=ro` 只读方式打开 `/home/point/couple/data/app.db`，不会写入
- 页面：
  - 总览：用户/空间/悄悄话/互动/今日活跃/时光/语音统计；空间列表可点进详情
  - 详情：小火苗状态、成员（头像/昵称/OpenID 脱敏）、悄悄话（含引用/撤回）、互动、打卡、时光相册（缩略图 + 灯箱）、纪念日（下一次/倒计时）、侧耳倾听（播放器/下载/审核状态/已撤回/已下架）
- 安全：页面受 OJ `admin_required` 保护；未登录 302

### 6.2 独立管理面板（备用）

- 地址：`https://hhxpoint.me/couple-admin/`（Basic Auth，账号在 `.env`）
- 代码：`src/panel.js`
- 功能：只读查看用户/空间/宠物/消息/互动/打卡/时光/纪念日
- 用途：OJ 后台故障/升级时应急查看

---

## 7. WebSocket 事件

连接：`wss://hhxpoint.me/couple-ws?token=<token>`，按 `couple_id` 分房间；心跳 25s；断线重连。

| 事件 type | 负载 | 触发 |
|---|---|---|
| `message` | `{ message }` | 新悄悄话 |
| `message_recall` | `{ message }` | 撤回悄悄话 |
| `pet_update` | `{ pet, by }` | 互动/改名 |
| `diary_new` | `{ diary }` | 新时光 |
| `diary_delete` | `{ id }` | 删除时光 |
| `anniversary_new` | `{ anniversary }` | 新增纪念日 |
| `anniversary_update` | `{ anniversary }` | 修改纪念日 |
| `anniversary_delete` | `{ id }` | 删除纪念日 |
| `voice_new` | `{ voice }` | 新语音 |
| `voice_recall` | `{ voice }` | 撤回语音 |
| `voice_update` | `{ voice }` | 审核结果变化（违规下架等） |

前端同时做定时对账，防止断线期间漏事件。

---

## 8. 内容安全（重点）

### 8.1 文本
- 昵称、宠物名、纪念日标题、悄悄话、时光文案 → `msgSecCheck`（version 2，scene 1/2）
- 命中 87014 → 拒绝并提示
- 微信接口异常 → **放行并记录日志**（fail-open），避免误伤正常用户

### 8.2 语音（mediaCheckAsync）
- 发送语音后服务端调用 `POST https://api.weixin.qq.com/wxa/media_check_async`
  - `media_url`：`https://hhxpoint.me` + 语音相对路径
  - `media_type=1`（音频）、`version=2`、`scene=2`、`openid`
  - 同步返回 `trace_id`，结果异步推送
- 结果事件：`wxa_media_check`，携带 `trace_id / isrisky / detail[].suggest / label`
- 处理：
  - `risky` → `check_status='risky'`，`hidden=1`，广播 `voice_update`，双方不再可见
  - `review` → `check_status='review'`，保留展示，后台人工复核
  - 其余 → `pass`
- 文件保留：撤回/违规下架只隐藏，管理员后台仍可播放/下载审计

### 8.3 消息推送配置（微信公众平台）

| 项 | 值 |
|---|---|
| 入口 | 开发管理 → 开发设置 → 消息推送 |
| URL | `https://hhxpoint.me/couple-api/wx/callback` |
| Token | `<服务器 .env 中 WX_MSG_TOKEN，与公众平台填写一致>` |
| EncodingAESKey | `<服务器 .env 中 WX_MSG_AES_KEY，43 位>` |
| 加密方式 | 安全模式（推荐；也兼容明文/兼容模式） |
| 数据格式 | JSON 或 XML 均可（服务端均支持） |

**签名算法**（服务端已实现并测试）：
- URL 验证（明文）：`signature = sha1(sort(token, timestamp, nonce))`
- URL 验证（安全模式）：`msg_signature = sha1(sort(token, timestamp, nonce, echostr))`
- 消息推送（安全模式）：`msg_signature = sha1(sort(token, timestamp, nonce, Encrypt))`
- 解密：AES-256-CBC，key = base64Decode(AESKey + "=")，iv = key 前 16 字节；
  去除 PKCS#7 填充后：16 字节随机数 + 4 字节长度 + 明文 + AppID
- 回调必须 5 秒内返回 `success`，否则微信重试（服务端做了幂等）

### 8.4 其他
- 图片（时光/头像）目前只做格式与大小校验，**未接** `mediaCheckAsync` 图片检测
- 语音接口免费但有频率限制（官方政策可能调整）；需保证服务器出网正常、AppSecret IP 白名单包含服务器 IP

---

## 9. 备份与恢复

- 每日 04:10 crontab 执行 `node src/backup.js`，备份 SQLite（保留 7 份）
- 备份目录：`/home/point/couple/backups/`
- 恢复步骤：
  1. `systemctl stop couple`
  2. 备份当前 `data/app.db`（改名保留）
  3. 将备份文件复制为 `data/app.db`（注意权限 `point:point`）
  4. `systemctl start couple`
  5. 验证 `/couple-api/health`、小程序/后台数据
- 上传文件（图片/语音）不在数据库备份内，如需完整恢复需同时备份 `uploads/`

---

## 10. 部署与发布（服务端）

### 10.1 首次/常规部署（`deploy.py`）

1. 上传 `src/*`、`systemd/couple.service`、`deploy/patch_nginx.py`
2. 生成/补全 `.env`（已有则保留，只追加缺失项）
3. `npm install --omit=dev`
4. 备份并修改 nginx（幂等 patch）→ `nginx -t` → `reload`
5. 安装 systemd 单元 → `daemon-reload` → `restart`
6. 健康检查：`/couple-api/health`、面板未授权返回 401
7. 保留回滚：nginx 备份、systemd 单元可回退

### 10.2 OJ 后台子模块部署（`deploy_oj_admin.py`）

1. 上传 `couple_admin.py`、`couple.html`、`couple_space.html`、校验脚本
2. 备份 `app.py`、`templates/admin/base.html`（仅首次备份最原始版本）
3. 幂等打补丁（import + register_blueprint、侧边栏链接）
4. `py_compile` + 真实 `import pro.couple_admin` + 模板假数据渲染 + 真实数据渲染检查
5. `systemctl restart myide`，等待 5001 端口恢复（约 40s）
6. 校验 OJ 首页 200、后台 302、`/admin/couple/` 正常、journal 无 traceback
7. 任一步失败自动回滚并重启 OJ

---

## 11. 运维手册（服务端）

### 11.1 健康检查

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://hhxpoint.me/couple-api/health   # 200
curl -s -o /dev/null -w '%{http_code}\n' https://hhxpoint.me/couple-admin/       # 401（未认证）
curl -s -o /dev/null -w '%{http_code}\n' https://hhxpoint.me/admin/couple/       # 302（未登录）
```

### 11.2 日志

```bash
sudo journalctl -u couple -n 200 --no-pager
sudo journalctl -u couple --since '10 minutes ago' --no-pager | grep -i error
```

### 11.3 重启与恢复

```bash
sudo systemctl restart couple
sudo systemctl is-active couple
```

### 11.4 磁盘/内存安全清理（已验证）

| 可清理 | 说明 |
|---|---|
| `journalctl --vacuum-size=200M` | 释放 journal（曾释放 ~3.8G） |
| `~/.cache/pip` | pip 下载缓存（曾 5.6G） |
| npm 缓存 | `npm cache clean --force` |
| `/var/log/btmp` | 压缩归档 |
| 部署临时文件 | `/tmp` 下部署脚本/备份 |

**禁止清理**：
- `~/.cache/huggingface`、`~/.cache/chroma`（OJ 模型/向量库依赖）
- `data/`、`uploads/`、`backups/`
- 不要动 swap（`swapoff` 可能导致服务异常）

### 11.5 资源与限制
- `couple.service` 设置 `MemoryMax=220M`
- 当前单实例 RSS 约 30–80MB；SQLite 文件较小
- 上传目录随时间增长，语音 60s ≈ 180KB，建议定期查看磁盘（阈值参考：剩余 <20% 告警）

---

## 12. 测试与验收（服务端）

历史端到端测试（已在服务器运行通过）：

| 测试 | 通过 |
|---|---|
| 头像/改名/资料 | 11/11 |
| 悄悄话撤回/引用 | 13/13 |
| 时光相册 | 20/20 |
| 纪念日 | 21/21 |
| 侧耳倾听语音 | 17/17 |
| 音频安全回调（明文/密文/JSON/XML）+ 真实 mediaCheckAsync | 12/12 |

测试覆盖：鉴权、双人隔离、权限、参数校验、限流、WebSocket 广播、文件清理、撤回窗口、时长/大小限制、内容安全回调下架等。

---

## 13. 已知限制与后续

| 项 | 说明 |
|---|---|
| 图片内容安全 | 未接 `mediaCheckAsync` 图片检测，可复用现有回调 |
| 语音审核依赖配置 | 未配置消息推送时状态为 `skipped`，无法自动下架 |
| 实时语音通话 | 未实现（需要 RTC 资质与复杂运维） |
| 数据规模 | SQLite 单机足够当前规模；更大规模再考虑迁移 |
| 公开 URL | 图片/语音为随机文件名，不可枚举；如需更强保护可加签名 URL |
