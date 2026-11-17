// utils/imageScanner.js

/**
 * 工业级超清精细文档增强算法 (极致画质版)
 * 特点：保留原本字体粗细和自然过渡，强化阴影抑制，多尺度环境光检测，平滑降噪。
 * 允许较高复杂度以换取完美的肉眼感官（类似纯平扫描仪）。
 * 
 * @param {ImageData} imageData - canvas 传入的原始像素数据
 * @param {Object} options - 配置参数 (可选)
 * @returns {ImageData} - 处理后的像素数据
 */
export function enhanceDocument(imageData, options = {}) {
  // 精细化参数矩阵调优
  const config = {
    // 【阴影抑制】敏感度：决定如何判断文字与背景。越小越细腻
    sensitivity: 0.10,         
    // 【多尺度光照】
    windowRatioSmall: 30,       // 小尺度窗口：捕捉细微的光影变化，保留细笔画
    windowRatioLarge: 8,        // 大尺度窗口：镇压大面积渐变阴影
    blendRatio: 0.6,            // 小窗口在此算法中的权重
    // 【笔迹强化】
    darkenFactor: 35,           // 字体柔和加深系数
    contrastBoost: 1.15,        // 对比度拉伸强度，让字不发灰，但不至于生硬
    // 【微观锐化】
    sharpenAmount: 1.0,         // USM锐化强度
    blurRadiusFactor: 350,      // USM模糊半径因子
    // 【伽马感知】
    gamma: 0.85,                // 灰度伽马，压暗浅色细线
    // 【保留微小细节(抗锯齿/噪点控制)】
    noiseThreshold: 8,          // 背景白化的柔和宽容度
    ...options
  };

  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const totalPixels = width * height;

  const grayData = new Uint8Array(totalPixels);
  
  // 用于大/小双尺度的积分图以获得极其精准的光照估计
  const integralDataSmall = new Uint32Array(totalPixels); 
  const integralDataLarge = new Uint32Array(totalPixels); 

  // 1. 高精度灰度和 Gamma 校正
  const gammaLUT = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    gammaLUT[i] = Math.min(255, Math.pow(i / 255.0, config.gamma) * 255.0);
  }

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // 采用更贴近人类视觉的高精度亮度感知转换
    // Y = 0.2126 R + 0.7152 G + 0.0722 B (Rec.709)
    let g = (data[i] * 54 + data[i + 1] * 183 + data[i + 2] * 19) >> 8;
    grayData[j] = gammaLUT[g];
  }

  // 2. 双边滤波思想的前置降噪与 USM 锐化分离
  // 构建第一次积分图用于快速模糊以进行高保真锐化
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      let index = y * width + x;
      rowSum += grayData[index];
      integralDataSmall[index] = y === 0 ? rowSum : integralDataSmall[index - width] + rowSum;
    }
  }

  const blurredData = new Uint8Array(totalPixels);
  const blurR = Math.max(1, Math.floor(width / config.blurRadiusFactor)); 

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const x1 = Math.max(x - blurR, 0); const x2 = Math.min(x + blurR, width - 1);
      const y1 = Math.max(y - blurR, 0); const y2 = Math.min(y + blurR, height - 1);
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);

      let sum = integralDataSmall[y2 * width + x2];
      if (x1 > 0) sum -= integralDataSmall[y2 * width + (x1 - 1)];
      if (y1 > 0) sum -= integralDataSmall[(y1 - 1) * width + x2];
      if (x1 > 0 && y1 > 0) sum += integralDataSmall[(y1 - 1) * width + (x1 - 1)];

      blurredData[index] = sum / count;
      
      // 智能 USM (Unsharp Masking)：如果对比度极高的边缘才锐化，平缓区域不锐化以防噪声放大
      let detail = grayData[index] - blurredData[index];
      // 只有边缘细节明显时才增强
      let sharpenWeight = Math.abs(detail) > 5 ? config.sharpenAmount : config.sharpenAmount * 0.3;
      let sharpened = grayData[index] + detail * sharpenWeight;
      grayData[index] = Math.max(0, Math.min(255, sharpened));
    }
  }

  // 3. 构建多尺度环境光照积分图 (基于锐化后的高质量灰度图)
  // 这会消耗更多内存和一点时间，但是能完美解决【小字断触】与【大面积黑影】的冲突
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      let index = y * width + x;
      rowSum += grayData[index];
      const val = y === 0 ? rowSum : integralDataLarge[index - width] + rowSum;
      integralDataSmall[index] = val; // 复用数组，重新填入
      integralDataLarge[index] = val;
    }
  }

  // 4. 多尺度环境光照融合及极其柔和的底部净化映射
  const sSmall = Math.max(4, Math.floor(width / config.windowRatioSmall));
  const sSmallHalf = Math.floor(sSmall / 2);
  
  const sLarge = Math.max(16, Math.floor(width / config.windowRatioLarge));
  const sLargeHalf = Math.floor(sLarge / 2);

  const thresholdRatio = 1.0 - config.sensitivity;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const pixelGray = grayData[index];

      // ------ 小尺度光照估计 ------
      const x1S = Math.max(x - sSmallHalf, 0); const x2S = Math.min(x + sSmallHalf, width - 1);
      const y1S = Math.max(y - sSmallHalf, 0); const y2S = Math.min(y + sSmallHalf, height - 1);
      const countS = (x2S - x1S + 1) * (y2S - y1S + 1);
      let sumS = integralDataSmall[y2S * width + x2S];
      if (x1S > 0) sumS -= integralDataSmall[y2S * width + (x1S - 1)];
      if (y1S > 0) sumS -= integralDataSmall[(y1S - 1) * width + x2S];
      if (x1S > 0 && y1S > 0) sumS += integralDataSmall[(y1S - 1) * width + (x1S - 1)];
      const meanSmall = sumS / countS;

      // ------ 大尺度光照估计 ------
      const x1L = Math.max(x - sLargeHalf, 0); const x2L = Math.min(x + sLargeHalf, width - 1);
      const y1L = Math.max(y - sLargeHalf, 0); const y2L = Math.min(y + sLargeHalf, height - 1);
      const countL = (x2L - x1L + 1) * (y2L - y1L + 1);
      let sumL = integralDataLarge[y2L * width + x2L];
      if (x1L > 0) sumL -= integralDataLarge[y2L * width + (x1L - 1)];
      if (y1L > 0) sumL -= integralDataLarge[(y1L - 1) * width + x2L];
      if (x1L > 0 && y1L > 0) sumL += integralDataLarge[(y1L - 1) * width + (x1L - 1)];
      const meanLarge = sumL / countL;

      // ------ 多尺度融合 ------
      // 核心理念：大窗口把握全局极其沉重的阴影，小窗口把握单个文字周围微妙的纹理
      const localMean = (meanSmall * config.blendRatio) + (meanLarge * (1.0 - config.blendRatio));

      let finalColor;

      // 5. 像素渲染引擎：模拟真实扫描仪中光电视觉管的宽容度平缓衰减
      const localThreshold = localMean * thresholdRatio;
      
      // 添加绝对白点保护，防止高光区噪点被误认为字
      if (pixelGray < localThreshold && pixelGray < 240) {
        // [确认为前景内容：字迹、图像线条]
        let depth = localMean - pixelGray;
        // 使用非线性加深，极其柔和：中心点重墨，边缘自然衰减
        // 降低 depth 的权重，以防止因环境光计算过激导致突兀断层
        let baseDarken = pixelGray - config.darkenFactor - (depth * 0.55);
        
        let contrastColor = (baseDarken - 128) * config.contrastBoost + 128;
        finalColor = Math.max(0, Math.min(255, contrastColor));
        
      } else {
        // [确认为背景/微弱噪点] 
        // 抛弃暴力的直接 = 255，而是使用软性高光剪切。
        // 如果像素处于阈值的边界（微弱的灰色），让它非常平滑地滑向255，这能保留极美的抗锯齿
        const distanceToThreshold = pixelGray - localThreshold;
        
        if (distanceToThreshold < config.noiseThreshold && pixelGray < 252) {
           // 处于被剪切边缘的浅色噪点/笔峰收边，保留些许灰度
           const fadeRatio = distanceToThreshold / config.noiseThreshold;
           finalColor = Math.min(255, pixelGray + (255 - pixelGray) * fadeRatio);
        } else {
           finalColor = 255;
        }
      }

      // 回填数据
      const dataIndex = index * 4;
      data[dataIndex]     = finalColor;
      data[dataIndex + 1] = finalColor;
      data[dataIndex + 2] = finalColor;
    }
  }

  return imageData;
}