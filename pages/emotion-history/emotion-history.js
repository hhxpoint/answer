Page({
  onShow() {
    if (typeof getApp === 'function' && getApp().profileGuard && getApp().profileGuard.guard()) return;
  },

  data: {
    historyList: [],
    playingId: null // 当前正在播放的音频记录ID
  },

  onShow: function () {
    // 每次显示页面，从缓存拉取最新数据
    const list = wx.getStorageSync('emotionHistory') || [];
    this.setData({ historyList: list });
    
    // 初始化独立播放器
    if (!this.audioCtx) {
      this.audioCtx = wx.createInnerAudioContext();
      this.audioCtx.obeyMuteSwitch = false;
      
      this.audioCtx.onEnded(() => {
        this.setData({ playingId: null });
      });
      this.audioCtx.onError(() => {
        wx.showToast({ title: '音频已失效', icon: 'none' });
        this.setData({ playingId: null });
      });
    }
  },

  onHide: function () {
    // 离开页面时停止播放
    if (this.audioCtx) this.audioCtx.stop();
    this.setData({ playingId: null });
  },

  onUnload: function () {
    if (this.audioCtx) this.audioCtx.destroy();
  },

  // 点击播放/暂停逻辑
  playAudio(e) {
    const { id, path } = e.currentTarget.dataset;
    
    // 如果点击的是当前正在播放的，就暂停
    if (this.data.playingId === id) {
      this.audioCtx.pause();
      this.setData({ playingId: null });
      return;
    }

    // 如果点击了新的，先停止旧的，再播放新的
    this.audioCtx.stop();
    this.audioCtx.src = path;
    this.audioCtx.play();
    this.setData({ playingId: id });
  },


  onShareAppMessage() {
    return { title: '《我是笨蛋本科生，请以我的视角保姆级详细展开》', path: '/pages/emotion-analysis/emotion-analysis' };
  },

  onShareTimeline() {
    return { title: '《我是笨蛋本科生，请以我的视角保姆级详细展开》' };
  },

  
});