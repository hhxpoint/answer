const api = require('../../utils/couple-api.js');
const spaceCtx = require('../../utils/space.js');

const SHARE_IMAGE = '/assets/couple-share.png';

Page({
  data: {
    loading: true,
    ready: false,
    step: 'ready',
    nickname: '',
    myAvatar: '',
    inviteCode: '',
    joinCode: '',
    saving: false,
    joining: false,
    errorText: '',
    invited: false,
    invitedCode: ''
  },

  onLoad: function (options) {
    this.inviteFromQuery = ((options && options.invite) || '').trim().toUpperCase();
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    this.init();
  },

  onUnload: function () {
    if (this.pollTimer) clearInterval(this.pollTimer);
  },

  init: function () {
    const that = this;
    return api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        const couple = res.couple;
        if (couple && couple.id) spaceCtx.setCurrentSpaceId(couple.id);
        const nick = (res.user && res.user.nickname) || '';
        const avatar = api.absUrl(res.user && res.user.avatar);

        // 第一步：没有微信昵称/头像的用户，先去资料页
        if (!res.user || !res.user.nickname || !res.user.avatar) {
          let url = '/packageCouple/pages/profile/profile?next=bind';
          if (that.inviteFromQuery) url += '&invite=' + encodeURIComponent(that.inviteFromQuery);
          wx.redirectTo({ url: url });
          return;
        }

        that.setData({ nickname: nick, myAvatar: avatar });

        if (couple && couple.partner) {
          wx.showToast({ title: '你已经有另一半啦', icon: 'none' });
          setTimeout(function () { wx.redirectTo({ url: '/packageCouple/pages/home/home' }); }, 700);
          return;
        }
        if (couple && !couple.partner) {
          // 已经创建过自己的小家，等 TA 加入
          that.setData({
            loading: false,
            ready: true,
            step: 'created',
            inviteCode: couple.invite_code || ''
          });
          if (that.inviteFromQuery) {
            wx.showToast({ title: '你已经创建了自己的小家', icon: 'none' });
          }
          that.startWaiting();
          return;
        }
        const invited = !!that.inviteFromQuery;
        that.setData({
          loading: false,
          ready: true,
          step: 'ready',
          invited: invited,
          invitedCode: invited ? that.inviteFromQuery : '',
          joinCode: invited ? that.inviteFromQuery : ''
        });
        if (invited) that.acceptInvite();
      })
      .catch(function (err) {
        that.setData({ loading: false, ready: true, errorText: err.msg || '加载失败，下拉重试' });
      });
  },

  onCreate: function () {
    const that = this;
    if (this.data.saving) return;
    this.setData({ saving: true });
    api.createCouple()
      .then(function (res) {
        if (res.couple && res.couple.id) spaceCtx.setCurrentSpaceId(res.couple.id);
        that.setData({
          saving: false,
          step: 'created',
          inviteCode: res.couple.invite_code
        });
        that.startWaiting();
      })
      .catch(function (err) {
        that.setData({ saving: false });
        wx.showToast({ title: err.msg || '创建失败', icon: 'none' });
      });
  },

  startWaiting: function () {
    const that = this;
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(function () {
      api.me()
        .then(function (res) {
          if (res.couple && res.couple.partner) {
            clearInterval(that.pollTimer);
            that.pollTimer = null;
            wx.showToast({ title: 'TA 来啦', icon: 'none' });
            setTimeout(function () {
              wx.redirectTo({ url: '/packageCouple/pages/home/home' });
            }, 800);
          }
        })
        .catch(function () {});
    }, 3000);
  },

  copyCode: function () {
    if (!this.data.inviteCode) return;
    wx.setClipboardData({ data: this.data.inviteCode });
  },

  onJoinInput: function (e) {
    this.setData({ joinCode: e.detail.value });
  },

  onJoin: function () {
    const code = (this.data.joinCode || '').trim();
    if (!code) {
      wx.showToast({ title: '输入 TA 的邀请码', icon: 'none' });
      return;
    }
    this.doJoin(code);
  },

  acceptInvite: function () {
    const code = (this.data.invitedCode || '').trim();
    if (!code) return;
    this.doJoin(code);
  },

  doJoin: function (code) {
    const that = this;
    if (this.data.joining) return;
    this.setData({ joining: true });
    api.joinCouple(code)
      .then(function (res) {
        if (res && res.couple && res.couple.id) spaceCtx.setCurrentSpaceId(res.couple.id);
        that.setData({ joining: false });
        wx.showToast({ title: '你们的小火苗亮起来啦', icon: 'none' });
        setTimeout(function () {
          wx.redirectTo({ url: '/packageCouple/pages/home/home' });
        }, 700);
      })
      .catch(function (err) {
        that.setData({ joining: false });
        wx.showToast({ title: err.msg || '绑定失败', icon: 'none' });
      });
  },

  onShareAppMessage: function () {
    const code = this.data.inviteCode || '';
    return {
      title: code ? '🔥 来和我一起养一只小火苗吧' : '🔥 一起养一只只属于两个人的小火苗',
      path: '/packageCouple/pages/bind/bind' + (code ? '?invite=' + encodeURIComponent(code) : ''),
      imageUrl: SHARE_IMAGE
    };
  },

  onShareTimeline: function () {
    const code = this.data.inviteCode || '';
    return {
      title: '🔥 我们的小火苗 · 只属于两个人的小空间',
      query: code ? 'invite=' + encodeURIComponent(code) : '',
      imageUrl: SHARE_IMAGE
    };
  }
});
