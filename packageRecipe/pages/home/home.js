const search = require('../../utils/search.js');
const storage = require('../../utils/storage.js');
const view = require('../../utils/view.js');

Page({
  data: {
    query: '',
    intro: '今天想吃什么？搜菜名、食材，或直接看看推荐。',
    results: [],
    categories: search.CATEGORY_LIST,
    quickTags: ['快手', '清淡', '下饭', '汤', '早餐', '素菜'],
    activeCategory: '全部',
    recentQueries: [],
    favCount: 0,
    tonight: null,
    searching: false,
  },

  onLoad() {
    this.refreshHot();
    this.setData({ tonight: view.decorate(search.tonight(20261117)) });
  },

  onShow() {
    this.setData({
      favCount: storage.favorites().length,
      recentQueries: storage.recentQueries(),
    });
  },

  refreshHot() {
    this.setData({
      results: view.decorateList(search.hot(8)),
      intro: '今天想吃什么？搜菜名、食材，或直接看看推荐。',
      activeCategory: '全部',
      query: '',
    });
  },

  onInput(e) {
    this.setData({ query: e.detail.value });
  },

  onConfirm() {
    this.doSearch(this.data.query);
  },

  onSearchTap() {
    this.doSearch(this.data.query);
  },

  onClear() {
    this.refreshHot();
  },

  onQuickTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ query: tag, activeCategory: '全部' });
    this.doSearch(tag, '全部');
  },

  onCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat });
    this.doSearch(this.data.query, cat);
  },

  doSearch(q, category) {
    const cat = category || this.data.activeCategory;
    const res = search.search(q, { category: cat });
    this.setData({
      results: view.decorateList(res.list),
      intro: res.intro,
      searching: true,
      activeCategory: cat,
    });
    if (String(q || '').trim()) storage.pushQuery(q);
  },

  onRecentTap(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ query: q });
    this.doSearch(q);
  },

  onTonightRefresh() {
    let seed = Date.now();
    let pick = search.tonight(seed);
    if (this.data.tonight && pick.id === this.data.tonight.id) {
      pick = search.tonight(seed + 1);
    }
    this.setData({ tonight: view.decorate(pick) });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/packageRecipe/pages/detail/detail?id=' + id });
  },

  goFridge() {
    wx.navigateTo({ url: '/packageRecipe/pages/fridge/fridge' });
  },

  goFavorites() {
    wx.navigateTo({ url: '/packageRecipe/pages/favorites/favorites' });
  },

  goSources() {
    wx.navigateTo({ url: '/packageRecipe/pages/sources/sources' });
  },

  onShareAppMessage() {
    return {
      title: '今天吃什么？40 道家常菜，按食材找菜谱',
      path: '/packageRecipe/pages/home/home',
    };
  },

  onShareTimeline() {
    return { title: '今天吃什么？按食材找菜谱' };
  },
});

