/**
 * 腾讯云翻译API工具
 * 实现TC3-HMAC-SHA256签名算法
 */

// 腾讯云API配置
// ⚠️ 安全提示：云 API 密钥严禁硬编码在小程序前端（会随代码包分发）。
// 翻译功能请改为通过自有服务端代理调用，或由后端签发的临时凭证。
// 此处保留空占位；如需本地调试，请自行在未入库的临时文件中配置，切勿提交真实密钥。
const SECRET_ID = ''
const SECRET_KEY = ''
const HOST = 'tmt.tencentcloudapi.com'
const TTS_HOST = 'tts.tencentcloudapi.com'
const SERVICE = 'tmt'
const TTS_SERVICE = 'tts'
const ACTION = 'TextTranslate'
const VERSION = '2018-03-21'
const REGION = 'ap-guangzhou'

// 获取CryptoJS - 只加载需要的模块
const CryptoJS = require('../../miniprogram_npm/crypto-js/core.js')
require('../../miniprogram_npm/crypto-js/sha256.js')
require('../../miniprogram_npm/crypto-js/hmac.js')
require('../../miniprogram_npm/crypto-js/enc-hex.js')

/**
 * 生成签名所需的哈希值
 */
function sha256(message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

/**
 * 获取UTC时间戳（秒）
 */
function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

/**
 * 获取日期字符串 (YYYY-MM-DD格式)
 */
function getDate(timestamp) {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 生成TC3-HMAC-SHA256签名
 */
function sign(secretKey, date, service, stringToSign) {
  const kDate = CryptoJS.HmacSHA256(date, 'TC3' + secretKey)
  const kService = CryptoJS.HmacSHA256(service, kDate)
  const kSigning = CryptoJS.HmacSHA256('tc3_request', kService)
  return CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex)
}

/**
 * 生成Authorization头部
 */
function generateAuthorization(payload, timestamp) {
  const date = getDate(timestamp)
  
  // Step 1: 拼接规范请求串
  const httpRequestMethod = 'POST'
  const canonicalUri = '/'
  const canonicalQueryString = ''
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${HOST}\nx-tc-action:${ACTION.toLowerCase()}\n`
  const signedHeaders = 'content-type;host;x-tc-action'
  const hashedPayload = sha256(payload)
  
  const canonicalRequest = [
    httpRequestMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedPayload
  ].join('\n')
  
  // Step 2: 拼接待签字符串
  const algorithm = 'TC3-HMAC-SHA256'
  const credentialScope = `${date}/${SERVICE}/tc3_request`
  const hashedCanonicalRequest = sha256(canonicalRequest)
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`
  
  // Step 3: 计算签名
  const signature = sign(SECRET_KEY, date, SERVICE, stringToSign)
  
  // Step 4: 拼接Authorization
  return `${algorithm} Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

/**
 * 调用腾讯云翻译API
 * @param {string} text 待翻译文本
 * @param {string} source 源语言 (auto/zh/en)
 * @param {string} target 目标语言 (zh/en)
 * @returns {Promise<string>} 翻译结果
 */
function translateText(text, source = 'auto', target = 'zh') {
  return new Promise((resolve, reject) => {
    if (!text || text.trim() === '') {
      reject(new Error('翻译文本不能为空'))
      return
    }

    // 限制文本长度
    if (text.length > 6000) {
      text = text.substring(0, 6000)
    }

    const timestamp = getTimestamp()
    const payload = JSON.stringify({
      SourceText: text,
      Source: source,
      Target: target,
      ProjectId: 0
    })

    const authorization = generateAuthorization(payload, timestamp)

    wx.request({
      url: `https://${HOST}/`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': HOST,
        'X-TC-Action': ACTION,
        'X-TC-Version': VERSION,
        'X-TC-Region': REGION,
        'X-TC-Timestamp': timestamp.toString(),
        'Authorization': authorization
      },
      data: payload,
      timeout: 15000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.Response) {
          if (res.data.Response.TargetText) {
            resolve(res.data.Response.TargetText)
          } else if (res.data.Response.Error) {
            reject(new Error(res.data.Response.Error.Message || '翻译失败'))
          } else {
            reject(new Error('翻译结果为空'))
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
}

/**
 * 智能翻译（自动检测语言并互译）
 * @param {string} text 待翻译文本
 * @returns {Promise<string>} 翻译结果
 */
function smartTranslate(text) {
  // 检测是否包含中文
  const isChinese = /[\u4e00-\u9fa5]/.test(text)
  const source = isChinese ? 'zh' : 'en'
  const target = isChinese ? 'en' : 'zh'
  
  return translateText(text, source, target)
}

module.exports = {
  translateText,
  smartTranslate
}
