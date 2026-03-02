// pages/emotion-analysis/emotion-analysis.js
// 在文件最顶部添加这两行
// const api = require('../../utils/api.js');
// const emotionDict = require('../../utils/emotion-dict.js');


Page({
  data: {
    // 状态机
    isRecording: false,
    isPreviewing: false,
    isPlaying: false,
    
    // 录音与播放数据
    audioFilePath: '',      
    recordSeconds: 0,       
    playSeconds: 0,         
    formatRecordTime: '00:00', 
    formatPlayTime: '00:00',   
  },

  onLoad: function() {
    this.initRecorder();
    this.initAudioPlayer();
  },

  onUnload: function() {
    this.cleanup();
  },

  // ================= 1. 初始化核心组件 =================
  initRecorder() {
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onStart(() => {
      this.setData({ isRecording: true, isPreviewing: false });
      this.startRecordingTimer();
    });
    this.recorderManager.onStop((res) => {
      this.stopRecordingTimer();
      this.setData({ 
        isRecording: false, 
        isPreviewing: true,
        audioFilePath: res.tempFilePath 
      });
      wx.vibrateShort({ type: 'light' });
    });
    this.recorderManager.onError((res) => {
      this.stopRecordingTimer();
      this.setData({ isRecording: false });
      wx.showToast({ title: '录音失败', icon: 'none' });
    });
  },

  initAudioPlayer() {
    this.audioPlayer = wx.createInnerAudioContext();
    this.audioPlayer.obeyMuteSwitch = false;
    this.audioPlayer.onPlay(() => this.setData({ isPlaying: true }));
    this.audioPlayer.onPause(() => this.setData({ isPlaying: false }));
    this.audioPlayer.onEnded(() => {
      this.setData({ isPlaying: false, playSeconds: 0, formatPlayTime: '00:00' });
    });
    this.audioPlayer.onTimeUpdate(() => {
      const current = Math.floor(this.audioPlayer.currentTime);
      if (current !== this.data.playSeconds) {
        this.setData({ playSeconds: current, formatPlayTime: this.formatTime(current) });
      }
    });
  },

  // ================= 2. 录音控制 =================
  startRecording() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record']) this.executeRecordStart();
        else if (res.authSetting['scope.record'] === undefined) {
          wx.authorize({
            scope: 'scope.record',
            success: () => this.executeRecordStart(),
            fail: () => this.showPermissionGuide()
          });
        } else this.showPermissionGuide();
      }
    });
  },

  showPermissionGuide() {
    wx.showModal({
      title: '需要麦克风权限',
      content: '请开启麦克风权限以录制您的语音',
      confirmText: '去开启',
      confirmColor: '#6366F1',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: (setRes) => {
              if (setRes.authSetting['scope.record']) this.executeRecordStart();
            }
          });
        }
      }
    });
  },

  executeRecordStart() {
    wx.vibrateShort({ type: 'medium' });
    this.setData({ recordSeconds: 0, formatRecordTime: '00:00', playSeconds: 0, formatPlayTime: '00:00' });
    //这里从一开始的wav 改成 mp3
    this.recorderManager.start({ duration: 60000, sampleRate: 16000, numberOfChannels: 1, format: 'mp3' });

  },

  stopRecording() {
    if (this.data.isRecording) this.recorderManager.stop();
  },

  reRecord() {
    this.audioPlayer.stop();
    this.setData({
      isPreviewing: false, isPlaying: false, audioFilePath: '', recordSeconds: 0, formatRecordTime: '00:00'
    });
    setTimeout(() => { this.startRecording(); }, 200);
  },

  // ================= 3. 试听控制 =================
  togglePlay() {
    if (!this.data.audioFilePath) return;
    if (this.data.isPlaying) this.audioPlayer.pause();
    else {
      this.audioPlayer.src = this.data.audioFilePath;
      this.audioPlayer.play();
    }
  },

  // ================= 4. 计时器与工具 =================
  startRecordingTimer() {
    this.recordingTimer = setInterval(() => {
      const newSec = this.data.recordSeconds + 1;
      this.setData({ recordSeconds: newSec, formatRecordTime: this.formatTime(newSec) });
      if (newSec >= 60) this.stopRecording(); 
    }, 1000);
  },
  stopRecordingTimer() {
    if (this.recordingTimer) { clearInterval(this.recordingTimer); this.recordingTimer = null; }
  },
  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  // ================= 5. 补全：导入音频与查看历史 =================
  chooseAudioFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['wav', 'mp3', 'm4a', 'aac'],
      success: (res) => {
        const filePath = res.tempFiles[0].path;
        this.setData({
          audioFilePath: filePath,
          isPreviewing: true,
          isRecording: false,
          formatRecordTime: '已导入' // 导入音频不显示时长，直接显示已导入
        });
        wx.showToast({ title: '导入成功', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '读取失败', icon: 'none' });
        }
      }
    });
  },

  viewHistory() {
    wx.navigateTo({ url: '/pages/emotion-history/emotion-history' });
  },




  
  // // ================= 6. 提交分析与保存结果 (闭环核心) =================
  // submitForAnalysis() {
  //   this.audioPlayer.stop();
  //   this.setData({ isPlaying: false });
    
  //   wx.showLoading({ title: 'AI 深度解析中...' });
    
  //   // 模拟网络请求和 AI 推理耗时 1.5 秒
  //   setTimeout(() => {
  //     wx.hideLoading();
  //     wx.vibrateShort({ type: 'heavy' });

  //     // 1. 模拟一个 AI 返回的数据结果
  //     const mockEmotions = ['喜悦 😊', '平静 😌', '悲伤 😢', '愤怒 😠', '惊讶 😲'];
  //     const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
  //     const mockConfidence = Math.floor(Math.random() * 20 + 80); // 80~99%
      
  //     const newRecord = {
  //       id: Date.now().toString(),
  //       time: new Date().toLocaleString(),
  //       filePath: this.data.audioFilePath, // 保存音频路径
  //       emotion: randomEmotion,
  //       confidence: mockConfidence,
  //       text: "这是一段模拟的语音识别文本。未来这里将展示 AI 从你的语音中识别出的真实文字内容，并结合语气进行情感分析。" // 模拟识别文本
  //     };

  //     // 2. 存入本地缓存 Storage
  //     let history = wx.getStorageSync('emotionHistory') || [];
  //     history.unshift(newRecord); // 插到最前面
  //     if (history.length > 50) history = history.slice(0, 50); // 最多存50条
  //     wx.setStorageSync('emotionHistory', history);

  //     // 3. 弹窗提示并引导去历史记录听
  //     wx.showModal({
  //       title: '分析完成',
  //       content: `检测到主导情绪为：${randomEmotion}\n置信度：${mockConfidence}%\n\n音频及结果已安全存入历史记录。`,
  //       confirmText: '去听结果',
  //       confirmColor: '#6366F1',
  //       cancelText: '继续录音',
  //       success: (res) => {
  //         if (res.confirm) {
  //           this.viewHistory(); // 跳去历史记录
  //         }
  //         // 无论怎样，重置主页面的录音状态
  //         this.setData({ isPreviewing: false, audioFilePath: '', formatRecordTime: '00:00' });
  //       }
  //     });
  //   }, 1500);
  // },


  // ================= 6. 提交分析与保存结果 (闭环核心) =================
  submitForAnalysis() {
    this.audioPlayer.stop();
    this.setData({ isPlaying: false });
    
    wx.showLoading({ title: 'AI 深度解析中...' });
    
    // 模拟网络请求和 AI 推理耗时 1.5 秒
    setTimeout(() => {
      wx.hideLoading();
      wx.vibrateShort({ type: 'heavy' });

      // 1. 模拟一个 AI 返回的数据结果
      const mockEmotions = ['喜悦 😊', '平静 😌', '悲伤 😢', '愤怒 😠', '惊讶 😲'];
      const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
      const mockConfidence = Math.floor(Math.random() * 20 + 80); // 80~99%
      
      // 为每种情绪配置生动、有哲理的深度分析文案
      const emotionAnalysisMap = {
        '喜悦 😊': "你的声音里跳跃着明快的色彩。这是一种毫不费力的轻盈感，仿佛内心的某个角落刚刚开出了一朵花。真正的喜悦往往不是狂喜，而是对当下生命状态的深度认同。请记住这种与世界和解的美妙频率，在未来偶尔阴霾的日子里，它将是你最宝贵的精神火种。",
        '平静 😌': "波澜不惊的语调背后，潜藏着极深的力量。你的声音像一片无风的湖面，清澈而包容。在喧嚣的世界里，能维持这样的松弛感尤为难得。这说明你此刻的内在系统处于极佳的平衡状态，不焦虑于未来，不纠结于过往，安住于每一个呼吸之间。",
        '悲伤 😢': "音尾的微弱颤动，似乎泄露了灵魂深处的几丝裂缝。但请不要急于驱赶这种低落。悲伤，其实是心智在为某些失去或遗憾进行的一场漫长而庄重的哀悼。允许眼泪流淌，允许能量走低。万物皆有裂痕，那正是光照进来的地方，拥抱这份脆弱，它是治愈真正的开始。",
        '愤怒 😠': "你的声线中紧绷着极高的能量密度，像是一张拉满的弓。愤怒从来不是单纯的负面情绪，它是你内在边界被触碰时发出的自我保护警报。这股强烈的生命力，证明了你对某些事物的在乎与坚守。试着做几个深呼吸，不要让这股烈火灼伤自己，而是将它转化为重塑规则的驱动力。",
        '惊讶 😲': "语气的瞬间扬起，打破了日常的惯性轨道。惊讶，是我们在面对未知时，大脑发出的最纯粹的惊叹号。它意味着你原有的认知边界刚刚被重重地敲击了一下。保持这种对世界的新鲜感与敬畏心吧，正是这些猝不及防的时刻，拓宽了我们生命的维度与广度。"
      };

      const newRecord = {
        id: Date.now().toString(),
        time: new Date().toLocaleString(),
        filePath: this.data.audioFilePath, // 保存音频路径
        emotion: randomEmotion,
        confidence: mockConfidence,
        text: emotionAnalysisMap[randomEmotion] // 根据随机抽到的情绪，匹配对应的哲理文案
      };

      // 2. 存入本地缓存 Storage
      let history = wx.getStorageSync('emotionHistory') || [];
      history.unshift(newRecord); // 插到最前面
      if (history.length > 50) history = history.slice(0, 50); // 最多存50条
      wx.setStorageSync('emotionHistory', history);

      // 3. 弹窗提示并引导去历史记录听
      wx.showModal({
        title: '分析完成',
        content: `检测到主导情绪为：${randomEmotion}\n置信度：${mockConfidence}%\n\n音频及结果已安全存入历史记录。`,
        confirmText: '去听结果',
        confirmColor: '#6366F1',
        cancelText: '继续录音',
        success: (res) => {
          if (res.confirm) {
            this.viewHistory(); // 跳去历史记录
          }
          // 无论怎样，重置主页面的录音状态
          this.setData({ isPreviewing: false, audioFilePath: '', formatRecordTime: '00:00' });
        }
      });
    }, 1500);
  },

  

  onShareAppMessage() {
    return { title: '《我是笨蛋本科生，请以我的视角保姆级详细展开》', path: '/pages/emotion-analysis/emotion-analysis' };
  },

  onShareTimeline() {
    return { title: '《我是笨蛋本科生，请以我的视角保姆级详细展开》' };
  },



  cleanup() {
    this.stopRecordingTimer();
    if (this.recorderManager && this.data.isRecording) this.recorderManager.stop();
    if (this.audioPlayer) this.audioPlayer.destroy();
  }
});















