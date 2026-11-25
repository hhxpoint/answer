const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');
const share = require('../../utils/share.js');

Page({
  data: {
    loading: true,
    error: '',
    papers: []
  },

  onShow() {
    share.enableMenu();
    this.load();
  },

  load() {
    const that = this;
    this.setData({ loading: true, error: '' });
    api.loadEssayIndex()
      .then(function (data) {
        const papers = ((data && data.papers) || []).map(function (p) {
          const draft = store.getEssayDraft(p.key);
          const answered = Object.keys(draft.answers || {}).filter(function (k) {
            return String(draft.answers[k] || '').trim();
          }).length;
          return {
            key: p.key,
            title: p.title,
            year: p.year,
            kind: p.kind,
            questionCount: p.questionCount,
            materialCount: p.materialCount,
            materialChars: p.materialChars,
            answered: answered,
            started: answered > 0
          };
        });
        that.setData({ papers: papers, loading: false });
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '加载失败' });
      });
  },

  open(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({ url: '/packageExam/pages/essay-practice/essay-practice?paper=' + key });
  },

  retry() {
    this.load();
  },
  onShareAppMessage: function () {
    const s = share.essayHome();
    return { title: s.title, path: s.path, imageUrl: share.cover('essay') };
  },

  onShareTimeline: function () {
    return share.timeline(share.essayHome(), 'essay');
  }
});
