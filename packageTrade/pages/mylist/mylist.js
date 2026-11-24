const api = require('../../utils/api.js');

const STATUS_TEXT = {
  pending: '审核中',
  approved: '已公开',
  rejected: '未通过',
  hidden: '已隐藏',
  expired: '已过期'
};

Page({
  data: {
    listings: [],
    loading: true,
    errorText: ''
  },

  onShow: function () {
    this.load();
  },

  load: function () {
    const that = this;
    this.setData({ loading: true, errorText: '' });
    api.ensureLogin().then(function () {
      return api.request('/trade-api/listings/mine');
    }).then(function (body) {
      const list = (body.listings || []).map(function (x) {
        const note = String(x.review_note || '').trim();
        const showReason = !!note && (x.status === 'rejected' || x.status === 'hidden');
        return Object.assign({}, x, {
          statusText: STATUS_TEXT[x.status] || x.status,
          priceText: '¥' + String(x.price || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          cover: x.images && x.images[0] ? (x.images[0].indexOf('http') === 0 ? x.images[0] : 'https://hhxpoint.me' + x.images[0]) : '/packageTrade/assets/placeholder-device.jpg',
          reasonText: note,
          showReason: showReason
        });
      });
      that.setData({ listings: list, loading: false });
    }).catch(function (err) {
      that.setData({ loading: false, errorText: (err && err.message) || '加载失败' });
    });
  },

  open: function (e) {
    const x = this.data.listings.find(function (v) { return v.id === e.currentTarget.dataset.id; });
    if (!x) return;
    if (x.status !== 'approved') {
      wx.showToast({ title: '审核通过后才能公开查看', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/packageTrade/pages/listing/listing?id=' + x.id });
  },

  remove: function (e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '删除发布',
      content: '删除后不可恢复。',
      confirmText: '删除',
      success: function (r) {
        if (!r.confirm) return;
        api.request('/trade-api/listings/' + id, { method: 'DELETE' }).then(function () {
          wx.showToast({ title: '已删除', icon: 'success' });
          that.load();
        }).catch(function (err) {
          wx.showToast({ title: (err && err.message) || '删除失败', icon: 'none' });
        });
      }
    });
  },

  goPublish: function () {
    wx.navigateTo({ url: '/packageTrade/pages/publish/publish' });
  },

  goMarket: function () {
    wx.navigateTo({ url: '/packageTrade/pages/market/market' });
  }
});
