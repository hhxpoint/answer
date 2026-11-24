# 二手估价与公开市场（packageTrade）

> 版本：1.41.0 · 2026-11-24
> 代码：`packageTrade/`（小程序子包） + `answer-couple-server/src/trade.js`（服务端 `trade-api`）
> 相关文档：[../../TRADE_IMAGE_SOURCES.md](../../TRADE_IMAGE_SOURCES.md)（68 款图片来源清单）

---

## 1. 模块定位与边界

`packageTrade` 是一个**本地优先的二手 3C 估价工具**，并在其上叠加了一个**审核后才公开的信息浏览区**。

明确做什么：

| 能力 | 说明 | 是否依赖服务端 |
|---|---|---|
| 行情浏览 | 68 款设备（游戏本 38 / 手机 20 / 游戏机 10）、83 个配置的规格与二手参考区间 | 否 |
| 个人估价 | 成色/电池/维修/屏幕/配件/保修 6 维系数，实时算区间 | 否 |
| 估价单 | 本机保存（最多 30 条）、Canvas 2D 海报、直接分享小程序卡片 | 否 |
| 设备详情分享 | 分享当前型号 + 当前配置版本，好友打开落到同一页 | 否 |
| 公开浏览 | 只有 `approved` 的带图信息可见 | 是 |
| 发布/我的发布/举报 | 用户上传实拍图 + 文本，进人工审核 | 是 |

明确不做什么（也是合规红线）：

- 不提供交易、支付、担保、竞价；
- 不提供评论、关注、私聊、联系方式字段；
- 不做「回收报价」，价格是**参考区间**，页面与文档都写「非成交承诺」；
- 不抓取未授权平台的数据或图片。

> 主体是企业主体，因此允许公开 UGC；但仍按「最小社交面」设计：发布者只显示昵称（不显示头像）、不展示精确地址、不能互相联系。

---

## 2. 页面清单（12 页）

子包在 `app.json.subPackages` 中注册为 `packageTrade`，入口在首页「二手估价」卡片。

| 页面 | 路由 | 职责 | 需要登录 |
|---|---|---|---|
| 首页 | `pages/home/home` | 搜索、品类/品牌/显卡筛选、估价单数量、公开浏览入口 | 否 |
| 列表 | `pages/list/list` | 全部型号、品牌/GPU 筛选、排序 | 否 |
| 详情 | `pages/detail/detail` | 大图、规格、配置版本切换、参考区间、直接分享 | 否 |
| 估价 | `pages/estimate/estimate` | 问卷式估价、心理价位对比、发布 CTA | 否 |
| 估价单 | `pages/poster/poster` | Canvas 2D 海报、保存相册、`open-type="share"` 直分享 | 否 |
| 估价单分享页 | `pages/share/share` | 好友打开 `?d=` 白名单载荷后渲染，可再次分享 | 否 |
| 我的记录 | `pages/my/my` | 本机估价记录（`wx.setStorageSync`） | 否 |
| 数据与边界 | `pages/sources/sources` | 价格基准、图片来源、隐私、免责声明 | 否 |
| 发布 | `pages/publish/publish` | 无 `id` 时是**型号选择器**；有 `id` 时是发布表单 | 是 |
| 公开浏览 | `pages/market/market` | `approved` 列表、品类切换、空态引导发布 | 否 |
| 公开详情 | `pages/listing/listing` | 图片预览、举报、分享好友/朋友圈 | 否 |
| 我的发布 | `pages/mylist/mylist` | 状态列表（审核中/已公开/未通过/已隐藏/已过期）、删除 | 是 |

### 2.1 发布入口与选型器（1.41.0 新增）

1.40.2 之前，公开浏览页与「我的发布」的「去发布」按钮直接跳到 `publish?category=laptop`，
而 `publish.onLoad` 必须有 `id`，于是落到「没有找到这款设备」的死胡同。

1.41.0 起：

