# 运维手册（Runbook）

> 目标：出问题时按顺序排查，**先恢复服务、再定位原因、最后复盘**。
> 所有删除/重启操作前先确认影响范围，能备份的先备份。

---

## 0. 通用排查顺序

```text
1) 服务是否在跑？      systemctl is-active nginx myide couple
2) 端口是否监听？      ss -lntp | grep -E '5001|5011|443'
3) 本地接口是否 200？  curl http://127.0.0.1:5011/couple-api/health
4) 公网是否 200？      curl https://hhxpoint.me/couple-api/health
5) 日志有没有报错？    journalctl -u couple -n 200 / -u myide -n 200
6) 磁盘/内存是否够？   df -h / ; free -h
```

---

## 1. OJ 主站 502 / myide.service 异常

**现象**：`https://hhxpoint.me/` 502、后台打不开。

**处理**：

```bash
sudo systemctl status myide --no-pager
sudo journalctl -u myide -n 200 --no-pager
sudo systemctl restart myide
# 等待约 40s（服务启动较慢）
for i in $(seq 1 40); do sleep 3; ss -lntp | grep -q ':5001' && break; done
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5001/
```

**历史故障参考**：曾因 `ExecStart` 指向错误 Python 导致启动失败（已修复为 `/home/point/pro/venv/bin/python /home/point/pro/run.py`）。修改 systemd 单元前先备份。

---

## 2. 小火苗接口 502 / couple.service 异常

```bash
sudo systemctl status couple --no-pager
sudo journalctl -u couple -n 200 --no-pager
sudo systemctl restart couple
sleep 3
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5011/couple-api/health
```

常见原因：
- `.env` 缺失/权限不对（600，point 可读）
- 端口被占用（`ss -lntp | grep 5011`）
- 数据库路径不存在（`data/app.db`）
- 依赖丢失（`npm install --omit=dev`）

---

## 3. WebSocket 连不上（悄悄话/小火苗不同步）

排查：
1. nginx `/couple-ws` 是否配置 `Upgrade` / `Connection: upgrade`
2. 小程序 socket 合法域名是否包含 `wss://hhxpoint.me`
3. token 是否过期/被 401 清理
4. 后端日志是否出现连接拒绝

```bash
# 本机验证 WS 端口可连
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://127.0.0.1:5011/couple-ws 2>&1 | head -20
```

前端有 10s 轮询兜底，即使 WS 短暂中断也能同步数据。

---

## 4. 微信登录失败（40029 / 40164）

| 错误 | 原因 | 处理 |
|---|---|---|
| `40029 invalid code` | code 已使用/过期 | 重新 `wx.login` |
| `40164 invalid ip` | 服务器公网 IP 不在 AppSecret IP 白名单 | 到公众平台「开发管理 → 开发设置 → 服务器域名/IP 白名单」添加服务器 IP |
| `40125 invalid appsecret` | AppSecret 错误/被重置 | 更新服务器 `.env` 并重启 |
| 内容安全接口异常 | access_token/白名单问题 | 检查日志、IP 白名单；接口异常时业务 fail-open |

---

## 5. 语音播放失败 / 听不到

按顺序检查：
1. 静态 URL 是否可访问：

```bash
curl -I https://hhxpoint.me/couple-api/files/voices/<文件名>
# 期望 200/206，Content-Type audio/mpeg，Accept-Ranges: bytes
```

2. 小程序端 `downloadFile` 合法域名是否包含 `https://hhxpoint.me`
3. 该语音是否已撤回/违规下架（此时接口不再返回 URL，属正常）
4. 手机是否静音键开启（前端已设置 `obeyMuteSwitch=false`，正常应能播）

---

## 6. 语音审核长期 pending / 未下架

**排查顺序**：

1. 公众平台「消息推送」是否启用，URL 是否为
   `https://hhxpoint.me/couple-api/wx/callback`
2. Token / EncodingAESKey 是否与服务器 `.env` 一致
3. nginx 是否收到微信 POST：

```bash
sudo grep 'POST /couple-api/wx/callback' /var/log/nginx/access.log | tail -5
# 期望 200
```

4. 服务日志是否有「签名校验失败 / 未找到 trace_id」：

```bash
sudo journalctl -u couple --since '30 minutes ago' --no-pager | grep 'wx callback'
```

5. 数据状态：

```bash
cd /home/point/couple
node -e "const db=require('./src/db');console.log(db.all('SELECT id,check_status,trace_id,hidden,checked_at FROM voice_messages ORDER BY id DESC LIMIT 5'))"
```

常见原因：
- 消息推送未保存/未生效（保存后约 5 分钟生效）
- 签名算法/加密方式不匹配（服务端已兼容 明文/安全模式 + JSON/XML）
- `mediaCheckAsync` 调用失败 → 状态 `skipped`，检查 access_token 与 IP 白名单

