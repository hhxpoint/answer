# 天气系统开发 Skill

> 基于和风天气API的微信小程序天气模块开发指南

## 1. 项目结构

```
packageWeather/
├── pages/
│   └── weather/
│       ├── weather.js      # 页面逻辑
│       ├── weather.json    # 页面配置
│       ├── weather.wxml    # 页面模板
│       └── weather.wxss    # 页面样式
└── utils/
    ├── weatherApi.js       # API封装
    ├── base64.js           # Base64工具
    └── tweetnacl.js        # JWT签名库
```

## 2. API认证机制

### 2.1 认证方式对比

| API类型 | 认证方式 | 示例 |
|---------|----------|------|
| 天气数据 | API_KEY查询参数 | `/v7/weather/now?key=xxx` |
| 城市搜索 | JWT Bearer Token | `Authorization: Bearer xxx` |
| 空气质量v1 | JWT Bearer Token | `Authorization: Bearer xxx` |

### 2.2 常见错误

**错误1：API路径混淆**
```javascript
// ❌ 错误 - 使用了天气API的主机和路径
const GEO_URL = 'https://api.qweather.com/v2';

// ✅ 正确 - 使用统一的API_HOST和geo路径
const GEO_URL = `https://${API_HOST}/geo/v2`;
```

**错误2：认证方式错误**
```javascript
// ❌ 错误 - 城市搜索不应使用API_KEY
const getCity = (location) => {
  return request(`${GEO_URL}/city/lookup`, { location });
};

// ✅ 正确 - 城市搜索需要JWT认证
const getCity = (location) => {
  return jwtRequest(`${GEO_URL}/city/lookup?location=${encodeURIComponent(location)}`);
};
```

## 3. API封装模式

### 3.1 请求函数封装

```javascript
// API_KEY认证请求
const request = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: { ...data, key: API_KEY },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === '200') {
          resolve(res.data);
        } else {
          reject(new Error(`API错误: ${res.data.code || res.statusCode}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
};

// JWT认证请求
const jwtRequest = (url) => {
  return new Promise((resolve, reject) => {
    const token = generateJWT();
    if (!token) {
      reject(new Error('JWT Token 生成失败'));
      return;
    }
    wx.request({
      url,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'gzip'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`API错误: ${res.statusCode}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
};
```

### 3.2 城市搜索API

```javascript
// 城市模糊搜索
const getCity = (location) => {
  return jwtRequest(`${GEO_URL}/city/lookup?location=${encodeURIComponent(location)}`);
};

// 热门城市列表
const getTopCity = (number = 10, range = '') => {
  let url = `${GEO_URL}/city/top?number=${number}`;
  if (range) {
    url += `&range=${encodeURIComponent(range)}`;
  }
  return jwtRequest(url);
};
```

## 4. UI设计规范

### 4.1 圆角使用规范

| 组件类型 | 推荐圆角 | 示例 |
|----------|----------|------|
| 主卡片(glass) | 32rpx | 天气卡片、空气质量卡片 |
| 弹窗/面板 | 32rpx | 搜索面板 |
| 输入框 | 20rpx | 搜索输入框 |
| 小卡片/条状 | 20rpx | 预警条、污染物网格 |
| 按钮 | 24rpx | 展开/收起按钮 |
| 进度条 | 4rpx | 温度条、指数进度条 |
| 图标容器 | 24rpx | 圆角方形图标背景 |

### 4.2 毛玻璃效果

```css
.glass {
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255,255,255,0.25);
  border-radius: 32rpx;
}
```

### 4.3 动态背景渐变

```javascript
// 根据天气状态设置背景
let bg = 'linear-gradient(180deg, #74b9ff 0%, #a8e6cf 100%)';
const code = parseInt(iconCode);
if (isNight) {
  bg = 'linear-gradient(180deg, #2d3436 0%, #6c5ce7 100%)';
} else if (code >= 300 && code < 400) {
  bg = 'linear-gradient(180deg, #636e72 0%, #a29bfe 100%)';
} else if (code >= 400 && code < 500) {
  bg = 'linear-gradient(180deg, #b2bec3 0%, #dfe6e9 100%)';
} else if (code >= 500) {
  bg = 'linear-gradient(180deg, #636e72 0%, #b2bec3 100%)';
}
```

## 5. 调试技巧

### 5.1 API调试清单

1. **检查API路径**：对比文档确认路径是否正确
2. **检查认证方式**：JWT vs API_KEY
3. **检查参数传递**：URL参数 vs Body参数
4. **检查响应格式**：确认返回字段名称

### 5.2 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 401 Unauthorized | JWT过期或错误 | 检查JWT生成逻辑和时间设置 |
| 404 Not Found | API路径错误 | 对比文档检查路径 |
| 返回空数据 | 参数格式错误 | 检查encodeURI和参数拼接 |
| 搜索无结果 | 认证方式错误 | 确认使用JWT而非API_KEY |

## 6. 最佳实践

### 6.1 代码组织

- API调用统一封装在`weatherApi.js`
- 使用Promise处理异步操作
- 导出清晰的函数接口

### 6.2 错误处理

```javascript
try {
  const cityRes = await weatherApi.getCity(location);
  // 处理成功响应
} catch (e) {
  console.error('获取城市名失败:', e);
  // 降级处理
  cityName = weatherApi.formatCoords(parseFloat(lon), parseFloat(lat));
}
```

### 6.3 性能优化

- 使用防抖处理搜索输入（500ms）
- 并行请求独立数据（Promise.all）
- 限制返回结果数量（slice）

### 6.4 UI一致性

- 统一使用rpx单位
- 保持圆角风格协调
- 使用rgba颜色实现透明效果
- 添加适当的过渡动画

## 7. 开发流程

```
1. 阅读API文档 → 理解接口规范
2. 检查现有代码 → 对比差异
3. 修复问题 → 保持代码风格
4. 测试验证 → 确保功能正常
5. UI优化 → 提升用户体验
```

## 8. API端点速查

| 功能 | 端点 | 认证 |
|------|------|------|
| 实时天气 | `/v7/weather/now` | API_KEY |
| 24小时预报 | `/v7/weather/24h` | API_KEY |
| 7天预报 | `/v7/weather/7d` | API_KEY |
| 城市搜索 | `/geo/v2/city/lookup` | JWT |
| 热门城市 | `/geo/v2/city/top` | JWT |
| 空气质量v1 | `/airquality/v1/current/{lat}/{lon}` | JWT |
| 生活指数 | `/v7/indices/1d` | API_KEY |
| 天气预警 | `/v7/warning/now` | API_KEY |

---

*基于和风天气API v7 + Geo v2*
*适用于微信小程序开发*
