const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const spaceCtx = require('../../utils/space.js');
const gate = require('../../utils/create-gate.js');

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
    passModal: false,
    passInput: '',
    passErr: '',
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
    if (this.data.creating) return;
    const label = (this.data.myLabel || '').trim();
    if (label.length > 12) {
      wx.showToast({ title: '称呼最多 12 个字', icon: 'none' });
      return;
    }
    // 列表页已经输过密码就直接创建；直接打开本页时才自己弹
    const gated = gate.take();
    if (gated) {
      this.setData({ creating: true });
      this.doCreate(gated);
      return;
    }
    this.setData({ passModal: true, passInput: '', passErr: '' });
  },

  noop() {},

  onPassInput(e) {
    this.setData({ passInput: e.detail.value, passErr: '' });
  },

  cancelPass() {
    this.setData({ passModal: false, passInput: '', passErr: '' });
  },

  confirmPass() {
    const pass = String(this.data.passInput || '').trim();
    this.setData({ passModal: false, passInput: '', passErr: '' });
    if (gate.check(pass)) {
      this.setData({ creating: true });
      this.doCreate(pass);
      return;
    }
    // 不是创建密码：不提示、不报错，进入「两个人的空间」静态页
    wx.navigateTo({ url: '/packageCouple/pages/story/story' });
  },

  doCreate(pass) {
    const that = this;
    const type = this.data.selectedType;
    const label = (this.data.myLabel || '').trim();
    const title = (this.data.title || '').trim();
    api.ensureLogin()
      .then(function () {
        return api.createSpace({ relation_type: type, my_label: label, title: title, pass: pass });
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
      return {
        title: '给这段关系，点亮一只火苗',
        path: '/packageCouple/pages/spaces/spaces',
        imageUrl: share.cover('create')
      };
    }
    return {
      title: '来和我一起养一只小火苗吧',
      path: '/packageCouple/pages/join/join?code=' + encodeURIComponent(s.invite_code),
      imageUrl: share.cover('join')
    };
  },

  onShareTimeline() {
    const s = this.data.result;
    return {
      title: s && s.invite_code ? '有人给你留了一只小火苗' : '给这段关系，点亮一只火苗',
      query: s && s.invite_code ? 'code=' + encodeURIComponent(s.invite_code) : '',
      imageUrl: share.cover(s && s.invite_code ? 'join' : 'create')
    };
  }

});
