// pictionary的 user_info
import { CONFIG } from '../../utils/config.js';
const app = getApp();

Page({
  data: {
    nickname: '',
    avatar: '',
    pendingAction: '',
    pendingRoomId: '',
  },

  onLoad(options) {
    if (options.action === 'join' && options.roomId) {
      this.setData({
        pendingAction: options.action,
        pendingRoomId: options.roomId,
      });
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const fs = wx.getFileSystemManager();
    try {
      const base64 = fs.readFileSync(avatarUrl, 'base64');
      this.setData({ avatar: 'data:image/jpeg;base64,' + base64 });
    } catch (err) {
      console.error('头像读取失败:', err);
      this.setData({ avatar: avatarUrl });
    }
  },

  onInputNickname(e) {
    const val = e.detail.value;
    if (val) {
      this.setData({ nickname: val });
    }
  },

  submitInfo() {
    const { nickname, avatar } = this.data;

    if (!nickname || !avatar) {
      wx.showToast({ title: '请完善头像和昵称', icon: 'none' });
      return;
    }

    // 1. 先保存到本地（同步操作，立即生效）
    const profile = { nickname, avatar };
    wx.setStorageSync('gameProfile', profile);
    app.globalData.gameProfile = profile;

    // 2. 异步同步到服务器（不阻塞跳转）
    const token = wx.getStorageSync('token') || app.globalData.token;
    wx.request({
      url: `${CONFIG.API_URL}/api/profile/update`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: { nickname, avatar, signature: '' },
      success: () => { console.log('服务器同步成功'); },
      fail: (err) => { console.error('同步失败:', err); }
    });

    // 3. 立即跳转，不等服务器响应（本地 storage 已经保存好了）
    // 用 reLaunch 确保清除页面栈，lobby 的 onLoad 一定会被触发
    wx.showLoading({ title: '保存成功...' });
    setTimeout(() => {
      wx.hideLoading();
      if (this.data.pendingAction === 'join' && this.data.pendingRoomId) {
        console.log('[UserInfo] 跳回 lobby 加入房间:', this.data.pendingRoomId);
        wx.reLaunch({
          url: `/pictionary/pages/lobby/lobby?action=join&roomId=${this.data.pendingRoomId}`
        });
      } else {
        wx.reLaunch({ url: '/pictionary/pages/lobby/lobby' });
      }
    }, 300);
  }
})
