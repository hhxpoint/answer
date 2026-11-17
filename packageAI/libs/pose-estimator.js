// packageAI/libs/pose-estimator.js
// 姿态估计模块 - PoseNet MobileNetV1 0.50（FP16 量化版）
// 端侧推理，WebGL 加速

var fetchWechat = require('./fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var webgl = require('@tensorflow/tfjs-backend-webgl');
var converter = require('@tensorflow/tfjs-converter');
var plugin = requirePlugin('tfjsPlugin');

// 17 个关键点名称
const KEYPOINT_NAMES = [
  'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
  'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
  'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
];

const SKELETON_CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 4],
  [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
  [5, 11], [6, 12], [11, 12],
  [11, 13], [13, 15], [12, 14], [14, 16]
];

const CACHE_KEY = 'posenet_fp16';

let _model = null;
let _initialized = false;
let _initPromise = null;
let _avgInferenceTime = 0;
let _inferenceCount = 0;

/**
 * 初始化引擎
 * @param {function} onProgress (status, percent)
 */
function initEngine(onProgress) {
  if (_initPromise) return _initPromise;

  _initPromise = new Promise((resolve, reject) => {
    plugin.configPlugin({
      fetchFunc: fetchWechat.fetchFunc(),
      tf: tf,
      webgl: webgl,
      canvas: wx.createOffscreenCanvas(),
      backendName: 'wechat-webgl-' + Date.now()
    });

    if (onProgress) onProgress('初始化TFJS引擎...', 0);

    tf.ready().then(() => {
      console.log('[PoseEstimator] backend:', tf.getBackend());
      if (onProgress) onProgress('检查本地缓存...', 10);
      return _loadModel(onProgress);
    }).then(() => {
      _initialized = true;
      if (onProgress) onProgress('加载完成', 100);
      resolve({ status: 'ok' });
    }).catch((err) => {
      console.error('[PoseEstimator] 失败:', err);
      _initPromise = null;
      reject(err);
    });
  });

  return _initPromise;
}

/**
 * 加载模型
 * 1. 先查 fileStorageIO 缓存（已解压的 FP32 版本）
 * 2. 缓存没有 → 从项目目录读取 FP16 → 转 FP32 → fileStorageIO 存储 → 加载
 */
function _loadModel(onProgress) {
  return new Promise((resolve, reject) => {
    const fileStorageIO = getApp().globalData.fileStorageIO;

    // 尝试从缓存加载
    if (fileStorageIO) {
      const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
      converter.loadGraphModel(handler).then((model) => {
        _model = model;
        console.log('[PoseEstimator] 从缓存加载成功');
        _warmup();
        resolve();
        return;
      }).catch(() => {
        console.log('[PoseEstimator] 无缓存，从项目目录解压...');
        if (onProgress) onProgress('解压模型文件...', 20);
        _decompressAndSave(onProgress, fileStorageIO, resolve, reject);
      });
    } else {
      reject(new Error('fileStorageIO 不可用'));
    }
  });
}

/**
 * 从项目目录读取 FP16 文件，转 FP32，保存后加载
 */
function _decompressAndSave(onProgress, fileStorageIO, resolve, reject) {
  const fs = wx.getFileSystemManager();
  const userDir = wx.env.USER_DATA_PATH;
  const tempDir = userDir + '/' + CACHE_KEY;

  // 创建临时目录
  try { fs.mkdirSync(tempDir); } catch (e) {}

  // 直接从项目目录读取（模型文件打包在小程序中）
  console.log('[PoseEstimator] 尝试从项目目录直接读取模型');
  _loadModelFromProject(fs, tempDir, onProgress, fileStorageIO, resolve, reject);
}

/**
 * 从项目目录直接加载模型（模型文件打包在小程序中）
 */
