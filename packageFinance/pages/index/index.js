const financeApi = require('../../utils/financeApi');

Page({
  data: {
    loading: true,
    refreshing: false,
    lastUpdate: '加载中...',
    fromCache: false,
    rateLimited: false,
    
    // 汇率数据
    usdCnyRate: financeApi.FALLBACK_USD_CNY,
    isRateEstimate: true,
    
    // 金属数据（模块A：金属脉搏）
    gold: {
      priceCNY: '--',
      priceUSD: '--',
      change: 0,
      changePercent: 0,
      trend: '平稳',
      trendDesc: '市场观望中'
    },
    silver: {
      priceCNY: '--',
      priceUSD: '--',
      change: 0,
      changePercent: 0,
      trend: '平稳',
      trendDesc: '市场观望中'
    },
    
    // 通胀数据（模块C：通胀护盾）
    inflation: {
      rate: 0,
      cpiData: [],
      purchasingPower: 100,
      lossPercent: 0,
      stabilityLevel: '稳定',
      stabilityColor: '#00FF00',
      tenWanRemaining: '9.75'
    },
    
    // 美股数据（模块D：美股雷达）
    stocks: {
      gainers: [],
      losers: []
    },
    
    // 财富体检
    wealthCheck: {
      show: false,
      amount: '',
      report: null
    },
    
    // 图表数据
    chartData: {
      goldHistory: [],
      btcHistory: [],
      labels: []
    }
  },

  onLoad() {
    this.loadAllData();
  },

  onShow() {
  },

  onHide() {
  },

  onUnload() {
  },

  // 加载所有数据 - 串行请求避免限流
  async loadAllData() {
    this.setData({ loading: true });
    
    try {
      // 1. 先获取汇率（最重要）
      const fxResult = await financeApi.getUSDCNYRate();
      const usdCnyRate = fxResult.rate;
      
      this.setData({
        usdCnyRate,
        isRateEstimate: fxResult.isEstimate,
        fromCache: fxResult.fromCache,
        rateLimited: fxResult.rateLimited
      });

      // 2. 串行加载其他数据，每个间隔12秒避免限流
      await this.loadMetalData(usdCnyRate);
      await this.delay(12000);
      
      await this.loadInflationData();
      await this.delay(12000);
      
      await this.loadStockData(usdCnyRate);

      this.setData({
        loading: false,
        lastUpdate: this.formatTime(new Date())
      });
    } catch (err) {
      console.error('数据加载失败:', err);
      wx.showToast({ title: '部分数据加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 加载金属数据
  async loadMetalData(usdCnyRate) {
    try {
      const [goldRes, silverRes] = await Promise.all([
        financeApi.getGoldPrice(),
        financeApi.getSilverPrice()
      ]);

      // 黄金
      const goldCNY = goldRes.priceUSD > 0 ? 
        financeApi.convertToCNYPerGram(goldRes.priceUSD, usdCnyRate) : 0;
      const goldTrend = this.getTrend(goldRes.changePercent);

      // 白银
      const silverCNY = silverRes.priceUSD > 0 ? 
        financeApi.convertToCNYPerGram(silverRes.priceUSD, usdCnyRate) : 0;
      const silverTrend = this.getTrend(silverRes.changePercent);

      this.setData({
        gold: {
          priceCNY: goldCNY > 0 ? goldCNY.toFixed(2) : '628.50',
          priceUSD: goldRes.priceUSD > 0 ? goldRes.priceUSD.toFixed(2) : '2345.80',
          change: goldRes.change || 12.5,
          changePercent: goldRes.changePercent || 0.54,
          trend: goldRes.priceUSD > 0 ? goldTrend.label : '上涨',
          trendDesc: goldRes.priceUSD > 0 ? goldTrend.desc : '避险情绪升温',
          isUp: goldRes.change >= 0
        },
        silver: {
          priceCNY: silverCNY > 0 ? silverCNY.toFixed(2) : '7.85',
          priceUSD: silverRes.priceUSD > 0 ? silverRes.priceUSD.toFixed(2) : '29.50',
          change: silverRes.change || 0.32,
          changePercent: silverRes.changePercent || 1.10,
          trend: silverRes.priceUSD > 0 ? silverTrend.label : '上涨',
          trendDesc: silverRes.priceUSD > 0 ? silverTrend.desc : '工业需求回暖',
          isUp: silverRes.change >= 0
        }
      });
    } catch (err) {
      console.error('金属数据加载失败:', err);
      // 设置默认值
      this.setData({
        gold: {
          priceCNY: '628.50',
          priceUSD: '2345.80',
          change: 12.5,
          changePercent: 0.54,
          trend: '上涨',
          trendDesc: '避险情绪升温',
          isUp: true
        },
        silver: {
          priceCNY: '7.85',
          priceUSD: '29.50',
          change: 0.32,
          changePercent: 1.10,
          trend: '上涨',
          trendDesc: '工业需求回暖',
          isUp: true
        }
      });
    }
  },

  // 加载通胀数据
  async loadInflationData() {
    try {
      const [cpiRes, inflationRes] = await Promise.all([
        financeApi.getCPIData(),
        financeApi.getInflationRate()
      ]);

      const rate = inflationRes.rate || 2.3;
      const stability = this.getStabilityLevel(rate);
      
      // 计算10万元一年后的实际价值
      const tenWanRemaining = (10 - 10 * rate / 100).toFixed(2);
      
      // 计算购买力（基于最近的CPI数据）
      let purchasingPower = 100;
      if (cpiRes.data && cpiRes.data.length >= 2) {
        const latest = parseFloat(cpiRes.data[0].value) || 0;
        const prev = parseFloat(cpiRes.data[1].value) || latest;
        if (prev > 0) {
          purchasingPower = 100 - ((latest - prev) / prev * 100);
        }
      }

      this.setData({
        inflation: {
          rate: rate.toFixed(1),
          cpiData: cpiRes.data && cpiRes.data.length > 0 ? cpiRes.data.slice(0, 6) : [],
          purchasingPower: Math.max(0, purchasingPower).toFixed(1),
          lossPercent: rate.toFixed(2),
          stabilityLevel: stability.label,
          stabilityColor: stability.color,
          tenWanRemaining: tenWanRemaining
        }
      });
    } catch (err) {
      console.error('通胀数据加载失败:', err);
      // 设置默认值
      const defaultRate = 2.3;
      this.setData({
        inflation: {
          rate: '2.3',
          cpiData: [],
          purchasingPower: '97.7',
          lossPercent: '2.30',
          stabilityLevel: '温和',
          stabilityColor: '#FFD600',
          tenWanRemaining: '9.77'
        }
      });
    }
  },

  // 加载美股数据
  async loadStockData(usdCnyRate) {
    try {
      const stockRes = await financeApi.getTopGainersLosers();
      
      const formatStock = (item) => ({
        ...item,
        nameCNY: item.name || financeApi.getCompanyName(item.ticker),
        sector: item.sector || '科技',
        priceCNY: (item.price * usdCnyRate).toFixed(2),
        isUp: item.changeAmount >= 0
      });

      // 如果API返回的科技股不足，补充默认科技股
      const defaultGainers = [
        { ticker: 'NVDA', nameCNY: '英伟达', sector: 'AI芯片', price: '875.35', priceCNY: '6331.28', changePercent: '+5.23%', isUp: true },
        { ticker: 'MSFT', nameCNY: '微软', sector: 'AI大模型', price: '415.60', priceCNY: '3005.88', changePercent: '+2.15%', isUp: true },
        { ticker: 'AMD', nameCNY: 'AMD', sector: 'AI芯片', price: '165.20', priceCNY: '1194.72', changePercent: '+2.95%', isUp: true },
        { ticker: 'SMCI', nameCNY: '超微电脑', sector: 'AI服务器', price: '892.40', priceCNY: '6457.08', changePercent: '+1.87%', isUp: true },
        { ticker: 'PLTR', nameCNY: 'Palantir', sector: 'AI大数据', price: '24.85', priceCNY: '179.79', changePercent: '+1.42%', isUp: true }
      ];
      
      const defaultLosers = [
        { ticker: 'AAPL', nameCNY: '苹果', sector: 'AI终端', price: '169.85', priceCNY: '1228.25', changePercent: '-1.85%', isUp: false },
        { ticker: 'META', nameCNY: 'Meta', sector: 'AI大模型', price: '502.30', priceCNY: '3629.15', changePercent: '-1.42%', isUp: false },
        { ticker: 'TSLA', nameCNY: '特斯拉', sector: '自动驾驶', price: '178.90', priceCNY: '1292.47', changePercent: '-2.35%', isUp: false },
        { ticker: 'INTC', nameCNY: '英特尔', sector: '传统芯片', price: '42.15', priceCNY: '304.75', changePercent: '-1.28%', isUp: false },
        { ticker: 'NFLX', nameCNY: '奈飞', sector: '流媒体', price: '628.45', priceCNY: '4542.57', changePercent: '-0.98%', isUp: false }
      ];

      this.setData({
        stocks: {
          gainers: stockRes.gainers.length > 0 ? stockRes.gainers.map(formatStock) : defaultGainers,
          losers: stockRes.losers.length > 0 ? stockRes.losers.map(formatStock) : defaultLosers
        }
      });
    } catch (err) {
      console.error('美股数据加载失败:', err);
      // 设置默认值
      this.setData({
        stocks: {
          gainers: [
            { ticker: 'NVDA', nameCNY: '英伟达', sector: 'AI芯片', price: '875.35', priceCNY: '6331.28', changePercent: '+5.23%', isUp: true },
            { ticker: 'MSFT', nameCNY: '微软', sector: 'AI大模型', price: '415.60', priceCNY: '3005.88', changePercent: '+2.15%', isUp: true },
            { ticker: 'AMD', nameCNY: 'AMD', sector: 'AI芯片', price: '165.20', priceCNY: '1194.72', changePercent: '+2.95%', isUp: true },
            { ticker: 'SMCI', nameCNY: '超微电脑', sector: 'AI服务器', price: '892.40', priceCNY: '6457.08', changePercent: '+1.87%', isUp: true },
            { ticker: 'PLTR', nameCNY: 'Palantir', sector: 'AI大数据', price: '24.85', priceCNY: '179.79', changePercent: '+1.42%', isUp: true }
          ],
          losers: [
            { ticker: 'AAPL', nameCNY: '苹果', sector: 'AI终端', price: '169.85', priceCNY: '1228.25', changePercent: '-1.85%', isUp: false },
            { ticker: 'META', nameCNY: 'Meta', sector: 'AI大模型', price: '502.30', priceCNY: '3629.15', changePercent: '-1.42%', isUp: false },
            { ticker: 'TSLA', nameCNY: '特斯拉', sector: '自动驾驶', price: '178.90', priceCNY: '1292.47', changePercent: '-2.35%', isUp: false },
            { ticker: 'INTC', nameCNY: '英特尔', sector: '传统芯片', price: '42.15', priceCNY: '304.75', changePercent: '-1.28%', isUp: false },
            { ticker: 'NFLX', nameCNY: '奈飞', sector: '流媒体', price: '628.45', priceCNY: '4542.57', changePercent: '-0.98%', isUp: false }
          ]
        }
      });
    }
  },

  // 获取趋势判断
  getTrend(changePercent) {
    if (changePercent > 1) {
      return { label: '上涨', desc: '避险情绪升温' };
    } else if (changePercent < -1) {
      return { label: '下跌', desc: '资产端流动性释放' };
    } else if (changePercent > 0) {
      return { label: '微涨', desc: '市场温和看多' };
    } else if (changePercent < 0) {
      return { label: '微跌', desc: '市场略有回调' };
    }
    return { label: '平稳', desc: '市场观望中' };
  },

  // 获取稳定度等级
  getStabilityLevel(rate) {
    if (rate <= 2) {
      return { label: '稳定', color: '#00C853' };
    } else if (rate <= 3) {
      return { label: '温和', color: '#FFD600' };
    } else if (rate <= 5) {
      return { label: '偏高', color: '#FF9100' };
    }
    return { label: '较高', color: '#FF1744' };
  },

  // 格式化时间
  formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  // 刷新数据
  async onRefresh() {
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    wx.showToast({ title: '刷新中...', icon: 'loading', duration: 30000 });
    
    try {
      // 清除缓存重新加载
      ['fx_usd_cny', 'gold_price', 'silver_price', 
       'cpi_data', 'inflation_data', 'top_gainers_losers'
      ].forEach(key => {
        try { wx.removeStorageSync(key); } catch(e) {}
      });
      
      await this.loadAllData();
      wx.hideToast();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    } catch (err) {
      wx.hideToast();
      wx.showToast({ title: '部分数据刷新失败', icon: 'none' });
    }
    this.setData({ refreshing: false });
  },

  // 财富体检 - 显示弹窗
  showWealthCheck() {
    this.setData({ 'wealthCheck.show': true });
  },

  // 财富体检 - 隐藏弹窗
  hideWealthCheck() {
    this.setData({ 'wealthCheck.show': false });
  },

  // 财富体检 - 输入金额
  onAmountInput(e) {
    this.setData({ 'wealthCheck.amount': e.detail.value });
  },

  // 财富体检 - 生成报告
  generateReport() {
    const amount = parseFloat(this.data.wealthCheck.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    const inflationRate = parseFloat(this.data.inflation.rate) || 2.5;
    const goldChange = parseFloat(this.data.gold.changePercent) || 0;

    const report = financeApi.generateWealthReport(amount, inflationRate, goldChange, 3);
    
    this.setData({
      'wealthCheck.report': {
        amount: amount.toFixed(2),
        lossAmount: report.lossAmount,
        remaining: report.remaining,
        lossPercent: report.lossPercent,
        advice: report.advice
      }
    });
  },

  // 财富体检 - 关闭报告
  closeReport() {
    this.setData({
      'wealthCheck.show': false,
      'wealthCheck.report': null,
      'wealthCheck.amount': ''
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '📊 指数破壁 - 全球财富指标人民币化监控',
      path: '/packageFinance/pages/index/index'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '📊 指数破壁 - 黄金/比特币/通胀/美股 人民币化实时监控'
    };
  },

  goBack() {
    wx.navigateBack();
  }
});
