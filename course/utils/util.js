// course/utils/util.js

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 解析日期字符串为 Date 对象
 * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
 * @returns {Date} 日期对象
 */
function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 判断是否是今天
 * @param {Date} date - 日期对象
 * @returns {boolean}
 */
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * 判断是否是同一天
 * @param {Date} date1 - 日期对象1
 * @param {Date} date2 - 日期对象2
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

/**
 * 获取两个日期之间的天数差
 * @param {Date} date1 - 日期对象1
 * @param {Date} date2 - 日期对象2
 * @returns {number} 天数差
 */
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * 获取指定月份的天数
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @returns {number} 天数
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 获取指定日期是星期几
 * @param {Date} date - 日期对象
 * @returns {number} 星期几 (0-6, 0表示星期日)
 */
function getDayOfWeek(date) {
  return date.getDay();
}

/**
 * 获取中文星期名称
 * @param {number} day - 星期几 (0-6)
 * @returns {string} 中文星期名称
 */
function getWeekdayName(day) {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekdays[day];
}

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string} 唯一ID
 */
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间 (毫秒)
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制 (毫秒)
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 验证时间格式
 * @param {string} time - 时间字符串 (HH:MM)
 * @returns {boolean}
 */
function isValidTime(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * 比较两个时间
 * @param {string} time1 - 时间1 (HH:MM)
 * @param {string} time2 - 时间2 (HH:MM)
 * @returns {number} -1: time1 < time2, 0: time1 === time2, 1: time1 > time2
 */
function compareTime(time1, time2) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  if (h1 !== h2) {
    return h1 < h2 ? -1 : 1;
  }
  
  if (m1 !== m2) {
    return m1 < m2 ? -1 : 1;
  }
  
  return 0;
}

/**
 * 计算课程持续时间
 * @param {string} startTime - 开始时间 (HH:MM)
 * @param {string} endTime - 结束时间 (HH:MM)
 * @returns {number} 持续时间 (分钟)
 */
function calculateDuration(startTime, endTime) {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return endMinutes - startMinutes;
}

/**
 * 获取当前时间的友好显示
 * @returns {string} 友好的时间显示
 */
function getFriendlyTime() {
  const now = new Date();
  const hours = now.getHours();
  
  if (hours < 6) return '凌晨';
  if (hours < 9) return '早上';
  if (hours < 12) return '上午';
  if (hours < 14) return '中午';
  if (hours < 18) return '下午';
  if (hours < 22) return '晚上';
  return '深夜';
}

/**
 * 本地存储工具类
 */
const storage = {
  /**
   * 设置本地存储
   * @param {string} key - 键名
   * @param {any} data - 数据
   * @returns {boolean} 是否成功
   */
  set(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('设置存储失败:', e);
      return false;
    }
  },
  
  /**
   * 获取本地存储
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的数据
   */
  get(key, defaultValue = null) {
    try {
      const data = wx.getStorageSync(key);
      return data !== '' ? data : defaultValue;
    } catch (e) {
      console.error('获取存储失败:', e);
      return defaultValue;
    }
  },
  
  /**
   * 删除本地存储
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('删除存储失败:', e);
      return false;
    }
  },
  
  /**
   * 清空本地存储
   * @returns {boolean} 是否成功
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清空存储失败:', e);
      return false;
    }
  }
};

/**
 * 课程相关工具函数
 */
const courseUtils = {
  /**
   * 获取指定日期的课程
   * @param {string} dateStr - 日期字符串
   * @returns {Array} 课程列表
   */
  getCoursesByDate(dateStr) {
    const courses = storage.get('courses', {});
    return courses[dateStr] || [];
  },
  
  /**
   * 保存指定日期的课程
   * @param {string} dateStr - 日期字符串
   * @param {Array} courses - 课程列表
   * @returns {boolean} 是否成功
   */
  saveCoursesByDate(dateStr, courses) {
    const allCourses = storage.get('courses', {});
    allCourses[dateStr] = courses;
    return storage.set('courses', allCourses);
  },
  
  /**
   * 添加课程
   * @param {string} dateStr - 日期字符串
   * @param {Object} course - 课程对象
   * @returns {boolean} 是否成功
   */
  addCourse(dateStr, course) {
    const courses = this.getCoursesByDate(dateStr);
    courses.push(course);
    return this.saveCoursesByDate(dateStr, courses);
  },
  
  /**
   * 更新课程
   * @param {string} dateStr - 日期字符串
   * @param {string} courseId - 课程ID
   * @param {Object} updatedCourse - 更新的课程数据
   * @returns {boolean} 是否成功
   */
  updateCourse(dateStr, courseId, updatedCourse) {
    const courses = this.getCoursesByDate(dateStr);
    const index = courses.findIndex(c => c.id === courseId);
    
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updatedCourse };
      return this.saveCoursesByDate(dateStr, courses);
    }
    
    return false;
  },
  
  /**
   * 删除课程
   * @param {string} dateStr - 日期字符串
   * @param {string} courseId - 课程ID
   * @returns {boolean} 是否成功
   */
  deleteCourse(dateStr, courseId) {
    const courses = this.getCoursesByDate(dateStr);
    const filteredCourses = courses.filter(c => c.id !== courseId);
    return this.saveCoursesByDate(dateStr, filteredCourses);
  },
  
  /**
   * 检查日期是否有课程
   * @param {string} dateStr - 日期字符串
   * @returns {boolean} 是否有课程
   */
  hasCourses(dateStr) {
    const courses = this.getCoursesByDate(dateStr);
    return courses.length > 0;
  },
  
  /**
   * 获取课程统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const allCourses = storage.get('courses', {});
    let totalCourses = 0;
    let totalDays = 0;
    
    for (const dateStr in allCourses) {
      if (allCourses[dateStr].length > 0) {
        totalDays++;
        totalCourses += allCourses[dateStr].length;
      }
    }
    
    return {
      totalCourses,
      totalDays,
      averageCoursesPerDay: totalDays > 0 ? (totalCourses / totalDays).toFixed(1) : 0
    };
  }
};

module.exports = {
  formatDate,
  parseDate,
  isToday,
  isSameDay,
  daysBetween,
  getDaysInMonth,
  getDayOfWeek,
  getWeekdayName,
  generateId,
  deepClone,
  debounce,
  throttle,
  isValidTime,
  compareTime,
  calculateDuration,
  getFriendlyTime,
  storage,
  courseUtils
};