- `publish` 无 `id` → 进入**型号选择器**：68 款可搜索、按品类切换、显示配置摘要与参考区间；
- 选中型号 → 自动带出第一个配置、A 成色（95 新）与区间中位价，进入发布表单；
- 公开浏览页的「去发布」会带上当前品类；「我的发布」的「去发布」进入全部品类选择器。

实现：`publish.js` 的 `startPicking / refreshPick / onPickCategory / onPickInput / onPickConfirm / onPickClear / pickModel`。

---

## 3. 数据层

### 3.1 规模与文件

| 文件 | 内容 | 数量 |
|---|---|---|
| `data/laptops.js` | 游戏本（`MODELS`，含 `UPDATED_AT = 2026-11-21`） | 38 款 |
| `data/phones.js` | 手机（`DEVICES`） | 20 款 |
| `data/consoles.js` | 游戏机（`DEVICES`） | 10 款 |
| 合计 | — | **68 款 / 83 个配置** |

`utils/catalog.js` 把三者合并为 `ALL`，统一补齐：

- `categoryKey`（`laptop` / `phone` / `console`）与 `categoryName`；
- `priceText` / `priceLowText` / `launchText`；
- `specItems`：按品类给出不同规格项（手机看芯片/内存/存储/屏幕/电池/影像/重量；游戏机看 CPU/GPU/存储/屏幕/输出/手柄/重量；游戏本看 CPU/GPU/内存/硬盘/屏幕/电池/重量）；
- `specLine`：列表页一行摘要；
- `list()/getModel()/getVariant()/brands()/gpuGroups()/searchIntro()`。

### 3.2 单条数据字段

```js
{
  id: 'legion-y9000p-2024',
  brand: '联想', brandKey: 'lenovo', series: '拯救者', model: 'Y9000P 2024', year: 2024,
  categoryKey: 'laptop',
  launchPrice: 9999,
  priceLow: 5600, priceHigh: 6800,        // 二手参考区间（成色 A 基准）
  specs: { cpu, gpu, ram, storage, screen, battery, weight },
  variants: [{ id, label, launchPrice, priceLow, priceHigh }],
  aliases: [], highlights: [], priceBasis: 'guide',
  image: 'https://hhxpoint.me/couple-api/files/trade-assets/final/legion-y9000p-2024.jpg',
  imageType: 'photo', imageNote: '同系列参考实拍，非本机实拍',
  imageLicense: 'CC0', imageAuthor: '...', imageSource: 'https://commons.wikimedia.org/...'
}
```

`priceBasis: 'guide'` 表示「发售价 + 折旧模型」的参考区间，不是成交样本。

### 3.3 图片

- 1.40.1 起 **68/68 全部为真实产品图/实拍图**，不再有示意图或占位图；
- 统一压缩为 JPEG 后托管在 `https://hhxpoint.me/couple-api/files/trade-assets/final/<id>.jpg`（服务器合计约 15MB），不依赖外部图床；
- 许可：Wikimedia Commons 图为 CC0 / CC BY / CC BY-SA，保留作者与来源；其余为品牌官方或媒体产品图，清单中标注「待购买来源版权」；
- 逐款来源（来源页 URL、许可、作者、备注）见 [TRADE_IMAGE_SOURCES.md](../../TRADE_IMAGE_SOURCES.md) 与同名 `.json`；
- 详情页会显示图片性质说明（官方图 / 同系列参考 / 待购买来源）。

---

## 4. 估价算法（`utils/estimate.js`）

```text
factor = 成色 × 电池 × 维修 × 配件 × 保修 × 屏幕
low    = round10(variant.priceLow  × factor)
high   = round10(variant.priceHigh × factor)
fair   = round10((low + high) / 2)
quick  = round10(low  × 0.95)      // 想快出
patient= round10(high × 1.04)      // 愿意等
```

