# 变更历史（Changelog）

> 本文件用于**回溯与追溯**：每次功能上线/修复/文档更新都在这里记录。
> 格式：版本 · 日期 · 类型 · 摘要 · 关键文件 · 验收方式。
>
> 说明：小程序通过 `miniprogram-ci` 上传开发版，版本号递增；「体验版/正式版」在微信公众平台人工设置。
> 服务端与后台的变更单独记录在本文件后部。

---

## 一、当前仓库同步（2026-11-17）

### 仓库维护

| 项目 | 内容 |
|---|---|
| 新增 | `.gitignore`：忽略依赖、构建产物、大模型、密钥、本地私有配置 |
| 整理 | 根目录历史开发文档移入 `docs/dev-guides/` |
| 新增 | `README.md`、`docs/**` 全套工程文档 |
| 调整 | `project.private.config.json` 从版本控制移除（保留本地文件，已被忽略） |
| 安全 | 移除代码中硬编码的腾讯云 API 密钥（翻译模块 3 个文件），改为空占位并注明必须服务端代理；**该密钥需在腾讯云控制台轮换** |
| 同步 | 将当前**全部**已开发但此前未入库的子包/页面/资源/依赖声明提交入库 |
| 删除 | 根目录与 `packagetoken` 重复的旧页面/词库文件（`pages/exam`、`pages/word`、`pages/algorithm`、`pages/detail`、`data/ky_408.js`、`utils/dictionary/*` 等）—— 这些功能的实现已迁移到 `packagetoken/` 子包中，删除的是主包里的重复副本 |

### 本次入库的模块（此前未提交到远端）

`packageCouple`、`packageAI`、`packageAR`、`packageAssets`、`packageDetect`、`packageFinance`、
`packageGame`、`packageGithub`、`packageJwzx`、`packageSport`、`packageWeather`、`packagepdf`、
`packagetoken`、`bitcoin`、`chess`、`course`、`particle`、`resume`、
`pages/loginscan`、`pages/user`、`components/xr-scene`、`utils/jwzx-api.js`、`utils/learning-center.js`、
新增静态资源（`assets/*.png`、`assets/couple-share.png`）、`package.json`、`package-lock.json`。

### 编译验证

- `miniprogram-ci getCompiledResult`：**通过**（260 个文件，编译结果 404 项，产物约 6.39MB）
- 发布版本：**1.26.0**（上传开发版）

---

## 二、小程序版本历史

### 1.32.7 · 2026-11-19 · 交换回合画布/输入残留修复

- 所有笔迹事件增加 `game_id + round`，交换回合后自动丢弃上一回合迟到事件
- 新回合强制清空画布、`roundReveal`、输入框
- 猜词栏在画手回合加 `hidden`，修复原生 input 幽灵残留
- 旧回合 `round_end/correct/guess` 事件做回合校验，避免覆盖新回合
- Node canvas smoke 继续通过

### 1.32.6 · 2026-11-19 · 画板坐标兼容兜底

- 触摸坐标在部分基础库返回页面坐标时，自动识别并减去画布 rect
- 不影响已正确返回 canvas 内坐标的机型
- Node canvas smoke 继续通过

### 1.32.5 · 2026-11-19 · 你画我猜画板可画/双端同步修复

- 修复 2D canvas 初始化：`fields` 与 `boundingClientRect` 分开查询，节点未就绪自动重试 10 次
- 画板显示「画板准备中」；首次进入/重开一局会重建 canvas，避免复用已销毁节点
- 触摸坐标兼容画布内坐标与 pageX/pageY；画手落笔立即绘制，移动线段 45ms 节流同步
- 画手完整笔画通过 `stroke` 落库到当前画布，猜词方按 `point/stroke/strokes` 重绘；断线 `sync_state` 拉回画布
- 新增 Node 画布 smoke：`CANVAS_SMOKE_OK`

### 1.32.4 · 2026-11-19 · 资料同步失败兜底

