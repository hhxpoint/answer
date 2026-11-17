const sportApi = require('../../utils/sportApi.js');

Page({
  data: {
    historyList: [],
    monthlyStats: {
      count: 0,
      distance: 0,
      duration: 0,
      calories: 0
    },
    monthlyDistanceText: '0',
    monthlyDistanceUnit: 'm',
    isEmpty: true,
    swipingId: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const historyList = sportApi.getSportHistory();
    const monthlyStats = sportApi.getMonthlyStats();

    const monthlyDistanceText = monthlyStats.distance >= 1000
      ? (monthlyStats.distance / 1000).toFixed(1)
      : String(Math.round(monthlyStats.distance));
    const monthlyDistanceUnit = monthlyStats.distance >= 1000 ? 'km' : 'm';

    const formattedList = historyList.map(item => ({
      ...item,
      dateText: sportApi.formatFullDateTime(item.createTime),
      distanceText: sportApi.formatDistance(item.distance),
      distanceUnit: sportApi.getDistanceUnit(item.distance),
      durationText: sportApi.formatDuration(item.duration),
      showDelete: false
    }));

    this.setData({
      historyList: formattedList,
      monthlyStats,
      monthlyDistanceText,
      monthlyDistanceUnit,
      isEmpty: formattedList.length === 0
    });
  },

  // 触摸开始
  touchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.itemId = e.currentTarget.dataset.id;
  },

  // 触摸移动
  touchMove(e) {
    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;
    const diffX = this.startX - moveX;
    const diffY = this.startY - moveY;

    // 如果垂直滑动距离大于水平滑动，不处理
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (diffX > 40) {
      this.setData({ swipingId: this.itemId });
    } else if (diffX < -20) {
      this.setData({ swipingId: null });
    }
  },

  // 触摸结束
  touchEnd() {
    // 保持当前状态
  },

  // 删除记录
  deleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条运动记录吗？',
      success: async (res) => {
        if (res.confirm) {
          await sportApi.deleteSportRecord(id);
          this.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 点击查看详情
  goDetail(e) {
    // 如果正在滑动，不跳转
    if (this.data.swipingId) {
      this.setData({ swipingId: null });
      return;
    }
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/packageSport/pages/detail/detail?id=${id}`
    });
  },

  goBack() {
    wx.navigateBack();
  },

  // 分享给朋友
  onShareAppMessage() {
    const { monthlyStats } = this.data;
    return {
      title: `🥛 我本月运动了${monthlyStats.count}次，累计${this.data.monthlyDistanceText}${this.data.monthlyDistanceUnit}，你也来记录运动吧！`,
      path: '/packageSport/pages/sport/sport'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🥛 酸奶运动 - 每一步都是对自己的投资'
    };
  }
});
