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
      description: '负责官方微信公众号(主轩次瀚)内容策划与撰写，单篇最高阅读量500+\n参与抖音账号运营，粉丝增长30%\n独立完成月度运营数据分析报告'
    },
    {
      company: '校学生会',
      position: '宣传部部长',
      time: '2022.09 - 2023.06',
      description: '统筹学生会新媒体矩阵运营\n策划并执行校园文化活动线上推广\n带领10人团队完成日常宣传工作'
    }
  ],
  selfEvaluation: '热爱新媒体行业，具备扎实的内容创作能力和数据分析思维。拥有良好的团队协作精神和沟通能力，曾在多个项目中获得导师和同事好评。对用户体验有敏锐的洞察力，追求极致的产品体验。学习能力强，能快速掌握新平台运营规则。'
}

const MODULES = [
  { key: 'basicInfo', label: '个人信息' },
  { key: 'education', label: '教育背景' },
  { key: 'skills', label: '专业技能' },
  { key: 'experience', label: '实践经历' },
  { key: 'selfEvaluation', label: '自我评价' }
]

Page({
  data: {
    resumeData: DEFAULT_RESUME_DATA,
    avatarUrl: '/resume/assets/avatar-placeholder.png',
    safeBottom: 0,
    moduleOrder: MODULES,
    moduleVisibility: {
      basicInfo: true,
      education: true,
      skills: true,
      experience: true,
      selfEvaluation: true
    },
    showProfileModal: false,
    showEduModal: false,
    showSkillsModal: false,
    showEvalModal: false,
    showModuleModal: false,
    editingEduIndex: -1,
    eduForm: { school: '', time: '', major: '', degree: '', courses: '' },
    skillsForm: { certificates: '', languages: '', office: '', professional: '' },
    evalForm: { text: '' }
  },

  onLoad() {
    this.loadFromStorage()
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ safeBottom: systemInfo.safeArea ? (systemInfo.screenHeight - systemInfo.safeArea.bottom) : 0 })
  },

  loadFromStorage() {
    try {
      const saved = wx.getStorageSync(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.resumeData) {
          this.setData({
            resumeData: parsed.resumeData,
            moduleVisibility: { ...this.data.moduleVisibility, ...(parsed.moduleVisibility || {}) },
            moduleOrder: parsed.moduleOrder || MODULES
          })
        }
      }
    } catch (e) {
      console.error('Failed to load:', e)
    }
  },

  saveToStorage() {
    try {
      const { resumeData, moduleVisibility, moduleOrder } = this.data
      wx.setStorageSync(STORAGE_KEY, JSON.stringify({
        resumeData, moduleVisibility, moduleOrder
      }))
    } catch (e) {
      console.error('Failed to save:', e)
    }
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        this.setData({ avatarUrl: res.tempFiles[0].tempFilePath })
      }
    })
  },

  editProfile() {
    this.setData({ showProfileModal: true })
  },

  closeProfileModal() {
    this.setData({ showProfileModal: false })
  },

  onProfileInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`resumeData.basicInfo.${field}`]: value })
  },

  saveProfile() {
    this.saveToStorage()
    this.setData({ showProfileModal: false })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  editSkills() {
    this.setData({
      showSkillsModal: true,
      skillsForm: {
        certificates: this.data.resumeData.skills.certificates || '',
        languages: this.data.resumeData.skills.languages || '',
        office: this.data.resumeData.skills.office || '',
        professional: this.data.resumeData.skills.professional || ''
      }
    })
  },

  closeSkillsModal() {
    this.setData({ showSkillsModal: false })
  },

  onSkillsFormInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`skillsForm.${field}`]: value })
  },

  saveSkills() {
    this.setData({
      'resumeData.skills.certificates': this.data.skillsForm.certificates,
      'resumeData.skills.languages': this.data.skillsForm.languages,
      'resumeData.skills.office': this.data.skillsForm.office,
      'resumeData.skills.professional': this.data.skillsForm.professional
    })
    this.saveToStorage()
    this.setData({ showSkillsModal: false })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  editEvaluation() {
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
    this.setData({ 'resumeData.selfEvaluation': this.data.evalForm.text })
    this.saveToStorage()
    this.setData({ showEvalModal: false })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  addEducation() {
    this.setData({
      showEduModal: true,
      editingEduIndex: -1,
      eduForm: { school: '', time: '', major: '', degree: '', courses: '' }
    })
  },

  closeEduModal() {
    this.setData({ showEduModal: false })
  },

  onEduFormInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`eduForm.${field}`]: value })
  },

  saveEdu() {
    const { editingEduIndex, eduForm, resumeData } = this.data
    const newEdu = { ...eduForm, gpa: '' }
    if (editingEduIndex >= 0) {
      const education = [...resumeData.education]
      education[editingEduIndex] = newEdu
      this.setData({ 'resumeData.education': education })
    } else {
      this.setData({ 'resumeData.education': [...resumeData.education, newEdu] })
    }
    this.saveToStorage()
    this.setData({ showEduModal: false })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  addExperience() {
    const newExp = { company: '', position: '', time: '', description: '' }
    this.setData({ 'resumeData.experience': [...this.data.resumeData.experience, newExp] })
    this.saveToStorage()
  },

  generateResume() {
    this.saveToStorage()
    wx.navigateTo({ url: '/resume/pages/preview/preview' })
  },

  moduleManage() {
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

  moveModuleUp(e) {
    const index = e.currentTarget.dataset.index
    if (index <= 0) return
    const order = [...this.data.moduleOrder]
    ;[order[index - 1], order[index]] = [order[index], order[index - 1]]
    this.setData({ moduleOrder: order })
    this.saveToStorage()
  },

  moveModuleDown(e) {
    const index = e.currentTarget.dataset.index
    if (index >= this.data.moduleOrder.length - 1) return
    const order = [...this.data.moduleOrder]
    ;[order[index], order[index + 1]] = [order[index + 1], order[index]]
    this.setData({ moduleOrder: order })
    this.saveToStorage()
  }
})
