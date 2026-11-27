const gp = require('../../utils/global-profile.js');
const guard = require('../../utils/profile-guard.js');

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    from: '',
    saving: false,
    tip: ''
  },

  onLoad(options) {
    const from = (options && options.from) ? decodeURIComponent(options.from) : guard.takeFrom();
    const p = gp.getLocalProfile() || {};
    this.setData({
      from: from || '/pages/index/index',
      avatarUrl: p.avatarUrl || '',
      nickName: p.nickName || ''
    });
  },

  onChooseAvatar(e) {
    const url = e && e.detail && e.detail.avatarUrl;
    if (!url) return;
    this.setData({ avatarUrl: url, tip: '' });
  },

  onNick(e) {
    this.setData({ nickName: (e.detail.value || '').trim(), tip: '' });
  },

  save() {
    const avatarUrl = this.data.avatarUrl || '/assets/default-avatar.png';
    const nickName = String(this.data.nickName || '').trim();
    if (!nickName) {
      this.setData({ tip: '请填写昵称' });
      return;
    }
    if (this.data.saving) return;
    this.setData({ saving: true, tip: '' });

    const that = this;
    const old = wx.getStorageSync('userProfile') || {};
    const firstAt = Number(wx.getStorageSync('userFirstRegisterAt')) || Number(old.createdAt) || Date.now();
    try { wx.setStorageSync('userFirstRegisterAt', firstAt); } catch (e) {}

    const profile = Object.assign({}, old, {
      userId: old.userId || '',
      nickName: nickName,
      avatarUrl: avatarUrl,
      createdAt: firstAt,
      updatedAt: Date.now()
    });
    try { wx.setStorageSync('userProfile', profile); } catch (e) {}

    gp.markLoggedIn();
    gp.markDirty();

    function leave() {
      guard.clearFrom();
      const from = that.data.from || '/pages/index/index';
      wx.reLaunch({
        url: from,
        fail: function () { wx.reLaunch({ url: '/pages/index/index' }); }
      });
    }

    gp.pushLocalProfile(profile)
      .then(function (latest) {
        if (latest && latest.avatarUrl) {
          const cur = wx.getStorageSync('userProfile') || {};
          if (String(cur.avatarUrl || '').indexOf('http') !== 0) {
            cur.avatarUrl = latest.avatarUrl;
            try { wx.setStorageSync('userProfile', cur); } catch (e) {}
          }
        }
        that.setData({ saving: false });
        wx.showToast({ title: '已保存', icon: 'success' });
        setTimeout(leave, 320);
      })
      .catch(function () {
        that.setData({ saving: false });
        wx.showToast({ title: '已保存到本机', icon: 'none' });
        setTimeout(leave, 320);
      });
  }
});
