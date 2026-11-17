# 运动系统开发 Skill

> 基于微信小程序的运动记录系统开发指南

## 1. 项目结构

```
packageSport/
├── pages/
│   ├── sport/              # 运动主页面
│   │   ├── sport.js
│   │   ├── sport.json
│   │   ├── sport.wxml
│   │   └── sport.wxss
│   ├── history/            # 运动历史页面
│   │   ├── history.js
│   │   ├── history.json
│   │   ├── history.wxml
│   │   └── history.wxss
│   ├── detail/             # 运动详情页面
│   │   ├── detail.js
│   │   ├── detail.json
│   │   ├── detail.wxml
│   │   └── detail.wxss
│   └── achievements/       # 成就系统页面
│       ├── achievements.js
│       ├── achievements.json
│       ├── achievements.wxml
│       └── achievements.wxss
└── utils/
    └── sportApi.js         # 运动API工具类
```

## 2. 微信API使用

### 2.1 位置服务API

| API | 用途 | 说明 |
|-----|------|------|
| `wx.getLocation` | 获取当前位置 | 使用gcj02坐标系 |
| `wx.startLocationUpdate` | 启动后台定位 | 需要权限 |
| `wx.onLocationChange` | 监听位置变化 | 实时轨迹 |
| `wx.stopLocationUpdate` | 停止后台定位 | 运动结束时调用 |

### 2.2 配置要求

```json
// app.json
{
  "requiredPrivateInfos": ["getLocation", "startLocationUpdate", "onLocationChange"],
  "permission": {
    "scope.userLocation": {
      "desc": "获取位置信息用于运动记录"
    }
  }
}
```

### 2.3 位置精度过滤

```javascript
// 过滤精度差的点（超过50米）
if (res.accuracy > 50) return;

// 过滤异常跳跃（超过50米/秒的速度）
const timeDiff = (point.timestamp - lastLocation.timestamp) / 1000;
if (timeDiff > 0 && newDistance / timeDiff > 50) return;
```

## 3. 核心算法

### 3.1 距离计算（Haversine公式）

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // 地球半径(米)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
```

### 3.2 配速计算

```javascript
// 配速 = 时间(分钟) / 距离(公里)
const calculatePace = (distanceMeters, timeSeconds) => {
  const distanceKm = distanceMeters / 1000;
  const timeMinutes = timeSeconds / 60;
  return timeMinutes / distanceKm; // 分钟/公里
};

