const app = getApp();


Page({
  // 1. 开始答题 (因为是底部的 Tab 之一，必须用 switchTab)
  goQuiz() {
    wx.switchTab({
      url: '/pages/quiz/quiz'
    })
  },

  // 2. 搜索知识点 (因为是底部的 Tab 之一，必须用 switchTab)
  goSearch() {
    wx.switchTab({
      url: '/pages/search/search'
    })
  },

  // 3. 随机知识点 (跳转到详情页，非 Tab 页面，用 navigateTo 会自动产生返回键)
  randomQA() {
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  },

  // 4. 科学计算器 (跳转到计算器，非 Tab 页面，用 navigateTo 会自动产生返回键)
  goCalc() {
    wx.navigateTo({
      url: '/pages/calc/calc'
    })
  },

  
  // 新增的跳转函数
  goExam: function(e) {
    // 获取 wxml 中 data-type 传过来的值 ("408" 或 "math1")
    const type = e.currentTarget.dataset.type;
    
    wx.navigateTo({
      // 跳转到 exam 页面，顺便带上 type 参数
      url: `/pages/exam/exam?type=${type}`
    });
  },


  goAlgorithm() {
    wx.navigateTo({
      url: '/pages/algorithm/algorithm',
    })
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
  },

  goWords: function() {
    wx.navigateTo({
      url: '/pages/word/word'
    })
  },

  goprocess: function() {
    wx.navigateTo({
      url: '/pages/process/process'
    })
  },

  goemotion: function() {
    wx.navigateTo({
      url: '/pages/emotion-analysis/emotion-analysis'
    })
  },


})