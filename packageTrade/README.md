# packageTrade · 二手估价与公开市场

> 1.41.0 / 2026-11

详细文档见 [../docs/modules/trade/README.md](../docs/modules/trade/README.md)。

## 定位

行情与估价**纯本地**，公开浏览**走服务端且必须人工审核**：

- 68 款全品类（游戏本 38 / 手机 20 / 游戏机 10）、83 个配置的真实规格、发售价与二手参考区间
- 用户填写成色/电池/维修/屏幕/配件/保修，生成个人估价单
- 估价单保存本机（最多 30 条）；三种原生小程序卡片直分享：估价单、设备详情、公开信息
- 公开浏览：审核通过的带图二手信息；不做交易、评论、关注、私聊

## 页面

| 页面 | 能力 |
|---|---|
| `pages/home/home` | 搜索、品类/品牌/GPU 筛选、入口、我的估价数 |
| `pages/list/list` | 全部型号、筛选与排序 |
| `pages/detail/detail` | 设备大图、规格、配置版本切换、参考区间、直接分享 |
| `pages/estimate/estimate` | 成色问卷、心理价、本机照片预览、实时估价、发布 CTA |
| `pages/poster/poster` | Canvas 2D 估价单、直接分享小程序、保存图片 |
| `pages/share/share` | 好友打开的估价单页（白名单载荷还原），可再次分享 |
| `pages/my/my` | 本机记录、删除、重新打开 |
| `pages/sources/sources` | 价格/规格/图片/隐私/免责声明 |
| `pages/publish/publish` | 无 `id` 时是**型号选择器**；有 `id` 时是发布表单（提交审核） |
| `pages/market/market` | 公开浏览（仅 `approved`），空态引导发布并带上当前品类 |
| `pages/listing/listing` | 公开详情、图片预览、举报、分享好友/朋友圈 |
| `pages/mylist/mylist` | 我的发布与状态（审核中/已公开/未通过/已隐藏/已过期）、删除 |

## 数据

- `data/`：68 个型号、83 个配置（laptops / phones / consoles）
- 字段：`brand/series/model/year/launchPrice/specs/variants/aliases/highlights`
- `priceBasis: guide`：价格是「发售价 + 折旧模型」参考区间，不是成交价
- `image`：**68/68 真实产品图/实拍图**，统一压缩后托管在
  `https://hhxpoint.me/couple-api/files/trade-assets/final/<id>.jpg`；
  许可与来源逐款记录在 [../docs/TRADE_IMAGE_SOURCES.md](../docs/TRADE_IMAGE_SOURCES.md)

### 为什么价格不是“真实成交价”

中国二手 3C 没有稳定、公开、可商用的实时成交 API；首版不编造成交样本，也不抓取未授权平台。  
页面明确显示「参考区间 / 模型参考 / 非成交承诺」，后续有真实样本再升级数据。

## 估价算法

```text
base = variant.priceLow / priceHigh
factor = 成色 × 电池 × 维修 × 屏幕 × 配件 × 保修
low = round10(priceLow × factor)
high = round10(priceHigh × factor)
fair = midpoint
quick = low × 0.95
patient = high × 1.04
```

实现：`utils/estimate.js`。  
所有选项均可在 `CONDITIONS/BATTERIES/REPAIRS/SCREENS/ACCESSORIES/WARRANTY` 中调整。

## 分享

| 场景 | 路由 | 依赖 |
|---|---|---|
| 估价单 | `pages/share/share?d=<encodeURIComponent(JSON)>`（白名单字段，约 335 字符） | 无 |
| 设备详情 | `pages/detail/detail?id=<modelId>&variant=<variantId>` | 无 |
| 公开信息 | `pages/listing/listing?id=<listingId>` | 服务端 |

## 隐私与边界

- 估价单的「本机照片预览」不离开设备；只有用户主动发布时，才把所选实拍图上传到 `trade-api`
- 估价记录使用 `wx.setStorageSync` 存本机，最多 30 条
- 不提供评论区、私聊、支付或联系方式；公开列表只展示审核通过内容，且只显示昵称
- 非 CC 来源的图片标注「待购买来源版权」，采购清单见 `docs/TRADE_IMAGE_SOURCES.md`

## 验证

```bash
node tests/trade_data.test.js
node tests/trade_smoke.test.js
node tests/trade_pages.test.js
node tests/trade_share.test.js
node tests/trade_share_page.test.js
node tests/trade_market_flow.test.js   # 选型器 / 公开列表 / 详情分享 / 我的发布
```

服务端链路的端到端 28 项自检见 [../docs/modules/trade/README.md](../docs/modules/trade/README.md) 第 10 节。

## 后续

1. 补充更多 2025/2026 机型
2. 真实成交样本库（人工采样/授权数据）
3. 价格数据版本化与月度更新
4. 审核从命令行升级为 Web 后台（可复用 OJ 管理后台风格）
5. 非 CC 图片完成版权采购后重新登记许可