| 维度 | 取值与系数 |
|---|---|
| 成色 | S 准新 1.03 / A 95新 1.00 / B 9成新 0.92 / C 8成新 0.82 / D 7成新 0.70 |
| 电池 | 95%+ 1.00 / 90–94 0.98 / 85–89 0.95 / 80–84 0.90 / <80 0.84 / 不清楚 0.94 |
| 维修 | 无 1.00 / 官方 0.95 / 第三方 0.90 / 换屏 0.92 / 主板 0.80 |
| 配件 | 全套 1.02 / 只有充电器 1.00 / 裸机 0.95 |
| 保修 | 保修内 1.05 / 已过保 1.00 / 不确定 0.98 |
| 屏幕 | 完好 1.00 / 轻微划痕 0.97 / 亮点坏点 0.90 / 碎屏漏液 0.78 |

心理价对比：高于 `high × 1.08` → 「可能不好出手」；低于 `low × 0.92` → 「可能卖亏」；否则「合理区间内」。

输出同时给出 `stars`、`confidence` 与三条 `notes`（含「参考价不是成交承诺」）。

---

## 5. 分享体系（三种，都是原生小程序卡片）

| 场景 | 路由 | 载荷 | 依赖 |
|---|---|---|---|
| 估价单 | `/packageTrade/pages/share/share?d=<encodeURIComponent(JSON)>` | 白名单字段 `{m,v,a:{condition,battery,repair,accessory,warranty,screen,customPrice},d}`，约 335 字符 | 无（纯本地还原） |
| 设备详情 | `/packageTrade/pages/detail/detail?id=<modelId>&variant=<variantId>` | 型号 + 配置版本 | 无 |
| 公开信息 | `/packageTrade/pages/listing/listing?id=<listingId>` | 服务端 id，卡片图用实拍图 | 服务端 |

设计取舍：

- 估价单分享**不带自由文本、不带照片、不带联系方式**，只允许白名单字段 + 型号 id，纯前端还原，因此即使没有服务器、没登录也能打开；
- 详情分享的标题带当前配置的参考区间（如「联想 Y9000P 2024 · 二手参考 ¥14,500 – ¥16,500」），冷启动即落到同一配置；
- 三类页面都同时实现 `onShareAppMessage` 与 `onShareTimeline`；
- 海报页用 Canvas 2D 绘制（`utils/poster.js`），`open-type="share"` 分享的是小程序卡片而不是图片，保存相册只是兜底。

---

## 6. 发布与审核链路（UGC）

### 6.1 用户侧流程

```text
公开浏览/我的发布 → 选型号（picker）
  → 选最多 6 张实拍图（wx.chooseMedia → base64 → POST /trade-api/upload）
  → 填标题/价格/城市/描述（标题必填、价格必填、至少 1 张图）
  → POST /trade-api/listings → status = pending
  → 提示「已提交审核」→ 跳「我的发布」
  → 管理员审核 → approved 才出现在公开浏览
```

图片处理在客户端完成：`wx.getFileSystemManager().readFile({encoding:'base64'})` → `data:image/jpeg;base64,...` → 服务端校验大小与格式。串行上传（`uploadAt`），任一失败会停在表单并提示。

### 6.2 状态机

```text
pending ──approve──→ approved ──hide──→ hidden
   │                    └──（无评论/交易，仅展示）
   ├──reject──→ rejected
   └──（预留）expired
```

状态只有服务端 `POST /trade-api/admin/review` 能改；发布者只能删除自己的发布。

审核时可附带一句 `note`（≤200 字），写入 `review_note` / `reviewed_at`：
- **只对发布者本人返回**（`/listings/mine`、以及作者本人的详情请求）；
- 公开列表与公开详情里恒为空字符串，不会泄漏；
- 发布者在「我的发布」看到「审核说明：…」，改回 `approved` 时说明自动清空。

### 6.3 审核侧

审核有三个入口，推荐用第一个：

**① OJ 管理后台「二手审核」（推荐，2026-11-24 新增）**

```text
https://hhxpoint.me/admin/trade/
```

