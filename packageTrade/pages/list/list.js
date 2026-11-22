const catalog = require('../../utils/catalog.js');

Page({
  data: {
    updatedAt: catalog.UPDATED_AT,
    query: '',
    brand: 'all',
    gpu: 'all',
    sort: 'hot',
    brands: [],
    gpuGroups: [],
    results: [],
    total: 0,
    sortOptions: [
      { key: 'hot', name: '综合' },
      { key: 'price-asc', name: '价格低' },
      { key: 'price-desc', name: '价格高' },
      { key: 'newest', name: '最新' }
    ]
  },

  onLoad: function (options) {
    const q = (options && options.q) || '';
    const brand = (options && options.brand) || 'all';
    this.setData({
      query: q,
      brand: brand,
      brands: catalog.brands(),
      gpuGroups: catalog.gpuGroups()
    });
    this.refresh();
  },

  refresh: function () {
    const list = catalog.list({
      query: this.data.query,
      brand: this.data.brand,
      gpu: this.data.gpu,
      sort: this.data.sort
    });
    this.setData({ results: list, total: list.length });
  },

  onInput: function (e) {
    this.setData({ query: e.detail.value });
  },

  onConfirm: function () {
    this.refresh();
  },

  onClear: function () {
    this.setData({ query: '', brand: 'all', gpu: 'all', sort: 'hot' });
    this.refresh();
  },

  onBrand: function (e) {
    this.setData({ brand: e.currentTarget.dataset.key });
    this.refresh();
  },

  onGpu: function (e) {
    this.setData({ gpu: e.currentTarget.dataset.key });
    this.refresh();
  },

  onSort: function (e) {
    this.setData({ sort: e.currentTarget.dataset.key });
    this.refresh();
  },

  goDetail: function (e) {
    wx.navigateTo({ url: '/packageTrade/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  onShareAppMessage: function () {
    return { title: '游戏本二手行情', path: '/packageTrade/pages/list/list' };
  },

  onShareTimeline: function () {
    return { title: '游戏本二手行情 · 38 款' };
  }
});