> 审核结果由微信异步推送，正常几秒到几分钟；超过 10 分钟仍 pending 可标记人工复核。

---

## 7. 内容安全误判/投诉

1. 后台查看 `check_status / check_label / trace_id`
2. 如为误判：
   - 人工复核后可临时放行（修改 DB 需谨慎，建议先在后台记录）
   - 观察是否模型/标签误判，必要时调整展示文案
3. 建立台账：时间、用户、内容、检测结果、处置动作、复核人（合规要求）

---

## 8. 磁盘空间不足

**先看现状**：

```bash
df -h /
sudo du -xh --max-depth=1 /home /var 2>/dev/null | sort -hr | head
```

**可安全清理（按顺序）**：

```bash
# 1) journal（保留 200MB）
sudo journalctl --vacuum-size=200M

# 2) pip 下载缓存
sudo rm -rf /home/point/.cache/pip /root/.cache/pip

# 3) npm 缓存
sudo -u point env HOME=/home/point npm cache clean --force

# 4) 部署临时文件
sudo rm -f /tmp/patch_*.py /tmp/*.bak-couple /tmp/validate_templates.py

# 5) 页缓存（安全）
sync; sudo sh -c 'echo 1 > /proc/sys/vm/drop_caches'
```

**严禁删除**：
- `/home/point/pro`（OJ 代码/模型）
- `/home/point/.cache/huggingface`、`/home/point/.cache/chroma`
- `/home/point/couple/data`、`uploads`、`backups`
- 数据库/上传文件

---

## 9. 内存紧张

```bash
free -h
ps -eo pid,rss,comm,args --sort=-rss | head -10
```

- `couple.service` 已限制 `MemoryMax=220M`，实际 RSS 约 30–80MB
- 主要内存占用来自 OJ（Python/模型）
- **不要 `swapoff`**（可能导致服务 OOM）
- 如需重启 OJ 释放内存：选择低峰期，重启约 40s 不可用，重启后验证 200
- 不要杀进程强杀，优先 systemctl restart

---

## 10. 数据库异常 / 数据损坏

```bash
cd /home/point/couple
set -a; . ./.env; set +a
node -e "const db=require('./src/db');console.log(db.get('PRAGMA integrity_check'))"
```

- `ok` → 正常
- 异常 → 停服务，用最新备份恢复；保留损坏文件用于分析
- WAL 文件异常：停服务后保留 `-wal/-shm` 再排查，不要手删

