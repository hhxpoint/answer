const catalog = require('../../utils/catalog.js');
const estimate = require('../../utils/estimate.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    model: null,
    variant: null,
    conditions: estimate.CONDITIONS,
    batteries: estimate.BATTERIES,
    repairs: estimate.REPAIRS,
    accessories: estimate.ACCESSORIES,
    warranties: estimate.WARRANTY,
    screens: estimate.SCREENS,
    answers: Object.assign({}, estimate.DEFAULTS),
    result: null,
    photos: [],
    photoNote: '照片只保存在本机，不上传服务器',
    notFound: false,
    generating: false
  },

  onLoad: function (options) {
    const id = (options && options.id) || '';
    const variantId = (options && options.variant) || '';
    const model = catalog.getModel(id);
    if (!model) {
      this.setData({ notFound: true });
      return;
    }
    const variant = catalog.getVariant(model, variantId);
    wx.setNavigationBarTitle({ title: model.model });
    this.setData({
      model: model,
      variant: variant,
      answers: Object.assign({}, estimate.DEFAULTS)
    });
    this.recalc();
  },

  recalc: function () {
    if (!this.data.model || !this.data.variant) return;
    const result = estimate.calc(this.data.model, this.data.variant, this.data.answers);
    this.setData({ result: result });
  },

  selectOption: function (e) {
    const group = e.currentTarget.dataset.group;
    const id = e.currentTarget.dataset.id;
    if (!group || !id) return;
    const answers = Object.assign({}, this.data.answers);
    answers[group] = id;
    this.setData({ answers: answers }, () => this.recalc());
  },

  onCustomPrice: function (e) {
    const answers = Object.assign({}, this.data.answers, { customPrice: e.detail.value });
    this.setData({ answers: answers }, () => this.recalc());
  },

  choosePhotos: function () {
    const that = this;
    const remain = 4 - this.data.photos.length;
    if (remain <= 0) return;
    const add = function (paths) {
      const photos = that.data.photos.concat(paths.filter(Boolean)).slice(0, 4);
      that.setData({ photos: photos });
    };
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: remain,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        success: function (res) {
          add((res.tempFiles || []).map(function (f) { return f.tempFilePath; }));
        }
      });
      return;
    }
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) { add(res.tempFilePaths || []); }
    });
  },

  removePhoto: function (e) {
    const index = Number(e.currentTarget.dataset.index);
    const photos = this.data.photos.slice();
    photos.splice(index, 1);
    this.setData({ photos: photos });
  },

  generate: function () {
    if (this.data.generating || !this.data.result) return;
    this.setData({ generating: true });
    const now = new Date();
    const dateText = (now.getMonth() + 1) + '月' + now.getDate() + '日';
    const stamp = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const record = {
      id: 'tr_' + Date.now(),
      createdAt: now.getTime(),
      dateText: stamp,
      modelId: this.data.model.id,
      variantId: this.data.variant.id,
      modelName: this.data.model.model,
      brand: this.data.model.brand,
      year: this.data.model.year,
      variantLabel: this.data.variant.label,
      priceLow: this.data.variant.priceLow,
      priceHigh: this.data.variant.priceHigh,
      result: this.data.result,
      answers: this.data.answers,
      photoCount: this.data.photos.length
    };
    const draft = {
      record: record,
      model: this.data.model,
      variant: this.data.variant,
      result: this.data.result,
      photos: this.data.photos,
      dateText: dateText
    };
    storage.saveDraft(draft);
    storage.saveRecord(record);
    this.setData({ generating: false });
    wx.navigateTo({ url: '/packageTrade/pages/poster/poster' });
  },

  goDetail: function () {
    if (this.data.model) {
      wx.navigateTo({ url: '/packageTrade/pages/detail/detail?id=' + this.data.model.id });
    }
  }
});
