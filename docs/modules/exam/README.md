# 公考题库（packageExam）

> 版本：1.42.0（M1）· 2026-11-25
> 子包：`packageExam/`（4 页）· 数据：服务端静态资源 · 作答记录：本机

---

## 1. 定位

行测真题刷题 + 申论精练 + 红领巾批改。当前已上线 **26 卷 / 3257 题**（国考 16 卷 2109 题 + 省考 10 卷 1148 题）与 **申论 6 套**。

入口：首页「二手估价」下方「公考题库」。

---

## 2. 页面

| 页面 | 作用 |
|---|---|
| `pages/home/home` | 公考首页：今日/正确率/累计统计 + 行测·申论分区入口 |
| `pages/papers/papers` | 历年真题，按年份分组，显示已做进度 |
| `pages/practice/practice` | 做题页：图文混排、图推整图、材料折叠、即时判对错、解析 |
| `pages/card/card` | 答题卡：五列网格按对/错/未做着色，点击跳题 |
| `pages/section/section` | 专项练习：10 个题型池，跨卷抽题 |
| `pages/wrong/wrong` | 错题本：按卷归类，跳回原卷重做 |
| `pages/report/report` | 学习报告：累计/正确率/连续天数 + 各卷进度 |
| `pages/essay-home/essay-home` | 申论卷列表（6 套国考） |
| `pages/essay-practice/essay-practice` | 材料/题目/作答三 Tab + 字数 + 草稿 + 计时 |
| `pages/essay-review/essay-review` | 参考要点自评 + 红领巾批改 |

---

## 3. 数据格式

服务端静态目录 `/home/point/couple/uploads/exam/`，对外 `https://hhxpoint.me/couple-api/files/exam/`：

```
index.json                     # 卷索引
papers/<paperKey>.json         # 单卷（题干/选项/答案/解析/材料）
img/<paperKey>/<hash>.webp     # 图片（长边 ≤900，白底）
```

单卷 JSON 关键字段：

```json
{
  "key": "gk2025-fsx", "title": "...", "year": "2025", "examType": "guokao",
  "questionCount": 135,
  "materials": { "zl": { "1": [ {"parts":[{"t":"材料正文"}]} ] } },
  "questions": [{
    "id": "q19283910", "qid": "19283910", "seq": 1, "section": "pd", "type": "图形推理",
    "material": null,
    "stem": [ {"parts":[{"t":"..."},{"img":"1938224b3d16736.png","w":600,"h":281,"tex":false}]} ],
    "options": [ {"key":"A","blocks":[{"parts":[{"t":"A"}]}],"marked":false} ],
    "answer": "D",
    "analysis": [ ... ],
    "needsReview": []
  }]
}
```

- 内容按**块 / 部件**保序：`parts` 里要么是 `{t:文字}`，要么是 `{img:文件名, w, h, tex}`（`tex` 为公式图，行内渲染）
- 资料分析为「材料 N + 多题共用」，题目用 `material` 指向材料序号

---

## 4. 客户端实现要点

| 文件 | 职责 |
|---|---|
| `utils/exam-api.js` | 拉索引/试卷、本地缓存（索引 30 分钟、试卷 24 小时）、图片地址拼接、`normalizePaper` 补全 URL 与稳定 key |
| `utils/exam-store.js` | 作答记录、进度、今日/正确率/连续天数统计（`wx.setStorage`） |

本地存储键：

```
exam:index            索引缓存 {t,v}
exam:paper:<key>      试卷缓存 {t,v}
exam:progress:<key>   { answers:{ qid:{pick,correct} }, idx, updatedAt }
exam:stats            { total, correct, todayCount, streak, day }
exam:jump             答题卡跳转目标（一次性）
exam:essay:draft:<key>  { tab, qIndex, answers:{no:text}, checked:{no:[i]}, grades:{no:grade}, startedAt }
```

---

## 4.1 账号与数据同步

**唯一标识**：服务端 `users.id`（微信 openid 唯一）。本地表现为 `userProfile.userId = 'u<id>'`，与「我的」页共用同一份资料，不另建用户体系。

