const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

Page({
  data: {
    loading: true,
    title: '',
    total: 0,
    answered: 0,
    correct: 0,
    cells: []
  },

  onLoad(options) {
    const key = (options && options.paper) || '';
    if (!key) {
      this.setData({ loading: false });
      return;
    }
    this.key = key;
    this.load();
  },

  load() {
    const that = this;
    api.loadPaper(this.key)
      .then(function (raw) {
        const paper = api.normalizePaper(raw);
        const prog = store.getProgress(paper.key);
        const answers = prog.answers || {};
        let answered = 0;
        let correct = 0;
        const cells = paper.questions.map(function (q, i) {
          const rec = answers[q.id];
          if (rec) {
            answered += 1;
            if (rec.correct) correct += 1;
          }
          return {
            i: i,
            no: i + 1,
            state: rec ? (rec.correct ? 'right' : 'wrong') : 'todo'
          };
        });
        that.setData({
          loading: false,
          title: paper.title,
          total: paper.questions.length,
          answered: answered,
          correct: correct,
          cells: cells
        });
      })
      .catch(function () {
        that.setData({ loading: false });
      });
  },

  jump(e) {
    const i = e.currentTarget.dataset.i;
    wx.setStorageSync('exam:jump', i);
    wx.navigateBack({ delta: 1 });
  }
});
