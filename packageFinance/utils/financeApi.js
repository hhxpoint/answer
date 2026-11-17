/**
 * 指数破壁 - Alpha Vantage API 工具模块
 * 处理 API 调用、缓存、频率限制、汇率换算
 */

const API_KEY = 'DMXKAJBAHMQH3Y2F';
const BASE_URL = 'https://www.alphavantage.co/query';
const TROY_OUNCE_TO_GRAM = 31.1035;
const FALLBACK_USD_CNY = 7.23;

// 缓存过期时间（毫秒）
const CACHE_EXPIRE = {
  fx: 60 * 60 * 1000,        // 汇率：1小时
  metal: 15 * 60 * 1000,     // 金银：15分钟
  crypto: 5 * 60 * 1000,     // 比特币：5分钟
  macro: 24 * 60 * 60 * 1000, // 通胀/CPI：24小时
  stock: 15 * 60 * 1000,     // 股票：15分钟
  news: 30 * 60 * 1000       // 新闻：30分钟
};

// 请求队列 - 串行控制频率
let requestQueue = [];
let isProcessing = false;
let lastRequestTime = 0;
const MIN_INTERVAL = 12000; // 12秒间隔

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 封装 wx.request 为 Promise
 */
function fetch(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      timeout: 15000,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 检查 API 是否返回限流提示
 */
function isRateLimited(data) {
  if (!data) return true;
  const str = JSON.stringify(data);
  return str.includes('Thank you for using Alpha Vantage') || 
         str.includes('API call frequency') ||
         str.includes('premium endpoint');
}

/**
 * 本地缓存操作
 */
const cache = {
  get(key) {
    try {
      const data = wx.getStorageSync(key);
      if (!data) return null;
      const { value, timestamp, expire } = data;
      if (Date.now() - timestamp > expire) {
        wx.removeStorageSync(key);
        return null;
      }
      return value;
    } catch (e) {
      return null;
    }
  },
  
  set(key, value, expireType) {
    try {
      wx.setStorageSync(key, {
        value,
        timestamp: Date.now(),
        expire: CACHE_EXPIRE[expireType] || CACHE_EXPIRE.metal
      });
    } catch (e) {
      console.error('缓存写入失败:', e);
    }
  }
};

/**
 * 带频率控制的 API 请求
 */
async function apiRequest(url, cacheKey, expireType) {
  // 先检查缓存
  const cached = cache.get(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }
  
  // 频率控制
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL) {
    await delay(MIN_INTERVAL - elapsed);
  }
  
  try {
    const data = await fetch(url);
    lastRequestTime = Date.now();
    
    // 检查是否被限流
    if (isRateLimited(data)) {
      // 尝试返回旧缓存
      const oldCache = wx.getStorageSync(cacheKey);
      if (oldCache && oldCache.value) {
        return { data: oldCache.value, fromCache: true, rateLimited: true };
      }
      throw new Error('API 限流且无缓存');
    }
    
    // 写入缓存
    cache.set(cacheKey, data, expireType);
    return { data, fromCache: false };
  } catch (err) {
    // 失败时尝试返回旧缓存
    const oldCache = wx.getStorageSync(cacheKey);
    if (oldCache && oldCache.value) {
      return { data: oldCache.value, fromCache: true, error: err.message };
    }
    throw err;
  }
}

/**
 * 获取 USD/CNY 汇率
 */
async function getUSDCNYRate() {
  const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CNY&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'fx_usd_cny', 'fx');
  
  let rate = FALLBACK_USD_CNY;
  let isEstimate = true;
  let updateTime = '未知';
  
  if (result.data && result.data['Realtime Exchange Rate']) {
    const fx = result.data['Realtime Exchange Rate'];
    rate = parseFloat(fx['5. Exchange Rate']) || FALLBACK_USD_CNY;
    isEstimate = false;
    updateTime = fx['6. Last Refreshed'] || '未知';
  }
  
  return {
    rate: parseFloat(rate.toFixed(4)),
    isEstimate,
    updateTime,
    fromCache: result.fromCache,
    rateLimited: result.rateLimited
  };
}

/**
 * 获取 BTC/CNY 汇率
 */
async function getBTCCNYRate() {
  const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'fx_btc_cny', 'crypto');
  
  let price = 0;
  let updateTime = '未知';
  
  if (result.data && result.data['Realtime Exchange Rate']) {
    const fx = result.data['Realtime Exchange Rate'];
    price = parseFloat(fx['5. Exchange Rate']) || 0;
    updateTime = fx['6. Last Refreshed'] || '未知';
  }
  
  return {
    price,
    priceWan: (price / 10000).toFixed(2),
    updateTime,
    fromCache: result.fromCache
  };
}

/**
 * 获取黄金现货价格
 */