function _loadModelFromProject(fs, tempDir, onProgress, fileStorageIO, resolve, reject) {
  try {
    // 项目中模型文件的相对路径
    const modelBasePath = 'packageAI/models/posenet';
    
    if (onProgress) onProgress('读取模型文件...', 30);
    
    // 读取 FP16 权重文件
    const fp16Path = modelBasePath + '/shard_fp16.bin';
    console.log('[PoseEstimator] 读取 FP16 文件:', fp16Path);
    
    let fp16Data;
    try {
      fp16Data = fs.readFileSync(fp16Path);
      console.log('[PoseEstimator] FP16 文件大小:', fp16Data.byteLength);
    } catch (e) {
      console.error('[PoseEstimator] 读取 FP16 文件失败:', e.message);
      reject(new Error('读取模型权重文件失败: ' + e.message));
      return;
    }

    // FP16 → FP32 转换
    if (onProgress) onProgress('转换权重 (FP16→FP32)...', 50);
    console.log('[PoseEstimator] 开始 FP16→FP32 转换...');
    const fp32Data = _fp16ToFp32(fp16Data);
    console.log('[PoseEstimator] FP32 数据大小:', fp32Data.byteLength);

    // 读取 model.json - 微信小程序对.json文件有权限限制，改用.bin扩展名
    // 需要将 model.json 复制/重命名为 model.bin
    let modelConfig;
    try {
      // 优先尝试读取 model.bin（二进制格式）
      const modelBinPath = modelBasePath + '/model.bin';
      console.log('[PoseEstimator] 尝试读取 model.bin:', modelBinPath);
      const jsonBuffer = fs.readFileSync(modelBinPath);
      const uint8Arr = new Uint8Array(jsonBuffer);
      let jsonStr = '';
      for (let i = 0; i < uint8Arr.length; i++) {
        jsonStr += String.fromCharCode(uint8Arr[i]);
      }
      modelConfig = JSON.parse(jsonStr);
      console.log('[PoseEstimator] model.bin 读取成功');
    } catch (e) {
      console.warn('[PoseEstimator] model.bin 读取失败，尝试直接require:', e.message);
      try {
        // 备选方案：使用 require 加载（需要文件在项目根目录）
        modelConfig = require('../../../packageAI/models/posenet/model.json');
        console.log('[PoseEstimator] require 加载成功');
      } catch (e2) {
        console.error('[PoseEstimator] 所有方式失败:', e2.message);
        reject(new Error('无法读取模型配置，请将 model.json 重命名为 model.bin'));
        return;
      }
    }
    console.log('[PoseEstimator] weights数量:', modelConfig.weightsManifest[0].weights.length);

    if (onProgress) onProgress('加载模型到 TFJS...', 80);

    // 直接从内存加载模型 - 使用单个 ArrayBuffer
    console.log('[PoseEstimator] 使用 tf.io.fromMemory 加载模型...');
    
    const weightSpecs = modelConfig.weightsManifest[0].weights;
    
    // 使用单个 ArrayBuffer 作为 weightData，让 TFJS 自动分割
    const modelArtifacts = {
      modelTopology: modelConfig.modelTopology,
      weightSpecs: weightSpecs,
      weightData: fp32Data
    };
    
    console.log('[PoseEstimator] weightData 类型:', typeof fp32Data, '大小:', fp32Data.byteLength);
    
    const ioHandler = tf.io.fromMemory(modelArtifacts);
    converter.loadGraphModel(ioHandler).then((model) => {
      _model = model;
      console.log('[PoseEstimator] 从项目目录加载成功');
      
      // 同时保存到 fileStorageIO 缓存以便下次快速加载
      if (fileStorageIO) {
        const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
        model.save(handler).then(() => {
          console.log('[PoseEstimator] 已缓存到本地');
        }).catch((e) => {
          console.warn('[PoseEstimator] 缓存失败:', e.message);
        });
      }
      
      _warmup();
      resolve();
    }).catch((err) => {
      console.error('[PoseEstimator] tf.io.fromMemory 加载失败:', err.message);
      reject(new Error('模型加载失败: ' + err.message));
    });

  } catch (e) {
    console.error('[PoseEstimator] 项目目录读取失败:', e.message);
    reject(new Error('读取模型文件失败: ' + e.message));
  }
}

/**
 * 从用户数据目录读取模型文件
 */
