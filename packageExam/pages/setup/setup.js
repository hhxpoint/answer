const gp = require('../../../utils/global-profile.js');
const identity = require('../../utils/exam-identity.js');
const store = require('../../utils/exam-store.js');
const sync = require('../../utils/exam-sync.js');
const share = require('../../utils/share.js');

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    from: '',
    saving: false,
    tip: ''
  },

  onLoad(options) {
    share.enableMenu();
    const from = (options && options.from) ? decodeURIComponent(options.from) : '';
    const p = identity.localProfile() || {};
    this.setData({
      from: from,
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
    // 头像可以不选：用默认头像，避免「选头像」这一步把人卡死
    const avatarUrl = this.data.avatarUrl || '/packageExam/assets/default-avatar.png';
    const nickName = String(this.data.nickName || '').trim();
    if (!nickName) {
      this.setData({ tip: '写个昵称就能开始；也可以点下面「先不设置」' });
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

    gp.pushLocalProfile(profile)
      .then(function (latest) {
        // 服务端会把头像转成持久 URL，写回本地避免临时路径失效
        if (latest && latest.avatarUrl) {
          const cur = wx.getStorageSync('userProfile') || {};
          if (String(cur.avatarUrl || '').indexOf('http') !== 0) {
            cur.avatarUrl = latest.avatarUrl;
            try { wx.setStorageSync('userProfile', cur); } catch (e) {}
          }
        }
        return identity.ensureUid();
      })
      .then(function () {
        store.migrate();
        return sync.auto();
      })
      .then(function () {
        that.setData({ saving: false });
        wx.showToast({ title: '已保存', icon: 'success' });
        that.leave();
      })
      .catch(function () {
        // 网络失败也算保存成功（本地已存），后续进模块会自动补同步
        that.setData({ saving: false });
        wx.showToast({ title: '已保存到本机', icon: 'none' });
        that.leave();
      });
  },

  leave() {
    const from = this.data.from;
    setTimeout(function () {
      if (from) {
        wx.redirectTo({
          url: from,
          fail: function () { wx.navigateBack({ delta: 1 }); }
        });
      } else {
        wx.navigateBack({ delta: 1 });
      }
    }, 350);
  },

  /** 先不设置：直接进目标页，之后在首页横幅还能补 */
  skip() {
    const from = this.data.from || '/packageExam/pages/home/home';
    wx.redirectTo({
      url: from,
      fail: function () {
        wx.navigateTo({
          url: from,
          fail: function () { wx.navigateBack({ delta: 1 }); }
        });
      }
    });
  },

  onShareAppMessage: function () {
    const s = share.fallback();
    return { title: s.title, path: s.path, imageUrl: share.cover('home') };
  },

  onShareTimeline: function () {
    return share.timeline(share.fallback(), 'home');
  }
});
