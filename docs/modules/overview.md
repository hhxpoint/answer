# 子包与主包总览

> 来源：`app.json`（2026-11-18 快照）。每个子包在 `app.json.subPackages` 中注册，
> 页面路径为相对子包根目录的路径。

## 主包页面（10）

| 页面 | 说明 |
|---|---|
| `pages/index/index` | 首页：功能入口、工具宫格、「我们的小火苗」「今天吃什么」入口 |
| `pages/search/search` | 搜索 |
| `pages/quiz/quiz` | 答题/练习 |
| `pages/calc/calc` | 计算器 |
| `pages/user/user` | 个人中心 |
| `pages/loginscan/loginscan` | 扫码登录 |
| `pages/about/about` | 关于 |
| `pages/process/process` | 处理/结果页 |
| `pages/emotion-analysis/emotion-analysis` | 情绪分析 |
| `pages/emotion-history/emotion-history` | 情绪历史 |

## 子包（20）

| 子包 | 页面 | 职责 | 备注 |
|---|---|---|---|
| `packageCouple` | home / bind / chat / profile / timeline / timeline-edit / anniversary / anniversary-edit / listen | 双人私密空间（小火苗/悄悄话/时光/纪念日/侧耳倾听） | 依赖 `couple-api` 服务端 |
| `packageRecipe` | home / detail / fridge / favorites / sources | 纯本地菜谱：检索/冰箱模式/收藏/图片来源 | **无服务端、无网络、无大模型**；数据与图片随包 |
| `packagepdf` | hash / lab / puzzle / img2pdf / memo | 哈希、实验、拼图、图片转 PDF、备忘录 | 纯前端为主 |
| `packagetoken` | word / algorithm / exam | 单词、算法、考试 | 题库数据在子包内 |
| `packageWeather` | weather | 天气 | 需要定位权限 |
| `chess` | chess / lobby / user_info | 国际象棋对战 | 需实时通信 |
| `resume` | resume / edit / preview | 简历编辑与预览 | PDF 生成 |
| `pictionary` | pictionary / lobby / user_info | 你画我猜 | 实时多人 |
| `bitcoin` | bitcoin / news-detail | 比特币行情与资讯 | 网络请求 |
| `particle` | t | 粒子效果实验页 | 轻量 |
| `course` | course / course-copy | 课程页面 | — |
| `packageSport` | sport / history / detail / achievements | 运动记录、历史、详情、成就 | 定位/传感器 |
| `packageGithub` | journal / article / conference / translate | GitHub 资讯/文章/会议/翻译 | 网络请求 |
| `packageAI` | loader | AI 能力加载器 | **独立分包**（independent） |
| `packageGame` | coach / report | AI 游戏教练与报告 | 可能依赖 AI 服务 |
| `packageAssets` | （无页面） | 子包资源（音频等） | 仅资源 |
| `packageAR` | ar | AR 场景 | 使用 `components/xr-scene` |
| `packageFinance` | index | 金融工具 | — |
| `packageDetect` | detect | 目标检测（YOLO） | **独立分包**，模型文件不入库 |
| `packageJwzx` | login / scores / timetable | 教务系统登录/成绩/课表 | 外部接口 |

## 公共资源

| 目录 | 说明 |
|---|---|
| `components/` | 自定义组件（含 `xr-scene` AR 组件） |
| `utils/` | 公共工具（API、学习中心、教务接口等） |
| `assets/` | 主包静态资源 |
| `ml-modules/` | 情感分析等模型加载代码（大模型权重 `.onnx/.pt` 不入库） |
| `typings/` | TypeScript 类型（微信 API） |

## 维护提示

1. 新增/删除页面必须同步 `app.json`，否则编译或运行报错
2. 新子包注意包体积（主包 ≤ 2MB，总包 ≤ 20MB，具体以微信限制为准）
3. 大文件（模型/视频/压缩包）不要入库，见 [../assets-and-models.md](../assets-and-models.md)
4. 各子包第三方依赖的许可与来源见代码内注释/原仓库
