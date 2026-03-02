// 情感标签常量
export const EMOTION_LABELS = [
  '生气', '厌恶', '恐惧', '快乐', 
  '中性', '悲伤', '惊讶', '未知'
];

// 音频配置常量
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  N_MFCC: 13,
  N_FFT: 512,
  HOP_LENGTH: 256,
  DURATION: 3.0,  // 音频时长（秒）
  N_FRAMES: 128   // MFCC帧数
};