// 格式化配速 mm:ss
const formatPace = (paceMinutesPerKm) => {
  const mins = Math.floor(paceMinutesPerKm);
  const secs = Math.floor((paceMinutesPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

### 3.3 卡路里估算

```javascript
// 基于MET值估算
const calculateCalories = (distanceMeters, sportType) => {
  const distanceKm = distanceMeters / 1000;
  const metMap = {
    'RUN': 10,   // 跑步
    'WALK': 3.5, // 步行
    'CYCLE': 8   // 骑行
  };
  const met = metMap[sportType] || 10;
  return Math.round(distanceKm * 65 * met / 10);
};
```

## 4. 数据存储

### 4.1 本地存储Key

| Key | 用途 |
|-----|------|
| `sport_history` | 运动历史记录 |
| `sport_goal` | 运动目标 |

### 4.2 记录数据结构

```javascript
{
  id: 'sport_1234567890',
  type: 'RUN',           // 运动类型
  typeName: '跑步',      // 类型名称
  distance: 5000,        // 距离(米)
  duration: 1800,        // 时长(秒)
  calories: 325,         // 卡路里
  avgPace: '6:00',       // 平均配速
  avgSpeed: '10.0',      // 平均速度
  trackPoints: [],       // 轨迹点
  polyline: [],          // 地图线
  createTime: '...'      // 创建时间
}
```

## 5. 地图组件配置

### 5.1 正确配置

```xml
<map
  class="sport-map"
  latitude="{{currentLocation.latitude}}"
  longitude="{{currentLocation.longitude}}"
  scale="16"
  polyline="{{polyline}}"
  markers="{{markers}}"
  show-location
  enable-zoom="{{true}}"
  enable-scroll="{{true}}"
></map>
```

### 5.2 常见错误

| 错误 | 正确做法 |
|------|----------|
| `enable-zoom="{{false}}"` | 改为 `true` 允许缩放 |
| 自定义marker图片不存在 | 不使用iconPath或确保图片存在 |

### 5.3 轨迹线配置

```javascript
const polyline = [{
  points: trackPoints,
  color: '#6366f1',  // 紫蓝色
  width: 10,
  arrowLine: true    // 显示方向箭头
}];
```

## 6. UI设计规范

### 6.1 色彩系统

| 运动类型 | 主色 | 渐变 |
|----------|------|------|
| 跑步 | 紫蓝 | `#6366f1 → #8b5cf6` |
| 步行 | 绿青 | `#10b981 → #06b6d4` |
| 骑行 | 橙红 | `#f59e0b → #ef4444` |

### 6.2 圆角规范

| 元素 | 圆角 |
|------|------|
| 主卡片 | 44-52rpx |
| 列表项 | 20-24rpx |
| 图标容器 | 18-22rpx |
| 按钮 | 28-32rpx |

### 6.3 间距规范

| 位置 | 间距 |
|------|------|
| 顶部导航 | 140rpx（避开状态栏） |
| 页面边距 | 32rpx |
| 卡片内边距 | 28-32rpx |
| 列表间距 | 12-16rpx |

### 4.4 深色背景

```css
background: #080810;  /* 主背景 */
background: linear-gradient(180deg, #0e0e1a, #080810); /* 面板背景 */
```

## 7. 分享功能

### 7.1 实现方式

```javascript
// 分享给朋友
onShareAppMessage() {
  return {
    title: '🥛 吸引力标题',
    path: '/packageSport/pages/sport/sport'
  };
},

// 分享到朋友圈
onShareTimeline() {
  return {
    title: '🥛 简洁标题'
  };
}
```

### 7.2 标题设计原则

- 使用emoji增加视觉吸引力
- 包含具体数据（距离、配速、成就数）
- 有互动性邀请
- 朋友圈标题更简洁

## 8. 成就系统设计

### 8.1 成就类型

| 类别 | 示例 |
|------|------|
| 距离累计 | 1km → 1000km |
| 单次距离 | 5km → 全马 |
| 配速突破 | 7分 → 3分30秒 |
| 运动次数 | 1次 → 500次 |
| 连续天数 | 3天 → 90天 |
| 特殊成就 | 早起/夜跑/全能 |

### 8.2 进度计算

```javascript
// 避免undefined和NaN
let progress = 0;
if (unlocked) {
  progress = 100;
} else if (target > 0) {
  progress = Math.min(100, (current / target) * 100);
}
progress = isNaN(progress) || !isFinite(progress) ? 0 : Math.round(progress);
const progressText = unlocked ? '已达成' : progress + '%';
```

### 8.3 WXML显示

```xml
<!-- 在JS中预计算progressText，避免调用toFixed -->
<text class="progress-percent">{{item.progressText}}</text>
```

## 9. 最佳实践

### 9.1 防抖处理

```javascript
// 搜索输入防抖
this.searchTimer = setTimeout(async () => {
  // 处理逻辑
}, 500);
```

### 9.2 错误处理

```javascript
try {
  await sportApi.startLocationUpdate();
} catch (e) {
  wx.showToast({ title: '启动失败，请检查定位权限', icon: 'none' });
}
```

### 9.3 性能优化

- 使用`Promise.all`并行请求
- 限制历史记录数量（最多100条）
- 实时数据每秒更新一次

### 9.4 内存管理

```javascript
onUnload() {
  this.stopTimer();
  if (this.locationCallback) {
    sportApi.offLocationChange(this.locationCallback);
  }
}
```

## 10. 调试清单

| 问题 | 检查项 |
|------|--------|
| 定位失败 | 权限配置、requiredPrivateInfos |
| 地图不能缩放 | enable-zoom是否为true |
| 图片加载失败 | 确认图片存在或不使用自定义图片 |
| 数据显示undefined | 预计算格式化值 |
| 计时器泄漏 | onUnload中清理 |

## 11. 开发流程

```
1. 规划功能模块 → 2. 创建分包结构 → 3. 实现API工具类
         ↓
4. 开发页面逻辑 → 5. 设计UI样式 → 6. 添加分享功能
         ↓
7. 配置路由权限 → 8. 测试调试 → 9. 优化体验
```

---

*基于微信小程序开发*
*适用于运动记录类应用*
