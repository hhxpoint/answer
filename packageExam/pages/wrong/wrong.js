const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');
const share = require('../../utils/share.js');

const PREFIX = 'exam:progress:';

Page({
  data: {
    loading: true,
    groups: [],
    totalWrong: 0,
    empty: false,
    tip: ''
  },

  onShow() {
    share.enableMenu();
    this.load();
  },

  load() {
    const that = this;
    this.setData({ loading: true, tip: '正在整理错题…' });

    let keys = [];
    try {
      const info = wx.getStorageInfoSync();
      keys = (info.keys || []).filter(function (k) {
        return k.indexOf(PREFIX) === 0;
      });
    } catch (e) {
      keys = [];
    }

    const paperKeys = keys.filter(function (k) {
      return k.indexOf('pool-') < 0;
    }).map(function (k) {
      return k.slice(PREFIX.length);
    });

    if (!paperKeys.length) {
      this.setData({ loading: false, groups: [], totalWrong: 0, empty: true, tip: '' });
      return;
    }

    const groups = [];
    let total = 0;
    let i = 0;

    function step() {
      if (i >= paperKeys.length) {
        that.setData({ loading: false, groups: groups, totalWrong: total, empty: total === 0, tip: '' });
        return;
      }
      const key = paperKeys[i];
      i += 1;
      that.setData({ tip: '正在整理错题…(' + i + '/' + paperKeys.length + ')' });
      api.loadPaper(key)
        .then(function (raw) {
          const paper = api.normalizePaper(raw);
          const prog = store.getProgress(paper.key);
          const answers = prog.answers || {};
          const rows = [];
          paper.questions.forEach(function (q, idx) {
            const rec = answers[q.id];
            if (rec && !rec.correct) {
              rows.push({ idx: idx, no: idx + 1, type: q.type, section: q.section });
            }
          });
          if (rows.length) {
            total += rows.length;
            groups.push({ key: paper.key, title: paper.title, rows: rows });
          }
        })
        .catch(function () { /* 单卷失败不影响其他卷 */ })
        .then(step);
    }

    step();
  },

  open(e) {
    const key = e.currentTarget.dataset.key;
    const idx = e.currentTarget.dataset.idx;
    wx.navigateTo({ url: '/packageExam/pages/practice/practice?paper=' + key + '&jump=' + idx });
  },

  goPapers() {
    wx.navigateTo({ url: '/packageExam/pages/papers/papers' });
  },
  onShareAppMessage: function () {
    const s = share.fallback();
    return { title: s.title, path: s.path, imageUrl: share.cover('home') };
  },

  onShareTimeline: function () {
    return share.timeline(share.fallback(), 'home');
  }
});
