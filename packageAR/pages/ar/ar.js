// packageAR/pages/ar/ar.js
// camera 可见 + 2D canvas 透明叠加
// VKSession: 手势识别 + 相机姿态追踪
// 物体世界锁定：放下去就不随屏幕动

const GESTURE_NAMES = {
  1:'张开手掌', 2:'握拳', 3:'OK', 6:'点赞', 7:'我爱你',
  8:'捏合', 9:'数字一', 10:'数字二', 14:'差评',
  17:'胜利', 23:'比心', 24:'摇手'
};
const GESTURE_ICONS = {
  1:'✋', 2:'✊', 3:'👌', 6:'👍', 7:'🤟',
  8:'🤏', 9:'☝️', 10:'✌️', 14:'👎',
  17:'✌️', 23:'🫶', 24:'👋'
};

const MODEL_CFG = {
  cube:     { label:'立方体', color:'#6366f1', glow:'#818cf8' },
  sphere:   { label:'球体',   color:'#ef4444', glow:'#f87171' },
  cylinder: { label:'圆柱',   color:'#22c55e', glow:'#4ade80' },
  torus:    { label:'圆环',   color:'#a855f7', glow:'#c084fc' },
  cone:     { label:'圆锥',   color:'#f97316', glow:'#fb923c' }
};