- 登录方式与 OJ 后台一致（`role=admin`），不用记第二套密码
- 列表：状态标签（待审/已通过/未通过/已隐藏/全部）+ 品类筛选 + 标题/型号/描述搜索 + 缩略图
- 详情：实拍图（点开原图）、卖家描述、设备档案、举报记录、审核记录
- 动作：**通过并公开 / 驳回 / 隐藏**，可填审核说明（1.41.1 起会显示在发布者的「我的发布」）
- 实现：`pro/trade_admin.py` + `templates/admin/trade*.html`
- **读**：直接以 `mode=ro` 打开 `/home/point/couple/data/app.db`
- **写**：不直接改库，调用 `POST /trade-api/admin/review`（`x-admin-token`），保持 Node 服务是唯一写者
- **审计**：每次动作追加一行到 `/home/point/pro/logs/trade_review.log`（JSON Lines，含操作人/前后状态/备注）

**② 小火苗后台 `/couple-admin/trade`**（Basic Auth，最早的一版，功能较简陋但可用）

**③ 命令行 `tools/trade_review.py`**（服务端仓库，适合脚本化/应急）

```bash
export TRADE_ADMIN_TOKEN=...      # 与服务器 .env 中同名变量一致
python tools/trade_review.py list
python tools/trade_review.py approve 12
python tools/trade_review.py reject 12
python tools/trade_review.py hide 12
```

它只调用 `https://hhxpoint.me/trade-api/admin/{pending,review}`，不直接读库、不打印 token。

> ⚠️ OJ 的 `SECRET_KEY` 是**每次启动随机生成**的（`secrets.token_hex(16)`），
> 所以每次 `systemctl restart myide` 都会让所有已登录管理员掉线，需重新登录。这是 OJ 既有行为。

### 6.4 举报

公开详情页提供「虚假信息 / 疑似盗抢假冒 / 违禁物品 / 联系方式广告 / 其他」，写入 `trade_reports` 并给 `trade_listings.report_count + 1`。

**阈值自动隐藏（1.41.2 起）**：

- 阈值 `TRADE_REPORT_THRESHOLD`（默认 **3**，`0` 表示关闭）；
- 只对**已公开（approved）**的发布生效，且只在刚好跨过阈值时触发一次；
- 触发后自动 `hidden`，并写 `review_note = 系统自动隐藏：举报达到 N 次，等待人工复核`、记一条 `trade_review_logs`（`source=auto_report`、`actor=system`）；
- 接口返回 `auto_hidden: true`，小程序弹告知框并返回上一页；
- **不会自动封禁/删除**，仍需人工复核：可恢复 `approved`，也可改为 `rejected` 并写说明。

---

## 7. 服务端接口（`/trade-api`）

实现：`answer-couple-server/src/trade.js`，在 `src/app.js` 中 `app.use('/trade-api', tradeRouter)`。
鉴权复用小火苗的登录：`wx.login → POST /couple-api/login` 拿 Bearer token（HMAC，`TOKEN_SECRET` 签名），客户端存 `trade_token`，401 时自动重新登录一次。

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|---|---|---|---|---|
| GET | `/trade-api/health` | — | — | 健康检查 |
| POST | `/trade-api/upload` | Bearer | 40 次/分/用户 | base64 图片，仅 png/jpg/webp，≤1.5MB，返回 `/couple-api/files/trade/<name>` |
| POST | `/trade-api/listings` | Bearer | 8 次/分/用户 | 发布；`category/modelId/modelName/title` 必填，`price` 1–200000，`images` ≤6 且必须是本站 `trade/` 已上传文件；文本过 `msgSecCheck`；入库即 `pending` |
| GET | `/trade-api/listings/mine` | Bearer | — | 我的发布（最近 50 条，含 pending） |
| GET | `/trade-api/listings` | — | — | 公开列表，仅 `approved`；`category`、`cursor`（上一页最后一个 id）、`limit` ≤30 |
| GET | `/trade-api/listings/:id` | 可选 | — | `approved` 对所有人；非 `approved` 仅作者本人可见，其他人 404 |
| DELETE | `/trade-api/listings/:id` | Bearer | — | 仅作者；删图片文件 + 举报行 + 记录（1.41.0 起同步清 `trade_reports`） |
| POST | `/trade-api/listings/:id/report` | — | 20 次/分/IP | 举报，`reason` ≤80 字；返回 `report_count` 与 `auto_hidden`（达阈值时自动隐藏） |
| GET | `/trade-api/admin/pending` | `x-admin-token` | — | 待审列表（≤100） |
| POST | `/trade-api/admin/review` | `x-admin-token` | — | `{id,status,note?,actor?}`，status ∈ approved/rejected/hidden/expired；`note` ≤200 字，写入 `review_note` 并对发布者可见（1.41.1 起） |
| GET | `/trade-api/admin/review-logs/:id` | `x-admin-token` | — | 审核审计（最近 100 条：前后状态 / 说明 / 操作人 / 来源 `admin_api`｜`auto_report`） |

