const catalog = require('../../utils/catalog.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    updatedAt: catalog.UPDATED_AT,
    query: '',
    results: [],
    total: 0,
    intro: '',
    brands: [],
    categories: [],
    category: 'all',
    brand: 'all',
    gpu: 'all',
    showGpu: true,
    gpuGroups: [],
    recordCount: 0,
    loading: true
  },

  onLoad: function () {
    this.setData({
      brands: catalog.brands('all'),
      categories: catalog.categories(),
      gpuGroups: catalog.gpuGroups()
    });
    this.refresh();
  },

  onShow: function () {
    this.setData({ recordCount: storage.records().length });
  },

  refresh: function () {
    const list = catalog.list({
      query: this.data.query,
      category: this.data.category,
      brand: this.data.brand,
      gpu: this.data.gpu
    }).slice(0, 8);
    const all = catalog.list({ query: this.data.query, category: this.data.category, brand: this.data.brand, gpu: this.data.gpu });
    this.setData({
      results: list,
      total: all.length,
      intro: catalog.searchIntro(this.data.query, all.length),
      loading: false
    });
  },

  onInput: function (e) {
    this.setData({ query: e.detail.value });
  },

  onConfirm: function () {
    this.refresh();
  },

  onSearch: function () {
    this.refresh();
  },

  onClear: function () {
    this.setData({ query: '', category: 'all', brand: 'all', gpu: 'all', showGpu: false });
    this.setData({ brands: catalog.brands('all') });
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
    const key = e.currentTarget.dataset.key;
    this.setData({ brand: key });
    this.refresh();
  },

  onGpu: function (e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ gpu: key });
    this.refresh();
  },

  goList: function () {
    wx.navigateTo({ url: '/packageTrade/pages/list/list' });
  },

  goDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/packageTrade/pages/detail/detail?id=' + id });
  },

  goMy: function () {
    wx.navigateTo({ url: '/packageTrade/pages/my/my' });
  },

  goMarket: function () {
    wx.navigateTo({ url: '/packageTrade/pages/market/market' });
  },

  goMylist: function () {
    wx.navigateTo({ url: '/packageTrade/pages/mylist/mylist' });
  },

  goSources: function () {
    wx.navigateTo({ url: '/packageTrade/pages/sources/sources' });
  },

  onShareAppMessage: function () {
    return {
      title: '游戏本行情 · 个人二手估价单',
      path: '/packageTrade/pages/home/home'
    };
  },

  onShareTimeline: function () {
    return { title: '游戏本二手估价 · 38 款行情' };
  }
});
