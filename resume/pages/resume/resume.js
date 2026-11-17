const STORAGE_KEY = 'resume_data_v1'

const DEFAULT_RESUME_DATA = {
    basicInfo: {
    name: '梦言言',
    gender: '女',
    age: '27',
    location: '北京',
    intention: '世界模型',
    phone: '138-0000-0000',
    email: 'mengyanyan@online.com'
  },
  education: [
    {
      school: '地球online',
      time: '1983-9 ~ 2027-6',
      major: '行星工程',
      degree: '本科',
      courses: '睡眠科学、组织行为学、深海理论学、现代工业导论、深空工程',
      gpa: ''
    }
  ],
  skills: {
    certificates: '神经科学观察师四级、英语CET-6',
    languages: '英语CET-6，具备良好的英文读写能力',
    office: '熟练使用Word、Excel、PowerPoint等办公软件，擅长数据分析和报告撰写',
    professional: '熟悉睡眠科学，对脑科学研究有一定见解'
  },
  experience: [
    {
      company: '某互联网公司',
      position: '新媒体运营实习生',
      time: '2023.06 - 2023.09',
      description: '负责主轩次瀚公众号选题与内容发布，单篇最高阅读量 500+\n搭建周报指标看板并输出复盘报告\n参与抖音账号矩阵运营，粉丝增长 30%'
    }
  ],
  selfEvaluation: '具备较强的内容洞察能力与数据分析意识，能够在快节奏环境中独立推进项目。沟通表达清晰，执行力强，善于总结复盘并持续优化工作质量。'
}

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

const DEFAULT_VISIBILITY = {
  basicInfo: true,
  education: true,
  skills: true,
  experience: true,
  selfEvaluation: true
}

