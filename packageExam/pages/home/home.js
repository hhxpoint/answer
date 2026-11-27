const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');
const identity = require('../../utils/exam-identity.js');
const sync = require('../../utils/exam-sync.js');
const share = require('../../utils/share.js');

Page({
  data: {
    stats: { todayCount: 0, total: 0, correct: 0, streak: 0 },
    rate: 0,
    papers: [],
    loading: true,
    profileReady: false,
    nickName: '',
    avatarUrl: '',
    error: ''
  },

  onShow() {
    if (typeof getApp === 'function' && getApp().profileGuard && getApp().profileGuard.guard()) return;
    share.enableMenu();
    const p = identity.localProfile() || {};
    this.setData({
      profileReady: identity.profileReady(),
      nickName: p.nickName || '',
      avatarUrl: p.avatarUrl || ''
    });
    const that = this;
    identity.ensureUid().then(function () { return sync.auto(); }).then(function () {
      const s2 = store.getStats();
      that.setData({ stats: s2, rate: s2.total > 0 ? Math.round((s2.correct * 100) / s2.total) : 0 });
    });
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

  goSetup() {
    wx.navigateTo({ url: '/pages/welcome/welcome?from=' + encodeURIComponent('/packageExam/pages/home/home') });
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
    wx.navigateTo({ url: '/packageExam/pages/essay-home/essay-home' });
  },

  preview(e) {
    const src = e.currentTarget.dataset.src;
    if (src) wx.previewImage({ urls: [src], current: src });
  },
  onShareAppMessage: function () {
    const s = share.home();
    return { title: s.title, path: s.path, imageUrl: share.cover('home') };
  },

  onShareTimeline: function () {
    return share.timeline(share.home(), 'home');
  }
});
