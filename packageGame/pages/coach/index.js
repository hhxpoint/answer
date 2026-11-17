// packageGame/pages/coach/index.js
// 姿态教练 - 主练习页面（MoveNet Lightning 真实推理版）

const poseMatcher = require('../../utils/pose-matcher');
const canvasRender = require('../../utils/canvas-render');

// 默认动作模板（站立姿态，归一化坐标 0-1）
const DEFAULT_TEMPLATE = {
  name: '标准站立',
  frames: [{
    timestamp: 0,
    keypoints: [
      { name: 'nose', x: 0.50, y: 0.10, score: 0.95 },
      { name: 'left_eye', x: 0.47, y: 0.08, score: 0.90 },
      { name: 'right_eye', x: 0.53, y: 0.08, score: 0.90 },
      { name: 'left_ear', x: 0.44, y: 0.08, score: 0.85 },
      { name: 'right_ear', x: 0.56, y: 0.08, score: 0.85 },
      { name: 'left_shoulder', x: 0.38, y: 0.22, score: 0.95 },
      { name: 'right_shoulder', x: 0.62, y: 0.22, score: 0.95 },
      { name: 'left_elbow', x: 0.32, y: 0.36, score: 0.90 },
      { name: 'right_elbow', x: 0.68, y: 0.36, score: 0.90 },
      { name: 'left_wrist', x: 0.30, y: 0.50, score: 0.85 },
      { name: 'right_wrist', x: 0.70, y: 0.50, score: 0.85 },
      { name: 'left_hip', x: 0.42, y: 0.52, score: 0.95 },
      { name: 'right_hip', x: 0.58, y: 0.52, score: 0.95 },
      { name: 'left_knee', x: 0.41, y: 0.72, score: 0.90 },
      { name: 'right_knee', x: 0.59, y: 0.72, score: 0.90 },
      { name: 'left_ankle', x: 0.40, y: 0.92, score: 0.85 },
      { name: 'right_ankle', x: 0.60, y: 0.92, score: 0.85 }
    ]
  }]
};

// 举手动作模板
const RAISE_HAND_TEMPLATE = {
  name: '举手示意',
  frames: [
    {
      timestamp: 0,
      keypoints: [
        { name: 'nose', x: 0.50, y: 0.10, score: 0.95 },
        { name: 'left_eye', x: 0.47, y: 0.08, score: 0.90 },
        { name: 'right_eye', x: 0.53, y: 0.08, score: 0.90 },
        { name: 'left_ear', x: 0.44, y: 0.08, score: 0.85 },
        { name: 'right_ear', x: 0.56, y: 0.08, score: 0.85 },
        { name: 'left_shoulder', x: 0.38, y: 0.22, score: 0.95 },
        { name: 'right_shoulder', x: 0.62, y: 0.22, score: 0.95 },
        { name: 'left_elbow', x: 0.32, y: 0.36, score: 0.90 },
        { name: 'right_elbow', x: 0.68, y: 0.10, score: 0.90 },
        { name: 'left_wrist', x: 0.30, y: 0.50, score: 0.85 },
        { name: 'right_wrist', x: 0.65, y: 0.03, score: 0.85 },
        { name: 'left_hip', x: 0.42, y: 0.52, score: 0.95 },
        { name: 'right_hip', x: 0.58, y: 0.52, score: 0.95 },
        { name: 'left_knee', x: 0.41, y: 0.72, score: 0.90 },
        { name: 'right_knee', x: 0.59, y: 0.72, score: 0.90 },
        { name: 'left_ankle', x: 0.40, y: 0.92, score: 0.85 },
        { name: 'right_ankle', x: 0.60, y: 0.92, score: 0.85 }
      ]
    },
    {
      timestamp: 2000,
      keypoints: [
        { name: 'nose', x: 0.50, y: 0.10, score: 0.95 },
        { name: 'left_eye', x: 0.47, y: 0.08, score: 0.90 },
        { name: 'right_eye', x: 0.53, y: 0.08, score: 0.90 },
        { name: 'left_ear', x: 0.44, y: 0.08, score: 0.85 },
        { name: 'right_ear', x: 0.56, y: 0.08, score: 0.85 },
        { name: 'left_shoulder', x: 0.38, y: 0.22, score: 0.95 },
        { name: 'right_shoulder', x: 0.62, y: 0.22, score: 0.95 },
        { name: 'left_elbow', x: 0.32, y: 0.12, score: 0.90 },
        { name: 'right_elbow', x: 0.68, y: 0.08, score: 0.90 },
        { name: 'left_wrist', x: 0.35, y: 0.02, score: 0.85 },
        { name: 'right_wrist', x: 0.65, y: 0.02, score: 0.85 },
        { name: 'left_hip', x: 0.42, y: 0.52, score: 0.95 },
        { name: 'right_hip', x: 0.58, y: 0.52, score: 0.95 },
        { name: 'left_knee', x: 0.41, y: 0.72, score: 0.90 },
        { name: 'right_knee', x: 0.59, y: 0.72, score: 0.90 },
        { name: 'left_ankle', x: 0.40, y: 0.92, score: 0.85 },
        { name: 'right_ankle', x: 0.60, y: 0.92, score: 0.85 }
      ]
    }
  ]
};

