// import { PDFDocument } from '/utils/pdf-lib.min.js'
import { PDFDocument } from '../../utils/pdf-lib.min.js'; // 确保路径正确

const STORAGE_KEY = 'resume_data_v1'
const fs = wx.getFileSystemManager()

const MODULES = [
  { key: 'basicInfo', label: '个人信息' },
  { key: 'education', label: '教育背景' },
  { key: 'skills', label: '专业技能' },
  { key: 'experience', label: '社会实践' },
  { key: 'selfEvaluation', label: '自我评价' }
]

const DEFAULT_MODULE_LABELS = MODULES.reduce((acc, item) => {
  acc[item.key] = item.label
  return acc
}, {})

const THEMES = [
  { name: 'classic', class: 'theme-classic', label: '经典', color: '#1f3773' },
  { name: 'minimal', class: 'theme-minimal', label: '简约', color: '#2f2f2f' },
  { name: 'warm', class: 'theme-warm', label: '温暖', color: '#be5d43' },
  { name: 'green', class: 'theme-green', label: '清新', color: '#2d6a4f' }
]

const FONT_MAP = {
  '系统默认': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '微软雅黑': '"Microsoft YaHei", sans-serif',
  '黑体': 'SimHei, sans-serif'
}

const DEFAULT_RESUME_DATA = {
  basicInfo: {
    name: '许言言',
    gender: '女',
    age: '22',
    location: '北京',
    intention: '新媒体运营',
    phone: '138-0000-0000',
    email: 'xuyanyan@example.com'
  },
  education: [],
  skills: {
    certificates: '',
    languages: '',
    office: '',
    professional: ''
  },
  experience: [],
  selfEvaluation: ''
}

const DEFAULT_VISIBILITY = {
  basicInfo: true,
  education: true,
  skills: true,
  experience: true,
  selfEvaluation: true
}

function sanitizeModuleLabel(label, fallback) {
  const trimmed = (label || '').trim()
  if (!trimmed) return fallback
  return trimmed.slice(0, 12)
}

function createModuleOrder(labels = DEFAULT_MODULE_LABELS) {
  return MODULES.map(item => ({
    key: item.key,
    label: sanitizeModuleLabel(labels[item.key], item.label)
  }))
}

