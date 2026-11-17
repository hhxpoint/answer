// 运动系统工具类
const STORAGE_KEY = 'sport_history';

// 运动类型
const SPORT_TYPES = {
  RUN: '跑步',
  WALK: '步行',
  CYCLE: '骑行'
};

// ============ 位置服务 ============

// 检查位置权限
const checkLocationAuth = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          resolve(true);
        } else {
          reject(new Error('未授权位置权限'));
        }
      },
      fail: () => reject(new Error('获取设置失败'))
    });
  });
};

// 请求位置权限
const requestLocationAuth = () => {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => resolve(true),
      fail: () => reject(new Error('用户拒绝授权'))
    });
  });
};

// 获取当前位置
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
          speed: res.speed || 0,
          timestamp: Date.now()
        });
      },
      fail: (err) => reject(err)
    });
  });
};

// 启动后台定位
const startLocationUpdate = () => {
  return new Promise((resolve, reject) => {
    wx.startLocationUpdate({
      success: () => resolve(true),
      fail: (err) => reject(err)
    });
  });
};

// 停止后台定位
const stopLocationUpdate = () => {
  return new Promise((resolve) => {
    wx.stopLocationUpdate({
      complete: () => resolve(true)
    });
  });
};

// 监听位置变化
const onLocationChange = (callback) => {
  wx.onLocationChange(callback);
};

// 取消位置监听
const offLocationChange = (callback) => {
  wx.offLocationChange(callback);
};

// ============ 距离计算 ============

// 使用Haversine公式计算两点间距离(米)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // 地球半径(米)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => {
  return deg * (Math.PI / 180);
};

// 计算轨迹总距离
const calculateTotalDistance = (points) => {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return total;
};

// ============ 配速计算 ============

// 计算配速(分钟/公里)
const calculatePace = (distanceMeters, timeSeconds) => {
  if (distanceMeters <= 0 || timeSeconds <= 0) return 0;
  const distanceKm = distanceMeters / 1000;
  const timeMinutes = timeSeconds / 60;
  return timeMinutes / distanceKm;
};