返回约定：成功 `{ok:true, ...}`；失败 `{ok:false, error:{code,msg}}`。
文本统一做 `<>` 剥离与空白折叠，长度按字段截断（标题 40、描述 200、城市 16、标题 12 成色等）。

公开列表的 `seller` **只返回昵称**（`dto(row,false)` 不返回头像），作者本人视角才带头像。

---

## 8. 数据库

迁移版本：`004_trade_market` + `005_trade_review_note` + `006_trade_review_logs`（均加法式，`src/db.js`）。

```sql
CREATE TABLE trade_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  model_id TEXT NOT NULL DEFAULT '',
  model_name TEXT NOT NULL DEFAULT '',
  variant_label TEXT NOT NULL DEFAULT '',
  condition TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',      -- JSON 数组，存站内相对路径
  status TEXT NOT NULL DEFAULT 'pending',
  report_count INTEGER NOT NULL DEFAULT 0,
  review_note TEXT DEFAULT '',          -- 后台审核说明，仅发布者可见（005）
  reviewed_at INTEGER DEFAULT 0,        -- 最近一次审核时间（005）
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_trade_status_time ON trade_listings(status, id);   -- 公开列表按 status + id 倒序
CREATE INDEX idx_trade_user_time   ON trade_listings(user_id, id);  -- 我的发布

CREATE TABLE trade_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_trade_reports_listing ON trade_reports(listing_id);

-- 006：审核审计
CREATE TABLE trade_review_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  from_status TEXT NOT NULL DEFAULT '',
  to_status TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  actor TEXT NOT NULL DEFAULT '',        -- 管理员名 / system
  source TEXT NOT NULL DEFAULT '',       -- admin_api | auto_report
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_trade_review_logs_listing ON trade_review_logs(listing_id, id);
```

- 图片文件落在 `UPLOAD_DIR/trade/`（= `/home/point/couple/uploads/trade`），由 `express.static` 以 `/couple-api/files/trade/` 对外；
- 数据在同一个 `data/app.db`，每日 04:10 cron 备份（`src/backup.js`，保留 7 份）；
- 无级联外键，删除时由业务代码同步清理（1.41.0 清 `trade_reports`，1.41.2 起同时清 `trade_review_logs`）。

---

## 9. 部署与运维

### 9.1 nginx（`/etc/nginx/sites-available/hhxpoint`）

```nginx
location /trade-api {
    proxy_pass http://127.0.0.1:5011;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 75s;
    client_max_body_size 25m;
}
```

静态图片不需要单独配置：走已有的 `location /couple-api` → 5011 → `express.static`。

### 9.2 环境变量（`/home/point/couple/.env`）

