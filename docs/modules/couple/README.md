# 「我们的小火苗」模块详解

> 独立子包：`packageCouple/`
> 定位：和重要的人一起养火苗的私密关系空间（双人绑定 + 虚拟小火苗 + 文字/相册/纪念日/语音）
> 支持多个双人关系空间：家人/恋人/朋友/自定义，每个空间数据独立，见
> [multi-space.md](multi-space.md)。
>
> 审核措辞提醒：功能命名与文案避免使用「社交」「聊天室」「陌生人」等词，
> 统一表述为「双人私密空间 / 双人记录 / 语音留言」，并明确"仅绑定双方可见"。

---

## 1. 功能全景

| 功能 | 页面 | 核心能力 |
|---|---|---|
| 关系空间大厅 | `spaces` | 多个双人空间列表、关系类型/身份标签、小火苗摘要、未读、切换、创建/加入入口 |
| 创建/加入空间 | `create` / `join` | 选关系类型、我的称呼、空间名、邀请码分享/加入 |
| 双人绑定 | `bind` | 旧版兼容：创建空间生成邀请码、邀请码加入、等待对方加入 |
| 个人资料 | `profile` | 微信头像 + 昵称（只强制一次），之后直接进入 |
| 小火苗主页 | `home` | 空间栏/切换、宠物状态、投喂/摸摸/抱抱/打卡、改名、双人头像、各模块入口 |
| 悄悄话 | `chat` | 文字消息、引用回复、2 分钟撤回、实时推送、断线对账、已读 |
| 我们的时光 | `timeline` / `timeline-edit` | 发布图文、九宫格、分页、实时同步、删除 |
| 我们的纪念日 | `anniversary` / `anniversary-edit` | 自绘日历、节日小字、每年重复、倒计时、增删改 |
| 侧耳倾听 | `listen` | 按住说话（≤60s）、上滑取消、播放、撤回、内容审核 |
| 分享 | 全部页面 | 9 张定制封面 + 按页面定制文案（大厅/创建/加入/主页/悄悄话/时光/纪念日/语音/资料） |

> 延迟与流畅度优化见 [performance.md](performance.md)；界面协调性优化见 [ui-refinement.md](ui-refinement.md)。

---

## 2. 目录结构

```text
packageCouple/
├─ utils/
│  ├─ couple-api.js          # 服务端 REST 封装（token、X-Space-Id、错误、absUrl）
│  ├─ couple-ws.js           # WebSocket 封装（心跳、重连、space_id）
│  ├─ space.js               # 当前空间上下文（storage）
│  └─ chinese-calendar.js    # 农历转换 + 节日识别（纪念日使用）
└─ pages/
   ├─ spaces/spaces.*        # 关系空间大厅（入口）
   ├─ create/create.*        # 创建关系空间
   ├─ join/join.*            # 加入关系空间
   ├─ profile/profile.*      # 首次资料：头像 + 昵称
   ├─ bind/bind.*            # 旧版绑定流程（兼容）
   ├─ home/home.*            # 小火苗主页（视觉核心）
   ├─ chat/chat.*            # 悄悄话
   ├─ timeline/timeline.*    # 时光列表
   ├─ timeline-edit/timeline-edit.*   # 发布时光
   ├─ anniversary/anniversary.*       # 纪念日日历
   ├─ anniversary-edit/anniversary-edit.* # 新增/编辑纪念日
   └─ listen/listen.*        # 侧耳倾听（语音信箱）
```

页面在 `app.json.subPackages` 的 `packageCouple.pages` 中注册，顺序：
spaces → create → join → home → bind → chat → profile → timeline → timeline-edit → anniversary → anniversary-edit → listen。

---

## 3. 核心流程

### 3.1 首次进入

```text
首页点击「我们的小火苗」
  → ensureLogin（wx.login → /couple-api/login）
  → /me
      ├─ 无昵称/头像 → profile（保存后继续）
      ├─ 无空间     → bind（创建 / 加入）
      └─ 已有空间   → home
```

- 资料页只在「昵称或头像为空」时出现，保存后不再重复
- 绑定页若检测到已有伴侣，直接跳 home；若已创建但对方未加入，进入等待状态
- 邀请链接/分享卡片：`/packageCouple/pages/bind/bind?invite=XXXXXX`，打开后自动加入

### 3.2 重定向规则（各页面统一）

