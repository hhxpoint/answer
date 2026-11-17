// 引入依赖库
const nacl = require('./tweetnacl.js'); 
const { Base64 } = require('./base64.js');

// --- 基础配置 ---
const API_KEY = '2f499528a1d74ef09eaab1117233c4ce';
const KID = 'CDGWMH2VUF';
const SUB = '2J2C9TAJHR';

const PRIVATE_KEY_B64 = 'MC4CAQAwBQYDK2VwBCIEICaKMhI1rbpBW4T98kaM9kUingdbx49Ahz50DFuTK1He'; 

const API_HOST = 'mh4up52ny2.re.qweatherapi.com';
const BASE_URL = `https://${API_HOST}/v7`;

const GEO_URL = `https://${API_HOST}/geo/v2`;

// --- JWT 核心工具函数 ---
const stringToUint8Array = (str) => {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};

const toBase64Url = (str) => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const generateJWT = () => {
  try {
    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + 900;

    const header = { alg: "EdDSA", kid: KID };
    const payload = { sub: SUB, iat: iat, exp: exp };

    const sHeader = toBase64Url(Base64.encode(JSON.stringify(header)));
    const sPayload = toBase64Url(Base64.encode(JSON.stringify(payload)));
    const dataToSign = `${sHeader}.${sPayload}`;

    const privateKeyUint8 = Base64.toUint8Array(PRIVATE_KEY_B64);
    
    let seed = privateKeyUint8;
    if (seed.length > 32) {
      seed = seed.slice(-32);
    }

    const keyPair = nacl.sign.keyPair.fromSeed(seed);
    const signature = nacl.sign.detached(
      stringToUint8Array(dataToSign), 
      keyPair.secretKey
    );

    const sSignature = toBase64Url(Base64.fromUint8Array(signature));
    return `${dataToSign}.${sSignature}`;
  } catch (e) {
    console.error('JWT 生成失败:', e);
    return null;
  }
};

// --- 网络请求封装 ---
const request = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: { ...data, key: API_KEY },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === '200') {
          resolve(res.data);
        } else {
          reject(new Error(`API错误: ${res.data.code || res.statusCode}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
};

// JWT请求封装
const jwtRequest = (url) => {
  return new Promise((resolve, reject) => {
    const token = generateJWT();
    if (!token) {
      reject(new Error('JWT Token 生成失败'));
      return;
    }
    
    wx.request({
      url,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'gzip'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`API错误: ${res.statusCode}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
};

// 实时天气
const getWeatherNow = (location) => {
  return request(`${BASE_URL}/weather/now`, { location });
};

// 24小时预报
const getHourly = (location) => {
  return request(`${BASE_URL}/weather/24h`, { location });
};

// 7天预报
const getDaily = (location) => {
  return request(`${BASE_URL}/weather/7d`, { location });
};

// 空气质量（旧版API）
const getAir = (location) => {
  return request(`${BASE_URL}/air/now`, { location });
};

// 空气质量实时API（新版）
const getAirQualityV1 = (latitude, longitude) => {
  const lat = String(latitude);
  const lon = String(longitude);
  return jwtRequest(`https://${API_HOST}/airquality/v1/current/${lat}/${lon}`);
};

// 空气质量小时预报API（新版）
const getAirQualityHourly = (latitude, longitude) => {
  const lat = String(latitude);
  const lon = String(longitude);
  return jwtRequest(`https://${API_HOST}/airquality/v1/hourly/${lat}/${lon}`);
};

// 生活指数 - 中国城市支持16种，海外支持4种
// 1:运动 2:洗车 3:穿衣 4:钓鱼 5:紫外线 6:旅游 7:花粉 8:过敏 
// 9:舒适度 10:感冒 11:太阳镜 12:化妆 13:晾晒 14:交通 15:防晒 16:空调开启
// 17:空气污染扩散条件
const INDICES_TYPE_CHINA = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16';
const INDICES_TYPE_GLOBAL = '1,2,5,4';

// 获取生活指数（中国城市）
const getIndices = (location, isChina = true) => {
  const type = isChina ? INDICES_TYPE_CHINA : INDICES_TYPE_GLOBAL;
  return request(`${BASE_URL}/indices/1d`, { location, type });
};

// 获取生活指数（3天预报）
const getIndices3d = (location, isChina = true) => {
  const type = isChina ? INDICES_TYPE_CHINA : INDICES_TYPE_GLOBAL;
  return request(`${BASE_URL}/indices/3d`, { location, type });
};

// 天气灾害预警
const getWarning = (location) => {
  return request(`${BASE_URL}/warning/now`, { location });
};

// 城市搜索
const getCity = (location) => {
  return jwtRequest(`${GEO_URL}/city/lookup?location=${encodeURIComponent(location)}`);
};

// 热门城市列表
const getTopCity = (number = 10, range = '') => {
  let url = `${GEO_URL}/city/top?number=${number}`;
  if (range) {
    url += `&range=${encodeURIComponent(range)}`;
  }
  return jwtRequest(url);
};

// 格式化坐标显示
const formatCoords = (longitude, latitude) => {
  return `${longitude.toFixed(2)}°E, ${latitude.toFixed(2)}°N`;
};

// 获取当前位置
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve(`${res.longitude.toFixed(2)},${res.latitude.toFixed(2)}`);
      },
      fail: (err) => {
        console.error('定位失败:', err);
        reject(err);
      }
    });
  });
};

// 风向角度转文字
const getWindDir = (deg) => {
  if (deg === undefined || deg === null) return '--';
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  return dirs[Math.round(deg / 45) % 8] + '风';
};