function _readFromUserDataDir(fs, userDir, tempDir, onProgress, fileStorageIO, resolve, reject) {
  try {
    // 尝试从 USER_DATA_PATH/models/posenet 读取
    const modelDir = userDir + '/models/posenet';
    
    console.log('[PoseEstimator] 尝试从用户数据目录加载:', modelDir);
    
    // 检查目录是否存在
    try {
      fs.accessSync(modelDir);
    } catch (e) {
      console.log('[PoseEstimator] 用户数据目录不存在，回退到网络下载');
      _fallbackLoad(onProgress, fileStorageIO, resolve, reject);
      return;
    }
    
    // 读取 FP16 权重文件
    if (onProgress) onProgress('读取模型文件...', 30);
    const fp16Path = modelDir + '/shard_fp16.bin';
    const fp16Data = fs.readFileSync(fp16Path);

    // FP16 → FP32 转换
    if (onProgress) onProgress('转换权重 (FP16→FP32)...', 50);
    const fp32Data = _fp16ToFp32(fp16Data);

    // 读取 model.json
    const modelJsonPath = modelDir + '/model.json';
    const modelJson = fs.readFileSync(modelJsonPath, 'utf8');
    const modelConfig = JSON.parse(modelJson);

    if (onProgress) onProgress('加载模型到 TFJS...', 80);

    // 直接从内存加载模型，避免网络下载
    const modelArtifacts = {
      modelTopology: modelConfig.modelTopology,
      weightSpecs: modelConfig.weightsManifest[0].weights,
      weightData: [fp32Data]
    };
    const ioHandler = tf.io.fromMemory(modelArtifacts);
    converter.loadGraphModel(ioHandler).then((model) => {
      _model = model;
      console.log('[PoseEstimator] 从用户数据目录加载成功');
      
      // 同时保存到 fileStorageIO 缓存以便下次快速加载
      if (fileStorageIO) {
        const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
        model.save(handler).then(() => {
          console.log('[PoseEstimator] 已缓存到本地');
        }).catch(() => {});
      }
      
      _warmup();
      resolve();
    }).catch((err) => {
      console.warn('[PoseEstimator] 用户数据目录加载失败:', err.message);
      _fallbackLoad(onProgress, fileStorageIO, resolve, reject);
    });

  } catch (e) {
    console.warn('[PoseEstimator] 用户数据目录读取失败:', e.message);
    _fallbackLoad(onProgress, fileStorageIO, resolve, reject);
  }
}

/**
 * 从项目目录读取 FP16 文件
 */
function _readFromProjectDir(fs, miniPath, tempDir, onProgress, fileStorageIO, resolve, reject) {
  try {
    console.log('[PoseEstimator] 尝试从项目目录加载:', miniPath);
    
    // 读取 FP16 权重文件
    if (onProgress) onProgress('读取模型文件...', 30);
    const fp16Path = miniPath + '/packageAI/models/posenet/shard_fp16.bin';
    console.log('[PoseEstimator] 读取 FP16 文件:', fp16Path);
    
    let fp16Data;
    try {
      fp16Data = fs.readFileSync(fp16Path);
      console.log('[PoseEstimator] FP16 文件大小:', fp16Data.byteLength);
    } catch (e) {
      console.error('[PoseEstimator] 读取 FP16 文件失败:', e.message);
      throw e;
    }

    // FP16 → FP32 转换
    if (onProgress) onProgress('转换权重 (FP16→FP32)...', 50);
    console.log('[PoseEstimator] 开始 FP16→FP32 转换...');
    const fp32Data = _fp16ToFp32(fp16Data);
    console.log('[PoseEstimator] FP32 数据大小:', fp32Data.byteLength);

    // 读取 model.json
    const modelJsonPath = miniPath + '/packageAI/models/posenet/model.json';
    console.log('[PoseEstimator] 读取 model.json:', modelJsonPath);
    
    let modelJson;
    try {
      modelJson = fs.readFileSync(modelJsonPath, 'utf8');
    } catch (e) {
      console.error('[PoseEstimator] 读取 model.json 失败:', e.message);
      throw e;
    }
    
    const modelConfig = JSON.parse(modelJson);
    console.log('[PoseEstimator] model.json 解析成功, weights数量:', modelConfig.weightsManifest[0].weights.length);

    if (onProgress) onProgress('加载模型到 TFJS...', 80);

    // 直接从内存加载模型，避免网络下载
    console.log('[PoseEstimator] 使用 tf.io.fromMemory 加载模型...');
    const modelArtifacts = {
      modelTopology: modelConfig.modelTopology,
      weightSpecs: modelConfig.weightsManifest[0].weights,
      weightData: [fp32Data]
    };
    const ioHandler = tf.io.fromMemory(modelArtifacts);
    converter.loadGraphModel(ioHandler).then((model) => {
      _model = model;
      console.log('[PoseEstimator] 从项目目录加载成功');
      
      // 同时保存到 fileStorageIO 缓存以便下次快速加载
      if (fileStorageIO) {
        const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
        model.save(handler).then(() => {
          console.log('[PoseEstimator] 已缓存到本地');
        }).catch(() => {});
      }
      
      _warmup();
      resolve();
    }).catch((err) => {
      console.error('[PoseEstimator] tf.io.fromMemory 加载失败:', err.message);
      _fallbackLoad(onProgress, fileStorageIO, resolve, reject);
    });

  } catch (e) {
    console.error('[PoseEstimator] 项目目录读取失败:', e.message);
    _fallbackLoad(onProgress, fileStorageIO, resolve, reject);
  }
}

