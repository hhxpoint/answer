# 大文件、模型与本地密钥（不在仓库中）

> 为了控制仓库体积、加快克隆速度、避免密钥泄露，以下文件被 `.gitignore` 排除。
> 本文说明它们是什么、放在哪里、如何恢复。

---

## 1. 被排除的文件

| 路径/类型 | 大小（约） | 用途 | 为什么排除 |
|---|---|---|---|
| `node_modules/` | 87.6 MB | npm 依赖 | 构建产物，可由 `npm install` 恢复 |
| `miniprogram_npm/` | 0.7 MB | 微信开发者工具构建的 npm 包 | 由 DevTools「构建 npm」生成 |
| `miniprogram_npm（ts).zip` | 1.4 MB | 历史打包 | 压缩包，不入库 |
| `tfjs-backend-cpu.zip` | 0.6 MB | TFJS 后端资源包 | 压缩包，不入库 |
| `best.onnx` | 12.3 MB | 目标检测模型（packageDetect） | 大模型权重，不入库 |
| `best.pt` | 24.5 MB | 模型训练检查点 | 大模型权重，不入库 |
| `ed25519-private.pem` / `ed25519-public.pem` | <1 KB | 历史实验密钥（当前代码未引用） | **私钥严禁入库** |
| `project.private.config.json` | <1 KB | 本机开发者工具私有配置 | 每台机器不同，DevTools 自动生成 |
| `.claude/` | — | 本地 AI 工具权限配置 | 本机私有 |
| `nul` | 102 B | Windows 特殊名残留文件 | 无效文件 |
| `*.zip` / `*.log` / `*.tmp` | — | 临时产物 | 不入库 |

---

## 2. 如何恢复

### 2.1 npm 依赖

```bash
npm install
# 然后用微信开发者工具：工具 → 构建 npm（生成 miniprogram_npm/）
```

- `package.json` 与 `package-lock.json` 已入库，可精确还原依赖版本
- 若 DevTools 构建 npm 报错，检查 `project.config.json` 的 `packNpmRelationList`

### 2.2 模型权重

- `best.onnx`：目标检测（`packageDetect`）使用的推理模型
- `best.pt`：训练检查点（体积大，日常运行不需要）
- 获取方式：
  1. 从本地训练输出目录复制
  2. 或从发布资产/对象存储下载（建议配套提供 SHA256 校验值）
- 放置位置：项目根目录（代码中按相对路径引用，具体见 `packageDetect/` 内注释）
- 注意：微信小程序的包体积限制，模型文件通常通过 CDN/下载方式加载，而不是放进主包

> 如确需把模型纳入版本管理，建议使用 **Git LFS**、GitHub Releases（资产）或对象存储，
> 不要直接 commit 进普通 git 历史。

### 2.3 私钥/CI 密钥

| 文件 | 说明 |
|---|---|
| `ed25519-private.pem` | 历史实验密钥，当前代码未使用；建议移出项目目录或删除 |
| `private.wx0c0dcd5aec680fb9.key` | 小程序 CI 上传私钥（通常在 `tools/wx-ci/keys/`，不在本仓库） |

- 上传私钥只放在本地 CI 目录，权限 600
- 不要提交、不要截图、不要通过聊天传输

### 2.4 project.private.config.json

- 删除本地文件后，重新用微信开发者工具打开项目会自动生成
- 已从版本控制移除；不同机器的 `libVersion`、编译设置可各自保留

---

## 3. 仓库体积参考

当前源码（不含上述排除项）入库后约 **10 MB 级别**，主包/分包编译产物约 **6 MB**（260 个文件）。

如需查看当前仓库对象体积：

```bash
git count-objects -vH
git ls-files | wc -l
```

---

## 4. 上传时 CI 的忽略规则（参考）

CI 编译/上传时会忽略：`node_modules`、`.git`、`.claude`、`.vscode`、`typings`、
`ml-modules`、`*.md`、`package-lock.json`、`package.json`、`jsconfig.json`、`.eslintrc.js`、
`best.pt`、`best.onnx`、`*.zip`、`nul` 等（见 CI 工具的 ignores 配置）。
这保证了仓库中没有大文件也能正常编译上传。

---

## 5. 安全提示

- 任何 `.pem`、`.key`、`.env`、`project.private.config.json` 都不应出现在 git 历史中
- 如已误提交：立即轮换密钥，并用 `git filter-repo` / BFG 清理历史
- 参见 [../security.md](../security.md)
