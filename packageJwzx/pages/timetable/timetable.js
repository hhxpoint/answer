const jwzxApi = require('../../../utils/jwzx-api');

Page({
  data: {
    isLoggedIn: false,
    studentName: '',
    loading: false,
    hasLoaded: false,

    // 课程原始数据
    courses: [],

    // 当前周次
    currentWeek: 1,
    maxWeek: 20,
    weekList: [],

    // 星期 & 节次
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    timeSlots: [
      { label: '1-2节', time: '08:10-09:50' },
      { label: '3-4节', time: '10:10-11:50' },
      { label: '5-6节', time: '13:30-15:10' },
      { label: '7-8节', time: '15:30-17:10' },
      { label: '9-10节', time: '18:00-19:40' },
      { label: '11-12节', time: '20:00-21:30' }
    ],
    gridData: [],

    // 无具体时间地点的课程
    noScheduleCourses: [],

    // 视图模式
    viewMode: 'grid',

    // 选中课程（弹窗）
    selectedCourse: null,

    // 颜色分配
    colorMap: {},
    courseColors: [
      '#5b7fd6', '#e8836b', '#6b9e7a', '#c49b6a',
      '#8b7ec8', '#5e9eaa', '#c47070', '#7e9e5e',
      '#aa7e6e', '#6a8ebb', '#b07eb8', '#6bba9e'
    ]
  },

  // ── 生命周期 ──────────────────────────────────

  onLoad() {
    this.checkLoginAndLoad();
  },

  onShow() {
    if (this.data.isLoggedIn) {
      this.verifySession();
    }
  },

  // ── 登录检查 ──────────────────────────────────

  checkLoginAndLoad() {
    const token = jwzxApi.getToken();
    if (!token) {
      this.setData({ isLoggedIn: false });
      return;
    }
    this.setData({ loading: true });
    jwzxApi.checkStatus(token).then(res => {
      if (res.success && res.logged_in) {
        this.setData({
          isLoggedIn: true,
          studentName: res.student_name || '',
          loading: false
        });
        this.loadCourses();
      } else {
        this.setData({ loading: false });
        this.handleSessionExpired();
      }
    }).catch(() => {
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
    const currentPath = '/packageJwzx/pages/timetable/timetable';
    wx.redirectTo({
      url: '/packageJwzx/pages/login/login?from=' + encodeURIComponent(currentPath)
    });
  },

  // ── 加载课表 ──────────────────────────────────

  loadCourses() {
    this.setData({ loading: true });
    jwzxApi.getCourses().then(res => {
      if (res.success) {
        const courses = res.courses || [];
        console.log('[timetable] courses count:', courses.length);

        // 解析每门课程的 location 字段（真正的上课时间地点在这里）
        courses.forEach(c => {
          c._schedules = this.parseLocationField(c.location || '');
        });

        // 分配颜色
        const colorMap = {};
        let colorIdx = 0;
        courses.forEach(c => {
          if (!colorMap[c.name]) {
            colorMap[c.name] = this.data.courseColors[colorIdx % this.data.courseColors.length];
            colorIdx++;
          }
        });

        // 计算最大周次
        let maxWeek = 1;
        courses.forEach(c => {
          (c._schedules || []).forEach(s => {
            if (s.weekEnd > maxWeek) maxWeek = s.weekEnd;
          });
        });
        if (maxWeek < 1) maxWeek = 20;

        // 周次列表
        const weekList = [];
        for (let i = 1; i <= maxWeek; i++) weekList.push(i);

        // 构建网格
        const { grid, noScheduleCourses } = this.buildGrid(courses, 1, colorMap);

        this.setData({
          courses,
          colorMap,
          maxWeek,
          weekList,
          currentWeek: 1,
          gridData: grid,
          noScheduleCourses,
          hasLoaded: true,
          loading: false
        });
      } else {
        this.setData({ loading: false, hasLoaded: true });
        if (res.message === '未登录' || res.message === '会话不存在') {
          this.handleSessionExpired();
        } else {
          wx.showToast({ title: res.message || '获取课表失败', icon: 'none' });
        }
      }
    }).catch(err => {
      console.error('[timetable] error:', err);
      this.setData({ loading: false, hasLoaded: true });
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  // ── 解析 location 字段 ────────────────────────────
  // 格式示例：
  //   "1-13周星期二第一大节西-新D4101-9单周星期四第四大节西-新D410"
  //   "1-13周 时间地点都不占"
  // 一个 location 可能包含多条排课记录拼在一起

  parseLocationField(locationStr) {
    if (!locationStr || !locationStr.trim()) return [];
    if (locationStr.includes('时间地点都不占') || locationStr.includes('不占')) return [];

    const results = [];
    const weekPattern = /(\d+)-(\d+)周/;
    let pos = 0;

    while (pos < locationStr.length) {
      // 找当前条目的周次范围
      const weekMatch = weekPattern.exec(locationStr.substring(pos));
      if (!weekMatch) break;

      const entryStart = pos + weekMatch.index;
      const weekStart = parseInt(weekMatch[1]);
      const weekEnd = parseInt(weekMatch[2]);
      const afterWeek = entryStart + weekMatch[0].length;

      // 找下一个条目的起点（下一个 X-Y周），确定当前条目边界
      const nextEntryOffset = locationStr.substring(afterWeek).search(/\d+-\d+周/);
      const entryTextEnd = nextEntryOffset >= 0 ? afterWeek + nextEntryOffset : locationStr.length;
      const entryText = locationStr.substring(entryStart, entryTextEnd);

      pos = entryTextEnd; // 推进到下一条

      // 单双周
      const oddEven = entryText.includes('单周') ? 'odd'
                    : entryText.includes('双周') ? 'even'
                    : 'all';

      // 星期几
      const dayMatch = entryText.match(/星期([一二三四五六日天])/);
      if (!dayMatch) continue;
      const dayMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7, '天': 7 };
      const day = dayMap[dayMatch[1]] || 0;
      if (!day) continue;

      // 节次
      let period = 0;
      const daJieMatch = entryText.match(/第([一二三四五六七八九十]+)大节/);
      if (daJieMatch) {
        const numMap = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
        period = numMap[daJieMatch[1]] || 0;
      }
      if (period === 0) {
        const jieMatch = entryText.match(/第(\d+)[-~](\d+)节/);
        if (jieMatch) period = Math.ceil(parseInt(jieMatch[1]) / 2);
      }
      if (period === 0) {
        const singleMatch = entryText.match(/第(\d+)节/);
        if (singleMatch) period = Math.ceil(parseInt(singleMatch[1]) / 2);
      }
      if (period === 0) continue;

      // 地点：节次关键字之后到当前条目文本末尾（不会混入下一条）
      let loc = '';
      const afterPeriod = entryText.match(/(?:大节|节)([\s\S]*)$/);
      if (afterPeriod) {
        loc = afterPeriod[1].trim().replace(/^[单双]周/, '').trim();
      }

      results.push({ weekStart, weekEnd, oddEven, day, period, location: loc });
    }

    return results;
  },

  // ── 构建网格 ──────────────────────────────────

  buildGrid(courses, currentWeek, colorMap) {
    // 初始化 6 行 x 7 列空网格
    const grid = this.data.timeSlots.map(slot => ({
      slotLabel: slot.label,
      slotTime: slot.time,
      cells: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        hasCourse: false,
        name: '',
        location: '',
        color: '',
        courseData: null
      }))
    }));

    const noScheduleCourses = [];

    courses.forEach(course => {
      const schedules = course._schedules || [];
      const color = colorMap[course.name] || '#5b7fd6';

      // 无排课信息的课程
      if (schedules.length === 0) {
        noScheduleCourses.push(course);
        return;
      }

      let placed = false;
      schedules.forEach(s => {
        // 检查当前周是否在排课范围内
        if (currentWeek < s.weekStart || currentWeek > s.weekEnd) return;
        // 检查单双周
        if (s.oddEven === 'odd' && currentWeek % 2 === 0) return;
        if (s.oddEven === 'even' && currentWeek % 2 !== 0) return;

        const dayIdx = s.day - 1;   // 0-6
        const rowIdx = s.period - 1; // 0-5

        if (dayIdx < 0 || dayIdx > 6 || rowIdx < 0 || rowIdx > 5) return;

        grid[rowIdx].cells[dayIdx] = {
          day: s.day,
          hasCourse: true,
          name: course.name,
          location: s.location,
          color: color,
          courseData: course,
          weekInfo: s.weekStart + '-' + s.weekEnd + '周' + (s.oddEven === 'odd' ? '(单)' : s.oddEven === 'even' ? '(双)' : '')
        };
        placed = true;
      });
    });

    return { grid, noScheduleCourses };
  },

  // ── 交互事件 ──────────────────────────────────

  /** 切换周次 */
  onWeekChange(e) {
    const week = parseInt(e.currentTarget.dataset.week);
    if (week === this.data.currentWeek) return;
    const { grid, noScheduleCourses } = this.buildGrid(this.data.courses, week, this.data.colorMap);
    this.setData({ currentWeek: week, gridData: grid, noScheduleCourses });
  },

  /** 切换视图 */
  switchView(e) {
    this.setData({ viewMode: e.currentTarget.dataset.mode });
  },

  /** 课程点击 → 弹出详情 */
  onCourseTap(e) {
    const { name, location } = e.currentTarget.dataset;
    if (!name) return;
    const course = this.data.courses.find(c => c.name === name) || { name, location };

    // 收集该课程在当前周的所有排课
    const schedules = (course._schedules || [])
      .filter(s => {
        const w = this.data.currentWeek;
        if (w < s.weekStart || w > s.weekEnd) return false;
        if (s.oddEven === 'odd' && w % 2 === 0) return false;
        if (s.oddEven === 'even' && w % 2 !== 0) return false;
        return true;
      })
      .map(s => {
        const dayNames = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return dayNames[s.day] + ' 第' + s.period + '大节' + (s.location ? ' ' + s.location : '');
      });

    this.setData({
      selectedCourse: {
        name: course.name,
        teacher: course.teacher || '',
        credit: course.credit || '',
        elective: course.elective || '',
        exam_type: course.exam_type || course.schedule || '',
        code: course.code || '',
        schedules: schedules,
        weekRange: (course._schedules || []).map(s =>
          s.weekStart + '-' + s.weekEnd + '周' + (s.oddEven === 'odd' ? '(单)' : s.oddEven === 'even' ? '(双)' : '') + ' ' + ['','周一','周二','周三','周四','周五','周六','周日'][s.day] + ' 第' + s.period + '大节' + (s.location ? ' ' + s.location : '')
        )
      }
    });
  },

  closeDetail() {
    this.setData({ selectedCourse: null });
  },

  stopPropagation() {},

  doLogout() {
    wx.showModal({
      title: '确认登出',
      content: '将清除登录状态',
      success: (res) => {
        if (res.confirm) {
          jwzxApi.logout().catch(() => {});
          jwzxApi.clearAll();
          this.setData({ isLoggedIn: false, courses: [], gridData: [], hasLoaded: false });
          wx.showToast({ title: '已登出', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      // title: (this.data.studentName || '') + '的课表',
      title: `课程表`,
      path: '/packageJwzx/pages/timetable/timetable'
    };
  }
});
