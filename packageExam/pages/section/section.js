const api = require('../../utils/exam-api.js');
const share = require('../../utils/share.js');

const DESC = {
  tuxing: '九宫格 / 序列 / 分类，图像规律专项',
  dingyi: '抓定义关键词，逐个选项比对',
  leibi: '词项关系：近义、种属、组成、对应',
  luoji: '加强削弱、前提假设、真假推理',
  luojitiankong: '语境 + 词语辨析',
  pianduan: '中心理解、细节判断、标题填入',
  yuju: '语句排序、语句填充、接语选择',
  shuxue: '行程、工程、排列组合、几何',
  shuzi: '数列规律',
  changshi: '政治、法律、经济、科技、人文',
  zhengzhi: '新思想、时政、马原'
};

Page({
  data: {
    pools: [],
    loading: true,
    error: ''
  },

  onLoad() {
    share.enableMenu();
    this.load();
  },

  load() {
    const that = this;
    this.setData({ loading: true, error: '' });
    api.loadPoolIndex()
      .then(function (data) {
        const pools = ((data && data.pools) || []).map(function (p) {
          return {
            slug: p.slug,
            type: p.type,
            count: p.count,
            desc: DESC[p.slug] || '按题型集中突破'
          };
        });
        that.setData({ pools: pools, loading: false });
      })
      .catch(function (err) {
        that.setData({ loading: false, error: (err && err.message) || '加载失败' });
      });
  },

  open(e) {
    const slug = e.currentTarget.dataset.slug;
    if (!slug) return;
    wx.navigateTo({ url: '/packageExam/pages/practice/practice?pool=' + slug });
  },

  goPapers() {
    wx.navigateTo({ url: '/packageExam/pages/papers/papers' });
  },

  retry() {
    this.load();
  },
  onShareAppMessage: function () {
    const s = share.section();
    return { title: s.title, path: s.path, imageUrl: share.cover('section') };
  },

  onShareTimeline: function () {
    return share.timeline(share.section(), 'section');
  }
});
