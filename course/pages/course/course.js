// course/pages/course/course.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    // 周数信息（可编辑）
    currentWeek: 6,
    totalWeeks: 20,
    grade: '大一',
    semester: '第1学期',
    
    // 一周的日期数据
    weekDates: [],
    weekRange: '',
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    
    // 时间段配置
    timeSlots: [
      { label: '第1/2节', start: '08:05', end: '09:40' },
      { label: '第3/4节', start: '10:10', end: '11:45' },
      { label: '第5/6节', start: '13:35', end: '15:10' },
      { label: '第7/8节', start: '15:45', end: '17:20' },
      { label: '第9/10节', start: '18:15', end: '19:50' },
      { label: '第11/12节', start: '20:05', end: '21:30' }
    ],
    
    // 课程数据
    courses: {},
    scheduleGrid: [],
    weekCourseList: [],
    
    // 选中的课程
    selectedCourse: null,
    selectedCourseDate: null,
    
    // 视图模式
    viewMode: 'week',
    
    // 弹窗相关
    showCourseModal: false,
    showWeekEditModal: false,
    showMoreOptions: false,
    isEditing: false,
    editingCourseId: null,
    editingDate: null,
    
    // 课程表单
    courseForm: {
      name: '',
      teacher: '',
      location: '',
      date: '',
      startTime: '08:05',
      endTime: '09:40',
      color: '#FF6B6B',
      weeks: '1-16周',
      notes: ''
    },
    
    // 颜色选项
    colorOptions: [
      '#FF6B6B', '#FFA502', '#FFD93D', '#6BCB77', 
      '#4D96FF', '#845EC2', '#D65DB1', '#FF922B',
      '#00B4D8', '#4A90E2', '#50C878', '#FF6F91'
    ],
    
    // 选择器选项
    totalWeekOptions: ['16周', '18周', '20周', '22周', '24周'],
    gradeOptions: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
    semesterOptions: ['第1学期', '第2学期', '暑期学期', '寒假学期']
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.loadCourses();
    this.loadSettings();
    this.initWeekDates();
  },

  // 初始化数据
  initData() {
    const today = new Date();
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1
    });
  },

  // 加载设置
  loadSettings() {
    try {
      const settings = wx.getStorageSync('courseSettings');
      if (settings) {
        this.setData({
          currentWeek: settings.currentWeek || 6,
          totalWeeks: settings.totalWeeks || 20,
          grade: settings.grade || '大一',
          semester: settings.semester || '第1学期'
        });
      }
    } catch (e) {
      console.error('加载设置失败:', e);
    }
  },

  // 保存设置
  saveSettings() {
    try {
      wx.setStorageSync('courseSettings', {
        currentWeek: this.data.currentWeek,
        totalWeeks: this.data.totalWeeks,
        grade: this.data.grade,
        semester: this.data.semester
      });
    } catch (e) {
      console.error('保存设置失败:', e);
    }
  },

  // 初始化一周日期
  initWeekDates() {
    const today = new Date();
    const currentDay = today.getDay();
    
    // 计算本周一的日期
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const weekDates = [];
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      weekDates.push({
        date: util.formatDate(date),
        day: date.getDate(),
        weekday: weekdays[i],
        isToday: util.isToday(date)
      });
    }

    const firstDate = weekDates[0] ? weekDates[0].date : '';
    const lastDate = weekDates[6] ? weekDates[6].date : '';
    const weekRange = firstDate && lastDate
      ? `${firstDate.slice(5).replace('-', '.')} - ${lastDate.slice(5).replace('-', '.')}`
      : '';
    
    this.setData(
      {
        weekDates,
        weekRange,
        currentMonth: parseInt(weekDates[0].date.split('-')[1], 10)
      },
      () => {
        this.rebuildScheduleData();
      }
    );
  },

  // 根据当前周与课程数据重建课表渲染数据
  rebuildScheduleData() {
    const { weekDates, timeSlots, courses } = this.data;
    if (!Array.isArray(weekDates) || weekDates.length === 0) {
      this.setData({ scheduleGrid: [], weekCourseList: [] });
      return;
    }

    const scheduleGrid = timeSlots.map((slot, slotIndex) => {
      const cells = weekDates.map((dayItem) => {
        const course = this.findCourseForSlot(dayItem.date, slot);
        return {
          date: dayItem.date,
          slotIndex,
          hasCourse: !!course,
          course
        };
      });

      return {
        slotIndex,
        label: slot.label,
        start: slot.start,
        end: slot.end,
        cells
      };
    });

    const weekCourseList = [];
    weekDates.forEach((dayItem) => {
      const dayCourses = (courses[dayItem.date] || [])
        .slice()
        .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));

      dayCourses.forEach((course) => {
        weekCourseList.push({
          ...course,
          date: dayItem.date,
          weekday: dayItem.weekday,
          day: dayItem.day
        });
      });
    });

    this.setData({ scheduleGrid, weekCourseList });
  },

  // 获取某天某时间段命中的课程
  findCourseForSlot(date, slot) {
    const dayCourses = this.data.courses[date] || [];
    for (let i = 0; i < dayCourses.length; i++) {
      if (this.isTimeSlotMatch(dayCourses[i], slot)) {
        return dayCourses[i];
      }
    }
    return null;
  },

  // 按日期和ID查找课程
  findCourseById(date, courseId) {
    const dayCourses = this.data.courses[date] || [];
    return dayCourses.find((course) => course.id === courseId) || null;
  },

  // 判断课程时间段是否匹配
  isTimeSlotMatch(course, slot) {
    if (!course.startTime || !course.endTime) return false;
    
    const courseStart = this.timeToMinutes(course.startTime);
    const courseEnd = this.timeToMinutes(course.endTime);
    const slotStart = this.timeToMinutes(slot.start);
    const slotEnd = this.timeToMinutes(slot.end);
    
    return courseStart < slotEnd && courseEnd > slotStart;
  },

  // 时间转分钟数
  timeToMinutes(time) {
    if (!time || typeof time !== 'string' || time.indexOf(':') === -1) {
      return 0;
    }
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // 加载课程数据
  loadCourses() {
    try {
      const courses = wx.getStorageSync('courses') || {};
      this.setData({ courses }, () => {
        this.rebuildScheduleData();
      });
    } catch (e) {
      console.error('加载课程数据失败:', e);
    }
  },

  // 保存课程数据
  saveCourses() {
    try {
      wx.setStorageSync('courses', this.data.courses);
    } catch (e) {
      console.error('保存课程数据失败:', e);
    }
  },

  // 单元格点击（添加课程）
  onCellTap(e) {
    const date = e.currentTarget.dataset.date;
    const slotIndex = parseInt(e.currentTarget.dataset.slot);
    const hasCourse = !!e.currentTarget.dataset.hasCourse;
    
    if (!hasCourse && !isNaN(slotIndex)) {
      // 空白格子，添加课程
      const timeSlot = this.data.timeSlots[slotIndex];
      if (timeSlot) {
        this.setData({
          showCourseModal: true,
          isEditing: false,
          courseForm: {
            name: '',
            teacher: '',
            location: '',
            date: date,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            color: '#FF6B6B',
            weeks: '1-16周',
            notes: ''
          }
        });
      }
    }
  },

  // 课程点击事件
  onCourseTap(e) {
    const course = e.currentTarget.dataset.course;
    const date = e.currentTarget.dataset.date;
    
    this.setData({
      selectedCourse: course,
      selectedCourseDate: date
    });
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 关闭课程详情
  closeCourseDetail() {
    this.setData({
      selectedCourse: null,
      selectedCourseDate: null
    });
  },

  // 编辑选中的课程
  editCourse() {
    const course = this.data.selectedCourse;
    const date = this.data.selectedCourseDate;
    
    this.setData({
      showCourseModal: true,
      isEditing: true,
      editingCourseId: course.id,
      editingDate: date,
      courseForm: { ...course, date }
    });
    
    this.closeCourseDetail();
  },

  // 删除选中的课程
  deleteSelectedCourse() {
    const course = this.data.selectedCourse;
    const date = this.data.selectedCourseDate;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除课程「${course.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doDeleteCourse(date, course.id);
          this.closeCourseDetail();
        }
      }
    });
  },

  // 显示添加课程弹窗
  showAddCourseModal() {
    const todayDate = util.formatDate(new Date());
    const currentWeekDates = this.data.weekDates.map((item) => item.date);
    const defaultDate = currentWeekDates.includes(todayDate)
      ? todayDate
      : (this.data.weekDates.length > 0 ? this.data.weekDates[0].date : todayDate);
    
    this.setData({
      showCourseModal: true,
      isEditing: false,
      editingCourseId: null,
      editingDate: null,
      courseForm: {
        name: '',
        teacher: '',
        location: '',
        date: defaultDate,
        startTime: '08:05',
        endTime: '09:40',
        color: '#FF6B6B',
        weeks: '1-16周',
        notes: ''
      }
    });
  },

  // 隐藏课程弹窗
  hideCourseModal() {
    this.setData({ showCourseModal: false });
  },

  // 显示周数设置弹窗
  showWeekEdit() {
    this.setData({ showWeekEditModal: true });
  },

  // 隐藏周数设置弹窗
  hideWeekEdit() {
    this.setData({ showWeekEditModal: false });
  },

  // 增加周数
  increaseWeek() {
    if (this.data.currentWeek < this.data.totalWeeks) {
      this.setData({ currentWeek: this.data.currentWeek + 1 });
    }
  },

  // 减少周数
  decreaseWeek() {
    if (this.data.currentWeek > 1) {
      this.setData({ currentWeek: this.data.currentWeek - 1 });
    }
  },

  // 学期周数改变
  onTotalWeekChange(e) {
    const options = [16, 18, 20, 22, 24];
    this.setData({ totalWeeks: options[e.detail.value] });
  },

  // 年级改变
  onGradeChange(e) {
    this.setData({ grade: this.data.gradeOptions[e.detail.value] });
  },

  // 学期改变
  onSemesterChange(e) {
    this.setData({ semester: this.data.semesterOptions[e.detail.value] });
  },

  // 保存周数设置
  saveWeekSettings() {
    this.saveSettings();
    this.hideWeekEdit();
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  // 显示更多选项
  showMoreOptions() {
    this.setData({ showMoreOptions: true });
  },

  // 隐藏更多选项
  hideMoreOptions() {
    this.setData({ showMoreOptions: false });
  },

  // 复制本周课程
  copyWeekCourses() {
    this.hideMoreOptions();
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 清空所有课程
  clearAllCourses() {
    this.hideMoreOptions();
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有课程吗？此操作不可恢复！',
      success: (res) => {
        if (res.confirm) {
          this.setData({ courses: {} }, () => {
            this.rebuildScheduleData();
          });
          this.saveCourses();
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 导出课程表
  exportCourses() {
    this.hideMoreOptions();
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 表单输入事件
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`courseForm.${field}`]: value
    });
  },

  // 日期选择事件
  onDateChange(e) {
    this.setData({
      'courseForm.date': e.detail.value
    });
  },

  // 时间选择事件
  onTimeChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`courseForm.${field}`]: value
    });
  },

  // 颜色选择事件
  onColorSelect(e) {
    const color = e.currentTarget.dataset.color;
    
    this.setData({
      'courseForm.color': color
    });
  },

  // 保存课程
  saveCourse() {
    const { courseForm, isEditing, editingCourseId, editingDate } = this.data;
    
    // 表单验证
    if (!courseForm.name.trim()) {
      wx.showToast({
        title: '请输入课程名称',
        icon: 'none'
      });
      return;
    }
    
    if (!courseForm.date) {
      wx.showToast({
        title: '请选择上课日期',
        icon: 'none'
      });
      return;
    }
    
    if (!courseForm.startTime || !courseForm.endTime) {
      wx.showToast({
        title: '请选择上课时间',
        icon: 'none'
      });
      return;
    }
    
    if (courseForm.startTime >= courseForm.endTime) {
      wx.showToast({
        title: '结束时间必须晚于开始时间',
        icon: 'none'
      });
      return;
    }
    
    const now = new Date().getTime();
    const dateStr = courseForm.date;
    const newCourses = { ...this.data.courses };

    if (isEditing && editingCourseId) {
      const original = this.findCourseById(editingDate, editingCourseId) || {};

      if (editingDate && Array.isArray(newCourses[editingDate])) {
        const filtered = newCourses[editingDate].filter((item) => item.id !== editingCourseId);
        if (filtered.length > 0) {
          newCourses[editingDate] = filtered;
        } else {
          delete newCourses[editingDate];
        }
      }

      const targetCourses = Array.isArray(newCourses[dateStr]) ? newCourses[dateStr].slice() : [];
      targetCourses.push({
        ...original,
        ...courseForm,
        id: editingCourseId,
        createTime: original.createTime || now,
        updateTime: now
      });
      newCourses[dateStr] = targetCourses;
    } else {
      const targetCourses = Array.isArray(newCourses[dateStr]) ? newCourses[dateStr].slice() : [];
      targetCourses.push({
        id: this.generateCourseId(),
        ...courseForm,
        createTime: now,
        updateTime: now
      });
      newCourses[dateStr] = targetCourses;
    }

    this.setData(
      {
        courses: newCourses,
        showCourseModal: false
      },
      () => {
        this.rebuildScheduleData();
      }
    );
    
    this.saveCourses();

    const visibleDates = this.data.weekDates.map((item) => item.date);
    if (!visibleDates.includes(dateStr)) {
      wx.showToast({
        title: `${isEditing ? '已更新' : '已添加'}，不在当前周`,
        icon: 'none'
      });
      return;
    }
    
    wx.showToast({
      title: isEditing ? '课程已更新' : '课程已添加',
      icon: 'success'
    });
  },

  // 生成课程ID
  generateCourseId() {
    return util.generateId('course');
  },

  // 执行删除课程
  doDeleteCourse(dateStr, courseId) {
    let courses = this.data.courses[dateStr] || [];
    courses = courses.filter(c => c.id !== courseId);
    
    const newCourses = { ...this.data.courses };
    
    if (courses.length > 0) {
      newCourses[dateStr] = courses;
    } else {
      delete newCourses[dateStr];
    }
    
    this.setData({ courses: newCourses }, () => {
      this.rebuildScheduleData();
    });
    this.saveCourses();
    
    wx.showToast({
      title: '课程已删除',
      icon: 'success'
    });
  },

  // 切换视图
  switchView(e) {
    const view = e.currentTarget.dataset.view;
    this.setData({ viewMode: view });
  },

  // 分享课程表
  onShareAppMessage() {
    return {
      title: `第${this.data.currentWeek}周课程表`,
      path: '/course/pages/course/course'
    };
  }
});