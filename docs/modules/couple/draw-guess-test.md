# 你画我猜 · 测试与上线记录

> 日期：2026-11-19  
> 版本：1.32.0

## 1. 客户端静态检查

| 检查 | 结果 |
|---|---|
| `node --check draw-guess.js` | 通过 |
| `node --check couple-ws.js` | 通过 |
| `app.json` JSON 解析 | 通过；`packageCouple.pages` 已注册 `draw-guess` |
| WXML 标签结构 | 基础标签配对通过；最终以 DevTools 编译为准 |
| WXSS 花括号 | 98 / 98 配对 |
| 旧 `pictionary` 引用 | `app.json`、`app.js`、首页入口、旧子包均已移除 |

> 微信开发者工具当前处于**未登录/access_token missing** 状态，`miniprogram-ci`/CLI 无法上传体验版；已用 DevTools 打开项目并确认文件 watch 编译触发，最终真机/模拟器验收需在已登录的 DevTools 中完成。

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
