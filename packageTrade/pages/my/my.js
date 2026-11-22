const storage = require('../../utils/storage.js');
const catalog = require('../../utils/catalog.js');

Page({
  data: {
    records: []
  },

  onShow: function () {
    this.setData({ records: storage.records() });
  },

  openRecord: function (e) {
    const id = e.currentTarget.dataset.id;
    const record = this.data.records.find(function (r) { return r.id === id; });
    if (!record) return;
    const model = catalog.getModel(record.modelId);
    const variant = catalog.getVariant(model, record.variantId);
    if (!model || !variant) return;
    const now = new Date();
    const dateText = (now.getMonth() + 1) + '月' + now.getDate() + '日';
    storage.saveDraft({
      record: record,
      model: model,
      variant: variant,
      result: record.result,
      dateText: dateText
    });
    wx.navigateTo({ url: '/packageTrade/pages/poster/poster' });
  },

  removeRecord: function (e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '删除记录',
      content: '只删除本机保存的估价记录，不影响其他内容。',
      confirmText: '删除',
      success: function (res) {
        if (!res.confirm) return;
        storage.removeRecord(id);
        that.setData({ records: storage.records() });
        wx.showToast({ title: '已删除', icon: 'success' });
      }
    });
  },

  clearAll: function () {
    const that = this;
    if (!this.data.records.length) return;
    wx.showModal({
      title: '清空记录',
      content: '清空本机保存的全部估价记录？',
      confirmText: '清空',
      success: function (res) {
        if (!res.confirm) return;
        storage.clearRecords();
        that.setData({ records: [] });
      }
    });
  },

  goHome: function () {
    wx.navigateTo({ url: '/packageTrade/pages/home/home' });
  },

  goSources: function () {
    wx.navigateTo({ url: '/packageTrade/pages/sources/sources' });
  }
});
