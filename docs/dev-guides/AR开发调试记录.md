# 微信小程序 AR 开发与调试记录

## 项目背景

在已有的微信小程序项目中，基于 `threejs-miniprogram` 实现 AR 互动功能（替代原 xr-frame 方案），支持摄像头实时预览、3D 物体放置、手势运动检测、截图保存。

---

## 最终技术架构

```
层级结构（z-index 从低到高）：
┌─────────────────────────────┐
│  <camera>  z:0              │  ← 原生摄像头组件，显示物理世界
├─────────────────────────────┤
│  <canvas type="2d">  z:1   │  ← 2D Canvas 透明叠加，绘制 3D 物体投影
├─────────────────────────────┤
│  <view touch-layer>  z:2   │  ← 触摸穿透层
├─────────────────────────────┤
│  <view hud>  z:10           │  ← 按钮 / 提示 / 手势卡片 UI
└─────────────────────────────┘
```

**核心组件：**

| 文件 | 职责 |
|------|------|
| `packageAR/pages/ar/ar.wxml` | camera + canvas + HUD 布局 |
| `packageAR/pages/ar/ar.wxss` | 全屏样式与层级 |
| `packageAR/pages/ar/ar.js` | 渲染循环、运动检测、物体管理、截图 |
| `packageAR/pages/ar/ar.json` | 页面配置（无组件依赖） |

---

## 开发过程与踩坑记录

### 第一阶段：Three.js + VKSession（失败）

**初始方案：** 使用 `createScopedThreejs` 创建 WebGL canvas，叠加在摄像头上。

**失败原因：**
- 微信小程序的 WebGL canvas **不支持 alpha 透明叠加**在原生组件上
- 即使设置 `alpha: true` + `setClearColor(0, 0)`，canvas 背景仍然是不透明的黑色
- `<camera>` 组件被 WebGL canvas 完全遮挡，用户看到的是黑屏

### 第二阶段：摄像头帧数据作为纹理（部分成功）

**方案：** 用 `<camera>` 组件的 `onCameraFrame` 获取 RGBA 帧数据，通过 `wx.createOffscreenCanvas` 转换为纹理，在 Three.js 场景中作为背景平面渲染。

**遇到的问题与修复：**

| 错误 | 原因 | 修复 |
|------|------|------|
| `wx.createCanvas is not a function` | 小程序没有此 API | 改用 `wx.createOffscreenCanvas` |
| `The current device does not support version "3.15.0"` | VKSession 的 `version` 参数不应传 SDK 版本 | 改为 `version: 'v1'` |
| 模拟器上 AR 引擎启动失败 | VKSession 在模拟器 (env: Windows) 完全不支持 | 加模拟器检测，走降级模式 |
| `wx.getSystemInfoSync is deprecated` | 旧 API 过时 | 改用 `wx.getDeviceInfo()` + `wx.getWindowInfo()` |
| camera 预览在真机上冻结 | VKSession 启动后**独占摄像头**，导致 `<camera>` 组件无法更新画面 | **放弃 VKSession**，只用 camera 组件 |
| `requestAnimationFrame is not a function` | 小程序没有 rAF | 改用 `setTimeout(loop, 16)` |
| `Cannot read property 'push' of undefined` | Page 级属性 `objects: []` 初始化不可靠 | 改在 `onLoad` 中 `this.objects = []` |
| `TypeError: THREE.NoBlending` | 作用域内 `THREE` 未定义（应为 `this.THREE`） | 删除该行 |

### 第三阶段：camera + 2D Canvas（最终方案）

**关键发现：** 教练页面 (`packageGame/pages/coach`) 成功使用了 `<camera>` + `<canvas type="2d">` 的组合。2D canvas 与 WebGL canvas 不同，**天然支持透明叠加**。

**最终架构：**
- `<camera>` 可见组件 → 显示物理世界
- `<canvas type="2d">` → 透明叠加，用 2D 绘图 API 绘制伪 3D 物体
- 不使用 VKSession（避免冻结摄像头）
- 不使用 Three.js（2D canvas 绘制即可满足需求）

---

## 功能实现细节

### 1. 摄像头实时预览

```html
<camera
  device-position="back"
  resolution="medium"
  frame-size="medium"
  bindinitdone="onCameraReady"
  binderror="onCameraError"
/>
```