Page({
  data: {
    status: 'idle',        // idle | loading | running | paused | finished
    selectedCourse: 0,
    aiReady: false,
    loadingText: '',
    elapsed: 0,
    formatTime: '00:00',
    currentWarning: '',
    frameCount: 0,
    report: {
      avgScore: 0,
      minScore: 0,
      maxScore: 0,
      passRate: 0,
      weakestJoints: [],
      timeline: []
    },
    courses: [
      { name: '标准站立', icon: '🧍', description: '纠正站立姿态，挺胸抬头收腹' },
      { name: '举手示意', icon: '🙋', description: '练习演讲举手动作的规范' }
    ]
  },

  // 页面内部状态
  _cameraCtx: null,
  _canvasCtx: null,
  _canvasNode: null,
  _timer: null,
  _captureTimer: null,
  _startTime: 0,
  _pausedTime: 0,
  _pauseStartTime: 0,
  _frameRecords: [],
  _currentTemplate: null,
  _frameCount: 0,
  _lastFpsTime: 0,
  _fps: 0,
  _cameraW: 0,
  _cameraH: 0,
  _processing: false,  // 防止并发推理

  onLoad(options) {
    this._initCamera();
    this._loadTemplate();
    // 从入口页接收课程选择
    if (options.course !== undefined) {
      const idx = parseInt(options.course) || 0;
      this.setData({ selectedCourse: idx });
      switch (idx) {
        case 0: this._currentTemplate = DEFAULT_TEMPLATE; break;
        case 1: this._currentTemplate = RAISE_HAND_TEMPLATE; break;
        default: this._currentTemplate = DEFAULT_TEMPLATE;
      }
    }
  },

  onReady() {
    // 先初始化 Canvas，再初始化 AI 引擎
    setTimeout(() => {
      this._initCanvas(() => {
        this._initAI();
      });
    }, 300);
  },

  onUnload() {
    this._stopTimers();
    if (this._poseEstimator) {
      this._poseEstimator.destroy();
    }
  },

  onHide() {
    if (this.data.status === 'running') {
      this._pausePractice();
    }
  },

  // ================= 初始化 =================

  _initCamera() {
    this._cameraCtx = wx.createCameraContext();
  },

  _initCanvas(callback) {
    const query = wx.createSelectorQuery();
    query.select('#poseCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res && res[0]) {
          const canvas = res[0].node;
          const info = wx.getSystemInfoSync();
          // 初始以屏幕尺寸设置，后续根据摄像头实际分辨率调整
          this._canvasW = info.windowWidth;
          this._canvasH = info.windowHeight;
          const dpr = info.pixelRatio || 1;
          canvas.width = this._canvasW * dpr;
          canvas.height = this._canvasH * dpr;
          this._canvasNode = canvas;
          this._canvasCtx = canvas.getContext('2d');
          this._canvasCtx.scale(dpr, dpr);
          this._dpr = dpr;
        }
        if (callback) callback();
      });
  },

  _initAI() {
    // 从 globalData 读取 pose-estimator（由 packageAI/loader 页面存入）
    const app = getApp();
    const poseEstimator = app.globalData && app.globalData.poseEstimator;

    if (!poseEstimator) {
      this.setData({ loadingText: 'AI模块未加载，请从入口页进入' });
      return;
    }

    this.setData({ loadingText: '正在初始化TFJS引擎...' });

    // 初始化 TFJS + 加载模型
    poseEstimator.initEngine((status, percent) => {
      this.setData({ loadingText: status });
    })
      .then((result) => {
        console.log('[Coach] AI引擎就绪:', result);
        this.setData({
          aiReady: true,
          loadingText: ''
        });
        // 保存引用供后续推理使用
        this._poseEstimator = poseEstimator;
      })
      .catch((err) => {
        console.error('[Coach] AI初始化失败:', err);
        this.setData({
          loadingText: 'AI加载失败: ' + (err.message || '未知错误')
        });
      });
  },

  _loadTemplate() {
    this._currentTemplate = DEFAULT_TEMPLATE;
  },

  // ================= 课程选择 =================

  selectCourse(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedCourse: index });

    switch (index) {
      case 0:
        this._currentTemplate = DEFAULT_TEMPLATE;
        break;
      case 1:
        this._currentTemplate = RAISE_HAND_TEMPLATE;
        break;
      default:
        this._currentTemplate = DEFAULT_TEMPLATE;
    }
  },

  // ================= 练习控制 =================

  startPractice() {
    if (!this.data.aiReady) {
      wx.showToast({ title: this.data.loadingText || 'AI引擎未就绪', icon: 'none' });
      return;
    }

    this._frameRecords = [];
    this._frameCount = 0;
    this._startTime = Date.now();
    this._pausedTime = 0;
    this._processing = false;

    this.setData({
      status: 'running',
      elapsed: 0,
      frameCount: 0,
      currentWarning: ''
    });

    this._startTimers();
  },

  _startTimers() {
    // 计时器（每100ms更新时间显示）
    this._timer = setInterval(() => {
      if (this.data.status !== 'running') return;
      const elapsed = Date.now() - this._startTime - this._pausedTime;
      this.setData({
        elapsed,
        formatTime: this._formatTime(elapsed)
      });
    }, 100);

    // 帧捕获定时器（每200ms一帧 ≈ 5fps，适配移动端推理速度）
    this._captureTimer = setInterval(() => {
      if (this.data.status !== 'running') return;
      if (this._processing) return; // 上一帧还没处理完，跳过
      this._captureAndProcess();
    }, 200);
  },

  _stopTimers() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this._captureTimer) { clearInterval(this._captureTimer); this._captureTimer = null; }
  },

  _pausePractice() {
    this._pauseStartTime = Date.now();
    this._stopTimers();
    this.setData({ status: 'paused' });
  },

  togglePause() {
    if (this.data.status === 'running') {
      this._pausePractice();
    } else if (this.data.status === 'paused') {
      this._pausedTime += Date.now() - this._pauseStartTime;
      this.setData({ status: 'running' });
      this._startTimers();
    }
  },

  stopPractice() {
    wx.showModal({
      title: '结束练习',
      content: '确定要结束本次练习吗？',
      success: (res) => {
        if (res.confirm) {
          this._stopTimers();
          const report = poseMatcher.generateReport(this._frameRecords);
          this.setData({
            status: 'finished',
            report,
            frameCount: this._frameRecords.length
          });
        }
      }
    });
  },

  resetPractice() {
    this._frameRecords = [];
    this._frameCount = 0;
    this.setData({
      status: 'idle',
      elapsed: 0,
      formatTime: '00:00',
      frameCount: 0
    });
  },

  goBack() {
    wx.navigateBack();
  },

  // ================= 核心：捕获帧 → 推理 → 匹配 → 绘制 =================

  _captureAndProcess() {
    if (!this._cameraCtx || !this._canvasCtx || !this._poseEstimator) return;
    this._processing = true;

    const captureTime = Date.now();

    this._cameraCtx.takePhoto({
      quality: 'low',
      success: (photo) => {
        this._processFrame(photo.tempImagePath, captureTime);
      },
      fail: () => {
        this._processing = false;
      }
    });
  },

  _processFrame(imagePath, captureTime) {
    const ctx = this._canvasCtx;
    const canvas = this._canvasNode;
    if (!ctx || !canvas) {
      this._processing = false;
      return;
    }

    // 创建 Image 对象加载摄像头帧
    const img = canvas.createImage();
    img.onload = () => {
      const imgW = img.width;
      const imgH = img.height;

      // 首次获取摄像头真实分辨率后，调整 Canvas 尺寸
      if (this._cameraW !== imgW || this._cameraH !== imgH) {
        this._cameraW = imgW;
        this._cameraH = imgH;
        const dpr = this._dpr || 1;
        canvas.width = imgW;
        canvas.height = imgH;
        this._canvasW = imgW;
        this._canvasH = imgH;
        // 重置缩放
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      const canvasW = this._canvasW;
      const canvasH = this._canvasH;

      // 1. 清空画布
      canvasRender.clearCanvas(ctx, canvasW, canvasH);

      // 2. 获取当前目标帧
      const elapsed = Date.now() - this._startTime - this._pausedTime;
      const totalDuration = this._currentTemplate.frames[this._currentTemplate.frames.length - 1].timestamp + 3000;
      const targetFrame = poseMatcher.findTargetFrame(
        this._currentTemplate.frames,
        elapsed % totalDuration
      );
      if (!targetFrame) {
        this._processing = false;
        return;
      }

      // 3. 真实 TFJS 推理
      this._poseEstimator.estimatePose(img, imgW, imgH)
        .then((poseResult) => {
          if (!poseResult || !poseResult.keypoints) {
            this._processing = false;
            return;
          }

          // 4. 目标关键点（归一化 → 像素坐标）
          const targetPixels = this._normalizeToPixels(targetFrame.keypoints, canvasW, canvasH);

          // 5. 匹配姿态
          const matchResult = poseMatcher.matchPose(poseResult.keypoints, targetPixels);

          // 6. 绘制所有图层
          // 6a. 绘制目标骨骼（半透明蓝虚线）
          canvasRender.drawTargetSkeleton(ctx, targetPixels, canvasW, canvasH, { mirror: false });

          // 6b. 绘制用户骨骼（绿实线）
          canvasRender.drawUserSkeleton(ctx, poseResult.keypoints, canvasW, canvasH, { mirror: false });

          // 6c. 高亮偏差关节
          if (matchResult.top3 && matchResult.top3.length > 0) {
            canvasRender.drawWarningJoints(ctx, poseResult.keypoints, matchResult.top3, canvasW, canvasH, false);
          }

          // 6d. 绘制分数
          canvasRender.drawScore(ctx, matchResult.score, canvasW, canvasH);

          // 6e. 绘制警告
          canvasRender.drawWarnings(ctx, matchResult.warnings, canvasW, canvasH);

          // 6f. 调试信息
          const inferenceTime = Date.now() - captureTime;
          this._frameCount++;
          const now = Date.now();
          if (now - this._lastFpsTime > 1000) {
            this._fps = this._frameCount;
            this._frameCount = 0;
            this._lastFpsTime = now;
          }
          canvasRender.drawDebugInfo(ctx, inferenceTime, this._fps, canvasW);

          // 7. 记录帧数据
          this._frameRecords.push({
            timestamp: elapsed,
            score: matchResult.score,
            top3: matchResult.top3,
            warnings: matchResult.warnings
          });

          this.setData({
            currentWarning: (matchResult.warnings && matchResult.warnings[0]) || ''
          });

          this._processing = false;
        })
        .catch((err) => {
          console.error('[Coach] 推理失败:', err);
          this._processing = false;
        });
    };

    img.onerror = () => {
      console.error('[Coach] 图片加载失败:', imagePath);
      this._processing = false;
    };

    img.src = imagePath;
  },

  /**
   * 将归一化坐标（0-1）转换为像素坐标
   */
  _normalizeToPixels(keypoints, canvasW, canvasH) {
    return keypoints.map(kp => ({
      name: kp.name,
      x: Math.round(kp.x * canvasW),
      y: Math.round(kp.y * canvasH),
      score: kp.score
    }));
  },

  // ================= 工具函数 =================

  _formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
  },

  onCameraError(e) {
    wx.showModal({
      title: '摄像头错误',
      content: '请检查是否已授予摄像头权限',
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我在用姿态教练练习体态矫正！',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '姿态教练 - AI实时动作纠正工具'
    };
  }
});