// 格式化配速 mm:ss
const formatPace = (paceMinutesPerKm) => {
  if (!paceMinutesPerKm || paceMinutesPerKm === Infinity) return '--:--';
  const mins = Math.floor(paceMinutesPerKm);
  const secs = Math.floor((paceMinutesPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 计算当前实时配速
const calculateCurrentPace = (lastPoint, currentPoint) => {
  if (!lastPoint || !currentPoint) return 0;
  const distance = calculateDistance(
    lastPoint.latitude,
    lastPoint.longitude,
    currentPoint.latitude,
    currentPoint.longitude
  );
  const timeDiff = (currentPoint.timestamp - lastPoint.timestamp) / 1000;
  if (timeDiff <= 0) return 0;
  const speed = distance / timeDiff; // 米/秒
  if (speed <= 0) return Infinity;
  return 1000 / speed / 60; // 分钟/公里
};

// ============ 时间格式化 ============

// 格式化时长 HH:mm:ss 或 mm:ss
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// 格式化时长详细文字
const formatDurationText = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let text = '';
  if (h > 0) text += `${h}小时`;
  if (m > 0) text += `${m}分`;
  text += `${s}秒`;
  return text;
};

// ============ 卡路里计算 ============

// 根据运动类型和距离估算卡路里(粗略)
const calculateCalories = (distanceMeters, sportType = 'RUN') => {
  const distanceKm = distanceMeters / 1000;
  // MET值(代谢当量): 跑步约10, 步行约3.5, 骑行约8
  const metMap = {
    'RUN': 10,
    'WALK': 3.5,
    'CYCLE': 8
  };
  const met = metMap[sportType] || 10;
  // 卡路里 = MET * 体重(kg) * 时间(h)，假设体重65kg
  // 简化: 每公里消耗约 体重 * 1.036 卡路里
  return Math.round(distanceKm * 65 * met / 10);
};

// ============ 微信运动步数 ============

// 获取微信运动步数
const getWeRunData = () => {
  return new Promise((resolve, reject) => {
    wx.getWeRunData({
      success: (res) => {
        // 需要后端解密，这里返回加密数据
        resolve({
          encryptedData: res.encryptedData,
          iv: res.iv,
          cloudID: res.cloudID
        });
      },
      fail: (err) => {
        console.warn('获取微信运动步数失败:', err);
        reject(err);
      }
    });
  });
};

// 获取今日步数(需要云函数解密或使用模拟数据)
const getTodaySteps = async () => {
  try {
    const data = await getWeRunData();
    // 实际需要调用云函数解密
    // 这里返回0表示需要后端处理
    return 0;
  } catch (e) {
    return 0;
  }
};

// ============ 数据存储 ============

// 保存运动记录
const saveSportRecord = (record) => {
  return new Promise((resolve, reject) => {
    try {
      const history = wx.getStorageSync(STORAGE_KEY) || [];
      const newRecord = {
        id: `sport_${Date.now()}`,
        ...record,
        createTime: new Date().toISOString()
      };
      history.unshift(newRecord);
      // 最多保存100条记录
      if (history.length > 100) {
        history.length = 100;
      }
      wx.setStorageSync(STORAGE_KEY, history);
      resolve(newRecord);
    } catch (e) {
      reject(e);
    }
  });
};

// 获取运动历史
const getSportHistory = () => {
  try {
    return wx.getStorageSync(STORAGE_KEY) || [];
  } catch (e) {
    return [];
  }
};

// 获取单条运动记录
const getSportRecord = (id) => {
  const history = getSportHistory();
  return history.find(item => item.id === id);
};

// 删除运动记录
const deleteSportRecord = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let history = getSportHistory();
      history = history.filter(item => item.id !== id);
      wx.setStorageSync(STORAGE_KEY, history);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

// ============ 统计数据 ============

// 获取本周统计
const getWeeklyStats = () => {
  const history = getSportHistory();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekRecords = history.filter(r => new Date(r.createTime) >= weekStart);

  return {
    count: weekRecords.length,
    distance: weekRecords.reduce((sum, r) => sum + (r.distance || 0), 0),
    duration: weekRecords.reduce((sum, r) => sum + (r.duration || 0), 0),
    calories: weekRecords.reduce((sum, r) => sum + (r.calories || 0), 0)
  };
};

// 获取本月统计
const getMonthlyStats = () => {
  const history = getSportHistory();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthRecords = history.filter(r => new Date(r.createTime) >= monthStart);

  return {
    count: monthRecords.length,
    distance: monthRecords.reduce((sum, r) => sum + (r.distance || 0), 0),
    duration: monthRecords.reduce((sum, r) => sum + (r.duration || 0), 0),
    calories: monthRecords.reduce((sum, r) => sum + (r.calories || 0), 0)
  };
};

// ============ 工具函数 ============

// 格式化距离显示
const formatDistance = (meters) => {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(2);
  }
  return Math.round(meters).toString();
};

// 获取距离单位
const getDistanceUnit = (meters) => {
  return meters >= 1000 ? 'km' : 'm';
};

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today - targetDay) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDays[date.getDay()];
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 格式化完整日期时间
const formatFullDateTime = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hour}:${min}`;
};

module.exports = {
  SPORT_TYPES,
  // 位置服务
  checkLocationAuth,
  requestLocationAuth,
  getCurrentLocation,
  startLocationUpdate,
  stopLocationUpdate,
  onLocationChange,
  offLocationChange,
  // 距离计算
  calculateDistance,
  calculateTotalDistance,
  // 配速计算
  calculatePace,
  formatPace,
  calculateCurrentPace,
  // 时间格式化
  formatDuration,
  formatDurationText,
  // 卡路里
  calculateCalories,
  // 微信运动
  getWeRunData,
  getTodaySteps,
  // 数据存储
  saveSportRecord,
  getSportHistory,
  getSportRecord,
  deleteSportRecord,
  // 统计数据
  getWeeklyStats,
  getMonthlyStats,
  // 工具函数
  formatDistance,
  getDistanceUnit,
  formatDate,
  formatFullDateTime
};
