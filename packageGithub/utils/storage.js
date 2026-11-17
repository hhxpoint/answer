// packageTech/utils/storage.js
/**
 * Paper Geek - 本地缓存管理
 */

const { API_CONFIG } = require('./config.js')

const CACHE_KEYS = {
  PAPERS_DATA: 'papergeek_papers_cache',
  LAST_UPDATE: 'papergeek_last_update',
  EDITION_NUMBER: 'papergeek_edition_number'
}

/**
 * 获取今日日期字符串
 */
function getTodayStr() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * 检查缓存是否有效
 */
function isCacheValid() {
  try {
    const lastUpdate = wx.getStorageSync(CACHE_KEYS.LAST_UPDATE)
    if (!lastUpdate) return false
    const now = Date.now()
    return (now - lastUpdate) < API_CONFIG.CACHE_DURATION
  } catch (e) {
    return false
  }
}

/**
 * 获取缓存的论文数据
 */
function getCachedPapers() {
  try {
    if (!isCacheValid()) {
      console.log('[Cache] 缓存已过期')
      return null
    }
    const cached = wx.getStorageSync(CACHE_KEYS.PAPERS_DATA)
    if (cached && cached.data) {
      console.log('[Cache] 使用缓存数据')
      return cached
    }
    return null
  } catch (e) {
    console.error('[Cache] 读取缓存失败:', e)
    return null
  }
}

/**
 * 保存论文数据到缓存
 */
function setCachedPapers(data) {
  try {
    wx.setStorageSync(CACHE_KEYS.PAPERS_DATA, {
      data: data,
      timestamp: Date.now(),
      date: getTodayStr()
    })
    wx.setStorageSync(CACHE_KEYS.LAST_UPDATE, Date.now())
    console.log('[Cache] 数据已缓存')
  } catch (e) {
    console.error('[Cache] 保存缓存失败:', e)
  }
}

/**
 * 追加缓存数据
 */
function appendCachedPapers(newPapers, nextOffset) {
  try {
    const cached = wx.getStorageSync(CACHE_KEYS.PAPERS_DATA)
    if (cached && cached.data) {
      const updatedData = {
        ...cached.data,
        data: [...(cached.data.data || []), ...newPapers],
        offset: nextOffset
      }
      setCachedPapers(updatedData)
    }
  } catch (e) {
    console.error('[Cache] 追加缓存失败:', e)
  }
}

/**
 * 清除所有缓存
 */
function clearAllCache() {
  try {
    wx.removeStorageSync(CACHE_KEYS.PAPERS_DATA)
    wx.removeStorageSync(CACHE_KEYS.LAST_UPDATE)
    console.log('[Cache] 缓存已清除')
  } catch (e) {
    console.error('[Cache] 清除缓存失败:', e)
  }
}

/**
 * 获取期号
 */
function getEditionNumber() {
  try {
    const saved = wx.getStorageSync(CACHE_KEYS.EDITION_NUMBER)
    const today = getTodayStr()

    if (saved && saved.date === today) {
      return saved.number
    }

    const startDate = new Date('2024-01-01')
    const now = new Date()
    const diffDays = Math.floor((now - startDate) / (24 * 60 * 60 * 1000)) + 1

    wx.setStorageSync(CACHE_KEYS.EDITION_NUMBER, {
      date: today,
      number: diffDays
    })

    return diffDays
  } catch (e) {
    return Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 1000 + 100
  }
}

module.exports = {
  isCacheValid,
  getCachedPapers,
  setCachedPapers,
  appendCachedPapers,
  clearAllCache,
  getEditionNumber,
  getTodayStr
}