- 小火苗资料页自动带入失败时显示可编辑表单（不再停在错误提示页），可重新选头像/昵称保存
- 同步失败保留本地 dirty，不覆盖个人中心已修改资料

### 1.32.3 · 2026-11-19 · 全局资料离线修改保护

- 新增 `globalProfileDirty` 标记：个人中心保存后若服务端同步失败，下次 `onShow` 不会被服务端旧资料覆盖
- `syncFromServer` 在 dirty 时返回本地资料；`pushLocalProfile` 成功后清除 dirty
- 头像/昵称同步继续使用服务端 `openid` 唯一身份，不重复建号
- 文档补充离线草稿语义

### 1.32.2 · 2026-11-19 · 个人中心与小火苗全局资料同步

- 新增 `utils/global-profile.js`：以服务端 couple 用户（openid 唯一）为全局身份
- 个人中心注册后自动 `wx.login` → `/couple-api/profile`，小火苗首次资料页检测到完整资料直接进入，不重复选头像/昵称
- 小火苗资料页保存后回写本地 `userProfile`，个人中心 `onShow` 展示同一份资料
- 本地已有资料、服务端为空时，小火苗资料页自动带入并保存
- 防重复：in-flight 去重、服务端资料比对后跳过重复写、openid 唯一用户
- 失败兜底：本地先保存，网络恢复后 `onShow` 自动重试；401 自动重新登录
- 退出登录清理全局 token/资料，避免个人中心被立即回填
- 文档：`docs/global-profile.md`

### 1.32.1 · 2026-11-19 · 你画我猜分享画面与等待按钮升级

- 新增高级分享卡：`assets/draw-guess-share.png`（1000×800，治愈系手绘画板/爱心/调色盘）
- 分享面板：双人头像 + 小画板预览 + `open-type="share"` 自定义按钮；分享标题/路径/封面图统一
- 「等 TA 一起」改为真正的状态按钮：奶油底 + 虚线边 + 呼吸圆点，不再是原生 disabled 灰色按钮
- 「开始画画」按钮增加渐变、内高光、轻微流光与按压缩放
- 首页大厅增加「分享这块小画板」入口；结算页也增加分享入口

### 1.32.0 · 2026-11-19 · 你画我猜迁移进双人关系空间

- 新增：`packageCouple/pages/draw-guess`，入口在首页「侧耳倾听」下方
- 交互：同一关系空间两人实时画/猜，5 轮（可选 3/5/8），画手轮换、计时、计分、提示、结算
- 通信：复用 `wss://hhxpoint.me/couple-ws`，服务端只校验 token/空间成员并广播；没有房间号/大厅/陌生人
- 移除：旧的独立 `pictionary` 子包、应许之地入口、`hhxgo.tech` 房间创建逻辑
- 画板：`canvas type="2d"`，归一化坐标、45ms 线段节流、橡皮/撤销/清空、暖色治愈画笔
- 词库：10 类 360+ 词（食物/动物/日常/自然/交通/人物/建筑/娱乐/动作/节日）
- 文档：[docs/modules/couple/draw-guess.md](modules/couple/draw-guess.md)
- 已通过微信开发者工具预览/上传开发版 **1.32.0**（6.6MB，主包 681KB，packageCouple 505KB）
- 测试记录：[docs/modules/couple/draw-guess-test.md](modules/couple/draw-guess-test.md)

### 1.31.2 · 2026-11-18 · 小火苗改名点击修复
- 修复：首页点小火苗名字无反应/无法改名
- 根因：宠物卡片的 `.pet-ambient` 装饰光晕尺寸 540×430rpx，在 330rpx 高的 `.pet` 内向上溢出约 146rpx，覆盖了上方 `.pet-name` 的点击区域，且未设置 `pointer-events: none`，导致点击被装饰层拦截
- 修复：装饰层增加 `pointer-events:none`；名字区域提升层级并扩大点击区；提示文案也绑定改名
- 同时将 `wx.showModal({editable:true})` 改为**页面内自定义改名弹窗**，不依赖系统弹窗的 editable 兼容性，样式与小火苗暖色系统一致
- 版本：**1.31.2**（已上传 DevTools 开发版）

