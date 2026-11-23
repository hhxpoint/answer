// 五子棋 · 小火苗双人对弈
// 复用 couple-api / couple-ws；只在当前关系空间内的两个人之间实时转发。
const api = require('../../utils/couple-api.js');
const wsClient = require('../../utils/couple-ws.js');
const gomoku = require('../../utils/gomoku.js');

const SIZE = gomoku.SIZE;
const EMPTY = gomoku.EMPTY;
const BLACK = gomoku.BLACK;
const WHITE = gomoku.WHITE;

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
    showResult: false
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

    const sys = wx.getSystemInfoSync();
    const w = Math.floor(sys.windowWidth * 0.86);
    this.setData({ boardW: w, boardH: w });

    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res || !res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
          return;
        }
        if (!res.couple.partner) {
          that.setData({ ready: true, errorText: '先邀请 TA 进入你们的小火苗，才能一起对弈哦' });
          return;
        }
        const user = res.user || {};
        const partner = res.couple.partner || {};
        const myName = user.nickname || '我';
        const pName = partner.nickname || 'TA';
        that.setData({
          ready: true,
          errorText: '',
          myId: user.id || 0,
          myName: myName,
          myInitial: myName.slice(0, 1) || '我',
          myAvatar: api.absUrl(user.avatar),
          partnerId: partner.id || 0,
          partnerName: pName,
          partnerInitial: pName.slice(0, 1) || 'TA',
          partnerAvatar: api.absUrl(partner.avatar)
        });
        that.connect();
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
    if (this.data.myId) this.ensureSocket();
    if (this.data.boardReady) this.draw();
  },

  onHide: function () {
    this._socketAlive = false;
  },

  onUnload: function () {
    if (this._socket) {
      try { this._socket.send({ type: 'gomoku', payload: { action: 'leave' } }); } catch (e) {}
      try { this._socket.close(); } catch (e) {}
      this._socket = null;
    }
    this._socketAlive = false;
    const app = getApp();
    if (app && app.globalData && app.globalData.gomokuPage === this) app.globalData.gomokuPage = null;
  },

  // ===== 连接 =====
  ensureSocket: function () {
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
        if (that.data.stage === 'playing') that.sendEvent('sync_req');
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
    if (data.type !== 'gomoku') return;
    if (data.from === this.data.myId) return;
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
    if (!this._socket) return false;
    return this._socket.send({
      type: 'gomoku',
      payload: Object.assign({ action: action, game_id: this._gameId }, payload || {})
    });
  },

  // ===== 开局 =====
  startGame: function () {
    if (!this.data.partnerOnline) {
      wx.showToast({ title: '等 TA 在线再开始', icon: 'none' });
      return;
    }
    const id = 'g' + Date.now() + '_' + this.data.myId;
    this._gameId = id;
    this._starterId = this.data.myId;
    this._moves = [];
    this._board = gomoku.createBoard();
    this._lastMove = null;
    this._winLine = null;
    this.setData({
      stage: 'playing',
      myColor: BLACK,
      current: BLACK,
      myTurn: true,
      winner: 0,
      winLine: null,
      showResult: false,
      movesCount: 0,
      turnText: '你的回合 · 落黑子',
      moverName: this.data.myName
    });
    this.draw();
    this.sendEvent('start', { starter_id: this.data.myId });
  },

  onRemoteStart: function (p) {
    if (!p.game_id) return;
    const incomingStarter = Number(p.starter_id) || 0;
    // 双方同时点开始：用较小的 starter_id 收敛
    if (this.data.stage === 'playing' && this._starterId && incomingStarter >= this._starterId) return;
    this._gameId = p.game_id;
    this._starterId = incomingStarter;
    this._moves = [];
    this._board = gomoku.createBoard();
    this._lastMove = null;
    this._winLine = null;
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
    if (!this.data.boardReady || this.data.stage !== 'playing' || !this.data.myTurn || !this.data.online) return;
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
    this.place(row, col, this.data.myColor, true);
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
    this.setData({ movesCount: this._moves.length, lastText: row + ',' + col });
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
    const next = color === BLACK ? WHITE : BLACK;
    this.setData({
      current: next,
      myTurn: next === this.data.myColor && this.data.online,
      turnText: (next === this.data.myColor ? '你的回合' : 'TA 的回合') + ' · 落' + (next === BLACK ? '黑子' : '白子'),
      moverName: next === this.data.myColor ? this.data.myName : this.data.partnerName
    });
    return true;
  },

  onRemoteMove: function (p) {
    if (this.data.stage !== 'playing') return;
    if (p.game_id && this._gameId && p.game_id !== this._gameId) return;
    if (Number(p.c) !== this.data.current) return;
    if (!isFinite(p.x) || !isFinite(p.y)) return;
    this.place(Number(p.x), Number(p.y), Number(p.c), false);
  },

  finish: function (winner) {
    const isMe = winner === this.data.myColor;
    const title = winner === 0 ? '和棋' : (isMe ? '你赢了' : 'TA 赢了');
    const sub = winner === 0 ? '棋盘已满，再来一局吧' : (isMe ? '五子连珠，漂亮的一手' : '这一局差一点，再来');
    this.setData({
      stage: 'result',
      winner: winner,
      myTurn: false,
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
        that.sendEvent('resign');
        that.finish(that.data.myColor === BLACK ? WHITE : BLACK);
      }
    });
  },

  onRemoteResign: function (p) {
    if (this.data.stage !== 'playing') return;
    this.finish(this.data.myColor);
  },

  onRemoteSyncReq: function () {
    if (this.data.stage !== 'playing') return;
    this.sendEvent('state', {
      starter_id: this._starterId,
      moves: this._moves,
      current: this.data.current,
      winner: this.data.winner
    });
  },

  onRemoteState: function (p) {
    if (!p || !p.moves) return;
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
    this.setData({
      stage: winner ? 'result' : 'playing',
      myColor: this._starterId === this.data.myId ? BLACK : WHITE,
      current: Number(p.current) || BLACK,
      myTurn: !winner && (Number(p.current) || BLACK) === (this._starterId === this.data.myId ? BLACK : WHITE),
      winner: winner,
      showResult: !!winner,
      movesCount: this._moves.length,
      resultTitle: winner ? (winner === (this._starterId === this.data.myId ? BLACK : WHITE) ? '你赢了' : 'TA 赢了') : '',
      turnText: winner ? (winner === (this._starterId === this.data.myId ? BLACK : WHITE) ? '你赢了' : 'TA 赢了') : '状态已同步'
    });
    this.draw();
  },

  again: function () {
    this.setData({ stage: 'lobby', showResult: false, winner: 0, winLine: null });
    this.startGame();
  },

  goLobby: function () {
    if (this.data.stage === 'playing') this.sendEvent('leave');
    this.setData({ stage: 'lobby', showResult: false, winner: 0, winLine: null });
    this._moves = [];
    this._board = gomoku.createBoard();
    this._lastMove = null;
    this._winLine = null;
    this.draw();
  },

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

    // 木质底
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#e7cda1');
    bg.addColorStop(0.46, '#d2ab72');
    bg.addColorStop(1, '#b9874e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 细木纹
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

    // 内框
    const inset = p + cell * 0.5;
    ctx.strokeStyle = 'rgba(83, 48, 24, 0.42)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(inset - cell * 0.42, inset - cell * 0.42, W - 2 * inset + cell * 0.84, H - 2 * inset + cell * 0.84);

    // 棋盘线
    ctx.strokeStyle = 'rgba(65, 39, 20, 0.78)';
    ctx.lineWidth = 1;
    for (let i = 0; i < SIZE; i++) {
      const xy = p + i * cell;
      ctx.beginPath(); ctx.moveTo(p, xy); ctx.lineTo(W - p, xy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xy, p); ctx.lineTo(xy, H - p); ctx.stroke();
    }

    // 星位
    const stars = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    stars.forEach(function (s) {
      ctx.beginPath();
      ctx.arc(p + s[0] * cell, p + s[1] * cell, Math.max(2, cell * 0.075), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60, 35, 16, 0.8)';
      ctx.fill();
    });

    // 坐标
    ctx.font = Math.max(8, cell * 0.24) + 'px "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(78, 45, 20, 0.66)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < SIZE; i++) {
      ctx.fillText(String.fromCharCode(65 + i), p + i * cell, p * 0.42);
      ctx.fillText(String(i + 1), p * 0.42, p + i * cell);
    }

    // 棋子
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const v = this._board[row][col];
        if (!v) continue;
        this.drawStone(p + col * cell, p + row * cell, v, r);
      }
    }

    // 最后一手
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

    // 连珠线
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

  noop: function () {},

  onShareAppMessage: function () {
    return {
      title: '小火苗 · 五子棋对弈',
      path: '/packageCouple/pages/gomoku/gomoku'
    };
  },

  onShareTimeline: function () {
    return { title: '小火苗 · 五子棋对弈' };
  }
});