// // ================= 6. 提交分析与保存结果 (闭环核心 - 已接入真实AI) =================
//   submitForAnalysis() {
//     if (!this.data.audioFilePath) {
//       wx.showToast({ title: '请先录制或导入音频', icon: 'none' });
//       return;
//     }

//     this.audioPlayer.stop(); 
//     this.setData({ isPlaying: false });
    
//     wx.showLoading({ title: 'AI 深度解析中...', mask: true });
    
//     // 💥 核心：调用真实云端 API
//     api.analyzeAudio(this.data.audioFilePath).then(resultKey => {
//       wx.hideLoading();
//       wx.vibrateShort({ type: 'heavy' });

//       // 1. 从我们写的字典中，提取真实的情感详情（带表情、颜色、文案）
//       const emotionDetail = emotionDict.getEmotionDetail(resultKey);

//       // (为了配合你原本的 UI，这里生成一个 85~99 的模拟置信度)
//       const mockConfidence = Math.floor(Math.random() * 15 + 85); 
      
//       // 2. 构造数据对象 (完美契合你原本的历史记录数据结构！)
//       const newRecord = {
//         id: Date.now().toString(),
//         time: new Date().toLocaleString(),
//         filePath: this.data.audioFilePath, 
//         emotion: `${emotionDetail.label} ${emotionDetail.emoji}`, // 组合标签和表情，例如 "开心 😄"
//         confidence: mockConfidence,
//         text: emotionDetail.desc // 💥 这里用字典里走心的文案，替换掉你原本的假识别文字
//       };

