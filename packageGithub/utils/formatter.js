// packageTech/utils/formatter.js
/**
 * Paper Geek - 数据格式化工具
 * 适配 Semantic Scholar 论文数据
 */

const { DATE_OPTIONS, VENUE_COLORS } = require('./config.js')

/**
 * 格式化年份
 */
function formatYear(year) {
  if (!year) return '年份未知'
  return `${year}年`
}

/**
 * 格式化作者列表
 * @param {Array} authors 作者数组
 * @returns {string} "Author1, Author2 et al."
 */
function formatAuthors(authors) {
  if (!authors || !Array.isArray(authors) || authors.length === 0) {
    return '作者未知'
  }

  // 提取作者姓名
  const authorNames = authors
    .map(author => author.name || author)
    .filter(name => name && typeof name === 'string')

  if (authorNames.length === 0) {
    return '作者未知'
  }

  if (authorNames.length === 1) {
    return authorNames[0]
  }

  if (authorNames.length === 2) {
    return `${authorNames[0]}, ${authorNames[1]}`
  }

  // 超过2个作者，显示前两位 + et al.
  return `${authorNames[0]}, ${authorNames[1]} et al.`
}

/**
 * 格式化引用量
 */
function formatCitations(count) {
  if (!count && count !== 0) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

/**
 * 获取期刊首字母和颜色
 */
function getVenueInfo(venue, index) {
  if (!venue || venue.trim() === '') {
    return {
      letter: '?',
      color: VENUE_COLORS[index % VENUE_COLORS.length]
    }
  }

  // 获取首字母（如果是中文则取第一个字）
  const firstChar = venue.trim()[0]
  const letter = /[a-zA-Z]/.test(firstChar) ? firstChar.toUpperCase() : firstChar

  return {
    letter: letter,
    color: VENUE_COLORS[index % VENUE_COLORS.length]
  }
}

/**
 * 格式化版面日期
 */
function formatMastheadDate(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = DATE_OPTIONS.WEEKDAYS[date.getDay()]
  return {
    year,
    month,
    day,
    weekday,
    fullDate: `${year}年${month}月${day}日`,
    shortDate: `${month}月${day}日`
  }
}

/**
 * 清洗论文数据
 */
function cleanPaperData(rawData) {
  if (!rawData || !rawData.data) {
    return { papers: [], total: 0, offset: 0, nextOffset: null }
  }

  const papers = rawData.data
    .filter(item => item && item.title)
    .map((item, index) => cleanPaper(item, index))

  const total = rawData.total || papers.length
  const offset = rawData.offset || 0
  const nextOffset = (offset + papers.length < total) ? offset + papers.length : null

  console.log(`[Filter] 获取 ${papers.length} 篇论文，总计 ${total} 篇`)

  return {
    papers: papers,
    total: total,
    offset: offset,
    nextOffset: nextOffset
  }
}

/**
 * 清洗单篇论文
 */
function cleanPaper(item, index) {
  // 格式化作者
  const authorsText = formatAuthors(item.authors)
  const authorNames = item.authors
    ? item.authors.map(a => a.name || a).filter(n => n).slice(0, 5)
    : []

  // 获取期刊信息
  const venueInfo = getVenueInfo(item.venue, index)

  // 获取 DOI
  const doi = item.externalIds?.DOI || ''
  
  // 提取 arXiv ID
  const arxivId = extractArxivId(item)

  return {
    id: item.paperId || `paper_${Date.now()}_${index}`,
    title: cleanText(item.title),
    // Headline -> title
    headline: cleanText(item.title),
    // Source -> venue
    source: item.venue || '未标注期刊',
    venue: item.venue || '未标注期刊',
    venueLetter: venueInfo.letter,
    venueColor: venueInfo.color,
    // Date -> year
    year: item.year,
    yearText: formatYear(item.year),
    // 作者
    authors: authorNames,
    authorsText: authorsText,
    // 摘要
    abstract: cleanText(item.abstract || '暂无摘要'),
    abstractShort: cleanText(item.abstract || '暂无摘要').substring(0, 200),
    // 引用量
    citationCount: item.citationCount || 0,
    citationText: formatCitations(item.citationCount || 0),
    // PDF（只使用arxiv，避免其他域名未备案问题）
    pdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : '',
    hasPdf: !!arxivId,
    // DOI
    doi: doi,
    // arXiv
    arxivId: arxivId,
    arxivPdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : '',
    // 摘要（用于列表显示）
    excerpt: cleanText(item.abstract || '暂无摘要').substring(0, 150)
  }
}

/**
 * 从论文数据中提取 arXiv ID
 */
function extractArxivId(item) {
  // 从 externalIds 获取
  if (item.externalIds?.ArXiv) {
    return item.externalIds.ArXiv
  }
  
  // 从 DOI 提取 (格式: 10.48550/arXiv.1706.03762)
  const doi = item.externalIds?.DOI || ''
  const doiMatch = doi.match(/arXiv\.(\d+\.\d+)/i)
  if (doiMatch) {
    return doiMatch[1]
  }
  
  // 从 URL 提取
  const pdfUrl = item.openAccessPdf?.url || ''
  const urlMatch = pdfUrl.match(/arxiv\.org\/pdf\/(\d+\.\d+)/i)
  if (urlMatch) {
    return urlMatch[1]
  }
  
  // 从 CorpusId 尝试（有些论文的 CorpusId 就是 arXiv ID）
  if (item.corpusId && /^\d+\.\d+$/.test(item.corpusId)) {
    return item.corpusId
  }
  
  return ''
}

/**
 * 获取最佳 PDF URL
 * 优先级: arXiv（只使用arxiv，避免其他域名未备案问题）
 */
function getBestPdfUrl(paper) {
  // 只使用 arXiv PDF（域名已备案，可靠性高）
  if (paper.arxivId) {
    return { url: paper.arxivPdfUrl, source: 'arXiv' }
  }
  
  return { url: '', source: '' }
}

/**
 * 清洗文本内容
 */
function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

module.exports = {
  formatYear,
  formatAuthors,
  formatCitations,
  getVenueInfo,
  formatMastheadDate,
  cleanPaperData,
  cleanPaper,
  cleanText,
  extractArxivId,
  getBestPdfUrl
}
