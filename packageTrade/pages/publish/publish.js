const catalog = require('../../utils/catalog.js');
const estimate = require('../../utils/estimate.js');
const api = require('../../utils/api.js');

Page({
  data: {
    model: null,
    variant: null,
    condition: null,
    title: '',
    description: '',
    price: '',
    city: '',
    photos: [],
    uploading: false,
    submitting: false,
    notFound: false,
    errorText: '',
    picking: false,
    pickCategory: 'all',
    pickQuery: '',
    pickCategories: [],
    pickModels: []
  },

  onLoad: function (options) {
    const id = (options && options.id) || '';
    if (!id) {
      this.startPicking((options && options.category) || 'all');
      return;
    }
    const model = catalog.getModel(id);
    if (!model) {
      this.setData({ notFound: true });
      return;
    }
    const variant = catalog.getVariant(model, (options && options.variant) || '');
    const condition = estimate.CONDITIONS.find(function (c) { return c.id === ((options && options.condition) || 'A'); }) || estimate.CONDITIONS[1];
    this.setData({
      model: model,
      variant: variant,
      condition: condition,
      title: model.model + ' ' + variant.label,
      price: String(Math.round((variant.priceLow + variant.priceHigh) / 2)),
      city: ''
    });
    const that = this;
    api.ensureLogin().catch(function (err) {
      that.setData({ errorText: (err && err.message) || '登录失败' });
    });
  },

  startPicking: function (category) {
    const cats = catalog.categories();
    const known = cats.some(function (c) { return c.key === category; });
    const active = known ? category : 'all';
    this.setData({
      picking: true,
      pickCategories: cats,
      pickCategory: active,
      pickQuery: ''
    });
    this.refreshPick(active, '');
    if (wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: '选择要发布的设备' });
  },

  refreshPick: function (category, query) {
    const list = catalog.list({ category: category || 'all', query: query || '' }).slice(0, 80);
    this.setData({
      pickModels: list.map(function (m) {
        return {
          id: m.id,
          brand: m.brand,
          model: m.model,
          specLine: m.specLine,
          priceText: m.priceText,
          categoryName: m.categoryName,
          image: m.image || ''
        };
      }),
      pickCategory: category || 'all',
      pickQuery: query || ''
    });
  },

  onPickCategory: function (e) {
    this.refreshPick(e.currentTarget.dataset.key, this.data.pickQuery);
  },

  onPickInput: function (e) {
    this.refreshPick(this.data.pickCategory, e.detail.value);
  },

  onPickConfirm: function () {
    this.refreshPick(this.data.pickCategory, this.data.pickQuery);
  },

  onPickClear: function () {
    this.refreshPick('all', '');
  },

  pickModel: function (e) {
    const model = catalog.getModel(e.currentTarget.dataset.id);
    if (!model) return;
    const variant = catalog.getVariant(model, '');
    const condition = estimate.CONDITIONS.find(function (c) { return c.id === 'A'; }) || estimate.CONDITIONS[1];
    this.setData({
      picking: false,
      notFound: false,
      model: model,
      variant: variant,
      condition: condition,
      title: model.model + ' ' + variant.label,
      price: String(Math.round((variant.priceLow + variant.priceHigh) / 2)),
      city: ''
    });
    if (wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: '发布二手信息' });
    const that = this;
    api.ensureLogin().catch(function (err) {
      that.setData({ errorText: (err && err.message) || '登录失败' });
    });
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const patch = {};
    patch[field] = e.detail.value;
    this.setData(patch);
  },

  choosePhotos: function () {
    const that = this;
    const remain = 6 - this.data.photos.length;
    if (remain <= 0 || this.data.uploading) return;
    const add = function (paths) {
      const fresh = (paths || []).filter(Boolean).map(function (p) { return { temp: p, url: '', status: 'waiting' }; });
      const photos = that.data.photos.concat(fresh).slice(0, 6);
      that.setData({ photos: photos, uploading: true });
      that.uploadAt(0);
    };
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: remain,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        success: function (res) { add((res.tempFiles || []).map(function (f) { return f.tempFilePath; })); }
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

  uploadAt: function (index) {
    const that = this;
    const photos = this.data.photos.slice();
    while (index < photos.length && photos[index].url) index += 1;
    if (index >= photos.length) {
      this.setData({ uploading: false });
      return;
    }
    const item = Object.assign({}, photos[index], { status: 'uploading' });
    photos[index] = item;
    this.setData({ photos: photos });
    api.uploadImage(item.temp).then(function (url) {
      const next = that.data.photos.slice();
      next[index] = Object.assign({}, next[index], { url: url, status: 'done' });
      that.setData({ photos: next });
      that.uploadAt(index + 1);
    }).catch(function (err) {
      const next = that.data.photos.slice();
      next[index] = Object.assign({}, next[index], { status: 'error', error: (err && err.message) || '上传失败' });
      that.setData({ photos: next, uploading: false, errorText: (err && err.message) || '图片上传失败' });
    });
  },

  removePhoto: function (e) {
    const index = Number(e.currentTarget.dataset.index);
    const photos = this.data.photos.slice();
    photos.splice(index, 1);
    this.setData({ photos: photos });
  },

  submit: function () {
    if (this.data.submitting || this.data.uploading) return;
    const title = (this.data.title || '').trim();
    const price = Number(this.data.price);
    if (!title) { wx.showToast({ title: '写个标题吧', icon: 'none' }); return; }
    if (!(price > 0)) { wx.showToast({ title: '填一个价格吧', icon: 'none' }); return; }
    if (!this.data.photos.length || this.data.photos.some(function (p) { return !p.url; })) {
      wx.showToast({ title: '至少上传一张实拍图', icon: 'none' });
      return;
    }
    this.setData({ submitting: true, errorText: '' });
    const that = this;
    api.request('/trade-api/listings', {
      method: 'POST',
      data: {
        category: this.data.model.categoryKey,
        modelId: this.data.model.id,
        modelName: this.data.model.brand + ' ' + this.data.model.model,
        variantLabel: this.data.variant.label,
        condition: this.data.condition ? this.data.condition.label : '',
        price: price,
        title: title,
        description: (this.data.description || '').trim(),
        city: (this.data.city || '').trim(),
        images: this.data.photos.map(function (p) { return p.url; })
      }
    }).then(function (body) {
      that.setData({ submitting: false });
      wx.showModal({
        title: '已提交审核',
        content: '通过后会出现在公开浏览里。你可以在「我的发布」查看状态。',
        showCancel: false,
        confirmText: '知道了',
        success: function () { wx.redirectTo({ url: '/packageTrade/pages/mylist/mylist' }); }
      });
    }).catch(function (err) {
      that.setData({ submitting: false, errorText: (err && err.message) || '提交失败' });
      wx.showToast({ title: (err && err.message) || '提交失败', icon: 'none' });
    });
  },

  goMarket: function () {
    wx.navigateTo({ url: '/packageTrade/pages/market/market' });
  },

  goMy: function () {
    wx.navigateTo({ url: '/packageTrade/pages/mylist/mylist' });
  }
});
