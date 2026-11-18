# 文档索引（docs）

本目录是 `answer` 仓库的工程文档中心，目标是让任何人（包括未来的自己）能快速回答三个问题：

1. 这个项目有哪些模块？代码在哪里？
2. 「我们的小火苗」是怎么设计、怎么运行、怎么发布的？
3. 服务端、数据库、管理后台、内容安全、密钥分别怎么配置和运维？

---

## 阅读顺序（推荐）

```text
README.md（根目录）
  └─ docs/README.md（本页）
       ├─ docs/architecture.md            ← 先看整体架构与子包地图
       ├─ docs/modules/overview.md        ← 每个子包负责什么
       ├─ docs/modules/couple/README.md   ← 小火苗模块详解（核心）
       │    ├─ docs/modules/couple/server.md
       │    └─ docs/modules/couple/release.md
       ├─ docs/modules/recipe/README.md   ← 今天吃什么（纯本地菜谱）
       ├─ docs/ops/deployment.md          ← 服务端怎么部、怎么配
       ├─ docs/ops/runbook.md             ← 出问题怎么排查、怎么恢复
       ├─ docs/security.md                ← 密钥与安全红线
       └─ docs/assets-and-models.md      ← 哪些大文件不在仓库里
```

---

## 文档清单

| 文档 | 适用场景 |
|---|---|
| [architecture.md](architecture.md) | 新同学了解项目全局、子包划分、前后端通信方式 |
| [changelog.md](changelog.md) | 追溯某个版本改了什么、涉及哪些文件 |
| [modules/overview.md](modules/overview.md) | 快速定位某个功能在哪个子包 |
| [modules/couple/README.md](modules/couple/README.md) | 小火苗模块的产品设计、页面、数据结构、前端实现 |
| [modules/couple/server.md](modules/couple/server.md) | 服务端接口、SQLite 表、WebSocket、管理后台、内容安全 |
| [modules/couple/release.md](modules/couple/release.md) | 上传/预览/体验版/审核/隐私协议/发布检查单 |
| [modules/recipe/README.md](modules/recipe/README.md) | 「今天吃什么」纯本地菜谱：数据、检索、冰箱模式、图片许可与构建 |
| [ops/deployment.md](ops/deployment.md) | 服务器路径、systemd、nginx、环境变量、部署脚本 |
| [ops/runbook.md](ops/runbook.md) | 故障排查、日志、重启、磁盘内存清理、备份恢复 |
| [security.md](security.md) | 哪些东西绝对不能提交、密钥轮换、泄露处置 |
| [assets-and-models.md](assets-and-models.md) | 模型权重、npm 构建产物、私钥等被忽略文件如何恢复 |
| [dev-guides/](dev-guides/) | 历史模块开发调试记录（AR/TFJS/中药识别等） |

---

## 文档维护约定

- **每次功能上线，必须同时更新**：
  1. `docs/changelog.md`（版本 + 改动 + 涉及文件）
  2. 对应模块文档（页面/接口/数据结构有变化时）
- 提交信息采用 Conventional Commits 风格（`feat:` / `fix:` / `docs:` / `chore:`）
- 文档内不写真实密钥、密码、Token；统一用 `<在服务器 .env 中配置>` 占位
- 截图/大文件不要直接入库，放到发布资产或个人存储，并在文档中说明来源
