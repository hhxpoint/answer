// 情感分析器主类
import ModelLoader from './model-loader';
import AudioFeatureExtractor from './audio-feature-extractor';
import { EMOTION_LABELS, AUDIO_CONFIG } from './constants';

export default class EmotionAnalyzer {
  constructor() {
    this.modelLoader = new ModelLoader();
    this.featureExtractor = null;
    this.isInitialized = false;
  }

  // 初始化
  async init() {
    if (this.isInitialized) {
      return true;
    }

    try {
      console.log('初始化情感分析器...');
      
      // 1. 初始化特征提取器
      this.featureExtractor = new AudioFeatureExtractor({
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
        nMfcc: AUDIO_CONFIG.N_MFCC,
        nFft: AUDIO_CONFIG.N_FFT,
        hopLength: AUDIO_CONFIG.HOP_LENGTH,
        nFrames: AUDIO_CONFIG.N_FRAMES
      });
      
      // 2. 加载TensorFlow.js和模型
      await this.modelLoader.loadTFJS();
      const success = await this.modelLoader.loadEmotionModel();
      
      if (!success) {
        throw new Error('模型加载失败');
      }
      
      this.isInitialized = true;
      console.log('情感分析器初始化完成');
      return true;
      
    } catch (error) {
      console.error('初始化失败:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // 分析音频文件
  async analyzeAudioFile(filePath) {
    if (!this.isInitialized) {
      const inited = await this.init();
      if (!inited) {
        throw new Error('情感分析器初始化失败');
      }
    }

    try {
      // 1. 提取MFCC特征
      const features = await this.featureExtractor.extractMFCCFromFile(filePath);
      
      // 2. 特征标准化
      const normalizedFeatures = this.featureExtractor.normalizeFeatures(features);
      
      // 3. 确保特征形状正确
      const processedFeatures = this.prepareFeatures(normalizedFeatures);
      
      // 4. 模型推理
      const result = await this.predict(processedFeatures);
      
      return {
        success: true,
        ...result
      };
      
    } catch (error) {
      console.error('音频分析失败:', error);
      return {
        success: false,
        error: error.message,
        emotion: '分析失败',
        confidence: 0
      };
    }
  }

  // 准备特征（填充/截断）
  prepareFeatures(features) {
    const targetFrames = AUDIO_CONFIG.N_FRAMES;
    const targetMfcc = AUDIO_CONFIG.N_MFCC;
    
    // 如果特征形状不对，进行调整
    if (features.length !== targetFrames || features[0].length !== targetMfcc) {
      console.warn(`特征形状不匹配: ${features.length}x${features[0]?.length || 0}, 调整为: ${targetFrames}x${targetMfcc}`);
      return this.adjustFeatureShape(features, targetFrames, targetMfcc);
    }
    
    return features;
  }

  // 调整特征形状
  adjustFeatureShape(features, targetFrames, targetMfcc) {
    const result = Array(targetFrames).fill().map(() => 
      Array(targetMfcc).fill(0)
    );
    
    const frames = Math.min(features.length, targetFrames);
    const mfccs = Math.min(features[0]?.length || 0, targetMfcc);
    
    for (let i = 0; i < frames; i++) {
      for (let j = 0; j < mfccs; j++) {
        result[i][j] = features[i][j] || 0;
      }
    }
    
    return result;
  }

  // 模型推理
  async predict(features) {
    const model = this.modelLoader.getModel();
    const tf = this.modelLoader.getTF();
    
    // 转换为Tensor
    const inputTensor = tf.tensor3d(
      [features],
      [1, features.length, features[0].length]
    );
    
    // 预测
    const prediction = model.predict(inputTensor);
    const scores = await prediction.data();
    
    // 解析结果
    const result = this.decodePrediction(scores);
    
    // 清理内存
    inputTensor.dispose();
    prediction.dispose();
    
    return result;
  }

  // 解析预测结果
  decodePrediction(scores) {
    const scoreArray = Array.from(scores);
    
    // 找到最高分
    let maxScore = -Infinity;
    let maxIndex = 0;
    
    for (let i = 0; i < scoreArray.length; i++) {
      if (scoreArray[i] > maxScore) {
        maxScore = scoreArray[i];
        maxIndex = i;
      }
    }
    
    // 获取情感标签
    const emotion = EMOTION_LABELS[maxIndex] || '未知';
    const confidence = Math.round(maxScore * 100);
    
    // 所有情感的概率
    const distribution = scoreArray.map((score, index) => ({
      label: EMOTION_LABELS[index] || '未知',
      score: parseFloat(score.toFixed(4)),
      percentage: Math.round(score * 100)
    }));
    
    return {
      emotion,
      confidence,
      distribution,
      timestamp: Date.now()
    };
  }

  // 释放资源
  dispose() {
    this.modelLoader.dispose();
    this.isInitialized = false;
  }
}