恢复步骤见 [deployment.md](deployment.md#8-数据库与备份) 与下方备份恢复。

---

## 11. 备份与恢复

**每日自动备份**：04:10，保留 7 份，目录 `backups/`。

**手动备份**：

```bash
cd /home/point/couple
set -a; . ./.env; set +a
node src/backup.js
```

**恢复**：

```bash
sudo systemctl stop couple
cd /home/point/couple
cp data/app.db data/app.db.before-restore-$(date +%Y%m%d%H%M%S)
cp backups/<最新备份>.db data/app.db
sudo chown point:point data/app.db
sudo systemctl start couple
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5011/couple-api/health
```

> 图片/语音在 `uploads/`，不在数据库备份内；完整恢复需同步备份该目录。

---

## 12. 证书/HTTPS 异常

- 检查证书有效期：`sudo openssl x509 -in /etc/letsencrypt/live/hhxpoint.me/fullchain.pem -noout -dates`（路径以实际为准）
- 续期：按服务器现有 certbot 方案执行，完成后 `nginx -t && systemctl reload nginx`
- 小程序/微信侧如提示证书问题，先确认公网证书链完整（`openssl s_client -connect hhxpoint.me:443`）

---

## 13. 密钥泄露应急

1. **立即轮换**：AppSecret、`TOKEN_SECRET`、`ADMIN_PASS`、`WX_MSG_TOKEN`、`WX_MSG_AES_KEY`（后两者需与公众平台同步更新）
2. 清理泄露位置（仓库/聊天/日志/截图）
3. 若已提交到 git 历史：使用 `git filter-repo` / BFG 清理并强推，通知协作者重新克隆
4. 检查异常登录/请求日志，评估影响面
5. 记录事件与处置过程

详见 [../security.md](../security.md)。

---

## 14. 日常巡检建议（每周）

- [ ] 三个服务 active；公网接口 200
- [ ] 磁盘剩余 > 20%，内存/swap 无异常增长
- [ ] 备份存在且可读（至少抽查一次恢复演练）
- [ ] `journalctl` 无持续 error/traceback
- [ ] 语音审核回调正常（检查最近 voice 的 check_status 是否为 pass）
- [ ] 管理后台可登录，数据展示正常
- [ ] 二手市场：`/trade-api/health` 200、待审队列无长时间积压、举报数无异常激增

---

## 15. 二手市场（trade-api）异常

### 15.1 接口 502 / 发布失败

`/trade-api` 与 `/couple-api` 是同一个 Node 进程，先按第 2 节排查 `couple.service`：

```bash
curl -s -o /dev/null -w 'trade %{http_code}\n' http://127.0.0.1:5011/trade-api/health
sudo journalctl -u couple -n 120 --no-pager | grep -i trade
```

若只有 `/trade-api` 是 404/502，检查 nginx 的 `location /trade-api` 是否还在、`nginx -t` 是否通过。

### 15.2 发布后公开浏览看不到

这是**设计如此**：新发布是 `pending`，必须人工审核成 `approved`。检查：

```bash
cd /home/point/couple
node -e "const d=require('better-sqlite3')('data/app.db',{readonly:true});
console.log(d.prepare('select id,status,title,created_at from trade_listings order by id desc limit 10').all());"
```

审核（三选一）：

```text
① 浏览器：https://hhxpoint.me/admin/trade/   ← 推荐，OJ 管理员登录即可
② 浏览器：https://hhxpoint.me/couple-admin/trade   ← 小火苗后台 Basic Auth
③ 命令行：python tools/trade_review.py list / approve <id> / reject <id> / hide <id>
```

`/admin/trade/` 打不开时的排查顺序：

```bash
# a. 蓝图是否注册（app.py 应有 trade_admin_bp 的 import 与 register）
grep -n 'trade_admin_bp' /home/point/pro/app.py
# b. 侧栏入口是否在
grep -n 'trade_admin.index' /home/point/pro/templates/admin/base.html
# c. 重启后是否有导入/渲染异常
sudo journalctl -u myide -n 80 --no-pager | grep -iE 'traceback|trade'
# d. 仅 302/308 是正常的（未登录 → 跳登录页；少了末尾斜杠 → Flask 308）
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5001/admin/trade/
```

审核动作写不进去（页面提示「操作失败」）时，按顺序查：

```bash
# 1. token 是否可读（OJ 从 couple 的 .env 读取）
sudo grep -c '^TRADE_ADMIN_TOKEN=' /home/point/couple/.env
# 2. trade-api 是否活着
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5011/trade-api/health
# 3. 非破坏性探针：应返回「内容不存在」而不是「没有审核权限」
sudo /home/point/pro/venv/bin/python /tmp/trade_selfcheck.py
```

> 注意：OJ 的 `SECRET_KEY` 每次启动随机生成，`systemctl restart myide` 后所有管理员需重新登录。

### 15.3 上传图片失败

- 客户端限制：单张 ≤1.5MB、png/jpg/webp、最多 6 张、40 次/分；
- nginx `client_max_body_size` 需 ≥ 3MB（当前 25m）；
- 文件落在 `uploads/trade/`，检查磁盘与权限（point 可写）。

### 15.4 举报处理

```bash
cd /home/point/couple
node -e "const d=require('better-sqlite3')('data/app.db',{readonly:true});
console.log(d.prepare('select id,title,report_count,status from trade_listings where report_count>0 order by report_count desc limit 20').all());"
```

**阈值自动隐藏（1.41.2 起）**：`TRADE_REPORT_THRESHOLD`（默认 3，`.env` 可改，0 = 关闭）；
达到阈值且状态为 `approved` 时会自动变 `hidden`，说明写「系统自动隐藏：举报达到 N 次，等待人工复核」。

复核：

```bash
# 看某条的全部审计（人工 + 系统）
node -e "const d=require('better-sqlite3')('data/app.db',{readonly:true});
console.log(d.prepare('select * from trade_review_logs where listing_id=? order by id desc').all(<id>));"
```

- 误举报 → 后台点「通过并公开」（或 `python tools/trade_review.py approve <id>`）恢复；
- 确实违规 → 点「驳回」并写说明，发布者在「我的发布」能看到原因；
- 审计行随发布删除一并清理（`delete from trade_review_logs where listing_id=...` 由服务端自动做）。

### 15.5 清理测试/脏数据

```bash
# 删除某条发布（作者在端内删除会同时清图片与举报；后台手动删需自己清文件）
node -e "const d=require('better-sqlite3')('data/app.db');
const r=d.prepare('select images from trade_listings where id=?').get(<id>);
d.prepare('delete from trade_reports where listing_id=?').run(<id>);
d.prepare('delete from trade_listings where id=?').run(<id>);
console.log('deleted', <id>, r);"
rm -f /home/point/couple/uploads/trade/<文件名>
```
