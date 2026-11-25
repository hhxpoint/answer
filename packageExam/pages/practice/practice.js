const api = require('../../utils/exam-api.js');
const store = require('../../utils/exam-store.js');

const SECTION_LABEL = {
  zzll: '政治理论',
  cs: '常识判断',
  yy: '言语理解',
  sl: '数量关系',
  pd: '判断推理',
  zl: '资料分析'
};

const K_JUMP = 'exam:jump';

function blocksToText(blocks) {
  let s = '';
  (blocks || []).forEach(function (b) {
    (b.parts || []).forEach(function (p) {
      if (p.t) s += p.t;
    });
  });
  return s.trim();
}

Page({
  data: {
    loading: true,
    error: '',
    paperKey: '',
    paperTitle: '',
    idx: 0,
    total: 0,
    answered: 0,
    correct: 0,
    q: null,
    materialKey: '',
    materials: [],
    showMaterial: true,
    picked: '',
    revealed: false,
    isCorrect: false,
    sectionLabel: '',
    typeLabel: ''
  },

  onLoad(options) {
    this.paperKey = (options && options.paper) || '';
    this.poolSlug = (options && options.pool) || '';
    this.jumpTo = parseInt(options && options.jump, 10);
    if (!this.paperKey && !this.poolSlug) {
      this.setData({ loading: false, error: '缺少练习参数' });
      return;
    }
    this.load();
  },

  onShow() {
    // 从答题卡跳回来
    if (!this.paper) return;
    const jump = wx.getStorageSync(K_JUMP);
    if (typeof jump === 'number' && jump >= 0 && jump < this.paper.questions.length) {
      wx.removeStorageSync(K_JUMP);
      this.render(jump, true);
    }
  },

  onUnload() {
    this.persistIdx();
  },

  load() {
    const that = this;
    this.setData({ loading: true, error: '' });
    const task = this.poolSlug ? this.loadPoolTask() : api.loadPaper(this.paperKey).then(function (raw) {
      return api.normalizePaper(raw);
    });

    task
      .then(function (paper) {
        that.paper = paper;
        that.progress = store.getProgress(paper.key);
        let idx = Math.min(that.progress.idx || 0, paper.questions.length - 1);
        if (typeof that.jumpTo === 'number' && that.jumpTo >= 0 && that.jumpTo < paper.questions.length) {
          idx = that.jumpTo;
        }
        that.setData({
          paperTitle: paper.title,
          total: paper.questions.length,
          loading: false
        });
        that.render(idx < 0 ? 0 : idx, false);
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '题目加载失败' });
      });
  },

  /** 专项池 → 与试卷同构的对象（不含材料） */
  loadPoolTask() {
    const slug = this.poolSlug;
    return api.loadPool(slug).then(function (pool) {
      const questions = (pool.questions || []).map(function (q, i) {
        return Object.assign({}, q, {
          no: i + 1,
          material: null,
          needsReview: 0
        });
      });
      return {
        key: 'pool-' + slug,
        title: (pool.type || '专项练习') + ' · 专项',
        questionCount: questions.length,
        materials: {},
        questions: questions
      };
    });
  },

  /** 渲染第 i 题 */
  render(i, keepReveal) {
    const paper = this.paper;
    if (!paper) return;
    const q = paper.questions[i];
    if (!q) return;

    const opts = (q.options || []).map(function (o) {
      const text = blocksToText(o.blocks);
      const hasImg = (o.blocks || []).some(function (b) {
        return (b.parts || []).some(function (p) { return p.src; });
      });
      return {
        key: o.key,
        text: text === o.key ? '' : text,
        seeHint: !hasImg && (text === o.key || !text),
        blocks: o.blocks
      };
    });

    // 材料
    let materials = [];
    if (q.material) {
      const group = (paper.materials[q.section] || {})[q.material] || [];
      materials = group;
    }

    const rec = (this.progress && this.progress.answers[q.id]) || null;
    const answers = (this.progress && this.progress.answers) || {};
    const answered = Object.keys(answers).length;
    let correct = 0;
    Object.keys(answers).forEach(function (k) {
      if (answers[k] && answers[k].correct) correct += 1;
    });

    this.curIdx = i;
    // 选项模型必须回写到渲染用的题目对象里（否则「见下图选项」等预计算结果不生效）
    const qv = Object.assign({}, q, { options: opts });
    this.setData({
      idx: i,
      q: qv,
      materials: materials,
      showMaterial: true,
      picked: rec ? rec.pick : '',
      revealed: !!rec || !!keepReveal,
      isCorrect: rec ? !!rec.correct : false,
      answered: answered,
      correct: correct,
      sectionLabel: SECTION_LABEL[q.section] || q.section,
      typeLabel: q.type
    });
  },

  /** 选择选项 */
  pick(e) {
    if (this.data.revealed) return;
    const key = e.currentTarget.dataset.key;
    const q = this.data.q;
    if (!q) return;
    const correct = key === q.answer;
    this.progress = store.recordAnswer(this.paperKey, q.id, key, correct);
    const answers = this.progress.answers || {};
    let n = 0;
    let c = 0;
    Object.keys(answers).forEach(function (k) {
      n += 1;
      if (answers[k] && answers[k].correct) c += 1;
    });
    this.setData({
      picked: key,
      revealed: true,
      isCorrect: correct,
      answered: n,
      correct: c
    });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  next() {
    const i = this.data.idx + 1;
    if (i >= this.data.total) {
      this.setData({ finished: true });
      wx.showToast({ title: '已是最后一题', icon: 'none' });
      return;
    }
    this.render(i, false);
    this.persistIdx();
  },

  prev() {
    const i = this.data.idx - 1;
    if (i < 0) return;
    this.render(i, false);
    this.persistIdx();
  },

  persistIdx() {
    if (!this.paper) return;
    const p = this.progress || store.getProgress(this.paperKey);
    p.idx = this.data.idx;
    store.saveProgress(this.paperKey, p);
  },

  goCard() {
    this.persistIdx();
    wx.navigateTo({ url: '/packageExam/pages/card/card?paper=' + this.paperKey });
  },

  toggleMaterial() {
    this.setData({ showMaterial: !this.data.showMaterial });
  },

  preview(e) {
    const src = e.currentTarget.dataset.src;
    if (src) wx.previewImage({ urls: [src], current: src });
  },

  retry() {
    this.load();
  }
});
