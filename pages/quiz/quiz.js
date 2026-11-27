const { qaList } = require('../../data.js');
const learningCenter = require('../../utils/learning-center.js');

Page({
  onShow() {
    if (typeof getApp === 'function' && getApp().profileGuard && getApp().profileGuard.guard()) return;
  },

  data: {
    currentIndex: 0,
    showAnswer: false,
    currentQA: null,
    totalCount: 0,
    isFavorite: false,
    isWrongAdded: false,
    mode: 'sequence',
    autoNext: false,
    progressPercent: 0,
    viewedAnswerCount: 0,
    sessionActionCount: 0
  },

  startTime: 0,
  historyStack: [],
  autoTimer: null,

  onLoad() {
    this.startTime = Date.now();
    const totalCount = qaList.length;
    const firstIndex = totalCount > 0 ? 0 : -1;
    this.setData({
      totalCount
    });

    if (firstIndex >= 0) {
      this.renderQuestion(firstIndex, true);
    }
  },

  onHide() {
    this.clearAutoTimer();
    this.recordStudySession();
  },

  onUnload() {
    this.clearAutoTimer();
    this.recordStudySession();
  },

  clearAutoTimer() {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  },

  calcProgressPercent(index) {
    const total = this.data.totalCount || 1;
    const percent = Math.round(((index + 1) / total) * 100);
    return Math.max(1, Math.min(100, percent));
  },

  renderQuestion(index, resetAnswerState) {
    if (index < 0 || index >= this.data.totalCount) {
      return;
    }

    const nextData = {
      currentIndex: index,
      currentQA: qaList[index],
      isFavorite: this.getFavoriteState(index),
      isWrongAdded: this.getWrongState(index),
      progressPercent: this.calcProgressPercent(index)
    };

    if (resetAnswerState) {
      nextData.showAnswer = false;
    }

    this.setData(nextData);
  },

  getRandomIndex(excludeIndex) {
    const total = this.data.totalCount;
    if (total <= 1) {
      return 0;
    }

    let nextIndex = excludeIndex;
    while (nextIndex === excludeIndex) {
      nextIndex = Math.floor(Math.random() * total);
    }
    return nextIndex;
  },

  getNextIndex() {
    const current = this.data.currentIndex;
    const total = this.data.totalCount;
    if (this.data.mode === 'random') {
      return this.getRandomIndex(current);
    }

    let next = current + 1;
    if (next >= total) {
      next = 0;
      wx.showToast({ title: '已循环到第一题', icon: 'none' });
    }
    return next;
  },

  pushHistory(index) {
    if (typeof index !== 'number' || index < 0) {
      return;
    }
    this.historyStack.push(index);
    if (this.historyStack.length > 120) {
      this.historyStack = this.historyStack.slice(-120);
    }
  },

  recordStudySession() {
    if (!this.startTime) {
      return;
    }

    const durationSec = Math.floor((Date.now() - this.startTime) / 1000);
    if (durationSec < 5) {
      return;
    }

    learningCenter.addStudySession({
      module: 'quiz',
      durationSec,
      note: `通用题库训练 · ${this.data.mode === 'random' ? '随机模式' : '顺序模式'} · 查看解析${this.data.viewedAnswerCount}次`
    });
    this.startTime = 0;
  },

  getFavoriteState(index) {
    return learningCenter.isFavorited('quiz', `quiz_${index}`);
  },

  getWrongState(index) {
    const { wrongQuestions } = learningCenter.getData();
    return wrongQuestions.some(item => item.key === `wrong_quiz_quiz_${index}`);
  },

  toggleAnswer() {
    if (this.data.showAnswer) {
      return;
    }

    this.setData({
      showAnswer: true,
      viewedAnswerCount: this.data.viewedAnswerCount + 1
    });

    if (this.data.autoNext) {
      this.clearAutoTimer();
      this.autoTimer = setTimeout(() => {
        this.nextQuestion();
      }, 900);
    }
  },

  nextQuestion() {
    if (this.data.totalCount === 0) {
      return;
    }

    this.clearAutoTimer();
    this.pushHistory(this.data.currentIndex);
    const nextIndex = this.getNextIndex();
    this.renderQuestion(nextIndex, true);
  },

  prevQuestion() {
    if (!this.historyStack.length) {
      wx.showToast({ title: '没有上一题记录', icon: 'none' });
      return;
    }
    this.clearAutoTimer();
    const prevIndex = this.historyStack.pop();
    this.renderQuestion(prevIndex, true);
  },

  jumpRandom() {
    if (this.data.totalCount <= 1) {
      return;
    }

    this.clearAutoTimer();
    this.pushHistory(this.data.currentIndex);
    const randomIndex = this.getRandomIndex(this.data.currentIndex);
    this.renderQuestion(randomIndex, true);
    wx.showToast({ title: '已随机跳题', icon: 'none' });
  },

  toggleMode() {
    const nextMode = this.data.mode === 'sequence' ? 'random' : 'sequence';
    this.setData({ mode: nextMode });
    wx.showToast({ title: nextMode === 'random' ? '随机模式' : '顺序模式', icon: 'none' });
  },

  toggleAutoNext() {
    const autoNext = !this.data.autoNext;
    if (!autoNext) {
      this.clearAutoTimer();
    }
    this.setData({ autoNext });
    wx.showToast({ title: autoNext ? '已开启自动下一题' : '已关闭自动下一题', icon: 'none' });
  },

  onProgressSeek(e) {
    const value = Number(e.detail.value) || 1;
    const targetIndex = Math.max(0, Math.min(this.data.totalCount - 1, value - 1));
    if (targetIndex === this.data.currentIndex) {
      return;
    }

    this.clearAutoTimer();
    this.pushHistory(this.data.currentIndex);
    this.renderQuestion(targetIndex, true);
  },

  toggleFavorite() {
    const qa = this.data.currentQA;
    if (!qa) {
      return;
    }

    const idx = this.data.currentIndex;
    const result = learningCenter.toggleFavorite({
      source: 'quiz',
      itemId: `quiz_${idx}`,
      title: qa.question,
      subtitle: qa.answer,
      route: '/pages/quiz/quiz'
    });

    this.setData({ isFavorite: result.added });
    this.setData({ sessionActionCount: this.data.sessionActionCount + 1 });
    wx.showToast({ title: result.added ? '已收藏题目' : '已取消收藏', icon: 'none' });
  },

  toggleWrong() {
    const qa = this.data.currentQA;
    if (!qa) {
      return;
    }

    const idx = this.data.currentIndex;
    const key = `wrong_quiz_quiz_${idx}`;
    if (this.data.isWrongAdded) {
      learningCenter.removeWrongQuestion(key);
      this.setData({
        isWrongAdded: false,
        sessionActionCount: this.data.sessionActionCount + 1
      });
      wx.showToast({ title: '已移出错题本', icon: 'none' });
      return;
    }

    learningCenter.addWrongQuestion({
      source: 'quiz',
      questionId: `quiz_${idx}`,
      title: qa.question,
      answer: qa.answer,
      userAnswer: '手动加入',
      analysis: qa.answer,
      type: 'qa'
    });
    this.setData({
      isWrongAdded: true,
      sessionActionCount: this.data.sessionActionCount + 1
    });
    wx.showToast({ title: '已加入错题本', icon: 'none' });
  },

  onShareAppMessage: function () {
    return {
      title: '来一起刷题吧，我在这里整理了高频知识点',
      path: '/pages/quiz/quiz',
      imageUrl: '/assets/banner1.png'
    };
  },

  onShareTimeline: function () {
    return {
      title: '高频题库训练中，欢迎一起挑战',
      query: 'from=timeline',
      imageUrl: '/assets/banner1.png'
    };
  }

});