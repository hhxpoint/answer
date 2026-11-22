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
    const id = (options && options.id) || '';
    const model = catalog.getModel(id);
    if (!model) {
      this.setData({ notFound: true });
      return;
    }
    const variant = decorateVariant(catalog.getVariant(model, (options && options.variant) || ''));
    const specs = [
      { k: 'CPU', v: model.specs.cpu },
      { k: 'GPU', v: model.specs.gpu + ' / ' + model.specs.gpuTgp + 'W' },
      { k: '内存', v: model.specs.ram },
      { k: '硬盘', v: model.specs.storage },
      { k: '屏幕', v: model.specs.screen + ' · ' + model.specs.refresh },
      { k: '电池', v: model.specs.battery },
      { k: '重量', v: model.specs.weight },
      { k: '发售价', v: variant.launchText }
    ];
    this.setData({ model: model, variant: variant, variantId: variant.id, specs: specs });
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
    return {
      title: m ? (m.brand + ' ' + m.model + ' · 二手参考 ' + m.priceText) : '游戏本二手估价',
      path: m ? '/packageTrade/pages/detail/detail?id=' + m.id : '/packageTrade/pages/home/home'
    };
  }
});
