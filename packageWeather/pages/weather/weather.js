const weatherApi = require('../../utils/weatherApi.js');

Page({
  data: {
    loading: true,
    cityName: '定位中...',
    location: '',
    weatherNow: {},
    weatherIcon: '🌤️',
    windDir: '--',
    hourlyForecast: [],
    dailyForecast: [],
    airQuality: {},
    airQualityHourly: [],
    aqiColor: 'rgba(255,255,255,0.2)',
    lifeIndex: [],
    lifeIndexExpanded: false,
    activeLifeTab: 'china',
    warningList: [],
    bgGradient: 'linear-gradient(180deg, #74b9ff 0%, #a8e6cf 100%)',
    showSearchPanel: false,
    searchKeyword: '',
    searchResults: [],
    lastUpdate: ''
  },

  searchTimer: null,

  onLoad() {
    this.initWeather();
  },

  async initWeather() {
    this.setData({ loading: true });
    try {
      let location;
      try {
        location = await weatherApi.getCurrentLocation();
      } catch (e) {
        location = '116.41,39.92';
        wx.showToast({ title: '定位失败，使用北京', icon: 'none' });
      }
      await this.fetchAllData(location);
    } catch (err) {
      console.error('初始化失败:', err);
      wx.showToast({ title: '数据加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async fetchAllData(location) {
    try {
      const [nowRes, hourlyRes, dailyRes, indicesRes, warnRes] = await Promise.all([
        weatherApi.getWeatherNow(location),
        weatherApi.getHourly(location),
        weatherApi.getDaily(location),
        weatherApi.getIndices(location, true).catch(() => ({ daily: [] })),
        weatherApi.getWarning(location).catch(() => ({ warning: [] }))
      ]);

      // 空气质量单独请求
      let airRes = { now: {} };
      let airHourlyData = [];
      if (location && location.includes(',')) {
        const [lon, lat] = location.split(',');
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        try {
          // 实时空气质量
          const airData = await weatherApi.getAirQualityV1(latitude, longitude);
          if (airData.indexes && airData.indexes.length > 0) {
            const qaqiIndex = airData.indexes.find(idx => idx.code === 'qaqi') || airData.indexes[0];
            const usEpaIndex = airData.indexes.find(idx => idx.code === 'us-epa');
            
            // 获取污染物数据
            let pollutants = {};
            if (airData.pollutants) {
              airData.pollutants.forEach(p => {
                pollutants[p.code] = {
                  value: p.concentration?.value || '--',
                  unit: p.concentration?.unit || ''
                };
              });
            }
            
            airRes = {
              now: {
                aqi: qaqiIndex.aqi || '--',
                aqiDisplay: qaqiIndex.aqiDisplay || '--',
                level: qaqiIndex.level || '--',
                category: qaqiIndex.category || '--',
                color: qaqiIndex.color || null,
                primary: qaqiIndex.primaryPollutant ? qaqiIndex.primaryPollutant.name : '--',
                effect: qaqiIndex.health?.effect || '',
                generalAdvice: qaqiIndex.health?.advice?.generalPopulation || '',
                sensitiveAdvice: qaqiIndex.health?.advice?.sensitivePopulation || '',
                usEpa: usEpaIndex ? {
                  aqi: usEpaIndex.aqi,
                  category: usEpaIndex.category
                } : null,
                pollutants: pollutants
              }
            };
          }
        } catch (e) {
          console.error('新版空气质量API失败:', e);
          try {
            airRes = await weatherApi.getAir(location);
          } catch (e2) {
            console.error('旧版空气质量API也失败:', e2);
          }
        }

        // 小时空气质量预报
        try {
          const hourlyAirData = await weatherApi.getAirQualityHourly(latitude, longitude);
          if (hourlyAirData.hours && hourlyAirData.hours.length > 0) {
            airHourlyData = hourlyAirData.hours.slice(0, 24).map(h => {
              const qaqi = h.indexes?.find(idx => idx.code === 'qaqi') || h.indexes?.[0];
              return {
                time: weatherApi.getHourFromISO(h.forecastTime),
                aqi: qaqi?.aqi?.toFixed(1) || '--',
                level: qaqi?.level || '--',
                category: qaqi?.category || '--',
                color: qaqi?.color ? 
                  `rgba(${qaqi.color.red},${qaqi.color.green},${qaqi.color.blue},${qaqi.color.alpha})` : 
                  weatherApi.getAqiColor(qaqi?.aqi)
              };
            });
          }
        } catch (e) {
          console.error('小时空气质量预报失败:', e);
        }
      }

      // 获取城市名
      let cityName = '当前位置';
      try {
        if (location && location.includes(',')) {
          const [lon, lat] = location.split(',');
          const cityRes = await weatherApi.getCity(location);
          if (cityRes.location && cityRes.location.length > 0) {
            cityName = cityRes.location[0].name;
          } else {
            cityName = weatherApi.formatCoords(parseFloat(lon), parseFloat(lat));
          }
        }
      } catch (e) {
        console.error('获取城市名失败:', e);
        if (location && location.includes(',')) {
          const [lon, lat] = location.split(',');
          cityName = weatherApi.formatCoords(parseFloat(lon), parseFloat(lat));
        }
      }

      const now = nowRes.now || {};
      const iconCode = now.icon;
      const isNight = parseInt(iconCode) >= 150 && parseInt(iconCode) <= 153;

      // 动态背景
      let bg = 'linear-gradient(180deg, #74b9ff 0%, #a8e6cf 100%)';
      const code = parseInt(iconCode);
      if (isNight) {
        bg = 'linear-gradient(180deg, #2d3436 0%, #6c5ce7 100%)';
      } else if (code >= 300 && code < 400) {
        bg = 'linear-gradient(180deg, #636e72 0%, #a29bfe 100%)';
      } else if (code >= 400 && code < 500) {
        bg = 'linear-gradient(180deg, #b2bec3 0%, #dfe6e9 100%)';
      } else if (code >= 500) {
        bg = 'linear-gradient(180deg, #636e72 0%, #b2bec3 100%)';
      }

      // 处理24小时预报
      const hourly = (hourlyRes.hourly || []).slice(0, 24).map(item => {
        const hour = parseInt(item.fxTime.split('T')[1]) || 0;
        return {
          time: `${hour.toString().padStart(2, '0')}:00`,
          icon: weatherApi.getIcon(item.icon, hour < 6 || hour >= 18),
          temp: item.temp,
          text: item.text,
          humidity: item.humidity,
          windSpeed: item.windSpeed
        };
      });

      // 处理7天预报
      const allTemps = (dailyRes.daily || []).reduce((arr, item) => {
        arr.push(parseInt(item.tempMin), parseInt(item.tempMax));
        return arr;
      }, []);
      const minT = Math.min(...allTemps);
      const maxT = Math.max(...allTemps);
      const range = maxT - minT || 1;

      const daily = (dailyRes.daily || []).map((item, idx) => {
        const left = ((parseInt(item.tempMin) - minT) / range) * 100;
        const width = ((parseInt(item.tempMax) - parseInt(item.tempMin)) / range) * 100;
        return {
          date: idx === 0 ? '今天' : idx === 1 ? '明天' : weatherApi.formatDate(item.fxDate),
          fxDate: item.fxDate,
          iconDay: weatherApi.getIcon(item.iconDay, false),
          iconNight: weatherApi.getIcon(item.iconNight, true),
          tempMin: item.tempMin,
          tempMax: item.tempMax,
          tempLeft: left,
          tempWidth: Math.max(width, 5),
          textDay: item.textDay,
          textNight: item.textNight,
          humidity: item.humidity,
          windDirDay: weatherApi.getWindDir(item.wind360Day),
          windSpeedDay: item.windSpeedDay,
          uvIndex: item.uvIndex,
          sunrise: item.sunrise,
          sunset: item.sunset
        };
      });

      // 处理空气质量
      const air = airRes.now || {};
      const aqiColor = air.color ? 
        `rgba(${air.color.red},${air.color.green},${air.color.blue},${air.color.alpha})` :
        weatherApi.getAqiColor(air.aqi);

      // 处理生活指数 - 按类别分组
      const lifeIndex = (indicesRes.daily || []).map(item => ({
        type: item.type,
        icon: weatherApi.getIndexIcon(item.type),
        name: weatherApi.getIndexName(item.type),
        level: item.level,
        category: item.category,
        text: item.text,
        color: weatherApi.getIndexLevelColor(item.level),
        date: item.date
      }));

      // 分类生活指数
      const todayLifeIndex = lifeIndex.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        return item.date === today;
      });

      // 处理预警
      const warningList = (warnRes.warning || []).map(w => ({
        title: w.title,
        level: w.severity,
        type: w.typeName,
        text: w.text
      }));

      this.setData({
        loading: false,
        location,
        cityName,
        weatherNow: {
          temp: now.temp || '--',
          feelsLike: now.feelsLike || '--',
          humidity: now.humidity || '--',
          pressure: now.pressure || '--',
          vis: now.vis || '--',
          windSpeed: now.windSpeed || '--',
          wind360: now.wind360,
          text: now.text || '--',
          icon: now.icon,
          dew: now.dew || '--',
          cloud: now.cloud || '--'
        },
        weatherIcon: weatherApi.getIcon(iconCode, isNight),
        windDir: weatherApi.getWindDir(now.wind360),
        hourlyForecast: hourly,
        dailyForecast: daily,
        airQuality: air,
        airQualityHourly: airHourlyData,
        aqiColor,
        lifeIndex: todayLifeIndex,
        warningList,
        bgGradient: bg,
        lastUpdate: weatherApi.formatTimeDisplay(nowRes.updateTime)
      });
    } catch (err) {
      console.error('数据获取失败:', err);
      wx.showToast({ title: '数据请求异常', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  refreshData() {
    if (this.data.location) {
      this.setData({ loading: true });
      this.fetchAllData(this.data.location);
    } else {
      this.initWeather();
    }
  },

  showSearch() {
    this.setData({ showSearchPanel: true, searchKeyword: '', searchResults: [] });
  },

  hideSearch() {
    this.setData({ showSearchPanel: false });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (!keyword.trim()) {
      this.setData({ searchResults: [] });
      return;
    }
    this.searchTimer = setTimeout(async () => {
      try {
        const res = await weatherApi.getCity(keyword);
        this.setData({ searchResults: res.location || [] });
      } catch (err) {
        this.setData({ searchResults: [] });
      }
    }, 500);
  },

  async selectCity(e) {
    const { location, name } = e.currentTarget.dataset;
    this.setData({ showSearchPanel: false, loading: true, cityName: name });
    await this.fetchAllData(location);
  },

  toggleLifeIndex() {
    this.setData({ lifeIndexExpanded: !this.data.lifeIndexExpanded });
  },

  switchLifeTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeLifeTab: tab });
  },

  showIndexDetail(e) {
    const { text, name } = e.currentTarget.dataset;
    if (text) {
      wx.showModal({
        title: name,
        content: text,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  // 分享给朋友
  onShareAppMessage() {
    const { cityName, weatherNow } = this.data;
    const temp = weatherNow.temp || '--';
    const text = weatherNow.text || '晴';
    return {
      title: `🌤 ${cityName} ${temp}°C ${text} - 来看看你那里的天气吧！`,
      path: '/packageWeather/pages/weather/weather'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { cityName, weatherNow } = this.data;
    const temp = weatherNow.temp || '--';
    return {
      title: `🌤 ${cityName} ${temp}°C - 实时天气查询`
    };
  }
});
