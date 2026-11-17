const api = require('../../utils/couple-api.js');

const SHARE_IMAGE = '/assets/couple-share.png';

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
    acting: false,
    alone: false,
    inviteCode: '',
    actions: [
      { type: 'feed', emoji: '🪵', name: '投喂', used: 0, max: 1 },
      { type: 'pet', emoji: '🤚', name: '摸摸', used: 0, max: 5 },
      { type: 'hug', emoji: '🤗', name: '抱抱', used: 0, max: 3 },
      { type: 'checkin', emoji: '☀️', name: '打卡', used: 0, max: 1 }
    ]
  },

  onLoad: function (options) {
    this.inviteFromQuery = ((options && options.invite) || '').trim();
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    this.load();
  },

  onShow: function () {
    if (this.data.ready) this.load();
  },

  load: function () {
    const that = this;
    return api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res.user || !res.user.nickname || !res.user.avatar) {
          // 还没有设置微信昵称/头像：先去资料页，再回来
          const nextStep = res.couple ? 'home' : 'bind';
          let url = '/packageCouple/pages/profile/profile?next=' + nextStep;
          if (!res.couple && that.inviteFromQuery) {
            url += '&invite=' + encodeURIComponent(that.inviteFromQuery);
          }
          wx.redirectTo({ url: url });
          return;
        }
        if (!res.couple) {
          const url = that.inviteFromQuery
            ? '/packageCouple/pages/bind/bind?invite=' + encodeURIComponent(that.inviteFromQuery)
            : '/packageCouple/pages/bind/bind';
          wx.redirectTo({ url: url });
          return;
        }
        that.applyState(res);
      })
      .catch(function (err) {
        const msg = (err && (err.msg || err.message)) || '加载失败，下拉重试';
        that.setData({ ready: true, errorText: msg });
      });
  },

  applyState: function (res) {
    const pet = res.pet || {};
    const couple = res.couple || {};
    const alone = !couple.partner;
    const partnerName = (couple.partner && couple.partner.nickname) || 'TA';
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
      actions: actions
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
    const that = this;
    if (!this.data.pet) return;
    wx.showModal({
      title: '给小火苗起个名字',
      editable: true,
      placeholderText: '比如：小团团、火苗球',
      content: this.data.pet.name || '',
      success: function (res) {
        if (!res.confirm) return;
        const name = (res.content || '').trim();
        if (!name) {
          wx.showToast({ title: '名字不能为空', icon: 'none' });
          return;
        }
        api.renamePet(name)
          .then(function (r) {
            that.setData({ petName: (r.pet && r.pet.name) || name });
            wx.showToast({ title: '名字改好啦', icon: 'none' });
            that.load();
          })
          .catch(function (err) {
            wx.showToast({ title: err.msg || '改名失败', icon: 'none' });
          });
      }
    });
  },

  goChat: function () {
    wx.navigateTo({ url: '/packageCouple/pages/chat/chat' });
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
        title: '🔥 来和我一起养一只小火苗吧',
        path: '/packageCouple/pages/bind/bind?invite=' + encodeURIComponent(this.data.inviteCode),
        imageUrl: SHARE_IMAGE
      };
    }
    return {
      title: '我们在养一只小火苗，已经一起守护 ' + ((this.data.pet && this.data.pet.streak) || 0) + ' 天啦',
      path: '/packageCouple/pages/home/home',
      imageUrl: SHARE_IMAGE
    };
  },

  onShareTimeline: function () {
    const alone = this.data.alone && this.data.inviteCode;
    return {
      title: alone ? '🔥 来和我一起养一只小火苗吧' : '我们的小火苗 · 只属于两个人的小空间',
      query: alone ? 'invite=' + encodeURIComponent(this.data.inviteCode) : '',
      imageUrl: SHARE_IMAGE
    };
  }
});