| 变量 | 用途 |
|---|---|
| `TRADE_ADMIN_TOKEN` | 审核接口的 `x-admin-token`；不写进客户端、不进仓库 |
| `TOKEN_SECRET` | 复用小火苗的 Bearer 签名密钥 |
| `WX_APPID` / `WX_SECRET` | `msgSecCheck` 与 `code2Session` |
| `UPLOAD_DIR` | 图片根目录 |

### 9.3 部署与回滚

- 只改了服务端文件时：备份 → `sftp put` → `node --check` → `systemctl restart couple.service` → 探活 `curl 127.0.0.1:5011/trade-api/health`；
- 改了 nginx 时：先 `cp sites-available/hhxpoint hhxpoint.bak-<ts>` 再 `nginx -t && systemctl reload nginx`；
- 数据库备份：`/home/point/couple/backups/`（每日），迁移前手动 `node src/backup.js` 生成一致性副本。

### 9.4 运维注意

- `msgSecCheck` 在微信侧异常时当前实现是**放行并记日志**（`[msgSecCheck] 调用失败/超时，放行`）；因为有**人工审核**兜底，风险可控，但不要把「通过内容检测」当成已审核；
- 报告数只累加，不自动隐藏；
- `expired` 状态已预留但**没有定时过期任务**；
- 上传目录没有独立配额，图片总量约 15MB（资产图）+ 用户实拍图若干。

---

## 10. 测试与验收

### 10.1 本地（不需要微信运行时）

```bash
node packageTrade/tests/trade_data.test.js        # 68 款 / 83 配置 / 搜索与筛选
node packageTrade/tests/trade_smoke.test.js       # 估价 + 海报调用次数
node packageTrade/tests/trade_pages.test.js       # home/list/detail/estimate 页面逻辑
node packageTrade/tests/trade_share.test.js       # 估值载荷编解码（~335 字符）
node packageTrade/tests/trade_share_page.test.js  # 分享页还原估价单
node packageTrade/tests/trade_market_flow.test.js # 选型器 / 公开列表 / 详情分享 / 我的发布（1.41.0 新增）
```

`trade_market_flow.test.js` 用 stub 的 `wx.request` 覆盖：
选型器默认 68 款、按品类过滤（手机 20 / 游戏机 10）、搜索与清空、选中型号后标题/价格/成色预填、
公开列表相对路径补全为绝对 URL 与价格千分位、详情页分享 path/imageUrl、举报调用、我的发布状态文案与删除入口。

### 10.2 服务端端到端（真实环境，53 项）

脚本：服务端仓库 `tests/trade_e2e.js`（在服务器本机执行，避免外网限制）：

```bash
cd /home/point/couple && node /path/to/tests/trade_e2e.js   # 期望 TRADE_E2E_OK steps=53
```

覆盖：

```text
创建测试用户 → 上传实拍图 → 未登录上传 401 → 发布得 pending
→ 非法外站图片被拒 → pending 不出现在公开列表
→ 无 admin token 访问待审 403 → 有 token 可见
→ 审核通过
→ 驳回并带说明：仅作者可见（mine 拿到 note + reviewed_at）、公开列表消失、他人详情 404
→ 重新通过：说明清空、公开恢复
→ 公开列表/品类过滤/详情/卖家昵称（不含头像）/公开详情不返回 note
→ 举报 + report_count+1（低于阈值不自动隐藏）
→ 举报到阈值 3：自动 hidden + 系统说明 + 公开列表移除 + 他人详情 404
→ 审计表可查（人工/系统两条来源，无 token 403）→ 人工复核恢复公开
→ 删除（图片文件、记录、举报行、审计行都被清理）
→ 公开列表恢复 → 清理测试用户
```

结论：`TRADE_E2E_OK steps=53`。脚本自带测试用户清理，可重复执行。

### 10.3 上传与真机验收

