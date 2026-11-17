const API_KEY = 'G___UGX6WTA2YYwcGz0BgKBN47BozGtW';
const BASE_URL = 'https://api.blockchair.com';

// 引入腾讯云翻译 - 使用bitcoin分包内的模块
let translateText = null;
try {
  translateText = require('../../utils/translator.js').translateText;
} catch (e) {
  console.warn('翻译模块加载失败:', e.message);
}

Page({
  data: {
    loading: true,
    error: '',
    news: {},
    contentText: '',  // 统一存储摘要内容
    tags: [],
    relatedCoins: [],
    
    // 翻译相关
    translatingTitle: false,
    translatedTitle: '',
    translatingSnippet: false,
    translatedSnippet: '',
    showTranslatedSnippet: false,  // 默认显示原文
  },

  onLoad(options) {
    // 尝试从参数解码新闻数据
    if (options.data) {
      try {
        const news = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          news,
          contentText: news.snippet || news.description || '',
          tags: news.tags ? news.tags.split(',').slice(0, 6) : [],
          relatedCoins: this._extractCoins(news.tags),
          loading: false
        });
        return;
      } catch (e) {
        console.error('Parse news data error:', e);
      }
    }

    // 如果有 hash，从 API 获取
    if (options.hash) {
      this.loadNewsDetail(options.hash);
      return;
    }

    this.setData({ loading: false, error: '缺少新闻数据' });
  },

  async loadNewsDetail(hash) {
    this.setData({ loading: true, error: '' });
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${BASE_URL}/news?q=hash(${hash})&key=${API_KEY}`,
          timeout: 15000,
          success: resolve,
          fail: reject,
        });
      });

      if (res.data && res.data.data && res.data.data.length > 0) {
        const news = res.data.data[0];
        this.setData({
          news,
          contentText: news.description || news.snippet || '',
          tags: news.tags ? news.tags.split(',').slice(0, 6) : [],
          relatedCoins: this._extractCoins(news.tags),
          loading: false
        });
      } else {
        this.setData({ loading: false, error: '未找到新闻详情' });
      }
    } catch (err) {
      console.error('loadNewsDetail error:', err);
      this.setData({ loading: false, error: '加载失败，请重试' });
    }
  },

  _extractCoins(tags) {
    if (!tags) return [];
    const coins = ['BTC', 'ETH', 'BCH', 'LTC', 'DOGE', 'XRP', 'ADA', 'XLM', 'DASH', 'XMR', 'ZEC', 'BSV'];
    const result = [];
    const upperTags = tags.toUpperCase();
    for (const coin of coins) {
      if (upperTags.includes(coin) && !result.includes(coin)) {
        result.push(coin);
      }
    }
    return result.slice(0, 5);
  },

  retryLoad() {
    const hash = this.data.news.hash;
    if (hash) {
      this.loadNewsDetail(hash);
    } else {
      this.setData({ error: '无法重试，请返回列表' });
    }
  },

  // ===== 翻译功能 =====
  
  // 翻译标题
  async translateTitle() {
    if (!translateText) {
      wx.showToast({ title: '翻译模块未加载', icon: 'none' });
      return;
    }
    
    const title = this.data.news.title;
    if (!title) return;
    
    this.setData({ translatingTitle: true });
    
    try {
      const result = await translateText(title, 'auto', 'zh');
      this.setData({ 
        translatedTitle: result,
        translatingTitle: false 
      });
    } catch (err) {
      this.setData({ translatingTitle: false });
      wx.showToast({ title: '翻译失败', icon: 'none' });
    }
  },

  // 翻译摘要
  async translateSnippet() {
    if (!translateText) {
      wx.showToast({ title: '翻译模块未加载', icon: 'none' });
      return;
    }

    const snippet = this.data.contentText;
    if (!snippet) {
      wx.showToast({ title: '暂无摘要内容', icon: 'none' });
      return;
    }

    this.setData({ translatingSnippet: true });

    try {
      const result = await translateText(snippet, 'auto', 'zh');
      this.setData({
        translatedSnippet: result,
        translatingSnippet: false,
        showTranslatedSnippet: true  // 翻译完成后自动展开
      });
    } catch (err) {
      this.setData({ translatingSnippet: false });
      wx.showToast({ title: '翻译失败', icon: 'none' });
    }
  },

  // 切换原文/译文显示
  toggleSnippetView() {
    this.setData({ 
      showTranslatedSnippet: !this.data.showTranslatedSnippet 
    });
  },

  // 全文翻译（标题+摘要）
  async translateAll() {
    if (!translateText) {
      wx.showToast({ title: '翻译模块未加载', icon: 'none' });
      return;
    }
    
    const { title } = this.data.news;
    const snippet = this.data.contentText;
    
    // 翻译标题
    if (title && !this.data.translatedTitle) {
      this.setData({ translatingTitle: true });
      try {
        const result = await translateText(title, 'auto', 'zh');
        this.setData({ translatedTitle: result });
      } catch (e) {}
      this.setData({ translatingTitle: false });
    }
    
    // 翻译摘要
    if (snippet && !this.data.translatedSnippet) {
      this.setData({ translatingSnippet: true });
      try {
        const result = await translateText(snippet, 'auto', 'zh');
        this.setData({ 
          translatedSnippet: result,
          showTranslatedSnippet: true
        });
      } catch (e) {}
      this.setData({ translatingSnippet: false });
    }
    
    wx.showToast({ title: '翻译完成', icon: 'success' });
  },

  // ===== 其他操作 =====
  
  copyLink() {
    const link = this.data.news.link;
    if (link) {
      wx.setClipboardData({
        data: link,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' });
        }
      });
    } else {
      wx.showToast({ title: '暂无链接', icon: 'none' });
    }
  },

  shareNews() {
    // 触发分享
  },

  onShareAppMessage() {
    const { news } = this.data;
    return {
      title: news.title || '区块链新闻',
      path: `/bitcoin/pages/news-detail/news-detail?hash=${news.hash}`,
      imageUrl: news.image || ''
    };
  }
});
