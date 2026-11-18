const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');

Page({
  data: {
    loading: true,
    ready: false,
    errorText: '',
    nickname: '',
    avatarTemp: '',
    avatarPreview: '',
    saving: false,
    next: 'home'
  },

  onLoad: function (options) {
    this.next = options && options.next === 'bind' ? 'bind' : 'home';
    this.inviteFromQuery = ((options && options.invite) || '').trim().toUpperCase();
    this.setData({ next: this.next });
    this.init();
  },

  init: function () {
    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        const user = res.user || {};
        const hasAvatar = !!user.avatar;
        const hasNickname = !!user.nickname;
        that.setData({
          loading: false,
          ready: true,
          nickname: user.nickname || '',
          avatarPreview: hasAvatar ? api.absUrl(user.avatar) : ''
        });
        if (hasAvatar && hasNickname) {
          // 已经设置过，直接进入下一步，不重复打扰
          that.goNext();
        }
      })
      .catch(function (err) {
        that.setData({ loading: false, ready: true, errorText: err.msg || '加载失败，下拉重试' });
      });
  },

  onChooseAvatar: function (e) {
    const url = (e.detail && e.detail.avatarUrl) || '';
    if (!url) return;
    this.setData({ avatarTemp: url, avatarPreview: url });
  },

  onNickInput: function (e) {
    this.setData({ nickname: e.detail.value });
  },

  readAvatarBase64: function (filePath) {
    return new Promise(function (resolve, reject) {
      const m = /\.(png|jpe?g|webp)$/i.exec(String(filePath || ''));
      let ext = m ? m[1].toLowerCase() : 'jpg';
      if (ext === 'jpeg') ext = 'jpg';
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success: function (res) {
          resolve('data:image/' + mime + ';base64,' + res.data);
        },
        fail: function () {
          reject({ code: 'READ_FAIL', msg: '头像读取失败' });
        }
      });
    });
  },

  onSave: function () {
    const that = this;
    if (this.data.saving) return;
    const nickname = (this.data.nickname || '').trim();
    if (!nickname) {
      wx.showToast({ title: '先填个昵称吧', icon: 'none' });
      return;
    }
    if (!this.data.avatarTemp && !this.data.avatarPreview) {
      wx.showToast({ title: '选一个头像吧', icon: 'none' });
      return;
    }
    const doSave = function (avatarData) {
      api.saveProfile(nickname, avatarData)
        .then(function (res) {
          api.setCachedUser(res.user);
          that.setData({ saving: false });
          wx.showToast({ title: '好啦', icon: 'none' });
          setTimeout(function () { that.goNext(); }, 350);
        })
        .catch(function (err) {
          that.setData({ saving: false });
          wx.showToast({ title: err.msg || '保存失败', icon: 'none' });
        });
    };

    this.setData({ saving: true });
    if (this.data.avatarTemp) {
      this.readAvatarBase64(this.data.avatarTemp)
        .then(function (dataUrl) { doSave(dataUrl); })
        .catch(function () {
          that.setData({ saving: false });
          wx.showToast({ title: '头像读取失败，换一张试试', icon: 'none' });
        });
    } else {
      doSave('');
    }
  },

  goNext: function () {
    if (this.next === 'bind') {
      let url = '/packageCouple/pages/bind/bind';
      if (this.inviteFromQuery) url += '?invite=' + encodeURIComponent(this.inviteFromQuery);
      wx.redirectTo({ url: url });
      return;
    }
    wx.redirectTo({ url: '/packageCouple/pages/home/home' });
  },

  onShareAppMessage: function () {
    return {
      title: '我们的小火苗 · 只属于两个人的小空间',
      path: '/packageCouple/pages/spaces/spaces',
      imageUrl: share.cover('bind')
    };
  },

  onShareTimeline: function () {
    return { title: '我们的小火苗 · 只属于两个人的小空间', imageUrl: share.cover('bind') };
  }

});