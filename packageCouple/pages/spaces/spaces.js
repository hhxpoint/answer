const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const spaceCtx = require('../../utils/space.js');
const gate = require('../../utils/create-gate.js');

const TYPE_META = {
  family: { short: '家', name: '家人', desc: '父母、孩子、兄弟姐妹', cls: 'rel-family', icon: '☘' },
  partner: { short: '恋', name: '恋人', desc: '一起把日子过成小火苗', cls: 'rel-partner', icon: '♡' },
  friend: { short: '友', name: '朋友', desc: '闺蜜、死党、挚友', cls: 'rel-friend', icon: '✦' },
  custom: { short: '定', name: '自定义', desc: '你们自己定义的关系', cls: 'rel-custom', icon: '◇' },
  unset: { short: '待', name: '待设置', desc: '进去后可以设置关系', cls: 'rel-unset', icon: '·' },
};

function relMeta(type) {
  return TYPE_META[type] || TYPE_META.unset;
}

function timeText(ts) {
  const n = Number(ts) || 0;
  if (!n) return '刚刚开始';
  const diff = Date.now() - n;
  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return Math.max(1, Math.floor(diff / 60000)) + ' 分钟前';
  if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / 3600000) + ' 小时前';
  if (diff < 48 * 60 * 60 * 1000) return '昨天';
  const d = new Date(n);
  return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
}

function decorate(s) {
  const meta = relMeta(s.relation_type);
  const partner = s.partner || null;
  const partnerName = (partner && partner.nickname) || '';
  const displayName = partnerName && /[A-Za-z0-9]/.test(partnerName) ? ' ' + partnerName + ' ' : partnerName;
  const title = s.title || (partnerName ? '和' + displayName + '的小火苗' : '等待对方的小火苗');
  const labels = [];
  if (s.my_label) labels.push('我 · ' + s.my_label);
  if (s.partner_label) labels.push((partnerName || '对方') + ' · ' + s.partner_label);
  let lastText = '等你们写下第一句话';
  if (s.last_message && s.last_message.content) {
    lastText = s.last_message.content;
  } else if (s.last_active_at) {
    lastText = timeText(s.last_active_at) + '有互动';
  }
  return {
    id: s.id,
    title: title,
    relation: meta,
    relationKey: s.relation_type || 'unset',
    partnerName: partnerName || '还未加入',
    partnerAvatar: api.absUrl(partner && partner.avatar),
    initial: (partnerName || '火').slice(0, 1),
    labels: labels,
    labelText: labels.join('　'),
    pet: s.pet || null,
    petName: (s.pet && s.pet.name) || '小火苗',
    level: (s.pet && s.pet.level) || 1,
    unread: s.unread_count || 0,
    lastText: lastText,
    lastTime: timeText(s.last_active_at || (s.last_message && s.last_message.created_at)),
    alone: !partner,
  };
}