async function getGoldPrice() {
  const url = `${BASE_URL}?function=GOLD_SILVER_SPOT&symbol=GOLD&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'gold_price', 'metal');
  
  let priceUSD = 0;
  let change = 0;
  let changePercent = 0;
  
  if (result.data) {
    // GOLD_SILVER_SPOT 返回格式
    if (result.data['Realtime Currency Exchange Rate']) {
      const fx = result.data['Realtime Currency Exchange Rate'];
      priceUSD = parseFloat(fx['5. Exchange Rate']) || 0;
    } else if (result.data['Metal Price']) {
      priceUSD = parseFloat(result.data['Metal Price']) || 0;
    } else if (result.data['price']) {
      priceUSD = parseFloat(result.data['price']) || 0;
    }
    // 尝试获取变化值
    if (result.data['change']) {
      change = parseFloat(result.data['change']) || 0;
    }
    if (result.data['change percent']) {
      changePercent = parseFloat(result.data['change percent'].replace('%', '')) || 0;
    }
  }
  
  return {
    priceUSD,
    change,
    changePercent,
    fromCache: result.fromCache
  };
}

/**
 * 获取白银现货价格
 */
async function getSilverPrice() {
  const url = `${BASE_URL}?function=GOLD_SILVER_SPOT&symbol=SILVER&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'silver_price', 'metal');
  
  let priceUSD = 0;
  let change = 0;
  let changePercent = 0;
  
  if (result.data) {
    // GOLD_SILVER_SPOT 返回格式
    if (result.data['Realtime Currency Exchange Rate']) {
      const fx = result.data['Realtime Currency Exchange Rate'];
      priceUSD = parseFloat(fx['5. Exchange Rate']) || 0;
    } else if (result.data['Metal Price']) {
      priceUSD = parseFloat(result.data['Metal Price']) || 0;
    } else if (result.data['price']) {
      priceUSD = parseFloat(result.data['price']) || 0;
    }
    // 尝试获取变化值
    if (result.data['change']) {
      change = parseFloat(result.data['change']) || 0;
    }
    if (result.data['change percent']) {
      changePercent = parseFloat(result.data['change percent'].replace('%', '')) || 0;
    }
  }
  
  return {
    priceUSD,
    change,
    changePercent,
    fromCache: result.fromCache
  };
}

/**
 * 将美元/盎司转换为人民币/克
 */
function convertToCNYPerGram(priceUSD, usdCnyRate) {
  return (priceUSD * usdCnyRate) / TROY_OUNCE_TO_GRAM;
}

/**
 * 获取 CPI 数据
 */
async function getCPIData() {
  const url = `${BASE_URL}?function=CPI&interval=monthly&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'cpi_data', 'macro');
  
  let cpiData = [];
  if (result.data && result.data.data) {
    cpiData = result.data.data.slice(0, 12); // 取最近12个月
  }
  
  return {
    data: cpiData,
    fromCache: result.fromCache
  };
}

/**
 * 获取通胀率
 */
async function getInflationRate() {
  const url = `${BASE_URL}?function=INFLATION&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'inflation_data', 'macro');
  
  let inflationRate = 0;
  if (result.data && result.data.data && result.data.data.length > 0) {
    inflationRate = parseFloat(result.data.data[0].value) || 0;
  }
  
  return {
    rate: inflationRate,
    fromCache: result.fromCache
  };
}

/**
 * 获取区块链新闻情绪
 */
async function getBlockchainNews() {
  const url = `${BASE_URL}?function=NEWS_SENTIMENT&topics=blockchain&limit=5&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'blockchain_news', 'news');
  
  let sentimentScore = 0;
  let news = [];
  
  if (result.data) {
    sentimentScore = result.data.sentiment_score_definition ? 
      (result.data.feed?.[0]?.overall_sentiment_score || 0) : 0;
    
    if (result.data.feed) {
      news = result.data.feed.slice(0, 3).map(item => {
        const score = item.overall_sentiment_score || 0;
        let tag = '中性';
        if (score > 0.3) tag = '利好';
        else if (score < -0.1) tag = '利空';
        
        return {
          title: item.title,
          summary: item.summary,
          url: item.url,
          time: item.time_published,
          sentimentScore: score,
          tag
        };
      });
    }
  }
  
  // 情绪判断
  let sentimentLabel = '平稳';
  if (sentimentScore > 0.3) sentimentLabel = '乐观';
  else if (sentimentScore < -0.1) sentimentLabel = '恐慌/预警';
  
  return {
    sentimentScore,
    sentimentLabel,
    news,
    fromCache: result.fromCache
  };
}

/**
 * 获取热门股票（涨跌幅榜）
 */
async function getTopGainersLosers() {
  const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`;
  const result = await apiRequest(url, 'top_gainers_losers', 'stock');
  
  let gainers = [];
  let losers = [];
  
  if (result.data) {
    if (result.data.top_gainers) {
      // 筛选AI/科技公司
      gainers = result.data.top_gainers
        .filter(item => techStocks[item.ticker])
        .slice(0, 5)
        .map(item => ({
          ticker: item.ticker,
          name: techStocks[item.ticker].name,
          sector: techStocks[item.ticker].sector,
          price: parseFloat(item.price) || 0,
          changeAmount: parseFloat(item.change_amount) || 0,
          changePercent: item.change_percentage,
          volume: item.volume
        }));
    }
    if (result.data.top_losers) {
      // 筛选AI/科技公司
      losers = result.data.top_losers
        .filter(item => techStocks[item.ticker])
        .slice(0, 5)
        .map(item => ({
          ticker: item.ticker,
          name: techStocks[item.ticker].name,
          sector: techStocks[item.ticker].sector,
          price: parseFloat(item.price) || 0,
          changeAmount: parseFloat(item.change_amount) || 0,
          changePercent: item.change_percentage,
          volume: item.volume
        }));
    }
  }
  
  return {
    gainers,
    losers,
    fromCache: result.fromCache
  };
}

