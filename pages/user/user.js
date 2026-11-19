const USER_STORAGE_KEY = 'userProfile';
const USER_FIRST_REGISTER_AT_KEY = 'userFirstRegisterAt';
const learningCenter = require('../../utils/learning-center.js');
const globalProfile = require('../../utils/global-profile.js');

Page({
  data: {
    profile: null,
    isRegistered: false,
    editing: true,
    learningSummary: {
      wrongCount: 0,
      favoriteCount: 0,
      totalMinutes: 0,
      lastStudyAt: 0,
      lastStudyText: '暂无学习记录'
    },
    wrongList: [],
    favoriteList: [],
    studySessionList: [],
    showAllWrong: false,
    showAllFavorite: false,
    collapseWrong: false,
    collapseFavorite: false,
    collapseSession: false,
    form: {
      avatarUrl: '',
      nickName: ''
    }
  },

  onShow() {
    this.loadProfile();
    this.syncGlobalProfile();
    this.loadLearningDashboard();
  },

  loadLearningDashboard() {
    const summary = learningCenter.getSummary();
    const data = learningCenter.getData();

    const wrongList = (data.wrongQuestions || []).map(item => ({
      ...item,
      sourceText: this.mapSourceLabel(item.source),
      updatedText: this.formatRelativeTime(item.updatedAt)
    }));

    const favoriteList = (data.favorites || []).map(item => ({
      ...item,
      sourceText: this.mapSourceLabel(item.source),
      updatedText: this.formatRelativeTime(item.updatedAt)
    }));

    const sessionList = (data.studySessions || []).slice(0, 6).map(item => ({
      ...item,
      moduleText: this.mapSourceLabel(item.module),
      durationText: this.formatDuration(item.durationSec),
      atText: this.formatRelativeTime(item.at)
    }));

    this.setData({
      learningSummary: {
        ...summary,
        lastStudyText: summary.lastStudyAt ? this.formatRelativeTime(summary.lastStudyAt) : '暂无学习记录'
      },
      wrongList,
      favoriteList,
      studySessionList: sessionList
    });
  },

  formatDuration(sec) {
    const totalSec = Math.max(0, Math.floor(Number(sec) || 0));
    const min = Math.floor(totalSec / 60);
    const rest = totalSec % 60;
    if (min <= 0) {
      return `${rest}秒`;
    }
    return `${min}分${rest}秒`;
  },

  formatRelativeTime(ts) {
    const time = Number(ts) || 0;
    if (!time) {
      return '未知';
    }

    const diff = Date.now() - time;
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / 86400000)}天前`;
    }

    const date = new Date(time);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  formatDateTime(ts) {
    const time = Number(ts) || 0;
    if (!time) {
      return '未知';
    }

    const date = new Date(time);
    if (Number.isNaN(date.getTime())) {
      return '未知';
    }

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  },

  mapSourceLabel(source) {
    const map = {
      quiz: '题库问答',
      word: '单词学习',
      'exam-408': '408刷题',
      'exam-math1': '数学一刷题',
      'exam-math': '数学刷题',
      memo: '椰子记事'
    };
    return map[source] || source || '学习模块';
  },

  loadProfile() {
    const profile = wx.getStorageSync(USER_STORAGE_KEY);
    if (profile && profile.nickName) {
      const firstRegisterAt = Number(wx.getStorageSync(USER_FIRST_REGISTER_AT_KEY)) || Number(profile.createdAt) || 0;
      if (firstRegisterAt) {
        wx.setStorageSync(USER_FIRST_REGISTER_AT_KEY, firstRegisterAt);
      }

      const normalizedProfile = {
        ...profile,
        createdAt: firstRegisterAt || Number(profile.createdAt) || 0,
        createdAtText: this.formatDateTime(firstRegisterAt || profile.createdAt)
      };

      this.setData({
        profile: normalizedProfile,
        isRegistered: true,
        editing: false,
        form: {
          avatarUrl: normalizedProfile.avatarUrl || '',
          nickName: normalizedProfile.nickName || ''
        }
      });
      return;
    }

    this.setData({
      profile: null,
      isRegistered: false,
      editing: true,
      form: {
        avatarUrl: '',
        nickName: ''
      }
    });
  },

  // 个人中心 ↔ 小火苗：同一份全局资料
  // 1) 服务端已有资料 -> 回填本地；2) 本地已注册 -> 补同步服务端
  syncGlobalProfile() {
    const that = this;
    // 用户正在编辑已注册资料时，不要用远端覆盖输入框
    if (this.data.editing && this.data.isRegistered) return;
    globalProfile.syncFromServer()
      .then(function () { return globalProfile.pushLocalProfile(); })
      .then(function () {
        if (that.data.editing && that.data.isRegistered) return;
        const latest = globalProfile.getLocalProfile();
        const shown = that.data.profile;
        if (latest && latest.nickName &&
            (!shown || shown.nickName !== latest.nickName || shown.avatarUrl !== latest.avatarUrl)) {
          that.loadProfile();
        }
      })
      .catch(function () {
        // 网络失败不影响本地注册；下次 onShow 自动重试
      });
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    if (!avatarUrl) {
      return;
    }
    this.setData({
      'form.avatarUrl': avatarUrl
    });
  },

  onNickNameInput(e) {
    this.setData({
      'form.nickName': e.detail.value.trim()
    });
  },

  submitProfile() {
    const form = this.data.form;
    if (!form.nickName) {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      });
      return;
    }

    if (!form.avatarUrl) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      });
      return;
    }

    const oldProfile = wx.getStorageSync(USER_STORAGE_KEY) || {};
    globalProfile.markLoggedIn();
    const firstRegisterAt = Number(wx.getStorageSync(USER_FIRST_REGISTER_AT_KEY)) || Number(oldProfile.createdAt) || Date.now();
    wx.setStorageSync(USER_FIRST_REGISTER_AT_KEY, firstRegisterAt);

    const profile = {
      ...oldProfile,
      userId: oldProfile.userId || `wx_${Date.now()}`,
      nickName: form.nickName,
      avatarUrl: form.avatarUrl,
      createdAt: firstRegisterAt,
      updatedAt: Date.now()
    };

    wx.setStorageSync(USER_STORAGE_KEY, profile);

    this.setData({
      profile: {
        ...profile,
        createdAtText: this.formatDateTime(profile.createdAt)
      },
      isRegistered: true,
      editing: false
    });

    wx.showToast({
      title: oldProfile.nickName ? '资料已更新' : '注册成功',
      icon: 'success'
    });

    // 关键：注册/修改后立刻同步到小火苗全局账号；失败则下次 onShow 重试
    const that = this;
    globalProfile.pushLocalProfile(profile)
      .then(function (latest) {
        if (latest && latest.avatarUrl) {
          that.loadProfile();
        }
      })
      .catch(function () {
        wx.showToast({ title: '已保存到本地，联网后同步', icon: 'none' });
      });
  },

  startEdit() {
    this.setData({
      editing: true
    });
  },

  cancelEdit() {
    this.loadProfile();
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出并清除本地注册信息吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        globalProfile.clearSession();
        wx.removeStorageSync(USER_STORAGE_KEY);
        this.loadProfile();
        wx.showToast({
          title: '已退出',
          icon: 'success'
        });
      }
    });
  },

  goModule(e) {
    const target = e.currentTarget.dataset.target;
    if (target === 'quiz') {
      wx.switchTab({ url: '/pages/quiz/quiz' });
      return;
    }

    if (target === 'search') {
      wx.switchTab({ url: '/pages/search/search' });
      return;
    }

    if (target === 'exam') {
      wx.showActionSheet({
        itemList: ['408 计算机综合', '考研数学一'],
        success: (res) => {
          const type = res.tapIndex === 0 ? '408' : 'math';
          wx.navigateTo({
            url: `/packagetoken/pages/exam/exam?type=${type}`
          });
        }
      });
      return;
    }

    if (target === 'word') {
      wx.navigateTo({ url: '/packagetoken/pages/word/word' });
      return;
    }

    if (target === 'history') {
      wx.navigateTo({ url: '/pages/emotion-history/emotion-history' });
    }
  },

  openFromSource(source) {
    if (source === 'quiz') {
      wx.switchTab({ url: '/pages/quiz/quiz' });
      return;
    }
    if (source === 'word') {
      wx.navigateTo({ url: '/packagetoken/pages/word/word' });
      return;
    }
    if (source === 'exam-408') {
      wx.navigateTo({ url: '/packagetoken/pages/exam/exam?type=408' });
      return;
    }
    if (source === 'exam-math1' || source === 'exam-math') {
      wx.navigateTo({ url: '/packagetoken/pages/exam/exam?type=math' });
      return;
    }
    wx.switchTab({ url: '/pages/index/index' });
  },

  reviewWrong(e) {
    const source = e.currentTarget.dataset.source;
    this.openFromSource(source);
  },

  removeWrong(e) {
    const key = e.currentTarget.dataset.key;
    learningCenter.removeWrongQuestion(key);
    this.loadLearningDashboard();
    wx.showToast({ title: '已删除错题', icon: 'none' });
  },

  reviewFavorite(e) {
    const source = e.currentTarget.dataset.source;
    const route = e.currentTarget.dataset.route;
    if (route) {
      if (route.indexOf('/pages/quiz/quiz') === 0 || route.indexOf('/pages/search/search') === 0) {
        wx.switchTab({ url: route });
      } else {
        wx.navigateTo({ url: route });
      }
      return;
    }
    this.openFromSource(source);
  },

  removeFavorite(e) {
    const key = e.currentTarget.dataset.key;
    learningCenter.removeFavorite(key);
    this.loadLearningDashboard();
    wx.showToast({ title: '已取消收藏', icon: 'none' });
  },

  toggleWrongExpand() {
    this.setData({ showAllWrong: !this.data.showAllWrong });
  },

  toggleFavoriteExpand() {
    this.setData({ showAllFavorite: !this.data.showAllFavorite });
  },

  toggleWrongCollapse() {
    this.setData({ collapseWrong: !this.data.collapseWrong });
  },

  toggleFavoriteCollapse() {
    this.setData({ collapseFavorite: !this.data.collapseFavorite });
  },

  toggleSessionCollapse() {
    this.setData({ collapseSession: !this.data.collapseSession });
  },

  clearLearningData() {
    wx.showModal({
      title: '清空学习记录',
      content: '将清空错题、收藏、学习时长记录，确定继续吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        learningCenter.clearAllLearningData();
        this.loadLearningDashboard();
        wx.showToast({ title: '已清空', icon: 'none' });
      }
    });
  }
});
