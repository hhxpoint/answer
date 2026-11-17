// packageTech/pages/journal/journal.js
/**
 * Paper Geek - 学术论文 + 顶会/顶刊荟萃
 * 支持每日论文、顶会论文、顶刊论文三个视图
 */

const { searchPapers, fetchNextPage, request, API_CONFIG } = require('../../utils/request.js')
const { getCachedPapers, setCachedPapers, appendCachedPapers, clearAllCache, getEditionNumber } = require('../../utils/storage.js')
const { cleanPaperData, cleanPaper, formatMastheadDate } = require('../../utils/formatter.js')

// ========== 顶会配置 (25+) ==========
const CONFERENCES = [
  // AI 综合 (6)
  { id: 'NeurIPS', name: 'NeurIPS', fullName: 'Neural Information Processing Systems', category: 'AI', color: '#636e72' },
  { id: 'ICML', name: 'ICML', fullName: 'International Conference on Machine Learning', category: 'AI', color: '#2d3436' },
  { id: 'ICLR', name: 'ICLR', fullName: 'International Conference on Learning Representations', category: 'AI', color: '#b2bec3' },
  { id: 'AAAI', name: 'AAAI', fullName: 'AAAI Conference on AI', category: 'AI', color: '#6c5ce7' },
  { id: 'IJCAI', name: 'IJCAI', fullName: 'International Joint Conference on AI', category: 'AI', color: '#a29bfe' },
  { id: 'UAI', name: 'UAI', fullName: 'Uncertainty in Artificial Intelligence', category: 'AI', color: '#dfe6e9' },
  
  // 计算机视觉 (5)
  { id: 'CVPR', name: 'CVPR', fullName: 'Computer Vision and Pattern Recognition', category: 'CV', color: '#0984e3' },
  { id: 'ICCV', name: 'ICCV', fullName: 'International Conference on Computer Vision', category: 'CV', color: '#74b9ff' },
  { id: 'ECCV', name: 'ECCV', fullName: 'European Conference on Computer Vision', category: 'CV', color: '#00b894' },
  { id: 'WACV', name: 'WACV', fullName: 'Winter Conference on Applications of CV', category: 'CV', color: '#00cec9' },
  { id: 'ACCV', name: 'ACCV', fullName: 'Asian Conference on Computer Vision', category: 'CV', color: '#81ecec' },
  
  // 自然语言处理 (5)
  { id: 'ACL', name: 'ACL', fullName: 'Association for Computational Linguistics', category: 'NLP', color: '#e17055' },
  { id: 'EMNLP', name: 'EMNLP', fullName: 'Empirical Methods in NLP', category: 'NLP', color: '#fdcb6e' },
  { id: 'NAACL', name: 'NAACL', fullName: 'North American Chapter of ACL', category: 'NLP', color: '#55efc4' },
  { id: 'COLING', name: 'COLING', fullName: 'International Conference on Computational Linguistics', category: 'NLP', color: '#fab1a0' },
  { id: 'EACL', name: 'EACL', fullName: 'European Chapter of ACL', category: 'NLP', color: '#ffeaa7' },
  
  // 数据挖掘 & 检索 (5)
  { id: 'KDD', name: 'KDD', fullName: 'Knowledge Discovery and Data Mining', category: 'Data', color: '#d63031' },
  { id: 'SIGIR', name: 'SIGIR', fullName: 'Information Retrieval', category: 'Data', color: '#ff7675' },
  { id: 'WWW', name: 'WWW', fullName: 'World Wide Web Conference', category: 'Data', color: '#ff7675' },
  { id: 'WSDM', name: 'WSDM', fullName: 'Web Search and Data Mining', category: 'Data', color: '#fab1a0' },
  { id: 'RecSys', name: 'RecSys', fullName: 'Recommender Systems', category: 'Data', color: '#fd79a8' },
  
  // 机器人 & 具身智能 (5)
  { id: 'RSS', name: 'RSS', fullName: 'Robotics: Science and Systems', category: 'Robotics', color: '#00cec9' },
  { id: 'CoRL', name: 'CoRL', fullName: 'Conference on Robot Learning', category: 'Robotics', color: '#00b894' },
  { id: 'IROS', name: 'IROS', fullName: 'Intelligent Robots and Systems', category: 'Robotics', color: '#55efc4' },
  { id: 'ICRA', name: 'ICRA', fullName: 'Robotics and Automation', category: 'Robotics', color: '#2ecc71' },
  { id: 'Humanoids', name: 'Humanoids', fullName: 'IEEE-RAS Humanoids', category: 'Robotics', color: '#27ae60' },
  
  // 多模态 & 生成 (4)
  { id: 'MM', name: 'ACM MM', fullName: 'ACM Multimedia', category: 'Multimodal', color: '#e84393' },
  { id: 'ICMR', name: 'ICMR', fullName: 'Multimedia Retrieval', category: 'Multimodal', color: '#fd79a8' },
  { id: 'ICME', name: 'ICME', fullName: 'Multimedia and Expo', category: 'Multimodal', color: '#e17055' },
  { id: 'SIGGRAPH', name: 'SIGGRAPH', fullName: 'Computer Graphics', category: 'Multimodal', color: '#00cec9' }
]

