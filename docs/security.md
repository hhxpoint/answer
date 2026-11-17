# 安全规范

> 本仓库是**公开仓库**，任何提交都可能被所有人看到。请把以下内容当作红线。

---

## 1. 绝对不能提交的内容

| 类型 | 示例 | 存放位置 |
|---|---|---|
| 小程序 AppSecret | 32 位密钥 | 服务器 `.env` / CI 环境变量 |
| 自定义登录密钥 | `TOKEN_SECRET` | 服务器 `.env` |
| 微信消息推送 Token / EncodingAESKey | `WX_MSG_TOKEN` / `WX_MSG_AES_KEY` | 服务器 `.env` + 公众平台 |
| 管理后台账号密码 | `ADMIN_USER` / `ADMIN_PASS` | 服务器 `.env`（面板 Basic Auth） |
| 服务器 SSH 密码/私钥 | — | 本地密码管理器 / `~/.ssh` |
| 上传/CI 私钥 | `private.wx*.key` | 本地 CI 目录（`tools/wx-ci/keys/`） |
| 其他私钥 | `*.pem`（如 `ed25519-private.pem`） | 本地安全目录 |
| `.env` / `.env.*` | — | 服务器 / 本地（已 gitignore） |
| 数据库/上传文件 | `app.db`、图片、语音 | 服务器（不入库） |

> 本仓库已通过 `.gitignore` 忽略上述文件，但**提交前仍需人工检查** `git status`。

---

## 2. 仓库中的安全约定

- `.gitignore` 覆盖：`node_modules/`、`miniprogram_npm/`、`*.zip`、`best.onnx/pt`、
  `project.private.config.json`、`*.pem`、`*.key`、`.env`、`.claude/`、日志/临时文件
- `project.private.config.json`：本机私有配置，已从版本控制移除（本地保留）
- 文档/示例中的密钥一律写成 `<在服务器 .env 中配置>` 占位
- 禁止在提交信息/Issue/PR 中粘贴密钥

---

## 3. 密钥清单与轮换

| 密钥 | 用途 | 轮换方式 |
|---|---|---|
| AppSecret | 登录/内容安全接口 | 公众平台重置 → 更新服务器 `.env` → 重启 couple → 更新 CI 环境 |
| `TOKEN_SECRET` | 自定义登录 token | 替换 `.env` → 重启 → 所有用户需重新登录（可接受维护窗口） |
| `ADMIN_PASS` | 独立面板 | 改 `.env` → 重启 couple |
| `WX_MSG_TOKEN` / `WX_MSG_AES_KEY` | 消息推送 | 先生成新值写入 `.env`，再同步公众平台消息推送并保存（注意验证期间回调需可用） |
| CI 上传私钥 | 上传小程序代码 | 公众平台重新生成密钥 → 替换本地 key 文件 |
| SSH 密码/私钥 | 服务器登录 | 修改系统密码/换 key，更新本地记录 |

> 轮换后务必验证：登录、消息推送回调、CI 上传、后台访问。

---

## 4. 已发生的风险与处置记录

| 时间 | 风险 | 处置 |
|---|---|---|
| 2026-11-17 | **代码中硬编码腾讯云 API 密钥**（`bitcoin/utils/translator.js`、`packageGithub/utils/tencent-translator.js`、`packageGithub/pages/translate/translate.js`） | 已改为空占位并禁止硬编码；**必须在腾讯云控制台吊销/轮换该密钥**；翻译能力后续改为服务端代理；该泄露版本未推送到远端（推送前被 GitHub Push Protection 拦截并重写历史） |
| 2026-11-17 | 本地 `Blog/.deploy_git` 的 remote URL 内嵌 GitHub token | **建议**：移除 remote 中的 token、在 GitHub 吊销并重新生成；不要复用该 token |
| 2026-11-17 | 工作区存在 `ed25519-private.pem` | 已加入 `.gitignore`，禁止入库；建议移出项目目录或删除 |

> ⚠️ **硬编码密钥补充说明**：小程序前端的任何密钥都会被打包分发给用户，等同公开泄露。
> 云服务（腾讯云/阿里云等）必须由**后端代理**调用，或使用后端签发的临时凭证；
> 前端只保存公开的 AppID/域名，不保存 Secret。

---

## 5. 代码与依赖安全

- 不引入来源不明的 npm 包；`package-lock.json` 锁定版本
- 第三方子包/资源注意许可证
- 小程序端不要把敏感逻辑放在前端（服务端校验为准）
- 上传文件校验：类型/大小/真实时长（音频用 ffprobe）/路径白名单
- 管理后台只读访问数据库，不可写入业务数据
- 服务器安全：
  - 仅开放必要端口（80/443/SSH）
  - 定期更新系统补丁
  - 管理后台使用强密码 + Basic Auth；不要暴露到非 HTTPS
  - 日志中避免打印完整 token/openid 等敏感信息

---

## 6. 内容安全与合规

- 文本：`msgSecCheck`；音频：`mediaCheckAsync` + 回调下架
- 隐私保护指引需声明：麦克风、相册/摄像头、位置、昵称头像等
- 功能描述避免「社交/交友/聊天室」等敏感词，强调「双人私密、无公开传播」
- 管理员后台保留完整审计能力（含已撤回/已下架内容）
- 建立违规处置台账（时间、内容、检测结果、动作、复核人）

---

## 7. 提交前检查清单

```bash
git status                     # 确认没有 .env / *.pem / *.key / token 文件
git diff --cached --stat       # 检查将提交的文件
grep -RIn "BEGIN PRIVATE KEY\|WX_SECRET\|ADMIN_PASS\|APP_SECRET" --exclude-dir=node_modules --exclude-dir=.git .
```

- [ ] 无密钥/密码/Token
- [ ] 无大文件（模型/压缩包/视频）
- [ ] 无本地路径/个人隐私
- [ ] 提交信息清晰（feat/fix/docs/chore）
- [ ] 文档同步更新（changelog + 模块文档）
