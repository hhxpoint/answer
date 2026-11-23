const catalog = require('../../utils/catalog.js');

function decorateVariant(v) {
  if (!v) return null;
  return Object.assign({}, v, {
    priceText: '¥' + catalog.money(v.priceLow) + ' – ¥' + catalog.money(v.priceHigh),
    launchText: '¥' + catalog.money(v.launchPrice)
  });
}

Page({
  data: {
    model: null,
    variant: null,
    variantId: '',
    specs: [],
    notFound: false
  },

  onLoad: function (options) {
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    const id = (options && options.id) || '';
    const model = catalog.getModel(id);
    if (!model) {
      this.setData({ notFound: true });
      return;
    }
    const variant = decorateVariant(catalog.getVariant(model, (options && options.variant) || ''));
    const specs = (model.specItems || []).concat([{ k: '发售价', v: variant.launchText }]);
    this.setData({ model: model, variant: variant, variantId: variant.id, specs: specs });
    if (wx.setNavigationBarTitle) {
      wx.setNavigationBarTitle({ title: (model.categoryName || '设备') + '详情' });
    }
  },

  selectVariant: function (e) {
    const id = e.currentTarget.dataset.id;
    const variant = decorateVariant(catalog.getVariant(this.data.model, id));
    if (!variant) return;
    const specs = this.data.specs.map(function (s) {
      if (s.k === '发售价') return { k: s.k, v: variant.launchText };
      return s;
    });
    this.setData({ variant: variant, variantId: id, specs: specs });
  },

  goEstimate: function () {
    if (!this.data.model || !this.data.variant) return;
    wx.navigateTo({
      url: '/packageTrade/pages/estimate/estimate?id=' + this.data.model.id + '&variant=' + this.data.variant.id
    });
  },

  goSources: function () {
    wx.navigateTo({ url: '/packageTrade/pages/sources/sources' });
  },

  onShareAppMessage: function () {
    const m = this.data.model;
    const v = this.data.variant;
    if (!m) {
      return { title: '二手估价 · 手机 / 游戏机 / 游戏本', path: '/packageTrade/pages/home/home' };
    }
    const price = v ? v.priceText : (m.priceText || '');
    return {
      title: m.brand + ' ' + m.model + ' · 二手参考 ' + price,
      path: '/packageTrade/pages/detail/detail?id=' + encodeURIComponent(m.id) +
        (v ? '&variant=' + encodeURIComponent(v.id) : ''),
      imageUrl: m.image || ''
    };
  },

  onShareTimeline: function () {
    const m = this.data.model;
    const v = this.data.variant;
    if (!m) return { title: '二手估价 · 手机 / 游戏机 / 游戏本' };
    return {
      title: m.brand + ' ' + m.model + ' · 二手参考 ' + (v ? v.priceText : ''),
      query: 'id=' + encodeURIComponent(m.id) + (v ? '&variant=' + encodeURIComponent(v.id) : ''),
      imageUrl: m.image || ''
    };
  }
});
