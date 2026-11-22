const catalog = require('../../utils/catalog.js');

Page({
  data: {
    updatedAt: catalog.UPDATED_AT,
    query: '',
    category: 'all',
    brand: 'all',
    gpu: 'all',
    showGpu: true,
    sort: 'hot',
    brands: [],
    categories: [],
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
    const category = (options && options.category) || 'all';
    this.setData({
      query: q,
      category: category,
      brand: brand,
      brands: catalog.brands(category),
      categories: catalog.categories(),
      showGpu: category === 'laptop' || category === 'all',
      gpuGroups: catalog.gpuGroups()
    });
    this.refresh();
  },

  refresh: function () {
    const list = catalog.list({
      query: this.data.query,
      category: this.data.category,
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
    this.setData({ query: '', category: 'all', brand: 'all', gpu: 'all', sort: 'hot', showGpu: true, brands: catalog.brands('all') });
    this.refresh();
  },

  onCategory: function (e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      category: key,
      brand: 'all',
      gpu: 'all',
      showGpu: key === 'laptop' || key === 'all',
      brands: catalog.brands(key)
    });
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
