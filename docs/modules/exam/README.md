# 公考题库（packageExam）

> 版本：1.42.0（M1）· 2026-11-25
> 子包：`packageExam/`（4 页）· 数据：服务端静态资源 · 作答记录：本机

---

## 1. 定位

行测真题刷题 + 申论精练（申论为 M3 交付）。当前已上线 **2025 国考行测（副省级）135 题**。

入口：首页「二手估价」下方「公考题库」。

---

## 2. 页面

| 页面 | 作用 |
|---|---|
| `pages/home/home` | 公考首页：今日/正确率/累计统计 + 行测·申论分区入口 |
| `pages/papers/papers` | 历年真题，按年份分组，显示已做进度 |
| `pages/practice/practice` | 做题页：图文混排、图推整图、材料折叠、即时判对错、解析 |
| `pages/card/card` | 答题卡：五列网格按对/错/未做着色，点击跳题 |

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
```

---

## 5. 数据管线（tools/exam-pipeline）

数据源：`ERRRC/xingcezhenti`（公开题库仓库，Markdown + 已切图片）。

```bash
python fetch.py --paper "<卷名>"        # 抓 6 个模块 md
python fetch_images_fast.py all         # 并发补抓图片（限流时降并发）
python parse.py --paper "<卷目录名>"     # md → JSON（含校验）
python build_images.py                  # png → webp + 重写引用
python build_index.py                   # 生成 index.json
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
| M3 | 申论 5 套（材料/题目/作答三 Tab、字数统计与草稿、要点自评） | 待做 |
| M4 | 申论「红领巾批改」（要点规则匹配批改，不出现 AI 字样）+ 省考扩展 | 待做 |
