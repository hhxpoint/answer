// packageTech/utils/config.js
/**
 * Paper Geek - 学术论文阅读器配置
 * 使用 Semantic Scholar API（免费）
 */

// Semantic Scholar API 配置
const API_CONFIG = {
  // API 基础地址（免费，无需密钥）
  BASE_URL: 'https://api.semanticscholar.org/graph/v1',

  // 搜索接口
  SEARCH_ENDPOINT: '/paper/search',

  // 默认搜索关键词
  DEFAULT_QUERY: 'AI',

  // 请求字段
  FIELDS: 'title,authors,abstract,year,citationCount,openAccessPdf,venue,externalIds',

  // 每页数量
  PAGE_SIZE: 10,

  // 缓存有效期（4小时）
  CACHE_DURATION: 4 * 60 * 60 * 1000,

  // 请求超时时间
  TIMEOUT: 15000,

  // API Key（填入后可提高请求限额）
  API_KEY: 'UoOQjNbOlh5hJr33wRTZy5LGABcXMGN03L18lFq9'
}

// 版本信息
const APP_INFO = {
  NAME: 'PAPER GEEK',
  SUBTITLE: '学术日报 · AI论文精选'
}

// 日期格式化选项
const DATE_OPTIONS = {
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
}

// 期刊/会议首字母颜色映射
const VENUE_COLORS = [
  '#1a1a1a', '#2d3436', '#636e72', '#b2bec3',
  '#0984e3', '#6c5ce7', '#a29bfe', '#74b9ff',
  '#00b894', '#55efc4', '#fdcb6e', '#e17055'
]

module.exports = {
  API_CONFIG,
  APP_INFO,
  DATE_OPTIONS,
  VENUE_COLORS
}
