const api = require('../../utils/couple-api.js');

const MAX_IMAGES = 9;
const MAX_BYTES = 1150 * 1024;

Page({
  data: {
    days: 1,
    content: '',
    images: [],
    count: 0,
    publishing: false
  },

  onLoad: function () {
    this.uploaded = {};
    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/bind/bind' });
          return;
        }
        if (!res.user || !res.user.nickname || !res.user.avatar) {
          wx.redirectTo({ url: '/packageCouple/pages/profile/profile?next=home' });
          return;
        }
        that.setData({ days: res.couple.days_together || 1 });
      })
      .catch(function (err) {
        wx.showToast({ title: err.msg || '加载失败', icon: 'none' });
      });
  },

  onInput: function (e) {
    this.setData({ content: e.detail.value });
  },

  chooseImages: function () {
    const that = this;
    const left = MAX_IMAGES - this.data.images.length;
    if (left <= 0) {
      wx.showToast({ title: '最多 9 张照片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: left,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: function (res) {
        const paths = (res.tempFiles || []).map(function (f) { return f.tempFilePath; }).filter(Boolean);
        if (!paths.length) return;
        const images = that.data.images.concat(paths).slice(0, MAX_IMAGES);
        that.setData({ images: images, count: images.length });
      },
      fail: function () {}
    });
  },

  removeImage: function (e) {
    const idx = Number(e.currentTarget.dataset.index);
    const images = this.data.images.slice();
    images.splice(idx, 1);
    this.setData({ images: images, count: images.length });
  },

  preview: function (e) {
    const idx = Number(e.currentTarget.dataset.index);
    wx.previewImage({ current: this.data.images[idx], urls: this.data.images });
  },

  compress: function (src) {
    return new Promise(function (resolve) {
      wx.compressImage({
        src: src,
        quality: 72,
        success: function (r) { resolve(r.tempFilePath || src); },
        fail: function () { resolve(src); }
      });
    });
  },

  readFileBase64: function (filePath) {
    return new Promise(function (resolve, reject) {
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success: function (res) { resolve(res.data || ''); },
        fail: function () { reject({ code: 'READ_FAIL', msg: '照片读取失败' }); }
      });
    });
  },

  toDataUrl: function (base64, filePath) {
    const m = /\.(png|jpe?g|webp)$/i.exec(String(filePath || ''));
    let ext = m ? m[1].toLowerCase() : 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    return 'data:image/' + mime + ';base64,' + base64;
  },

  // 压缩 -> 读 base64 -> 二次兜底压缩（保证 < 1.15MB）
  prepareImage: function (src) {
    const that = this;
    return this.compress(src).then(function (small) {
      return that.readFileBase64(small).then(function (base64) {
        const bytes = Math.floor((base64.length * 3) / 4);
        if (bytes <= MAX_BYTES) return that.toDataUrl(base64, small);
        return new Promise(function (resolve, reject) {
          wx.compressImage({
            src: small,
            quality: 40,
            success: function (r) {
              that.readFileBase64(r.tempFilePath || small)
                .then(function (b2) { resolve(that.toDataUrl(b2, r.tempFilePath || small)); })
                .catch(reject);
            },
            fail: function () { resolve(that.toDataUrl(base64, small)); }
          });
        });
      });
    });
  },

  publish: function () {
    const that = this;
    if (this.data.publishing) return;
    const content = (this.data.content || '').trim();
    if (!content && !this.data.images.length) {
      wx.showToast({ title: '写点什么，或者选张照片吧', icon: 'none' });
      return;
    }
    this.setData({ publishing: true });
    wx.showLoading({ title: '准备照片…', mask: true });

    const uploads = [];
    let chain = Promise.resolve();
    this.data.images.forEach(function (path, idx) {
      chain = chain.then(function () {
        if (that.uploaded[path]) {
          uploads.push(that.uploaded[path]);
          return null;
        }
        wx.showLoading({ title: '上传中 ' + (idx + 1) + '/' + that.data.images.length, mask: true });
        return that.prepareImage(path)
          .then(function (dataUrl) { return api.uploadImage(dataUrl); })
          .then(function (r) {
            that.uploaded[path] = r.url;
            uploads.push(r.url);
          });
      });
    });

    chain
      .then(function () {
        wx.showLoading({ title: '发布中…', mask: true });
        return api.createDiary(content, uploads);
      })
      .then(function () {
        wx.hideLoading();
        that.setData({ publishing: false });
        wx.showToast({ title: '已记录', icon: 'none' });
        setTimeout(function () { wx.navigateBack(); }, 450);
      })
      .catch(function (err) {
        wx.hideLoading();
        that.setData({ publishing: false });
        wx.showToast({ title: (err && err.msg) || '发布失败，再试一次', icon: 'none' });
      });
  }
});