// ========== 顶刊配置 ==========
const JOURNALS = [
  // AI 综合期刊 (4)
  { id: 'Nature Machine Intelligence', name: 'Nat. MI', fullName: 'Nature Machine Intelligence', category: 'AI', color: '#0984e3' },
  { id: 'JMLR', name: 'JMLR', fullName: 'Journal of Machine Learning Research', category: 'AI', color: '#636e72' },
  { id: 'Artificial Intelligence', name: 'AIJ', fullName: 'Artificial Intelligence Journal', category: 'AI', color: '#2d3436' },
  { id: 'IEEE TPAMI', name: 'TPAMI', fullName: 'IEEE Trans. on Pattern Analysis', category: 'AI', color: '#0984e3' },
  
  // CV 期刊 (3)
  { id: 'IJCV', name: 'IJCV', fullName: 'Int. Journal of Computer Vision', category: 'CV', color: '#74b9ff' },
  { id: 'IEEE TIP', name: 'TIP', fullName: 'IEEE Trans. on Image Processing', category: 'CV', color: '#00b894' },
  { id: 'IEEE TMM', name: 'TMM', fullName: 'IEEE Trans. on Multimedia', category: 'CV', color: '#00cec9' },
  
  // NLP 期刊 (2)
  { id: 'TACL', name: 'TACL', fullName: 'Transactions of ACL', category: 'NLP', color: '#e17055' },
  { id: 'Computational Linguistics', name: 'CL', fullName: 'Computational Linguistics', category: 'NLP', color: '#fdcb6e' },
  
  // 综合科学期刊 (3)
  { id: 'Nature', name: 'Nature', fullName: 'Nature', category: 'Science', color: '#c0392b' },
  { id: 'Science', name: 'Science', fullName: 'Science', category: 'Science', color: '#2980b9' },
  { id: 'PNAS', name: 'PNAS', fullName: 'Proc. National Academy of Sciences', category: 'Science', color: '#27ae60' }
]

// ========== 研究方向分类 (15) ==========
const RESEARCH_AREAS = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'AI', name: '机器学习', icon: '🧠' },
  { id: 'CV', name: '计算机视觉', icon: '👁️' },
  { id: 'NLP', name: '自然语言', icon: '💬' },
  { id: 'Generative', name: '生成式AI', icon: '🎨' },
  { id: 'Embodied', name: '具身智能', icon: '🦾' },
  { id: 'Robotics', name: '机器人学', icon: '🤖' },
  { id: 'Multimodal', name: '多模态', icon: '🔀' },
  { id: 'RL', name: '强化学习', icon: '🎮' },
  { id: 'Data', name: '数据挖掘', icon: '📊' },
  { id: 'IR', name: '信息检索', icon: '🔍' },
  { id: 'Bio', name: '生物AI', icon: '🧬' },
  { id: 'AD', name: '自动驾驶', icon: '🚗' },
  { id: 'Code', name: 'AI4Code', icon: '💻' },
  { id: 'Audio', name: '音频语音', icon: '🎵' }
]

