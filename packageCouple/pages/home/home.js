const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const spaceCtx = require('../../utils/space.js');

const SHARE_IMAGE = '/assets/couple-share.png';
const TYPE_META = {
  family: { short: '家', name: '家人' },
  partner: { short: '恋', name: '恋人' },
  friend: { short: '友', name: '朋友' },
  custom: { short: '定', name: '自定义' },
  unset: { short: '待', name: '待设置' },
};

Page({
  data: {
    ready: false,
    errorText: '',
    user: null,
    couple: null,
    pet: null,
    partnerName: 'TA',
    partnerInitial: 'TA',
    myAvatar: '',
    partnerAvatar: '',
    petName: '小火苗',
    diaryCount: 0,
    anniversaryCount: 0,
    voiceCount: 0,
    nextAnnivText: '把重要的日子圈起来',
    days: 1,
    toast: '',
    renameVisible: false,
    renameValue: '',
    renaming: false,
    acting: false,
    alone: false,
    inviteCode: '',
    spaceTitle: '我们的小火苗',
    relationShort: '恋',
    relationName: '恋人',
    relationLine: '',
    relationKey: 'unset',
    actions: [
      { type: 'feed', emoji: '🪵', name: '投喂', used: 0, max: 1 },
      { type: 'pet', emoji: '🤚', name: '摸摸', used: 0, max: 5 },
      { type: 'hug', emoji: '🤗', name: '抱抱', used: 0, max: 3 },
      { type: 'checkin', emoji: '☀️', name: '打卡', used: 0, max: 1 }
    ]
  },

  onLoad: function (options) {
    this.inviteFromQuery = ((options && options.invite) || '').trim();
    const fromQuery = parseInt(options && options.space, 10) || 0;
    if (fromQuery > 0) spaceCtx.setCurrentSpaceId(fromQuery);
    if (!spaceCtx.getCurrentSpaceId()) {
      wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
      return;
    }
    this.entrySpaceId = spaceCtx.getCurrentSpaceId();
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    this.load();
  },

  onShow: function () {
    if (this.data.ready) {
      const now = spaceCtx.getCurrentSpaceId();
      if (now && now !== this.entrySpaceId) {
        this.entrySpaceId = now;
        this.load();
      } else {
        this.load();
      }
    }
  },

  load: function () {
    const that = this;
    return api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res.user || !res.user.nickname || !res.user.avatar) {
          // 还没有设置微信昵称/头像：先去资料页，再回来
          const nextStep = res.couple ? 'home' : 'home';
          let url = '/packageCouple/pages/profile/profile?next=' + nextStep;
          if (that.entrySpaceId) url += '&space=' + that.entrySpaceId;
          if (that.inviteFromQuery) url += '&invite=' + encodeURIComponent(that.inviteFromQuery);
          wx.redirectTo({ url: url });
          return;
        }
        if (!res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
          return;
        }
        // 服务端默认空间与本地上下文对齐（防止旧缓存指到已退出的空间）
        if (res.active_space_id && res.active_space_id !== that.entrySpaceId) {
          that.entrySpaceId = res.active_space_id;
          spaceCtx.setCurrentSpaceId(res.active_space_id);
        }
        that.applyState(res);
      })
      .catch(function (err) {
        const msg = (err && (err.msg || err.message)) || '加载失败，下拉重试';
        if (err && (err.code === 'NOT_MEMBER' || err.code === 'NO_COUPLE')) {
          wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
          return;
        }
        that.setData({ ready: true, errorText: msg });
      });
  },

  applyState: function (res) {
    const pet = res.pet || {};
    const couple = res.couple || {};
    const alone = !couple.partner;
    const partnerName = (couple.partner && couple.partner.nickname) || 'TA';
    const meta = TYPE_META[couple.relation_type] || TYPE_META.unset;
    const partnerLabel = partnerName && /[A-Za-z0-9]/.test(partnerName) ? ' ' + partnerName + ' ' : partnerName;
    const spaceTitle = couple.title || (partnerName ? '和' + partnerLabel + '的小火苗' : '等待对方的小火苗');
    const relationBits = [];
    if (couple.my_label) relationBits.push('我 · ' + couple.my_label);
    if (couple.partner_label) relationBits.push((partnerName || '对方') + ' · ' + couple.partner_label);
    if (!relationBits.length && !alone) relationBits.push(meta.name);
    if (alone) relationBits.push('等对方加入');
    const actions = this.data.actions.map(function (a) {
      const used = (pet.today_actions && pet.today_actions[a.type]) || 0;
      return Object.assign({}, a, { used: used });
    });
    let nextAnnivText = '把重要的日子圈起来';
    if (res.next_anniversary) {
      nextAnnivText = res.next_anniversary.is_today
        ? '今天就是「' + res.next_anniversary.title + '」'
        : '距离「' + res.next_anniversary.title + '」还有 ' + res.next_anniversary.days_left + ' 天';
    } else if (res.anniversary_count) {
      nextAnnivText = '已记录 ' + res.anniversary_count + ' 个日子';
    }

    this.setData({
      ready: true,
      errorText: '',
      user: res.user,
      couple: couple,
      pet: pet,
      days: couple.days_together || 1,
      alone: alone,
      inviteCode: alone ? couple.invite_code || '' : '',
      partnerName: partnerName,
      partnerInitial: partnerName.slice(0, 1) || 'TA',
      myAvatar: api.absUrl(res.user && res.user.avatar),
      partnerAvatar: api.absUrl(couple.partner && couple.partner.avatar),
      petName: pet.name || '小火苗',
      diaryCount: res.diary_count || 0,
      anniversaryCount: res.anniversary_count || 0,
      voiceCount: res.voice_count || 0,
      nextAnnivText: nextAnnivText,
      actions: actions,
      spaceTitle: spaceTitle,
      relationShort: meta.short,
      relationName: meta.name,
      relationLine: relationBits.join('　'),
      relationKey: couple.relation_type || 'unset'
    });
  },

  onInteract: function (e) {
    const that = this;
    const type = e.currentTarget.dataset.type;
    if (this.data.acting) return;
    const action = this.data.actions.filter(function (a) { return a.type === type; })[0];
    if (action && action.used >= action.max) {
      wx.showToast({ title: '今天已经' + action.name + '过啦', icon: 'none' });
      return;
    }
    this.setData({ acting: true });
    api.interact(type)
      .then(function (res) {
        that.setData({ acting: false });
        that.flash('+' + res.delta);
        that.load();
      })
      .catch(function (err) {
        that.setData({ acting: false });
        wx.showToast({ title: err.msg || '互动失败', icon: 'none' });
      });
  },

  flash: function (text) {
    const that = this;
    this.setData({ toast: text });
    setTimeout(function () { that.setData({ toast: '' }); }, 900);
  },

  copyCode: function () {
    if (!this.data.inviteCode) return;
    wx.setClipboardData({ data: this.data.inviteCode });
  },

  renamePet: function () {
    if (!this.data.pet) return;
    this.setData({
      renameVisible: true,
      renameValue: this.data.pet.name || this.data.petName || ''
    });
  },

  closeRename: function () {
    if (this.data.renaming) return;
    this.setData({ renameVisible: false });
  },

  onRenameInput: function (e) {
    this.setData({ renameValue: e.detail.value });
  },

  confirmRename: function () {
    const that = this;
    if (this.data.renaming) return;
    const name = (this.data.renameValue || '').trim();
    if (!name) {
      wx.showToast({ title: '名字不能为空', icon: 'none' });
      return;
    }
    if (name.length > 12) {
      wx.showToast({ title: '名字最多 12 个字', icon: 'none' });
      return;
    }
    this.setData({ renaming: true });
    api.renamePet(name)
      .then(function (r) {
        that.setData({
          renaming: false,
          renameVisible: false,
          petName: (r.pet && r.pet.name) || name
        });
        wx.showToast({ title: '名字改好啦', icon: 'none' });
        that.load();
      })
      .catch(function (err) {
        that.setData({ renaming: false });
        wx.showToast({ title: err.msg || '改名失败', icon: 'none' });
      });
  },

  noop: function () {},

  goChat: function () {
    wx.navigateTo({ url: '/packageCouple/pages/chat/chat' });
  },

  goSpaces: function () {
    const pages = getCurrentPages();
    const prev = pages.length > 1 ? pages[pages.length - 2] : null;
    if (prev && prev.route === 'packageCouple/pages/spaces/spaces') {
      wx.navigateBack();
      return;
    }
    wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
  },

  goTimeline: function () {
    wx.navigateTo({ url: '/packageCouple/pages/timeline/timeline' });
  },

  goAnniversary: function () {
    wx.navigateTo({ url: '/packageCouple/pages/anniversary/anniversary' });
  },

  goListen: function () {
    wx.navigateTo({ url: '/packageCouple/pages/listen/listen' });
  },

  onPullDownRefresh: function () {
    this.load().then(function () { wx.stopPullDownRefresh(); });
  },


  onShareAppMessage: function () {
    if (this.data.alone && this.data.inviteCode) {
      return {
        title: '我在等一个人，一起点亮这只小火苗',
        path: '/packageCouple/pages/join/join?code=' + encodeURIComponent(this.data.inviteCode),
        imageUrl: share.cover('join')
      };
    }
    const pet = this.data.pet || {};
    const lv = pet.level || 1;
    const streak = pet.streak || 0;
    return {
      title: '我们的小火苗 Lv.' + lv + '，已经连续守护 ' + streak + ' 天',
      path: share.homePath(),
      imageUrl: share.cover('home')
    };
  },

  onShareTimeline: function () {
    const alone = this.data.alone && this.data.inviteCode;
    return {
      title: alone ? '我在等一个人，一起点亮这只小火苗' : '我们的小火苗 · 只属于两个人的小空间',
      query: alone ? 'code=' + encodeURIComponent(this.data.inviteCode) : share.timelineQuery(),
      imageUrl: share.cover(alone ? 'join' : 'home')
    };
  }

});