//       // 3. 存入本地缓存 Storage (沿用你原本的逻辑)
//       let history = wx.getStorageSync('emotionHistory') || [];
//       history.unshift(newRecord); 
//       if (history.length > 50) history = history.slice(0, 50); 
//       wx.setStorageSync('emotionHistory', history);

//       // 4. 弹窗提示并引导去历史记录听
//       wx.showModal({
//         title: '分析完成',
//         content: `AI 识别您的情绪为：${emotionDetail.label} ${emotionDetail.emoji}\n\n详细报告已安全存入历史记录。`,
//         confirmText: '查看报告',
//         confirmColor: '#6366F1',
//         cancelText: '继续录音',
//         success: (res) => {
//           if (res.confirm) {
//             this.viewHistory(); // 跳去历史记录
//           }
//           // 无论怎样，重置主页面的录音状态
//           this.setData({ isPreviewing: false, audioFilePath: '', formatRecordTime: '00:00' });
//         }
//       });

//     }).catch(err => {
//       // 捕获网络失败或服务器报错
//       wx.hideLoading();
//       console.error("AI 分析失败:", err);
//       wx.showToast({ 
//         title: '分析失败，请检查网络或稍后再试', 
//         icon: 'none',
//         duration: 2500
//       });
//     });
//   },