```text
未登录                → 自动登录（失败则提示）
未设置资料            → /packageCouple/pages/profile/profile?next=home|bind
未绑定                → /packageCouple/pages/bind/bind
```

> 所有页面在 `onLoad/onShow` 都会做上述校验，避免直接进入子页面时状态不一致。

### 3.3 分享邀请

- `onShareAppMessage` 返回：
  - 标题：`🔥 来和我一起养一只小火苗吧，只属于两个人的小空间`
  - 路径：`/packageCouple/pages/home/home`（已绑定时）或 `bind?invite=CODE`
  - 分享图：`/assets/couple-share.png`
- `onShareTimeline` 同样返回标题与分享图
- 非开发者打开分享卡片会进入线上版本；完整双人测试需「体验版 + 体验成员」

---

## 4. 页面实现细节

### 4.1 profile（首次资料）

- 头像：`<button open-type="chooseAvatar">` → `wx.getFileSystemManager().readFile` 读 base64
- 昵称：`<input type="nickname">`（可直接选微信昵称）
- 保存：`POST /couple-api/profile { nickname, avatar: dataURL }`
  - 头像 MIME 支持 png/jpeg/webp，≤800KB，文件名随机，旧头像自动清理
  - 昵称 1–20 字，过微信文本内容安全
- 保存成功后 `redirectTo(next)`；已设置过则直接跳转

### 4.2 bind（双人绑定）

- 状态：`ready`（选择创建/加入）/ `created`（已创建等对方）
- 创建：`POST /couple-api/couple/create` → 返回邀请码，展示邀请卡
- 加入：`POST /couple-api/couple/join { code }`，大小写归一、去空格
- 邀请卡：分享按钮 + 复制邀请码
- 等待加入：前端轮询 `/me`（约 3s），检测到 partner 后跳 home
- 已绑定/已创建等边界均有提示，不会重复建房

### 4.3 home（小火苗主页）

**展示**
- 双人头像（重叠圆）、标题「我们的小火苗」、在一起天数、连续守护天数
- 小火苗：3D 分层火焰（外焰/内焰/核心 + 光晕 + 内阴影 + 地面投影）+ 火星粒子
- 名字可点击改名（`POST /couple-api/pet/rename`，1–12 字，内容安全）
- 状态：等级、经验进度、心情（开心/平静/饿了/想TA了/生病）、饱腹
- 伙伴状态栏：对方头像、昵称、今日互动状态

**互动（每类每日限制由服务端控制）**
| 动作 | type | 每日上限 | 经验 |
|---|---|---|---|
| 投喂 | `feed` | 1 | +20 |
| 摸摸 | `pet` | 5 | +10 |
| 抱抱 | `hug` | 3 | +15 |
| 打卡 | `checkin` | 1 | +10 |

- 连续守护：每日打卡累计；断签后按规则重置
- `POST /couple-api/pet/interact { type }`，返回最新宠物状态并广播 `pet_update`
- 页面 8~10s 轮询对账，保证对方操作后状态同步（WS 优先，轮询兜底）

**入口卡片**：悄悄话 / 我们的时光 / 我们的纪念日 / 侧耳倾听（带数量或倒计时副标题）

### 4.4 chat（悄悄话）

- 布局：顶部栏（对方头像/昵称/连接状态）+ 可滚动消息区 + 固定底部输入区
- 消息区使用 `scroll-view`，`flex: 1 1 0; height: 0; min-height: 0;`，输入框永不顶出屏幕
- 支持：
  - 文本发送（≤1000 字，内容安全）
  - 长按气泡菜单：复制 / 引用 / 撤回（自己且 2 分钟内）
  - 引用：输入框上方引用条，气泡内引用块；引用消息被撤回显示「消息已撤回」
  - 撤回：双方显示居中系统提示「你/TA 撤回了一条消息」
  - 时间分隔（>5 分钟）、新消息提示、自动滚底
- 实时：WS `message` / `message_recall`；每 8s 拉最近 50 条对账
- 服务端接口：`/messages`、`/messages/recent`、`/messages/:id/recall`、`/messages`（POST 支持 `reply_to`）

### 4.5 timeline（我们的时光）

