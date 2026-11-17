const sportApi = require('../../utils/sportApi.js');

Page({
  data: {
    record: null,
    polyline: [],
    markers: [],
    mapCenter: {
      latitude: 39.9042,
      longitude: 116.4074
    },
    mapScale: 14,
    notFound: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadRecord(id);
    }
  },

  loadRecord(id) {
    const record = sportApi.getSportRecord(id);
    if (!record) {
      this.setData({ notFound: true });
      return;
    }

    // 格式化数据
    const formattedRecord = {
      ...record,
      dateText: sportApi.formatFullDateTime(record.createTime),
      distanceText: sportApi.formatDistance(record.distance),
      distanceUnit: sportApi.getDistanceUnit(record.distance),
      durationText: sportApi.formatDuration(record.duration),
      durationDetail: sportApi.formatDurationText(record.duration)
    };

    // 构建轨迹
    let polyline = [];
    let markers = [];
    let mapCenter = { latitude: 39.9042, longitude: 116.4074 };
    let mapScale = 14;

    if (record.trackPoints && record.trackPoints.length > 0) {
      const points = record.trackPoints;

      polyline = [{
        points: points,
        color: '#667eea',
        width: 10,
        arrowLine: true
      }];

      // 起点标记
      markers.push({
        id: 0,
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        width: 20,
        height: 20
      });

      // 终点标记
      if (points.length > 1) {
        markers.push({
          id: 1,
          latitude: points[points.length - 1].latitude,
          longitude: points[points.length - 1].longitude,
          width: 24,
          height: 24
        });
      }

      // 计算中心点和缩放
      const lats = points.map(p => p.latitude);
      const lons = points.map(p => p.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      mapCenter = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLon + maxLon) / 2
      };

      // 根据距离估算缩放级别
      const latDiff = maxLat - minLat;
      const lonDiff = maxLon - minLon;
      const maxDiff = Math.max(latDiff, lonDiff);

      if (maxDiff < 0.005) mapScale = 17;
      else if (maxDiff < 0.01) mapScale = 16;
      else if (maxDiff < 0.02) mapScale = 15;
      else if (maxDiff < 0.05) mapScale = 14;
      else if (maxDiff < 0.1) mapScale = 13;
      else mapScale = 12;
    }

    this.setData({
      record: formattedRecord,
      polyline,
      markers,
      mapCenter,
      mapScale
    });
  },

  goBack() {
    wx.navigateBack();
  },

  shareRecord() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    const { record } = this.data;
    if (!record) return {};

    return {
      title: `🥛 我刚完成了${record.distanceText}${record.distanceUnit}的${record.typeName}，用时${record.durationText}，配速${record.avgPace}/km！`,
      path: `/packageSport/pages/detail/detail?id=${record.id}`
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { record } = this.data;
    return {
      title: record 
        ? `🥛 ${record.typeName}${record.distanceText}${record.distanceUnit}，每一步都算数！`
        : '🥛 酸奶运动 - 记录每一次突破'
    };
  }
});
