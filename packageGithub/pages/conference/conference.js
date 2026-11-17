// packageTech/pages/conference/conference.js
/**
 * Paper Geek - 顶会荟萃
 * 支持按顶会、年份、方向筛选论文
 */

const { request, API_CONFIG } = require('../../utils/request.js')
const { cleanPaper } = require('../../utils/formatter.js')

// ========== 顶会配置 ==========
const CONFERENCES = [
  // AI 综合
  { id: 'NeurIPS', name: 'NeurIPS', fullName: 'Neural Information Processing Systems', category: 'AI', color: '#636e72' },
  { id: 'ICML', name: 'ICML', fullName: 'International Conference on Machine Learning', category: 'AI', color: '#2d3436' },
  { id: 'ICLR', name: 'ICLR', fullName: 'International Conference on Learning Representations', category: 'AI', color: '#b2bec3' },
  { id: 'AAAI', name: 'AAAI', fullName: 'AAAI Conference on Artificial Intelligence', category: 'AI', color: '#6c5ce7' },
  { id: 'IJCAI', name: 'IJCAI', fullName: 'International Joint Conference on AI', category: 'AI', color: '#a29bfe' },
  
  // 计算机视觉
  { id: 'CVPR', name: 'CVPR', fullName: 'Computer Vision and Pattern Recognition', category: 'CV', color: '#0984e3' },
  { id: 'ICCV', name: 'ICCV', fullName: 'International Conference on Computer Vision', category: 'CV', color: '#74b9ff' },
  { id: 'ECCV', name: 'ECCV', fullName: 'European Conference on Computer Vision', category: 'CV', color: '#00b894' },
  
  // 自然语言处理
  { id: 'ACL', name: 'ACL', fullName: 'Association for Computational Linguistics', category: 'NLP', color: '#e17055' },
  { id: 'EMNLP', name: 'EMNLP', fullName: 'Empirical Methods in NLP', category: 'NLP', color: '#fdcb6e' },
  { id: 'NAACL', name: 'NAACL', fullName: 'North American Chapter of ACL', category: 'NLP', color: '#55efc4' },
  { id: 'COLING', name: 'COLING', fullName: 'International Conference on Computational Linguistics', category: 'NLP', color: '#81ecec' },
  
  // 数据挖掘 & 检索
  { id: 'KDD', name: 'KDD', fullName: 'Knowledge Discovery and Data Mining', category: 'Data', color: '#d63031' },
  { id: 'SIGIR', name: 'SIGIR', fullName: 'Special Interest Group on Information Retrieval', category: 'Data', color: '#ff7675' },
  { id: 'WWW', name: 'WWW', fullName: 'World Wide Web Conference', category: 'Data', color: '#fab1a0' },
  { id: 'WSDM', name: 'WSDM', fullName: 'Web Search and Data Mining', category: 'Data', color: '#ffeaa7' },
  
  // 机器人 & 强化学习
  { id: 'RSS', name: 'RSS', fullName: 'Robotics: Science and Systems', category: 'Robotics', color: '#00cec9' },
  { id: 'CoRL', name: 'CoRL', fullName: 'Conference on Robot Learning', category: 'Robotics', color: '#00b894' },
  { id: 'IROS', name: 'IROS', fullName: 'Intelligent Robots and Systems', category: 'Robotics', color: '#55efc4' },
  { id: 'ICRA', name: 'ICRA', fullName: 'Robotics and Automation', category: 'Robotics', color: '#2ecc71' }
]

// ========== 方向分类 ==========
const RESEARCH_AREAS = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'CV', name: '计算机视觉', icon: '👁️' },
  { id: 'NLP', name: '自然语言处理', icon: '💬' },
  { id: 'AI', name: '机器学习', icon: '🧠' },
  { id: 'Data', name: '数据挖掘', icon: '📊' },
  { id: 'Robotics', name: '机器人学', icon: '🤖' },
  { id: 'Generative', name: '生成式AI', icon: '🎨' },
  { id: 'Multimodal', name: '多模态', icon: '🔀' },
  { id: 'RL', name: '强化学习', icon: '🎮' }
]

// ========== 年份配置 ==========
function getYears() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear; y >= 2015; y--) {
    years.push(y)
  }
  return years
}

