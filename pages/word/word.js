// pages/word/word.js
const ky1 = require('../../utils/dictionary/ky_part1.js');
const ky2 = require('../../utils/dictionary/ky_part2.js');
const ky3 = require('../../utils/dictionary/ky_part3.js');
const ky4 = require('../../utils/dictionary/ky_part4.js');
const cet6 = require('../../utils/dictionary/cet6.js');

Page({
  data: {
    wordList: [],
    currentIndex: 0,
    currentWord: null,
    showMeaning: false
  },

  // 内部使用的音频实例，不放在 data 里
  _audio: null,

  onLoad: function () {
    this.initAudio();
    this.loadDictionary();
  },

  // 初始化音频实例及错误监听
  initAudio: function() {
    this._audio = wx.createInnerAudioContext();
    
    // 关键：捕捉具体的错误信息并弹窗显示
    this._audio.onError((res) => {
      console.error('音频错误对象:', res);
      // 将错误对象转为字符串，防止显示 [object Object]
      const errorMsg = JSON.stringify(res);
      wx.showModal({
        title: '播放失败诊断',
        content: `错误信息: ${res.errMsg} \n 错误码: ${res.errCode}`,
        showCancel: false
      });
    });
  },

  // 加载词库
  loadDictionary: function() {
    const all = [
      ...(ky1.wordList || []),
      ...(ky2.wordList || []),
      ...(ky3.wordList || []),
      ...(ky4.wordList || []),
      ...(cet6.wordList || [])
    ];
    this.initRandomWords(all);
  },

  // 播放发音核心函数
  readWord: function() {
    // 1. 检查数据是否存在
    if (!this.data.currentWord || !this.data.currentWord.word) {
      wx.showToast({ title: '无单词数据', icon: 'none' });
      return;
    }

    const word = this.data.currentWord.word;
    // 2. 编码单词（处理空格或特殊字符）
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`;
    
    console.log('正在播放:', word);

    // 3. 执行播放流程
    this._audio.stop(); 
    this._audio.src = url;
    
    // 延迟一小会儿播放，防止某些机型实例还没准备好
    setTimeout(() => {
      this._audio.play();
    }, 50);
  },

  /* --- 下面是单词逻辑，保持稳定 --- */
  initRandomWords: function(allWords) {
    if (!allWords || allWords.length === 0) return;
    let shuffled = this.shuffle([...allWords]); 
    let selected = shuffled.slice(0, 100);
    this.setData({
      wordList: selected,
      currentIndex: 0,
      currentWord: selected[0],
      showMeaning: false
    });
  },

  shuffle: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  toggleMeaning: function() {
    this.setData({ showMeaning: !this.data.showMeaning });
  },

  nextWord: function() {
    let nextIndex = this.data.currentIndex + 1;
    if (nextIndex < this.data.wordList.length) {
      this.setData({
        currentIndex: nextIndex,
        currentWord: this.data.wordList[nextIndex],
        showMeaning: false
      });
    } else {
      wx.showModal({ title: '挑战完成', content: '恭喜背完100词！', showCancel: false, success: () => wx.navigateBack() });
    }
  },

  prevWord: function() {
    if (this.data.currentIndex > 0) {
      let prevIndex = this.data.currentIndex - 1;
      this.setData({
        currentIndex: prevIndex,
        currentWord: this.data.wordList[prevIndex],
        showMeaning: false
      });
    }
  },

  onUnload: function() {
    if (this._audio) this._audio.destroy();
  },

  /**
   * 用户点击右上角分享给朋友
   */
  onShareAppMessage: function () {
    return {
      title: '让单词进入心流，you are champion!', // 转发时的标题
      path: '/pages/word/word' // 转发出去点击后打开的页面路径
    }
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '让单词进入心流，you are champion!' // 朋友圈显示的标题
    }
  }
});