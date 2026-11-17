// packageGame/pages/report/index.js
const KEYPOINT_CN = {
  nose: '鼻尖',
  left_eye: '左眼', right_eye: '右眼',
  left_ear: '左耳', right_ear: '右耳',
  left_shoulder: '左肩', right_shoulder: '右肩',
  left_elbow: '左肘', right_elbow: '右肘',
  left_wrist: '左腕', right_wrist: '右腕',
  left_hip: '左髋', right_hip: '右髋',
  left_knee: '左膝', right_knee: '右膝',
  left_ankle: '左踝', right_ankle: '右踝'
};

Page({
  data: {
    practiceTime: '',
    avgScore: 0,
    passRate: 0,
    maxScore: 0,
    minScore: 0,
    totalFrames: 0,
    weakestJoints: [],
    timeline: []
  },

  onLoad(options) {
    if (options.data) {
      try {
        const report = JSON.parse(decodeURIComponent(options.data));
        this._initReport(report);
      } catch (e) {
        this._initEmpty();
      }
    } else {
      this._initEmpty();
    }
  },

  _initReport(report) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const weakestJoints = (report.weakestJoints || []).map(j => ({
      ...j,
      label: KEYPOINT_CN[j.name] || j.name
    }));

    this.setData({
      practiceTime: timeStr,
      avgScore: report.avgScore || 0,
      passRate: report.passRate || 0,
      maxScore: report.maxScore || 0,
      minScore: report.minScore || 0,
      totalFrames: report.totalFrames || 0,
      weakestJoints,
      timeline: report.timeline || []
    });
  },

  _initEmpty() {
    this.setData({
      practiceTime: '未知',
      avgScore: 0,
      passRate: 0,
      maxScore: 0,
      minScore: 0,
      totalFrames: 0,
      weakestJoints: [],
      timeline: []
    });
  },

  shareReport() {
    // 触发分享
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    const score = this.data.avgScore;
    return {
      title: `我在姿态教练中获得了${score}分！`,
      path: '/pages/index/index'
    };
  }
});
