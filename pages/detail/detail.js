const { qaList } = require('../../data.js');

Page({
  data: {
    currentQA: null
  },
  onLoad() {
    this.loadRandomQA();
  },
  loadRandomQA() {
    const randomIndex = Math.floor(Math.random() * qaList.length);
    this.setData({
      currentQA: qaList[randomIndex]
    });
  },
  onNext() {
    this.loadRandomQA();
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