- CI 编译：`node tools/wx-ci/compile_check.js`（`miniprogram-ci`，本地编译产出 zip）；
- 上传两条路（推荐 B）：
  - **A** `node tools/wx-ci/upload.js --version 1.41.1 --desc "..."`：受上传密钥 IP 白名单约束，
    换网络会报 `invalid ip: <微信侧看到的公网 IP>`（注意：它可能和 `api.ipify.org` 显示的不一样）；
  - **B** 开发者工具 CLI：`cli.bat upload --project <项目路径> --port <IDE 端口> --version 1.41.1 --desc "..."`，
    走已登录账号、**不受白名单限制**；IDE 端口是动态的，先用 `cli.bat islogin --port <上次端口>` 探，报错信息里会给出真实端口；
- 真机验收清单：
  1. 公开浏览 → 空态「选一台设备，发布第一条」→ 选型器能搜到型号；
  2. 选一台设备 → 传 2 张实拍图 → 提交 → 我的发布显示「审核中」；
  3. 到 `https://hhxpoint.me/admin/trade/` 点「通过并公开」→ 公开浏览出现该条 → 分享给好友/朋友圈；
  4. 再发一条，审核时点「驳回」并写一句说明 → 我的发布应显示「审核说明：…」；
  5. 好友打开后图片、标题、价格一致；举报一次，后台「举报」列 +1；
  5. 我的发布删除 → 公开浏览消失。

---

## 11. 合规与风险

| 项 | 现状 |
|---|---|
| 主体 | 企业主体，允许公开 UGC |
| 内容安全 | 文本 `msgSecCheck`（异常时放行 + 人工审核兜底）；图片靠人工审核 |
| 交易属性 | 无交易/支付/担保，不展示联系方式，不提供站内私聊 |
| 隐私 | 只显示昵称；城市为用户手填且不出精确地址；发布者可随时删除 |
| 版权 | 68 款图片中非 CC 来源标注「待购买来源版权」，采购清单已给出；正式商用前需完成授权 |
| 分类资质 | 不涉及需要资质的类目；如后续要加「交易/担保」必须重新评估 |
| 审核留痕 | `status + review_note + reviewed_at`；后台每次动作另写 `/home/point/pro/logs/trade_review.log`（JSONL，含操作人/前后状态/备注），未单独建 DB 审计表 |

---

## 12. 已知限制与后续

1. 图片授权：非 CC 来源需购买，清单见 `docs/TRADE_IMAGE_SOURCES.md`；
2. 审核命令行为主，没有 Web 审核后台页面（可复用 OJ 管理后台风格新增 `/admin/trade`）；
3. 无自动过期、无举报阈值自动隐藏、无审计日志表；
4. 价格仍是模型参考，真实成交样本库未建立；
5. 公开浏览依赖用户发布，未审核通过前为空态（当前线上 0 条）；
6. 上传密钥 IP 白名单是 `miniprogram-ci` 的硬前置，换网络需重新加白；改用微信开发者工具 CLI 可绕开（见 10.3）。

---

## 13. 版本轨迹

| 版本 | 内容 |
|---|---|
| 1.35.0 | 小程序卡片直分享（评价单） |
| 1.36.0 | 全品类扩展（手机 / 游戏机 / 游戏本，68 款） |
| 1.37.0 / 1.37.1 | 服务端公开市场（发布 / 审核 / 浏览 / 举报）+ 图片与审核链路 |
| 1.40.0 / 1.40.1 | 68 款全量真实实物图、统一压缩与站内托管 |
| 1.40.2 | 详情页直接分享小程序卡片（带当前配置与参考价） |
| 1.41.0 | 发布前选型器（修复「去发布」死胡同）、首页分享文案改全品类、删除同步清理举报记录 |
| 1.41.1 | 驳回理由回传：`review_note`/`reviewed_at`（迁移 `005`），后台可填、发布者可见、公开侧不泄漏；OJ 后台「二手审核」 |
| 1.41.2 | 举报阈值自动隐藏（默认 3，可配）+ 审核审计表 `trade_review_logs`（迁移 `006`）+ `review-logs` 接口；OJ 审核记录读库并标来源 |
