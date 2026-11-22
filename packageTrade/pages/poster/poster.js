const storage = require('../../utils/storage.js');
const poster = require('../../utils/poster.js');

Page({
  data: {
    draft: null,
    canvasReady: false,
    tempPath: '',
    saving: false
  },

  onLoad: function () {
    const draft = storage.getDraft();
    if (!draft || !draft.record) {
      wx.showToast({ title: '没有可用的估价单', icon: 'none' });
      setTimeout(function () { wx.navigateBack({ delta: 1 }); }, 800);
      return;
    }
    wx.setNavigationBarTitle({ title: '我的估价单' });
    this.setData({ draft: draft });
  },

  onReady: function () {
    if (this.data.draft) this.initCanvas();
  },

  initCanvas: function () {
    const that = this;
    let tries = 0;
    const run = function () {
      tries += 1;
      const query = wx.createSelectorQuery().in(that);
      query.select('#posterCanvas').fields({ node: true, size: true }).exec(function (res) {
        const info = res && res[0];
        if (!info || !info.node) {
          if (tries < 12) setTimeout(run, 160);
          return;
        }
        const canvas = info.node;
        let dpr = 2;
        try {
          const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
          dpr = Number(win.pixelRatio) || 2;
        } catch (e) {}
        const W = 750;
        const H = 1050;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);
        try {
          poster.draw(ctx, that.buildPosterData(), W, H);
          that._canvas = canvas;
          that.setData({ canvasReady: true }, function () {
            setTimeout(function () { that.prepareTempPath(); }, 120);
          });
        } catch (e) {
          that.setData({ canvasReady: false });
        }
      });
    };
    setTimeout(run, 80);
  },

  buildPosterData: function () {
    const draft = this.data.draft;
    const model = draft.model || {};
    const variant = draft.variant || {};
    const result = draft.result || {};
    return {
      dateText: draft.dateText || '',
      updatedAt: '2026-11',
      brand: model.brand || '',
      year: model.year || '',
      modelName: model.model || '',
      variantLabel: variant.label || '',
      rangeText: result.rangeText || '',
      quickText: result.quickText || '',
      fairText: result.fairText || '',
      patientText: result.patientText || '',
      conditionLabel: result.condition ? result.condition.label : '',
      batteryLabel: result.battery ? result.battery.label : '',
      repairLabel: result.repair ? result.repair.label : '',
      accessoryLabel: result.accessory ? result.accessory.label : '',
      screenLabel: result.screen ? result.screen.label : '',
      customText: result.customText || ''
    };
  },

  prepareTempPath: function () {
    const that = this;
    if (!this._canvas) return;
    wx.canvasToTempFilePath({
      canvas: this._canvas,
      x: 0,
      y: 0,
      width: 750,
      height: 1050,
      destWidth: 1500,
      destHeight: 2100,
      fileType: 'jpg',
      quality: 0.92,
      success: function (res) {
        that.setData({ tempPath: res.tempFilePath });
      }
    }, this);
  },

  saveToAlbum: function () {
    const that = this;
    const doSave = function (path) {
      if (!path) {
        wx.showToast({ title: '图片生成中，请稍候', icon: 'none' });
        that.prepareTempPath();
        return;
      }
      that.setData({ saving: true });
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: function () {
          that.setData({ saving: false });
          wx.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: function (err) {
          that.setData({ saving: false });
          if (String(err.errMsg || '').indexOf('auth') >= 0) {
            wx.showModal({
              title: '需要相册权限',
              content: '保存估价单需要允许访问相册，可以在设置中打开。',
              confirmText: '去设置',
              success: function (r) {
                if (r.confirm) wx.openSetting();
              }
            });
          } else {
            wx.showToast({ title: '保存失败，请重试', icon: 'none' });
          }
        }
      });
    };
    if (this.data.tempPath) doSave(this.data.tempPath);
    else {
      this.prepareTempPath();
      setTimeout(function () { doSave(that.data.tempPath); }, 600);
    }
  },

  shareToFriend: function () {
    const that = this;
    const path = this.data.tempPath;
    if (!path) {
      wx.showToast({ title: '图片生成中，请稍候', icon: 'none' });
      this.prepareTempPath();
      return;
    }
    if (wx.showShareImageMenu) {
      wx.showShareImageMenu({
        path: path,
        fail: function () {
          that.saveToAlbum();
        }
      });
      return;
    }
    this.saveToAlbum();
  },

  previewPoster: function () {
    if (!this.data.tempPath) return;
    wx.previewImage({ urls: [this.data.tempPath] });
  },

  guideShare: function () {
    wx.showModal({
      title: '分享到朋友圈',
      content: '保存估价单到相册后，打开朋友圈发布图片即可。小程序不提供评论、交易或公开列表。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  noop: function () {},

  goMy: function () {
    wx.navigateTo({ url: '/packageTrade/pages/my/my' });
  },

  onShareAppMessage: function () {
    return {
      title: '游戏本二手估价单 · 个人参考',
      path: '/packageTrade/pages/home/home'
    };
  }
});
