const codeTools = require('../../utils/code-tools.js');

Page({
  data: {
    inputCode: '',
    formattedCode: '',
    richTextNodes: '',
    showModal: false
  },

  onInputChange(e) {
    this.setData({ inputCode: e.detail.value });
  },

  generateCodeCard() {
    const rawCode = this.data.inputCode;
    if (!rawCode.trim()) {
      wx.showToast({ title: '大牛，请贴入代码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '语法解析中...' });

    setTimeout(() => {
      // 1. 智能格式化
      const formattedCode = codeTools.formatCode(rawCode);
      // 2. 安全语法高亮
      const richTextNodes = codeTools.highlightCode(formattedCode);

      this.setData({
        formattedCode: formattedCode,
        richTextNodes: richTextNodes,
        showModal: true
      });
      wx.hideLoading();
    }, 200);
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  stopBubble() { return; },
  preventTouchMove() { return; },

  copyCode() {
    if (!this.data.formattedCode) return;
    wx.setClipboardData({
      data: this.data.formattedCode,
      success: () => wx.showToast({ title: '纯文本已复制', icon: 'success' })
    });
  },

  // === 核心功能：保存为真正的长图 ===
  saveAsImage() {
    wx.showLoading({ title: '生成图片中...' });
    
    // 获取 snapshot 组件实例
    this.createSelectorQuery().select('#snapshot-target')
      .node()
      .exec(res => {
        if (!res[0] || !res[0].node) {
          wx.hideLoading();
          wx.showToast({ title: '微信版本过低，无法截图', icon: 'none' });
          return;
        }
        const node = res[0].node;
        
        // 触发快照截图
        node.takeSnapshot({
          type: 'arraybuffer',
          format: 'png',
          success: (snapRes) => {
            // 将 ArrayBuffer 写入本地临时文件
            const fsm = wx.getFileSystemManager();
            const filePath = `${wx.env.USER_DATA_PATH}/code_beautify_${Date.now()}.png`;
            
            fsm.writeFile({
              filePath: filePath,
              data: snapRes.data,
              encoding: 'binary',
              success: () => {
                // 保存到相册
                wx.saveImageToPhotosAlbum({
                  filePath: filePath,
                  success: () => {
                    wx.hideLoading();
                    wx.showToast({ title: '长图已保存到相册', icon: 'success' });
                  },
                  fail: (err) => {
                    wx.hideLoading();
                    // 处理相册授权拒绝的情况
                    if (err.errMsg.includes('auth deny')) {
                      wx.showToast({ title: '请授权相册权限', icon: 'none' });
                    }
                  }
                });
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '文件写入失败', icon: 'none' });
              }
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '截图生成失败', icon: 'none' });
          }
        });
      });
  }
})