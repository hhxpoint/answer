# 全局个人资料同步（个人中心 ↔ 小火苗）

> 目标：只填一次微信头像 + 昵称，个人中心和小火苗共用同一份资料；任何一边更新，另一边自动同步；不重复建号。

## 1. 单一身份

- 服务端：`https://hhxpoint.me/couple-api`
- 身份：`wx.login` 的 code → 服务端 `users.openid`（唯一）
- 本地缓存键：
  - `userProfile` / `userFirstRegisterAt`：个人中心展示
  - `couple_token` / `couple_user`：服务端登录态
  - `couple_space_id` / `couple_spaces_cache`：当前关系空间
- 同步模块：`utils/global-profile.js`

## 2. 流程

### A. 个人中心先注册
1. `pages/user` 选择微信头像、微信昵称
2. 本地立即保存 `userProfile`
3. `globalProfile.pushLocalProfile()`：
   - `wx.login` → `POST /couple-api/login`
   - `GET /me` 判断服务端是否已有资料
   - 头像转 base64 → `POST /couple-api/profile`
4. 服务端返回 `user.id / nickname / avatar`，回写本地 `userProfile`
5. 进入小火苗：`packageCouple/pages/profile` 检测服务端已有完整资料 → 直接 `goNext()`，不重复要求

### B. 小火苗先填写
1. `packageCouple/pages/profile` 保存 → 服务端 `/profile`
2. `globalProfile.acceptServerUser(res.user)` 同步写本地 `userProfile`
3. 回到个人中心 `onShow` 读取同一份 `userProfile`，显示相同头像/昵称

### C. 个人中心已有本地资料，但服务端没有
- 小火苗 profile 页检测到本地 `userProfile` 完整
- 自动调用 `pushLocalProfile()` 把本机资料带到服务端，成功则直接进入 home
- 失败才显示表单，并用本地昵称/头像预填

## 3. 防重复与可靠性

- **openid 唯一**：不会重复创建用户
- **in-flight 去重**：`syncPromise`，并发 `onShow`/提交只发一个同步请求
- **先比较后写**：服务端 nickname/avatar 与本地一致时不重复 `POST /profile`
- **头像统一**：本地临时路径读成 base64 上传；服务端返回 `/couple-api/files/avatars/...` 后本地改存绝对 URL
- **失败不丢本地**：网络失败保留本地 `userProfile`，并置 `globalProfileDirty`；下次 `onShow` 先重试上传，避免被服务端旧资料覆盖
- **成功后清脏**：`acceptServerUser` / `pushLocalProfile` 成功后清除 dirty
- **token 失效**：401 清 token → 重新 `wx.login` → 重试请求
- **退出登录**：`clearSession()` 清本地资料 + token + 空间缓存，并设置 `globalProfileLoggedOut`，避免个人中心立刻被自动回填
- **重新登录**：小火苗 `couple-api` 登录成功或已有 token 时清除该标记

## 4. 验证

- 服务端集成测试：`answer-couple-server/tests/profile_sync.test.js`
  - A 保存资料 → `/me` 读同一份
  - B 保存自己的资料 → A 不被覆盖、不新增用户
  - A 只改昵称 → 头像保留、用户 ID 不变
  - 结果：**6 passed / 0 failed**
- 客户端 helper Node mock：`GLOBAL_PROFILE_SMOKE_OK`
- 微信开发者工具预览编译通过

## 5. 边界与限制

- 个人信息以服务端为准；个人中心在编辑状态下不会被远端静默覆盖
- 头像必须通过 `<button open-type="chooseAvatar">` 选择，昵称通过 `<input type="nickname">`
- 服务端可能对昵称做微信内容安全校验；失败时保留本地并提示
- 目前同步发生在页面 `onShow` / 注册保存 / 小火苗首次资料页；不做跨设备实时推送
