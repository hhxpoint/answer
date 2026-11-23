# answer · 微信小程序

> 一个以「AI 学习助手 + 工具箱」为主，并内置「我们的小火苗」双人私密空间的微信小程序。
> 当前仓库快照：**2026-11-22**（小程序版本 **1.40.0**）

---

## 这个项目是什么

| 维度 | 说明 |
|---|---|
| 形态 | 原生微信小程序（WXML / WXSS / JavaScript），主包 + 20 个子包 |
| AppID | `wx0c0dcd5aec680fb9` |
| 主包页面 | 首页、搜索、刷题、计算、用户、扫码登录、关于、处理、情绪分析、情绪历史 |
| 主要能力 | 学习问答、题库/考试、AI 问答、AR、目标检测、PDF 工具、天气、棋类、运动、GitHub 资讯、教务查询等 |
| 特色模块 | **我们的小火苗**：双人绑定 + 虚拟小火苗 + 悄悄话 + 我们的时光 + 纪念日 + 侧耳倾听（语音信箱） |
| 多关系空间 | 一人可拥有多个双人关系空间（家人/恋人/朋友/自定义），大厅切换，每个空间独立小火苗与数据 |
| 新增模块 | **今天吃什么**：40 道家常菜、纯本地离线检索、冰箱模式、本地收藏（无服务端/无大模型） |
| 新增模块 | **二手估价**：68 款全品类行情 + 公开二手信息、真实配置、本地个人估价单、导出图片分享（无交易/无公开列表） |
| 服务端 | 独立 Node.js 服务（Express + SQLite + WebSocket），部署在 `hhxpoint.me` |
| 管理后台 | OJ Flask 管理后台的子模块 `/admin/couple/` + 独立备用面板 `/couple-admin/` |

---

## 快速开始

```bash
# 1. 安装依赖（可选，部分子包用到 npm 包）
npm install

# 2. 用微信开发者工具导入本目录（不要导入父目录）
#    - AppID 使用 wx0c0dcd5aec680fb9
#    - 如需 npm 包：工具 → 构建 npm（生成 miniprogram_npm，已被 .gitignore 忽略）

# 3. 编译预览
#    - 普通页面可直接预览
#    - 涉及分享邀请 / 语音 / 支付等能力时，需要真机 + 体验版
```

> ⚠️ `project.private.config.json` 是本机私有配置（已被 git 忽略），首次导入时开发者工具会自动生成。

---

## 目录结构（顶层）

```text
answer/
├─ app.js / app.json / app.wxss        # 小程序入口与全局配置
├─ pages/                              # 主包页面（10 个）
├─ packageCouple/                      # ★「我们的小火苗」双人空间（含悄悄话/时光/纪念日/侧耳倾听/你画我猜）
├─ packageRecipe/                      # ★「今天吃什么」纯本地菜谱（独立子包）
├─ packageTrade/                       # ★「游戏本二手估价」纯本地估价单（独立子包）
├─ packageAI/  packageAR/  packageDetect/
├─ packagepdf/ packageFinance/ packageSport/
├─ packageGame/ packageGithub/ packageJwzx/
├─ packageWeather/ packageAssets/
├─ packagetoken/                       # 刷题 / 单词 / 算法 / 考试
├─ chess/ bitcoin/ particle/
├─ course/ resume/ ml-modules/
├─ components/                         # 自定义组件（含 xr-scene）
├─ utils/                              # 公共工具（API 封装、学习中心等）
├─ assets/                             # 主包静态资源
├─ docs/                               # 📚 项目文档（本仓库重点维护）
├─ project.config.json                 # 开发者工具项目配置（入库）
└─ .gitignore
```

> 本仓库**不包含** `node_modules/`、`miniprogram_npm/`、模型权重（`best.onnx` / `best.pt`）、
> 私钥与 `.env` 等敏感文件，具体见 [docs/assets-and-models.md](docs/assets-and-models.md)。

---

## 「我们的小火苗」模块

这是本仓库最核心的自研模块，拥有独立文档：

- **模块详解**（页面、交互、数据流、UI 设计、测试）：[docs/modules/couple/README.md](docs/modules/couple/README.md)
- **多关系空间**（关系大厅/创建/加入/切换/数据隔离）：[docs/modules/couple/multi-space.md](docs/modules/couple/multi-space.md)
- **服务端与后台**（接口、数据库、部署、内容安全、运维）：[docs/modules/couple/server.md](docs/modules/couple/server.md)
- **发布与审核**（CI 上传、版本号、审核措辞、隐私协议）：[docs/modules/couple/release.md](docs/modules/couple/release.md)