### 1.31.1 · 2026-11-18 · 小火苗界面协调性优化
- **侧耳倾听**：深色夜间主题改为暖白纸感 + 铜色语音气泡 + 珊瑚录音按钮，与悄悄话/首页统一
- **悄悄话**：连续消息只显示一次头像（增加透明占位保持对齐）；头像 76→64rpx；气泡字号/宽度/内边距收紧；发送状态移出 flex 行，避免被挤到气泡旁；顶栏加安全区
- **纪念日**：移除遮挡卡片的悬浮「＋ 添加纪念日」，改到「全部纪念日」标题栏右侧；标题顶部增加呼吸感
- **首页/关系大厅**：英文昵称标题自动显示为「和 Chrrich. 的小火苗」，避免中英粘连
- 逐页 DevTools 截图检查；编译 293 文件 / 产物约 8.22MB
- 详细记录：[docs/modules/couple/ui-refinement.md](modules/couple/ui-refinement.md)

### 1.31.0 · 2026-11-18 · 悄悄话延迟优化
- 客户端乐观发送：点击后立即出现「发送中」气泡、清空输入，服务端返回后替换；失败可重试
- 消息幂等：`client_msg_id` + 部分唯一索引，重试/并发不重复
- 聊天本地缓存：按空间缓存最近 50 条，进入先渲染缓存；`me` 与最近消息并行、WS 预连接
- WS 在线时停止 8s 轮询，断线才恢复；消息增量渲染/滚动优化
- 服务端：微信 API keep-alive、`msgSecCheck` 2 分钟短缓存、800ms 超时预算、消息幂等、慢请求/消息时序日志
- 数据迁移：`messages.client_msg_id` + 索引（`003_chat_idempotency`）；迁移前备份
- 验证：服务端 24 项测试通过；编译 293 文件 / 产物约 8.22MB
- 已上传开发版 **1.31.0**（使用微信开发者工具 CLI 上传，避开上传密钥 IP 白名单限制；上传包约 7.8MB）
- 详细说明：[docs/modules/couple/performance.md](modules/couple/performance.md)

### 1.30.0 · 2026-11-18 · 小火苗全界面定制分享
- 新增 9 张定制分享封面（800×640，暖白纸感/铜色火苗/编辑式排版/细线颗粒）
- 12 个小火苗页面全部接入分享：大厅/创建/加入/主页/绑定/悄悄话/时光/发布时光/纪念日/编辑纪念日/侧耳倾听/资料
- 分享文案按页面定制：大厅「和重要的人，一起养一只火苗」、悄悄话「有些话，只说给懂的人听」、时光「把今天，收进我们的时光」等
- 动态文案：主页显示小火苗等级/连续守护天数；纪念日显示下一个纪念日倒计时；独身空间显示邀请文案
- 分享路径统一带 `space` / 邀请码，避免落地空页面；新增 `utils/share.js` 统一封面/路径
- 封面资产约 285KB，`packageCouple` 约 0.45MB；编译 293 文件 / 产物约 8.22MB
- 设计说明：[docs/modules/couple/share-design.md](modules/couple/share-design.md)

