const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

Page({
  data: {
    stats: { todayCount: 0, total: 0, correct: 0, streak: 0 },
    rate: 0,
    papers: [],
    loading: true,
    error: ''
  },

  onShow() {
    const s = store.getStats();
    this.setData({
      stats: s,
      rate: s.total > 0 ? Math.round((s.correct * 100) / s.total) : 0
    });
    if (!this.data.papers.length) this.loadIndex();
  },

  loadIndex() {
    const that = this;
    this.setData({ loading: true, error: '' });
    api.loadIndex()
      .then(function (data) {
        that.setData({ papers: (data && data.papers) || [], loading: false });
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '题库加载失败' });
      });
  },

  goPapers() {
    wx.navigateTo({ url: '/packageExam/pages/papers/papers' });
  },

  goSection() {
    wx.navigateTo({ url: '/packageExam/pages/section/section' });
  },

  goWrong() {
    wx.navigateTo({ url: '/packageExam/pages/wrong/wrong' });
  },

  goReport() {
    wx.navigateTo({ url: '/packageExam/pages/report/report' });
  },

  goEssay() {
    wx.showToast({ title: '申论模块正在整理中', icon: 'none' });
  },

  preview(e) {
    const src = e.currentTarget.dataset.src;
    if (src) wx.previewImage({ urls: [src], current: src });
  }
});