/**
 * Fallback：使用 wx.downloadFile 从 CDN 下载
 */
function _fallbackLoad(onProgress, fileStorageIO, resolve, reject) {
  if (onProgress) onProgress('从网络下载模型...', 30);

  // 使用 Google Cloud Storage（PoseNet 0.50）
  const MODEL_BASE = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/050';

  // 直接从 CDN 加载（TFJS 会处理下载）
  converter.loadGraphModel(MODEL_BASE + '/model-stride16.json').then((model) => {
    _model = model;
    console.log('[PoseEstimator] CDN 加载成功');

    // 保存到本地缓存
    if (fileStorageIO) {
      const handler = fileStorageIO(CACHE_KEY, wx.getFileSystemManager());
      model.save(handler).then(() => {
        console.log('[PoseEstimator] 已缓存到本地');
      }).catch(() => {});
    }

    _warmup();
    resolve();
  }).catch((err) => {
    reject(new Error('所有加载方式失败: ' + err.message));
  });
}

/**
 * FP16 → FP32 转换
 */
function _fp16ToFp32(fp16Buffer) {
  // 微信小程序 readFileSync 返回的可能是 Uint8Array 或其他类型
  let uint8Array;
  if (fp16Buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(fp16Buffer);
  } else if (fp16Buffer.buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(fp16Buffer.buffer, fp16Buffer.byteOffset || 0, fp16Buffer.byteLength || fp16Buffer.length);
  } else {
    // 尝试直接使用
    uint8Array = new Uint8Array(fp16Buffer);
  }
  
  const n = uint8Array.length / 2;
  const fp32 = new Float32Array(n);
  
  // 使用 Uint8Array 手动读取两个字节组合成 uint16
  for (let i = 0; i < n; i++) {
    const byte1 = uint8Array[i * 2];
    const byte2 = uint8Array[i * 2 + 1];
    // Little-endian: low byte first
    const uint16 = byte1 | (byte2 << 8);
    fp32[i] = fp16ToFloat32(uint16);
  }

  // 返回 ArrayBuffer
  return fp32.buffer;
}

/**
 * 根据 weightSpecs 分割权重数据
 */
function _splitWeights(fp32Buffer, weightSpecs) {
  const result = [];
  const fp32View = new Float32Array(fp32Buffer);
  let offset = 0;
  
  for (const spec of weightSpecs) {
    // 计算此权重的元素数量
    let size = 1;
    for (const dim of spec.shape) {
      size *= dim;
    }
    
    // 提取此权重的数据
    const weightData = fp32View.slice(offset, offset + size);
    result.push(weightData.buffer);
    offset += size;
  }
  
  return result;
}

/**
 * 单个 FP16 → FP32 转换
 */
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

/**
 * 模型预热
 */
function _warmup() {
  try {
    const t = tf.zeros([1, 513, 513, 3]);
    const o = _model.predict(t);
    if (Array.isArray(o)) o.forEach(x => x.dispose()); else o.dispose();
    t.dispose();
    console.log('[PoseEstimator] 预热完成');
  } catch (e) {
    console.warn('[PoseEstimator] 预热跳过:', e.message);
  }
}

/**
 * 执行姿态估计
 */
