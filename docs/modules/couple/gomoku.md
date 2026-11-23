# 小火苗 · 五子棋对弈

> 版本 1.38.0 / 2026-11-23

## 定位

双人关系空间内的实时五子棋，不做大厅、不匹配陌生人、不做聊天/评论/支付。

## 入口

`packageCouple/pages/home/home.wxml` → “五子棋对弈” → `/packageCouple/pages/gomoku/gomoku`

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

- `GOMOKU_OK`：横/竖/斜五连、四子不胜、占用拒绝、棋盘重建
- `tests/gomoku_ws.test.js`：创建空间、双端连接、start/move 广播、事件结构 6/6
- 微信开发者工具预览编译通过
