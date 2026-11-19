# 你画我猜 · 测试与上线记录

> 日期：2026-11-19  
> 版本：1.32.7

## 1. 客户端静态检查

| 检查 | 结果 |
|---|---|
| `node --check draw-guess.js` | 通过 |
| `node --check couple-ws.js` | 通过 |
| `app.json` JSON 解析 | 通过；`packageCouple.pages` 已注册 `draw-guess` |
| WXML 标签结构 | 基础标签配对通过；最终以 DevTools 编译为准 |
| WXSS 花括号 | 98 / 98 配对 |
| 旧 `pictionary` 引用 | `app.json`、`app.js`、首页入口、旧子包均已移除 |

> 微信开发者工具已登录；1.32.0 / 1.32.1 预览编译通过并成功上传开发版。真机双人分享卡片仍需在微信客户端确认。

### 页面逻辑 Node smoke（mock wx）

- 加载真实 `draw-guess.js`，mock `wx` / socket
- `startGame()` → stage=playing、isDrawer=true、随机词与掩码正常
- 猜对处理 → `_guessed=true`、猜词方 +100、答案 reveal
- 远端 `round_start` → stage=playing、isDrawer=false、canGuess=true
- 结果：`SMOKE_OK`（无渲染层）

## 2. 服务端集成测试（远程临时实例）

测试文件：`answer-couple-server/tests/pictionary_ws.test.js`

- 启动真实 `src/app.js`，创建 SQLite 临时库
- 创建两个用户和同一个 space
- 两条真实 WebSocket 连接（token + space_id）
- A 发 `round_start` → B 收到
- B 发 `guess` → A 收到
- 事件带 `from` / `ts` / `payload.action`
- 非本空间不接收（服务端按 coupleId 广播）

结果：**6 passed, 0 failed**

## 3. 生产服务端

- 部署：`deploy.py` 上传 `src/ws.js`，`couple.service` active
- `https://hhxpoint.me/couple-api/health` → HTTP 200
- 远程 `src/ws.js` 包含 `type === 'pictionary'` 分支
- 未改动原有 REST/悄悄话/语音逻辑；pictionary 事件不落库

## 4. 手工验收清单（需已登录 DevTools + 两个体验成员）

- [ ] 首页「侧耳倾听」下面出现「你画我猜」
- [ ] 双方在同一关系空间；都显示 TA 在线
- [ ] 开始后画手看到词，猜词方只看到 `＿` 掩码和分类
- [ ] 画板颜色/大小/橡皮/撤销/清空
- [ ] 猜对 +100，下一回合交换画手
- [ ] 超时公布答案
- [ ] 5 回合结算：你赢了/TA 赢了/平局
- [ ] 再画一局 / 回到小火苗
- [ ] 切后台/断网重连不崩溃

## 5. 已知限制

- 词库在客户端（10 类 360+ 词）；关系双方可查看代码，不做防作弊加密。
- 服务端只做同一 couple 内广播，不做画布持久化；服务重启后当前局丢失，重新开局即可。
- 画布坐标归一化，双方不同机型比例可能略有差异，已按比例缩放。

## 6. 分享与等待按钮（1.32.1）

- [x] 1.32.7 预览编译通过并上传开发版
- [x] 分享封面 `assets/draw-guess-share.png`（1000×800）
- [x] 分享面板：画板预览 + 双人头像 + 只给你们俩看
- [x] `open-type="share"` 自定义按钮
- [x] 分享标题 / 路径 / 封面统一
- [x] 「等 TA 一起」：奶油虚线底 + 呼吸圆点，不再使用原生 disabled 灰按钮
- [x] 「开始画画」：暖橘渐变 + 流光 + 按压缩放
- [ ] 真机分享卡片实际显示（需微信客户端确认）
- [ ] 双人实际通过分享卡片进入页面

## 7. 画板修复（1.32.5）

- [x] 2D canvas 初始化改为独立 fields + boundingClientRect 查询
- [x] 节点未就绪自动重试
- [x] 重开一局/切换回合重建 canvas
- [x] 画布触摸坐标兼容 x/y 与 pageX/pageY
- [x] 画手本地即时绘制、远端 point 节流、完整 stroke 落库
- [x] 画板准备中提示
- [x] Node canvas smoke: CANVAS_SMOKE_OK
- [ ] 真机双端画线同步（需微信客户端确认）

