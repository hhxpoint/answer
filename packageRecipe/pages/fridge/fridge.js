const search = require('../../utils/search.js');
const view = require('../../utils/view.js');
const INGREDIENTS = require('../../data/ingredients.js');

Page({
  data: {
    ingredients: INGREDIENTS,
    selected: [],
    selectedMap: {},
    results: [],
    searched: false,
    hint: '',
  },

  onToggle(e) {
    const name = e.currentTarget.dataset.name;
    const selected = this.data.selected.slice();
    const idx = selected.indexOf(name);
    if (idx >= 0) selected.splice(idx, 1);
    else selected.push(name);
    const map = {};
    selected.forEach((x) => { map[x] = 1; });
    this.setData({ selected: selected, selectedMap: map, searched: false, results: [] });
  },

  onClear() {
    this.setData({ selected: [], selectedMap: {}, results: [], searched: false, hint: '' });
  },

  onSearch() {
    const selected = this.data.selected;
    if (!selected.length) {
      wx.showToast({ title: '先选几样食材吧', icon: 'none' });
      return;
    }
    const raw = search.fridge(selected);
    const results = raw.map((x) => {
      const item = view.decorate(x.r);
      item.coveragePct = Math.round(x.coverage * 100);
      item.matchedText = x.matched.join('、');
      item.missingText = x.missing.length ? x.missing.join('、') : '';
      return item;
    });
    let hint = '';
    if (!results.length) hint = '这些食材暂时没匹配到菜谱，试试番茄、鸡蛋或土豆。';
    else if (results[0].coveragePct === 100) hint = '这些菜你的食材刚好都能做，直接开火吧。';
    else hint = '按匹配度排序；点开可以看还差哪些配料。';
    this.setData({ results: results, searched: true, hint: hint });
    wx.showToast({ title: '匹配到 ' + results.length + ' 道', icon: 'none' });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/packageRecipe/pages/detail/detail?id=' + id });
  },

  onShareAppMessage() {
    return { title: '冰箱里有啥，就做什么菜', path: '/packageRecipe/pages/fridge/fridge' };
  },
});
