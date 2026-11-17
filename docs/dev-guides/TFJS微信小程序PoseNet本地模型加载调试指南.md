# TensorFlow.js 微信小程序 PoseNet 本地模型加载调试指南

## 目录
- [背景介绍](#背景介绍)
- [环境信息](#环境信息)
- [问题汇总与解决方案](#问题汇总与解决方案)
  - [问题1：MINI_PROGRAM_PATH 不可用](#问题1mini_program_path-不可用)
  - [问题2：读取 .json 文件权限被拒](#问题2读取-json-文件权限被拒)
  - [问题3：DataView 构造函数报错](#问题3dataview-构造函数报错)
  - [问题4：tf.io.fromMemory API 弃用](#问题4tfiofrommemory-api-弃用)
  - [问题5：权重数据格式错误](#问题5权重数据格式错误)
  - [问题6：expandDims 方法不存在](#问题6expanddims-方法不存在)
  - [问题7：toFloat 链式调用失败](#问题7tofloat-链式调用失败)
- [关键代码实现](#关键代码实现)
- [最佳实践总结](#最佳实践总结)
- [参考资料](#参考资料)

---

## 背景介绍

在微信小程序中使用 TensorFlow.js 加载 PoseNet 姿态估计模型时，由于网络环境限制（Google Cloud Storage 在国内访问不稳定），需要实现本地模型加载功能。

### 需求描述
- 模型已量化为 FP16 格式存储在本地（减小体积）
- 运行时需要转换为 FP32 格式供 TensorFlow.js 使用
- 完全离线加载，不依赖网络下载

### 模型文件结构
```
packageAI/models/posenet/
├── model.bin          # 模型配置文件（原 model.json 重命名）
└── shard_fp16.bin     # FP16 量化权重文件
```

---

## 环境信息

| 项目 | 版本 |
|------|------|
| 微信基础库 | 2.01.2510280 |
| TensorFlow.js Core | 3.21.0 |
| TensorFlow.js Converter | 3.21.0 |
| TensorFlow.js WebGL Backend | 3.21.0 |
| 微信小程序 TFJS 插件 | 0.0.6 |

---

## 问题汇总与解决方案

### 问题1：MINI_PROGRAM_PATH 不可用

**错误现象：**
```
[PoseEstimator] MINI_PROGRAM_PATH: 
[PoseEstimator] USER_DATA_PATH: http://usr
```

**问题分析：**
- `wx.env.MINI_PROGRAM_PATH` 在某些环境下不可用（返回空字符串）
- `wx.env.USER_DATA_PATH` 是 HTTP 协议路径，不能直接用文件系统 API 操作

**解决方案：**
直接使用相对路径读取项目中的模型文件，不依赖 `MINI_PROGRAM_PATH`。

```javascript
// 直接使用相对路径
const modelBasePath = 'packageAI/models/posenet';
const fp16Path = modelBasePath + '/shard_fp16.bin';
const fp16Data = fs.readFileSync(fp16Path);
```

---

### 问题2：读取 .json 文件权限被拒

**错误现象：**
```
readFileSync:fail permission denied, open packageAI/models/posenet/model.json
```

**问题分析：**
微信小程序对 `.json` 文件有特殊权限限制，不允许直接用 `fs.readFileSync` 读取。

**解决方案：**
将 `model.json` 重命名为 `model.bin`（或其他非 `.json` 扩展名），然后以二进制方式读取并转换为字符串。

```bash
# 将 model.json 复制为 model.bin
copy packageAI\models\posenet\model.json packageAI\models\posenet\model.bin
```

```javascript
// 读取 .bin 文件并转换为 JSON 字符串
const modelBinPath = 'packageAI/models/posenet/model.bin';
const jsonBuffer = fs.readFileSync(modelBinPath);
const uint8Arr = new Uint8Array(jsonBuffer);
let jsonStr = '';
for (let i = 0; i < uint8Arr.length; i++) {
  jsonStr += String.fromCharCode(uint8Arr[i]);
}
const modelConfig = JSON.parse(jsonStr);
```

---

### 问题3：DataView 构造函数报错

**错误现象：**
```
First argument to DataView constructor must be an ArrayBuffer
```

**问题分析：**
微信小程序的 `fs.readFileSync` 返回的数据类型可能不是标准的 `ArrayBuffer`，而是 `Uint8Array` 或其他类型，导致 `DataView` 构造失败。

**解决方案：**
不使用 `DataView`，改用 `Uint8Array` 手动读取字节并组合成 `uint16`。

```javascript
function _fp16ToFp32(fp16Buffer) {
  // 统一转为 Uint8Array
  let uint8Array;
  if (fp16Buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(fp16Buffer);
  } else if (fp16Buffer.buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(fp16Buffer.buffer, fp16Buffer.byteOffset || 0, fp16Buffer.byteLength || fp16Buffer.length);
  } else {
    uint8Array = new Uint8Array(fp16Buffer);
  }
  
  const n = uint8Array.length / 2;
  const fp32 = new Float32Array(n);
  
  // 手动读取两个字节组合成 uint16 (Little-endian)
  for (let i = 0; i < n; i++) {
    const byte1 = uint8Array[i * 2];
    const byte2 = uint8Array[i * 2 + 1];
    const uint16 = byte1 | (byte2 << 8);
    fp32[i] = fp16ToFloat32(uint16);
  }

  return fp32.buffer;
}

// FP16 单值转 FP32
function fp16ToFloat32(h) {
  const sign = (h & 0x8000) >> 15;
  const exp = (h & 0x7C00) >> 10;
  const mantissa = h & 0x03FF;

  if (exp === 0) {
    if (mantissa === 0) return sign ? -0 : 0;
    // Subnormal
    return (sign ? -1 : 1) * Math.pow(2, -14) * (mantissa / 1024);
  } else if (exp === 31) {
    return mantissa ? NaN : (sign ? -Infinity : Infinity);
  }
  return (sign ? -1 : 1) * Math.pow(2, exp - 15) * (1 + mantissa / 1024);
}
```

---

### 问题4：tf.io.fromMemory API 弃用

**错误现象：**
```
Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts.
```

**问题分析：**
TensorFlow.js 3.x 版本中，`tf.io.fromMemory()` 的多参数 API 已弃用，需要改用单参数形式。

**旧 API（已弃用）：**
```javascript
tf.io.fromMemory(modelTopology, weightSpecs, weightData)
```

**新 API：**
```javascript
tf.io.fromMemory({
  modelTopology: modelTopology,
  weightSpecs: weightSpecs,
  weightData: weightData
})
```

**解决方案：**
```javascript
const modelArtifacts = {
  modelTopology: modelConfig.modelTopology,
  weightSpecs: modelConfig.weightsManifest[0].weights,
  weightData: fp32Data  // 单个 ArrayBuffer
};

const ioHandler = tf.io.fromMemory(modelArtifacts);
const model = await converter.loadGraphModel(ioHandler);
```

---

### 问题5：权重数据格式错误

**错误现象：**
```
Based on the provided shape, [34], the tensor should have 34 values but has 62
```

**问题分析：**
- 当尝试将权重数据分割成 `ArrayBuffer[]` 数组时，分割逻辑出错
- `tf.io.fromMemory` 期望 `weightData` 是单个连续的 `ArrayBuffer`，而不是数组

**解决方案：**
直接传递单个 `ArrayBuffer`，让 TensorFlow.js 根据 `weightSpecs` 自动分割。

```javascript
// ❌ 错误方式：分割成数组
const weightDataArray = _splitWeights(fp32Data, weightSpecs);
const modelArtifacts = {
  modelTopology: modelConfig.modelTopology,
  weightSpecs: weightSpecs,
  weightData: weightDataArray  // 不要使用数组
};

// ✅ 正确方式：直接传递 ArrayBuffer
const modelArtifacts = {
  modelTopology: modelConfig.modelTopology,
  weightSpecs: weightSpecs,
  weightData: fp32Data  // 单个 ArrayBuffer
};
```

---

### 问题6：expandDims 方法不存在

**错误现象：**
```
TypeError: resized.expandDims is not a function
```

**问题分析：**
在微信小程序的 TensorFlow.js 环境中，Tensor 对象可能不支持链式方法调用。

**解决方案：**
使用函数形式调用，而不是方法形式。

```javascript
// ❌ 错误方式：方法调用
const batched = resized.expandDims(0);

// ✅ 正确方式：函数调用
const expanded = tf.expandDims(resized, 0);
```

---

### 问题7：toFloat 链式调用失败

**错误现象：**
```
TypeError: tf.expandDims(...).toFloat is not a function
```

**问题分析：**
`tf.expandDims` 返回的对象没有 `toFloat` 方法，不能链式调用。

**解决方案：**
使用 `tf.cast` 函数进行类型转换，并分开调用。

```javascript
// ❌ 错误方式：链式调用
const batched = tf.expandDims(resized, 0).toFloat();

// ✅ 正确方式：分开调用
const expanded = tf.expandDims(resized, 0);
const batched = tf.cast(expanded, 'float32');
```

---

## 关键代码实现

### 完整的模型加载函数

```javascript
/**
 * 从项目目录直接加载模型
 */
function _loadModelFromProject(fs, tempDir, onProgress, fileStorageIO, resolve, reject) {
  try {
    const modelBasePath = 'packageAI/models/posenet';
    
    if (onProgress) onProgress('读取模型文件...', 30);
    
    // 1. 读取 FP16 权重文件
    const fp16Path = modelBasePath + '/shard_fp16.bin';
    const fp16Data = fs.readFileSync(fp16Path);
    
    // 2. FP16 → FP32 转换
    if (onProgress) onProgress('转换权重 (FP16→FP32)...', 50);
    const fp32Data = _fp16ToFp32(fp16Data);
    
    // 3. 读取 model.json（重命名为 .bin）
    const modelBinPath = modelBasePath + '/model.bin';
    const jsonBuffer = fs.readFileSync(modelBinPath);
    const uint8Arr = new Uint8Array(jsonBuffer);
    let jsonStr = '';
    for (let i = 0; i < uint8Arr.length; i++) {
      jsonStr += String.fromCharCode(uint8Arr[i]);
    }
    const modelConfig = JSON.parse(jsonStr);
    
    if (onProgress) onProgress('加载模型到 TFJS...', 80);
    
    // 4. 使用 tf.io.fromMemory 加载模型
    const modelArtifacts = {
      modelTopology: modelConfig.modelTopology,
      weightSpecs: modelConfig.weightsManifest[0].weights,
      weightData: fp32Data
    };
    
    const ioHandler = tf.io.fromMemory(modelArtifacts);
    converter.loadGraphModel(ioHandler).then((model) => {
      _model = model;
      console.log('[PoseEstimator] 从项目目录加载成功');
      
      // 可选：缓存到 fileStorageIO
      if (fileStorageIO) {
        const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
        model.save(handler).then(() => {
          console.log('[PoseEstimator] 已缓存到本地');
        }).catch(() => {});
      }
      
      _warmup();
      resolve();
    }).catch((err) => {
      reject(new Error('模型加载失败: ' + err.message));
    });
    
  } catch (e) {
    reject(new Error('读取模型文件失败: ' + e.message));
  }
}
```

### 完整的推理函数

```javascript
/**
 * 执行姿态估计
 */
function estimatePose(image, imgWidth, imgHeight) {
  return new Promise((resolve, reject) => {
    if (!_initialized || !_model) { 
      reject(new Error('未初始化')); 
      return; 
    }
    
    try {
      const keypoints = tf.tidy(() => {
        // 1. 从图像创建张量
        let input;
        try { 
          input = tf.browser.fromPixels(image); 
        } catch (e) {
          // 备选方案：使用 Canvas 手动提取像素
          const c = wx.createOffscreenCanvas({ type: '2d', width: imgWidth, height: imgHeight });
          const ctx = c.getContext('2d');
          ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
          const d = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
          const rgb = new Int32Array(imgWidth * imgHeight * 3);
          for (let i = 0, j = 0; i < d.length; i += 4, j += 3) { 
            rgb[j] = d[i]; 
            rgb[j+1] = d[i+1]; 
            rgb[j+2] = d[i+2]; 
          }
          input = tf.tensor3d(rgb, [imgHeight, imgWidth, 3]);
        }
        
        // 2. 调整尺寸
        const resized = tf.image.resizeBilinear(input, [513, 513]);
        
        // 3. 添加 batch 维度并转为 float32
        const expanded = tf.expandDims(resized, 0);
        const batched = tf.cast(expanded, 'float32');
        
        // 4. 执行推理
        const output = _model.predict(batched);
        
        // 5. 解析输出
        return _parseOutput(output, imgWidth, imgHeight);
      });

      resolve({ 
        keypoints, 
        inferenceTime: Date.now() - t0 
      });
    } catch (e) { 
      reject(e); 
    }
  });
}
```

---

## 最佳实践总结

### 1. 文件读取策略

| 文件类型 | 读取方式 | 备注 |
|---------|---------|------|
| `.bin` 文件 | `fs.readFileSync(path)` | 直接返回 ArrayBuffer |
| `.json` 文件 | 重命名为 `.bin` 后读取 | 微信小程序限制 |
| 文本文件 | 二进制读取后手动转换 | 避免权限问题 |

### 2. TensorFlow.js 微信小程序注意事项

- **API 调用方式**：使用函数形式而非方法形式
  - ✅ `tf.expandDims(tensor, axis)`
  - ❌ `tensor.expandDims(axis)`

- **类型转换**：使用 `tf.cast` 而非 `.toFloat()`
  - ✅ `tf.cast(tensor, 'float32')`
  - ❌ `tensor.toFloat()`

- **模型加载**：使用 `tf.io.fromMemory` 单参数形式
  - ✅ `tf.io.fromMemory({ modelTopology, weightSpecs, weightData })`
  - ❌ `tf.io.fromMemory(modelTopology, weightSpecs, weightData)`

### 3. 数据类型处理

```javascript
// 统一处理不同来源的 Buffer
function normalizeToArrayBuffer(data) {
  if (data instanceof ArrayBuffer) {
    return data;
  } else if (data.buffer instanceof ArrayBuffer) {
    return data.buffer;
  } else {
    return new Uint8Array(data).buffer;
  }
}
```

### 4. 错误处理模式

```javascript
try {
  // 主要逻辑
} catch (e) {
  console.warn('[ModuleName] 操作失败:', e.message);
  // 备选方案
  try {
    // 备选逻辑
  } catch (e2) {
    reject(new Error('所有方式失败: ' + e2.message));
  }
}
```

---

## 调试技巧

### 1. 日志输出关键信息

```javascript
console.log('[PoseEstimator] FP16 文件大小:', fp16Data.byteLength);
console.log('[PoseEstimator] FP32 数据大小:', fp32Data.byteLength);
console.log('[PoseEstimator] weightData 类型:', typeof fp32Data);
console.log('[PoseEstimator] weights数量:', modelConfig.weightsManifest[0].weights.length);
```

### 2. 验证数据大小

```javascript
// 计算预期总大小
let expectedSize = 0;
for (const spec of weightSpecs) {
  let size = 1;
  for (const dim of spec.shape) {
    size *= dim;
  }
  expectedSize += size;
}
console.log('预期总元素数:', expectedSize, '实际:', fp32Data.byteLength / 4);
```

### 3. 逐步验证

1. 先验证文件读取成功
2. 再验证 FP16→FP32 转换成功
3. 然后验证 JSON 解析成功
4. 最后验证模型加载成功

---

## 常见错误对照表

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `permission denied` | 读取 .json 文件 | 重命名为 .bin |
| `DataView constructor` | Buffer 类型不兼容 | 使用 Uint8Array |
| `Missing catch or finally` | 语法错误 | 检查 try-catch 配对 |
| `expandDims is not a function` | 方法调用方式 | 改用 `tf.expandDims()` |
| `toFloat is not a function` | 链式调用失败 | 改用 `tf.cast()` |
| `should have X values but has Y` | weightData 格式错误 | 使用单个 ArrayBuffer |

---

## 参考资料

- [TensorFlow.js 微信小程序插件官方文档](https://github.com/tensorflow/tfjs-wechat)
- [TensorFlow.js API 文档](https://js.tensorflow.org/api/latest/)
- [微信小程序文件系统 API](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.html)
- [IEEE 754 Half-Precision Format](https://en.wikipedia.org/wiki/Half-precision_floating-point_format)

---

## 版本历史

| 日期 | 修改内容 |
|------|---------|
| 2026-03-25 | 初始版本，记录 PoseNet 本地模型加载调试过程 |