### 1.29.2 · 2026-11-18 · 多关系空间
- 数据模型：`couples` 新增关系类型/标题/创建者/最近活跃；`couple_members` 新增身份标签/已读游标/置顶（加法式迁移）
- 新增空间服务：大厅列表、创建、加入、详情、修改、解除（需二次确认，双方删除）
- 新增 `resolveSpace` 中间件：`X-Space-Id` / `space_id` / 默认空间；非成员 403、不存在 404
- 旧接口兼容：`/me` 保留旧字段并新增 `spaces`；`/couple/create|join|unbind` 保持旧语义
- WebSocket 支持 `space_id`，事件带空间标识
- 限制：8 空间/用户、2 人/空间；创建/加入/退出限流；标签/标题内容安全
- 新增 `POST /couple-api/messages/read` 已读游标（大厅未读数）
- 服务端集成测试：22 项通过（创建/加入/多空间/越权/旧接口/解除/上限）
- 生产已迁移并开启 `MULTI_SPACE_ENABLED=1`；迁移前备份 `pre-multispace-consistent-*.db`
- 客户端新增关系空间大厅（`packageCouple/pages/spaces`）、创建/加入页、空间上下文与请求头、首页空间切换/关系标签、聊天已读
- UI：暖色玻璃卡片、关系色徽章（家人/恋人/朋友/自定义）、火苗摘要、未读/最近消息、空状态与骨架屏
- 管理：长按/「···」可设置关系类型与我的称呼、修改空间名、解除关系（二次确认）
- 小程序编译通过（292 文件 / 产物约 7.93MB），上传开发版 **1.29.2**（1.29.0/1.29.1 为中间版本）
- 详细说明：[docs/modules/couple/multi-space.md](modules/couple/multi-space.md)

### 1.28.0 · 2026-11-18 · 菜谱真实照片全量补齐
- 40 道菜谱**全部补齐真实照片**（Pexels 免费商用图 + 少量 Wikimedia CC/PD 图）
- 逐道人工筛选：主料/菜品匹配、构图与光线优先；统一裁切 4:3、调色、压缩为 600×450（约 35KB/张）
- 图片来源与许可页更新：40 条记录（Pexels License / CC、原图页链接、作者）
- 子包约 1.5MB（40 图 1.36MB + 数据/代码），仍低于 2MB 限制
- 少量家常菜为同菜系/做法的近似实拍图，已在来源页标注；后续可继续替换
- 构建工具补充：Pexels 图源采集（r.jina.ai 读取搜索页，无需 API key）、候选拼图、压缩装配脚本

### 1.27.0 · 2026-11-18 · 「今天吃什么」纯本地菜谱模块
- 新增独立子包 `packageRecipe`（5 个页面）：首页/详情/冰箱模式/收藏/图片来源
- 40 道家常菜结构化数据：食材、步骤、小贴士、分类、口味/场景标签
- 纯本地检索（无服务端/无大模型）：查询解析（食材/时间/口味/分类）+ 多路召回 + 规则排序
- 冰箱模式：勾选现有食材 → 匹配度、缺料提示（基础调料视为默认有）
- 本地收藏/历史/最近搜索（`wx.setStorage`，不跨设备）
- 图片：Wikipedia/Wikimedia Commons 许可图片 19 张（600×450 压缩），无合格图的菜谱使用统一设计封面；新增「图片来源与许可」页
- 构建工具：`tools/recipe-build/`（数据校验/构建、图片抓取与压缩；不打包）
- 首页新增「今天吃什么」入口卡片，与小火苗入口风格协调
- 包体积：子包约 0.73MB；整体编译 282 个文件 / 打包产物约 7.12MB（≤20MB）
- 已知限制：19/40 有真实照片；菜谱更新需发版；收藏不跨设备
- 详细说明：[docs/modules/recipe/README.md](modules/recipe/README.md)

### 1.26.0 · 2026-11-17 · 音频内容安全
- 接入微信 `mediaCheckAsync`：每条语音发送后自动异步审核
- 新增消息推送回调 `/couple-api/wx/callback`：支持明文/安全模式、JSON/XML
- 审核结果落库：`trace_id / check_status / check_label / hidden / checked_at`
- 违规语音自动下架，双方显示「未通过内容审核，已隐藏」；管理员后台可审计
- 关键文件：`packageCouple/pages/listen/listen.js|wxml`、`packageCouple/utils/couple-api.js`
- 服务端：`src/wx.js`、`src/app.js`、`src/db.js`（详见 server 文档）
- 验收：回调自测 12/12；真实语音回调约 10 秒内状态 `pending → pass`

