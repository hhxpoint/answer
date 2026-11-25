const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

const TYPE_ORDER = ['national'];

Page({
  data: {
    groups: [],
    loading: true,
    error: ''
  },

  onLoad() {
    this.load();
  },

  load() {
    const that = this;
    this.setData({ loading: true, error: '' });
    api.loadIndex()
      .then(function (data) {
        const papers = ((data && data.papers) || []).slice();
        // 按年份倒序
        papers.sort(function (a, b) {
          return String(b.year).localeCompare(String(a.year)) || String(a.key).localeCompare(String(b.key));
        });
        const groups = [];
        const byYear = {};
        papers.forEach(function (p) {
          const y = String(p.year || '');
          if (!byYear[y]) {
            byYear[y] = { year: y, papers: [] };
            groups.push(byYear[y]);
          }
          byYear[y].papers.push({
            key: p.key,
            title: p.title,
            shortName: p.shortName || p.title,
            questionCount: p.questionCount,
            done: 0,
            total: p.questionCount
          });
        });
        // 附上每卷进度
        groups.forEach(function (g) {
          g.papers.forEach(function (p) {
            const prog = store.getProgress(p.key);
            p.done = Object.keys(prog.answers || {}).length;
          });
        });
        that.setData({ groups: groups, loading: false });
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '加载失败' });
      });
  },

  open(e) {
    const key = e.currentTarget.dataset.key;
    if (!key) return;
    wx.navigateTo({ url: '/packageExam/pages/practice/practice?paper=' + key });
  },

  retry() {
    this.load();
  }
});