Page({
  data: {
    passModal: false,
    passInput: '',
    passErr: '',
    ready: false,
    loading: true,
    errorText: '',
    spaces: [],
    count: 0,
    limit: 8,
    currentId: 0,
    empty: false,
    skeletons: [1, 2],
  },

  onLoad() {
    this.load();
  },

  onShow() {
    if (this.data.ready) this.load();
  },

  load() {
    const that = this;
    this.setData({ loading: true, errorText: '' });
    return api.ensureLogin()
      .then(function () { return api.listSpaces(); })
      .then(function (res) {
        const spaces = (res.spaces || []).map(decorate);
        const current = spaceCtx.getCurrentSpaceId();
        if (current && !spaces.some(function (s) { return s.id === current; })) {
          spaceCtx.clearCurrentSpace();
        }
        that.setData({
          ready: true,
          loading: false,
          spaces: spaces,
          count: spaces.length,
          limit: res.limit || 8,
          currentId: spaceCtx.getCurrentSpaceId(),
          empty: spaces.length === 0,
        });
      })
      .catch(function (err) {
        that.setData({ ready: true, loading: false, errorText: (err && (err.msg || err.message)) || '加载失败，下拉重试' });
      });
  },

  onTapSpace(e) {
    const id = Number(e.currentTarget.dataset.id) || 0;
    if (!id) return;
    spaceCtx.setCurrentSpaceId(id);
    wx.navigateTo({ url: '/packageCouple/pages/home/home?space=' + id });
  },

  // 新建关系空间：跳转前先要密码
  goCreate() {
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
    if (!pass) {
      this.setData({ passErr: '请输入密码' });
      return;
    }
    if (!gate.check(pass)) {
      this.setData({ passErr: '密码不正确' });
      return;
    }
    gate.grant();
    this.setData({ passModal: false, passInput: '', passErr: '' });
    wx.navigateTo({ url: '/packageCouple/pages/create/create' });
  },

  goJoin() {
    wx.navigateTo({ url: '/packageCouple/pages/join/join' });
  },

  onManageTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    const s = this.data.spaces[index];
    if (!s) return;
    const that = this;
    wx.showActionSheet({
      itemList: ['设置关系与称呼', '修改空间名称', '解除这个关系'],
      success: function (res) {
        if (res.tapIndex === 0) that.editRelation(s);
        if (res.tapIndex === 1) that.renameSpace(s);
        if (res.tapIndex === 2) that.leaveSpace(s);
      }
    });
  },

  editRelation(s) {
    const that = this;
    const types = [
      { key: 'family', name: '家人' },
      { key: 'partner', name: '恋人' },
      { key: 'friend', name: '朋友' },
      { key: 'custom', name: '自定义' }
    ];
    wx.showActionSheet({
      itemList: types.map(function (t) { return t.name; }),
      success: function (res) {
        const t = types[res.tapIndex];
        if (!t) return;
        wx.showModal({
          title: '你在这段关系里的称呼',
          editable: true,
          placeholderText: '比如：女儿 / 恋人 / 闺蜜',
          content: s.my_label || '',
          success: function (r) {
            if (!r.confirm) return;
            const label = (r.content || '').trim();
            api.updateSpace(s.id, { relation_type: t.key, my_label: label })
              .then(function () {
                wx.showToast({ title: '关系已设置', icon: 'none' });
                that.load();
              })
              .catch(function (err) { wx.showToast({ title: err.msg || '设置失败', icon: 'none' }); });
          }
        });
      }
    });
  },

  renameSpace(s) {
    const that = this;
    wx.showModal({
      title: '空间名称',
      editable: true,
      placeholderText: '比如：和爸爸的小火苗',
      content: s.title || '',
      success: function (res) {
        if (!res.confirm) return;
        const title = (res.content || '').trim();
        api.updateSpace(s.id, { title: title })
          .then(function () {
            wx.showToast({ title: '已更新', icon: 'none' });
            that.load();
          })
          .catch(function (err) { wx.showToast({ title: err.msg || '修改失败', icon: 'none' }); });
      }
    });
  },

  leaveSpace(s) {
    const that = this;
    wx.showModal({
      title: '解除「' + s.title + '」？',
      content: '会删除这个空间里双方的小火苗、悄悄话、时光、纪念日和语音，且无法恢复。',
      confirmText: '确认解除',
      confirmColor: '#C25B4E',
      success: function (res) {
        if (!res.confirm) return;
        api.leaveSpace(s.id)
          .then(function () {
            if (spaceCtx.getCurrentSpaceId() === s.id) spaceCtx.clearCurrentSpace();
            wx.showToast({ title: '已解除', icon: 'none' });
            that.load();
          })
          .catch(function (err) { wx.showToast({ title: err.msg || '操作失败', icon: 'none' }); });
      }
    });
  },

  onPullDownRefresh() {
    this.load().then(function () { wx.stopPullDownRefresh(); });
  },


  onShareAppMessage() {
    return {
      title: '和重要的人，一起养一只火苗',
      path: '/packageCouple/pages/spaces/spaces',
      imageUrl: share.cover('spaces')
    };
  },

  onShareTimeline() {
    return {
      title: '和重要的人，一起养一只火苗',
      imageUrl: share.cover('spaces')
    };
  }

});
