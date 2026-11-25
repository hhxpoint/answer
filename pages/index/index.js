const app = getApp();


Page({
  // 我们的小火苗（关系空间大厅）
  goCouple() {
    wx.navigateTo({
      url: '/packageCouple/pages/spaces/spaces'
    })
  },

  // 今天吃什么（纯本地菜谱模块）
  goRecipe() {
    wx.navigateTo({
      url: '/packageRecipe/pages/home/home'
    })
  },

  // 二手估价（本地工具）
  goTrade() {
    wx.navigateTo({
      url: '/packageTrade/pages/home/home'
    })
  },

  // 公考题库（行测刷题 + 申论精练）
  goExam() {
    wx.navigateTo({
      url: '/packageExam/pages/home/home'
    })
  },

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
  // randomQA() {
  //   wx.navigateTo({
  //     url: '/pages/detail/detail'
  //   })
  // },

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
      url: `/packagetoken/pages/exam/exam?type=${type}`
    });
  },


  goAlgorithm() {
    wx.navigateTo({
      url: '/packagetoken/pages/algorithm/algorithm',
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
      url: '/packagetoken/pages/word/word'
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


  golab: function() {
    wx.navigateTo({
      url: '/packagepdf/pages/lab/lab'
    })
  },


  gohash: function() {
    wx.navigateTo({
      url: '/packagepdf/pages/hash/hash'
    })
  },

  gomemo: function() {
    wx.navigateTo({
      url: '/packagepdf/pages/memo/memo'
    })
  },

  gopuzzle: function() {
    wx.navigateTo({
      url: '/packagepdf/pages/puzzle/puzzle'
    })
  },

  goimg2pdf: function() {
    wx.navigateTo({
      url: '/packagepdf/pages/img2pdf/img2pdf'
    })
  },

  goWeather: function() {
    wx.navigateTo({
      url: '/packageWeather/pages/weather/weather'
    })
  },


  got: function() {
    wx.navigateTo({
      url: '/particle/pages/t'
    })
  },

  
  goc: function() {
    wx.navigateTo({
      url: '/course/pages/course/course'
    })
  },

  // 教务在线 - 成绩查询
  goScores: function() {
    wx.navigateTo({
      url: '/packageJwzx/pages/scores/scores'
    })
  },

  // 教务在线 - 课表
  goJwzxTimetable: function() {
    wx.navigateTo({
      url: '/packageJwzx/pages/timetable/timetable'
    })
  },


  gob: function() {
    wx.navigateTo({
      url: '/bitcoin/pages/bitcoin/bitcoin'
    })
  },


  gor: function() {
    wx.navigateTo({
      url: '/resume/pages/resume/resume'
    })
  },

  gochess: function() {
  const savedProfile = wx.getStorageSync('gameProfile');
  if (savedProfile) {
    // 有缓存，直接进入对局
    wx.navigateTo({ url: '/chess/pages/chess/chess' });
  } else {
    // 没缓存，去设置身份
    wx.navigateTo({ url: '/chess/pages/user_info/user_info' });
  }

  },



  goSport: function() {
    wx.navigateTo({
      url: '/packageSport/pages/sport/sport'
    })
  },

  goGithub: function() {
    wx.navigateTo({
      url: '/packageGithub/pages/journal/journal'
    })
  },

  goCoach: function() {
    wx.navigateTo({
      url: '/packageAI/pages/loader/index'
    })
  },

  goAR: function() {
    wx.navigateTo({
      url: '/packageAR/pages/ar/ar'
    })
  },

  goFinance: function() {
    wx.navigateTo({
      url: '/packageFinance/pages/index/index'
    })
  },

  goDetect: function() {
    wx.navigateTo({
      url: '/packageDetect/pages/detect/detect'
    })
  },

  // gocode: function() {
  //   wx.navigateTo({
  //     url: '/packagepdf/pages/code/code'
  //   })
  // },


})