- 顶部：双人头像、在一起天数、已记录条数
- 卡片：作者头像/昵称、时间、第 N 天徽章、正文、图片
- 图片排版：1 张整幅 / 2 张并排 / ≥3 张九宫格；点击全屏预览
- 下拉刷新 + 上拉加载更早（游标分页，10 条/页）
- 实时：WS `diary_new` / `diary_delete`；8s 对账
- 删除：仅自己的记录，长按/`···` → 确认 → `DELETE /diaries/:id`（同步删图片）
- 发布页（timeline-edit）：
  - 文本 ≤1000 字、图片 ≤9 张
  - 图片先 `wx.compressImage`（质量 72，超 1.15MB 再压一次），逐张 base64 上传
  - 发布成功返回并刷新列表
  - 内容安全：文字过 `msgSecCheck`；图片地址服务端校验真实存在

### 4.6 anniversary（我们的纪念日）

- 顶部：下一次纪念日倒计时（今天/还有 N 天）
- 自绘日历：
  - 月份切换（按钮 + 左右滑动）
  - 今天柔光描边、选中渐变、有纪念日的日期圆点
  - **日期下方宋体小字节日**：农历/公历节日 + 清明/母亲节/父亲节（见 `chinese-calendar.js`）
  - 点日期查看当日纪念日；点列表项自动跳到对应月份并选中下一次日期
- 列表：日期块、名称、每年/单次标签、下一次日期、倒计时；长按/`···` 编辑/删除
- 新增/编辑页：
  - 名称 ≤20 字、快捷标签（在一起/生日/第一次见面）
  - 内嵌日历选日期、「回到今天」、每年重复开关
  - 编辑时可删除
- 数据规则：
  - 日期必须真实存在（服务端校验 YYYY-MM-DD）
  - 每年重复按「下一次发生」计算；闰年 2/29 自动收敛到 2/28
  - 倒计时按北京时间（UTC+8）计算
- 页面动画：月份滑入、日期按压回弹、列表错峰入场、悬浮按钮浮动

### 4.7 listen（侧耳倾听 · 语音信箱）

**录音**
- 按住「按住 说话」：`RecorderManager.start({ duration: 60000, sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 24000, format: 'mp3' })`
- 最长 60 秒，自动停止并发送；上滑超过 60px 取消发送
- 录音浮层：环形脉冲动画、计时、进度条、「松开发送 · 上滑取消」
- 权限：`scope.record`；拒绝后弹窗引导去设置
- 结束后读 base64 上传：`POST /couple-api/voice { audio: dataURL }`
- 服务端用 **ffprobe** 校验真实时长（0.4s–60s），并校验大小/格式

**播放**
- `wx.createInnerAudioContext()`，`obeyMuteSwitch = false`（静音键下也播放）
- 同时只播一条；播放中波形逐条高亮，显示时长（如 0:07）
- 对方新语音实时推送，自动滚底；列表定时对账（10s）

**撤回**
- 长按自己的语音 → `POST /couple-api/voice/:id/recall`（2 分钟内）
- 双方显示「你/TA 撤回了一条语音」，URL 不再返回

**内容安全**
- 服务端异步调用 `mediaCheckAsync`（音频）
- 违规 → `hidden=1`，双方显示「未通过内容审核，已隐藏」；管理员仍可审计
- 疑似 → 标记 review，人工复核

**界面**
- 夜间电台风格：深蓝夜空、月光、星点、暖色气泡
- 录音浮层与底部录音栏固定布局，键盘/安全区适配

---

## 5. 工具模块

### 5.1 couple-api.js

| 方法 | 对应接口 | 说明 |
|---|---|---|
| `login / ensureLogin / getToken / clearToken` | `/login` | 登录与 token 管理 |
| `me` | `/me` | 当前用户 + 空间 + 宠物 + 各模块计数 |
| `saveProfile` | `/profile` | 昵称 + 头像（dataURL） |
| `createCouple / joinCouple / unbind` | `/couple/*` | 空间 |
| `getPet / interact / renamePet` | `/pet*` | 小火苗 |
| `listMessages / recentMessages / sendMessage / recallMessage` | `/messages*` | 悄悄话 |
| `uploadImage` | `/upload` | 时光图片 |
| `listDiaries / createDiary / deleteDiary` | `/diaries*` | 时光 |
| `listAnniversaries / createAnniversary / updateAnniversary / deleteAnniversary` | `/anniversaries*` | 纪念日 |
| `sendVoice / listVoices / recallVoice` | `/voice*` | 侧耳倾听 |
| `absUrl` | — | 相对路径补全为 `https://hhxpoint.me...` |

