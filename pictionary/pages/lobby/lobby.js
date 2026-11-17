// pictionary 的 lobby
import { CONFIG } from '../../utils/config.js';
const app = getApp();

Page({
  data: {
    waiting: false,
    isJoiner: false,
    roomId: '',
    roundOptions: [3, 5, 8, 10],
    selectedRounds: 5,
  },

  onLoad(options) {
    console.log('[Lobby] onLoad, options:', JSON.stringify(options));
    this._pendingOptions = options || {};

    // 如果有进行中的游戏且 socket 还活着，直接跳回游戏页
    const savedGame = app.globalData.pictionaryGameState;
    const socketAlive = app.globalData.pictionarySocket && app.globalData.pictionarySocket.readyState === 1;
    if (savedGame && savedGame.gameStarted && socketAlive && (!options || !options.action)) {
      const rid = app.globalData.pictionaryRoomId || '';
      wx.redirectTo({ url: `/pictionary/pages/pictionary/pictionary?mode=online&roomId=${rid}` });
      return;
    }

    this._handleJoinOptions(options);
  },

  onShow() {
    if (this._pendingOptions && this._pendingOptions.action === 'join' && this._pendingOptions.roomId) {
      this._handleJoinOptions(this._pendingOptions);
    }
  },

  _handleJoinOptions(options) {
    if (!options || options.action !== 'join' || !options.roomId) return;
    if (this.data.isJoiner) return;

    const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
    if (!profile || !profile.nickname) {
      wx.redirectTo({
        url: `/pictionary/pages/user_info/user_info?action=join&roomId=${options.roomId}`
      });
      return;
    }

    this.setData({ isJoiner: true, roomId: options.roomId });
    this.joinRoom(options.roomId);
  },

  onUnload() {
    if (this._joinTimeout) clearTimeout(this._joinTimeout);
    if (this._heartbeat) clearInterval(this._heartbeat);
    if (!this._navigatingToGame) {
      this._closeSocket();
    }
  },

  _closeSocket() {
    if (app.globalData.pictionarySocket) {
      try { app.globalData.pictionarySocket.close(); } catch(e) {}
      app.globalData.pictionarySocket = null;
    }
  },

  initSocket(onOpenCallback) {
    if (app.globalData.pictionarySocket && app.globalData.pictionarySocket.readyState === 1) {
      if(onOpenCallback) onOpenCallback();
      return;
    }
    this._closeSocket();
    wx.showLoading({ title: '连接服务器...' });


    

    const token = wx.getStorageSync('token');
    let targetWsUrl = CONFIG.WS_URL;
    if (targetWsUrl.endsWith('/ws') && !targetWsUrl.includes('/pictionary/ws')) {
      targetWsUrl = targetWsUrl.replace(/\/ws$/, '/pictionary/ws');
    }
    const wsUrl = token ? `${targetWsUrl}?token=${token}` : targetWsUrl;

    app.globalData.pictionarySocket = wx.connectSocket({ url: wsUrl });

    app.globalData.pictionarySocket.onOpen(() => {
      wx.hideLoading();
      const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
      if (profile && profile.nickname) {
        app.globalData.pictionarySocket.send({
          data: JSON.stringify({
            action: 'set_profile',
            payload: { nickname: profile.nickname, avatar: profile.avatar || '' }
          })
        });
      }
      if(onOpenCallback) onOpenCallback();
    });

    app.globalData.pictionarySocket.onMessage((res) => {
      const data = JSON.parse(res.data);
      const role = this.data.isJoiner ? 'JOINER' : 'HOST';
      console.log(`[Lobby][${role}] 收到: ${data.action}`, JSON.stringify(data).substring(0, 200));

      if (data.action === 'room_created') {
        const rid = data.payload?.roomId || data.roomId || '';
        this.setData({ waiting: true, roomId: rid });
        wx.showToast({ title: '房间创建成功', icon: 'success' });
      } else if (data.action === 'game_start') {
        if (this._joinTimeout) clearTimeout(this._joinTimeout);
        if (this._heartbeat) clearInterval(this._heartbeat);
        wx.showToast({ title: '游戏即将开始', icon: 'success' });
        // 兼容后端不同的 payload 结构
        const payload = data.payload || data;
        const players = payload.players || data.players || [];
        app.globalData.pictionaryPlayers = players;
        app.globalData.pictionaryRoomId = this.data.roomId || payload.roomId || '';
        app.globalData.pictionaryMsgQueue = [data];
        this._navigatingToGame = true;
        const rid = app.globalData.pictionaryRoomId;
        wx.redirectTo({ url: `/pictionary/pages/pictionary/pictionary?mode=online&roomId=${rid}` });
      } else if (data.action === 'player_joined') {
        wx.showToast({ title: (data.payload?.nickname || '玩家') + ' 加入了', icon: 'none' });
      } else if (data.action === 'error') {
        if (this._joinTimeout) clearTimeout(this._joinTimeout);
        wx.hideLoading();
        wx.showToast({ title: data.payload?.message || '操作失败', icon: 'none' });
        this.setData({ isJoiner: false, waiting: false });
      } else if (this._navigatingToGame) {
        if (!app.globalData.pictionaryMsgQueue) app.globalData.pictionaryMsgQueue = [];
        app.globalData.pictionaryMsgQueue.push(data);
      }
    });

    app.globalData.pictionarySocket.onError(() => {
      if (this._joinTimeout) clearTimeout(this._joinTimeout);
      wx.hideLoading();
      wx.showToast({ title: '网络连接失败', icon: 'none' });
      this.setData({ isJoiner: false, waiting: false });
    });

    app.globalData.pictionarySocket.onClose(() => {
      app.globalData.pictionarySocket = null;
    });
  },

  onSelectRounds(e) {
    this.setData({ selectedRounds: e.currentTarget.dataset.rounds });
  },

  createRoom() {
    this.initSocket(() => {
      app.globalData.pictionarySelectedRounds = this.data.selectedRounds;
      app.globalData.pictionarySocket.send({
        data: JSON.stringify({ action: 'create_room', payload: { totalRounds: this.data.selectedRounds } })
      });
      // 心跳检测：每 5 秒检查 socket 是否还活着
      this._heartbeat = setInterval(() => {
        if (app.globalData.pictionarySocket && app.globalData.pictionarySocket.readyState !== 1) {
          console.warn('[Lobby] Socket 断开，尝试重连...');
          clearInterval(this._heartbeat);
          this._closeSocket();
          this.initSocket(() => {
            app.globalData.pictionarySocket.send({ data: JSON.stringify({ action: 'create_room' }) });
          });
        }
      }, 5000);
    });
  },

  joinRoom(roomId) {
    this.initSocket(() => { app.globalData.pictionarySocket.send({ data: JSON.stringify({ action: 'join_room', payload: { roomId } }) }); });
  },

  cancelRoom() {
    if (this._joinTimeout) clearTimeout(this._joinTimeout);
    this._closeSocket();
    this.setData({ waiting: false, roomId: '', isJoiner: false });
  },

  onShareAppMessage() {
    if (!this.data.roomId) return { title: '快来和我玩你画我猜！' };
    return { title: '来一局你画我猜，看谁是灵魂画手！', path: `/pictionary/pages/lobby/lobby?action=join&roomId=${this.data.roomId}` };
  }
});