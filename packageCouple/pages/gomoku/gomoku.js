// 五子棋 · 小火苗
// 模式：本地双人 / 人机（Rapfi 引擎 + 难度）/ 在线双人
// 在线对局复用 couple-ws；聊天复用悄悄话 /messages，同一个消息窗口。
const api = require('../../utils/couple-api.js');
const wsClient = require('../../utils/couple-ws.js');
const gomoku = require('../../utils/gomoku.js');
const gomokuAI = require('../../utils/gomoku-ai.js');

const SIZE = gomoku.SIZE;
const EMPTY = gomoku.EMPTY;
const BLACK = gomoku.BLACK;
const WHITE = gomoku.WHITE;

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function chatTime(ts) {
  const d = new Date(ts || Date.now());
  return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}

Page({
  data: {
    ready: false,
    errorText: '',
    boardW: 320,
    boardH: 320,
    boardReady: false,

    myId: 0,
    partnerId: 0,
    myName: '我',
    partnerName: 'TA',
    myInitial: '我',
    partnerInitial: 'TA',
    myAvatar: '',
    partnerAvatar: '',
    online: false,
    partnerOnline: false,
    connText: '连接中…',

    mode: 'online', // local | ai | online
    modeName: '在线对弈',
    difficulty: 'medium',
    difficultyName: '进阶',
    difficultyMs: '1.2s',
    difficultyList: [
      { key: 'easy', name: '入门', sub: '轻松', ms: '300ms' },
      { key: 'medium', name: '进阶', sub: '认真', ms: '1.2s' },
      { key: 'hard', name: '挑战', sub: '全力', ms: '3.8s' }
    ],
    aiThinking: false,

    stage: 'lobby', // lobby | playing | result
    myColor: BLACK,
    current: BLACK,
    myTurn: false,
    moverName: '',
    turnText: '等待开局',
    movesCount: 0,
    winner: 0,
    winLine: null,
    resultTitle: '',
    resultSub: '',
    showResult: false,

    chatOpen: false,
    chatMessages: [],
    chatInput: '',
    chatSending: false,
    chatUnread: 0,
    lastChat: '和 TA 说点什么…',
    chatScroll: ''
  },

  onLoad: function () {
    const app = getApp();
    if (app && app.globalData && app.globalData.gomokuPage &&
        app.globalData.gomokuPage !== this && getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 });
      return;
    }
    if (app && app.globalData) app.globalData.gomokuPage = this;
    this._pageOwner = true;
    this._socket = null;
    this._socketAlive = false;
    this._ctx = null;
    this._canvas = null;
    this._rect = null;
    this._board = gomoku.createBoard();
    this._moves = [];
    this._lastMove = null;
    this._winLine = null;
    this._gameId = '';
    this._starterId = 0;
    this._cell = 0;
    this._padding = 0;
    this._radius = 0;
    this._profileMyName = '我';
    this._profilePartnerName = 'TA';
    this._profileMyAvatar = '';
    this._profilePartnerAvatar = '';
    this._aiTimer = null;
    this._chatMap = {};
    this._chatOrder = [];

    const sys = wx.getSystemInfoSync();
    const w = Math.floor(sys.windowWidth * 0.86);
    this.setData({ boardW: w, boardH: w });

    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        const user = (res && res.user) || {};
        const couple = res && res.couple;
        const partner = couple && couple.partner;
        const myName = user.nickname || '我';
        const pName = partner && partner.nickname ? partner.nickname : 'TA';
        that._profileMyName = myName;
        that._profilePartnerName = pName;
        that._profileMyAvatar = api.absUrl(user.avatar);
        that._profilePartnerAvatar = partner ? api.absUrl(partner.avatar) : '';
        that.setData({
          ready: true,
          errorText: '',
          myId: user.id || 0,
          myName: myName,
          myInitial: myName.slice(0, 1) || '我',
          myAvatar: that._profileMyAvatar,
          partnerId: partner ? partner.id || 0 : 0,
          partnerName: pName,
          partnerInitial: pName.slice(0, 1) || 'TA',
          partnerAvatar: that._profilePartnerAvatar,
          mode: partner ? 'online' : 'local',
          modeName: partner ? '在线对弈' : '本地双人',
          partnerOnline: false
        });
        if (partner) {
          that.connect();
          that.loadChat();
        } else {
          that.setData({ myName: '玩家 A', partnerName: '玩家 B', myAvatar: '', partnerAvatar: '' });
        }
        if (wx.showShareMenu) {
          wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
        }
      })
      .catch(function (err) {
        that.setData({ ready: true, errorText: (err && (err.msg || err.message)) || '加载失败，请稍后再试' });
      });
  },

  onReady: function () {
    this.initCanvas();
  },

  onShow: function () {
    if (this.data.mode === 'online') this.ensureSocket();
    if (this.data.boardReady) this.draw();
  },

  onHide: function () {
    this._socketAlive = false;
    if (this._aiTimer) { clearTimeout(this._aiTimer); this._aiTimer = null; }
  },

  onUnload: function () {
    if (this._aiTimer) { clearTimeout(this._aiTimer); this._aiTimer = null; }
    if (this._socket) {
      try { this._socket.send({ type: 'gomoku', payload: { action: 'leave' } }); } catch (e) {}
      try { this._socket.close(); } catch (e) {}
      this._socket = null;
    }
    this._socketAlive = false;
    const app = getApp();
    if (app && app.globalData && app.globalData.gomokuPage === this) app.globalData.gomokuPage = null;
  },

  noop: function () {},

  // ===== 连接 =====
  ensureSocket: function () {
    if (!this.data.partnerId) return;
    if (this._socket && this._socketAlive && this.data.online) return;
    this.connect();
  },

  connect: function () {
    if (!this.data.partnerId) return;
    if (this._socket) {
      try { this._socket.close(); } catch (e) {}
      this._socket = null;
    }
    const that = this;
    this._socketAlive = false;
    this.setData({ connText: '连接中…' });
    this._socket = wsClient.createChatSocket({
      getToken: api.getToken,
      getSpaceId: api.getSpaceId,
      onStatus: function (status) {
        if (status === 'offline') {
          that._socketAlive = false;
          that.setData({ online: false, partnerOnline: false, connText: '网络重连中…' });
        } else if (status === 'online') {
          that._socketAlive = true;
        }
      },
      onReady: function (data) {
        that._socketAlive = true;
        const online = (data && data.online) || [];
        const partnerOnline = online.indexOf(that.data.partnerId) >= 0;
        that.setData({ online: true, partnerOnline: partnerOnline, connText: partnerOnline ? 'TA 在线' : '等 TA 上线' });
        if (that.data.stage === 'playing' && that.data.mode === 'online') that.sendEvent('sync_req');
      },
      onMessage: function (data) { that.handleWs(data); }
    });
  },

  handleWs: function (data) {
    if (!data) return;
    if (data.type === 'presence') {
      if (data.user_id === this.data.partnerId) {
        const online = !!data.online;
        this.setData({ partnerOnline: online, connText: online ? 'TA 在线' : '等 TA 上线' });
      }
      return;
    }
    if (data.type === 'message' && data.message) {
      this.appendChat(data.message);
      return;
    }
    if (data.type === 'message_recall' && data.message) {
      this.appendChat(data.message);
      return;
    }
    if (data.type !== 'gomoku') return;
    if (data.from === this.data.myId) return;
    if (this.data.mode !== 'online') return;
    const p = data.payload || {};
    const action = p.action;
    if (!action) return;
    if (action === 'start') return this.onRemoteStart(p);
    if (action === 'move') return this.onRemoteMove(p);
    if (action === 'resign') return this.onRemoteResign(p);
    if (action === 'sync_req') return this.onRemoteSyncReq(p);
    if (action === 'state') return this.onRemoteState(p);
    if (action === 'leave') {
      this.setData({ partnerOnline: false, connText: 'TA 离开了对局' });
      if (this.data.stage === 'playing') {
        this.setData({ stage: 'lobby', showResult: false, winner: 0, winLine: null, turnText: '等待开局' });
        this.draw();
      }
    }
  },

  sendEvent: function (action, payload) {
    if (!this._socket || this.data.mode !== 'online') return false;
    return this._socket.send({
      type: 'gomoku',
      payload: Object.assign({ action: action, game_id: this._gameId }, payload || {})
    });
  },

  // ===== 模式 =====
  switchMode: function (e) {
    if (this.data.stage !== 'lobby') return;
    const mode = (e.currentTarget.dataset || {}).mode;
    if (mode === this.data.mode) return;
    if (mode === 'online' && !this.data.partnerId) {
      wx.showToast({ title: '先邀请 TA 进入小火苗', icon: 'none' });
      return;
    }
    this.setData({ mode: mode, modeName: mode === 'local' ? '本地双人' : mode === 'ai' ? '人机对弈' : '在线对弈' });
    this.applyModeLabels(mode);
    this.resetGameBoard();
    this.draw();
  },

  applyModeLabels: function (mode) {
    if (mode === 'local') {
      this.setData({ myName: '玩家 A', partnerName: '玩家 B', myAvatar: '', partnerAvatar: '', myInitial: 'A', partnerInitial: 'B' });
    } else if (mode === 'ai') {
      const lv = gomokuAI.LEVELS[this.data.difficulty] || gomokuAI.LEVELS.medium;
      this.setData({
        myName: this._profileMyName,
        partnerName: 'AI · ' + lv.name,
        myAvatar: this._profileMyAvatar,
        partnerAvatar: '',
        myInitial: (this._profileMyName || '我').slice(0, 1),
        partnerInitial: 'AI'
      });
    } else {
      this.setData({
        myName: this._profileMyName,
        partnerName: this._profilePartnerName,
        myAvatar: this._profileMyAvatar,
        partnerAvatar: this._profilePartnerAvatar,
        myInitial: (this._profileMyName || '我').slice(0, 1),
        partnerInitial: (this._profilePartnerName || 'TA').slice(0, 1)
      });
    }
  },

  changeDifficulty: function (e) {
    const key = (e.currentTarget.dataset || {}).key;
    const lv = gomokuAI.LEVELS[key];
    if (!lv) return;
    this.setData({ difficulty: key, difficultyName: lv.name });
    if (this.data.mode === 'ai') {
      this.setData({ partnerName: 'AI · ' + lv.name });
    }
  },

  resetGameBoard: function () {
    this._moves = [];
    this._board = gomoku.createBoard();
    this._lastMove = null;
    this._winLine = null;
    this.setData({ movesCount: 0, winner: 0, winLine: null, showResult: false, myTurn: false, current: BLACK, turnText: '等待开局', aiThinking: false });
  },

  // ===== 开局 =====
  startGame: function () {
    if (this.data.mode === 'online') return this.startOnline();
    if (this.data.mode === 'ai') return this.startAI();
    return this.startLocal();
  },

  startLocal: function () {
    this.resetGameBoard();
    this._gameId = 'local';
    this._starterId = this.data.myId;
    this.setData({
      stage: 'playing',
      myColor: BLACK,
      current: BLACK,
      myTurn: true,
      aiThinking: false,
      turnText: '轮到玩家 A · 落黑子',
      moverName: '玩家 A'
    });
    this.draw();
  },

  startAI: function () {
    const lv = gomokuAI.LEVELS[this.data.difficulty] || gomokuAI.LEVELS.medium;
    this.resetGameBoard();
    this._gameId = 'ai_' + Date.now();
    this._starterId = this.data.myId;
    this.setData({
      stage: 'playing',
      myColor: BLACK,
      current: BLACK,
      myTurn: true,
      aiThinking: false,
      turnText: '你的回合 · 落黑子',
      moverName: this.data.myName,
      partnerName: 'AI · ' + lv.name
    });
    this.draw();
  },

  startOnline: function () {
    if (!this.data.partnerOnline) {
      wx.showToast({ title: '等 TA 在线再开始', icon: 'none' });
      return;
    }
    const id = 'g' + Date.now() + '_' + this.data.myId;
    this._gameId = id;
    this._starterId = this.data.myId;
    this.resetGameBoard();
    this.setData({
      stage: 'playing',
      myColor: BLACK,
      current: BLACK,
      myTurn: true,
      aiThinking: false,
      turnText: '你的回合 · 落黑子',
      moverName: this.data.myName
    });
    this.draw();
    this.sendEvent('start', { starter_id: this.data.myId });
  },

  onRemoteStart: function (p) {
    if (!p.game_id || this.data.mode !== 'online') return;
    const incomingStarter = Number(p.starter_id) || 0;
    if (this.data.stage === 'playing' && this._starterId && incomingStarter >= this._starterId) return;
    this._gameId = p.game_id;
    this._starterId = incomingStarter;
    this.resetGameBoard();
    const myColor = incomingStarter === this.data.myId ? BLACK : WHITE;
    this.setData({
      stage: 'playing',
      myColor: myColor,
      current: BLACK,
      myTurn: myColor === BLACK,
      winner: 0,
      winLine: null,
      showResult: false,
      movesCount: 0,
      turnText: myColor === BLACK ? '你的回合 · 落黑子' : 'TA 先手 · 落黑子',
      moverName: myColor === BLACK ? this.data.myName : this.data.partnerName
    });
    this.draw();
  },

  // ===== 落子 =====
  onBoardTap: function (e) {
    if (!this.data.boardReady || this.data.stage !== 'playing') return;
    if (this.data.mode === 'online' && (!this.data.myTurn || !this.data.online)) return;
    if (this.data.mode === 'ai' && (!this.data.myTurn || this.data.aiThinking)) return;
    const t = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]) || null;
    if (!t) return;
    let x = Number(t.x);
    let y = Number(t.y);
    if (!isFinite(x) || !isFinite(y)) {
      x = Number(t.clientX || 0);
      y = Number(t.clientY || 0);
    }
    if (this._rect && (x > this.data.boardW || y > this.data.boardH)) {
      x -= this._rect.left || 0;
      y -= this._rect.top || 0;
    }
    const col = Math.round((x - this._padding) / this._cell);
    const row = Math.round((y - this._padding) / this._cell);
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return;
    if (this._board[row][col] !== EMPTY) return;
    this.place(row, col, this.data.current, this.data.mode === 'online');
  },

  place: function (row, col, color, send) {
    if (this.data.stage !== 'playing') return false;
    if (this._board[row][col] !== EMPTY) return false;
    this._board[row][col] = color;
    const move = { x: row, y: col, c: color };
    this._moves.push(move);
    this._lastMove = move;
    const line = gomoku.checkWin(this._board, row, col, color);
    if (line) this._winLine = line;
    this.setData({ movesCount: this._moves.length });
    this.draw();
    if (send) this.sendEvent('move', { x: row, y: col, c: color });

    if (line) {
      this.finish(color);
      return true;
    }
    if (gomoku.isDraw(this._board, this._moves)) {
      this.finish(0);
      return true;
    }

    if (this.data.mode === 'local') {
      const next = color === BLACK ? WHITE : BLACK;
      this.setData({
        current: next,
        myTurn: true,
        turnText: '轮到' + (next === BLACK ? '玩家 A' : '玩家 B') + ' · 落' + (next === BLACK ? '黑子' : '白子'),
        moverName: next === BLACK ? this.data.myName : this.data.partnerName
      });
      return true;
    }

    if (this.data.mode === 'ai') {
      if (color === BLACK) {
        this.setData({ current: WHITE, myTurn: false, aiThinking: true, turnText: 'AI 思考中…' });
        const that = this;
        this._aiTimer = setTimeout(function () { that.runAI(); }, 220);
      } else {
        this.setData({ current: BLACK, myTurn: true, aiThinking: false, turnText: '你的回合 · 落黑子' });
      }
      return true;
    }

    const next = color === BLACK ? WHITE : BLACK;
    this.setData({
      current: next,
      myTurn: next === this.data.myColor && this.data.online,
      turnText: (next === this.data.myColor ? '你的回合' : 'TA 的回合') + ' · 落' + (next === BLACK ? '黑子' : '白子'),
      moverName: next === this.data.myColor ? this.data.myName : this.data.partnerName
    });
    return true;
  },

  runAI: function () {
    if (this.data.stage !== 'playing' || this.data.mode !== 'ai') return;
    const that = this;
    const fallback = function () {
      const p = gomokuAI.localBest(that._board, WHITE);
      that.setData({ aiThinking: false });
      if (p) that.place(p.x, p.y, WHITE, false);
    };
    gomokuAI.choose({
      moves: this._moves.slice(),
      board: this._board,
      color: WHITE,
      difficulty: this.data.difficulty
    }).then(function (p) {
      if (that.data.stage !== 'playing' || that.data.mode !== 'ai') return;
      that.setData({ aiThinking: false });
      if (!p || !that.place(p.x, p.y, WHITE, false)) fallback();
    }).catch(fallback);
  },

  onRemoteMove: function (p) {
    if (this.data.stage !== 'playing' || this.data.mode !== 'online') return;
    if (p.game_id && this._gameId && p.game_id !== this._gameId) return;
    if (Number(p.c) !== this.data.current) return;
    if (!isFinite(p.x) || !isFinite(p.y)) return;
    this.place(Number(p.x), Number(p.y), Number(p.c), false);
  },

  finish: function (winner) {
    const isMe = winner === this.data.myColor;
    const title = winner === 0 ? '和棋' : (isMe ? '你赢了' : (this.data.mode === 'ai' ? 'AI 赢了' : 'TA 赢了'));
    const sub = winner === 0 ? '棋盘已满，再来一局吧' : (isMe ? '五子连珠，漂亮的一手' : '这一局差一点，再来');
    this.setData({
      stage: 'result',
      winner: winner,
      myTurn: false,
      aiThinking: false,
      showResult: true,
      resultTitle: title,
      resultSub: sub,
      turnText: title
    });
    this.draw();
  },

  // ===== 认输 / 同步 =====
  resign: function () {
    if (this.data.stage !== 'playing') return;
    const that = this;
    wx.showModal({
      title: '认输',
      content: '确定结束这一局吗？',
      confirmText: '认输',
      success: function (r) {
        if (!r.confirm) return;
        if (that.data.mode === 'online') that.sendEvent('resign');
        that.finish(that.data.myColor === BLACK ? WHITE : BLACK);
      }
    });
  },

  onRemoteResign: function (p) {
    if (this.data.stage !== 'playing' || this.data.mode !== 'online') return;
    this.finish(this.data.myColor);
  },

  onRemoteSyncReq: function () {
    if (this.data.stage !== 'playing' || this.data.mode !== 'online') return;
    this.sendEvent('state', {
      starter_id: this._starterId,
      moves: this._moves,
      current: this.data.current,
      winner: this.data.winner
    });
  },

  onRemoteState: function (p) {
    if (!p || !p.moves || this.data.mode !== 'online') return;
    this._gameId = p.game_id || this._gameId;
    this._starterId = Number(p.starter_id) || this._starterId;
    this._moves = p.moves || [];
    this._board = gomoku.rebuild(this._moves);
    const last = this._moves[this._moves.length - 1] || null;
    this._lastMove = last;
    this._winLine = null;
    let winner = Number(p.winner) || 0;
    if (!winner && last) {
      const line = gomoku.checkWin(this._board, last.x, last.y, last.c);
      if (line) { winner = last.c; this._winLine = line; }
    }
    const myColor = this._starterId === this.data.myId ? BLACK : WHITE;
    this.setData({
      stage: winner ? 'result' : 'playing',
      myColor: myColor,
      current: Number(p.current) || BLACK,
      myTurn: !winner && (Number(p.current) || BLACK) === myColor,
      winner: winner,
      showResult: !!winner,
      movesCount: this._moves.length,
      resultTitle: winner ? (winner === myColor ? '你赢了' : 'TA 赢了') : '',
      turnText: winner ? (winner === myColor ? '你赢了' : 'TA 赢了') : '状态已同步'
    });
    this.draw();
  },

  again: function () {
    this.setData({ stage: 'lobby', showResult: false, winner: 0, winLine: null });
    this.startGame();
  },

  goLobby: function () {
    if (this.data.stage === 'playing' && this.data.mode === 'online') this.sendEvent('leave');
    this.resetGameBoard();
    this.setData({ stage: 'lobby', showResult: false, winner: 0, winLine: null, turnText: '等待开局' });
    this.draw();
  },

  // ===== 对局聊天（和悄悄话共用消息流） =====
  loadChat: function () {
    if (!this.data.partnerId) return;
    const that = this;
    api.recentMessages(40).then(function (r) {
      that.setChatList((r && r.messages) || []);
    }).catch(function () {});
  },

  mapChat: function (d) {
    const mine = d.user_id === this.data.myId;
    const recalled = !!d.recalled;
    return {
      id: d.id,
      mine: mine,
      recalled: recalled,
      content: recalled ? '消息已撤回' : (d.content || ''),
      timeText: chatTime(d.created_at),
      initial: mine ? (this.data.myName || '我').slice(0, 1) : (this.data.partnerName || 'TA').slice(0, 1)
    };
  },

  setChatList: function (list) {
    const map = {};
    (list || []).forEach(function (d) { if (d && d.id) map[d.id] = d; });
    this._chatMap = map;
    this._chatOrder = Object.keys(map).map(Number).sort(function (a, b) { return a - b; });
    const rows = this._chatOrder.map((id) => this.mapChat(map[id]));
    const last = rows.length ? rows[rows.length - 1] : null;
    this.setData({
      chatMessages: rows,
      lastChat: last ? last.content : '和 TA 说点什么…',
      chatScroll: rows.length ? 'gm-chat-' + rows[rows.length - 1].id : ''
    });
  },

  appendChat: function (d) {
    if (!d || !d.id) return;
    if (d.id && this._chatMap[d.id]) {
      this._chatMap[d.id] = Object.assign({}, this._chatMap[d.id], d);
    } else {
      this._chatMap[d.id] = d;
      if (this._chatOrder.indexOf(Number(d.id)) < 0) this._chatOrder.push(Number(d.id));
    }
    this._chatOrder.sort(function (a, b) { return a - b; });
    const rows = this._chatOrder.map((id) => this.mapChat(this._chatMap[id]));
    const fromMe = d.user_id === this.data.myId;
    const unread = !fromMe && !this.data.chatOpen ? (this.data.chatUnread || 0) + 1 : (this.data.chatOpen ? 0 : this.data.chatUnread || 0);
    this.setData({
      chatMessages: rows,
      lastChat: d.recalled ? '消息已撤回' : (d.content || this.data.lastChat),
      chatUnread: unread,
      chatScroll: this.data.chatOpen && rows.length ? 'gm-chat-' + rows[rows.length - 1].id : this.data.chatScroll
    });
  },

  toggleChat: function () {
    if (this.data.mode !== 'online') return;
    const open = !this.data.chatOpen;
    this.setData({ chatOpen: open, chatUnread: open ? 0 : this.data.chatUnread });
    if (open) {
      if (!this._chatOrder.length) this.loadChat();
      const lastId = this._chatOrder.length ? this._chatOrder[this._chatOrder.length - 1] : 0;
      if (lastId) { try { api.markRead(lastId); } catch (e) {} }
      const that = this;
      setTimeout(function () {
        that.setData({ chatScroll: lastId ? 'gm-chat-' + lastId : '' });
      }, 80);
    }
  },

  closeChat: function () {
    this.setData({ chatOpen: false });
  },

  onChatInput: function (e) {
    this.setData({ chatInput: e.detail.value });
  },

  sendChat: function () {
    const text = String(this.data.chatInput || '').trim();
    if (!text || this.data.chatSending) return;
    if (this.data.mode !== 'online') {
      wx.showToast({ title: '本地/人机对局没有在线聊天', icon: 'none' });
      return;
    }
    const that = this;
    this.setData({ chatSending: true });
    api.sendMessage(text, null, 'gm_' + Date.now()).then(function (r) {
      if (r && r.message) that.appendChat(r.message);
      that.setData({ chatInput: '', chatSending: false });
    }).catch(function (err) {
      that.setData({ chatSending: false });
      wx.showToast({ title: (err && (err.msg || err.message)) || '发送失败', icon: 'none' });
    });
  },

  onChatConfirm: function () { this.sendChat(); },

  // ===== 画布 =====
  initCanvas: function () {
    const that = this;
    let tries = 0;
    const run = function () {
      tries += 1;
      const q = wx.createSelectorQuery().in(that);
      q.select('#gomokuBoard').fields({ node: true, size: true });
      q.select('#gomokuBoard').boundingClientRect();
      q.exec(function (res) {
        const info = res && res[0];
        const rect = res && res[1];
        if (!info || !info.node) {
          if (tries < 12) setTimeout(run, 160);
          return;
        }
        const canvas = info.node;
        let dpr = 2;
        try {
          const w = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
          dpr = Math.min(Number(w.pixelRatio) || 2, 2);
        } catch (e) {}
        const W = that.data.boardW;
        const H = that.data.boardH;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        that._canvas = canvas;
        that._ctx = ctx;
        that._rect = rect || null;
        that._padding = W * 0.064;
        that._cell = (W - 2 * that._padding) / (SIZE - 1);
        that._radius = that._cell * 0.42;
        that.setData({ boardReady: true });
        that.draw();
      });
    };
    setTimeout(run, 80);
  },

  draw: function () {
    const ctx = this._ctx;
    if (!ctx) return;
    const W = this.data.boardW;
    const H = this.data.boardH;
    const p = this._padding;
    const cell = this._cell;
    const r = this._radius;
    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#e7cda1');
    bg.addColorStop(0.46, '#d2ab72');
    bg.addColorStop(1, '#b9874e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = '#6b4524';
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
      const y = (i * 37) % H;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(W * 0.3, y + 7, W * 0.65, y - 6, W, y + 2);
      ctx.stroke();
    }
    ctx.restore();

    const inset = p + cell * 0.5;
    ctx.strokeStyle = 'rgba(83, 48, 24, 0.42)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(inset - cell * 0.42, inset - cell * 0.42, W - 2 * inset + cell * 0.84, H - 2 * inset + cell * 0.84);

    ctx.strokeStyle = 'rgba(65, 39, 20, 0.78)';
    ctx.lineWidth = 1;
    for (let i = 0; i < SIZE; i++) {
      const xy = p + i * cell;
      ctx.beginPath(); ctx.moveTo(p, xy); ctx.lineTo(W - p, xy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xy, p); ctx.lineTo(xy, H - p); ctx.stroke();
    }

    const stars = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    stars.forEach(function (s) {
      ctx.beginPath();
      ctx.arc(p + s[0] * cell, p + s[1] * cell, Math.max(2, cell * 0.075), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60, 35, 16, 0.8)';
      ctx.fill();
    });

    ctx.font = Math.max(8, cell * 0.24) + 'px "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(78, 45, 20, 0.66)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < SIZE; i++) {
      ctx.fillText(String.fromCharCode(65 + i), p + i * cell, p * 0.42);
      ctx.fillText(String(i + 1), p * 0.42, p + i * cell);
    }

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const v = this._board[row][col];
        if (!v) continue;
        this.drawStone(p + col * cell, p + row * cell, v, r);
      }
    }

    if (this._lastMove) {
      const lx = p + this._lastMove.y * cell;
      const ly = p + this._lastMove.x * cell;
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, r * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 214, 110, 0.96)';
      ctx.lineWidth = Math.max(1.4, cell * 0.055);
      ctx.shadowColor = 'rgba(255, 198, 74, 0.9)';
      ctx.shadowBlur = 9;
      ctx.stroke();
      ctx.restore();
    }

    if (this._winLine && this._winLine.length) {
      const a = this._winLine[0];
      const b = this._winLine[this._winLine.length - 1];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p + a[1] * cell, p + a[0] * cell);
      ctx.lineTo(p + b[1] * cell, p + b[0] * cell);
      ctx.strokeStyle = 'rgba(255, 209, 104, 0.9)';
      ctx.lineWidth = Math.max(2, cell * 0.08);
      ctx.shadowColor = '#ffc84a';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();
    }
  },

  drawStone: function (x, y, color, radius) {
    const ctx = this._ctx;
    if (!ctx) return;
    const rr = radius;
    ctx.save();
    ctx.shadowColor = 'rgba(32, 18, 8, 0.45)';
    ctx.shadowBlur = rr * 0.55;
    ctx.shadowOffsetX = rr * 0.18;
    ctx.shadowOffsetY = rr * 0.38;
    ctx.beginPath();
    ctx.arc(x, y + rr * 0.10, rr, 0, Math.PI * 2);
    const grd = ctx.createRadialGradient(x - rr * 0.35, y - rr * 0.45, rr * 0.05, x, y, rr * 1.15);
    if (color === BLACK) {
      grd.addColorStop(0, '#6f6d68');
      grd.addColorStop(0.22, '#393733');
      grd.addColorStop(0.7, '#191817');
      grd.addColorStop(1, '#070707');
    } else {
      grd.addColorStop(0, '#fffdf4');
      grd.addColorStop(0.5, '#f1e5d2');
      grd.addColorStop(1, '#c8b49a');
    }
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, rr * 0.86, Math.PI * 1.12, Math.PI * 1.86);
    ctx.strokeStyle = color === BLACK ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.75)';
    ctx.lineWidth = Math.max(1, rr * 0.11);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.strokeStyle = color === BLACK ? 'rgba(0,0,0,0.6)' : 'rgba(120,96,68,0.55)';
    ctx.lineWidth = Math.max(1, rr * 0.09);
    ctx.stroke();
  },

  onShareAppMessage: function () {
    return { title: '小火苗 · 五子棋对弈', path: '/packageCouple/pages/gomoku/gomoku' };
  },

  onShareTimeline: function () {
    return { title: '小火苗 · 五子棋对弈' };
  }
});