// 天气图标映射
const getIcon = (code, isNight = false) => {
  const iconMap = {
    '100': isNight ? '🌙' : '☀️',
    '101': isNight ? '🌙' : '⛅',
    '102': '☁️',
    '103': isNight ? '☁️' : '🌤️',
    '104': '☁️',
    '150': '🌙',
    '151': '☁️',
    '152': '☁️',
    '153': '☁️',
    '300': '🌦️',
    '301': '🌧️',
    '302': '⛈️',
    '303': '⛈️',
    '304': '⛈️',
    '305': '🌧️',
    '306': '🌧️',
    '307': '🌧️',
    '308': '🌧️',
    '309': '🌧️',
    '310': '🌧️',
    '311': '🌧️',
    '312': '🌧️',
    '313': '🌧️',
    '314': '🌧️',
    '315': '🌧️',
    '316': '🌧️',
    '317': '🌧️',
    '318': '🌧️',
    '399': '🌧️',
    '400': '❄️',
    '401': '❄️',
    '402': '❄️',
    '403': '❄️',
    '404': '🌨️',
    '405': '🌨️',
    '406': '🌨️',
    '407': '❄️',
    '408': '❄️',
    '409': '❄️',
    '410': '❄️',
    '499': '❄️',
    '500': '🌫️',
    '501': '🌫️',
    '502': '🌫️',
    '503': '🌪️',
    '504': '🌪️',
    '507': '🌪️',
    '508': '🌪️',
    '509': '🌫️',
    '510': '🌫️',
    '511': '🌫️',
    '512': '🌫️',
    '513': '🌫️',
    '514': '🌫️',
    '515': '🌫️',
    '900': '🌡️',
    '901': '❄️',
    '999': '❓'
  };
  return iconMap[String(code)] || '🌤️';
};

// 生活指数图标映射
const getIndexIcon = (type) => {
  const icons = {
    '1': '🏃',   // 运动
    '2': '🚗',   // 洗车
    '3': '👔',   // 穿衣
    '4': '🎣',   // 钓鱼
    '5': '☀️',   // 紫外线
    '6': '✈️',   // 旅游
    '7': '🌸',   // 花粉
    '8': '🤧',   // 过敏
    '9': '😊',   // 舒适度
    '10': '🤒',  // 感冒
    '11': '🕶️',  // 太阳镜
    '12': '💄',  // 化妆
    '13': '👕',  // 晾晒
    '14': '🚦',  // 交通
    '15': '🧴',  // 防晒
    '16': '❄️'   // 空调开启
  };
  return icons[String(type)] || '📋';
};

// 生活指数名称映射
const getIndexName = (type) => {
  const names = {
    '1': '运动',
    '2': '洗车',
    '3': '穿衣',
    '4': '钓鱼',
    '5': '紫外线',
    '6': '旅游',
    '7': '花粉',
    '8': '过敏',
    '9': '舒适度',
    '10': '感冒',
    '11': '太阳镜',
    '12': '化妆',
    '13': '晾晒',
    '14': '交通',
    '15': '防晒',
    '16': '空调'
  };
  return names[String(type)] || '指数';
};

// 生活指数等级颜色
const getIndexLevelColor = (level) => {
  const colors = {
    '1': '#00b894',  // 适宜/一级
    '2': '#00cec9',  // 较适宜/二级
    '3': '#fdcb6e',  // 一般/三级
    '4': '#e17055',  // 较不宜/四级
    '5': '#d63031',  // 不宜/五级
    '6': '#6c5ce7'   // 极不宜/六级
  };
  return colors[String(level)] || '#74b9ff';
};

// 日期格式化
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return '今天';
  if (date.toDateString() === tomorrow.toDateString()) return '明天';
  
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekDays[date.getDay()];
};

// 小时格式化
const formatHour = (timeStr) => {
  const hour = parseInt(timeStr) / 100;
  return `${hour.toString().padStart(2, '0')}:00`;
};

// AQI等级颜色
const getAqiColor = (aqi) => {
  if (!aqi || aqi === '--') return 'rgba(255,255,255,0.2)';
  const v = parseFloat(aqi);
  if (v <= 50) return '#00b894';
  if (v <= 100) return '#fdcb6e';
  if (v <= 150) return '#e17055';
  if (v <= 200) return '#d63031';
  if (v <= 300) return '#6c5ce7';
  return '#2d3436';
};

// AQI等级文字
const getAqiLevel = (aqi) => {
  if (!aqi) return { level: '--', category: '暂无数据' };
  const v = parseFloat(aqi);
  if (v <= 50) return { level: '1', category: '优' };
  if (v <= 100) return { level: '2', category: '良' };
  if (v <= 150) return { level: '3', category: '轻度污染' };
  if (v <= 200) return { level: '4', category: '中度污染' };
  if (v <= 300) return { level: '5', category: '重度污染' };
  return { level: '6', category: '严重污染' };
};

// 格式化时间显示
const formatTimeDisplay = (isoTime) => {
  if (!isoTime) return '--';
  const date = new Date(isoTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 获取小时显示
const getHourFromISO = (isoTime) => {
  if (!isoTime) return '--';
  const date = new Date(isoTime);
  return `${date.getHours().toString().padStart(2, '0')}:00`;
};

module.exports = {
  getWeatherNow,
  getHourly,
  getDaily,
  getAir,
  getAirQualityV1,
  getAirQualityHourly,
  getIndices,
  getIndices3d,
  getWarning,
  getCity,
  getTopCity,
  formatCoords,
  getCurrentLocation,
  getWindDir,
  getIcon,
  getIndexIcon,
  getIndexName,
  getIndexLevelColor,
  formatDate,
  formatHour,
  getAqiColor,
  getAqiLevel,
  formatTimeDisplay,
  getHourFromISO,
  INDICES_TYPE_CHINA,
  INDICES_TYPE_GLOBAL
};
