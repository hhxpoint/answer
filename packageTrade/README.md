# packageTrade · 游戏本二手估价

> 1.34.0 / 2026-11

## 定位

本地优先的「游戏本行情 + 个人二手估价单」工具：

- 展示 24 款主流游戏本的真实配置、发售价与二手参考区间
- 用户填写成色/电池/维修/配件，生成个人估价单
- 估价单只保存在本机；导出图片，可分享好友或保存后发朋友圈
- 不做交易、不做评论/关注/私聊、不做公开列表、不上传用户照片

## 页面

| 页面 | 能力 |
|---|---|
| `pages/home/home` | 搜索、品牌/GPU 筛选、入口、我的估价数 |
| `pages/list/list` | 全部型号、筛选与排序 |
| `pages/detail/detail` | 设备大图、规格、配置版本、参考区间 |
| `pages/estimate/estimate` | 成色问卷、心理价、本机照片预览、实时估价 |
| `pages/poster/poster` | Canvas 2D 估价单、保存相册、分享图片 |
| `pages/my/my` | 本机记录、删除、重新打开 |
| `pages/sources/sources` | 价格/规格/图片/隐私/免责声明 |

## 数据

- `data/laptops.js`：24 个型号，32 个配置
- 字段：`brand/series/model/year/launchPrice/specs/variants/aliases/highlights`
- `priceBasis: guide`：价格是「发售价 + 折旧模型」参考区间，不是成交价
- `image`：统一绘制的设备示意图，不是真机实拍

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

## 隐私与边界

- 照片只存在 `wx.chooseMedia` 的临时路径，不调用上传接口
- 估价记录使用 `wx.setStorageSync` 存本机，最多 30 条
- 估价单由 Canvas 生成，分享的是本地图片
- 不提供评论区、公开列表、用户主页、私聊、支付或联系方式
- 图片为自绘示意图，避免未授权品牌素材

## 验证

```bash
node tests/trade_data.test.js
node tests/trade_smoke.test.js
```

（测试脚本在仓库外工作目录运行；也可将断言复制到 CI。）

## 后续

1. 补充 40–60 款型号、更多 2025/2026 机器
2. 真实成交样本库（人工采样/授权数据）
3. 价格数据版本化与月度更新
4. 若主体升级为企业，再评估 token 私密分享页
