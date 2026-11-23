# 小火苗 · 五子棋对弈

> 版本 1.39.0 / 2026-11-23

## 定位

三种模式：本地双人、Rapfi 人机、在线双人；在线支持对局聊天，聊天与悄悄话共用消息流。

## 入口

`packageCouple/pages/home/home.wxml` → “五子棋对弈” → `/packageCouple/pages/gomoku/gomoku`

## 模式

- 本地双人：同一台手机轮流落子，不需要对方在线
- 人机：黑方玩家，白方 Rapfi 引擎；入门/进阶/挑战三档 `think_ms`
- 在线：复用 couple-ws，同一关系空间内实时同步

## AI 接口

```text
POST https://hhxpoint.me/api/gomoku-best-move
{"moves":["H8"],"think_ms":1200}
→ {"move":"G9"}
```

`think_ms` 可选，服务端限制 200–10000ms；未传时保持原 6000ms 行为。客户端另有本地启发式兜底，AI 网络失败也能落子。

## 对局聊天

- 复用悄悄话的 `api.recentMessages` / `api.sendMessage` 和 couple-ws `type:"message"`
- 在五子棋内发送的消息会立即出现在悄悄话；反过来也一样
- 不新建聊天表，不产生第二套会话

## 规则与状态

- 15 × 15 棋盘
- 黑先白后，横/竖/斜任意方向连成 5 子获胜
- 无禁手；棋盘满为和棋
- 双方同时点开始：以较小 starter_id 收敛
- 认输/离开大厅通过 `gomoku` 事件通知对方

## 实时协议

复用 `couple-ws.js`，只在同一 couple 空间广播：

```json
{"type":"gomoku","payload":{"action":"start|move|resign|sync_req|state|leave","game_id":"..."}}
```

- `start`：开局，starter_id 决定黑白
- `move`：x/y/c（行/列/颜色）
- `sync_req`：重连请求对方状态
- `state`：moves/starter_id/current/winner
- `resign`/`leave`

服务端 `src/ws.js` 只转发、不落库。

## UI

- 深色棋室背景 + 金色强调，学习象棋对弈的棋盘质感
- 木纹 Canvas 棋盘：细木纹、内框、星位、坐标
- 棋子径向渐变 + 阴影 + 高光，最后一手金色环
- 胜利连线金色发光
- VS 玩家卡、当前回合呼吸光、连接状态
- 结算层：黑/白/和棋印章 + 再来一局/回大厅

## 验证

- `GOMOKU_PAGE_OK`：本地交替、人机落子、回合恢复
- `GOMOKU_OK`：横/竖/斜五连、四子不胜、占用拒绝、棋盘重建
- `tests/gomoku_ws.test.js`：创建空间、双端连接、start/move 广播、事件结构 6/6
- 微信开发者工具预览编译通过
