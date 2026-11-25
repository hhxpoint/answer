const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');
const sync = require('../../utils/exam-sync.js');
const share = require('../../utils/share.js');

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

Page({
  data: {
    loading: true,
    error: '',
    paperTitle: '',
    tab: 0,
    materials: [],
    q: null,
    qIndex: 0,
    total: 0,
    answer: '',
    chars: 0,
    wordMax: 0,
    wordMin: 0,
    score: 0,
    typeLabel: '',
    timer: '00:00',
    savedText: ''
  },

  onLoad(options) {
    share.enableMenu();
    this.key = (options && options.paper) || '';
    if (!this.key) {
      this.setData({ loading: false, error: '缺少试卷参数' });
      return;
    }
    this.load();
  },

  onShow() {
    this.startTimer();
  },

  onHide() {
    this.persist();
  },

  onUnload() {
    this.persist();
    this.stopTimer();
  },

  load() {
    const that = this;
    this.setData({ loading: true, error: '' });
    api.loadEssay(this.key)
      .then(function (paper) {
        that.paper = paper;
        that.draft = store.getEssayDraft(paper.key);
        if (!that.draft.startedAt) {
          that.draft.startedAt = Date.now();
          store.saveEssayDraft(paper.key, that.draft);
        }
        that.setData({
          loading: false,
          paperTitle: paper.title,
          materials: paper.materials || [],
          total: paper.questions.length
        });
        that.render(that.draft.qIndex || 0);
        sync.auto();
        that.startTimer();
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '试卷加载失败' });
      });
  },

  render(i) {
    const paper = this.paper;
    if (!paper) return;
    const q = paper.questions[i];
    if (!q) return;
    const answer = (this.draft.answers && this.draft.answers[q.no]) || '';
    this.cur = i;
    this.setData({
      qIndex: i,
      q: q,
      score: q.score,
      wordMax: q.wordMax,
      wordMin: q.wordMin,
      typeLabel: q.type,
      answer: answer,
      chars: String(answer).replace(/\s/g, '').length
    });
  },

  switchTab(e) {
    const tab = Number(e.currentTarget.dataset.tab);
    this.setData({ tab: tab });
    this.draft.tab = tab;
    store.saveEssayDraft(this.key, this.draft);
  },

  onInput(e) {
    const v = e.detail.value;
    const chars = String(v).replace(/\s/g, '').length;
    this.setData({ answer: v, chars: chars });
    this.draft.answers[this.data.q.no] = v;
    this.pendingSave = true;
  },

  prevQ() {
    if (this.cur <= 0) return;
    this.persist();
    this.render(this.cur - 1);
  },

  nextQ() {
    if (this.cur >= this.data.total - 1) {
      wx.showToast({ title: '已是最后一题', icon: 'none' });
      return;
    }
    this.persist();
    this.render(this.cur + 1);
  },

  /** 保存草稿（含编辑器当前内容） */
  persist() {
    if (!this.draft || !this.data.q) return;
    this.draft.qIndex = this.cur;
    this.draft.answers[this.data.q.no] = this.data.answer;
    this.draft.elapsedMs = this.data.elapsedMs || this.draft.elapsedMs || 0;
    store.saveEssayDraft(this.key, this.draft);
    sync.pushSoon('essay', this.key, this.draft);
    this.pendingSave = false;
    this.setData({ savedText: '已保存 ' + new Date().toTimeString().slice(0, 5) });
  },

  saveTap() {
    this.persist();
    wx.showToast({ title: '草稿已保存', icon: 'success' });
  },

  startTimer() {
    if (this.timer || !this.draft) return;
    const that = this;
    this.timer = setInterval(function () {
      const started = that.draft.startedAt || Date.now();
      const sec = Math.max(0, Math.floor((Date.now() - started) / 1000));
      that.setData({
        elapsedMs: sec * 1000,
        timer: pad(Math.floor(sec / 60)) + ':' + pad(sec % 60)
      });
      // 每 5 秒自动存一次
      if (that.pendingSave && sec % 5 === 0) that.persist();
    }, 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  goReview() {
    if (!this.data.q) return;
    this.persist();
    wx.navigateTo({
      url: '/packageExam/pages/essay-review/essay-review?paper=' + this.key + '&q=' + this.data.q.no
    });
  },

  retry() {
    this.load();
  },
  onShareAppMessage: function () {
    const s = share.essayPractice(this.key, this.data.q, this.data.qIndex);
    return { title: s.title, path: s.path, imageUrl: share.cover('essay') };
  },

  onShareTimeline: function () {
    return share.timeline(share.essayPractice(this.key, this.data.q, this.data.qIndex), 'essay');
  }
});
