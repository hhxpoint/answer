const { qaList } = require('../../data.js');

Page({
  data: {
    currentIndex: 0,
    showAnswer: false, // 初始隐藏答案
    currentQA: null,
    totalCount: 0
  },

  onLoad() {
    this.setData({
      totalCount: qaList.length,
      currentQA: qaList[0]
    });
  },

  // 点击显示答案
  toggleAnswer() {
    this.setData({ showAnswer: true });
  },

  // 下一题
  nextQuestion() {
    let nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.totalCount) {
      wx.showToast({ title: '全部答完啦！', icon: 'success' });
      nextIndex = 0; // 回到第一题
    }
    this.setData({
      currentIndex: nextIndex,
      currentQA: qaList[nextIndex],
      showAnswer: false // 下一题默认隐藏答案
    });
  },
    // 1. 实现“发送给朋友”功能
  onShareAppMessage: function () {
    return {
      title: '故事的开始 - I had all the answers', // 分享显示的标题
      path: '/pages/index/index', // 用户点击分享链接后进入的页面路径
      imageUrl: '/assets/banner1.png' // 分享出的卡片图片，不填则默认截屏
    }
  },

  // 2. 实现“分享到朋友圈”功能
  onShareTimeline: function () {
    return {
      title: '故事的开始 - I had all the answers', // 朋友圈显示的标题
      query: 'id=share', // 点击朋友圈进入时带的参数
      imageUrl: '/assets/banner1.png' // 朋友圈显示的配图
    }
  }
  
});