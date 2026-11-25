const api = require('../../utils/api.js');

Page({
  data: {
    listing: null,
    loading: true,
    errorText: '',
    notFound: false
  },

  onLoad: function (options) {
    const id = (options && options.id) || '';
    if (!id) { this.setData({ notFound: true }); return; }
    this.load(id);
  },

  load: function (id) {
    const that = this;
    api.request('/trade-api/listings/' + id, { noRetry: true }).then(function (body) {
      const x = body.listing;
      that.setData({
        listing: Object.assign({}, x, {
          imageUrls: (x.images || []).map(function (u) { return u.indexOf('http') === 0 ? u : 'https://hhxpoint.me' + u; }),
          priceText: '¥' + String(x.price || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          dateText: x.created_at ? new Date(x.created_at).toLocaleDateString() : ''
        }),
        loading: false
      });
      wx.setNavigationBarTitle({ title: x.model_name || '二手信息' });
    }).catch(function (err) {
      that.setData({ loading: false, notFound: true, errorText: (err && err.message) || '内容不存在' });
    });
  },

  previewImage: function (e) {
    const index = Number(e.currentTarget.dataset.index) || 0;
    const urls = this.data.listing.imageUrls || [];
    if (urls.length) wx.previewImage({ current: urls[index], urls: urls });
  },

  report: function () {
    const that = this;
    wx.showActionSheet({
      itemList: ['虚假信息', '疑似盗抢/假冒', '违禁物品', '联系方式/广告', '其他'],
      success: function (res) {
        const reasons = ['虚假信息', '疑似盗抢/假冒', '违禁物品', '联系方式/广告', '其他'];
        api.request('/trade-api/listings/' + that.data.listing.id + '/report', {
          method: 'POST',
          noRetry: true,
          data: { reason: reasons[res.tapIndex] || '其他' }
        }).then(function (body) {
          if (body && body.auto_hidden) {
            wx.showModal({
              title: '已提交举报',
              content: '该内容因举报达到上限已被自动下架，等待人工复核。',
              showCancel: false,
              success: function () {
                // 分享卡片冷启动进来时页面栈为空，navigateBack 会静默失败，需要兜底
                wx.navigateBack({
                  delta: 1,
                  fail: function () {
                    wx.reLaunch({ url: '/packageTrade/pages/market/market' });
                  }
                });
              }
            });
            return;
          }
          wx.showToast({ title: '已提交举报', icon: 'success' });
        }).catch(function (err) {
          wx.showToast({ title: (err && err.message) || '举报失败，稍后再试', icon: 'none' });
        });
      }
    });
  },

  goMarket: function () {
    wx.navigateTo({ url: '/packageTrade/pages/market/market' });
  },

  onShareAppMessage: function () {
    const x = this.data.listing;
    return x ? {
      title: x.title,
      path: '/packageTrade/pages/listing/listing?id=' + x.id,
      imageUrl: x.images && x.images[0] ? (x.images[0].indexOf('http') === 0 ? x.images[0] : 'https://hhxpoint.me' + x.images[0]) : ''
    } : { title: '二手估价', path: '/packageTrade/pages/home/home' };
  },

  onShareTimeline: function () {
    const x = this.data.listing;
    return x ? {
      title: x.title,
      query: 'id=' + x.id
    } : { title: '二手估价' };
  }
});
