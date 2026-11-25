// packageGithub/pages/translate/translate.js
/**
 * Paper Geek - 翻译工具页面
 * 支持文本翻译、图片翻译等丰富功能
 */

const { translateText } = require('../../utils/tencent-translator.js')

Page({
  data: {
    // 翻译模式: 'text' | 'image'
    mode: 'text',
    
    // 输入输出
    sourceText: '',
    targetText: '',
    
    // 语言设置
    sourceLang: 'auto',
    targetLang: 'zh',
    sourceLangName: '自动检测',
    targetLangName: '中文',
    
    // 语言列表
    languages: [
      { code: 'auto', name: '自动检测' },
      { code: 'zh', name: '中文' },
      { code: 'en', name: '英语' },
      { code: 'ja', name: '日语' },
      { code: 'ko', name: '韩语' },
      { code: 'fr', name: '法语' },
      { code: 'es', name: '西班牙语' },
      { code: 'de', name: '德语' },
      { code: 'ru', name: '俄语' },
      { code: 'pt', name: '葡萄牙语' },
      { code: 'it', name: '意大利语' },
      { code: 'vi', name: '越南语' },
      { code: 'th', name: '泰语' },
      { code: 'ar', name: '阿拉伯语' },
      { code: 'hi', name: '印地语' }
    ],
    
    // 目标语言列表（不含自动检测）
    targetLanguages: [
      { code: 'zh', name: '中文' },
      { code: 'en', name: '英语' },
      { code: 'ja', name: '日语' },
      { code: 'ko', name: '韩语' },
      { code: 'fr', name: '法语' },
      { code: 'es', name: '西班牙语' },
      { code: 'de', name: '德语' },
      { code: 'ru', name: '俄语' },
      { code: 'pt', name: '葡萄牙语' },
      { code: 'it', name: '意大利语' },
      { code: 'vi', name: '越南语' },
      { code: 'th', name: '泰语' },
      { code: 'ar', name: '阿拉伯语' },
      { code: 'hi', name: '印地语' }
    ],
    
    // 状态
    translating: false,
    translated: false,
    playingSource: false,
    playingTarget: false,
    playingSentences: [],
    currentSentenceIndex: 0,
    
    // 历史记录
    history: []
  },

  onLoad(options) {
    // 初始化音频播放器
    this.audioSource = wx.createInnerAudioContext()
    this.audioTarget = wx.createInnerAudioContext()
    
    // 原文音频播放完成回调
    this.audioSource.onEnded(() => {
      this.setData({ playingSource: false })
    })
    this.audioSource.onError(() => {
      this.setData({ playingSource: false })
      wx.showToast({ title: '播放失败', icon: 'none' })
    })
    
    // 译文音频播放完成回调
    this.audioTarget.onEnded(() => {
      this.setData({ playingTarget: false })
    })
    this.audioTarget.onError(() => {
      this.setData({ playingTarget: false })
      wx.showToast({ title: '播放失败', icon: 'none' })
    })
    
    // 如果从文章页跳转过来，带入原文
    if (options.text) {
      const text = decodeURIComponent(options.text)
      this.setData({ sourceText: text })
    }
    // 加载历史记录
    this.loadHistory()
  },
  
  onUnload() {
    // 页面销毁时释放音频资源
    if (this.audioSource) {
      this.audioSource.destroy()
    }
    if (this.audioTarget) {
      this.audioTarget.destroy()
    }
  },

  /**
   * 切换翻译模式
   */
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ mode })
  },

  /**
   * 输入文本
   */
  onInput(e) {
    this.setData({ 
      sourceText: e.detail.value,
      translated: false
    })
  },

  /**
   * 选择源语言
   */
  onSourceLangChange(e) {
    const index = e.detail.value
    const lang = this.data.languages[index]
    this.setData({
      sourceLang: lang.code,
      sourceLangName: lang.name
    })
  },

  /**
   * 选择目标语言
   */
  onTargetLangChange(e) {
    const index = e.detail.value
    const lang = this.data.targetLanguages[index]
    this.setData({
      targetLang: lang.code,
      targetLangName: lang.name
    })
  },

  /**
   * 交换语言
   */
  swapLanguages() {
    if (this.data.sourceLang === 'auto') {
      wx.showToast({ title: '自动检测不可交换', icon: 'none' })
      return
    }
    
    const tempLang = this.data.sourceLang
    const tempLangName = this.data.sourceLangName
    
    this.setData({
      sourceLang: this.data.targetLang,
      sourceLangName: this.data.targetLangName,
      targetLang: tempLang,
      targetLangName: tempLangName
    })
  },

  /**
   * 执行翻译
   */
  async doTranslate() {
    const { sourceText, sourceLang, targetLang } = this.data
    
    if (!sourceText.trim()) {
      wx.showToast({ title: '请输入要翻译的内容', icon: 'none' })
      return
    }

    this.setData({ translating: true })

    try {
      const result = await translateText(sourceText, sourceLang, targetLang)
      
      this.setData({
        targetText: result,
        translating: false,
        translated: true
      })
      
      // 保存到历史记录
      this.saveToHistory(sourceText, result, sourceLang, targetLang)
    } catch (err) {
      wx.hideLoading()
      this.setData({ translating: false })
      wx.showToast({ title: '翻译失败: ' + (err.message || '请重试'), icon: 'none' })
    }
  },

  /**
   * 清空输入
   */
  clearInput() {
    this.setData({
      sourceText: '',
      targetText: '',
      translated: false
    })
  },

  /**
   * 复制翻译结果
   */
  copyResult() {
    if (!this.data.targetText) {
      wx.showToast({ title: '暂无翻译结果', icon: 'none' })
      return
    }
    
    wx.setClipboardData({
      data: this.data.targetText,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  /**
   * 复制原文
   */
  copySource() {
    if (!this.data.sourceText) {
      wx.showToast({ title: '暂无原文', icon: 'none' })
      return
    }
    
    wx.setClipboardData({
      data: this.data.sourceText,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  /**
   * 播放原文语音
   */
  playSource() {
    const text = this.data.sourceText
    if (!text) {
      wx.showToast({ title: '暂无原文', icon: 'none' })
      return
    }
    
    // 如果正在播放，则停止
    if (this.data.playingSource) {
      this.audioSource.stop()
      this.setData({ playingSource: false })
      return
    }
    
    // 停止译文播放
    if (this.data.playingTarget) {
      this.audioTarget.stop()
      this.setData({ playingTarget: false })
    }
    
    this.playAudio(text, 'source')
  },

  /**
   * 播放译文语音
   */
  playTarget() {
    const text = this.data.targetText
    if (!text) {
      wx.showToast({ title: '暂无译文', icon: 'none' })
      return
    }
    
    // 如果正在播放，则停止
    if (this.data.playingTarget) {
      this.audioTarget.stop()
      this.setData({ playingTarget: false })
      return
    }
    
    // 停止原文播放
    if (this.data.playingSource) {
      this.audioSource.stop()
      this.setData({ playingSource: false })
    }
    
    this.playAudio(text, 'target')
  },

  /**
   * 通用播放音频方法 - 分句播放
   */
  playAudio(text, type) {
    // 1. 文本预处理
    const cleanText = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
    
    // 2. 分句（按句号、问号、感叹号、逗号、分号）
    let sentences = cleanText.match(/[^。！？，,;；]+[。！？，,;；]?/g)
    
    // 如果没有匹配到分句符，则按30字符切分
    if (!sentences || sentences.length === 0) {
      sentences = []
      for (let i = 0; i < cleanText.length; i += 30) {
        sentences.push(cleanText.substring(i, i + 30))
      }
    }
    
    // 3. 限制每句长度为30字符，并过滤空句
    const limitedSentences = sentences.map(s => s.trim().substring(0, 30)).filter(s => s.length > 0)
    
    if (limitedSentences.length === 0) {
      wx.showToast({ title: '没有可播放的内容', icon: 'none' })
      return
    }
    
    // 4. 停止当前播放
    const audio = type === 'source' ? this.audioSource : this.audioTarget
    audio.stop()
    
    // 5. 存储分句结果并开始播放
    this.setData({
      playingSentences: limitedSentences,
      currentSentenceIndex: 0,
      [type === 'source' ? 'playingSource' : 'playingTarget']: true
    })
    
    // 6. 播放第一句
    this.playSentence(type, 0)
  },

  /**
   * 播放指定句子 - 带重试机制
   */
  playSentence(type, index, retryCount = 0) {
    const sentences = this.data.playingSentences
    const maxRetries = 3
    
    // 检查是否播放完毕
    if (index >= sentences.length) {
      this.setData({ [type === 'source' ? 'playingSource' : 'playingTarget']: false })
      return
    }
    
    const sentence = sentences[index]
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(sentence)}&le=auto`
    const audio = type === 'source' ? this.audioSource : this.audioTarget
    
    this.setData({ currentSentenceIndex: index })
    
    console.log(`播放第${index + 1}句(重试${retryCount}次):`, sentence)
    
    // 先下载音频文件
    wx.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) {
          // 使用本地文件播放
          audio.src = res.tempFilePath
          
          audio.onEnded(() => {
            // 播放下一句
            this.playSentence(type, index + 1)
          })
          
          audio.onError((err) => {
            console.error(`第${index + 1}句播放错误:`, err)
            // 播放下一句
            this.playSentence(type, index + 1)
          })
          
          audio.play()
        } else {
          // 下载失败，重试
          if (retryCount < maxRetries) {
            console.log(`第${index + 1}句下载失败，${retryCount + 1}秒后重试...`)
            setTimeout(() => {
              this.playSentence(type, index, retryCount + 1)
            }, 1000)
          } else {
            console.log(`第${index + 1}句重试${maxRetries}次仍失败，跳过`)
            this.playSentence(type, index + 1)
          }
        }
      },
      fail: (err) => {
        console.error('下载请求失败:', err)
        // 请求失败，重试
        if (retryCount < maxRetries) {
          console.log(`第${index + 1}句请求失败，${retryCount + 1}秒后重试...`)
          setTimeout(() => {
            this.playSentence(type, index, retryCount + 1)
          }, 1000)
        } else {
          console.log(`第${index + 1}句重试${maxRetries}次仍失败，跳过`)
          this.playSentence(type, index + 1)
        }
      }
    })
  },

  /**
   * 选择图片进行翻译
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.translateImage(tempFilePath)
      }
    })
  },

  /**
   * 图片翻译
   */
  async translateImage(filePath) {
    this.setData({ translating: true })
    wx.showLoading({ title: '识别翻译中...' })

    try {
      // 读取图片为base64
      const fs = wx.getFileSystemManager()
      const base64 = fs.readFileSync(filePath, 'base64')
      
      // 调用图片翻译API
      const result = await this.imageTranslate(base64)
      
      wx.hideLoading()
      this.setData({
        sourceText: result.sourceText || '',
        targetText: result.targetText || '',
        translating: false,
        translated: true,
        mode: 'text'
      })
    } catch (err) {
      wx.hideLoading()
      this.setData({ translating: false })
      wx.showToast({ title: '图片翻译失败: ' + (err.message || '请重试'), icon: 'none' })
    }
  },

  /**
   * 调用腾讯云图片翻译API
   */
  imageTranslate(base64Data) {
    return new Promise((resolve, reject) => {
      const { sign } = require('../../utils/tencent-translator.js')
      
      // ⚠️ 安全提示：云 API 密钥严禁硬编码在小程序前端（会随代码包分发）。
      // 图片翻译请改为通过自有服务端代理调用，切勿提交真实密钥。
      const SECRET_ID = ''
      const SECRET_KEY = ''
      const HOST = 'tmt.tencentcloudapi.com'
      const ACTION = 'ImageTranslateLLM'

      if (!SECRET_ID || !SECRET_KEY) {
        reject(new Error('图片翻译未配置密钥，暂不可用（建议改为服务端代理）'))
        return
      }

      let CryptoJS
      try {
        CryptoJS = require('../../miniprogram_npm/crypto-js/core.js')
        require('../../miniprogram_npm/crypto-js/sha256.js')
        require('../../miniprogram_npm/crypto-js/hmac.js')
        require('../../miniprogram_npm/crypto-js/enc-hex.js')
      } catch (e) {
        reject(new Error('图片翻译依赖未构建：请在开发者工具执行「构建 npm」后重试'))
        return
      }
      
      const timestamp = Math.floor(Date.now() / 1000)
      const date = new Date(timestamp * 1000).toISOString().split('T')[0]
      
      const payload = JSON.stringify({
        Data: base64Data,
        Target: this.data.targetLang
      })

      // 生成签名
      const sha256 = (msg) => CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex)
      
      const canonicalRequest = `POST\n/\n\ncontent-type:application/json; charset=utf-8\nhost:${HOST}\nx-tc-action:${ACTION.toLowerCase()}\n\ncontent-type;host;x-tc-action\n${sha256(payload)}`
      
      const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${date}/tmt/tc3_request\n${sha256(canonicalRequest)}`
      
      const kDate = CryptoJS.HmacSHA256(date, 'TC3' + SECRET_KEY)
      const kService = CryptoJS.HmacSHA256('tmt', kDate)
      const kSigning = CryptoJS.HmacSHA256('tc3_request', kService)
      const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex)
      
      const authorization = `TC3-HMAC-SHA256 Credential=${SECRET_ID}/${date}/tmt/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=${signature}`

      wx.request({
        url: `https://${HOST}/`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json; charset=utf-8',
          'Host': HOST,
          'X-TC-Action': ACTION,
          'X-TC-Version': '2018-03-21',
          'X-TC-Region': 'ap-guangzhou',
          'X-TC-Timestamp': timestamp.toString(),
          'Authorization': authorization
        },
        data: payload,
        timeout: 30000,
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.Response) {
            if (res.data.Response.SourceText && res.data.Response.TargetText) {
              resolve({
                sourceText: res.data.Response.SourceText,
                targetText: res.data.Response.TargetText
              })
            } else if (res.data.Response.Error) {
              reject(new Error(res.data.Response.Error.Message || '图片翻译失败'))
            } else {
              reject(new Error('图片翻译结果为空'))
            }
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '网络请求失败'))
        }
      })
    })
  },

  /**
   * 保存到历史记录
   */
  saveToHistory(source, target, sourceLang, targetLang) {
    const history = wx.getStorageSync('translate_history') || []
    
    // 查找源语言和目标语言名称
    const sourceLangObj = this.data.languages.find(l => l.code === sourceLang)
    const targetLangObj = this.data.targetLanguages.find(l => l.code === targetLang)
    
    const record = {
      id: Date.now(),
      source: source.substring(0, 100),
      target: target.substring(0, 100),
      sourceFull: source,
      targetFull: target,
      sourceLang: sourceLangObj ? sourceLangObj.name : sourceLang,
      targetLang: targetLangObj ? targetLangObj.name : targetLang,
      time: this.formatTime(new Date())
    }
    
    // 最多保存20条
    history.unshift(record)
    if (history.length > 20) {
      history.pop()
    }
    
    wx.setStorageSync('translate_history', history)
    this.setData({ history })
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    const history = wx.getStorageSync('translate_history') || []
    this.setData({ history })
  },

  /**
   * 点击历史记录
   */
  onHistoryTap(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      sourceText: item.sourceFull,
      targetText: item.targetFull,
      translated: true
    })
  },

  /**
   * 清空历史记录
   */
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有翻译历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('translate_history')
          this.setData({ history: [] })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },

  /**
   * 删除单条历史记录
   */
  deleteHistoryItem(e) {
    const id = e.currentTarget.dataset.id
    const history = this.data.history.filter(item => item.id !== id)
    wx.setStorageSync('translate_history', history)
    this.setData({ history })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hour}:${minute}`
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack()
  },

  onShareAppMessage() {
    return {
      title: 'Paper Geek - 翻译工具',
      path: '/packageGithub/pages/translate/translate'
    }
  }
})
