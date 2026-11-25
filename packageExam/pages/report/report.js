const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

Page({
  data: {
    loading: true,
    stats: { total: 0, correct: 0, todayCount: 0, streak: 0 },
    rate: 0,
    papers: [],
    questionTotal: 0,
    paperCount: 0
  },

  onShow() {
    this.load();
  },

  load() {
    const that = this;
    const stats = store.getStats();
    this.setData({
      stats: stats,
      rate: stats.total ? Math.round((stats.correct * 100) / stats.total) : 0
    });

    api.loadIndex()
      .then(function (data) {
        const list = ((data && data.papers) || []).map(function (p) {
          const prog = store.getProgress(p.key);
          const answers = prog.answers || {};
          let done = 0;
          let right = 0;
          Object.keys(answers).forEach(function (k) {
            done += 1;
            if (answers[k] && answers[k].correct) right += 1;
          });
          return {
            key: p.key,
            title: p.shortName || p.title,
            total: p.questionCount,
            done: done,
            right: right,
            percent: p.questionCount ? Math.round((done * 100) / p.questionCount) : 0,
            accuracy: done ? Math.round((right * 100) / done) : 0
          };
        });
        that.setData({
          loading: false,
          papers: list,
          paperCount: list.length,
          questionTotal: list.reduce(function (a, x) { return a + x.total; }, 0)
        });
      })
      .catch(function () {
        that.setData({ loading: false });
      });
  },

  open(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({ url: '/packageExam/pages/practice/practice?paper=' + key });
  }
});
