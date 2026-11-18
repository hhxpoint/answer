const search = require('../../utils/search.js');
const storage = require('../../utils/storage.js');
const view = require('../../utils/view.js');

Page({
  data: {
    recipe: null,
    favorite: false,
    related: [],
  },

  onLoad(options) {
    const id = options && options.id;
    const r = search.byId(id);
    if (!r) {
      wx.showToast({ title: '菜谱不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    const recipe = view.decorate(r);
    const related = search.hot(20).filter((x) => x.category === r.category && x.id !== r.id).slice(0, 3);
    this.setData({
      recipe: recipe,
      favorite: storage.isFavorite(id),
      related: view.decorateList(related),
    });
    storage.pushHistory(id);
    wx.setNavigationBarTitle({ title: r.title });
  },

  onToggleFavorite() {
    const r = this.data.recipe;
    if (!r) return;
    const added = storage.toggleFavorite(r.id);
    this.setData({ favorite: added });
    wx.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: '/packageRecipe/pages/detail/detail?id=' + id });
  },

  copyCredit() {
    const c = this.data.recipe && this.data.recipe.credit;
    if (!c) return;
    wx.setClipboardData({ data: (c.title || '') + ' · ' + (c.source || '') + ' · ' + (c.license || '') + ' · ' + (c.landing || '') });
  },

  onShareAppMessage() {
    const r = this.data.recipe || {};
    return {
      title: r.title ? (r.title + ' · 简单做法') : '今天吃什么',
      path: '/packageRecipe/pages/detail/detail?id=' + (r.id || ''),
      imageUrl: r.image || '',
    };
  },
});
