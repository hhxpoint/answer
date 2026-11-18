const storage = require('../../utils/storage.js');
const search = require('../../utils/search.js');
const view = require('../../utils/view.js');

Page({
  data: {
    list: [],
    historyList: [],
  },

  onShow() {
    const ids = storage.favorites();
    const list = ids.map((id) => search.byId(id)).filter(Boolean);
    const his = storage.history().map((id) => search.byId(id)).filter(Boolean).slice(0, 6);
    this.setData({
      list: view.decorateList(list),
      historyList: view.decorateList(his),
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/packageRecipe/pages/detail/detail?id=' + id });
  },

  goHome() {
    wx.redirectTo({ url: '/packageRecipe/pages/home/home' });
  },

  onShareAppMessage() {
    return { title: '我的家常菜收藏', path: '/packageRecipe/pages/home/home' };
  },
});
