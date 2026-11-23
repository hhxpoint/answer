const catalog = require('../../utils/catalog.js');
const api = require('../../utils/api.js');

Page({
  data: {
    categories: [],
    active: 'all',
    listings: [],
    loading: true,
    errorText: ''
  },

  onLoad: function () {
    this.setData({ categories: catalog.categories() });
  },

  onShow: function () {
    this.load();
  },

  switchCategory: function (e) {
    this.setData({ active: e.currentTarget.dataset.key });
    this.load();
  },

  load: function () {
    const that = this;
    const q = this.data.active === 'all' ? '' : '?category=' + encodeURIComponent(this.data.active);
    this.setData({ loading: true, errorText: '' });
    api.request('/trade-api/listings' + q, { noRetry: true }).then(function (body) {
      const list = (body.listings || []).map(function (x) {
        return Object.assign({}, x, {
          cover: x.images && x.images[0] ? (x.images[0].indexOf('http') === 0 ? x.images[0] : 'https://hhxpoint.me' + x.images[0]) : '/packageTrade/assets/placeholder-device.jpg',
          priceText: '¥' + String(x.price || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        });
      });
      that.setData({ listings: list, loading: false });
    }).catch(function (err) {
      that.setData({ loading: false, errorText: (err && err.message) || '加载失败' });
    });
  },

  goDetail: function (e) {
    wx.navigateTo({ url: '/packageTrade/pages/listing/listing?id=' + e.currentTarget.dataset.id });
  },

  goPublish: function () {
    wx.navigateTo({ url: '/packageTrade/pages/publish/publish?category=laptop' });
  },

  goMy: function () {
    wx.navigateTo({ url: '/packageTrade/pages/mylist/mylist' });
  },

  onShareAppMessage: function () {
    return { title: '二手估价 · 公开浏览', path: '/packageTrade/pages/market/market' };
  },

  onShareTimeline: function () {
    return { title: '二手估价 · 公开浏览' };
  }
});