function deepClone(data) {
  return JSON.parse(JSON.stringify(data))
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

Page({
  data: {
    resumeData: deepClone(DEFAULT_RESUME_DATA),
    avatarUrl: '',
    avatarText: '许',
    safeBottom: 0,
    moduleOrder: createModuleOrder(DEFAULT_MODULE_LABELS),
    moduleLabels: { ...DEFAULT_MODULE_LABELS },
    moduleVisibility: { ...DEFAULT_VISIBILITY },
    genderOptions: ['男', '女'],
    genderIndex: 1,
    showProfileModal: false,
    showEduModal: false,
    showExpModal: false,
    showSkillsModal: false,
    showEvalModal: false,
    showModuleModal: false,
    editingEduIndex: -1,
    editingExpIndex: -1,
    profileForm: {
      name: '',
      gender: '女',
      age: '',
      location: '',
      intention: '',
      phone: '',
      email: ''
    },
    eduForm: {
      school: '',
      time: '',
      major: '',
      degree: '',
      courses: '',
      gpa: ''
    },
    expForm: {
      company: '',
      position: '',
      time: '',
      description: ''
    },
    skillsForm: {
      certificates: '',
      languages: '',
      office: '',
      professional: ''
    },
    evalForm: {
      text: ''
    }
  },

  onLoad() {
    this.loadFromStorage()
    const systemInfo = wx.getSystemInfoSync()
    const safeBottom = systemInfo.safeArea ? (systemInfo.screenHeight - systemInfo.safeArea.bottom) : 0
    this.setData({ safeBottom })
  },

  noop() {},

  syncAvatarText(name) {
    const text = name && name.trim() ? name.trim().charAt(0) : '简'
    this.setData({ avatarText: text })
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
      if (!saved) {
        this.syncAvatarText(this.data.resumeData.basicInfo.name)
        return
      }

      const parsed = JSON.parse(saved)
      const resumeData = parsed.resumeData || deepClone(DEFAULT_RESUME_DATA)
      const moduleVisibility = { ...DEFAULT_VISIBILITY, ...(parsed.moduleVisibility || {}) }
      const { moduleOrder, moduleLabels } = this.normalizeModuleConfig(parsed.moduleOrder, parsed.moduleLabels)
      const avatarUrl = parsed.avatarUrl || ''
      const gender = resumeData.basicInfo?.gender || '女'

      this.setData({
        resumeData,
        moduleVisibility,
        moduleOrder,
        moduleLabels,
        avatarUrl,
        genderIndex: gender === '男' ? 0 : 1
      })
      this.syncAvatarText(resumeData.basicInfo?.name || '')
    } catch (e) {
      console.error('load storage failed:', e)
      this.syncAvatarText(this.data.resumeData.basicInfo.name)
    }
  },

  saveToStorage() {
    try {
      const { resumeData, moduleVisibility, moduleOrder, moduleLabels, avatarUrl } = this.data
      const oldRaw = wx.getStorageSync(STORAGE_KEY)
      const oldData = oldRaw ? JSON.parse(oldRaw) : {}

      wx.setStorageSync(STORAGE_KEY, JSON.stringify({
        ...oldData,
        resumeData,
        moduleVisibility,
        moduleOrder,
        moduleLabels,
        avatarUrl
      }))
    } catch (e) {
      console.error('save storage failed:', e)
    }
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        const tempFilePath = res.tempFiles?.[0]?.tempFilePath
        if (!tempFilePath) return
        this.setData({ avatarUrl: tempFilePath })
        this.saveToStorage()
      }
    })
  },

  openProfileModal() {
    const basicInfo = this.data.resumeData.basicInfo || {}
    this.setData({
      showProfileModal: true,
      profileForm: {
        name: basicInfo.name || '',
        gender: basicInfo.gender || '女',
        age: basicInfo.age || '',
        location: basicInfo.location || '',
        intention: basicInfo.intention || '',
        phone: basicInfo.phone || '',
        email: basicInfo.email || ''
      },
      genderIndex: basicInfo.gender === '男' ? 0 : 1
    })
  },

  closeProfileModal() {
    this.setData({ showProfileModal: false })
  },

  onProfileInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`profileForm.${field}`]: e.detail.value })
  },

  onGenderChange(e) {
    const genderIndex = Number(e.detail.value)
    const gender = this.data.genderOptions[genderIndex]
    this.setData({
      genderIndex,
      'profileForm.gender': gender
    })
  },

  saveProfile() {
    const basicInfo = { ...this.data.profileForm }
    this.setData({
      'resumeData.basicInfo': basicInfo,
      showProfileModal: false
    })
    this.syncAvatarText(basicInfo.name)
    this.saveToStorage()
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  addEducation() {
    this.setData({
      showEduModal: true,
      editingEduIndex: -1,
      eduForm: {
        school: '',
        time: '',
        major: '',
        degree: '',
        courses: '',
        gpa: ''
      }
    })
  },

  editEducation(e) {
    const index = Number(e.currentTarget.dataset.index)
    const target = this.data.resumeData.education[index]
    if (!target) return
    this.setData({
      showEduModal: true,
      editingEduIndex: index,
      eduForm: {
        school: target.school || '',
        time: target.time || '',
        major: target.major || '',
        degree: target.degree || '',
        courses: target.courses || '',
        gpa: target.gpa || ''
      }
    })
  },

  closeEduModal() {
    this.setData({ showEduModal: false })
  },

  onEduFormInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`eduForm.${field}`]: e.detail.value })
  },

  saveEdu() {
    const eduForm = { ...this.data.eduForm }
    if (!eduForm.school || !eduForm.time) {
      wx.showToast({ title: '请至少填写学校和时间', icon: 'none' })
      return
    }

    const education = [...(this.data.resumeData.education || [])]
    if (this.data.editingEduIndex >= 0) {
      education[this.data.editingEduIndex] = eduForm
    } else {
      education.push(eduForm)
    }

    this.setData({
      'resumeData.education': education,
      showEduModal: false
    })
    this.saveToStorage()
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  deleteEducation(e) {
    const index = Number(e.currentTarget.dataset.index)
    wx.showModal({
      title: '删除确认',
      content: '确定删除这条教育经历吗？',
      success: (res) => {
        if (!res.confirm) return
        const education = this.data.resumeData.education.filter((_, i) => i !== index)
        this.setData({ 'resumeData.education': education })
        this.saveToStorage()
      }
    })
  },

  addExperience() {
    this.setData({
      showExpModal: true,
      editingExpIndex: -1,
      expForm: {
        company: '',
        position: '',
        time: '',
        description: ''
      }
    })
  },

  editExperience(e) {
    const index = Number(e.currentTarget.dataset.index)
    const target = this.data.resumeData.experience[index]
    if (!target) return
    this.setData({
      showExpModal: true,
      editingExpIndex: index,
      expForm: {
        company: target.company || '',
        position: target.position || '',
        time: target.time || '',
        description: target.description || ''
      }
    })
  },

  closeExpModal() {
    this.setData({ showExpModal: false })
  },

  onExpFormInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`expForm.${field}`]: e.detail.value })
  },

  saveExp() {
    const expForm = { ...this.data.expForm }
    if (!expForm.company || !expForm.time) {
      wx.showToast({ title: '请至少填写单位和时间', icon: 'none' })
      return
    }

    const experience = [...(this.data.resumeData.experience || [])]
    if (this.data.editingExpIndex >= 0) {
      experience[this.data.editingExpIndex] = expForm
    } else {
      experience.push(expForm)
    }

    this.setData({
      'resumeData.experience': experience,
      showExpModal: false
    })
    this.saveToStorage()
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  deleteExperience(e) {
    const index = Number(e.currentTarget.dataset.index)
    wx.showModal({
      title: '删除确认',
      content: '确定删除这条实践经历吗？',
      success: (res) => {
        if (!res.confirm) return
        const experience = this.data.resumeData.experience.filter((_, i) => i !== index)
        this.setData({ 'resumeData.experience': experience })
        this.saveToStorage()
      }
    })
  },

  openSkillsModal() {
    const skills = this.data.resumeData.skills || {}
    this.setData({
      showSkillsModal: true,
      skillsForm: {
        certificates: skills.certificates || '',
        languages: skills.languages || '',
        office: skills.office || '',
        professional: skills.professional || ''
      }
    })
  },

  closeSkillsModal() {
    this.setData({ showSkillsModal: false })
  },

  onSkillsFormInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`skillsForm.${field}`]: e.detail.value })
  },

  saveSkills() {
    this.setData({
      'resumeData.skills': { ...this.data.skillsForm },
      showSkillsModal: false
    })
    this.saveToStorage()
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  openEvalModal() {
    this.setData({
      showEvalModal: true,
      evalForm: { text: this.data.resumeData.selfEvaluation || '' }
    })
  },

  closeEvalModal() {
    this.setData({ showEvalModal: false })
  },

  onEvalFormInput(e) {
    this.setData({ 'evalForm.text': e.detail.value })
  },

  saveEval() {
    this.setData({
      'resumeData.selfEvaluation': this.data.evalForm.text,
      showEvalModal: false
    })
    this.saveToStorage()
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  openModuleModal() {
    this.setData({ showModuleModal: true })
  },

  closeModuleModal() {
    this.setData({ showModuleModal: false })
  },

  toggleModuleVisibility(e) {
    const key = e.currentTarget.dataset.key
    const visibility = { ...this.data.moduleVisibility }
    visibility[key] = !visibility[key]
    this.setData({ moduleVisibility: visibility })
    this.saveToStorage()
  },

  onModuleLabelInput(e) {
    const key = e.currentTarget.dataset.key
    const rawValue = e.detail.value
    const defaultLabel = DEFAULT_MODULE_LABELS[key] || '模块'
    const moduleLabels = { ...this.data.moduleLabels, [key]: sanitizeModuleLabel(rawValue, defaultLabel) }
    const moduleOrder = this.data.moduleOrder.map(item => {
      if (item.key !== key) return item
      return { ...item, label: moduleLabels[key] }
    })
    this.setData({ moduleLabels, moduleOrder })
  },

  onModuleLabelBlur() {
    this.saveToStorage()
  },

  resetModuleLabels() {
    const moduleLabels = { ...DEFAULT_MODULE_LABELS }
    const moduleOrder = createModuleOrder(moduleLabels)
    this.setData({ moduleLabels, moduleOrder })
    this.saveToStorage()
    wx.showToast({ title: '已恢复默认模块名', icon: 'success' })
  },

  moveModuleUp(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (index <= 0) return
    const order = [...this.data.moduleOrder]
    ;[order[index - 1], order[index]] = [order[index], order[index - 1]]
    this.setData({ moduleOrder: order })
    this.saveToStorage()
  },

  moveModuleDown(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (index >= this.data.moduleOrder.length - 1) return
    const order = [...this.data.moduleOrder]
    ;[order[index], order[index + 1]] = [order[index + 1], order[index]]
    this.setData({ moduleOrder: order })
    this.saveToStorage()
  },

  exportJSON() {
    try {
      const raw = wx.getStorageSync(STORAGE_KEY)
      const fallback = {
        resumeData: this.data.resumeData,
        moduleVisibility: this.data.moduleVisibility,
        moduleOrder: this.data.moduleOrder,
        moduleLabels: this.data.moduleLabels,
        avatarUrl: this.data.avatarUrl
      }
      const data = raw ? JSON.parse(raw) : fallback

      const fs = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/${this.data.resumeData.basicInfo.name || 'resume'}_简历.json`
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
      wx.showToast({ title: '已导出到本地', icon: 'success' })
    } catch (e) {
      console.error('export failed:', e)
      wx.showToast({ title: '导出失败', icon: 'none' })
    }
  },

  importJSON() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json'],
      success: (res) => {
        const filePath = res.tempFiles?.[0]?.path
        if (!filePath) return
        try {
          const fs = wx.getFileSystemManager()
          const data = fs.readFileSync(filePath, 'utf8')
          const parsed = JSON.parse(data)
          if (!parsed.resumeData) {
            wx.showToast({ title: '文件格式不正确', icon: 'none' })
            return
          }

          const resumeData = parsed.resumeData
          const moduleVisibility = { ...DEFAULT_VISIBILITY, ...(parsed.moduleVisibility || {}) }
          const { moduleOrder, moduleLabels } = this.normalizeModuleConfig(parsed.moduleOrder, parsed.moduleLabels)

          this.setData({
            resumeData,
            moduleVisibility,
            moduleOrder,
            moduleLabels,
            avatarUrl: parsed.avatarUrl || '',
            genderIndex: resumeData.basicInfo?.gender === '男' ? 0 : 1
          })
          this.syncAvatarText(resumeData.basicInfo?.name)
          this.saveToStorage()
          wx.showToast({ title: '导入成功', icon: 'success' })
        } catch (e) {
          console.error('import failed:', e)
          wx.showToast({ title: '导入失败', icon: 'none' })
        }
      }
    })
  },

  resetData() {
    wx.showModal({
      title: '重置简历',
      content: '确定重置为示例数据吗？当前编辑内容会被覆盖。',
      success: (res) => {
        if (!res.confirm) return
        const basicInfo = deepClone(DEFAULT_RESUME_DATA.basicInfo)
        this.setData({
          resumeData: deepClone(DEFAULT_RESUME_DATA),
          avatarUrl: '',
          avatarText: basicInfo.name.charAt(0),
          moduleOrder: createModuleOrder(DEFAULT_MODULE_LABELS),
          moduleLabels: { ...DEFAULT_MODULE_LABELS },
          moduleVisibility: { ...DEFAULT_VISIBILITY },
          genderIndex: basicInfo.gender === '男' ? 0 : 1
        })
        this.saveToStorage()
        wx.showToast({ title: '已重置', icon: 'success' })
      }
    })
  },

  generateResume() {
    this.saveToStorage()
    wx.navigateTo({ url: '/resume/pages/preview/preview' })
  }
})