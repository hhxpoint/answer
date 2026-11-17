import { PDFDocument } from '../../utils/pdf-lib.min.js'; // 确保路径正确
import { enhanceDocument } from '../../utils/imageScanner.js'; // 引入增强算法
const fs = wx.getFileSystemManager();

Page({
  data: {
    imageList: [], 
    isGenerating: false, 
    
    // === 弹窗相关状态 ===
    showNameModal: false,
    pdfFileName: '', // 用户输入的文件名

    // === 新增：扫描增强相关状态 ===
    showScanModal: false,       // 是否显示扫描预览弹窗
    previewEnhancedImage: '',   // 增强后的图片临时路径
    currentScanIndex: -1,       // 当前正在扫描的图片索引
  },

  // ================= 原有逻辑保持不变 =================
  chooseImages() {
    let currentLength = this.data.imageList.length;
    let maxCount = 20; 
    if (currentLength >= maxCount) {
      wx.showToast({ title: '最多只能选20张', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: maxCount - currentLength, 
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          imageList: this.data.imageList.concat(newImages)
        });
      }
    });
  },

  previewImage(e) {
    const currentUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentUrl,
      urls: this.data.imageList 
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.imageList;
    list.splice(index, 1);
    this.setData({ imageList: list });
  },

  clearImages() {
    wx.showModal({
      title: '提示',
      content: '确认清空所有已选图片吗？',
      confirmColor: '#ee0a24',
      success: (res) => {
        if (res.confirm) {
          this.setData({ imageList: [] });
        }
      }
    });
  },

  moveLeft(e) {
    const index = e.currentTarget.dataset.index;
    if (index === 0) return; 
    let list = this.data.imageList;
    let temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    this.setData({ imageList: list });
  },

  moveRight(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.imageList;
    if (index === list.length - 1) return; 
    let temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    this.setData({ imageList: list });
  },

  compressImage(src) {
    return new Promise((resolve) => {
      wx.compressImage({
        src: src,
        quality: 70, 
        success: (res) => resolve(res.tempFilePath),
        fail: () => resolve(src)
      });
    });
  },

  openNameModal() {
    if (this.data.imageList.length === 0) return;
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const defaultName = `文档合成_${dateStr}`;
    this.setData({
      showNameModal: true,
      pdfFileName: defaultName
    });
  },

  closeNameModal() {
    this.setData({ showNameModal: false });
  },

  preventBubbling() {
    return;
  },

  onFileNameInput(e) {
    this.setData({
      pdfFileName: e.detail.value
    });
  },

  async generatePDF() {
    this.setData({ 
      showNameModal: false,
      isGenerating: true 
    });
    wx.showLoading({ title: '正在处理中...', mask: true });

    try {
      const pdfDoc = await PDFDocument.create();
      const A4_WIDTH = 595.28;
      const A4_HEIGHT = 841.89;

      for (let i = 0; i < this.data.imageList.length; i++) {
        let imgPath = this.data.imageList[i];
        imgPath = await this.compressImage(imgPath);
        const imgBase64 = fs.readFileSync(imgPath, 'base64');
        
        let pdfImage;
        try {
          pdfImage = await pdfDoc.embedJpg(imgBase64);
        } catch (e) {
          pdfImage = await pdfDoc.embedPng(imgBase64);
        }

        const imgDims = pdfImage.scale(1); 
        const margin = 20; 
        const maxWidth = A4_WIDTH - margin * 2;
        const maxHeight = A4_HEIGHT - margin * 2;
        
        const scale = Math.min(maxWidth / imgDims.width, maxHeight / imgDims.height);
        const drawWidth = imgDims.width * scale;
        const drawHeight = imgDims.height * scale;
        
        const x = (A4_WIDTH - drawWidth) / 2;
        const y = (A4_HEIGHT - drawHeight) / 2;

        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        page.drawImage(pdfImage, { x, y, width: drawWidth, height: drawHeight });
      }

      const pdfBase64Data = await pdfDoc.saveAsBase64();
      
      let finalName = this.data.pdfFileName.trim();
      if (!finalName) {
        finalName = `文件_${Date.now()}`;
      }
      if (!finalName.toLowerCase().endsWith('.pdf')) {
        finalName += '.pdf';
      }

      const filePath = `${wx.env.USER_DATA_PATH}/${finalName}`;
      fs.writeFileSync(filePath, pdfBase64Data, 'base64');

      this.setData({ isGenerating: false });
      wx.hideLoading();

      this.openPDF(filePath);

    } catch (error) {
      console.error('PDF生成失败:', error);
      this.setData({ isGenerating: false });
      wx.hideLoading();
      wx.showModal({ title: '生成失败', content: '处理异常，请检查图片或稍后重试', showCancel: false });
    }
  },

  openPDF(filePath) {
    wx.openDocument({
      filePath: filePath,
      fileType: 'pdf',
      showMenu: true, 
      success: () => console.log('打开成功'),
      fail: () => wx.showToast({ title: '打开文档失败', icon: 'none' })
    });
  },

  // ================= 新增：扫描增强逻辑 =================

  // 点击魔法棒，开始处理图片
  startScan(e) {
    const index = e.currentTarget.dataset.index;
    const imgPath = this.data.imageList[index];
    this.setData({ currentScanIndex: index });
    
    wx.showLoading({ title: '魔法增强中...', mask: true });

    const query = wx.createSelectorQuery();
    query.select('#scanCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const img = canvas.createImage();
        img.src = imgPath;
        
        img.onload = () => {
          // 为了防止相机拍的图太大导致小程序崩溃，限制最大宽度为 1200px
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_SIZE || height > MAX_SIZE) {
            const ratio = Math.max(width / MAX_SIZE, height / MAX_SIZE);
            width = Math.round(width / ratio);
            height = Math.round(height / ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // 绘制原图
          ctx.drawImage(img, 0, 0, width, height);

          // 获取像素并调用增强算法
          const imageData = ctx.getImageData(0, 0, width, height);
          const processedData = enhanceDocument(imageData, 140); // 140是阈值
          ctx.putImageData(processedData, 0, 0);

          // 导出增强后的图片
          wx.canvasToTempFilePath({
            canvas: canvas,
            destWidth: width,
            destHeight: height,
            fileType: 'jpg',
            quality: 0.9,
            success: (exportRes) => {
              this.setData({
                previewEnhancedImage: exportRes.tempFilePath,
                showScanModal: true // 显示预览弹窗
              });
              wx.hideLoading();
            },
            fail: (err) => {
              console.error(err);
              wx.hideLoading();
              wx.showToast({ title: '增强失败', icon: 'none' });
            }
          });
        };
      });
  },

  // 预览增强后的大图
  previewEnhanced() {
    wx.previewImage({
      urls: [this.data.previewEnhancedImage]
    });
  },

  // 确认使用增强后的图片
  confirmScan() {
    const index = this.data.currentScanIndex;
    const newList = this.data.imageList;
    newList[index] = this.data.previewEnhancedImage; // 替换原图

    this.setData({
      imageList: newList,
      showScanModal: false
    });
    wx.showToast({ title: '已应用增强效果', icon: 'success' });
  },

  // 取消增强，关闭弹窗
  cancelScan() {
    this.setData({ showScanModal: false });
  },

  onShareAppMessage() {
    return { title: '各类格式图片快速转PDF的高效工具', path: 'packagepdf/pages/img2pdf/img2pdf' };
  },

  onShareTimeline() {
    return { title: '各类格式图片快速转PDF的高效工具' };
  }
});