const jwzxApi = require('../../../utils/jwzx-api');

Page({
  data: {
    isLoggedIn: false,
    studentName: '',
    studentId: '',

    years: [],
    terms: [],
    selectedYear: '',
    selectedTerm: '',
    yearIndex: 0,
    termIndex: 0,

    scores: [],
    loading: false,
    loadingAll: false,
    loadProgress: '',
    hasLoaded: false,

    semesterGPA: '--',
    semesterCredits: 0,
    requiredGPA: '--',
    requiredCredits: 0,
    totalCourses: 0,
    passedCourses: 0,

    viewMode: 'list',
    expandedIndex: -1,
    sortBy: 'default'
  },

  onLoad() {
    this.checkLoginAndLoad();
  },

  onShow() {
    if (this.data.isLoggedIn) {
      this.verifySession();
    }
  },

  checkLoginAndLoad() {
    const token = jwzxApi.getToken();
    if (!token) {
      this.setData({ isLoggedIn: false });
      return;
    }
    this.setData({ loading: true });
    jwzxApi.checkStatus(token).then(res => {
      console.log('[scores] checkStatus:', JSON.stringify(res));
      if (res.success && res.logged_in) {
        this.setData({
          isLoggedIn: true,
          studentName: res.student_name || '',
          studentId: res.student_id || '',
          loading: false
        });
        jwzxApi.saveStudentInfo({ name: res.student_name, id: res.student_id });
        this.loadSemesters();
      } else {
        this.setData({ loading: false });
        this.handleSessionExpired();
      }
    }).catch(err => {
      console.error('[scores] checkStatus error:', err);
      this.setData({ loading: false });
      this.handleSessionExpired();
    });
  },

  verifySession() {
    const token = jwzxApi.getToken();
    if (!token) { this.handleSessionExpired(); return; }
    jwzxApi.checkStatus(token).then(res => {
      if (!res.success || !res.logged_in) this.handleSessionExpired();
    }).catch(() => {});
  },

  handleSessionExpired() {
    jwzxApi.clearToken();
    this.setData({ isLoggedIn: false });
    wx.showModal({
      title: '登录已过期',
      content: '教务系统登录已过期，是否重新登录？',
      confirmText: '重新登录',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) this.goLogin();
        else wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
      }
    });
  },

  goLogin() {
    wx.redirectTo({
      url: '/packageJwzx/pages/login/login?from=' + encodeURIComponent('/packageJwzx/pages/scores/scores')
    });
  },

  /** 加载学期列表 */
  loadSemesters() {
    jwzxApi.getSemesters().then(res => {
      console.log('[scores] semesters response:', JSON.stringify(res));
      if (!res.success) {
        wx.showToast({ title: res.message || '获取学期失败', icon: 'none' });
        return;
      }

      const enrollYear = res.enrollment_year || 2023;
      let years = res.years || [];
      let terms = res.terms || [];

      // 过滤学年：入学年份 到 入学+5（如 2023~2028）
      const minYear = enrollYear;
      const maxYear = enrollYear + 5;
      const originalYears = years.slice();
      years = years.filter(y => {
        const yr = parseInt(y.label);
        return !isNaN(yr) && yr >= minYear && yr <= maxYear;
      });
      if (years.length === 0) years = originalYears;

      // 默认选中：优先选后端标记的 selected，否则选入学年份的秋学期（第一学期）
      let selectedYearIdx = years.findIndex(y => y.selected);
      if (selectedYearIdx < 0) {
        // 没有默认选中，选入学年份对应的项
        selectedYearIdx = years.findIndex(y => parseInt(y.label) === enrollYear);
        if (selectedYearIdx < 0) selectedYearIdx = 0;
      }

      let selectedTermIdx = terms.findIndex(t => t.selected);
      if (selectedTermIdx < 0) selectedTermIdx = 0;

      const selectedYear = years[selectedYearIdx]?.value || '';
      const selectedTerm = terms[selectedTermIdx]?.value || '';

      console.log('[scores] filtered years:', years.map(y => y.label + '=' + y.value));
      console.log('[scores] selected:', selectedYear, selectedTerm);

      this.setData({
        years: years,
        terms: terms,
        yearIndex: selectedYearIdx,
        termIndex: selectedTermIdx,
        selectedYear: selectedYear,
        selectedTerm: selectedTerm
      });

      if (selectedYear && selectedTerm) {
        this.loadScores();
      } else {
        this.setData({ loading: false });
      }
    }).catch(err => {
      console.error('[scores] semesters error:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '获取学期失败', icon: 'none' });
    });
  },

  onYearChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({
      yearIndex: idx,
      selectedYear: this.data.years[idx]?.value || ''
    });
    if (this.data.selectedYear && this.data.selectedTerm) {
      this.loadScores();
    }
  },

  onTermChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({
      termIndex: idx,
      selectedTerm: this.data.terms[idx]?.value || ''
    });
    if (this.data.selectedYear && this.data.selectedTerm) {
      this.loadScores();
    }
  },

  /** 查询指定学期成绩 */
  loadScores() {
    const { selectedYear, selectedTerm } = this.data;
    if (!selectedYear || !selectedTerm) {
      this.setData({ loading: false });
      return;
    }

    console.log('[scores] loading: year=' + selectedYear + ' term=' + selectedTerm);
    this.setData({ loading: true, scores: [], hasLoaded: false, expandedIndex: -1 });

    jwzxApi.getScores(selectedYear, selectedTerm).then(res => {
      console.log('[scores] response:', JSON.stringify(res).substring(0, 500));
      this.setData({ loading: false });

      if (res.success) {
        const rawScores = res.scores || [];
        const processed = rawScores.map(s => ({
          ...s,
          gpa: jwzxApi.calcGPA(s.score),
          isRequired: jwzxApi.isRequired(s),
          scoreNum: parseFloat(s.score),
          creditNum: parseFloat(s.credit),
          _passed: false
        }));
        processed.forEach(s => { s._passed = this.isPassed(s); });
        this.setData({
          scores: processed,
          hasLoaded: true,
        });
        this.calcStats(processed);
      } else {
        this.setData({ hasLoaded: true });
        if (res.message === '未登录' || res.message === '会话不存在') {
          this.handleSessionExpired();
        } else {
          wx.showToast({ title: res.message || '查询失败', icon: 'none' });
        }
      }
    }).catch(err => {
      console.error('[scores] loadScores error:', err);
      this.setData({ loading: false, hasLoaded: true });
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  /** 查询全部成绩 */
  loadAllScores() {
    wx.showModal({
      title: '查询全部成绩',
      content: '将遍历所有学期，可能需要 5-15 秒，是否继续？',
      success: (modalRes) => {
        if (!modalRes.confirm) return;
        this.setData({ loadingAll: true, loadProgress: '正在查询...' });
        jwzxApi.getAllScores().then(res => {
          this.setData({ loadingAll: false, loadProgress: '' });
          if (res.success) {
            const scores = (res.scores || []).map(s => ({
              ...s,
              gpa: jwzxApi.calcGPA(s.score),
              isRequired: jwzxApi.isRequired(s),
              scoreNum: parseFloat(s.score),
              creditNum: parseFloat(s.credit),
              _passed: false
            }));
            scores.forEach(s => { s._passed = this.isPassed(s); });
            this.setData({ scores: scores, hasLoaded: true, loading: false });
            this.calcStats(scores);
            wx.showToast({ title: '获取到 ' + scores.length + ' 条成绩', icon: 'none' });
          } else {
            wx.showToast({ title: res.message || '查询失败', icon: 'none' });
          }
        }).catch(err => {
          this.setData({ loadingAll: false, loadProgress: '' });
          wx.showToast({ title: '网络错误', icon: 'none' });
        });
      }
    });
  },

  calcStats(scores) {
    if (!scores || scores.length === 0) {
      this.setData({
        semesterGPA: '--', semesterCredits: 0,
        requiredGPA: '--', requiredCredits: 0,
        totalCourses: 0, passedCourses: 0
      });
      return;
    }
    const semGPA = jwzxApi.calcSemesterGPA(scores, false);
    const reqGPA = jwzxApi.calcSemesterGPA(scores, true);
    let totalCredits = 0, passed = 0;
    scores.forEach(s => {
      const c = parseFloat(s.credit);
      if (!isNaN(c)) totalCredits += c;
      if (s._passed) passed++;
    });
    this.setData({
      semesterGPA: semGPA !== null ? semGPA.toFixed(2) : '--',
      semesterCredits: totalCredits,
      requiredGPA: reqGPA !== null ? reqGPA.toFixed(2) : '--',
      totalCourses: scores.length,
      passedCourses: passed
    });
  },

  /** 判断是否通过（数字>=60 或 等级不是"不及格"） */
  isPassed(s) {
    if (s.passed === '通过') return true;
    if (!isNaN(s.scoreNum) && s.scoreNum >= 60) return true;
    // 等级制：优秀/良好/中等/及格 都算通过
    const grade = (s.score || '').trim();
    if (grade && grade !== '不及格' && isNaN(parseFloat(grade))) return true;
    return false;
  },

  switchView(e) {
    this.setData({ viewMode: e.currentTarget.dataset.mode });
  },

  switchSort() {
    const sortModes = ['default', 'score-desc', 'score-asc', 'credit-desc'];
    const labels = ['默认排序', '成绩降序', '成绩升序', '学分降序'];
    const current = sortModes.indexOf(this.data.sortBy);
    const next = (current + 1) % sortModes.length;
    this.setData({ sortBy: sortModes[next] });
    wx.showToast({ title: labels[next], icon: 'none', duration: 800 });
  },

  toggleExpand(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ expandedIndex: this.data.expandedIndex === idx ? -1 : idx });
  },

  doLogout() {
    wx.showModal({
      title: '确认登出',
      content: '将清除登录状态和缓存的凭据',
      success: (res) => {
        if (res.confirm) {
          jwzxApi.logout().catch(() => {});
          jwzxApi.clearAll();
          this.setData({
            isLoggedIn: false, scores: [], hasLoaded: false,
            studentName: '', studentId: ''
          });
          wx.showToast({ title: '已登出', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage() {
    return { title: '分数查询 - 掷地有声', path: '/packageJwzx/pages/scores/scores' };
  }
});
