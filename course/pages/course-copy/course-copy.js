// course/pages/course-copy/course-copy.js
const util = require('../../utils/util.js');

Page({
  data: {
    // 源课程信息
    sourceDate: '',
    sourceCourses: [],
    
    // 目标日期选择
    targetDates: [],
    selectedDates: [],
    
    // 日历数据
    calendarDays: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    
    // 复制选项
    copyOptions: {
      copyToWeek: false,
      copyToMonth: false,
      copyToYear: false
    },
    
    // 界面状态
    isLoading: false,
    copySuccess: false
  },

  onLoad(options) {
    this.initData();
  },

  onShow() {
    this.loadSourceData();
    this.generateCalendarDays();
  },

  // 初始化数据
  initData() {
    const today = new Date();
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1
    });
  },

  // 加载源课程数据
  loadSourceData() {
    try {
      // 获取传递过来的日期参数
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      const { currentYear, currentMonth, currentDay } = prevPage.data;
      
      const sourceDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
      const courses = wx.getStorageSync('courses') || {};
      const sourceCourses = courses[sourceDate] || [];
      
      this.setData({
        sourceDate,
        sourceCourses
      });
    } catch (e) {
      console.error('加载源课程数据失败:', e);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },

  // 生成日历数据
  generateCalendarDays() {
    const { currentYear, currentMonth } = this.data;
    const days = [];
    
    // 获取当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const firstDayWeekday = firstDay.getDay();
    
    // 获取当月天数
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // 获取上个月的天数
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
    
    // 添加上个月的日期
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 2, day);
      days.push({
        day: day,
        date: this.formatDate(date),
        isCurrentMonth: false,
        isSelectable: false,
        isSelected: false
      });
    }
    
    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth - 1, day);
      const dateStr = this.formatDate(date);
      const isPast = date < new Date().setHours(0,0,0,0);
      
      days.push({
        day: day,
        date: dateStr,
        isCurrentMonth: true,
        isSelectable: !isPast, // 不能选择过去的日期
        isSelected: this.data.selectedDates.includes(dateStr)
      });
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - days.length; // 6行7列
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        day: day,
        date: this.formatDate(date),
        isCurrentMonth: false,
        isSelectable: true,
        isSelected: this.data.selectedDates.includes(this.formatDate(date))
      });
    }
    
    this.setData({ calendarDays: days });
  },

  // 格式化日期
  formatDate(date) {
    return util.formatDate(date);
  },

  // 日期选择
  onDateSelect(e) {
    const { date, isselectable } = e.currentTarget.dataset;
    
    if (!isselectable) {
      wx.showToast({
        title: '不能选择过去的日期',
        icon: 'none'
      });
      return;
    }
    
    let selectedDates = [...this.data.selectedDates];
    const index = selectedDates.indexOf(date);
    
    if (index > -1) {
      // 取消选择
      selectedDates.splice(index, 1);
    } else {
      // 添加选择
      selectedDates.push(date);
    }
    
    this.setData({ selectedDates });
    this.generateCalendarDays();
  },

  // 上个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 1) {
      currentYear--;
      currentMonth = 12;
    } else {
      currentMonth--;
    }
    
    this.setData({
      currentYear,
      currentMonth
    });
    
    this.generateCalendarDays();
  },

  // 下个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 12) {
      currentYear++;
      currentMonth = 1;
    } else {
      currentMonth++;
    }
    
    this.setData({
      currentYear,
      currentMonth
    });
    
    this.generateCalendarDays();
  },

  // 快速选择选项
  onQuickSelect(e) {
    const type = e.currentTarget.dataset.type;
    const { currentYear, currentMonth } = this.data;
    let selectedDates = [];
    
    switch (type) {
      case 'week':
        // 选择本周剩余天数
        const today = new Date();
        const currentDay = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);
        
        for (let i = currentDay; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          if (date >= new Date().setHours(0,0,0,0)) {
            selectedDates.push(this.formatDate(date));
          }
        }
        break;
        
      case 'month':
        // 选择本月剩余天数
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        for (let day = new Date().getDate(); day <= daysInMonth; day++) {
          const date = new Date(currentYear, currentMonth - 1, day);
          if (date >= new Date().setHours(0,0,0,0)) {
            selectedDates.push(this.formatDate(date));
          }
        }
        break;
        
      case 'weekday':
        // 选择每周的同一天
        const baseDate = new Date(this.data.sourceDate);
        const dayOfWeek = baseDate.getDay();
        const endDate = new Date(currentYear, currentMonth, 0);
        
        let currentDate = new Date(baseDate);
        currentDate.setDate(currentDate.getDate() + 7);
        
        while (currentDate <= endDate) {
          if (currentDate.getDay() === dayOfWeek && currentDate >= new Date().setHours(0,0,0,0)) {
            selectedDates.push(this.formatDate(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 7);
        }
        break;
    }
    
    this.setData({ selectedDates });
    this.generateCalendarDays();
  },

  // 执行复制
  executeCopy() {
    const { sourceDate, sourceCourses, selectedDates } = this.data;
    
    if (selectedDates.length === 0) {
      wx.showToast({
        title: '请选择目标日期',
        icon: 'none'
      });
      return;
    }
    
    if (sourceCourses.length === 0) {
      wx.showToast({
        title: '源日期没有课程可复制',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认复制',
      content: `将${sourceCourses.length}门课程复制到${selectedDates.length}个日期？`,
      success: (res) => {
        if (res.confirm) {
          this.doCopyCourses();
        }
      }
    });
  },

  // 执行复制课程
  doCopyCourses() {
    this.setData({ isLoading: true });
    
    const { sourceDate, sourceCourses, selectedDates } = this.data;
    
    try {
      const courses = wx.getStorageSync('courses') || {};
      
      // 为每个目标日期复制课程
      selectedDates.forEach(targetDate => {
        // 为每门课程生成新的ID
        const newCourses = sourceCourses.map(course => ({
          ...course,
          id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: targetDate,
          createTime: new Date().getTime(),
          updateTime: new Date().getTime()
        }));
        
        // 合并到目标日期的课程中（如果已有课程）
        courses[targetDate] = [...(courses[targetDate] || []), ...newCourses];
      });
      
      // 保存到本地存储
      wx.setStorageSync('courses', courses);
      
      this.setData({
        isLoading: false,
        copySuccess: true
      });
      
      wx.showToast({
        title: `成功复制到${selectedDates.length}个日期`,
        icon: 'success'
      });
      
      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      
    } catch (e) {
      console.error('复制课程失败:', e);
      this.setData({ isLoading: false });
      
      wx.showToast({
        title: '复制失败，请重试',
        icon: 'none'
      });
    }
  },

  // 清空选择
  clearSelection() {
    this.setData({ selectedDates: [] });
    this.generateCalendarDays();
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});