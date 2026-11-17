// packageAI/pages/loader/index.js
// 姿态教练入口页 - 课程选择
// 在此页加载 pose-estimator 并存入 globalData，供 coach 页跨分包使用

const poseEstimator = require('../../libs/pose-estimator');

Page({
  data: {
    selectedCourse: 0,
    courses: [
      { name: '标准站立', icon: '🧍', description: '纠正站立姿态，挺胸抬头收腹' },
      { name: '举手示意', icon: '🙋', description: '练习演讲举手动作的规范' }
    ]
  },

  onLoad() {
    // 将 pose-estimator 存入 globalData，供其他分包的页面使用
    const app = getApp();
    if (!app.globalData) app.globalData = {};
    app.globalData.poseEstimator = poseEstimator;

    // 检查摄像头权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera'] === false) {
          wx.showModal({
            title: '需要摄像头权限',
            content: '请在设置中开启摄像头权限',
            confirmText: '去开启',
            success: (r) => {
              if (r.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },

  selectCourse(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedCourse: index });
  },

  goCoach() {
    wx.navigateTo({
      url: '/packageGame/pages/coach/index?course=' + this.data.selectedCourse
    });
  },

  onShareAppMessage() {
    return {
      title: '姿态教练 - AI动作纠正工具',
      path: '/pages/index/index'
    };
  }
});