// ========== 获取年份列表 ==========
function getYears() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear; y >= 2018; y--) {
    years.push(y)
  }
  return years
}

Page({
  data: {
    // Tab 视图模式
    viewMode: 'daily', // daily | venue
    
    // 报纸抬头
    masthead: {
      title: 'PAPER GEEK',
      subtitle: '学术日报 · AI论文精选',
      date: '',
      weekday: '',
      edition: 1
    },
    
    // 每日论文数据
    papers: [],
    loading: false,
    loadingMore: false,
    offset: 0,
    total: 0,
    hasMore: true,
    
    // 顶会/顶刊配置
    conferences: CONFERENCES,
    journals: JOURNALS,
    researchAreas: RESEARCH_AREAS,
    years: getYears(),
    
    // 顶会/顶刊视图
    venueType: 'conference', // conference | journal
    selectedConference: CONFERENCES[0],
    selectedJournal: JOURNALS[0],
    selectedYear: new Date().getFullYear(),
    selectedArea: 'all',
    
    // 顶会/顶刊论文数据
    venuePapers: [],
    venueLoading: false,
    venueLoadingMore: false,
    venueOffset: 0,
    venueHasMore: true,
    
    // 顶会/顶刊子视图
    venueView: 'list', // list | papers
    
    // 滚动位置
    scrollTop: 0
  },

  onLoad() {
    this.initMasthead()
    this.loadDailyPapers()
  },

  onShow() {
    this.updateMastheadDate()
  },

  /**
   * 初始化报纸抬头
   */
  initMasthead() {
    const dateInfo = formatMastheadDate()
    const edition = getEditionNumber()
    this.setData({
      masthead: {
        title: 'PAPER GEEK',
        subtitle: '学术日报 · AI论文精选',
        date: dateInfo.fullDate,
        weekday: dateInfo.weekday,
        edition: edition
      }
    })
  },

  /**
   * 更新抬头日期
   */
  updateMastheadDate() {
    const dateInfo = formatMastheadDate()
    this.setData({
      'masthead.date': dateInfo.fullDate,
      'masthead.weekday': dateInfo.weekday
    })
  },

  /**
   * 切换 Tab
   */
  switchTab(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode === this.data.viewMode) return

    this.setData({ viewMode: mode })

    // 首次切换到顶会视图时加载数据
    if (mode === 'venue' && this.data.venuePapers.length === 0) {
      this.loadVenuePapers()
    }
  },

  /**
   * 切换顶会/顶刊类型
   */
  switchVenueType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.venueType) return

    const venues = type === 'conference' ? CONFERENCES : JOURNALS
    const filteredVenues = this.filterVenuesByArea(venues, this.data.selectedArea)

    this.setData({
      venueType: type,
      selectedConference: type === 'conference' ? filteredVenues[0] : this.data.selectedConference,
      selectedJournal: type === 'journal' ? filteredVenues[0] : this.data.selectedJournal,
      conferences: type === 'conference' ? filteredVenues : CONFERENCES,
      journals: type === 'journal' ? filteredVenues : JOURNALS,
      venueView: 'list',
      venuePapers: []
    })
  },

  // ==================== 每日论文 ====================

  /**
   * 加载每日论文
   */
  async loadDailyPapers() {
    this.setData({ loading: true })

    try {
      console.log('[Daily] 开始请求 API...')
      const rawData = await searchPapers({
        query: 'AI',
        offset: 0,
        limit: 10
      })

      if (!rawData || !rawData.data || rawData.data.length === 0) {
        this.setData({
          papers: this.getFallbackPapers(),
          loading: false
        })
        return
      }

      const cleaned = cleanPaperData(rawData)
      let finalPapers = cleaned.papers

      if (finalPapers.length === 0) {
        finalPapers = this.getFallbackPapers()
      }

      finalPapers = this.sortPapersByPdf(finalPapers)
      setCachedPapers(rawData)

      this.setData({
        papers: finalPapers,
        offset: cleaned.nextOffset || 0,
        total: cleaned.total,
        hasMore: !!cleaned.nextOffset,
        loading: false
      })

    } catch (error) {
      console.error('[Daily] 加载失败:', error)
      this.setData({
        papers: this.getFallbackPapers(),
        loading: false
      })
    }
  },

  /**
   * 加载更多每日论文
   */
  async loadMoreDaily() {
    if (this.data.loadingMore || !this.data.hasMore) return

    this.setData({ loadingMore: true })

    try {
      const rawData = await fetchNextPage(this.data.offset, {
        query: 'AI',
        limit: 10
      })

      if (rawData && rawData.data && rawData.data.length > 0) {
        const cleaned = cleanPaperData(rawData)
        const allPapers = [...this.data.papers, ...cleaned.papers]
        const sortedPapers = this.sortPapersByPdf(allPapers)

        this.setData({
          papers: sortedPapers,
          offset: cleaned.nextOffset || 0,
          hasMore: !!cleaned.nextOffset,
          loadingMore: false
        })
      } else {
        this.setData({ loadingMore: false, hasMore: false })
      }
    } catch (error) {
      console.error('[Daily] 加载更多失败:', error)
      this.setData({ loadingMore: false, hasMore: false })
    }
  },

  // ==================== 顶会/顶刊论文 ====================

  /**
   * 筛选顶会/顶刊按方向
   */
  filterVenuesByArea(venues, area) {
    if (area === 'all') return venues
    return venues.filter(v => v.category === area)
  },

  /**
   * 选择研究方向
   */
  selectArea(e) {
    const area = e.currentTarget.dataset.area
    if (area === this.data.selectedArea) return

    const venues = this.data.venueType === 'conference' ? CONFERENCES : JOURNALS
    const filteredVenues = this.filterVenuesByArea(venues, area)

    this.setData({
      selectedArea: area,
      conferences: this.data.venueType === 'conference' ? filteredVenues : CONFERENCES,
      journals: this.data.venueType === 'journal' ? filteredVenues : JOURNALS,
      selectedConference: this.data.venueType === 'conference' ? (filteredVenues[0] || null) : this.data.selectedConference,
      selectedJournal: this.data.venueType === 'journal' ? (filteredVenues[0] || null) : this.data.selectedJournal
    })
  },

  /**
   * 选择年份
   */
  selectYear(e) {
    const year = parseInt(e.currentTarget.dataset.year)
    if (year === this.data.selectedYear) return
    this.setData({ selectedYear: year })
  },

  /**
   * 选择顶会
   */
  selectConference(e) {
    const conference = e.currentTarget.dataset.conference
    if (!conference) return

    this.setData({
      selectedConference: conference,
      venueView: 'papers',
      venuePapers: [],
      venueOffset: 0,
      venueHasMore: true
    })

    this.loadVenuePapers()
  },

  /**
   * 选择顶刊
   */
  selectJournal(e) {
    const journal = e.currentTarget.dataset.journal
    if (!journal) return

    this.setData({
      selectedJournal: journal,
      venueView: 'papers',
      venuePapers: [],
      venueOffset: 0,
      venueHasMore: true
    })

    this.loadVenuePapers()
  },

  /**
   * 返回列表
   */
  backToList() {
    this.setData({ venueView: 'list' })
  },

  /**
   * 加载顶会/顶刊论文
   */
  async loadVenuePapers() {
    const { venueType, selectedConference, selectedJournal, selectedYear, selectedArea } = this.data
    const venue = venueType === 'conference' ? selectedConference : selectedJournal

    if (!venue) {
      wx.showToast({ title: '请先选择', icon: 'none' })
      return
    }

    this.setData({ venueLoading: true })

    try {
      const query = this.buildQuery(selectedArea)
      const url = `${API_CONFIG.BASE_URL}/paper/search?` + this.buildQueryString({
        query: query,
        venue: venue.id,
        year: venueType === 'conference' ? selectedYear.toString() : '',
        offset: 0,
        limit: 20,
        fields: API_CONFIG.FIELDS
      })

      console.log('[Venue] 请求 URL:', url)

      const res = await request({ url })

      if (!res || !res.data || res.data.length === 0) {
        this.setData({
          venuePapers: this.getVenueFallbackPapers(),
          venueLoading: false,
          venueHasMore: false
        })
        return
      }

      const papers = res.data
        .filter(item => item && item.title)
        .map((item, index) => cleanPaper(item, index))
        .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))

      const sortedPapers = this.sortPapersByPdf(papers)

      this.setData({
        venuePapers: sortedPapers,
        total: res.total || papers.length,
        venueOffset: papers.length,
        venueHasMore: papers.length < (res.total || 0),
        venueLoading: false
      })

    } catch (error) {
      console.error('[Venue] 加载失败:', error)
      this.setData({
        venuePapers: this.getVenueFallbackPapers(),
        venueLoading: false,
        venueHasMore: false
      })
    }
  },

  /**
   * 加载更多顶会/顶刊论文
   */
  async loadMoreVenue() {
    if (this.data.venueLoadingMore || !this.data.venueHasMore) return

    this.setData({ venueLoadingMore: true })

    try {
      const { venueType, selectedConference, selectedJournal, selectedYear, selectedArea, venueOffset } = this.data
      const venue = venueType === 'conference' ? selectedConference : selectedJournal

      const query = this.buildQuery(selectedArea)
      const url = `${API_CONFIG.BASE_URL}/paper/search?` + this.buildQueryString({
        query: query,
        venue: venue.id,
        year: venueType === 'conference' ? selectedYear.toString() : '',
        offset: venueOffset,
        limit: 20,
        fields: API_CONFIG.FIELDS
      })

      const res = await request({ url })

      if (res && res.data && res.data.length > 0) {
        const newPapers = res.data
          .filter(item => item && item.title)
          .map((item, index) => cleanPaper(item, index))

        const allPapers = [...this.data.venuePapers, ...newPapers]
        const sortedPapers = this.sortPapersByPdf(allPapers)

        this.setData({
          venuePapers: sortedPapers,
          venueOffset: venueOffset + newPapers.length,
          venueHasMore: (venueOffset + newPapers.length) < (res.total || 0),
          venueLoadingMore: false
        })
      } else {
        this.setData({ venueLoadingMore: false, venueHasMore: false })
      }

    } catch (error) {
      console.error('[Venue] 加载更多失败:', error)
      this.setData({ venueLoadingMore: false, venueHasMore: false })
    }
  },

  /**
   * 构建查询关键词
   */
  buildQuery(area) {
    const queryMap = {
      'all': 'machine learning',
      'AI': 'deep learning neural network',
      'CV': 'computer vision image recognition',
      'NLP': 'natural language processing transformer',
      'Generative': 'generative AI diffusion model',
      'Embodied': 'embodied AI vision language action',
      'Robotics': 'robotics autonomous manipulation',
      'Multimodal': 'multimodal vision language model',
      'RL': 'reinforcement learning policy optimization',
      'Data': 'data mining knowledge discovery',
      'IR': 'information retrieval search RAG',
      'Bio': 'drug discovery protein structure',
      'AD': 'autonomous driving perception planning',
      'Code': 'code generation program synthesis',
      'Audio': 'speech recognition audio generation'
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

  // ==================== 通用方法 ====================

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
   * 获取每日备用数据
   */
  getFallbackPapers() {
    const fallbackRaw = {
      data: [
        {
          paperId: 'paper_1',
          title: 'Attention Is All You Need',
          authors: [{ name: 'Ashish Vaswani' }, { name: 'Noam Shazeer' }],
          abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.',
          year: 2017,
          citationCount: 95000,
          venue: 'NeurIPS',
          openAccessPdf: { url: 'https://arxiv.org/pdf/1706.03762' },
          externalIds: { DOI: '10.48550/arXiv.1706.03762' }
        },
        {
          paperId: 'paper_2',
          title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
          authors: [{ name: 'Jacob Devlin' }, { name: 'Ming-Wei Chang' }],
          abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.',
          year: 2019,
          citationCount: 82000,
          venue: 'NAACL',
          openAccessPdf: { url: 'https://arxiv.org/pdf/1810.04805' },
          externalIds: { DOI: '10.48550/arXiv.1810.04805' }
        },
        {
          paperId: 'paper_3',
          title: 'Language Models are Few-Shot Learners',
          authors: [{ name: 'Tom B. Brown' }, { name: 'Benjamin Mann' }],
          abstract: 'We show that scaling up language models greatly improves task-agnostic, few-shot performance.',
          year: 2020,
          citationCount: 45000,
          venue: 'NeurIPS',
          openAccessPdf: { url: 'https://arxiv.org/pdf/2005.14165' },
          externalIds: { DOI: '10.48550/arXiv.2005.14165' }
        }
      ],
      total: 3,
      offset: 0
    }

    const cleaned = cleanPaperData(fallbackRaw)
    return cleaned.papers
  },

  /**
   * 获取顶会/顶刊备用数据
   */
  getVenueFallbackPapers() {
    const { venueType, selectedConference, selectedJournal, selectedYear } = this.data
    const venue = venueType === 'conference' ? selectedConference : selectedJournal
    const year = selectedYear || 2023

    return [
      {
        id: `venue_${venue?.id}_${year}_1`,
        title: `${venue?.name || 'Conference'} ${year}: Recent Advances`,
        authorsText: 'Author One, Author Two et al.',
        abstract: 'This paper presents novel approaches that achieve state-of-the-art results on multiple benchmarks.',
        venue: venue?.name || '',
        venueLetter: (venue?.name || '?')[0],
        venueColor: venue?.color || '#333',
        year: year,
        yearText: `${year}年`,
        citationCount: 128,
        citationText: '128',
        hasPdf: true,
        pdfUrl: 'https://arxiv.org/pdf/example',
        doi: '10.xxxx/example'
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
    if (this.data.viewMode === 'daily') {
      this.loadDailyPapers()
    } else {
      this.setData({ venuePapers: [], venueOffset: 0 })
      this.loadVenuePapers()
    }
    wx.showToast({ title: '已刷新', icon: 'success' })
  },

  /**
   * 清除缓存
   */
  clearCache() {
    wx.showModal({
      title: '刷新数据',
      content: '将重新获取最新论文',
      success: (res) => {
        if (res.confirm) {
          clearAllCache()
          this.onRefresh()
        }
      }
    })
  },

  onReachBottom() {
    if (this.data.viewMode === 'daily') {
      this.loadMoreDaily()
    } else if (this.data.venueView === 'papers') {
      this.loadMoreVenue()
    }
  },

  onPageScroll(e) {
    this.setData({ scrollTop: e.scrollTop })
  },

  scrollToTop() {
    wx.pageScrollTo({ scrollTop: 0, duration: 300 })
  },

  onShareAppMessage() {
    return {
      title: 'Paper Geek - 学术日报',
      path: '/packageGithub/pages/journal/journal'
    }
  },

  onShareTimeline() {
    return {
      title: 'Paper Geek - 学术日报 · AI论文精选',
      query: ''
    }
  }
})