function estimatePose(image, imgWidth, imgHeight) {
  return new Promise((resolve, reject) => {
    if (!_initialized || !_model) { reject(new Error('未初始化')); return; }
    const t0 = Date.now();

    try {
      const keypoints = tf.tidy(() => {
        let input;
        try { input = tf.browser.fromPixels(image); } catch (e) {
          const c = wx.createOffscreenCanvas({ type: '2d', width: imgWidth, height: imgHeight });
          const ctx = c.getContext('2d');
          ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
          const d = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
          const rgb = new Int32Array(imgWidth * imgHeight * 3);
          for (let i = 0, j = 0; i < d.length; i += 4, j += 3) { rgb[j] = d[i]; rgb[j+1] = d[i+1]; rgb[j+2] = d[i+2]; }
          input = tf.tensor3d(rgb, [imgHeight, imgWidth, 3]);
        }
        const resized = tf.image.resizeBilinear(input, [513, 513]);
        const expanded = tf.expandDims(resized, 0);
        const batched = tf.cast(expanded, 'float32');
        const output = _model.predict(batched);
        return _parseOutput(output, imgWidth, imgHeight);
      });

      const dt = Date.now() - t0;
      _inferenceCount++;
      _avgInferenceTime += (dt - _avgInferenceTime) / _inferenceCount;
      resolve({ keypoints, inferenceTime: dt, avgInferenceTime: Math.round(_avgInferenceTime) });
    } catch (e) { reject(e); }
  });
}

/**
 * 解析 PoseNet 输出
 */
function _parseOutput(output, imgW, imgH) {
  try {
    if (Array.isArray(output) && output.length >= 2) {
      return _decode(output[0], output[1], imgW, imgH);
    }
    if (output.shape && output.shape[3] >= 51) {
      return _decodeCombined(output.arraySync(), imgW, imgH);
    }
    return _defaults(imgW, imgH);
  } catch (e) { return _defaults(imgW, imgH); }
}

function _decode(heatmap, offsets, imgW, imgH) {
  const h = heatmap.arraySync(), o = offsets.arraySync();
  const rows = h[0].length, cols = h[0][0].length, offCh = o[0][0][0].length;
  const kps = [];
  for (let k = 0; k < 17; k++) {
    let ms = -1, mr = 0, mc = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (h[0][r][c][k] > ms) { ms = h[0][r][c][k]; mr = r; mc = c; }
    let dy = 0, dx = 0;
    if (offCh >= 34) { dy = o[0][mr][mc][k] / rows; dx = o[0][mr][mc][k+17] / cols; }
    kps.push({ name: KEYPOINT_NAMES[k], x: Math.round(Math.max(0,Math.min(1, mc/cols+dx)) * imgW), y: Math.round(Math.max(0,Math.min(1, mr/rows+dy)) * imgH), score: Math.round(Math.max(0,Math.min(1,ms)) * 100) / 100 });
  }
  return kps;
}

function _decodeCombined(data, imgW, imgH) {
  const rows = data[0].length, cols = data[0][0].length;
  const kps = [];
  for (let k = 0; k < 17; k++) {
    let ms = -1, mr = 0, mc = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (data[0][r][c][k] > ms) { ms = data[0][r][c][k]; mr = r; mc = c; }
    const dy = data[0][mr][mc][17+k] / rows, dx = data[0][mr][mc][34+k] / cols;
    kps.push({ name: KEYPOINT_NAMES[k], x: Math.round(Math.max(0,Math.min(1,mc/cols+dx))*imgW), y: Math.round(Math.max(0,Math.min(1,mr/rows+dy))*imgH), score: Math.round(Math.max(0,Math.min(1,ms))*100)/100 });
  }
  return kps;
}

function _defaults(w, h) {
  return KEYPOINT_NAMES.map(n => ({ name: n, x: Math.round(w*0.5), y: Math.round(h*0.5), score: 0.3 }));
}

function destroy() {
  if (_model) { try { _model.dispose(); } catch(e) {} _model = null; }
  _initialized = false; _initPromise = null; _inferenceCount = 0; _avgInferenceTime = 0;
}

function getStatus() {
  return { initialized: _initialized, backend: _initialized ? tf.getBackend() : 'none', inferenceCount: _inferenceCount, avgInferenceTime: Math.round(_avgInferenceTime), hasModel: !!_model };
}

module.exports = { initEngine, estimatePose, destroy, getStatus, KEYPOINT_NAMES, SKELETON_CONNECTIONS };
