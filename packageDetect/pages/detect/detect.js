// packageDetect/pages/detect/detect.js
// 目标检测主页面：数字识别 + 实时物体检测
// 使用 hhxgo.tech 服务端推理，无 TFJS 依赖

var detectApi = require('../../libs/detect-api');
var canvasRender = require('../../libs/canvas-render');

Page({
  data: {
    activeMode: 'digit',
    engineReady: true,
    loadingText: '',
    digitResult: null,
    yoloRunning: false,
    fps: 0,
    objectCount: 0,
    lastInferenceTime: 0,
    herbResults: null,
    herbInferenceTime: 0,
    frozen: false,
    loading: false
  },

  _cameraCtx: null,
  _canvasCtx: null,
  _canvasNode: null,
  _canvasW: 0,
  _canvasH: 0,
  _cameraW: 0,
  _cameraH: 0,
  _dpr: 1,
  _processing: false,
  _yoloTimer: null,
  _fpsFrameCount: 0,
  _fpsLastTime: 0,
  _currentFrameImg: null,   // 当前帧图片引用，用于重绘背景
  _frozen: false,            // 拍照冻结状态
  _wasYoloRunning: false,    // 冻结前YOLO是否在运行

  onLoad: function() {
    this._initCamera();
  },

  onReady: function() {
    var self = this;
    setTimeout(function() {
      self._initCanvas();
    }, 300);
  },

  onUnload: function() {
    this._stopYolo();
  },

  onHide: function() {
    this._stopYolo();
  },

  // ================= 分享功能 =================

  onShareAppMessage: function() {
    return {
      title: '目标检测 - 智能识别数字、物体和中药',
      path: '/packageDetect/pages/detect/detect'
    };
  },

  onShareTimeline: function() {
    return {
      title: '目标检测 - 智能识别数字、物体和中药'
    };
  },

  // ================= 初始化 =================

  _initCamera: function() {
    this._cameraCtx = wx.createCameraContext();
  },

  _initCanvas: function() {
    var self = this;
    var query = wx.createSelectorQuery();
    query.select('#detectCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (res && res[0]) {
          var canvas = res[0].node;
          var info = wx.getSystemInfoSync();
          self._canvasW = info.windowWidth;
          self._canvasH = info.windowHeight;
          self._dpr = info.pixelRatio || 1;
          canvas.width = self._canvasW * self._dpr;
          canvas.height = self._canvasH * self._dpr;
          self._canvasNode = canvas;
          self._canvasCtx = canvas.getContext('2d');
          self._canvasCtx.scale(self._dpr, self._dpr);
        }
      });
  },

  // ================= 模式切换 =================

  switchMode: function(e) {
    var mode = e.currentTarget.dataset.mode;
    if (mode === this.data.activeMode) return;

    if (this.data.yoloRunning) {
      this._stopYolo();
    }

    this._currentFrameImg = null;
    this._frozen = false;

    this.setData({
      activeMode: mode,
      digitResult: null,
      herbResults: null,
      herbInferenceTime: 0,
      objectCount: 0,
      fps: 0,
      lastInferenceTime: 0,
      frozen: false,
      loading: false
    });

    this._clearCanvas();
  },

  // ================= 数字识别 =================

  captureDigit: function() {
    var self = this;
    self._cameraCtx.takePhoto({
      quality: 'high',
      success: function(photo) {
        self._frozen = true;
        self.setData({ frozen: true });
        self._processDigitImage(photo.tempImagePath);
      },
      fail: function() {
        wx.showToast({ title: '拍照失败', icon: 'none' });
      }
    });
  },

  chooseImage: function() {
    var self = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: function(res) {
        self._frozen = true;
        self.setData({ frozen: true });
        self._processDigitImage(res.tempFiles[0].tempFilePath);
      }
    });
  },

  _processDigitImage: function(imagePath) {
    var self = this;
    self.setData({ digitResult: null, loading: true });

    var img = self._canvasNode.createImage();
    img.onload = function() {
      // 将canvas尺寸设为原图像素尺寸，使API返回的像素坐标1:1映射
      var canvas = self._canvasNode;
      var ctx = self._canvasCtx;
      canvas.width = img.width;
      canvas.height = img.height;
      self._canvasW = img.width;
      self._canvasH = img.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // 保存当前帧，用于API返回后重绘背景图
      self._currentFrameImg = img;

      // 先在canvas上显示图片，让用户看到选中的图
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var t0 = Date.now();
      detectApi.recognizeDigit(imagePath).then(function(result) {
        var dt = Date.now() - t0;
        self.setData({ loading: false });

        // 重绘背景图 + 叠加检测结果
        self._redrawFrameWithDetections();

        if (result.digits && result.digits.length > 0) {
          canvasRender.drawDigitDetections(self._canvasCtx, result.digits, self._canvasW, self._canvasH);

          var sequence = '';
          for (var i = 0; i < result.digits.length; i++) {
            sequence += result.digits[i].digit;
          }

          self.setData({
            digitResult: {
              digit: result.digits[0].digit,
              confidence: Math.round(result.digits[0].confidence * 100),
              digits: result.digits,
              sequence: sequence,
              inferenceTime: result.inference_time_ms || dt
            }
          });
        } else if (result.digit !== undefined && result.digit >= 0) {
          canvasRender.drawDigitResultPanel(self._canvasCtx, result, self._canvasW, self._canvasH);
          self.setData({
            digitResult: {
              digit: result.digit,
              confidence: Math.round((result.confidence || 0) * 100),
              inferenceTime: result.inference_time_ms || dt
            }
          });
        } else {
          self.setData({
            digitResult: { digit: -1, inferenceTime: dt }
          });
        }
      }).catch(function(err) {
        console.error('[Detect] 数字识别失败:', err);
        // 失败时保留图片显示，只提示
        self.setData({ loading: false });
        wx.showToast({ title: '识别失败，请重试', icon: 'none' });
        self.setData({ digitResult: { digit: -1, inferenceTime: 0 } });
      });
    };

    img.onerror = function() {
      console.error('[Detect] 图片加载失败:', imagePath);
      self.setData({ loading: false });
      self._clearCanvas();
    };

    img.src = imagePath;
  },

  // ================= 实时物体检测 =================

  toggleYolo: function() {
    if (this.data.yoloRunning) {
      this._stopYolo();
    } else {
      this._startYolo();
    }
  },

  _startYolo: function() {
    this._processing = false;
    this._fpsFrameCount = 0;
    this._fpsLastTime = Date.now();
    this.setData({ yoloRunning: true });

    var self = this;
    this._yoloTimer = setInterval(function() {
      if (self._processing) return;
      self._captureAndDetect();
    }, 800);
  },

  _stopYolo: function() {
    if (this._yoloTimer) {
      clearInterval(this._yoloTimer);
      this._yoloTimer = null;
    }
    this.setData({ yoloRunning: false });
  },

  _captureAndDetect: function() {
    var self = this;
    if (!self._cameraCtx || !self._canvasCtx) return;

    self._cameraCtx.takePhoto({
      quality: 'low',
      success: function(photo) {
        self._processYoloFrame(photo.tempImagePath);
      },
      fail: function() {}
    });
  },

  _processYoloFrame: function(imagePath) {
    var self = this;
    // 冻结状态下不处理新帧
    if (self._frozen) return;
    var ctx = self._canvasCtx;
    var canvas = self._canvasNode;
    if (!ctx || !canvas) return;

    var img = canvas.createImage();
    img.onload = function() {
      var imgW = img.width;
      var imgH = img.height;

      // canvas尺寸变化时重置
      if (self._cameraW !== imgW || self._cameraH !== imgH) {
        self._cameraW = imgW;
        self._cameraH = imgH;
        self._canvasW = imgW;
        self._canvasH = imgH;
        canvas.width = imgW;
        canvas.height = imgH;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // 立即显示当前帧（不等API），保持画面连贯
      ctx.drawImage(img, 0, 0, imgW, imgH);
      self._currentFrameImg = img;

      // 如果上一次API还没返回，跳过本次请求（避免堆积）
      if (self._processing) return;
      self._processing = true;

      var captureTime = Date.now();

      detectApi.detectObjects(imagePath).then(function(result) {
        var detections = result.detections || [];

        // API返回后，用最新帧重绘 + 叠加检测框
        self._redrawFrameWithDetections();
        canvasRender.drawYoloDetections(ctx, detections, self._canvasW, self._canvasH);

        var inferenceTime = Date.now() - captureTime;
        self._fpsFrameCount++;
        var now = Date.now();
        if (now - self._fpsLastTime > 1000) {
          self.setData({ fps: self._fpsFrameCount });
          self._fpsFrameCount = 0;
          self._fpsLastTime = now;
        }

        canvasRender.drawDebugInfo(ctx, inferenceTime, self.data.fps, self._canvasW);

        self.setData({
          objectCount: detections.length,
          lastInferenceTime: result.inference_time_ms || inferenceTime
        });

        self._processing = false;
      }).catch(function(err) {
        console.error('[Detect] 检测失败:', err);
        self._processing = false;
      });
    };

    img.onerror = function() {
      console.error('[Detect] 图片加载失败');
    };

    img.src = imagePath;
  },

  // ================= 冻结/取消固定 =================

  freezeYolo: function() {
    // YOLO模式下截图冻结当前帧
    var self = this;
    if (!self._cameraCtx) return;

    // 1. 立即停止timer，防止新帧覆盖
    if (self._yoloTimer) {
      clearInterval(self._yoloTimer);
      self._yoloTimer = null;
    }
    self._frozen = true;
    self._processing = false;
    self.setData({ frozen: true });

    // 2. 拍照并冻结
    self._cameraCtx.takePhoto({
      quality: 'medium',
      success: function(photo) {
        var canvas = self._canvasNode;
        var ctx = self._canvasCtx;
        if (!canvas || !ctx) return;
        var img = canvas.createImage();
        img.onload = function() {
          var imgW = img.width;
          var imgH = img.height;
          if (self._cameraW !== imgW || self._cameraH !== imgH) {
            self._cameraW = imgW;
            self._cameraH = imgH;
            self._canvasW = imgW;
            self._canvasH = imgH;
            canvas.width = imgW;
            canvas.height = imgH;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          }
          ctx.drawImage(img, 0, 0, imgW, imgH);
          self._currentFrameImg = img;

          // 对冻结帧做一次检测
          self._processing = true;
          self.setData({ loading: true });
          detectApi.detectObjects(photo.tempImagePath).then(function(result) {
            if (!self._frozen) return;
            var detections = result.detections || [];
            self.setData({ loading: false });
            self._redrawFrameWithDetections();
            canvasRender.drawYoloDetections(ctx, detections, self._canvasW, self._canvasH);
            canvasRender.drawDebugInfo(ctx, result.inference_time_ms || 0, self.data.fps, self._canvasW);
            self.setData({
              objectCount: detections.length,
              lastInferenceTime: result.inference_time_ms || 0
            });
            self._processing = false;
          }).catch(function() {
            self.setData({ loading: false });
            self._processing = false;
          });
        };
        img.src = photo.tempImagePath;
      },
      fail: function() {
        self._frozen = false;
        self.setData({ frozen: false });
      }
    });
  },

  unfreeze: function() {
    var wasYoloRunning = this.data.yoloRunning;
    this._frozen = false;
    this._currentFrameImg = null;
    this._clearCanvas();
    this.setData({
      frozen: false,
      loading: false,
      digitResult: null,
      herbResults: null,
      herbInferenceTime: 0,
      objectCount: 0
    });
    // YOLO模式：重启timer继续实时检测
    if (wasYoloRunning) {
      this._processing = false;
      var self = this;
      this._yoloTimer = setInterval(function() {
        if (self._processing) return;
        self._captureAndDetect();
      }, 800);
    }
  },

  // ================= 中药识别 =================

  captureHerb: function() {
    var self = this;
    self._cameraCtx.takePhoto({
      quality: 'high',
      success: function(photo) {
        self._frozen = true;
        self.setData({ frozen: true });
        self._processHerbImage(photo.tempImagePath);
      },
      fail: function() {
        wx.showToast({ title: '拍照失败', icon: 'none' });
      }
    });
  },

  chooseHerbImage: function() {
    var self = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: function(res) {
        self._frozen = true;
        self.setData({ frozen: true });
        self._processHerbImage(res.tempFiles[0].tempFilePath);
      }
    });
  },

  _processHerbImage: function(imagePath) {
    var self = this;
    self.setData({ herbResults: null, loading: true });

    var img = self._canvasNode.createImage();
    img.onload = function() {
      var canvas = self._canvasNode;
      var ctx = self._canvasCtx;
      canvas.width = img.width;
      canvas.height = img.height;
      self._canvasW = img.width;
      self._canvasH = img.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // 保存当前帧，显示图片
      self._currentFrameImg = img;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var t0 = Date.now();
      detectApi.recognizeHerbs(imagePath).then(function(result) {
        var dt = Date.now() - t0;
        self.setData({ loading: false });

        // 重绘背景图 + 叠加检测框
        self._redrawFrameWithDetections();

        var detections = result.detections || [];
        canvasRender.drawYoloDetections(ctx, detections, self._canvasW, self._canvasH);

        var herbList = detections.map(function(d) {
          return {
            className: d.className,
            classId: d.classId,
            score: d.score,
            scorePercent: Math.round(d.score * 100)
          };
        });

        self.setData({
          herbResults: herbList,
          herbInferenceTime: result.inference_time_ms || dt
        });
      }).catch(function(err) {
        console.error('[Detect] 中药识别失败:', err);
        self.setData({ loading: false });
        wx.showToast({ title: '识别失败，请重试', icon: 'none' });
        self.setData({ herbResults: [], herbInferenceTime: 0 });
      });
    };

    img.onerror = function() {
      console.error('[Detect] 图片加载失败:', imagePath);
      self._clearCanvas();
    };

    img.src = imagePath;
  },

  // ================= 工具函数 =================

  /**
   * 用当前帧图片重绘canvas背景
   * 解决"图片闪一下消失"的核心：API返回后先重绘背景图，再叠加检测框
   */
  _redrawFrameWithDetections: function() {
    var ctx = this._canvasCtx;
    var img = this._currentFrameImg;
    if (!ctx || !img) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(img, 0, 0, this._canvasW, this._canvasH);
  },

  _adjustCanvasToImage: function(imgW, imgH) {
    if (!this._canvasNode) return;
    var canvas = this._canvasNode;
    var ctx = this._canvasCtx;

    var containerW = this._canvasW;
    var containerH = this._canvasH;
    var scale = Math.min(containerW / imgW, containerH / imgH);
    var drawW = Math.round(imgW * scale);
    var drawH = Math.round(imgH * scale);

    canvas.width = drawW;
    canvas.height = drawH;
    this._canvasW = drawW;
    this._canvasH = drawH;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  },

  _clearCanvas: function() {
    if (this._canvasCtx && this._canvasNode) {
      canvasRender.clearCanvas(this._canvasCtx, this._canvasW, this._canvasH);
    }
  },

  _showLoadingCanvas: function(text) {
    if (this._canvasCtx) {
      canvasRender.drawLoadingOverlay(this._canvasCtx, this._canvasW, this._canvasH, text);
    }
  },

  onCameraError: function() {
    wx.showModal({
      title: '摄像头错误',
      content: '请检查是否已授予摄像头权限',
      showCancel: false,
      success: function() {
        wx.navigateBack();
      }
    });
  }
});