Page({
  data: {
    ready: false,
    gestureActive: false, gestureLabel: '', gestureIcon: '', gestureScore: 0,
    toastText: '', activeModel: 'cube', loadingHint: '等待摄像头...',
    objCount: 0
  },

  // ===== 内部（全部在 onLoad 初始化） =====
  ctx: null, _lw: 0, _lh: 0, _dpr: 1,
  vkSession: null, objects: null,
  _vm: null, _pm: null, _hasCameraPose: false,
  _pageVis: false, _toastT: null, _gestClearT: null,
  _lastGestId: -1, _lastGestPlace: 0, _animId: 0,

  onLoad() {
    this.objects = [];
    this.ctx = null;
    this.vkSession = null;
    this._vm = null;
    this._pm = null;
    this._hasCameraPose = false;
    this._pageVis = true;
    this._toastT = null;
    this._gestClearT = null;
    this._lastGestId = -1;
    this._lastGestPlace = 0;
    this._animId = 0;
    this._loopRunning = false;
    this._lw = 0;
    this._lh = 0;
    this._dpr = 1;
    this._isSim = this._checkSim();
    this._initCanvas();
  },
  onShow() { this._pageVis = true; if (this.vkSession) try { this.vkSession.resume(); } catch(e) {} },
  onHide() { this._pageVis = false; if (this.vkSession) try { this.vkSession.pause(); } catch(e) {} },
  onUnload() {
    this._pageVis = false;
    this._loopRunning = false;
    clearTimeout(this._animId);
    this._stopVK();
  },

  _checkSim() {
    try { return ['devtools','windows','mac'].indexOf(wx.getDeviceInfo().platform) >= 0; } catch(e) { return false; }
  },

  // ==================== Canvas ====================
  _initCanvas() {
    this.setData({ loadingHint: '初始化画布...' });
    wx.createSelectorQuery().select('#ar-overlay')
      .fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0] || !res[0].node) { this.setData({ loadingHint: 'Canvas 失败' }); return; }
        const c = res[0].node;
        let dpr = 2, ww = 390, wh = 844;
        try { dpr = wx.getDeviceInfo().pixelRatio || 2; ww = wx.getWindowInfo().windowWidth; wh = wx.getWindowInfo().windowHeight; } catch(e) {}
        c.width = ww * dpr; c.height = wh * dpr;
        this.ctx = c.getContext('2d');
        this.ctx.scale(dpr, dpr);
        this._lw = ww; this._lh = wh; this._dpr = dpr;
        console.log('[AR] Canvas OK', ww, wh);
        this._startLoop();
        if (this._isSim) this._goReady('预览模式');
        else this.setData({ loadingHint: '等待摄像头...' });
      });
  },

  // ==================== Camera ====================
  onCameraReady() {
    console.log('[AR] camera ready');
    // 不启动 VKSession（它会冻结摄像头预览）
    // 直接进入就绪状态，用 camera 组件的帧数据
    this._goReady('');
    this._startGestureFromCamera();
  },
  onCameraError(e) { console.error('[AR] cam err', e.detail); this._goReady('摄像头错误'); },

  // ==================== 从 camera 帧数据做手势检测 ====================
  _startGestureFromCamera() {
    try {
      const camCtx = wx.createCameraContext();
      if (!camCtx) return;

      const listener = camCtx.onCameraFrame((frame) => {
        if (!this._pageVis || !frame || !frame.data) return;
        // 这里可以接入手势检测模型
        // 暂时用帧数据活跃度判断是否有手在动
        this._detectMotionFromFrame(frame);
      });

      listener.start({
        success: () => console.log('[AR] 手势帧监听启动'),
        fail: (e) => console.warn('[AR] 手势帧失败:', e)
      });
      this._gestureListener = listener;
    } catch(e) {
      console.warn('[AR] 手势帧异常:', e);
    }
  },

  // 简单运动检测（帧间差异判断是否有手势动作）
  _prevFrameData: null,
  _motionScore: 0,
  _motionCheckCount: 0,

  _detectMotionFromFrame(frame) {
    this._motionCheckCount++;
    if (this._motionCheckCount % 6 !== 0) return;

    try {
      const data = new Uint8Array(frame.data);
      const w = frame.width, h = frame.height;
      this._frameW = w; this._frameH = h; // 保存给截图用
      // 采样中心区域
      const cx = Math.floor(w / 2), cy = Math.floor(h / 2);
      const r = 40; // 采样半径
      let diff = 0, count = 0;

      if (this._prevFrameData) {
        const prev = this._prevFrameData;
        for (let dy = -r; dy < r; dy += 4) {
          for (let dx = -r; dx < r; dx += 4) {
            const px = cx + dx, py = cy + dy;
            if (px < 0 || px >= w || py < 0 || py >= h) continue;
            const idx = (py * w + px) * 4;
            const dr = Math.abs(data[idx] - prev[idx]);
            const dg = Math.abs(data[idx+1] - prev[idx+1]);
            const db = Math.abs(data[idx+2] - prev[idx+2]);
            diff += (dr + dg + db) / 3;
            count++;
          }
        }
        this._motionScore = count > 0 ? diff / count : 0;
      }

      // 保存当前帧
      this._prevFrameData = new Uint8Array(data);

      // 手势动作检测
      this._handleMotionAction();
    } catch(e) {}
  },

  _motionHighStart: 0,
  _motionActionCooldown: 0,

  _handleMotionAction() {
    const now = Date.now();
    const score = this._motionScore;

    if (score > 25) {
      // 记录高运动开始时间
      if (!this._motionHighStart) this._motionHighStart = now;
      const duration = now - this._motionHighStart;

      // 更新 UI
      let label = '检测到动作', icon = '👋';
      if (duration > 800 && score > 35) { label = '强力挥动'; icon = '💥'; }
      else if (duration > 400) { label = '持续挥动'; icon = '✋'; }

      this.setData({
        gestureActive: true,
        gestureLabel: label,
        gestureIcon: icon,
        gestureScore: Math.min(Math.round(score), 99)
      });

      // 挥动 > 1秒 + 强度 > 35 → 清空全部
      if (duration > 1000 && score > 35 && now - this._motionActionCooldown > 2000) {
        this._motionActionCooldown = now;
        this._motionHighStart = 0;
        this._doReset();
        this._toast('挥手清空！', 1500);
      }
      // 挥动 > 0.5秒 → 移除最后一个
      else if (duration > 500 && duration <= 1000 && now - this._motionActionCooldown > 1500) {
        if (this.objects.length > 0) {
          this._motionActionCooldown = now;
          this.objects.pop();
          this.setData({ objCount: this.objects.length });
          wx.vibrateShort({ type: 'light' });
          this._toast('挥手移除！', 1000);
        }
      }
    } else {
      this._motionHighStart = 0;
      // 运动消失后延迟清除 UI
      if (this.data.gestureActive && score < 8) {
        clearTimeout(this._gestClearT);
        this._gestClearT = setTimeout(() => {
          this.setData({ gestureActive: false, gestureLabel: '', gestureIcon: '', gestureScore: 0 });
        }, 600);
      }
    }
  },

  // ==================== VK（已禁用，避免冻结摄像头） ====================
  _initVK() {
    // VKSession 会独占摄像头导致预览冻结，不再使用
    this._goReady('');
  },

  _goReady(hint) {
    this.setData({ ready: true, loadingHint: hint || '' });
    if (hint) this._toast(hint, 3000);
  },

  _stopVK() { if (this.vkSession) { try { this.vkSession.stop(); } catch(e) {} this.vkSession = null; } },

  // ==================== 手势（运动检测版，替代 VKSession） ====================
  // 手势检测通过 _detectMotionFromFrame 实现，不再使用 VKSession

  // ==================== 3D→2D 投影（简化版：物体固定在屏幕位置） ====================
  // 物体存储的是屏幕坐标，不需要复杂投影
  // 当手机移动时，物体在屏幕上位置不变 = 在物理空间中"锁定"效果

  // 屏幕坐标 → 存储坐标（直接存储屏幕位置 + 深度）
  _screenToWorld(sx, sy, depth) {
    // 直接用屏幕坐标，深度影响大小
    return { x: sx, y: sy, z: depth || -1 };
  },

  // 4x4 矩阵求逆
  _invMat(m) {
    if (!m || m.length < 16) return null;
    const a = new Array(16);
    const s = m;
    const inv = [
      s[5]*s[10]*s[15]-s[5]*s[11]*s[14]-s[9]*s[6]*s[15]+s[9]*s[7]*s[14]+s[13]*s[6]*s[11]-s[13]*s[7]*s[10],
      -s[1]*s[10]*s[15]+s[1]*s[11]*s[14]+s[9]*s[2]*s[15]-s[9]*s[3]*s[14]-s[13]*s[2]*s[11]+s[13]*s[3]*s[10],
      s[1]*s[6]*s[15]-s[1]*s[7]*s[14]-s[5]*s[2]*s[15]+s[5]*s[3]*s[14]+s[13]*s[2]*s[7]-s[13]*s[3]*s[6],
      -s[1]*s[6]*s[11]+s[1]*s[7]*s[10]+s[5]*s[2]*s[11]-s[5]*s[3]*s[10]-s[9]*s[2]*s[7]+s[9]*s[3]*s[6],
      -s[4]*s[10]*s[15]+s[4]*s[11]*s[14]+s[8]*s[6]*s[15]-s[8]*s[7]*s[14]-s[12]*s[6]*s[11]+s[12]*s[7]*s[10],
      s[0]*s[10]*s[15]-s[0]*s[11]*s[14]-s[8]*s[2]*s[15]+s[8]*s[3]*s[14]+s[12]*s[2]*s[11]-s[12]*s[3]*s[10],
      -s[0]*s[6]*s[15]+s[0]*s[7]*s[14]+s[4]*s[2]*s[15]-s[4]*s[3]*s[14]-s[12]*s[2]*s[7]+s[12]*s[3]*s[6],
      s[0]*s[6]*s[11]-s[0]*s[7]*s[10]-s[4]*s[2]*s[11]+s[4]*s[3]*s[10]+s[8]*s[2]*s[7]-s[8]*s[3]*s[6],
      s[4]*s[9]*s[15]-s[4]*s[11]*s[13]-s[8]*s[5]*s[15]+s[8]*s[7]*s[13]+s[12]*s[5]*s[11]-s[12]*s[7]*s[9],
      -s[0]*s[9]*s[15]+s[0]*s[11]*s[13]+s[8]*s[1]*s[15]-s[8]*s[3]*s[13]-s[12]*s[1]*s[11]+s[12]*s[3]*s[9],
      s[0]*s[5]*s[15]-s[0]*s[7]*s[13]-s[4]*s[1]*s[15]+s[4]*s[3]*s[13]+s[12]*s[1]*s[7]-s[12]*s[3]*s[5],
      -s[0]*s[5]*s[11]+s[0]*s[7]*s[9]+s[4]*s[1]*s[11]-s[4]*s[3]*s[9]-s[8]*s[1]*s[7]+s[8]*s[3]*s[5],
      -s[4]*s[9]*s[14]+s[4]*s[10]*s[13]+s[8]*s[5]*s[14]-s[8]*s[6]*s[13]-s[12]*s[5]*s[10]+s[12]*s[6]*s[9],
      s[0]*s[9]*s[14]-s[0]*s[10]*s[13]-s[8]*s[1]*s[14]+s[8]*s[2]*s[13]+s[12]*s[1]*s[10]-s[12]*s[2]*s[9],
      -s[0]*s[5]*s[14]+s[0]*s[6]*s[13]+s[4]*s[1]*s[14]-s[4]*s[2]*s[13]-s[12]*s[1]*s[6]+s[12]*s[2]*s[5],
      s[0]*s[5]*s[10]-s[0]*s[6]*s[9]-s[4]*s[1]*s[10]+s[4]*s[2]*s[9]+s[8]*s[1]*s[6]-s[8]*s[2]*s[5]
    ];
    let det = s[0]*inv[0]+s[1]*inv[4]+s[2]*inv[8]+s[3]*inv[12];
    if (Math.abs(det) < 1e-10) return null;
    det = 1/det;
    for (let i=0;i<16;i++) a[i]=inv[i]*det;
    return a;
  },

  // ==================== 渲染循环 ====================
  _startLoop() {
    if (this._loopRunning) return;
    this._loopRunning = true;
    const loop = () => {
      if (!this._loopRunning) return;
      if (this._pageVis) this._draw();
      this._animId = setTimeout(loop, 16);
    };
    loop();
  },

  _draw() {
    const ctx = this.ctx; if (!ctx) return;
    ctx.clearRect(0, 0, this._lw, this._lh);
    const now = Date.now();

    for (const obj of this.objects) {
      const age = (now - obj.born) / 1000;
      const cfg = MODEL_CFG[obj.type];

      // 弹性缩放动画
      let s = 1;
      if (age < 0.6) {
        const t = age / 0.6;
        const c4 = (2*Math.PI)/3;
        s = Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1;
      }

      const rot = obj.rotPhase + now*0.001*obj.rotSpeed;

      // 直接使用屏幕坐标
      const sx = obj.wx; // 存储的就是屏幕 x
      const sy = obj.wy; // 存储的就是屏幕 y
      const size = 50 * s; // 固定大小（也可以根据 z 深度缩放）

      this._drawShape(ctx, sx, sy, size, rot, obj.type, cfg);
    }

    // 只在检测到运动时显示圆圈
    if (this._motionScore > 15) {
      const cx = this._lw/2, cy = this._lh*0.45, cr = 55;
      ctx.save();
      ctx.globalAlpha = Math.min(this._motionScore / 50, 0.6);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 20;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  },

  _drawShape(ctx, x, y, sz, rot, type, cfg) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = cfg.glow;
    ctx.shadowBlur = sz * 0.35;
    ctx.fillStyle = cfg.color;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;

    if (type === 'cube') {
      const h = sz*0.5, o = h*0.35;
      ctx.beginPath(); ctx.rect(-h,-h,h*2,h*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = cfg.glow; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(-h,-h); ctx.lineTo(-h+o,-h-o); ctx.lineTo(h+o,-h-o); ctx.lineTo(h,-h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = cfg.color; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(h,-h); ctx.lineTo(h+o,-h-o); ctx.lineTo(h+o,h-o); ctx.lineTo(h,h); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    } else if (type === 'sphere') {
      const r = sz*0.5;
      const g = ctx.createRadialGradient(-r*0.3,-r*0.3,r*0.1,0,0,r);
      g.addColorStop(0,'#fff'); g.addColorStop(0.3,cfg.glow); g.addColorStop(1,cfg.color);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    } else if (type === 'cylinder') {
      const r=sz*0.35, h=sz*0.5;
      ctx.beginPath(); ctx.ellipse(0,h,r,r*0.3,0,0,Math.PI); ctx.fill();
      ctx.fillRect(-r,-h,r*2,h*2);
      ctx.fillStyle=cfg.glow; ctx.beginPath(); ctx.ellipse(0,-h,r,r*0.3,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    } else if (type === 'torus') {
      const o=sz*0.5, i=sz*0.18;
      ctx.strokeStyle=cfg.color; ctx.lineWidth=i*2; ctx.lineCap='round';
      ctx.beginPath(); ctx.ellipse(0,0,o,o*0.4,rot*0.5,0,Math.PI*2); ctx.stroke();
    } else if (type === 'cone') {
      const r=sz*0.4, h=sz*0.55;
      ctx.beginPath(); ctx.moveTo(0,-h); ctx.lineTo(-r,h*0.6); ctx.lineTo(r,h*0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle=cfg.glow; ctx.globalAlpha=0.6;
      ctx.beginPath(); ctx.ellipse(0,h*0.6,r,r*0.25,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    }
    ctx.restore();
  },

  // ==================== 用户操作 ====================
  onPick(e) { this.setData({ activeModel: e.currentTarget.dataset.m }); wx.vibrateShort({type:'light'}); },

  // 放置按钮 → 随机放在中心区域
  onPlace() {
    const cx = this._lw / 2;
    const cy = this._lh * 0.45;
    const r = 50;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * r * 0.8;
    this._placeAt(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist);
  },

  onReset() { this._doReset(); },

  _doReset() {
    this.objects = [];
    this.setData({ objCount: 0 });
    wx.vibrateShort({type:'medium'});
    this._toast('已清除', 1200);
  },

  // ==================== 截图 ====================
  onCapture() {
    if (!this.ctx || !this.ctx.canvas) { this._toast('画布未就绪', 1500); return; }
    this._toast('截图中...');

    // 用 canvas 节点直接导出
    wx.canvasToTempFilePath({
      canvas: this.ctx.canvas,
      fileType: 'jpg',
      quality: 0.9,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '已保存至相册', icon: 'success' }),
          fail: () => this._toast('保存失败，请检查相册权限', 2500)
        });
      },
      fail: (err) => {
        console.error('[AR] 截图导出失败:', err);
        this._toast('截图导出失败', 2000);
      }
    });
  },

  // ==================== 放置逻辑 ====================
  _placeAt(screenX, screenY) {
    // 直接存储屏幕坐标，物体画在点击位置
    this.objects.push({
      wx: screenX, wy: screenY, wz: -1,
      type: this.data.activeModel,
      born: Date.now(),
      rotSpeed: 1.2 + Math.random() * 1.5,
      rotPhase: Math.random() * Math.PI * 2
    });

    this.setData({ objCount: this.objects.length });
    wx.vibrateShort({type:'medium'});
    this._toast('已放置 ' + MODEL_CFG[this.data.activeModel].label, 1200);
  },

  // ==================== 工具 ====================
  _toast(text, dur) {
    dur = dur || 2500;
    this.setData({ toastText: text });
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => this.setData({ toastText: '' }), dur);
  }
});