/**
 * AI/科技公司白名单 - 含中文名和细分领域
 */
const techStocks = {
  // AI 芯片龙头
  'NVDA': { name: '英伟达', sector: 'AI芯片' },
  'AMD': { name: 'AMD', sector: 'AI芯片' },
  'AVGO': { name: '博通', sector: 'AI芯片' },
  'MRVL': { name: 'Marvell', sector: 'AI芯片' },
  'ARM': { name: 'ARM', sector: '芯片架构' },
  'INTC': { name: '英特尔', sector: '传统芯片' },
  'MU': { name: '美光', sector: '存储芯片' },
  'QCOM': { name: '高通', sector: '移动芯片' },
  
  // AI 大模型/软件
  'MSFT': { name: '微软', sector: 'AI大模型' },
  'GOOGL': { name: '谷歌', sector: 'AI大模型' },
  'META': { name: 'Meta', sector: 'AI大模型' },
  'AAPL': { name: '苹果', sector: 'AI终端' },
  
  // AI 应用/软件
  'CRM': { name: 'Salesforce', sector: 'AI软件' },
  'PLTR': { name: 'Palantir', sector: 'AI大数据' },
  'SNOW': { name: 'Snowflake', sector: '数据平台' },
  'NOW': { name: 'ServiceNow', sector: 'AI企业' },
  'ADBE': { name: 'Adobe', sector: 'AI创意' },
  'WDAY': { name: 'Workday', sector: 'AI企业' },
  
  // 云计算/AI基础设施
  'AMZN': { name: '亚马逊', sector: '云计算' },
  'ORCL': { name: '甲骨文', sector: '云计算' },
  'CSCO': { name: '思科', sector: '网络设备' },
  'SMCI': { name: '超微电脑', sector: 'AI服务器' },
  'DELL': { name: '戴尔', sector: 'AI服务器' },
  'HPE': { name: '慧与', sector: 'AI服务器' },
  
  // 网络安全/AI安全
  'PANW': { name: 'Palo Alto', sector: 'AI安全' },
  'CRWD': { name: 'CrowdStrike', sector: 'AI安全' },
  'ZS': { name: 'Zscaler', sector: '云安全' },
  'FTNT': { name: 'Fortinet', sector: '网络安全' },
  'OKTA': { name: 'Okta', sector: '身份认证' },
  
  // 特斯拉
  'TSLA': { name: '特斯拉', sector: '自动驾驶' },
  
  // EDA/设计
  'SNPS': { name: 'Synopsys', sector: 'EDA工具' },
  'CDNS': { name: 'Cadence', sector: 'EDA工具' },
  
  // 其他科技
  'NFLX': { name: '奈飞', sector: '流媒体' },
  'PYPL': { name: 'PayPal', sector: '金融科技' },
  'SQ': { name: 'Block', sector: '金融科技' },
  'UBER': { name: 'Uber', sector: '出行平台' },
  'ABNB': { name: 'Airbnb', sector: '出行平台' }
};

/**
 * 获取公司中文名
 */
function getCompanyName(ticker) {
  return techStocks[ticker]?.name || ticker;
}

/**
 * 计算购买力损耗
 */
function calculatePurchasingPowerLoss(amount, inflationRate) {
  const loss = amount * (inflationRate / 100);
  return {
    lossAmount: loss.toFixed(2),
    remaining: (amount - loss).toFixed(2),
    lossPercent: inflationRate.toFixed(2)
  };
}

/**
 * 生成财富体检建议
 */
function generateWealthReport(amount, inflationRate, goldChange, btcVolatility) {
  const loss = calculatePurchasingPowerLoss(amount, inflationRate);
  
  let advice = [];
  
  if (inflationRate > 3) {
    advice.push('当前通胀压力较大，建议关注抗通胀资产');
  }
  
  if (goldChange > 0) {
    advice.push('金价处于上升通道，可关注人民币金价的支撑位');
  } else if (goldChange < -2) {
    advice.push('金价回调中，可能是布局黄金的好时机');
  }
  
  if (btcVolatility > 5) {
    advice.push('数字货币波动较大，可小仓位配置作为避险补充');
  } else {
    advice.push('数字货币市场相对平稳，可适度关注');
  }
  
  return {
    ...loss,
    advice: advice.join('；')
  };
}

module.exports = {
  getUSDCNYRate,
  getBTCCNYRate,
  getGoldPrice,
  getSilverPrice,
  convertToCNYPerGram,
  getCPIData,
  getInflationRate,
  getBlockchainNews,
  getTopGainersLosers,
  getCompanyName,
  calculatePurchasingPowerLoss,
  generateWealthReport,
  FALLBACK_USD_CNY
};