- 统一 `request()`：自动带 `Authorization: Bearer`、20s 超时、错误统一 `{code,msg}`、401 清 token
- 所有接口返回 `{ ok: true, ... }` 或 `{ ok: false, error }`

### 5.2 couple-ws.js

- 连接：`wss://hhxpoint.me/couple-ws?token=...`
- 心跳 25s；断线指数退避重连；页面隐藏/卸载时关闭
- `onStatus('online'/'offline')`、`onMessage(data)` 回调
- 事件类型见 [server.md](server.md#7-websocket-事件)

### 5.3 chinese-calendar.js

- 内置 1900–2100 农历数据表，公历 → 农历转换
- 节日识别（优先级从高到低）：
  元旦、春节、清明节、劳动节、端午节、中秋节、国庆节、除夕、元宵节、七夕、
  重阳节、腊八节、情人节、妇女节、青年节、儿童节、教师节、平安夜、圣诞节、母亲节、父亲节
- 除夕：农历一年最后一天（闰 12 月时处理闰月）
- 清明：21 世纪通用公式；母亲节/父亲节：某月第 N 个周日
- 已验证 2025–2035 春节、除夕、中秋、端午、清明等 25 个用例

---

## 6. 数据与缓存

| Key | 内容 | 说明 |
|---|---|---|
| `couple_token` | 服务端签名 token | 30 天有效；401 自动清除 |
| `couple_user` | 当前用户缓存 | 用于快速展示，服务端 /me 为准 |

- 服务端数据以 SQLite 为准，前端不做离线写队列
- 图片/语音 URL 为公开随机文件名（不可枚举），管理后台可审计

---

## 7. UI 设计约定

- 暖色渐变背景 `#fff9f4 → #ffe3dd`，卡片半透明白、圆角 32rpx、柔和阴影
- 主按钮：`linear-gradient(135deg, #ffb27a, #ff8a7a)`，高度 ≥ 88rpx
- 小火苗：纯 CSS 分层光影（外焰/内焰/核心、光晕、火星、表情），零图片资源
- 纪念日/节日小字：宋体系字体（iOS Songti SC / Android 衬线回退），字号 15–21rpx
- 侧耳倾听：夜间主题（深蓝 `#0d1122`），月光/星点、暖色气泡
- 动效统一使用 CSS animation，节奏轻柔（0.2–0.5s），不阻塞交互

---

## 8. 已知限制与后续规划

| 项 | 现状 | 建议 |
|---|---|---|
| 实时语音通话 | 未实现（避免 RTC 资质与复杂度） | 保持异步语音留言 |
| 时光图片内容安全 | 仅校验格式/大小/地址，未接 `mediaCheckAsync` | 可复用现有回调链路补图片审核 |
| 语音审核 | 已接微信 `mediaCheckAsync`（需消息推送配置） | 生产环境保持配置有效 |
| 纪念日提醒 | 无推送 | 可接微信订阅消息（需模板与用户订阅） |
| 多设备同步 | 依赖 WS + 轮询对账 | 正常；极端断网下以 `/me` 拉取为准 |
| 分享邀请测试 | 非开发者打开的是线上版本 | 需体验版 + 体验成员完成双人验证 |

---

## 9. 测试清单（上线前）

- [ ] 资料页：头像选择、昵称、保存、重新进入不再要求填写
- [ ] 绑定：创建 → 分享/邀请码 → 对方加入 → 双方进入 home
- [ ] 小火苗：四类互动、每日上限、连续守护、改名、双方同步
- [ ] 悄悄话：发送/接收、引用、2 分钟撤回、超时不能撤回、断线重连
- [ ] 时光：发图文（0/1/2/9 图）、预览、分页、删除、双方同步
- [ ] 纪念日：新建（含 2/29）、编辑、删除、倒计时、日历节日小字
- [ ] 侧耳倾听：60s 上限、上滑取消、播放/暂停、撤回、审核状态
- [ ] 内容安全：违规文本/语音被拦截或下架，后台状态正确
- [ ] 异常：无网络、拒绝麦克风权限、服务端 500 提示友好
- [ ] 编译：`miniprogram-ci` 编译通过，包体积在限制内

---

## 10. 相关文档

- 服务端与后台：[server.md](server.md)
- 发布与审核：[release.md](release.md)
- 变更历史：[../../changelog.md](../../changelog.md)
- 部署与运维：[../../ops/deployment.md](../../ops/deployment.md)