**首次进入**：点首页「公考题库」时，若 `userProfile` 缺头像或昵称 → 跳 `pages/setup/setup`（`chooseAvatar` + `type=nickname`），保存后 `redirectTo` 回原目标页。已完善资料直接进；直接打开子页面不拦截，只在公考首页顶部提示。

**本地键**（按账号隔离）：

```
exam:p:<uid>:<paperKey>    套卷/专项进度
exam:s:<uid>               累计统计
exam:d:<uid>:<essayKey>    申论草稿
```

历史键（无 uid 段）与登录前的 `local` 数据在首次读写时自动迁移，迁移后旧键删除。

**云端同步**（`/couple-api/exam/progress`）：

| 动作 | 时机 | 说明 |
|---|---|---|
| 拉取 | 进模块时 | `GET /progress?since=0`，按 `updatedAt` 新者覆盖 |
| 上传 | 作答后 2.5s | `PUT /progress`，失败进 `exam:sync:pending` 队列 |
| 补传 | 下次进模块 | `flush()` 重试队列 |
| 首传 | 首次登录 | `batch` 上传本地历史（最多 60 条） |

冲突策略：服务端只认 `updatedAt` 更新者，允许 5 分钟时钟容差（手机时间偏差不至于永远写不进）。
## 5. 数据管线（tools/exam-pipeline）

数据源：`ERRRC/xingcezhenti`（公开题库仓库，Markdown + 已切图片）。

```bash
python fetch.py --paper "<卷名>"        # 抓 6 个模块 md
python fetch_images_fast.py all         # 并发补抓图片（限流时降并发）
python parse.py --paper "<卷目录名>"     # md → JSON（含校验）
python build_images.py                  # png → webp + 重写引用
python build_index.py                   # 生成 index.json\npython build_pools.py                   # 生成题型池\npython verify_images.py                 # 图片零缺失闸门
python deploy_exam.py                   # 上传到服务器静态目录
python demo.py                          # 生成手机宽度视觉原型（本地验收用）
```

校验规则（`parse.py` 的 `validate`）：选项数≠4、答案不在选项、✅ 标记与答案冲突、图推题无图 → 标 `needsReview`，不进上线包。

---

## 6. 测试

```bash
node packageExam/tests/exam.test.js     # 28 项：数据层/进度层/做题页逻辑
python tools/automator/smoke.js         # 模拟器冒烟：exam-home / exam-papers / exam-practice
python tools/check_pages.py <项目根> --root packageExam
```

---

## 6.1 红领巾批改（规则引擎）

实现：`utils/essay-grader.js`（纯函数，无网络、无生成式模型）

| 维度 | 权重 | 判定 |
|---|---|---|
| 要点覆盖 | 60% | 每条参考要点取 2 字词元（去停用词），作答命中率 ≥ 34% 记为覆盖 |
| 结构规范 | 25% | 分条 10% / 字数合规 10% / 明确扣材料 5% |
| 表达完整 | 15% | 字数充实度（达上限 85% 计满），超字数按比例扣 |

输出：总分、分项得分、逐条要点命中（含命中词）、待改进项、改进建议。
同一份作答结果完全可复现。**界面与代码文案禁止出现 AI / 智能生成 / 大模型 等表述**，测试中有断言把关。

## 7. 视觉规范

- 基调：纸感米色 `#f6f4ef` + 墨色文字 `#1d2530` + 靛蓝主色 `#2b4a8b` + 朱砂批注 `#b5442c`
- 标题用宋体（`Songti SC`），正文系统无衬线
- 题目卡白底圆角 28rpx，选项圆角 22rpx；答对朱砂底、答错虚线朱砂边
- 图推图片：白底细边、居中、可点按放大；公式图行内 44rpx 高

---

## 8. 路线图

| 期 | 内容 | 状态 |
|---|---|---|
| M1 | 入口 + 首页 + 2025 副省级 1 卷 + 做题页/答题卡 | ✅ |
| M2 | 2020–2025 共 16 卷 ≈2080 题、专项练习、错题本、报告 | 进行中 |
| M3 | 申论 6 套（材料/题目/作答三 Tab、字数统计与草稿、要点自评） | ✅ |
| M4 | 申论「红领巾批改」（要点规则匹配批改，不出现 AI 字样）+ 省考扩展 | ✅ |
