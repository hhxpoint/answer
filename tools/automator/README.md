# 小程序自动化冒烟（miniprogram-automator）

在开发者工具的真机模拟器里逐页打开小程序，做 **渲染 + 路由 + 数据** 三层断言，替代人工点一遍。

## 一、一条命令

```powershell
cd D:\dsh\workplace\tools\wx-auto
powershell -NoProfile -ExecutionPolicy Bypass -File .\run-smoke.ps1 -Port 9492
```

脚本会：退出旧实例 → 清残留进程 → `cli auto` 启动 → 等端口就绪 → 跑 `smoke.js` → 返回退出码。
**为什么每次重启**：automator 实例跑久了会退化（`reLaunch` 不报错但不跳转、`getCurrentPages()` 停在旧页面），
复用会得到「全部白屏」的假失败。

> `.ps1` 必须存成 **UTF-8 with BOM**，否则 Windows PowerShell 5.1 会按 ANSI 解析中文注释而报语法错误。

## 二、一次性准备（漏了会以「RPC 全部超时」的假象出现）

```powershell
cd <项目根>
npm install
mkdir miniprogram_npm            # project.config.json 是 packNpmManually: true，目录要先存在
& 'D:\develop_tool\微信web开发者工具\cli.bat' build-npm --project <项目根>
```

`packageGithub/utils/tencent-translator.js` 里有 `require('../../miniprogram_npm/crypto-js/…')`。
目录不存在 → IDE 编译失败 → 模拟器停在欢迎页 → 自动化连得上 WebSocket 但**任何命令都不返回**。

## 三、判定标准

| 层 | 判据 | 说明 |
|---|---|---|
| render | 截图 ≥ 15KB | 白屏约 2.5KB，正常页 40~260KB |
| route | `getCurrentPages()` 末位 = 期望路径 | 防止 reLaunch 没生效却「跑过了」 |
| data | 页面 `data` 语义断言 | 见下表；证明「内容加载成功」而不只是「页画出来了」 |

| 页面 | data 断言 |
|---|---|
| `trade-home` | `categories.length ≥ 3` |
| `trade-market` | `categories ≥ 3` 且 `listings` 是数组 |
| `trade-mylist` | `listings` 是数组 |
| `trade-publish` | `picking === true`（无 id 时进选型器） |
| `trade-estimate` | `model` 存在、`notFound !== true` |
| `trade-detail` | `model.model` 匹配 `Y9000P`、`specs.length > 0` |
| `recipe-home` | `results.length > 0` |
| `trade-sources` | 无 data（`sources.js` 是 `Page({})`，内容全在静态 WXML）→ 仅截图判定 |

## 四、结果读法

```text
pages 12 · PASS 9 · SKIP 3 · FAIL 0
```

- **SKIP** 是「没法在本机验」，不是通过：`couple-home` / `couple-spaces` / `trade-share` 依赖
  `hhxpoint.me` 接口与本机网络，本机连不上会挂起，已标记 `optional`。
- SKIP 不计入 PASS，也不影响退出码；但**别把 SKIP 当成绿**。

## 五、已知坑

| 现象 | 原因 | 处理 |
|---|---|---|
| 连上但所有命令超时 | 模拟器没在跑（编译失败/欢迎页） | 补 `npm install` + `build-npm` |
| `LAUNCH_FAIL … EPERM … .cli` | 已有 IDE 实例占用端口文件 | 先 `cli quit` + 结束残留进程 |
| 全部页面 2546B | 实例退化或上一轮挂起 | 用 `run-smoke.ps1` 重启实例 |
| `cliPath` 报错 | `automator.launch` 只接受可执行文件 | 用 `cli auto` 手动起再 `connect` |
| `page.$` / `waitFor` 挂起 | automator 0.13.0 + 当前工具版本 | 不用元素断言，改截图 + `mp.evaluate` |
