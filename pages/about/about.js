Page({
  onShow() {
    if (typeof getApp === 'function' && getApp().profileGuard && getApp().profileGuard.guard()) return;
  },

  /**
   * 页面的初始数据
   */
  data: {
    // ⚠️ 1. 请修改为你的博客地址
    blogUrl: 'https://hhxpoint.github.io', 
    
    // ⚠️ 2. 请修改为你放在 assets 文件夹下的二维码图片路径
    qrCodeUrl: '/assets/qrcode.jpg' 
  },

  /**
   * 复制博客链接到剪贴板
   */
  copyBlogUrl() {
    wx.setClipboardData({
      data: this.data.blogUrl,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  /**
   * 预览（放大）二维码图片，方便用户长按识别
   */
  previewQRCode() {
    const currentUrl = this.data.qrCodeUrl;
    // 如果图片路径不为空，则调用微信原生图片预览功能
    if (currentUrl) {
      wx.previewImage({
        urls: [currentUrl], // 必须是数组
        current: currentUrl 
      });
    } else {
      wx.showToast({
        title: '二维码未配置',
        icon: 'none'
      });
    }
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

    // 用户点击客服按钮的回调
  handleContact(e) {
    // 这里虽然不能直接发消息，但可以打印日志，或者做埋点统计
    console.log('用户尝试联系客服，路径:', e.detail.path, '参数:', e.detail.query)
    
  },


})