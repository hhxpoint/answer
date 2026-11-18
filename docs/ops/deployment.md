# 服务端部署与配置（全量）

> 面向：需要在服务器上重新部署、迁移或排查小火苗服务端时使用。
> 接口/数据库/后台细节见 [../modules/couple/server.md](../modules/couple/server.md)。
> 本文不包含真实密码/密钥，统一占位。

---

## 1. 服务器与域名

| 项 | 值 |
|---|---|
| 域名 | `https://hhxpoint.me` |
| 服务器 | Azure VM（Linux） |
| 公网入口 | nginx 80/443（HTTPS 证书由服务器现有方案管理） |
| 业务端口 | couple-api：`127.0.0.1:5011`（仅本机） |
| OJ 项目 | `/home/point/pro`（Flask，`myide.service`，端口 5001） |
| 小火苗服务 | `/home/point/couple`（Node，`couple.service`） |

> 域名合法域名（小程序端）：`hhxpoint.me` 已在 request / socket / download 合法域名中；
> 消息推送回调是普通 HTTPS，不需要额外域名。

---

## 2. 依赖环境

```bash
node -v          # v20.x
npm -v
ffprobe -version # 语音时长校验需要（ffmpeg 附带）
python3 --version
```

- Node 依赖：express、better-sqlite3、ws（见 `package.json`）
- 语音校验依赖系统 `ffprobe`（Ubuntu: `apt install ffmpeg`）

---

## 3. nginx 配置

在 `hhxpoint.me` 的 server 块中增加（已由部署脚本幂等 patch）：

```nginx
location /couple-api {
    proxy_pass http://127.0.0.1:5011;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 120s;
    client_max_body_size 10m;
}

location /couple-ws {
    proxy_pass http://127.0.0.1:5011;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;
}

location /couple-admin {
    proxy_pass http://127.0.0.1:5011;
    proxy_set_header Host $host;
}
```

**修改前必须备份**：

```bash
sudo cp /etc/nginx/sites-available/hhxpoint /etc/nginx/sites-available/hhxpoint.bak-$(date +%Y%m%d%H%M%S)
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. 目录与权限

```bash
sudo mkdir -p /home/point/couple/{data,uploads,backups}
sudo chown -R point:point /home/point/couple
chmod 755 /home/point/couple/{data,uploads,backups}
chmod 600 /home/point/couple/.env
```

- 服务以 `point` 用户运行
- `.env` 只允许 point 可读
- `uploads/` 由服务写入（头像/图片/语音）

---

## 5. 环境变量（.env）

```ini
PORT=5011
DB_PATH=/home/point/couple/data/app.db
UPLOAD_DIR=/home/point/couple/uploads
WX_APPID=wx0c0dcd5aec680fb9
WX_SECRET=<小程序 AppSecret，仅服务器持有>
TOKEN_SECRET=<随机 32 字节 hex>
ADMIN_USER=<独立面板用户名>
ADMIN_PASS=<独立面板强密码>
WX_MSG_TOKEN=<微信消息推送 Token，与公众平台一致>
WX_MSG_AES_KEY=<43 位 EncodingAESKey>
MULTI_SPACE_ENABLED=1   # 多关系空间开关：0=旧行为，1=启用空间大厅/ X-Space-Id
```

生成随机密钥示例：

```bash
openssl rand -hex 32   # TOKEN_SECRET / 面板密码
```

> 任何情况下不要把 `.env` 内容提交到仓库或粘贴到公开渠道。

---

## 6. systemd 单元

`/etc/systemd/system/couple.service`：

```ini
[Unit]
Description=Couple (XiaoHuoMiao) API Service
After=network.target

[Service]
Type=simple
User=point
WorkingDirectory=/home/point/couple
EnvironmentFile=/home/point/couple/.env
ExecStart=/usr/bin/node /home/point/couple/src/app.js
Restart=always
RestartSec=5
MemoryMax=220M
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable couple
sudo systemctl restart couple
sudo systemctl status couple --no-pager
```

---

## 7. 部署流程（脚本化）

仓库外的部署脚本（`deploy.py` 一类）按以下顺序执行，且具备幂等/回滚：

1. **上传代码**：`src/*`、`systemd/couple.service`、`deploy/patch_nginx.py`
2. **环境文件**：不存在则生成；存在则只追加缺失变量（不覆盖已有密钥）
3. **安装依赖**：`npm install --omit=dev`
4. **nginx**：备份 → 幂等 patch → `nginx -t` → `reload`
5. **systemd**：安装单元 → `daemon-reload` → `restart`
6. **健康检查**：
   - `http://127.0.0.1:5011/couple-api/health` = 200
   - `/couple-admin/` 未授权 = 401
7. **失败处理**：保留上一步备份，必要时回滚 nginx/systemd/代码

### OJ 管理后台子模块部署

单独脚本 `deploy_oj_admin.py`：

1. 上传 `couple_admin.py`、模板、校验脚本
2. 备份 `app.py`、`templates/admin/base.html`（仅首次保存原始版本）
3. 幂等补丁：import + 注册 blueprint + 侧边栏入口
4. 校验：`py_compile`、真实 import、模板假数据/真实数据渲染
5. 重启 `myide.service`（约 40s），验证 OJ 首页 200、后台正常、journal 无 traceback
6. 失败自动回滚并重启 OJ

---

## 8. 数据库与备份

- SQLite 文件：`data/app.db`（WAL 模式）
- 每日备份：crontab `10 4 * * *` 执行 `node src/backup.js`，保留 7 份
- 手动备份：

```bash
cd /home/point/couple
set -a; . ./.env; set +a
node src/backup.js
ls -lh backups/
```

- 恢复：停服务 → 替换 `data/app.db` → 启服务 → 验证（详见 runbook）

---

## 9. 验证清单

```bash
# 服务与端口
systemctl is-active couple
ss -lntp | grep 5011

# 接口
curl -s -o /dev/null -w 'health %{http_code}\n' https://hhxpoint.me/couple-api/health
curl -s -o /dev/null -w 'panel %{http_code}\n' https://hhxpoint.me/couple-admin/
curl -s -o /dev/null -w 'admin %{http_code}\n' https://hhxpoint.me/admin/couple/

# 日志
sudo journalctl -u couple -n 100 --no-pager
```

---

## 10. 迁移/换机注意

1. 新机安装 Node 20、ffmpeg、nginx、python3
2. 复制代码 + `.env`（安全传输）+ `data/` + `uploads/` + `backups/`
3. 恢复文件权限（point 用户）
4. 按本文配置 nginx / systemd
5. DNS 切换后验证 HTTPS、WebSocket（wss）、静态文件 Range
6. 小程序后台无需改域名（仍是 hhxpoint.me）
7. 新服务器公网 IP 需加入微信 AppSecret 的 IP 白名单，否则登录/内容安全接口会 40164