功能一览：

| 功能 | 说明 |
|---|---|
| 双人绑定 | 微信昵称/头像、邀请码/分享卡片绑定，双方唯一空间 |
| 小火苗 | 虚拟宠物：等级、经验、连续守护、心情、饱腹；投喂/摸摸/抱抱/打卡；自定义名字 |
| 悄悄话 | 双人文字消息，支持引用、2 分钟内撤回、实时推送、断线对账 |
| 我们的时光 | 图文相册/时间线，最多 9 图，分页、实时同步、删除 |
| 我们的纪念日 | 自绘日历、农历/公历节日小字、每年重复、倒计时、增删改 |
| 侧耳倾听 | 双人语音信箱：按住说话（最长 60 秒）、撤回、实时播放、内容安全审核 |
| 分享 | 9 张定制封面 + 按页面定制文案，覆盖小火苗全部界面 |

---

## 「今天吃什么」菜谱模块（纯本地）

独立子包 `packageRecipe`，**不依赖服务端、不接大模型、断网可用**：

- 40 道家常菜结构化数据（食材/步骤/小贴士/分类/标签）
- 本地检索：菜名、食材、时间、口味、分类；无网络请求
- 冰箱模式：勾选现有食材 → 匹配度、缺料提示
- 「今晚吃这个」随机推荐、本地收藏/历史/最近搜索
- 照片来自 Pexels（免费商用）与 Wikipedia/Commons（CC/PD，带许可记录），40 道全部有真实照片
- 模块文档：[docs/modules/recipe/README.md](docs/modules/recipe/README.md)

> 收藏存 `wx.setStorage`，不跨设备；纯本地意味着新增菜谱需要发版。

---

## 文档导航

| 文档 | 内容 |
|---|---|
| [docs/README.md](docs/README.md) | 文档总索引与阅读顺序 |
| [docs/architecture.md](docs/architecture.md) | 整体架构、子包地图、前后端数据流、设计规范 |
| [docs/global-profile.md](docs/global-profile.md) | **全局个人资料同步（个人中心 ↔ 小火苗）** |
| [docs/changelog.md](docs/changelog.md) | **按版本记录的详细变更历史（可回溯）** |
| [docs/modules/overview.md](docs/modules/overview.md) | 20 个子包的职责与状态 |
| [docs/modules/recipe/README.md](docs/modules/recipe/README.md) | 纯本地菜谱模块详解（数据/检索/冰箱/图片许可） |
| [packageTrade/README.md](packageTrade/README.md) | 游戏本二手估价模块（数据/算法/隐私/测试） |
| [docs/modules/couple/README.md](docs/modules/couple/README.md) | 小火苗模块详解 |\n| [docs/modules/couple/gomoku.md](docs/modules/couple/gomoku.md) | 五子棋对弈（实时协议/UI/测试） |
| [docs/modules/couple/server.md](docs/modules/couple/server.md) | 服务端、接口、数据库、后台、内容安全 |
| [docs/modules/couple/release.md](docs/modules/couple/release.md) | 发布流程、审核注意事项、隐私合规 |
| [docs/ops/deployment.md](docs/ops/deployment.md) | 服务端部署与配置全量说明 |
| [docs/ops/runbook.md](docs/ops/runbook.md) | 运维手册（排障、重启、磁盘/内存、备份恢复） |
| [docs/security.md](docs/security.md) | 密钥管理、禁止入库清单、泄露处置 |
| [docs/assets-and-models.md](docs/assets-and-models.md) | 大文件/模型/密钥的存放与恢复方式 |
| [docs/dev-guides/](docs/dev-guides/) | 各子模块开发调试记录（AR、TFJS、中药识别等） |

---

## 版本与分支

- 默认分支：`main`（稳定可发布分支）
- 版本号：`1.x.y`，每次上传开发版递增；对外发布以微信后台「体验版/正式版」为准
- 当前模块版本：**1.33.1**
- 历史版本与每次改动明细：[docs/changelog.md](docs/changelog.md)

---

## 安全与合规（重要）

- **禁止把以下内容提交到仓库**：`.env`、AppSecret、私钥（`*.pem` / `*.key`）、
  微信消息推送 Token/AESKey、管理后台密码、`project.private.config.json`
- 语音/图片/文字均接入内容安全（详见 [docs/modules/couple/server.md](docs/modules/couple/server.md)）
- 隐私保护指引需声明：麦克风、相册、位置、摄像头等实际使用的权限

详见 [docs/security.md](docs/security.md)。

---

## License

ISC（见 `package.json`）。仓库内第三方子包/资源版权归各自作者所有。
