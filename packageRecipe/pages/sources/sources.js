const CREDITS = require('../../data/credits.js');

Page({
  data: {
    list: [],
    total: 0,
    photoCount: 0,
  },

  onLoad() {
    const list = CREDITS.filter((c) => c.image).map((c) => ({
      id: c.id,
      title: c.title,
      source: c.source,
      license: c.license,
      artist: (c.artist || '').replace(/\s+/g, ' ').slice(0, 80),
      landing: c.landing,
    }));
    this.setData({ list: list, total: CREDITS.length, photoCount: list.length });
  },

  copy(e) {
    const i = e.currentTarget.dataset.i;
    const c = this.data.list[i];
    wx.setClipboardData({
      data: [c.title, c.source, c.license, c.artist, c.landing].filter(Boolean).join(' | '),
    });
  },

  onShareAppMessage() {
    return { title: '菜谱图片来源与许可', path: '/packageRecipe/pages/sources/sources' };
  },
});
