const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'guokao', label: '国考' },
  { key: 'shengkao', label: '省考' }
];

Page({
  data: {
    tabs: TABS,
    filter: 'all',
    groups: [],
    loading: true,
    error: '',
    totalPapers: 0,
    totalQuestions: 0
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
        papers.sort(function (a, b) {
          return String(b.year).localeCompare(String(a.year)) || String(a.key).localeCompare(String(b.key));
        });
        that.all = papers.map(function (p) {
          return {
            key: p.key,
            title: p.title,
            year: String(p.year || ''),
            examType: p.examType || 'guokao',
            total: p.questionCount,
            done: Object.keys(store.getProgress(p.key).answers || {}).length
          };
        });
        const nq = that.all.reduce(function (a, x) { return a + x.total; }, 0);
        that.setData({ totalPapers: that.all.length, totalQuestions: nq, loading: false });
        that.applyFilter(that.data.filter);
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '加载失败' });
      });
  },

  applyFilter(filter) {
    const list = (this.all || []).filter(function (p) {
      if (filter === 'all') return true;
      if (filter === 'shengkao') return p.examType === 'shengkao' || p.examType === 'liankao';
      return p.examType === filter;
    });
    const groups = [];
    const byYear = {};
    list.forEach(function (p) {
      if (!byYear[p.year]) {
        byYear[p.year] = { year: p.year, papers: [] };
        groups.push(byYear[p.year]);
      }
      byYear[p.year].papers.push(p);
    });
    this.setData({ groups: groups, filter: filter });
  },

  tapTab(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.filter) return;
    this.applyFilter(key);
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