### 1.25.0 · 2026-11-17 · 侧耳倾听（语音信箱）
- 新增独立子包页面 `packageCouple/pages/listen`
- 按住说话（最长 60 秒，自动停止发送）、上滑取消、录音浮层动效
- 音频 mp3、16kHz、24kbps；服务端 ffprobe 校验真实时长
- 语音消息播放（InnerAudioContext，静音键下也播放）、进度/波形高亮
- 支持 2 分钟内撤回；实时推送 + 10 秒对账
- 首页新增「侧耳倾听」入口，显示语音条数
- 后台新增语音面板：时长、发送人、播放器、下载、审核状态
- 关键文件：`packageCouple/pages/listen/*`、`packageCouple/utils/couple-api.js`、`app.json`、`pages/home/*`

### 1.24.0 · 2026-11-17 · 纪念日日历视觉与节日
- 新增 `packageCouple/utils/chinese-calendar.js`：1900–2100 农历转换 + 节日识别
  - 支持：春节、元宵、清明、端午、中秋、除夕、七夕、重阳、腊八、元旦、劳动节、国庆、情人节、妇女节、青年节、儿童节、教师节、平安夜、圣诞、母亲节、父亲节
  - 农历闰月、除夕判定、清明寿星公式、第 N 个周日计算
- 日历日期下方以宋体小字展示节日；今天/选中态自动适配颜色
- 月份切换滑入动画、日期按压回弹、列表错峰入场、FAB 浮动
- 修复页面底部背景色带（统一 `page` 底色与渐变结束色）
- 验收：25/25 节日日期用例通过（2025–2035 春节等）

### 1.23.1 · 2026-11-17 · 纪念日稳定性
- 修复纪念日页在 me 未缓存时的加载逻辑；完善空数据/冷却重试

### 1.23.0 · 2026-11-17 · 我们的纪念日
- 新增 `packageCouple/pages/anniversary`（日历 + 列表 + 倒计时）与 `anniversary-edit`
- 支持每年重复、单次日期、下一次日期与剩余天数、增删改
- 自绘月历：今天描边、选中渐变、可滑动翻月、点日期查看当日纪念日
- 首页新增入口与倒计时副标题
- 后台「纪念日」面板增加下一次日期与倒计时

### 1.22.0 · 2026-11-17 · 我们的时光
- 新增 `packageCouple/pages/timeline` 与 `timeline-edit`
- 图文记录：文本 ≤1000 字、最多 9 图；客户端压缩后逐张上传
- 时间线分页（10 条/页）、下拉刷新、图片大图预览、九宫格排版
- 实时推送新记录、删除同步；服务端图片校验与文件清理
- 后台「时光/相册」面板：缩略图 + 灯箱查看

### 1.21.1 · 2026-11-17 · 聊天布局修复
- 修复悄悄话消息区被内容撑高、输入框被顶出屏幕的问题
- `msg-list` 使用 `flex:1 1 0; height:0; min-height:0;` 内部滚动
- 输入区固定底部、键盘弹出自动收缩、安全区适配

### 1.21.0 · 2026-11-17 · 悄悄话增强
- 支持 2 分钟内撤回（双方同步系统提示）
- 支持引用对方消息回复（气泡内引用块，引用内容撤回后显示「消息已撤回」）
- 仿微信长按菜单：复制 / 引用 / 撤回；消息时间分隔、新消息提示
- 服务端新增消息撤回与引用字段；后台展示撤回与引用状态
- 验收：服务端 13/13 用例通过

