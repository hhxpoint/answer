const sportApi = require('../../utils/sportApi.js');

const GOAL_KEY = 'sport_goal';
const GOAL_DEFAULT = 5000;

Page({
  data: {
    // 运动状态
    status: 'ready',
    sportType: 'RUN',
    sportTypeName: '跑步',

    // 运动数据
    duration: 0,
    durationText: '0:00',
    distance: 0,
    distanceText: '0.00',
    distanceUnit: 'km',
    calories: 0,
    currentPace: '--:--',
    avgPace: '--:--',
    currentSpeed: '0.0',
    avgSpeed: '0.0',

    // 目标
    goalDistance: GOAL_DEFAULT,
    showGoal: false,

    // 位置数据
    currentLocation: {
      latitude: 39.9042,
      longitude: 116.4074
    },
    polyline: [],
    markers: [],

    // 今日统计
    todayDate: '',
    todayStats: {
      count: 0,
      distance: 0,
      duration: 0,
      calories: 0
    },
    todayDistanceText: '0',
    todayDurationText: '0:00'
  },

  timer: null,
  startTime: null,
  pausedTime: 0,
  pauseTime: 0,
  lastLocation: null,
  trackPoints: [],
  locationCallback: null,

  onLoad() {
    this.initDate();
    this.loadGoal();
    this.loadStats();
    this.initLocation();
  },

  onShow() {
    this.loadStats();
  },

  onUnload() {
    this.stopTimer();
    if (this.locationCallback) {
      sportApi.offLocationChange(this.locationCallback);
    }
  },

  // 初始化日期
  initDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    this.setData({
      todayDate: `${month}月${day}日 ${weekDay}`
    });
  },

  // 加载目标
  loadGoal() {
    try {
      const goal = wx.getStorageSync(GOAL_KEY) || GOAL_DEFAULT;
      this.setData({ goalDistance: goal });
    } catch (e) {
      this.setData({ goalDistance: GOAL_DEFAULT });
    }
  },

  // 显示目标设置
  showGoalSetting() {
    this.setData({ showGoal: true });
  },

  hideGoalSetting() {
    this.setData({ showGoal: false });
  },

  // 设置目标
  setGoal(e) {
    const distance = parseInt(e.currentTarget.dataset.distance);
    wx.setStorageSync(GOAL_KEY, distance);
    this.setData({
      goalDistance: distance,
      showGoal: false
    });
    wx.showToast({ title: '目标已更新', icon: 'success' });
  },

  // 初始化位置
  async initLocation() {
    try {
      const location = await sportApi.getCurrentLocation();
      this.setData({
        currentLocation: location,
        markers: [{
          id: 1,
          latitude: location.latitude,
          longitude: location.longitude,
          width: 24,
          height: 24
        }]
      });
    } catch (e) {
      console.error('获取位置失败:', e);
    }
  },

  // 加载统计数据
  loadStats() {
    const todayStats = this.getTodayStats();
    this.setData({
      todayStats,
      todayDistanceText: sportApi.formatDistance(todayStats.distance),
      todayDurationText: sportApi.formatDuration(todayStats.duration)
    });
  },

  // 获取今日统计
  getTodayStats() {
    const history = sportApi.getSportHistory();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = history.filter(r => {
      const recordDate = new Date(r.createTime);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    return {
      count: todayRecords.length,
      distance: todayRecords.reduce((sum, r) => sum + (r.distance || 0), 0),
      duration: todayRecords.reduce((sum, r) => sum + (r.duration || 0), 0),
      calories: todayRecords.reduce((sum, r) => sum + (r.calories || 0), 0)
    };
  },

  // 选择运动类型
  selectSportType(e) {
    if (this.data.status !== 'ready') return;
    const type = e.currentTarget.dataset.type;
    const nameMap = {
      'RUN': '跑步',
      'WALK': '步行',
      'CYCLE': '骑行'
    };
    this.setData({
      sportType: type,
      sportTypeName: nameMap[type]
    });
  },

  // 开始运动
  async startSport() {
    try {
      await sportApi.startLocationUpdate();

      this.locationCallback = (res) => {
        this.onLocationUpdate(res);
      };
      sportApi.onLocationChange(this.locationCallback);

      this.startTime = Date.now();
      this.pausedTime = 0;
      this.trackPoints = [];

      this.setData({ status: 'running' });
      this.startTimer();

      wx.showToast({ title: '运动开始', icon: 'success' });
    } catch (e) {
      console.error('启动运动失败:', e);
      wx.showToast({ title: '启动失败，请检查定位权限', icon: 'none' });
    }
  },

  // 暂停运动
  pauseSport() {
    this.setData({ status: 'paused' });
    this.pauseTime = Date.now();
    this.stopTimer();
  },

  // 继续运动
  resumeSport() {
    if (this.pauseTime) {
      this.pausedTime += Date.now() - this.pauseTime;
    }
    this.setData({ status: 'running' });
    this.startTimer();
  },

  // 结束运动
  async stopSport() {
    this.stopTimer();

    try {
      if (this.locationCallback) {
        sportApi.offLocationChange(this.locationCallback);
      }
      await sportApi.stopLocationUpdate();
    } catch (e) {
      console.error('停止定位失败:', e);
    }

    const { distance, duration } = this.data;

    if (distance < 50) {
      wx.showModal({
        title: '提示',
        content: '运动距离太短，是否保存记录？',
        success: async (res) => {
          if (res.confirm) {
            await this.saveRecord();
          } else {
            this.resetSport();
          }
        }
      });
    } else {
      await this.saveRecord();
    }
  },

  // 保存记录
  async saveRecord() {
    const { distance, duration, calories, sportType, sportTypeName, avgSpeed } = this.data;
    const avgPace = sportApi.calculatePace(distance, duration);

    const record = {
      type: sportType,
      typeName: sportTypeName,
      distance,
      duration,
      calories,
      avgPace: sportApi.formatPace(avgPace),
      avgSpeed,
      trackPoints: this.trackPoints,
      polyline: this.data.polyline
    };

    try {
      const saved = await sportApi.saveSportRecord(record);
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.resetSport();
      this.loadStats();

      wx.navigateTo({
        url: `/packageSport/pages/detail/detail?id=${saved.id}`
      });
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  // 重置运动状态
  resetSport() {
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseTime = 0;
    this.lastLocation = null;
    this.trackPoints = [];

    this.setData({
      status: 'ready',
      duration: 0,
      durationText: '0:00',
      distance: 0,
      distanceText: '0.00',
      distanceUnit: 'km',
      calories: 0,
      currentPace: '--:--',
      avgPace: '--:--',
      currentSpeed: '0.0',
      avgSpeed: '0.0',
      polyline: [],
      markers: this.data.currentLocation ? [{
        id: 1,
        latitude: this.data.currentLocation.latitude,
        longitude: this.data.currentLocation.longitude,
        width: 24,
        height: 24
      }] : []
    });
  },

  // 位置更新回调
  onLocationUpdate(res) {
    const point = {
      latitude: res.latitude,
      longitude: res.longitude,
      timestamp: Date.now()
    };

    if (res.accuracy > 50) return;

    this.trackPoints.push(point);

    let newDistance = 0;
    let currentSpeed = 0;
    if (this.lastLocation) {
      newDistance = sportApi.calculateDistance(
        this.lastLocation.latitude,
        this.lastLocation.longitude,
        point.latitude,
        point.longitude
      );

      const timeDiff = (point.timestamp - this.lastLocation.timestamp) / 1000;
      if (timeDiff > 0) {
        const speed = newDistance / timeDiff;
        if (speed > 50) return;
        currentSpeed = speed * 3.6;
      }
    }

    const totalDistance = this.data.distance + newDistance;
    const elapsed = Math.floor((Date.now() - this.startTime - this.pausedTime) / 1000);
    const currentPace = sportApi.calculateCurrentPace(this.lastLocation, point);
    const avgPace = sportApi.calculatePace(totalDistance, elapsed);
    const avgSpeed = elapsed > 0 ? (totalDistance / elapsed * 3.6) : 0;
    const calories = sportApi.calculateCalories(totalDistance, this.data.sportType);

    const polyline = [{
      points: this.trackPoints,
      color: '#6366f1',
      width: 10,
      arrowLine: true
    }];

    const markers = [];
    if (this.trackPoints.length > 0) {
      markers.push({
        id: 0,
        latitude: this.trackPoints[0].latitude,
        longitude: this.trackPoints[0].longitude,
        width: 20,
        height: 20
      });
    }
    markers.push({
      id: 1,
      latitude: point.latitude,
      longitude: point.longitude,
      width: 24,
      height: 24
    });

    this.lastLocation = point;

    this.setData({
      currentLocation: point,
      distance: totalDistance,
      distanceText: sportApi.formatDistance(totalDistance),
      distanceUnit: sportApi.getDistanceUnit(totalDistance),
      calories,
      currentPace: sportApi.formatPace(currentPace),
      avgPace: sportApi.formatPace(avgPace),
      currentSpeed: currentSpeed.toFixed(1),
      avgSpeed: avgSpeed.toFixed(1),
      polyline,
      markers
    });
  },

  // 启动计时器
  startTimer() {
    this.timer = setInterval(() => {
      if (this.data.status !== 'running') return;

      const elapsed = Math.floor((Date.now() - this.startTime - this.pausedTime) / 1000);
      const avgPace = sportApi.calculatePace(this.data.distance, elapsed);
      const avgSpeed = elapsed > 0 && this.data.distance > 0
        ? (this.data.distance / elapsed * 3.6).toFixed(1)
        : '0.0';
      const calories = sportApi.calculateCalories(this.data.distance, this.data.sportType);

      this.setData({
        duration: elapsed,
        durationText: sportApi.formatDuration(elapsed),
        avgPace: sportApi.formatPace(avgPace),
        avgSpeed,
        calories
      });
    }, 1000);
  },

  // 停止计时器
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  // 跳转到历史记录
  goHistory() {
    wx.navigateTo({
      url: '/packageSport/pages/history/history'
    });
  },

  // 跳转到成就页面
  goAchievements() {
    wx.navigateTo({
      url: '/packageSport/pages/achievements/achievements'
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    const { sportTypeName } = this.data;
    return {
      title: `🥛 酸奶运动 - 我正在用${sportTypeName}记录运动，一起来运动吧！`,
      path: '/packageSport/pages/sport/sport'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🥛 酸奶运动 - 记录每一步，遇见更好的自己'
    };
  }
});
