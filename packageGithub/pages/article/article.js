// packageTech/pages/article/article.js
/**
 * Paper Geek - 论文详情页
 * 使用 arXiv PDF 获取
 */

const { getBestPdfUrl } = require('../../utils/formatter.js')
const { smartTranslate } = require('../../utils/tencent-translator.js')

Page({
  data: {
    paper: null,
    loading: true,
    pdfDownloading: false,
    pdfInfo: null, // { url, source }
    // 翻译相关
    isTranslated: false,
    translatedContent: '',
    displayContent: ''
  },

  onLoad(options) {
    this.loadPaper(options.id)
  },

  /**
   * 加载论文数据
   */
  loadPaper(paperId) {
    const paper = wx.getStorageSync('papergeek_current_paper')

    if (!paper) {
      console.error('[详情页] 未找到论文数据')
      this.setData({ loading: false })
      return
    }

    // 获取最佳 PDF URL
    const pdfInfo = getBestPdfUrl(paper)
    
    console.log('[详情页] 标题:', paper.title)
    console.log('[详情页] arXiv ID:', paper.arxivId)
    console.log('[详情页] PDF 来源:', pdfInfo.source)
    console.log('[详情页] PDF URL:', pdfInfo.url)

    this.setData({
      paper: paper,
      pdfInfo: pdfInfo,
      loading: false,
      displayContent: paper.abstract
    })

    wx.setNavigationBarTitle({
      title: (paper.venue || 'Paper Geek').substring(0, 10)
    })
  },

  /**
   * 打开 PDF（只使用arxiv，避免其他域名未备案问题）
   */
  openPdf() {
    const { paper } = this.data
    
    // 只使用 arXiv PDF
    if (paper.arxivId) {
      const arxivUrl = `https://arxiv.org/pdf/${paper.arxivId}`
      this.downloadAndOpenPdf(arxivUrl)
      return
    }

    wx.showToast({ title: '暂无可用PDF', icon: 'none' })
  },

  /**
   * 下载并打开 PDF
   */
  downloadAndOpenPdf(pdfUrl) {
    this.setData({ pdfDownloading: true })
    wx.showLoading({ title: '正在检索文献...' })

    console.log('[PDF] 下载:', pdfUrl)

    wx.downloadFile({
      url: pdfUrl,
      success(res) {
        wx.hideLoading()
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            showMenu: true,
            success() {
              console.log('[PDF] 打开成功')
            },
            fail(err) {
              console.error('[PDF] 打开失败:', err)
              wx.showToast({ title: '打开失败', icon: 'none' })
            }
          })
        } else {
          wx.showToast({ title: '下载失败', icon: 'none' })
        }
      },
      fail(err) {
        wx.hideLoading()
        console.error('[PDF] 下载失败:', err)
        wx.showToast({ title: '下载失败，请检查网络', icon: 'none' })
      },
      complete: () => {
        this.setData({ pdfDownloading: false })
      }
    })
  },

  /**
   * 复制 DOI
   */
  copyDoi() {
    const { paper } = this.data
    if (!paper || !paper.doi) {
      wx.showToast({ title: '暂无DOI', icon: 'none' })
      return
    }

    wx.setClipboardData({
      data: paper.doi,
      success: () => {
        wx.showToast({ title: 'DOI已复制', icon: 'success' })
      }
    })
  },

  /**
   * 复制标题
   */
  copyTitle() {
    const { paper } = this.data
    if (!paper) return

    wx.setClipboardData({
      data: paper.title,
      success: () => {
        wx.showToast({ title: '标题已复制', icon: 'success' })
      }
    })
  },

  /**
   * 复制摘要
   */
  copyAbstract() {
    const { paper } = this.data
    if (!paper) return

    wx.setClipboardData({
      data: paper.abstract,
      success: () => {
        wx.showToast({ title: '摘要已复制', icon: 'success' })
      }
    })
  },

  /**
   * 切换翻译
   */
  toggleTranslate() {
    if (this.data.isTranslated) {
      // 切回原文
      this.setData({
        isTranslated: false,
        displayContent: this.data.paper.abstract
      })
    } else {
      // 翻译
      if (this.data.translatedContent) {
        // 已有翻译结果，直接显示
        this.setData({
          isTranslated: true,
          displayContent: this.data.translatedContent
        })
      } else {
        // 调用翻译
        this.translateAbstract()
      }
    }
  },

  /**
   * 翻译摘要（使用腾讯云翻译）
   */
  async translateAbstract() {
    const abstract = this.data.paper.abstract
    if (!abstract) {
      wx.showToast({ title: '暂无摘要', icon: 'none' })
      return
    }

    wx.showLoading({ title: '翻译中...' })

    try {
      // 限制长度
      let content = abstract
      if (content.length > 5000) {
        content = content.substring(0, 5000)
      }

      const result = await smartTranslate(content)
      
      wx.hideLoading()
      this.setData({
        translatedContent: result,
        isTranslated: true,
        displayContent: result
      })
    } catch (err) {
      wx.hideLoading()
      console.error('[翻译] 失败:', err)
      wx.showToast({ title: '翻译失败: ' + (err.message || '请重试'), icon: 'none' })
    }
  },

  /**
   * 跳转到翻译工具页面
   */
  goToTranslateTool() {
    const { paper } = this.data
    if (!paper || !paper.abstract) {
      wx.showToast({ title: '暂无摘要内容', icon: 'none' })
      return
    }
    
    // 将摘要文本传递给翻译页面
    const text = encodeURIComponent(paper.abstract)
    wx.navigateTo({
      url: `/packageGithub/pages/translate/translate?text=${text}`
    })
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.redirectTo({ url: '/packageGithub/pages/journal/journal' })
      }
    })
  },

  onShareAppMessage() {
    const { paper } = this.data
    if (!paper) {
      return {
        title: 'Paper Geek - 学术日报',
        path: '/packageGithub/pages/journal/journal'
      }
    }
    return {
      title: paper.title,
      path: `/packageGithub/pages/article/article?id=${paper.id}`
    }
  },

  onShareTimeline() {
    const { paper } = this.data
    if (!paper) return {}
    return {
      title: `📚 ${paper.title} - Paper Geek`,
      query: `id=${paper.id}`
    }
  }
})
