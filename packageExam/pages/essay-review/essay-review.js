const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');
const grader = require('../../utils/essay-grader.js');

Page({
  data: {
    loading: true,
    error: '',
    q: null,
    answer: '',
    inspect: null,
    points: [],
    checked: [],
    estimated: 0,
    maxScore: 0,
    paperTitle: '',
    graded: null,
    grading: false
  },

  onLoad(options) {
    this.key = (options && options.paper) || '';
    this.qno = Number((options && options.q) || 1);
    this.load();
  },

  load() {
    const that = this;
    api.loadEssay(this.key)
      .then(function (paper) {
        const q = (paper.questions || []).filter(function (x) { return x.no === that.qno; })[0];
        if (!q) {
          that.setData({ loading: false, error: '题目不存在' });
          return;
        }
        const draft = store.getEssayDraft(paper.key);
        const answer = (draft.answers && draft.answers[q.no]) || '';
        const checked = (draft.checked && draft.checked[q.no]) || [];
        const points = (q.keyPoints || []).map(function (p, i) {
          return { i: i, label: p.label, detail: p.detail, from: p.from, on: checked.indexOf(i) >= 0 };
        });
        const saved = (draft.grades && draft.grades[q.no]) || null;
        that.setData({
          loading: false,
          paperTitle: paper.title,
          q: q,
          answer: answer,
          inspect: store.inspectAnswer(answer, q),
          points: points,
          checked: checked,
          maxScore: q.score,
          estimated: store.scoreEssay(q, checked),
          graded: saved
        });
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '加载失败' });
      });
  },

  toggle(e) {
    const i = Number(e.currentTarget.dataset.i);
    const points = this.data.points.map(function (p) {
      return p.i === i ? Object.assign({}, p, { on: !p.on }) : p;
    });
    const checked = points.filter(function (p) { return p.on; }).map(function (p) { return p.i; });
    this.setData({
      points: points,
      checked: checked,
      estimated: store.scoreEssay(this.data.q, checked)
    });
    this.saveSelfCheck(checked);
  },

  saveSelfCheck(checked) {
    const draft = store.getEssayDraft(this.key);
    draft.checked = draft.checked || {};
    draft.checked[this.data.q.no] = checked;
    store.saveEssayDraft(this.key, draft);
  },

  /** 红领巾批改：规则引擎打分，结果落盘便于复盘 */
  runGrade() {
    if (!this.data.q) return;
    if (!String(this.data.answer).trim()) {
      wx.showToast({ title: '还没有作答内容', icon: 'none' });
      return;
    }
    this.setData({ grading: true });
    const that = this;
    setTimeout(function () {
      const g = grader.grade(that.data.q, that.data.answer, that.data.inspect);
      const draft = store.getEssayDraft(that.key);
      draft.grades = draft.grades || {};
      draft.grades[that.data.q.no] = g;
      store.saveEssayDraft(that.key, draft);
      that.setData({ graded: g, grading: false });
      wx.showToast({ title: '批改完成', icon: 'success' });
    }, 260);
  },

  backToWrite() {
    wx.navigateBack({ delta: 1 });
  }
});
