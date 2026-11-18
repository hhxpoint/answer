const api = require('../../utils/couple-api.js');
const spaceCtx = require('../../utils/space.js');

const TYPES = [
  { key: 'family', name: '家人', icon: '家', desc: '父亲、母亲、孩子、兄弟姐妹', cls: 't-family', labels: ['爸爸', '妈妈', '女儿', '儿子', '哥哥', '姐姐', '弟弟', '妹妹'] },
  { key: 'partner', name: '恋人', icon: '恋', desc: '一起把普通日子过成小火苗', cls: 't-partner', labels: ['恋人', '另一半', '先生', '太太'] },
  { key: 'friend', name: '朋友', icon: '友', desc: '闺蜜、死党、挚友', cls: 't-friend', labels: ['闺蜜', '死党', '挚友', '朋友'] },
  { key: 'custom', name: '自定义', icon: '定', desc: '你们自己定义这段关系', cls: 't-custom', labels: [] },
];

Page({
  data: {
    step: 'edit',
    types: TYPES,
    selectedType: 'partner',
    relationName: '恋人',
    labels: TYPES[1].labels,
    myLabel: '',
    title: '',
    creating: false,
    result: null,
    copied: false,
  },

  onLoad() {
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
  },

  onPickType(e) {
    const key = e.currentTarget.dataset.key;
    const t = TYPES.filter(function (x) { return x.key === key; })[0];
    if (!t) return;
    this.setData({ selectedType: t.key, relationName: t.name, labels: t.labels, myLabel: '' });
  },

  onPickLabel(e) {
    this.setData({ myLabel: e.currentTarget.dataset.label || '' });
  },

  onLabelInput(e) {
    this.setData({ myLabel: e.detail.value });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onCreate() {
    const that = this;
    if (this.data.creating) return;
    const type = this.data.selectedType;
    const label = (this.data.myLabel || '').trim();
    const title = (this.data.title || '').trim();
    if (label.length > 12) {
      wx.showToast({ title: '称呼最多 12 个字', icon: 'none' });
      return;
    }
    this.setData({ creating: true });
    api.ensureLogin()
      .then(function () {
        return api.createSpace({ relation_type: type, my_label: label, title: title });
      })
      .then(function (res) {
        const space = res.space || {};
        spaceCtx.setCurrentSpaceId(space.id);
        that.setData({ creating: false, step: 'done', result: space });
        wx.showToast({ title: '空间创建好了', icon: 'none' });
      })
      .catch(function (err) {
        that.setData({ creating: false });
        wx.showToast({ title: (err && err.msg) || '创建失败', icon: 'none' });
      });
  },

  copyCode() {
    const code = this.data.result && this.data.result.invite_code;
    if (!code) return;
    wx.setClipboardData({ data: code });
    this.setData({ copied: true });
  },

  goHome() {
    const s = this.data.result;
    if (!s) return;
    spaceCtx.setCurrentSpaceId(s.id);
    wx.redirectTo({ url: '/packageCouple/pages/home/home?space=' + s.id });
  },

  onShareAppMessage() {
    const s = this.data.result;
    if (!s || !s.invite_code) {
      return { title: '🔥 和重要的人，一起养一只小火苗', path: '/packageCouple/pages/spaces/spaces' };
    }
    return {
      title: '来和我一起养一只小火苗吧',
      path: '/packageCouple/pages/join/join?code=' + encodeURIComponent(s.invite_code),
      imageUrl: '/assets/couple-share.png'
    };
  },

  onShareTimeline() {
    const s = this.data.result;
    return {
      title: '和重要的人，一起养一只小火苗',
      query: s && s.invite_code ? 'code=' + encodeURIComponent(s.invite_code) : '',
      imageUrl: '/assets/couple-share.png'
    };
  },
});
