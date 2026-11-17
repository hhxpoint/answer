// packageTech/utils/request.js
/**
 * Paper Geek - 网络请求封装
 * 使用 Semantic Scholar API（免费学术论文）
 */

const { API_CONFIG } = require('./config.js')

/**
 * 构建 API 请求 URL
 */
function buildApiUrl(params = {}) {
  const {
    endpoint = API_CONFIG.SEARCH_ENDPOINT,
    query = API_CONFIG.DEFAULT_QUERY,
    offset = 0,
    limit = API_CONFIG.PAGE_SIZE
  } = params

  // 基础参数
  const baseParams = {
    query: query,
    offset: offset,
    limit: limit,
    fields: API_CONFIG.FIELDS
  }

  // 构建查询字符串
  const queryString = Object.keys(baseParams)
    .filter(key => baseParams[key] !== undefined && baseParams[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(baseParams[key])}`)
    .join('&')

  return `${API_CONFIG.BASE_URL}${endpoint}?${queryString}`
}

/**
 * 发起网络请求
 */
function request(options) {
  const { url, method = 'GET', timeout = API_CONFIG.TIMEOUT } = options

  return new Promise((resolve, reject) => {
    console.log('[Request] URL:', url)

    // 请求头（预留 API Key）
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    // 如果配置了 API Key，添加到请求头
    if (API_CONFIG.API_KEY) {
      header['x-api-key'] = API_CONFIG.API_KEY
    }

    wx.request({
      url: url,
      method: method,
      timeout: timeout,
      header: header,
      success(res) {
        const { statusCode, data } = res
        console.log('[Request] 状态码:', statusCode)

        if (statusCode === 200) {
          if (data && data.data) {
            console.log('[Request] 成功，论文数量:', data.data.length || 0)
            resolve(data)
          } else {
            reject({
              code: 'API_ERROR',
              message: 'API 返回数据异常',
              data: data
            })
          }
        } else if (statusCode === 429) {
          reject({
            code: 'RATE_LIMIT',
            message: '请求频率超限，请稍后再试',
            data: data
          })
        } else {
          reject({
            code: 'HTTP_ERROR',
            message: `请求失败 (${statusCode})`,
            data: data
          })
        }
      },
      fail(err) {
        console.error('[Request] 失败:', err)
        reject({
          code: 'NETWORK_ERROR',
          message: '网络连接失败',
          data: err
        })
      }
    })
  })
}

/**
 * 搜索学术论文
 */
function searchPapers(params = {}) {
  const url = buildApiUrl(params)
  return request({ url })
}

/**
 * 获取下一页论文
 */
function fetchNextPage(offset, params = {}) {
  if (offset === undefined || offset === null) {
    return Promise.reject({
      code: 'NO_NEXT_PAGE',
      message: '没有更多数据了'
    })
  }

  const url = buildApiUrl({
    ...params,
    offset: offset
  })

  return request({ url })
}

module.exports = {
  request,
  buildApiUrl,
  searchPapers,
  fetchNextPage,
  API_CONFIG
}