function wrapTextLines(ctx, text, maxWidth) {
  const segments = String(text || '').replace(/\r/g, '').split('\n')
  const lines = []
  segments.forEach(segment => {
    if (!segment) {
      lines.push('')
      return
    }
    let line = ''
    for (const ch of segment) {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = ch
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
  })
  return lines
}

Page({
  data: {
    resumeData: DEFAULT_RESUME_DATA,
    avatarUrl: '',
    avatarText: '许',
    themeIndex: 0,
    themeClass: 'theme-classic',
    fontFamily: FONT_MAP['系统默认'],
    moduleOrder: createModuleOrder(DEFAULT_MODULE_LABELS),
    moduleVisibility: { ...DEFAULT_VISIBILITY },
    moduleSpacing: 30,
    lineSpacing: 1.6,
    showSpacingModal: false,
    safeBottom: 0,
    isExportingPdf: false
  },

  onLoad() {
    this.loadFromStorage()
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ safeBottom: systemInfo.safeArea ? (systemInfo.screenHeight - systemInfo.safeArea.bottom) : 0 })
  },

  normalizeModuleConfig(order, labels) {
    const normalizedLabels = { ...DEFAULT_MODULE_LABELS, ...(labels || {}) }
    const result = []
    const known = new Set(MODULES.map(item => item.key))
    const used = new Set()

    if (Array.isArray(order)) {
      order.forEach(item => {
        if (!item || !known.has(item.key) || used.has(item.key)) return
        const defaultLabel = DEFAULT_MODULE_LABELS[item.key]
        const mergedLabel = sanitizeModuleLabel(item.label || normalizedLabels[item.key], defaultLabel)
        normalizedLabels[item.key] = mergedLabel
        result.push({ key: item.key, label: mergedLabel })
        used.add(item.key)
      })
    }

    MODULES.forEach(item => {
      if (used.has(item.key)) return
      normalizedLabels[item.key] = sanitizeModuleLabel(normalizedLabels[item.key], item.label)
      result.push({ key: item.key, label: normalizedLabels[item.key] })
    })

    return { moduleOrder: result, moduleLabels: normalizedLabels }
  },

  loadFromStorage() {
    try {
      const saved = wx.getStorageSync(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (!parsed.resumeData) return

      const themeIndex = Math.min(parsed.themeIndex ?? 0, THEMES.length - 1)
      const fontIndex = parsed.fontIndex ?? 0
      const fontName = Object.keys(FONT_MAP)[fontIndex] || '系统默认'
      const name = parsed.resumeData.basicInfo?.name || '简'
      const { moduleOrder } = this.normalizeModuleConfig(parsed.moduleOrder, parsed.moduleLabels)

      this.setData({
        resumeData: parsed.resumeData,
        avatarUrl: parsed.avatarUrl || '',
        avatarText: name.trim().charAt(0),
        moduleOrder,
        moduleVisibility: { ...DEFAULT_VISIBILITY, ...(parsed.moduleVisibility || {}) },
        themeIndex,
        themeClass: THEMES[themeIndex].class,
        fontFamily: FONT_MAP[fontName] || FONT_MAP['系统默认'],
        moduleSpacing: parsed.moduleSpacing ?? 30,
        lineSpacing: parsed.lineSpacing ?? 1.6
      })
    } catch (e) {
      console.error('Failed to load:', e)
    }
  },

  selectTheme(e) {
    const index = Number(e.currentTarget.dataset.index)
    const theme = THEMES[index]
    this.setData({ themeIndex: index, themeClass: theme.class })
    this.saveVisualSettings({ themeIndex: index })
  },

  editContent() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.navigateTo({ url: '/resume/pages/resume/resume' })
    }
  },

  changeTheme() {
    wx.showToast({ title: '请在下方选择模板', icon: 'none' })
  },

  adjustSpacing() {
    this.setData({ showSpacingModal: true })
  },

  closeSpacingModal() {
    this.setData({ showSpacingModal: false })
  },

  onModuleSpacingChanging(e) {
    this.setData({ moduleSpacing: e.detail.value })
  },

  onModuleSpacingChange(e) {
    this.setData({ moduleSpacing: e.detail.value })
    this.saveVisualSettings({ moduleSpacing: e.detail.value })
  },

  onLineSpacingChanging(e) {
    this.setData({ lineSpacing: e.detail.value })
  },

  onLineSpacingChange(e) {
    this.setData({ lineSpacing: e.detail.value })
    this.saveVisualSettings({ lineSpacing: e.detail.value })
  },

  async getPdfCanvasNode() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#pdfCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          reject(new Error('未找到 PDF 画布节点'))
          return
        }
        resolve(res[0].node)
      })
    })
  },

  async canvasToTempFile(canvas, width, height) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas,
        destWidth: width,
        destHeight: height,
        fileType: 'png',
        success: (res) => resolve(res.tempFilePath),
        fail: (err) => reject(err)
      })
    })
  },

  drawImageAspectFill(ctx, img, x, y, targetW, targetH) {
    const srcW = img.width || targetW
    const srcH = img.height || targetH
    const srcRatio = srcW / srcH
    const targetRatio = targetW / targetH

    let sx = 0
    let sy = 0
    let sw = srcW
    let sh = srcH

    if (srcRatio > targetRatio) {
      sw = srcH * targetRatio
      sx = (srcW - sw) / 2
    } else {
      sh = srcW / targetRatio
      sy = (srcH - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, targetW, targetH)
  },

  buildPdfPages(ctx, pageWidth, pageHeight) {
    const themeColor = THEMES[this.data.themeIndex]?.color || '#1f3773'
    const marginX = 84
    const marginY = 92
    const usableWidth = pageWidth - marginX * 2
    const bottomLimit = pageHeight - marginY
    const pages = [{ items: [] }]
    let currentPage = pages[0]
    let y = marginY

    const lineHeightRatio = this.data.lineSpacing || 1.6

    const pushPageFrame = () => {
      currentPage.items.push({ type: 'bar', x: marginX, y: marginY - 24, width: usableWidth * 0.45, height: 10, color: themeColor })
      currentPage.items.push({ type: 'strokeRect', x: marginX - 18, y: marginY - 30, width: usableWidth + 36, height: pageHeight - marginY * 2 + 24, color: '#dfe5f0' })
    }

    pushPageFrame()

    const ensureSpace = (space) => {
      if (y + space <= bottomLimit) return
      currentPage = { items: [] }
      pages.push(currentPage)
      y = marginY
      pushPageFrame()
    }

    const pushTextBlock = (text, options = {}) => {
      if (!text) return
      const {
        size = 28,
        weight = 'normal',
        color = '#38445f',
        lineHeight = Math.round(size * lineHeightRatio),
        indent = 0,
        maxWidth = usableWidth - indent,
        bullet = false
      } = options
      ctx.font = `${weight} ${size}px sans-serif`
      const lines = wrapTextLines(ctx, text, maxWidth - (bullet ? 24 : 0))
      lines.forEach((line, idx) => {
        ensureSpace(lineHeight)
        currentPage.items.push({
          type: 'text',
          text: `${bullet && idx === 0 ? '• ' : ''}${line}`,
          x: marginX + indent,
          y,
          font: `${weight} ${size}px sans-serif`,
          color,
          align: 'left'
        })
        y += lineHeight
      })
    }

    const pushPairLine = (leftText, rightText, options = {}) => {
      const {
        leftFont = '600 32px sans-serif',
        leftColor = '#2a3350',
        rightFont = '600 26px sans-serif',
        rightColor = '#8a95af',
        lineHeight = 44
      } = options
      ensureSpace(lineHeight)
      if (leftText) {
        currentPage.items.push({
          type: 'text',
          text: leftText,
          x: marginX,
          y,
          font: leftFont,
          color: leftColor,
          align: 'left'
        })
      }
      if (rightText) {
        currentPage.items.push({
          type: 'text',
          text: rightText,
          x: marginX + usableWidth,
          y,
          font: rightFont,
          color: rightColor,
          align: 'right'
        })
      }
      y += lineHeight
    }

    const pushSectionTitle = (title) => {
      ensureSpace(52)
      currentPage.items.push({ type: 'bar', x: marginX, y: y + 5, width: 7, height: 34, color: themeColor })
      currentPage.items.push({
        type: 'text',
        text: title,
        x: marginX + 18,
        y,
        font: '700 34px sans-serif',
        color: '#1f2738',
        align: 'left'
      })
      y += 48
      ensureSpace(12)
      currentPage.items.push({ type: 'line', x: marginX, y: y, width: usableWidth, color: '#e7ebf4' })
      y += 14
    }

    const basicInfo = this.data.resumeData.basicInfo || {}
    const hasAvatar = !!this.data.avatarUrl

    ensureSpace(178)
    currentPage.items.push({
      type: 'text',
      text: basicInfo.name || '未命名简历',
      x: marginX,
      y,
      font: '700 62px sans-serif',
      color: '#1f2738',
      align: 'left'
    })
    if (hasAvatar) {
      currentPage.items.push({ type: 'avatar', x: marginX + usableWidth - 126, y: y + 2, width: 112, height: 140 })
    } else {
      currentPage.items.push({ type: 'avatarPlaceholder', x: marginX + usableWidth - 126, y: y + 2, width: 112, height: 140, text: this.data.avatarText || '简' })
    }
    y += 70

    pushTextBlock(basicInfo.intention || '', { size: 34, weight: '500', lineHeight: 44, color: '#5c6785' })
    const meta = [basicInfo.gender ? `${basicInfo.gender}` : '', basicInfo.age ? `年龄 ${basicInfo.age}岁` : '', basicInfo.location ? `城市 ${basicInfo.location}` : ''].filter(Boolean).join(' | ')
    pushTextBlock(meta, { size: 24, color: '#7f8aa6', lineHeight: 34 })
    const contact = [basicInfo.phone ? `电话 ${basicInfo.phone}` : '', basicInfo.email ? `邮箱 ${basicInfo.email}` : ''].filter(Boolean).join(' | ')
    pushTextBlock(contact, { size: 24, color: '#7f8aa6', lineHeight: 34 })

    ensureSpace(14)
    currentPage.items.push({ type: 'line', x: marginX, y: y + 4, width: usableWidth, color: '#e2e7f1' })
    y += 22

    this.data.moduleOrder.forEach(item => {
      if (!this.data.moduleVisibility[item.key]) return

      if (item.key === 'education') {
        const education = this.data.resumeData.education || []
        if (!education.length) return
        pushSectionTitle(item.label)
        education.forEach((edu, index) => {
          pushPairLine(edu.school || '', edu.time || '', { lineHeight: 42 })
          pushTextBlock([edu.major, edu.degree].filter(Boolean).join(' | '), { size: 25, lineHeight: 34, color: '#65708c' })
          if (edu.courses) pushTextBlock(`主修课程：${edu.courses}`, { size: 23, lineHeight: 34, color: '#6d7691' })
          if (edu.gpa) pushTextBlock(`GPA：${edu.gpa}`, { size: 23, lineHeight: 34, color: '#6d7691' })
          if (index < education.length - 1) y += 8
        })
        y += this.data.moduleSpacing
      }

      if (item.key === 'skills') {
        const skills = this.data.resumeData.skills || {}
        const lines = [
          skills.certificates ? `获得证书：${skills.certificates}` : '',
          skills.languages ? `语言能力：${skills.languages}` : '',
          skills.office ? `办公技能：${skills.office}` : '',
          skills.professional ? `专业技能：${skills.professional}` : ''
        ].filter(Boolean)
        if (!lines.length) return
        pushSectionTitle(item.label)
        lines.forEach(line => {
          pushTextBlock(line, { size: 24, lineHeight: 34, color: '#65708c', bullet: true })
        })
        y += this.data.moduleSpacing
      }

      if (item.key === 'experience') {
        const experience = this.data.resumeData.experience || []
        if (!experience.length) return
        pushSectionTitle(item.label)
        experience.forEach((exp, index) => {
          pushPairLine(exp.company || '', exp.time || '', { lineHeight: 42 })
          if (exp.position) pushTextBlock(exp.position, { size: 25, lineHeight: 34, color: '#65708c' })
          if (exp.description) {
            exp.description.split('\n').forEach(row => {
              if (row.trim()) pushTextBlock(row.trim(), { size: 23, lineHeight: 33, color: '#6d7691', bullet: true })
            })
          }
          if (index < experience.length - 1) y += 8
        })
        y += this.data.moduleSpacing
      }

      if (item.key === 'selfEvaluation') {
        const evaluation = this.data.resumeData.selfEvaluation || ''
        if (!evaluation.trim()) return
        pushSectionTitle(item.label)
        pushTextBlock(evaluation, {
          size: 24,
          lineHeight: Math.round(24 * lineHeightRatio + 8),
          color: '#65708c'
        })
        y += this.data.moduleSpacing
      }
    })

    return pages
  },

  renderPdfPage(ctx, page, width, height, avatarImage) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.textBaseline = 'top'

    page.items.forEach(item => {
      if (item.type === 'text') {
        ctx.font = item.font
        ctx.fillStyle = item.color
        if (item.align === 'right') {
          const textWidth = ctx.measureText(item.text).width
          ctx.fillText(item.text, item.x - textWidth, item.y)
        } else {
          ctx.fillText(item.text, item.x, item.y)
        }
      }

      if (item.type === 'bar') {
        ctx.fillStyle = item.color
        ctx.fillRect(item.x, item.y, item.width, item.height)
      }

      if (item.type === 'line') {
        ctx.fillStyle = item.color
        ctx.fillRect(item.x, item.y, item.width, 2)
      }

      if (item.type === 'strokeRect') {
        ctx.strokeStyle = item.color
        ctx.lineWidth = 2
        ctx.strokeRect(item.x, item.y, item.width, item.height)
      }

      if (item.type === 'avatar' && avatarImage) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(item.x, item.y, item.width, item.height)
        ctx.clip()
        this.drawImageAspectFill(ctx, avatarImage, item.x, item.y, item.width, item.height)
        ctx.restore()
        ctx.strokeStyle = '#d7dfed'
        ctx.lineWidth = 2
        ctx.strokeRect(item.x, item.y, item.width, item.height)
      }

      if (item.type === 'avatarPlaceholder') {
        ctx.fillStyle = '#f1f4fa'
        ctx.fillRect(item.x, item.y, item.width, item.height)
        ctx.strokeStyle = '#d7dfed'
        ctx.lineWidth = 2
        ctx.strokeRect(item.x, item.y, item.width, item.height)
        ctx.font = '700 52px sans-serif'
        ctx.fillStyle = '#42557f'
        const tw = ctx.measureText(item.text).width
        ctx.fillText(item.text, item.x + (item.width - tw) / 2, item.y + (item.height - 66) / 2)
      }
    })
  },

  async loadAvatarImage(canvas) {
    const src = this.data.avatarUrl
    if (!src) return null
    return new Promise((resolve) => {
      const image = canvas.createImage()
      image.onload = () => resolve(image)
      image.onerror = () => resolve(null)
      image.src = src
    })
  },

  async createResumePdfFile() {
    const canvas = await this.getPdfCanvasNode()
    const ctx = canvas.getContext('2d')
    const pageWidth = 1240
    const pageHeight = 1754
    canvas.width = pageWidth
    canvas.height = pageHeight

    const pages = this.buildPdfPages(ctx, pageWidth, pageHeight)
    const pdfDoc = await PDFDocument.create()
    const avatarImage = await this.loadAvatarImage(canvas)

    for (let i = 0; i < pages.length; i++) {
      this.renderPdfPage(ctx, pages[i], pageWidth, pageHeight, avatarImage)
      const imagePath = await this.canvasToTempFile(canvas, pageWidth, pageHeight)
      const imageBase64 = fs.readFileSync(imagePath, 'base64')
      const pdfImage = await pdfDoc.embedPng(imageBase64)

      const page = pdfDoc.addPage([595.28, 841.89])
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89
      })
    }

    const pdfBase64Data = await pdfDoc.saveAsBase64()
    const name = this.data.resumeData.basicInfo?.name || '简历'
    const safeName = String(name).replace(/[\\/:*?"<>|]/g, '_')
    const filePath = `${wx.env.USER_DATA_PATH}/${safeName}_简历_${Date.now()}.pdf`
    fs.writeFileSync(filePath, pdfBase64Data, 'base64')
    return filePath
  },

  async downloadResume() {
    if (this.data.isExportingPdf) return
    this.setData({ isExportingPdf: true })
    wx.showLoading({ title: '生成PDF中...', mask: true })

    try {
      const filePath = await this.createResumePdfFile()
      this.setData({ isExportingPdf: false })
      wx.hideLoading()
      wx.openDocument({
        filePath,
        fileType: 'pdf',
        showMenu: true,
        fail: () => {
          wx.showToast({ title: 'PDF打开失败', icon: 'none' })
        }
      })
    } catch (e) {
      console.error('pdf export failed:', e)
      this.setData({ isExportingPdf: false })
      wx.hideLoading()
      wx.showToast({ title: 'PDF生成失败', icon: 'none' })
    }
  },

  saveVisualSettings(partial = {}) {
    try {
      const saved = wx.getStorageSync(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : { resumeData: this.data.resumeData }
      wx.setStorageSync(STORAGE_KEY, JSON.stringify({
        ...parsed,
        ...partial
      }))
    } catch (e) {
      console.error('Failed to save visual settings:', e)
    }
  },

  noop() {}
})