- `frame-size="medium"` 是 `onCameraFrame` 的必填属性
- `bindinitdone` 确保 camera 就绪后再启动其他逻辑

### 2. 3D 物体绘制（2D 伪 3D）

使用 Canvas 2D API 绘制五种几何体的透视投影：

```javascript
_drawShape(ctx, x, y, sz, rot, type, cfg) {
  // cube: 正面 + 顶面 + 右面（伪 3D）
  // sphere: 径向渐变模拟光照
  // cylinder: 侧面矩形 + 椭圆顶底
  // torus: 椭圆环（线宽模拟厚度）
  // cone: 三角形 + 椭圆底面
}
```

每种形状使用：
- `shadowColor` + `shadowBlur` 模拟发光效果
- 渐变色模拟 PBR 材质的金属感/粗糙感

### 3. 物体放置

- 只有点击「放置」按钮才放置物体
- 物体随机分布在屏幕中央区域
- 放置时有弹性缩放动画（`easeOutElastic`）
- 物体持续旋转 + 微浮动

```javascript
// easeOutElastic 动画
const c4 = (2 * Math.PI) / 3;
const scale = Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
```

### 4. 手势运动检测

基于 `onCameraFrame` 的帧间像素差异实现：

```javascript
_detectMotionFromFrame(frame) {
  // 采样画面中心区域
  // 逐像素计算与上一帧的 RGB 差值
  // 差值平均 > 25 → 有运动
}
```

**手势动作绑定：**

| 运动状态 | 触发条件 | 动作 |
|----------|----------|------|
| 挥动 > 0.5秒 | 持续中等运动 | 移除最后一个物体 |
| 强力挥动 > 1秒 | 持续高强度运动 | 清空全部物体 |
| 运动消失 | 微分差值 < 8 | 清除手势 UI |

### 5. 截图功能

```javascript
wx.canvasToTempFilePath({
  canvas: this.ctx.canvas,  // 2D canvas 节点
  fileType: 'jpg',
  quality: 0.9,
  success: (res) => {
    wx.saveImageToPhotosAlbum({ filePath: res.tempFilePath });
  }
});
```

> **注意：** 截图只包含 overlay canvas 的内容（3D 物体），不包含摄像头画面。如需包含摄像头，需额外合成。

---

## 关键教训总结

### ❌ 不要做的

1. **不要用 WebGL canvas 叠加在原生组件上** — 小程序不支持透明合成
2. **不要同时使用 VKSession 和 camera 组件** — VKSession 会独占摄像头导致预览冻结
3. **不要在模拟器上测试 AR 功能** — VKSession 完全不支持 `env: Windows`
4. **不要在 Page 级声明 `objects: []`** — 可能在实例化时丢失，应在 `onLoad` 中初始化
5. **不要用 `requestAnimationFrame`** — 小程序没有此 API，用 `setTimeout(fn, 16)`
6. **不要用 `wx.createCanvas`** — 不存在，用 `wx.createOffscreenCanvas`

### ✅ 推荐做法

1. **AR 叠加用 `<canvas type="2d">`** — 天然透明，可叠加在 camera 上
2. **camera 组件做预览** — 使用 `bindinitdone` 确保就绪
3. **onCameraFrame 获取帧数据** — `frame.data` 是 ArrayBuffer，需转 `Uint8ClampedArray`
4. **截图用 `wx.canvasToTempFilePath(canvas)`** — 直接传 canvas 节点，比 offscreen canvas 可靠
5. **模拟器降级处理** — 检测 `platform === 'devtools'` 走降级模式，保证页面不崩溃
6. **所有关键操作加 try-catch** — 小程序环境差异大，异常处理是必须的

---

## 文件清单

```
packageAR/
├── pages/
│   └── ar/
│       ├── ar.js      (483行，核心逻辑)
│       ├── ar.wxml    (80行，camera+canvas+hud 布局)
│       ├── ar.wxss    (220行，全屏样式)
│       └── ar.json    (3行，页面配置)
```

---

## 真机调试步骤

1. 微信开发者工具 → 点击「真机调试」
2. 手机扫码 → 允许摄像头权限
3. 等待 camera 初始化完成（页面加载圈消失）
4. 选择物体类型 → 点击「放置」按钮
5. 挥手测试手势检测
6. 点击「截图」保存到相册