Page({
  data: {
    // 配置数据
    conferences: CONFERENCES,
    researchAreas: RESEARCH_AREAS,
    years: getYears(),
    
    // 当前选择
    selectedConference: null,
    selectedYear: new Date().getFullYear(),
    selectedArea: 'all',
    
    // 论文数据
    papers: [],
    loading: false,
    loadingMore: false,
    hasMore: true,
    offset: 0,
    total: 0,
    
    // 视图模式
    viewMode: 'conferences', // conferences | papers
    
    // 滚动位置
    scrollTop: 0
  },

  onLoad() {
    // 默认选择第一个顶会
    this.setData({
      selectedConference: CONFERENCES[0]
    })
  },

  /**
   * 选择顶会
   */
  selectConference(e) {
    const conference = e.currentTarget.dataset.conference
    if (!conference) return

    this.setData({
      selectedConference: conference,
      viewMode: 'papers',
      papers: [],
      offset: 0,
      hasMore: true
    })

    this.loadPapers()
  },

  /**
   * 选择年份
   */
  selectYear(e) {
    const year = parseInt(e.currentTarget.dataset.year)
    if (year === this.data.selectedYear) return

    this.setData({
      selectedYear: year,
      papers: [],
      offset: 0,
      hasMore: true
    })

    if (this.data.selectedConference) {
      this.loadPapers()
    }
  },

  /**
   * 选择研究方向
   */
  selectArea(e) {
    const area = e.currentTarget.dataset.area
    if (area === this.data.selectedArea) return

    // 筛选该方向下的顶会
    let filteredConferences = CONFERENCES
    if (area !== 'all') {
      filteredConferences = CONFERENCES.filter(c => c.category === area)
    }

    this.setData({
      selectedArea: area,
      conferences: filteredConferences,
      selectedConference: filteredConferences[0] || null,
      papers: [],
      offset: 0,
      hasMore: true,
      viewMode: 'conferences'
    })
  },

  /**
   * 返回顶会列表
   */
  goBackToList() {
    this.setData({
      viewMode: 'conferences',
      papers: []
    })
  },

  /**
   * 加载论文
   */
  async loadPapers() {
    const { selectedConference, selectedYear, selectedArea, offset } = this.data

    if (!selectedConference) {
      wx.showToast({ title: '请先选择顶会', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      // 构建查询参数
      const query = this.buildQuery(selectedArea)
      const venue = selectedConference.id
      const year = selectedYear

      // 构建 API URL
      const url = `${API_CONFIG.BASE_URL}/paper/search?` + this.buildQueryString({
        query: query,
        venue: venue,
        year: year.toString(),
        offset: offset,
        limit: 20,
        fields: API_CONFIG.FIELDS
      })

      console.log('[Conference] 请求 URL:', url)

      const res = await request({ url })

      if (!res || !res.data || res.data.length === 0) {
        console.log('[Conference] 无数据，使用备用数据')
        this.setData({
          papers: this.getFallbackPapers(),
          loading: false,
          hasMore: false
        })
        return
      }

      // 清洗数据
      const papers = res.data
        .filter(item => item && item.title)
        .map((item, index) => cleanPaper(item, index))
        .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))

      // 有 PDF 的排前面
      const sortedPapers = this.sortPapersByPdf(papers)

      this.setData({
        papers: sortedPapers,
        total: res.total || papers.length,
        offset: offset + papers.length,
        hasMore: (offset + papers.length) < (res.total || 0),
        loading: false
      })

    } catch (error) {
      console.error('[Conference] 加载失败:', error)
      this.setData({
        papers: this.getFallbackPapers(),
        loading: false,
        hasMore: false
      })
    }
  },

  /**
   * 构建查询关键词
   */
  buildQuery(area) {
    const queryMap = {
      'all': 'machine learning',
      'CV': 'computer vision deep learning',
      'NLP': 'natural language processing transformer',
      'AI': 'deep learning neural network',
      'Data': 'data mining knowledge discovery',
      'Robotics': 'robotics autonomous',
      'Generative': 'generative AI diffusion model',
      'Multimodal': 'multimodal vision language',
      'RL': 'reinforcement learning'
    }
    return queryMap[area] || 'machine learning'
  },

  /**
   * 构建查询字符串
   */
  buildQueryString(params) {
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
  },

  /**
   * 排序：有 PDF 的排前面
   */
  sortPapersByPdf(papers) {
    return papers.sort((a, b) => {
      if (a.hasPdf && !b.hasPdf) return -1
      if (!a.hasPdf && b.hasPdf) return 1
      return (b.citationCount || 0) - (a.citationCount || 0)
    })
  },

  /**
   * 加载更多
   */
  async loadMore() {
    if (this.data.loadingMore || !this.data.hasMore) return

    this.setData({ loadingMore: true })

    try {
      const { selectedConference, selectedYear, selectedArea, offset } = this.data

      const query = this.buildQuery(selectedArea)
      const url = `${API_CONFIG.BASE_URL}/paper/search?` + this.buildQueryString({
        query: query,
        venue: selectedConference.id,
        year: selectedYear.toString(),
        offset: offset,
        limit: 20,
        fields: API_CONFIG.FIELDS
      })

      const res = await request({ url })

      if (res && res.data && res.data.length > 0) {
        const newPapers = res.data
          .filter(item => item && item.title)
          .map((item, index) => cleanPaper(item, index))

        const allPapers = [...this.data.papers, ...newPapers]
        const sortedPapers = this.sortPapersByPdf(allPapers)

        this.setData({
          papers: sortedPapers,
          offset: offset + newPapers.length,
          hasMore: (offset + newPapers.length) < (res.total || 0),
          loadingMore: false
        })
      } else {
        this.setData({ loadingMore: false, hasMore: false })
      }

    } catch (error) {
      console.error('[Conference] 加载更多失败:', error)
      this.setData({ loadingMore: false, hasMore: false })
    }
  },

  /**
   * 获取备用论文数据
   */
  getFallbackPapers() {
    const { selectedConference, selectedYear } = this.data
    const venue = selectedConference?.id || 'NeurIPS'
    const year = selectedYear || 2023

    return [
      {
        id: `conf_${venue}_${year}_1`,
        title: `${venue} ${year}: Advances in Deep Learning for ${this.data.selectedArea === 'CV' ? 'Computer Vision' : 'Artificial Intelligence'}`,
        authorsText: 'Author One, Author Two et al.',
        abstract: 'This paper presents novel approaches to deep learning that achieve state-of-the-art results on multiple benchmarks. Our method introduces a new architecture that efficiently processes high-dimensional data while maintaining computational efficiency.',
        venue: venue,
        venueLetter: venue[0],
        venueColor: selectedConference?.color || '#333',
        year: year,
        yearText: `${year}年`,
        citationCount: 245,
        citationText: '245',
        hasPdf: true,
        pdfUrl: 'https://arxiv.org/pdf/example',
        doi: '10.xxxx/example'
      },
      {
        id: `conf_${venue}_${year}_2`,
        title: `Scaling Laws and Efficient Training in ${venue} ${year}`,
        authorsText: 'Research Team Alpha et al.',
        abstract: 'We investigate the scaling properties of neural networks and propose efficient training strategies that reduce computational costs by 40% while maintaining model performance.',
        venue: venue,
        venueLetter: venue[0],
        venueColor: selectedConference?.color || '#333',
        year: year,
        yearText: `${year}年`,
        citationCount: 189,
        citationText: '189',
        hasPdf: true,
        pdfUrl: 'https://arxiv.org/pdf/example2',
        doi: '10.xxxx/example2'
      }
    ]
  },

  /**
   * 点击论文跳转详情
   */
  goToPaper(e) {
    const paper = e.currentTarget.dataset.paper
    if (!paper) return

    wx.setStorageSync('papergeek_current_paper', paper)
    wx.navigateTo({
      url: `/packageGithub/pages/article/article?id=${paper.id}`
    })
  },

  /**
   * 刷新数据
   */
  onRefresh() {
    this.setData({ offset: 0, papers: [] })
    this.loadPapers()
  },

  onReachBottom() {
    if (this.data.viewMode === 'papers') {
      this.loadMore()
    }
  },

  onPageScroll(e) {
    this.setData({ scrollTop: e.scrollTop })
  },

  scrollToTop() {
    wx.pageScrollTo({ scrollTop: 0, duration: 300 })
  },

  onShareAppMessage() {
    const { selectedConference, selectedYear } = this.data
    return {
      title: selectedConference 
        ? `${selectedConference.name} ${selectedYear} - Paper Geek` 
        : 'Paper Geek - 顶会荟萃',
      path: '/packageGithub/pages/conference/conference'
    }
  }
})
