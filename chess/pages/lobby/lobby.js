
// chess 的 lobby
// import { CONFIG } from '../../../utils/config.js'; 
import { CONFIG } from '../../utils/config.js';
const app = getApp();

Page({
  data: {
    enableVoice: false,
    waiting: false,
    isJoiner: false,
    roomId: '',
  },

  onLoad(options) {
    // 检查是否有身份设置，没有则先去设置
    const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
    if (!profile || !profile.nickname) {
      // 把 join 参数带过去，设置完身份后可以回来
      const params = options.action === 'join' && options.roomId
        ? `?action=join&roomId=${options.roomId}&voice=${options.voice || 'false'}`
        : '';
      wx.redirectTo({ url: '/chess/pages/user_info/user_info' + params });
      return;
    }

    // 判断是否是通过分享卡片进来的好友
    if (options.action === 'join' && options.roomId) {
      this.setData({
        isJoiner: true,
        roomId: options.roomId,
        enableVoice: options.voice === 'true'
      });
      this.joinRoom(options.roomId);
    }
  },

  onVoiceChange(e) {
    this.setData({ enableVoice: e.detail.value });
  },

  // 核心：初始化全局 WebSocket
  initSocket(onOpenCallback) {
    
    // 如果已经连接且处于 OPEN 状态，直接执行回调，不再重复连接
    if (app.globalData.chessSocket && app.globalData.chessSocket.readyState === 1) {
      if(onOpenCallback) onOpenCallback();
      return;
    }

    if (app.globalData.chessSocket) {
      app.globalData.chessSocket.close();
    }
    
    wx.showLoading({ title: '连接服务器...' });

    

    // 【关键修改】：在 URL 后面拼接 token，否则后端无法获取你的昵称和头像
    const token = wx.getStorageSync('token');
    // const wsUrl = `${CONFIG.WS_URL}?token=${token}`;
    const wsUrl = token ? `${CONFIG.WS_URL}?token=${token}` : CONFIG.WS_URL; 
    
    app.globalData.chessSocket = wx.connectSocket({ url: wsUrl });

    app.globalData.chessSocket.onOpen(() => {
      wx.hideLoading();
      console.log('象棋 Socket 已连接');

      // 发送玩家身份信息（解决无token时显示"未知玩家"的问题）
      const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
      if (profile && profile.nickname) {
        app.globalData.chessSocket.send({
          data: JSON.stringify({
            action: 'set_profile',
            payload: { nickname: profile.nickname, avatar: profile.avatar || '' }
          })
        });
      }

      if(onOpenCallback) onOpenCallback();
    });

    app.globalData.chessSocket.onMessage((res) => {
      const data = JSON.parse(res.data);
      console.log('Lobby收到消息:', data);

      if (data.action === 'room_created') {
        this.setData({ waiting: true, roomId: data.roomId });
        wx.showToast({ title: '房间创建成功', icon: 'success' });
      } 
      else if (data.action === 'game_start') {
        wx.showToast({ title: '对方已加入，准备开局', icon: 'success' });

        // 记录角色和对手信息，chess.js 加载后从 globalData 读取
        const myRole = data.role || 1;
        const opp = data.payload || {};
        app.globalData.onlineOpponent = {
          nickname: opp.opponent_nickname || '对手',
          avatar: opp.opponent_avatar || '',
          id: opp.opponent_id || ''
        };
        // 保存 roomId 供 chess.js 发送 move 时使用
        app.globalData.onlineRoomId = this.data.roomId || '';

        app.globalData.voiceEnabled = this.data.enableVoice; // 增加这一行，方便全局调用
        wx.redirectTo({
          url: `/chess/pages/chess/chess?mode=online&role=${myRole}&voice=${this.data.enableVoice}`
        });
      }
      else if (data.action === 'error') {
        wx.hideLoading();
        wx.showToast({ title: data.payload?.message || '操作失败', icon: 'none' });
        this.setData({ isJoiner: false, waiting: false });
      }
    });

    app.globalData.chessSocket.onError((err) => {
      wx.hideLoading();
      console.error('Socket错误:', err);
      wx.showToast({ title: '网络连接失败', icon: 'none' });
    });
  },

  // 房主点击创建
  createRoom() {
    this.initSocket(() => {
      app.globalData.chessSocket.send({ data: JSON.stringify({ action: 'create_room' }) });
    });
  },

  // 好友自动加入
  joinRoom(roomId) {
    this.initSocket(() => {
      app.globalData.chessSocket.send({ 
        data: JSON.stringify({ action: 'join_room', payload: { roomId } }) 
      });
    });
  },

  cancelRoom() {
    if (app.globalData.chessSocket) {
      app.globalData.chessSocket.close();
      app.globalData.chessSocket = null; // 彻底清除，方便下次重新连接
    }
    this.setData({ waiting: false, roomId: '' });
  },

  onShareAppMessage() {
    if (!this.data.roomId) {
      return { title: '快来和我玩高级中国象棋！' };
    }
    return {
      title: this.data.enableVoice ? '我开了语音，速来象棋对战！' : '来一局中国象棋联机对决！',
      path: `/chess/pages/lobby/lobby?action=join&roomId=${this.data.roomId}&voice=${this.data.enableVoice}`,
    };
  }
});