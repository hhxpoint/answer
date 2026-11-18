const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const spaceCtx = require('../../utils/space.js');

const LABELS = ['女儿', '儿子', '爸爸', '妈妈', '恋人', '闺蜜', '死党', '朋友'];

Page({
  data: {
    code: '',
    myLabel: '',
    labels: LABELS,
    joining: false,
    fromShare: false,
  },

  onLoad(options) {
    const code = ((options && options.code) || '').trim().toUpperCase();
    if (code) this.setData({ code: code, fromShare: true });
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage'], withShareTicket: false });
    }
  },

  onCodeInput(e) {
    this.setData({ code: (e.detail.value || '').toUpperCase() });
  },

  onPickLabel(e) {
    this.setData({ myLabel: e.currentTarget.dataset.label || '' });
  },

  onLabelInput(e) {
    this.setData({ myLabel: e.detail.value });
  },

  onJoin() {
    const that = this;
    if (this.data.joining) return;
    const code = (this.data.code || '').trim().toUpperCase();
    const label = (this.data.myLabel || '').trim();
    if (!code) {
      wx.showToast({ title: '先输入对方的邀请码', icon: 'none' });
      return;
    }
    if (label.length > 12) {
      wx.showToast({ title: '称呼最多 12 个字', icon: 'none' });
      return;
    }
    this.setData({ joining: true });
    api.ensureLogin()
      .then(function () { return api.joinSpace(code, label); })
      .then(function (res) {
        const space = res.space || {};
        spaceCtx.setCurrentSpaceId(space.id);
        that.setData({ joining: false });
        wx.showToast({ title: '小火苗亮起来了', icon: 'none' });
        setTimeout(function () {
          wx.redirectTo({ url: '/packageCouple/pages/home/home?space=' + space.id });
        }, 700);
      })
      .catch(function (err) {
        that.setData({ joining: false });
        wx.showToast({ title: (err && err.msg) || '加入失败', icon: 'none' });
      });
  },


  onShareAppMessage() {
    const code = (this.data.code || '').trim();
    return {
      title: '有人给你留了一只小火苗',
      path: '/packageCouple/pages/join/join' + (code ? '?code=' + encodeURIComponent(code) : ''),
      imageUrl: share.cover('join')
    };
  },

  onShareTimeline() {
    const code = (this.data.code || '').trim();
    return {
      title: '有人给你留了一只小火苗',
      query: code ? 'code=' + encodeURIComponent(code) : '',
      imageUrl: share.cover('join')
    };
  }

});
