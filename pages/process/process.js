// pages/process/process.js
Page({
  onShow() {
    if (typeof getApp === 'function' && getApp().profileGuard && getApp().profileGuard.guard()) return;
  },

  data: {
    processing: false,
    mode: 'remove', // 'remove' 或 'add'
    brushSize: 30,
    watermarkOpacity: 50,
    watermarkColor: '#5c4b3c', // 默认深木色
    hasImage: false
  },

  onReady() {
    this.initCanvases();
  },

  // 初始化多层画布系统
  initCanvases() {
    const query = wx.createSelectorQuery();
    query.select('#mainCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvasWidth = res[0].width;
        this.canvasHeight = res[0].height;

        // 设置主画布实际渲染尺寸 (避免模糊)
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;

        // 1. 创建离屏底图画布 (只存干净的原图)
        this.baseCanvas = wx.createOffscreenCanvas({ type: '2d', width: canvas.width, height: canvas.height });
        this.baseCtx = this.baseCanvas.getContext('2d');

        // 2. 创建离屏遮罩画布 (只存黑底白线的涂抹痕迹)
        this.maskCanvas = wx.createOffscreenCanvas({ type: '2d', width: canvas.width, height: canvas.height });
        this.maskCtx = this.maskCanvas.getContext('2d');
        
        this.resetMask(); // 初始化全黑遮罩
      });
  },

  // 切换模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode });
    if (mode === 'remove' && this.data.hasImage) {
      this.refreshMainCanvas(); // 切换回来时清除可能存在的水印预览
    }
  },

  // 滑块事件
  onBrushSizeChange(e) { this.setData({ brushSize: e.detail.value }); },
  onOpacityChange(e) { this.setData({ watermarkOpacity: e.detail.value }); },

  // --- 图片加载与渲染 ---
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.loadImage(tempFilePath);
      }
    });
  },

  loadImage(path) {
    wx.getImageInfo({
      src: path,
      success: (info) => {
        const canvas = this.canvas;
        // 计算居中缩放比例 (类似 object-fit: contain)
        const scale = Math.min(canvas.width / info.width, canvas.height / info.height);
        const drawW = info.width * scale;
        const drawH = info.height * scale;
        const drawX = (canvas.width - drawW) / 2;
        const drawY = (canvas.height - drawH) / 2;

        const img = canvas.createImage();
        img.src = path;
        img.onload = () => {
          // 清空底图并画上新图
          this.baseCtx.clearRect(0, 0, canvas.width, canvas.height);
          this.baseCtx.drawImage(img, drawX, drawY, drawW, drawH);
          
          this.imageRenderInfo = { drawX, drawY, drawW, drawH };
          this.setData({ hasImage: true });
          
          this.resetMask();
          this.refreshMainCanvas();
        };
      }
    });
  },

  // 将底图同步到主展示画布
  refreshMainCanvas() {
    if (!this.data.hasImage) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.baseCanvas, 0, 0);
  },

  // --- 涂抹去水印交互 ---
  resetMask() {
    if (!this.maskCtx) return;
    this.maskCtx.fillStyle = '#000000'; // 黑底
    this.maskCtx.fillRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
  },

  clearMask() {
    this.resetMask();
    this.refreshMainCanvas(); // 清除涂抹痕迹
    wx.showToast({ title: '已清空痕迹', icon: 'none' });
  },

  undoMask() {
    this.clearMask(); // 简单实现：撤销等于全部清空重来
  },

  onCanvasTouchStart(e) {
    if (!this.data.hasImage || this.data.mode !== 'remove') return;
    const { x, y } = e.touches[0];
    this.isDrawing = true;

    // 主画布：画半透明红色，给用户看
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.data.brushSize;
    this.ctx.strokeStyle = 'rgba(212, 163, 115, 0.6)'; // 改为温馨的木色半透明痕迹
    this.ctx.moveTo(x, y);

    // 遮罩画布：画纯白色，给算法看
    this.maskCtx.beginPath();
    this.maskCtx.lineCap = 'round';
    this.maskCtx.lineJoin = 'round';
    this.maskCtx.lineWidth = this.data.brushSize;
    this.maskCtx.strokeStyle = '#ffffff';
    this.maskCtx.moveTo(x, y);
  },

  onCanvasTouchMove(e) {
    if (!this.isDrawing || this.data.mode !== 'remove') return;
    const { x, y } = e.touches[0];
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.maskCtx.lineTo(x, y);
    this.maskCtx.stroke();
  },

  onCanvasTouchEnd() {
    this.isDrawing = false;
  },

  // --- 核心：调用 Worker 处理去水印 ---
  removeWatermark() {
    if (!this.data.hasImage) {
      wx.showToast({ title: '请先悬挂画作(选图)', icon: 'none' });
      return;
    }

    this.setData({ processing: true });

    // 1. 获取纯净底图的数据
    const baseData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    // 2. 获取黑白遮罩的数据
    const maskData = this.maskCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    // 3. 创建并调用 Worker
    const worker = wx.createWorker('worker/inpainting.js');
    
    worker.postMessage({
      imageData: baseData.data.buffer,
      maskData: maskData.data.buffer,
      width: this.canvas.width,
      height: this.canvas.height
    });

    worker.onMessage((res) => {
      // 接收处理后的像素
      const processedArray = new Uint8ClampedArray(res.processedData);
      const newImageData = this.canvas.createImageData(processedArray, this.canvas.width, this.canvas.height);
      
      // 更新到底图层
      this.baseCtx.putImageData(newImageData, 0, 0);
      
      // 刷新展示并重置遮罩
      this.refreshMainCanvas();
      this.resetMask();
      
      worker.terminate(); // 用完销毁
      this.setData({ processing: false });
      wx.showToast({ title: '处理完成 ✨', icon: 'none' });
    });
  },

  // --- 加水印功能 ---
  addTextWatermark() {
    if (!this.data.hasImage) return wx.showToast({ title: '请先选图', icon: 'none' });
    
    wx.showModal({
      title: '输入您的专属印记',
      editable: true,
      placeholderText: '例如：@主轩次瀚',
      success: (res) => {
        if (res.confirm && res.content) {
          this.refreshMainCanvas(); // 先恢复底图
          
          this.ctx.save();
          this.ctx.font = 'bold 36px sans-serif';
          this.ctx.fillStyle = this.data.watermarkColor;
          this.ctx.globalAlpha = this.data.watermarkOpacity / 100;
          
          // 画在右下角偏上位置
          const textWidth = this.ctx.measureText(res.content).width;
          const x = this.canvas.width - textWidth - 30;
          const y = this.canvas.height - 60;
          
          this.ctx.fillText(res.content, x, y);
          this.ctx.restore();
          
          this.tempWatermarkApplied = true;
          wx.showToast({ title: '印记已预览', icon: 'none' });
        }
      }
    });
  },

  addImageWatermark() {
    if (!this.data.hasImage) return wx.showToast({ title: '请先选图', icon: 'none' });

    wx.chooseImage({
      count: 1,
      success: (res) => {
        const path = res.tempFilePaths[0];
        const img = this.canvas.createImage();
        img.src = path;
        img.onload = () => {
          this.refreshMainCanvas(); // 先恢复底图
          
          this.ctx.save();
          this.ctx.globalAlpha = this.data.watermarkOpacity / 100;
          const w = 100, h = 100;
          const x = this.canvas.width - w - 20;
          const y = this.canvas.height - h - 20;
          
          this.ctx.drawImage(img, x, y, w, h);
          this.ctx.restore();
          
          this.tempWatermarkApplied = true;
          wx.showToast({ title: '印记已预览', icon: 'none' });
        };
      }
    });
  },

  applyWatermark() {
    if (!this.tempWatermarkApplied) {
      wx.showToast({ title: '请先添加印记', icon: 'none' });
      return;
    }
    // 将主画布(带水印)的内容合并到底图层，使之成为永久修改
    this.baseCtx.drawImage(this.canvas, 0, 0);
    this.tempWatermarkApplied = false;
    wx.showToast({ title: '印记已烙下 🖋️', icon: 'none' });
  },

  // --- 保存作品 ---
  saveImage() {
    if (!this.data.hasImage) return wx.showToast({ title: '还未创作', icon: 'none' });
    
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      fileType: 'jpg',
      quality: 1,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '已保存至相册' }),
          fail: (err) => {
            if(err.errMsg.includes('auth deny')) {
              wx.showToast({ title: '需要相册权限', icon: 'none' });
            }
          }
        });
      }
    });
  }
});