### 1.20.0 · 2026-11-17 · 小火苗形象升级
- 小火苗改为分层材质：外焰/内焰/核心高光 + 环境光晕 + 内阴影 + 地面投影
- 新增火星粒子、呼吸/闪烁/脉冲动效、表情细节（眼神光/腮红/心情表情）
- 首页入口、绑定页小火苗同步统一；纯 WXSS 实现，无额外资源

### 1.19.0 · 2026-11-17 · 资料与小火苗自定义
- 首次进入强制设置微信昵称/头像（`chooseAvatar` + `type="nickname"`）
- 头像 base64 上传、服务端校验与旧头像清理；昵称内容安全检测
- 小火苗支持自定义名字（1–12 字），双方实时同步
- 首页/聊天/绑定页展示双方头像；后台展示头像与名字
- 验收：服务端 11/11 用例通过

### 1.18.0 · 2026-11-17 · 分享与视觉
- 分享邀请卡片（`onShareAppMessage` / `onShareTimeline` + 分享图）
- 邀请链接自动绑定；绑定页/首页视觉重做（玻璃卡、柔和渐变）
- 修复分包内 utils 引用问题，模块可用

### 1.17.2 · 2026-11-16 · 小火苗首个可用版
- 新增 `packageCouple` 子包：登录、创建/加入双人空间、小火苗主页、文字悄悄话
- 服务端 `couple-api` 上线：登录、空间、宠物、消息、WebSocket
- 首页新增「我们的小火苗」入口卡

---

## 三、服务端与后台变更（独立部署，不在本仓库代码内）

| 日期 | 变更 | 说明 |
|---|---|---|
| 2026-11-16 | `couple-api` v1 上线 | Node/Express/SQLite/ws；systemd `couple.service`；nginx `/couple-api`、`/couple-ws`、`/couple-admin` |
| 2026-11-16 | 独立管理面板 | `/couple-admin/` Basic Auth，只读展示用户/空间/宠物/消息/互动/打卡/时光/纪念日 |
| 2026-11-17 | OJ 管理后台子模块 | `/admin/couple/`：`couple_admin.py` + 深色模板，侧边栏「小火苗数据」；只读读取 SQLite |
| 2026-11-17 | 资料/头像/名字 | 新增 profile 接口、头像文件存储、宠物改名接口 |
| 2026-11-17 | 悄悄话撤回/引用 | 消息表加 `recalled/recalled_at/reply_to`；撤回 2 分钟窗口；引用校验 |
| 2026-11-17 | 时光相册 | `diaries` 表 + 图片上传/静态服务 + 删除清理；后台缩略图/灯箱 |
| 2026-11-17 | 纪念日 | `anniversaries` CRUD、每年重复、2/29 收敛、下一次/倒计时计算 |
| 2026-11-17 | 侧耳倾听 | `voice_messages` 表、语音上传/ffprobe 校验/静态 Range、撤回、后台播放器 |
| 2026-11-17 | 音频内容安全 | `mediaCheckAsync` + 消息推送回调（安全模式签名、AES 解密、JSON/XML）、违规下架、后台审核状态 |
| 2026-11-17 | 服务器清理 | 释放约 9GB（journal 4.1G→225M、pip 缓存 5.6G、npm 缓存、btmp 压缩），未重启业务服务，健康检查通过 |

> 服务端完整配置与接口见 [modules/couple/server.md](modules/couple/server.md)，
> 部署与运维见 [ops/deployment.md](ops/deployment.md) / [ops/runbook.md](ops/runbook.md)。

---

## 四、回溯方式

```bash
# 查看所有提交
git log --oneline --decorate

# 查看某版本涉及的提交/文件
git log --oneline -- packageCouple/

# 查看某个文件的完整变更历史
git log -p -- packageCouple/pages/listen/listen.js

# 对比两个版本
git diff <old-tag-or-commit> <new-tag-or-commit> --stat
```

建议发布时打 tag（见 [modules/couple/release.md](modules/couple/release.md)），
tag 名称与小程序版本号一致，例如 `v1.26.0`。
