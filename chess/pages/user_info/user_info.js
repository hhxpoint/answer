
// chess的user_info
import { CONFIG } from '../../utils/config.js'; // 确保路径正确
const app = getApp();

Page({
  data: {
    nickname: '',
    avatar: '',
    // 从 lobby 跳转过来时携带的联机参数
    pendingAction: '',
    pendingRoomId: '',
    pendingVoice: 'false'
  },

  onLoad(options) {
    if (options.action === 'join' && options.roomId) {
      this.setData({
        pendingAction: options.action,
        pendingRoomId: options.roomId,
        pendingVoice: options.voice || 'false'
      });
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    // 转成 base64 永久保存，防止临时 URL 过期
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
  
    // 1. 保存到本地缓存
    const profile = { nickname, avatar };
    wx.setStorageSync('gameProfile', profile);
  
    // 2. 保存到全局变量
    app.globalData.gameProfile = profile;
  
    // 3. 同步到服务器数据库
    // 【关键修改 1】：使用 CONFIG.API_URL 替代硬编码 IP
    // 【关键修改 2】：优先从缓存获取 token，防止 app.globalData 被清空
    const token = wx.getStorageSync('token') || app.globalData.token;

    // if (!token) {
    //   wx.showToast({ title: '登录状态失效，请重新登录', icon: 'none' });
    //   return;
    // }

    wx.showLoading({ title: '同步中...' });

    wx.request({
      url: `${CONFIG.API_URL}/api/profile/update`, 
      method: 'POST',
      header: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
      },
      data: { 
        nickname, 
        avatar,
        signature: '' // 显式传空，或者后端做处理
      },
      success: (res) => { 
        console.log('服务器同步成功'); 
      },
      fail: (err) => {
        console.error('同步失败:', err);
      },
      complete: () => {
        wx.hideLoading();
        // 如果是从联机邀请跳过来的，回到 lobby 继续加入房间
        if (this.data.pendingAction === 'join' && this.data.pendingRoomId) {
          wx.redirectTo({
            url: `/chess/pages/lobby/lobby?action=join&roomId=${this.data.pendingRoomId}&voice=${this.data.pendingVoice}`
          });
        } else {
          wx.reLaunch({ url: '/chess/pages/chess/chess' });
        }
      }
    });
  }
})