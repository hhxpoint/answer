const API_KEY = 'G___UGX6WTA2YYwcGz0BgKBN47BozGtW';
const BASE_URL = 'https://api.blockchair.com';

const CHAINS = [
  { key: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { key: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { key: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', color: '#8DC351' },
  { key: 'litecoin', name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
  { key: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
  { key: 'dash', name: 'Dash', symbol: 'DASH', color: '#008CE7' },
  { key: 'ripple', name: 'Ripple', symbol: 'XRP', color: '#00AAE4' },
  { key: 'stellar', name: 'Stellar', symbol: 'XLM', color: '#14B6E7' },
  { key: 'cardano', name: 'Cardano', symbol: 'ADA', color: '#0033AD' },
  { key: 'monero', name: 'Monero', symbol: 'XMR', color: '#FF6600' },
  { key: 'zcash', name: 'Zcash', symbol: 'ZEC', color: '#ECB244' },
  { key: 'bitcoin-sv', name: 'Bitcoin SV', symbol: 'BSV', color: '#EAB300' },
  { key: 'groestlcoin', name: 'Groestlcoin', symbol: 'GRS', color: '#3E9C35' },
  { key: 'mixin', name: 'Mixin', symbol: 'XIN', color: '#4A90D9' },
  { key: 'ecash', name: 'eCash', symbol: 'XEC', color: '#0AC18E' },
];

function fmtNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '--';
  n = Number(n);
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'P';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  if (n >= 1000) return (n / 1e3).toFixed(2) + 'K';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function fmtPrice(p) {
  if (!p) return '--';
  p = Number(p);
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return '$' + p.toFixed(2);
  if (p >= 0.001) return '$' + p.toFixed(4);
  return '$' + p.toFixed(8);
}

function fmtBytes(n) {
  if (!n) return '--';
  n = Number(n);
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' MB';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + ' KB';
  return n + ' B';
}

function flattenRaw(raw) {
  if (!raw || typeof raw !== 'object') return [];
  const priority = [
    'hash', 'txid', 'height', 'number', 'sequence', 'ledger_index',
    'confirmations', 'time', 'timestamp', 'closed_at', 'close_time', 'close_time_human',
    'size', 'weight', 'strippedsize', 'vsize', 'difficulty', 'nonce', 'bits',
    'nTx', 'total_coins', 'totalCoins', 'miner',
    'gasUsed', 'gasLimit', 'gas_used', 'gas_limit',
    'fee_paid', 'fee_charged', 'operation_count',
    'successful_transaction_count', 'failed_transaction_count',
    'median_fee_usd_24h', 'circulation', 'block_reward'
  ];
  const items = [];
  for (const k of priority) {
    if (raw[k] !== undefined && raw[k] !== null) {
      let v = raw[k];
      if (k === 'time' || k === 'timestamp' || k === 'closed_at' || k === 'close_time') {
        const t = Number(v);
        if (t > 1e9) v = new Date(t * 1000).toLocaleString('zh-CN');
        else if (typeof v === 'string' && v.includes('T')) v = v.replace('T', ' ').replace('Z', '');
      }
      if (k === 'size' || k === 'weight' || k === 'strippedsize' || k === 'vsize') {
        v = fmtBytes(v);
      }
      if (k === 'difficulty') v = Number(v).toExponential(4);
      if (typeof v === 'object') continue;
      items.push({ key: k, value: String(v) });
    }
  }
  for (const [k, v] of Object.entries(raw)) {
    if (priority.includes(k)) continue;
    if (typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean') continue;
    items.push({ key: k, value: String(v) });
  }
  return items;
}

Page({
  data: {
    currentTab: 0,
    chainList: [],
    chainNames: [],
    loading: true,
    refreshTime: '',

    totalMarketCap: '--',
    totalTx24h: '--',
    sortBy: 'default',
    displayList: [],

    chainIndex: 0,
    searchInput: '',
    explorerLoading: false,
    explorerResult: null,
    explorerFields: [],
    resultType: '',
    explorerError: '',

    newsList: [],
    newsLoading: false,
    newsLoaded: false,
    newsError: '',
    showRaw: false,
    searchHistory: [],
  },

  onLoad() {
    const chainNames = CHAINS.map(c => c.name);
    try {
      const history = wx.getStorageSync('bc_search_history') || [];
      this.setData({ chainNames, searchHistory: history });
    } catch (e) {
      this.setData({ chainNames });
    }
    this.loadAllStats();
  },

  onPullDownRefresh() {
    const tab = this.data.currentTab;
    if (tab === 0) {
      this.loadAllStats().then(() => wx.stopPullDownRefresh()).catch(() => wx.stopPullDownRefresh());
    } else if (tab === 2) {
      this.loadNews().then(() => wx.stopPullDownRefresh()).catch(() => wx.stopPullDownRefresh());
    } else {
      wx.stopPullDownRefresh();
    }
  },

  onSwiperChange(e) {
    const idx = e.detail.current;
    this.setData({ currentTab: idx });
    if (idx === 2 && !this.data.newsLoaded) this.loadNews();
  },

  switchTab(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    this.setData({ currentTab: idx });
    if (idx === 2 && !this.data.newsLoaded) this.loadNews();
  },

  goToExplorer(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx !== undefined) {
      this.setData({ chainIndex: idx, currentTab: 1 });
    }
  },

  // ===== Overview =====
  async loadAllStats() {
    this.setData({ loading: true });
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${BASE_URL}/stats?key=${API_KEY}`,
          timeout: 15000,
          success: resolve,
          fail: reject,
        });
      });

      if (res.statusCode !== 200 || !res.data || !res.data.data) {
        throw new Error('API Error: ' + (res.statusCode || 'unknown'));
      }

      const allData = res.data.data;
      const chainList = [];

      // Load previous prices for change calculation
      let prevPrices = {};
      try { prevPrices = wx.getStorageSync('bc_prev_prices') || {}; } catch (e) {}
      const newPrices = {};

      for (const chain of CHAINS) {
        const chainData = allData[chain.key];
        if (!chainData || !chainData.data) continue;
        const d = chainData.data;
        const price = Number(d.market_price_usd) || 0;
        const cap = Number(d.market_cap_usd) || 0;
        const tx24 = Number(d.transactions_24h) || 0;

        // Compute change percent from cached price
        let changePercent = null;
        let changeDisplay = '';
        if (prevPrices[chain.key] && price > 0) {
          changePercent = ((price - prevPrices[chain.key]) / prevPrices[chain.key]) * 100;
          changeDisplay = Math.abs(changePercent).toFixed(2) + '%';
        }
        newPrices[chain.key] = price;

        chainList.push({
          ...chain,
          priceDisplay: fmtPrice(price),
          marketCapDisplay: '$' + fmtNum(cap),
          blocksDisplay: fmtNum(d.blocks || d.ledgers || 0),
          tx24hDisplay: fmtNum(tx24),
          difficultyDisplay: d.difficulty ? Number(d.difficulty).toExponential(2) : '--',
          volume24hDisplay: '$' + fmtNum(d.volume_24h || 0),
          circulationDisplay: fmtNum(d.circulation || 0),
          mempoolDisplay: fmtNum(d.mempool_size || 0),
          medianFeeDisplay: d.median_fee_usd_24h ? '$' + d.median_fee_usd_24h.toFixed(4) : (d.median_fee_24h ? d.median_fee_24h : '--'),
          _priceNum: price,
          _capNum: cap,
          _txNum: tx24,
          changePercent: changePercent,
          changeDisplay: changeDisplay,
        });
      }

      if (allData['cross-chain']) {
        for (const [key, token] of Object.entries(allData['cross-chain'])) {
          if (!token || !token.data) continue;
          const d = token.data;
          const name = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const price = Number(d.market_price_usd) || 0;
          const cap = Number(d.market_cap_usd) || 0;
          let changePercent = null;
          let changeDisplay = '';
          if (prevPrices['cross-' + key] && price > 0) {
            changePercent = ((price - prevPrices['cross-' + key]) / prevPrices['cross-' + key]) * 100;
            changeDisplay = Math.abs(changePercent).toFixed(2) + '%';
          }
          newPrices['cross-' + key] = price;
          chainList.push({
            key: 'cross-' + key,
            name: name,
            symbol: key.replace('-', ' ').toUpperCase(),
            color: '#8b949e',
            priceDisplay: fmtPrice(price),
            marketCapDisplay: '$' + fmtNum(cap),
            blocksDisplay: '--',
            tx24hDisplay: '--',
            difficultyDisplay: '--',
            volume24hDisplay: '$' + fmtNum(d.volume_24h || 0),
            circulationDisplay: fmtNum(d.circulation || 0),
            mempoolDisplay: '--',
            medianFeeDisplay: '--',
            _priceNum: price,
            _capNum: cap,
            _txNum: 0,
            changePercent: changePercent,
            changeDisplay: changeDisplay,
          });
        }
      }

      // Save prices for next comparison
      try { wx.setStorageSync('bc_prev_prices', newPrices); } catch (e) {}

      // Compute summary stats
      let totalCap = 0, totalTx = 0;
      for (const c of chainList) {
        totalCap += c._capNum || 0;
        totalTx += c._txNum || 0;
      }

      this.setData({
        chainList,
        loading: false,
        refreshTime: new Date().toLocaleTimeString('zh-CN'),
        totalMarketCap: '$' + fmtNum(totalCap),
        totalTx24h: fmtNum(totalTx),
      });

      this._updateDisplayList();
    } catch (err) {
      console.error('loadAllStats error:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败，请下拉刷新', icon: 'none' });
    }
  },

  // ===== Sort =====
  sortByField(e) {
    const field = e.currentTarget.dataset.field;
    const newSort = this.data.sortBy === field ? 'default' : field;
    this.setData({ sortBy: newSort });
    this._updateDisplayList();
  },

  _updateDisplayList() {
    const { chainList, sortBy } = this.data;
    let list = chainList.map((item, idx) => ({ ...item, _origIdx: idx }));

    switch (sortBy) {
      case 'price': list.sort((a, b) => (b._priceNum || 0) - (a._priceNum || 0)); break;
      case 'cap': list.sort((a, b) => (b._capNum || 0) - (a._capNum || 0)); break;
      case 'change': list.sort((a, b) => (b.changePercent || -999) - (a.changePercent || -999)); break;
      case 'tx': list.sort((a, b) => (b._txNum || 0) - (a._txNum || 0)); break;
    }

    this.setData({ displayList: list });
  },

  // ===== Explorer =====
  onChainPickerChange(e) {
    this.setData({ chainIndex: Number(e.detail.value) });
  },

  onSearchInput(e) {
    this.setData({ searchInput: e.detail.value });
  },

  async doSearch() {
    const { searchInput, chainIndex } = this.data;
    const input = searchInput.trim();
    if (!input) {
      wx.showToast({ title: '请输入查询内容', icon: 'none' });
      return;
    }

    const chain = CHAINS[chainIndex];
    if (!chain) {
      wx.showToast({ title: '请选择链', icon: 'none' });
      return;
    }

    // Save to search history
    try {
      let history = this.data.searchHistory.filter(h => h !== input);
      history.unshift(input);
      if (history.length > 10) history = history.slice(0, 10);
      this.setData({ searchHistory: history });
      wx.setStorageSync('bc_search_history', history);
    } catch (e) {}

    this.setData({ explorerLoading: true, explorerResult: null, explorerFields: [], explorerError: '', showRaw: false });

    let result = null;
    let type = '';

    const isNumeric = /^\d+$/.test(input);
    const isEthHash = /^0x[0-9a-fA-F]{64}$/.test(input);
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(input);

    try {
      if (isNumeric) {
        result = await this._fetchBlock(chain.key, input);
        if (result) type = 'block';
      }

      if (!result) {
        result = await this._fetchTx(chain.key, input);
        if (result) type = 'transaction';
      }

      if (!result && !isNumeric && (isHex64 || isEthHash)) {
        result = await this._fetchBlock(chain.key, input);
        if (result) type = 'block';
      }

      if (result) {
        const raw = result.decoded_raw_block || result.ledger || result.decoded_raw_transaction || result.transaction || result.raw_transaction || {};
        const fields = flattenRaw(raw);
        this.setData({
          explorerResult: result,
          explorerFields: fields,
          resultType: type,
          explorerLoading: false,
        });
      } else {
        this.setData({ explorerError: '未找到相关数据，请检查输入', explorerLoading: false });
      }
    } catch (err) {
      console.error('doSearch error:', err);
      let msg = '查询失败';
      if (err.statusCode === 402) msg = '数据过大，请尝试其他查询';
      else if (err.statusCode === 429) msg = '请求过于频繁，请稍后再试';
      else if (err.errMsg) msg = '网络错误，请检查连接';
      this.setData({ explorerError: msg, explorerLoading: false });
    }
  },

  _fetchBlock(chain, id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}/${chain}/raw/block/${id}?key=${API_KEY}`,
        timeout: 12000,
        success(res) {
          if (res.statusCode === 402) { reject({ statusCode: 402 }); return; }
          if (res.data && res.data.data) {
            const entry = Object.values(res.data.data)[0];
            if (entry && (entry.decoded_raw_block || entry.ledger || entry.raw_block)) {
              resolve({ ...entry, chainName: chain, context: res.data.context });
              return;
            }
          }
          resolve(null);
        },
        fail: reject,
      });
    });
  },

  _fetchTx(chain, hash) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}/${chain}/raw/transaction/${hash}?key=${API_KEY}`,
        timeout: 12000,
        success(res) {
          if (res.statusCode === 429) { reject({ statusCode: 429 }); return; }
          if (res.data && res.data.data) {
            const entry = Object.values(res.data.data)[0];
            if (entry && (entry.decoded_raw_transaction || entry.transaction || entry.raw_transaction)) {
              resolve({ ...entry, chainName: chain, context: res.data.context });
              return;
            }
          }
          resolve(null);
        },
        fail: reject,
      });
    });
  },

  useHistory(e) {
    const val = e.currentTarget.dataset.val;
    if (val) {
      this.setData({ searchInput: val });
      this.doSearch();
    }
  },

  clearExplorer() {
    this.setData({ explorerResult: null, explorerFields: [], explorerError: '', searchInput: '', showRaw: false });
  },

  toggleRaw() {
    this.setData({ showRaw: !this.data.showRaw });
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text || '';
    if (!text) return;
    wx.setClipboardData({ data: text });
  },

  // ===== News =====
  async loadNews() {
    this.setData({ newsLoading: true });
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${BASE_URL}/news?q=language(en)&limit=30&key=${API_KEY}`,
          timeout: 15000,
          success: resolve,
          fail: reject,
        });
      });

      if (res.data && res.data.data) {
        const news = res.data.data.map(item => ({
          ...item,
          tagsArr: item.tags ? item.tags.split(',').slice(0, 4) : [],
          timeShort: item.time ? item.time.slice(0, 16).replace(' ', '  ') : '',
        }));
        this.setData({ newsList: news, newsLoading: false, newsLoaded: true });
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('loadNews error:', err);
      this.setData({ newsLoading: false, newsError: '新闻加载失败' });
    }
  },

  openNews(e) {
    const index = e.currentTarget.dataset.index;
    const news = this.data.newsList[index];
    if (news) {
      // 传递新闻数据到详情页
      const dataStr = encodeURIComponent(JSON.stringify({
        title: news.title,
        source: news.source,
        time: news.time,
        snippet: news.description || news.snippet || '',
        body: news.body,
        link: news.link,
        tags: news.tags,
        hash: news.hash,
        image: news.image,
        author: news.author
      }));
      wx.navigateTo({
        url: `/bitcoin/pages/news-detail/news-detail?data=${dataStr}`
      });
    }
  },

  onShareAppMessage() {
    return {
      title: 'Blockchain Explorer - 多链数据浏览器',
      path: '/bitcoin/pages/bitcoin/bitcoin'
    };
  },
});
