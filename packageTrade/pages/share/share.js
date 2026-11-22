const catalog = require('../../utils/catalog.js');
const estimate = require('../../utils/estimate.js');
const share = require('../../utils/share.js');

Page({
  data: {
    model: null,
    variant: null,
    result: null,
    dateText: '',
    payload: null,
    invalid: false
  },

  onLoad: function (options) {
    const raw = (options && options.d) || '';
    const payload = raw ? share.decode(raw) : null;
    if (!payload) {
      this.setData({ invalid: true });
      return;
    }
    const model = catalog.getModel(payload.m);
    const variant = catalog.getVariant(model, payload.v);
    if (!model || !variant) {
      this.setData({ invalid: true });
      return;
    }
    const result = estimate.calc(model, variant, payload.a || {});
    const dateText = String(payload.d || '').slice(0, 16).replace(/[<>]/g, '') || this.today();
    this.setData({
      model: model,
      variant: variant,
      result: result,
      dateText: dateText,
      payload: payload
    });
    wx.setNavigationBarTitle({ title: model.model + ' · 估价单' });
  },

  today: function () {
    const d = new Date();
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  },

  sharePayload: function () {
    return {
      modelId: this.data.model.id,
      variantId: this.data.variant.id,
      answers: this.data.payload.a,
      dateText: this.data.dateText
    };
  },

  goHome: function () {
    wx.navigateTo({ url: '/packageTrade/pages/home/home' });
  },

  goEstimate: function () {
    if (!this.data.model || !this.data.variant) return;
    wx.navigateTo({
      url: '/packageTrade/pages/estimate/estimate?id=' + this.data.model.id + '&variant=' + this.data.variant.id
    });
  },

  goDetail: function () {
    if (!this.data.model) return;
    wx.navigateTo({ url: '/packageTrade/pages/detail/detail?id=' + this.data.model.id });
  },

  onShareAppMessage: function () {
    if (!this.data.model) {
      return { title: '游戏本二手估价', path: '/packageTrade/pages/home/home' };
    }
    const d = share.encode(this.sharePayload());
    return {
      title: this.data.model.brand + ' ' + this.data.model.model + ' · ' + this.data.result.rangeText,
      path: '/packageTrade/pages/share/share?d=' + d,
      imageUrl: this.data.model.image
    };
  },

  onShareTimeline: function () {
    if (!this.data.model) {
      return { title: '游戏本二手估价' };
    }
    return {
      title: this.data.model.brand + ' ' + this.data.model.model + ' · ' + this.data.result.rangeText,
      query: 'd=' + share.encode(this.sharePayload()),
      imageUrl: this.data.model.image
    };
  }
});
