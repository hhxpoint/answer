# 小程序自动化冒烟（miniprogram-automator）

用微信开发者工具的自动化接口，在真机模拟器里逐页打开小程序并截图，用来替代「靠人点一遍」。

## 一、一次性准备（关键，漏了会以「RPC 全部超时」的假象出现）

```powershell
cd D:\dsh\workplace\work\answer\hhxpoint-answer-1848759
npm install                 # 项目 package.json 里有 crypto-js 等依赖
# 必须先用开发者工具构建一次 npm：
& 'D:\develop_tool\微信web开发者工具\cli.bat' build-npm --project <项目路径>
```

> `project.config.json` 里是 `"packNpmManually": true`，所以**输出目录 `miniprogram_npm` 要先存在**：
> 先 `mkdir miniprogram_npm` 再 `build-npm`，否则报 `miniprogram_npm not found`。

**为什么必须做**：`packageGithub/utils/tencent-translator.js` 里有
`require('../../miniprogram_npm/crypto-js/…')`。目录不存在时 IDE 编译失败，
模拟器停在欢迎页 → 自动化连得上 WebSocket 但**任何命令都不返回**（不是工具坏了）。

## 二、跑一次

```powershell
# 1) 先退出已有的开发者工具实例（避免 .cli 端口文件冲突）
& 'D:\develop_tool\微信web开发者工具\cli.bat' quit
Get-Process | Where-Object { $_.Path -like '*develop_tool*' } | Stop-Process -Force

# 2) 以自动化模式启动（端口任选未被占用的）
& 'D:\develop_tool\微信web开发者工具\cli.bat' auto --project <项目路径> --auto-port 9484 --trust-project

# 3) 等 40~60 秒后执行
node tools/wx-auto/smoke.js 9484
```

输出形如：

```text
PASS index           200571B pages/index/index
PASS trade-detail    114549B packageTrade/pages/detail/detail
...
pages 12 · pass 12 · fail 0
SMOKE_OK
```

## 三、判据与已知限制

- **判据**：截图字节数 ≥ 15KB 视为「渲染成功」。白屏截图约 2.5KB，正常页面 40~250KB。
  这是为了绕开本版本 automator 的 `page.$` / `page.waitFor` **会挂起**的问题。
- **路径校验**：通过 `mp.evaluate(() => getCurrentPages().map(p => p.route))` 取真实路由
  （`mp.currentPage()` 在本版本会返回陈旧页面，不可靠）。
- **跳过项**：`couple-home` / `couple-spaces` / `trade-share` 依赖 `hhxpoint.me` 接口，
  本机网络不通时会挂起，已标记 `optional` 并计为 SKIP，不影响退出码。
- 每次跑之前最好重启自动化实例：上一轮挂起的连接会把模拟器留在白屏状态。

## 四、常见故障对照

| 现象 | 原因 | 处理 |
|---|---|---|
| `connect` 成功但所有命令超时 | 模拟器没在跑（编译失败/欢迎页） | 检查是否漏了 `npm install` + `build-npm` |
| `LAUNCH_FAIL … EPERM … .cli` | 已有 IDE 实例占用端口文件 | 先 `cli quit` 并结束残留进程 |
| 全部页面 2546B | 上一轮把模拟器搞白屏 | 重启自动化实例后再跑 |
| `cliPath` 报错 | `automator.launch` 只接受可执行文件 | 用 `cli.bat auto` 手动起，再 `connect` |
