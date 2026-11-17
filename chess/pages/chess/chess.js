const app = getApp();
import { CONFIG } from '../../utils/config.js';

// =========================================================================
// 👇 1. 绝对优先执行：环境大补丁 (必须在 require LiveKit 之前)
// =========================================================================
const root = (typeof globalThis !== 'undefined') ? globalThis : 
             (typeof window !== 'undefined') ? window : 
             (typeof global !== 'undefined') ? global : {};

// 伪造 navigator 对象
const mockNavigator = {
  product: 'ReactNative', 
  userAgent: 'WeChatMiniProgram',
  platform: 'WeChat',
  appName: 'WeChat'
};

// 将补丁注入到所有可能的全局根节点
root.navigator = mockNavigator;
root.window = root; 
root.window.navigator = mockNavigator;
if (typeof global !== 'undefined') {
  global.navigator = mockNavigator;
  global.window = root;
}
// =========================================================================

// 2. 基础 Polyfills (URL, AbortController 等)
class URL {
  constructor(url) {
    const regex = /^([a-z]+):\/\/([^\/:]+)(?::(\d+))?(\/.*)?$/i;
    const match = url.match(regex);
    if (!match) throw new Error('Invalid URL: ' + url);
    this.protocol = match[1] + ':';
    this.hostname = match[2];
    this.port = match[3] || '';
    this.pathname = match[4] || '/';
    this.host = this.hostname + (this.port ? ':' + this.port : '');
  }
}
root.URL = URL;

class URLSearchParams {
  constructor() { this.params = {}; }
  append(key, value) { this.params[key] = value; }
  toString() { return Object.entries(this.params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&'); }
}
root.URLSearchParams = URLSearchParams;

class AbortSignal {
  constructor() { this.aborted = false; this._listeners = []; }
  addEventListener(type, listener) { if (type === 'abort') this._listeners.push(listener); }
  removeEventListener(type, listener) { if (type === 'abort') this._listeners = this._listeners.filter(l => l !== listener); }
  _abort() { if (this.aborted) return; this.aborted = true; this._listeners.forEach(listener => listener()); }
}
class AbortController {
  constructor() { this.signal = new AbortSignal(); }
  abort() { this.signal._abort(); }
}
root.AbortController = AbortController;
root.AbortSignal = AbortSignal;

// =========================================================================
// 👇 3. 最后才引入 SDK (确保上面的所有补丁都已经生效)
// =========================================================================
const LiveKit = require('../../utils/livekit.min.js'); 
// =========================================================================

// === 工具函数：坐标转换 & FEN 生成 ===
// 数组坐标 [row, col] <=> 代数坐标 "a1"-"i10"
function posToAlgebraic(row, col) {
  return String.fromCharCode(97 + col) + (10 - row);
}
function algebraicToPos(str) {
  const col = str.charCodeAt(0) - 97;
  const row = 10 - parseInt(str.slice(1));
  return [row, col];
}
// 将 chessBoard 数组转为 FEN 字符串
function boardToFEN(chessBoard, currentPlayer) {
  const pieceMap = { 'K':'K','A':'A','B':'B','N':'N','R':'R','C':'C','P':'P',
                     'k':'k','a':'a','b':'b','n':'n','r':'r','c':'c','p':'p' };
  let fen = '';
  for (let r = 0; r < 10; r++) {
    let empty = 0;
    for (let c = 0; c < 9; c++) {
      const p = chessBoard[r][c];
      if (p) { if (empty > 0) { fen += empty; empty = 0; } fen += pieceMap[p] || ''; }
      else empty++;
    }
    if (empty > 0) fen += empty;
    if (r < 9) fen += '/';
  }
  fen += currentPlayer === 1 ? ' w' : ' b';
  fen += ' - - 0 1';
  return fen;
}

// 内置 Base64 默认头像（彻底解决 /assets/default-avatar.png 500 报错）
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2I1YjViNSI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00czEuNzktNCA0LTR0NCAxLjc5IDQgNHMtMS43OSA0LTQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';

Page({
  data: {
    // 基础布局
    canvasWidth: 320, canvasHeight: 360,

    // 游戏状态: local(本地双人), ai(人机单挑), online(联机)
    mode: 'local',
    modeName: '本地双人',
    currentPlayer: 1,
    gameOver: false,
    turnText: '红方走棋',

    // 联机相关 (仅 mode === 'online' 时生效)
    isOnline: false,
    myRole: 1,
    opponentConnected: false,
    redAvatar: '', redNickname: '红方', redId: '',
    blackAvatar: '', blackNickname: '黑方', blackId: '',
    chatMessages:[],
    inputText: '',
    enableVoice: false,

    // 用户信息 (从登录页传过来)
    userInfo: {
      avatar: DEFAULT_AVATAR,
      nickname: '未知玩家'
    },

    voiceStatus: {
        connected: false,
        muted: false,
        speaking: { red: false, black: false }
    }
  },

  // 非 data 成员变量 (不触发视图更新，优化性能)
  chessBoard:[], selectedChessPos: null, lastChessMove: null,
  padding: 0, colStep: 0, rowStep: 0, radius: 0,
  ctx: null, canvas: null,
  anim: { active: false, piece: null, from: null, to: null, progress: 0, startTime: 0, duration: 350, onComplete: null },
  _lastSentMove: null, // 联机模式：记录最近发送的步，用于跳过服务器回显

  onLoad(options) {
    // 1. 获取登录的用户信息 (优先取全局，次之取缓存，最后用默认)
    const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
    if (profile && profile.avatar) {
      this.setData({
        userInfo: {
          avatar: profile.avatar,
          nickname: profile.nickname || '玩家'
        }
      });
    }

    // 2. 处理进入模式
    const mode = options.mode || 'local';
    this.switchModeState(mode, options);

    // 3. 棋盘尺寸计算
    const sysInfo = wx.getSystemInfoSync();
    const boardWidth = sysInfo.windowWidth * 0.92;
    const padding = boardWidth * 0.05;
    const colStep = (boardWidth - 2 * padding) / 8;
    const rowStep = colStep;
    const boardHeight = 2 * padding + 9 * rowStep;

    this.setData({ canvasWidth: boardWidth, canvasHeight: boardHeight });
    this.padding = padding; this.colStep = colStep; this.rowStep = rowStep; this.radius = colStep * 0.44;
  },

  onReady() {
    this.initGame();
    this.initCanvas();
    if (this.data.isOnline && this.data.enableVoice) {
      this.initVoiceChat();
    }
  },

  // --- 模式切换控制器 ---
  switchModeState(mode, options = {}) {
    let modeName = '本地双人';
    let isOnline = false;

    if (mode === 'ai') modeName = '人机对战';
    else if (mode === 'online') {
      modeName = '网络联机';
      isOnline = true;

      const myRole = parseInt(options.role) || 1;
      // 从 lobby 传过来的对手信息
      const opp = app.globalData.onlineOpponent || {};

      if (myRole === 1) {
        this.setData({
          myRole: 1,
          opponentConnected: true,
          blackNickname: opp.nickname || '黑方',
          blackAvatar: opp.avatar || DEFAULT_AVATAR,
          blackId: opp.id || ''
        });
      } else {
        this.setData({
          myRole: 2,
          opponentConnected: true,
          redNickname: opp.nickname || '红方',
          redAvatar: opp.avatar || DEFAULT_AVATAR,
          redId: opp.id || ''
        });
      }

      const enableVoice = options.voice === 'true';
      this.setData({ enableVoice });
      this.bindSocketListeners();
    }

    this.setData({ mode, modeName, isOnline });
  },

  // 按钮事件：开始本地双人
  startLocalMode() {
    wx.showToast({ title: '已切换为本地双人', icon: 'none' });
    this.switchModeState('local');
    this.initGame();
    this.drawBoard();
  },

  // 按钮事件：开始人机对战
  startAIMode() {
    wx.showToast({ title: '已切换为人机对战', icon: 'none' });
    this.switchModeState('ai');
    this.initGame();
    this.drawBoard();
  },

  // 按钮事件：跳转联机大厅
  goToLobby() {
    wx.navigateTo({ url: '/chess/pages/lobby/lobby' });
  },

  // --- 游戏核心逻辑 ---
  initGame() {
    this.chessBoard = [
  ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
  [null, null, null, null, null, null, null, null, null],
  [null, 'c', null, null, null, null, null, 'c', null],
  ['p', null, 'p', null, 'p', null, 'p', null, 'p'],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  ['P', null, 'P', null, 'P', null, 'P', null, 'P'],
  // 只修改这一行：把炮从第2、6列移到第1、7列
  [null, 'C', null, null, null, null, null, 'C', null],
  [null, null, null, null, null, null, null, null, null],
  ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R']
];
    this.selectedChessPos = null;
    this.lastChessMove = null;
    this.setData({ currentPlayer: 1, gameOver: false, turnText: '红方走棋' });
  },

  handleCanvasTap(e) {
    if (this.data.gameOver || this.anim.active) return;

    if (this.data.isOnline && this.data.currentPlayer !== this.data.myRole) {
      wx.showToast({ title: '等待对方走棋...', icon: 'none' });
      return;
    }
    if (this.data.mode === 'ai' && this.data.currentPlayer === 2) {
      return; // AI模式下，玩家不能操作黑方
    }

    const x = e.changedTouches[0].x;
    const y = e.changedTouches[0].y;
    const col = Math.round((x - this.padding) / this.colStep);
    const row = Math.round((y - this.padding) / this.rowStep);
    if (col < 0 || col > 8 || row < 0 || row > 9) return;

    const { currentPlayer } = this.data;

    if (this.selectedChessPos) {
      const[r1, c1] = this.selectedChessPos;
      if (r1 === row && c1 === col) { this.selectedChessPos = null; this.drawBoard(); return; }

      const targetPiece = this.chessBoard[row][col];
      if (targetPiece && ((currentPlayer === 1 && targetPiece === targetPiece.toUpperCase()) || (currentPlayer === 2 && targetPiece === targetPiece.toLowerCase()))) {
        this.selectedChessPos = [row, col]; this.drawBoard(); return;
      }

      if (!this.isValidChessMove(this.chessBoard, r1, c1, row, col, this.chessBoard[r1][c1])) return;
      if (!this.isMoveSafe(r1, c1, row, col, this.chessBoard[r1][c1])) {
        wx.showToast({ title: '不能送将', icon: 'none' }); return;
      }

      if (this.data.isOnline) {
        // 必须在走棋前生成 FEN（executeMove 会修改棋盘）
        const fen = boardToFEN(this.chessBoard, this.data.currentPlayer);
        const roomId = app.globalData.onlineRoomId || '';
        this._lastSentMove = { from:[r1, c1], to: [row, col] };
        this.executeMove(r1, c1, row, col);
        // 发送代数坐标 + FEN
        const movePayload = {
          from: posToAlgebraic(r1, c1),
          to: posToAlgebraic(row, col),
          fen: fen,
          roomId: roomId
        };
        console.log('[Chess] 发送move:', JSON.stringify(movePayload));
        this.sendSocketMessage('move', movePayload);
      } else {
        this.executeMove(r1, c1, row, col);
      }
    } else {
      const piece = this.chessBoard[row][col];
      if (piece && ((currentPlayer === 1 && piece === piece.toUpperCase()) || (currentPlayer === 2 && piece === piece.toLowerCase()))) {
        this.selectedChessPos = [row, col]; this.drawBoard();
      }
    }
  },

  executeMove(r1, c1, r2, c2) {
    const piece = this.chessBoard[r1][c1];
    this.chessBoard[r1][c1] = null;
    this.selectedChessPos = null;
    this.lastChessMove = { from: [r1, c1], to:[r2, c2] };

    wx.vibrateShort({ type: 'light' });

    this.startAnimation([r1, c1], [r2, c2], piece, () => {
      const captured = this.chessBoard[r2][c2];
      this.chessBoard[r2][c2] = piece;

      // 1. 保底的直接吃将判断 (以防万一)
      if (captured && captured.toLowerCase() === 'k') {
        const winnerText = piece === piece.toUpperCase() ? '红方获胜！' : '黑方获胜！';
        this.setData({ gameOver: true, turnText: winnerText });
        wx.showModal({ title: '对局结束', content: winnerText, showCancel: false });
        this.drawBoard();
        return;
      }

      // 2. 回合状态维护
      let currentActivePlayer = this.data.currentPlayer;
      if (!this.data.isOnline) {
        // 本地模式手动切换，联机模式由后端的 turn_update 控制(此时已经到达前端)
        currentActivePlayer = this.data.currentPlayer === 1 ? 2 : 1;
        this.setData({
          currentPlayer: currentActivePlayer,
          turnText: currentActivePlayer === 1 ? '红方走棋' : '黑方走棋'
        });
      }

      // 3. ✨ 核心修改：真正的【绝杀】判定 ✨
      // 判断轮到的这个玩家，是否已经无路可走
      if (!this.hasLegalMoves(currentActivePlayer)) {
        this.setData({ gameOver: true });
        // 如果当前玩家无路可走，说明另一方赢了
        const winnerText = currentActivePlayer === 1 ? '黑方获胜！' : '红方获胜！';
        const isCheck = this.isKingInCheck(this.chessBoard, currentActivePlayer);

        wx.showModal({
          title: isCheck ? '绝杀！' : '困毙！',
          content: winnerText,
          showCancel: false,
          confirmText: '确定'
        });
        this.drawBoard();
        return; // 游戏结束，直接返回
      }

      // 4. 如果是本地AI模式，触发AI走棋
      if (!this.data.isOnline && this.data.mode === 'ai' && currentActivePlayer === 2) {
        setTimeout(() => this.doAIMove(), 600);
      }

      this.drawBoard();
    });
  },

  // --- 简易 AI 逻辑 ---
  doAIMove() {
    if (this.data.gameOver) return;
    let allMoves = []; let captureMoves =[];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const piece = this.chessBoard[r][c];
        if (piece && piece === piece.toLowerCase()) {
          for (let tr = 0; tr < 10; tr++) {
            for (let tc = 0; tc < 9; tc++) {
              if (this.isValidChessMove(this.chessBoard, r, c, tr, tc, piece)) {
                if (this.isMoveSafe(r, c, tr, tc, piece)) {
                  const move = { from:[r, c], to: [tr, tc] };
                  if (this.chessBoard[tr][tc]) captureMoves.push(move);
                  else allMoves.push(move);
                }
              }
            }
          }
        }
      }
    }
    const finalMove = captureMoves.length > 0
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : allMoves[Math.floor(Math.random() * allMoves.length)];

    if (finalMove) this.executeMove(finalMove.from[0], finalMove.from[1], finalMove.to[0], finalMove.to[1]);
  },

  // --- Canvas 绘制相关 (保留你的原核心代码) ---
  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#boardCanvas').fields({ node: true, size: true }).exec((res) => {
      if(!res[0]) return;
      const canvas = res[0].node;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      this.ctx.scale(dpr, dpr);
      this.drawBoard();
    });
  },

  drawBoard() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    this.drawLines(ctx);
    this.drawLastMoveIndicator(ctx);
    this.drawPieces(ctx);
    if (this.selectedChessPos) this.drawSelectedGlow(ctx, this.selectedChessPos);
    this.drawAnimatingPiece(ctx);
  },

  drawLines(ctx) {
    const { canvasWidth, canvasHeight } = this.data;
    const { padding, colStep, rowStep } = this;
    ctx.strokeStyle = 'rgba(60, 46, 30, 0.8)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(padding, padding + i * rowStep); ctx.lineTo(canvasWidth - padding, padding + i * rowStep); ctx.stroke(); }
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(padding + i * colStep, padding); ctx.lineTo(padding + i * colStep, padding + 4 * rowStep); ctx.stroke(); ctx.beginPath(); ctx.moveTo(padding + i * colStep, padding + 5 * rowStep); ctx.lineTo(padding + i * colStep, canvasHeight - padding); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(padding + 3 * colStep, padding); ctx.lineTo(padding + 5 * colStep, padding + 2 * rowStep); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding + 5 * colStep, padding); ctx.lineTo(padding + 3 * colStep, padding + 2 * rowStep); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding + 3 * colStep, canvasHeight - padding); ctx.lineTo(padding + 5 * colStep, canvasHeight - padding - 2 * rowStep); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding + 5 * colStep, canvasHeight - padding); ctx.lineTo(padding + 3 * colStep, canvasHeight - padding - 2 * rowStep); ctx.stroke();
    ctx.font = `bold ${rowStep * 0.5}px "KaiTi", serif`; ctx.fillStyle = 'rgba(60, 46, 30, 0.85)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('楚 河', padding + 2 * colStep, padding + 4.5 * rowStep); ctx.fillText('汉 界', padding + 6 * colStep, padding + 4.5 * rowStep);
  },

  drawPieces(ctx) {
    for (let r = 0; r < 10; r++) for (let c = 0; c < 9; c++) {
      const piece = this.chessBoard[r][c];
      if (piece) this.drawSinglePiece(ctx, this.padding + c * this.colStep, this.padding + r * this.rowStep, this.radius, piece);
    }
  },

  drawSinglePiece(ctx, x, y, radius, piece) {
    const isRed = piece === piece.toUpperCase();
    const charMap = { 'k': '将', 'a': '士', 'b': '象', 'n': '马', 'r': '车', 'c': '炮', 'p': '卒', 'K': '帅', 'A': '仕', 'B': '相', 'N': '馬', 'R': '車', 'C': '砲', 'P': '兵' };
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.arc(x, y + radius * 0.15, radius, 0, 2 * Math.PI);
    const sideGrd = ctx.createLinearGradient(x, y - radius, x, y + radius * 1.15);
    if (isRed) { sideGrd.addColorStop(0, '#8b5a2b'); sideGrd.addColorStop(1, '#5c3a21'); } else { sideGrd.addColorStop(0, '#4a4036'); sideGrd.addColorStop(1, '#2c251f'); }
    ctx.fillStyle = sideGrd; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.arc(x, y, radius, 0, 2 * Math.PI);
    const topGrd = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
    if (isRed) { topGrd.addColorStop(0, '#fce4c5'); topGrd.addColorStop(0.6, '#e0a060'); topGrd.addColorStop(1, '#a66b38'); } else { topGrd.addColorStop(0, '#e5d7c8'); topGrd.addColorStop(0.6, '#9c8c7c'); topGrd.addColorStop(1, '#5c5248'); }
    ctx.fillStyle = topGrd; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, radius * 0.88, Math.PI * 1.15, Math.PI * 1.85); ctx.lineWidth = radius * 0.15; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, radius * 0.75, 0, 2 * Math.PI); ctx.lineWidth = 1.5; ctx.strokeStyle = isRed ? 'rgba(139,0,0,0.5)' : 'rgba(0,0,0,0.6)'; ctx.stroke();
    ctx.font = `bold ${radius * 1.05}px "KaiTi", serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const text = charMap[piece];
    ctx.fillStyle = isRed ? 'rgba(60, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.9)'; ctx.fillText(text, x, y - 1);
    ctx.fillStyle = isRed ? 'rgba(255, 200, 200, 0.5)' : 'rgba(255, 255, 255, 0.25)'; ctx.fillText(text, x, y + 1);
    ctx.fillStyle = isRed ? '#b22222' : '#222222'; ctx.fillText(text, x, y);
  },

  drawSelectedGlow(ctx, pos) {
    const x = this.padding + pos[1] * this.colStep; const y = this.padding + pos[0] * this.rowStep;
    ctx.beginPath(); ctx.arc(x, y, this.colStep * 0.48, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; ctx.lineWidth = 3; ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowColor = 'transparent';
  },

  drawLastMoveIndicator(ctx) {
    if (!this.lastChessMove) return;
    ctx.save();
    const { from, to } = this.lastChessMove;
    const r = this.colStep * 0.46;
    const fromX = this.padding + from[1] * this.colStep; const fromY = this.padding + from[0] * this.rowStep;
    ctx.setLineDash([5, 5]); ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)'; ctx.beginPath(); ctx.arc(fromX, fromY, r, 0, 2 * Math.PI); ctx.stroke();
    const toX = this.padding + to[1] * this.colStep; const toY = this.padding + to[0] * this.rowStep;
    ctx.setLineDash([]); ctx.strokeStyle = 'rgba(63, 185, 80, 0.8)'; ctx.beginPath(); ctx.arc(toX, toY, r, 0, 2 * Math.PI);
    if (!this.anim.active) { ctx.shadowColor = 'rgba(63, 185, 80, 0.5)'; ctx.shadowBlur = 10; ctx.stroke(); } else { ctx.stroke(); }
    ctx.restore();
  },

  startAnimation(from, to, piece, onComplete) {
    if (this.anim.active && this.anim.onComplete) this.anim.onComplete();
    this.anim = { active: true, piece, from, to, progress: 0, startTime: Date.now(), duration: 350, onComplete };
    const loop = () => {
      if (!this.anim.active) return;
      this.anim.progress = Math.min((Date.now() - this.anim.startTime) / this.anim.duration, 1);
      this.drawBoard();
      if (this.anim.progress < 1) this.canvas.requestAnimationFrame(loop);
      else {
        this.anim.active = false;
        if (this.anim.onComplete) {
          const cb = this.anim.onComplete; this.anim.onComplete = null; cb();
        }
      }
    };
    this.canvas.requestAnimationFrame(loop);
  },

  drawAnimatingPiece(ctx) {
    if (!this.anim.active || !this.anim.piece) return;
    const startX = this.padding + this.anim.from[1] * this.colStep; const startY = this.padding + this.anim.from[0] * this.rowStep;
    const endX = this.padding + this.anim.to[1] * this.colStep; const endY = this.padding + this.anim.to[0] * this.rowStep;
    const p = this.anim.progress;
    const c1 = 1.70158; const c3 = c1 + 1;
    const easeP = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
    const currentX = startX + (endX - startX) * easeP; const currentY = startY + (endY - startY) * easeP;
    const jumpHeight = this.radius * 2.2; const jumpOffset = Math.sin(p * Math.PI) * jumpHeight;
    ctx.save();
    const shadowScale = 1 + (jumpOffset / jumpHeight) * 0.6; const shadowOpacity = Math.max(0.15, 0.65 - (jumpOffset / jumpHeight) * 0.5);
    ctx.beginPath(); ctx.ellipse(currentX, currentY + this.radius * 0.35, this.radius * 0.45 * shadowScale, this.radius * 0.18 * shadowScale, 0, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`; ctx.filter = 'blur(4px)'; ctx.fill(); ctx.restore();
    const rotationAngle = Math.sin(p * Math.PI) * 0.15;
    ctx.save(); ctx.translate(currentX, currentY - jumpOffset); ctx.rotate(rotationAngle);
    this.drawSinglePiece(ctx, 0, 0, this.radius, this.anim.piece);
    ctx.restore();
  },

  isValidChessMove(tempBoard, r1, c1, r2, c2, piece) {
    let target = tempBoard[r2][c2]; let isRed = piece === piece.toUpperCase();
    if (target && ((target === target.toUpperCase()) === isRed)) return false;
    let p = piece.toLowerCase(); let dr = r2 - r1, dc = c2 - c1; let adr = Math.abs(dr), adc = Math.abs(dc);
    if (p === 'k') { if (target && target.toLowerCase() === 'k' && c1 === c2) { let count = 0, minR = Math.min(r1, r2), maxR = Math.max(r1, r2); for (let r = minR + 1; r < maxR; r++) if (tempBoard[r][c1]) count++; if (count === 0) return true; } if (adr + adc !== 1) return false; if (c2 < 3 || c2 > 5) return false; if (isRed && r2 < 7) return false; if (!isRed && r2 > 2) return false; return true; }
    if (p === 'a') { if (adr !== 1 || adc !== 1) return false; if (c2 < 3 || c2 > 5) return false; if (isRed && r2 < 7) return false; if (!isRed && r2 > 2) return false; return true; }
    if (p === 'b') { if (adr !== 2 || adc !== 2) return false; if (isRed && r2 < 5) return false; if (!isRed && r2 > 4) return false; if (tempBoard[r1 + dr/2][c1 + dc/2]) return false; return true; }
    if (p === 'n') { if (!((adr === 2 && adc === 1) || (adr === 1 && adc === 2))) return false; if (adr === 2 && tempBoard[r1 + dr/2][c1]) return false; if (adc === 2 && tempBoard[r1][c1 + dc/2]) return false; return true; }
    if (p === 'r') { if (r1 !== r2 && c1 !== c2) return false; let stepR = r1 === r2 ? 0 : dr / adr; let stepC = c1 === c2 ? 0 : dc / adc; for (let i = 1; i < Math.max(adr, adc); i++) { if (tempBoard[r1 + i*stepR][c1 + i*stepC]) return false; } return true; }
    if (p === 'c') { if (r1 !== r2 && c1 !== c2) return false; let stepR = r1 === r2 ? 0 : dr / adr; let stepC = c1 === c2 ? 0 : dc / adc; let count = 0; for (let i = 1; i < Math.max(adr, adc); i++) { if (tempBoard[r1 + i*stepR][c1 + i*stepC]) count++; } if (target) { if (count !== 1) return false; } else { if (count !== 0) return false; } return true; }
    if (p === 'p') { if (isRed) { if (dr > 0) return false; if (r1 >= 5) return (dr === -1 && dc === 0); else return ((dr === -1 && dc === 0) || (dr === 0 && adc === 1)); } else { if (dr < 0) return false; if (r1 <= 4) return (dr === 1 && dc === 0); else return ((dr === 1 && dc === 0) || (dr === 0 && adc === 1)); } }
    return false;
  },

  isKingInCheck(boardState, player) {
    let isRed = player === 1; let kingChar = isRed ? 'K' : 'k'; let kingPos = null;
    for (let r = 0; r < 10; r++) { for (let c = 0; c < 9; c++) { if (boardState[r][c] === kingChar) { kingPos =[r, c]; break; } } }
    if (!kingPos) return false;
    for (let r = 0; r < 10; r++) { for (let c = 0; c < 9; c++) { let piece = boardState[r][c]; if (piece && (piece === piece.toUpperCase()) !== isRed) { if (this.isValidChessMove(boardState, r, c, kingPos[0], kingPos[1], piece)) return true; } } }
    return false;
  },

  isMoveSafe(r1, c1, r2, c2, piece) {
    let captured = this.chessBoard[r2][c2]; let isRed = piece === piece.toUpperCase();
    this.chessBoard[r2][c2] = piece; this.chessBoard[r1][c1] = null;
    let inCheck = this.isKingInCheck(this.chessBoard, isRed ? 1 : 2);
    this.chessBoard[r1][c1] = piece; this.chessBoard[r2][c2] = captured;
    return !inCheck;
  },

  // ✨ 新增：判断指定玩家是否还有合法的步数（用于绝杀和困毙判定）
  hasLegalMoves(player) {
    const isRed = player === 1;
    for (let r1 = 0; r1 < 10; r1++) {
      for (let c1 = 0; c1 < 9; c1++) {
        const piece = this.chessBoard[r1][c1];
        if (piece && ((piece === piece.toUpperCase()) === isRed)) {
          for (let r2 = 0; r2 < 10; r2++) {
            for (let c2 = 0; c2 < 9; c2++) {
              if (this.isValidChessMove(this.chessBoard, r1, c1, r2, c2, piece)) {
                if (this.isMoveSafe(r1, c1, r2, c2, piece)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  },


  // 联机 Socket 封装
  sendSocketMessage(action, payload = {}) {
    const socket = app.globalData.chessSocket;
    if (!socket) return false;
    const msg = { action, payload };
    // 联机模式下自动附带 roomId
    if (this.data.isOnline && app.globalData.onlineRoomId) {
      msg.roomId = app.globalData.onlineRoomId;
    }
    socket.send({ data: JSON.stringify(msg) });
    return true;
  },

  bindSocketListeners() {
    const socket = app.globalData.chessSocket;
    if (!socket) return;
    socket.onMessage((res) => {
      const data = JSON.parse(res.data);
      switch (data.action) {
        case 'move':
          if (data.payload && data.payload.from && data.payload.to) {
            // 兼容代数坐标("e2")和数组坐标([r,c])两种格式
            let r1, c1, r2, c2;
            if (typeof data.payload.from === 'string') {
              [r1, c1] = algebraicToPos(data.payload.from);
              [r2, c2] = algebraicToPos(data.payload.to);
            } else {
              r1 = data.payload.from[0]; c1 = data.payload.from[1];
              r2 = data.payload.to[0]; c2 = data.payload.to[1];
            }
            console.log('[Chess] 收到move:', data.payload.from, '->', data.payload.to, 'role:', data.role, '坐标:', [r1,c1], '->', [r2,c2]);
            // 跳过自己刚发的步（本地已执行）
            if (this._lastSentMove && r1===this._lastSentMove.from[0] && c1===this._lastSentMove.from[1] && r2===this._lastSentMove.to[0] && c2===this._lastSentMove.to[1]) {
              this._lastSentMove = null;
              console.log('[Chess] 跳过自己的回显');
            } else {
              this.executeMove(r1, c1, r2, c2);
            }
          } else {
            console.warn('[Chess] move消息缺少payload:', data);
          }
          break;

        case 'turn_update':
          console.log('[Chess] turn_update:', data.role, '当前myRole:', this.data.myRole);
          this.setData({
            currentPlayer: Number(data.role),
            turnText: Number(data.role) === 1 ? '红方走棋' : '黑方走棋'
          });
          break;

        case 'chat':
          if (data.payload) {
            const msgId = 'msg-' + this.data.chatMessages.length;
            this.setData({
              chatMessages: [...this.data.chatMessages, {
                id: msgId,
                role: data.payload.role || (data.from === this.data.myRole ? this.data.myRole : (this.data.myRole === 1 ? 2 : 1)),
                nickname: data.payload.nickname || '',
                avatar: data.payload.avatar || DEFAULT_AVATAR,
                text: data.payload.text || ''
              }]
            });
          }
          break;

        case 'opponent_left':
        case 'resign':
          console.warn('[Chess] 收到:', data.action);
          this.setData({ gameOver: true, turnText: '对手已离开' });
          wx.showModal({ title: '游戏结束', content: '对方已离开，你获得了胜利！', showCancel: false });
          break;

        case 'error':
          console.error('[Chess] 服务器错误:', data.payload?.message);
          wx.showToast({ title: data.payload?.message || '非法操作', icon: 'none' });
          break;
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },

  // --- 联机聊天 ---
  onInputChat(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendChat() {
    const text = this.data.inputText.trim();
    if (!text) return;
    const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile') || {};
    this.sendSocketMessage('chat', {
      text,
      avatar: profile.avatar || this.data.userInfo.avatar
    });
    // 本地立即显示自己的消息
    const msgId = 'msg-' + this.data.chatMessages.length;
    this.setData({
      chatMessages: [...this.data.chatMessages, {
        id: msgId,
        role: this.data.myRole,
        avatar: profile.avatar || this.data.userInfo.avatar,
        text
      }],
      inputText: ''
    });
  },

  // === 语音通话系统 (持续连接 + 自动重连) ===

  // async initVoiceChat() {
  //   if (!this.data.isOnline || !this.data.enableVoice) return;
  //   if (this._voiceConnecting) return;
  //   if (this._voiceSocket) {
  //     try { this._voiceSocket.close(); } catch (e) {}
  //     this._voiceSocket = null;
  //   }
  //   this._voiceConnecting = true;
  //   try {
  //     const roomId = app.globalData.onlineRoomId;
  //     const res = await new Promise((resolve, reject) => {
  //       wx.request({
  //         url: `${CONFIG.API_URL}/api/voice/token?room=${roomId}`,
  //         method: 'GET',
  //         success: resolve,
  //         fail: reject
  //       });
  //     });
  //     if (res.statusCode !== 200 || !res.data || !res.data.wsUrl) {
  //       throw new Error('获取语音凭证失败');
  //     }
  //     this._voiceConnecting = false;
  //     this.connectVoiceWebSocket(res.data.wsUrl);
  //   } catch (e) {
  //     this._voiceConnecting = false;
  //     console.error('[Voice] 语音连接失败:', e);
  //     this._scheduleReconnect();
  //   }
  // },

  // === 语音通话系统 (LiveKit直连版，最小改动) ===
async initVoiceChat() {
  if (!this.data.isOnline || !this.data.enableVoice) return;
  if (this._voiceConnecting || this._voiceRoom) return;

  this._voiceConnecting = true;
  try {
    const roomId = app.globalData.onlineRoomId;
    // 调用你已经改好的后端接口
    const res = await new Promise((resolve, reject) => {
      wx.request({
        url: `${CONFIG.API_URL}/api/voice/token?room=${roomId}`,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: resolve,
        fail: reject
      });
    });

    if (res.statusCode !== 200 || !res.data || !res.data.token) {
      throw new Error('获取语音凭证失败');
    }

    // 初始化LiveKit房间
    const room = new LiveKit.Room({
      audioCaptureDefaults: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // 绑定事件（完全对应你原来的状态）
    room.on('connected', () => {
      console.log('[Voice] LiveKit 已连接');
      this._voiceReconnectCount = 0;
      this.setData({ 'voiceStatus.connected': true, 'voiceStatus.muted': false });
    });

    room.on('disconnected', () => {
      console.log('[Voice] LiveKit 已断开');
      this._voiceRoom = null;
      this.setData({
        'voiceStatus.connected': false,
        'voiceStatus.speaking.red': false,
        'voiceStatus.speaking.black': false
      });
      this._scheduleReconnect();
    });

    room.on('participantConnected', (participant) => {
      console.log('[Voice] 对方加入语音:', participant.identity);
    });

    room.on('participantDisconnected', (participant) => {
      console.log('[Voice] 对方离开语音:', participant.identity);
      this.setData({ 'voiceStatus.speaking.black': false, 'voiceStatus.speaking.red': false });
    });

    // 自动订阅对方音频并播放
    room.on('trackSubscribed', (track, publication, participant) => {
      if (track.kind === 'audio') {
        track.play();
        // 监听对方说话状态
        participant.on('isSpeakingChanged', (speaking) => {
          const sKey = this.data.myRole === 1 ? 'voiceStatus.speaking.black' : 'voiceStatus.speaking.red';
          this.setData({ [sKey]: speaking });
        });
      }
    });

    // 连接房间
    await room.connect(res.data.livekitUrl, res.data.token);
    // 自动开启麦克风
    await room.localParticipant.setMicrophoneEnabled(true);

    this._voiceRoom = room;
    this._voiceConnecting = false;

  } catch (e) {
    this._voiceConnecting = false;
    console.error('[Voice] 语音连接失败:', e);
    this._scheduleReconnect();
  }
},



  _scheduleReconnect() {
    if (this._destroyed || !this.data.isOnline || !this.data.enableVoice) return;
    if (this._voiceReconnectTimer) return;
    this._voiceReconnectTimer = setTimeout(() => {
      this._voiceReconnectTimer = null;
      if (!this._destroyed && this.data.isOnline && this.data.enableVoice && !this.data.voiceStatus.connected) {
        console.log('[Voice] 尝试自动重连...');
        this.initVoiceChat();
      }
    }, 3000);
  },

  connectVoiceWebSocket(wsUrl) {
    this._nextPlayTime = 0;

    const socket = wx.connectSocket({ url: wsUrl });

    socket.onOpen(() => {
      console.log('[Voice] WebSocket 已连接');
      this._voiceReconnectCount = 0;
      const roomId = app.globalData.onlineRoomId;
      const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile') || {};
      socket.send({ data: JSON.stringify({ type: 'join', roomId: roomId, identity: profile.nickname || 'player' }) });
      this.setData({ 'voiceStatus.connected': true, 'voiceStatus.muted': false });
      // 录音在收到后端 joined 确认后再启动，避免音频帧先于 join 消息到达
    });

    socket.onMessage((res) => {
      if (typeof res.data === 'string') {
        try {
          const msg = JSON.parse(res.data);
          switch (msg.type) {
            case 'joined':
              console.log('[Voice] 已加入语音房间, 在线:', msg.participants);
              this.startRecording();
              break;
            case 'participant_joined':
              console.log('[Voice] 对方加入语音:', msg.identity);
              break;
            case 'participant_left':
              console.log('[Voice] 对方离开语音:', msg.identity);
              this.setData({ 'voiceStatus.speaking.black': false, 'voiceStatus.speaking.red': false });
              break;
            case 'speaking':
              if (msg.identity !== (app.globalData.gameProfile || {}).nickname) {
                const sKey = this.data.myRole === 1 ? 'voiceStatus.speaking.black' : 'voiceStatus.speaking.red';
                this.setData({ [sKey]: !!msg.active });
              }
              break;
            case 'error':
              wx.showToast({ title: msg.message || '语音错误', icon: 'none' });
              break;
          }
        } catch (e) { /* 忽略非JSON */ }
      } else {
        this.scheduleAudioPlayback(res.data);
      }
    });

    socket.onClose(() => {
      console.log('[Voice] WebSocket 已断开, 即将自动重连');
      this._voiceSocket = null;
      this.stopRecording();
      this.setData({
        'voiceStatus.connected': false,
        'voiceStatus.speaking.red': false,
        'voiceStatus.speaking.black': false
      });
      this._scheduleReconnect();
    });

    socket.onError((err) => {
      console.error('[Voice] WebSocket 错误:', err);
    });

    this._voiceSocket = socket;
  },

  startRecording() {
    const recorder = wx.getRecorderManager();
    const PCM_SAMPLE_RATE = 16000;
    const FRAME_DURATION = 0.1;
    const FRAME_SIZE = Math.floor(PCM_SAMPLE_RATE * FRAME_DURATION);
    const BYTES_PER_SAMPLE = 2;
    const FRAME_BYTES = FRAME_SIZE * BYTES_PER_SAMPLE;

    recorder.onFrameRecorded((res) => {
      if (!this._voiceSocket || this.data.voiceStatus.muted) return;
      let frameBuffer = null;
      if (res.frameBuffer) {
        frameBuffer = res.frameBuffer;
      } else if (res.base64) {
        frameBuffer = this._base64ToArrayBuffer(res.base64);
      }
      if (!frameBuffer || frameBuffer.byteLength === 0) return;
      if (frameBuffer.byteLength < FRAME_BYTES * 0.5) return;
      try {
        this._voiceSocket.send({ data: frameBuffer });
      } catch (e) {
        console.error('[Voice] 发送音频帧失败:', e);
      }
    });

    recorder.onError((err) => {
      console.error('[Voice] 录音错误:', err);
    });

    recorder.start({
      duration: 600000,
      sampleRate: PCM_SAMPLE_RATE,
      numberOfChannels: 1,
      encodeBitRate: 256000,
      frameSize: 100,
      format: 'pcm'
    });
    this._recorder = recorder;
    console.log('[Voice] 录音已启动');
  },

  stopRecording() {
    if (this._recorder) {
      try { this._recorder.stop(); } catch (e) {}
      this._recorder = null;
    }
  },

  scheduleAudioPlayback(arrayBuffer) {
    const PCM_SAMPLE_RATE = 16000;
    if (!this._audioCtx) {
      this._audioCtx = wx.createWebAudioContext();
      this._nextPlayTime = 0;
    }
    const ctx = this._audioCtx;
    const pcm16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }
    const audioBuffer = ctx.createBuffer(1, float32.length, PCM_SAMPLE_RATE);
    audioBuffer.getChannelData(0).set(float32);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    const now = ctx.currentTime;
    if (this._nextPlayTime < now) {
      this._nextPlayTime = now + 0.05;
    }
    source.start(this._nextPlayTime);
    this._nextPlayTime += audioBuffer.duration;
  },

  
  toggleVoice() {
  if (!this.data.isOnline) {
    wx.showToast({ title: '请先进入联机对局', icon: 'none' });
    return;
  }
  if (!this.data.enableVoice) {
    wx.showToast({ title: '未开启语音功能', icon: 'none' });
    return;
  }
  if (!this._voiceRoom || !this.data.voiceStatus.connected) {
    wx.showToast({ title: '正在重连语音...', icon: 'none' });
    this.initVoiceChat();
    return;
  }

  const newMuted = !this.data.voiceStatus.muted;
  this._voiceRoom.localParticipant.setMicrophoneEnabled(!newMuted);
  this.setData({
    'voiceStatus.muted': newMuted,
    'voiceStatus.speaking.red': false,
    'voiceStatus.speaking.black': false
  });
  wx.showToast({ title: newMuted ? '已关闭麦克风' : '已开启麦克风', icon: 'none' });
},

disconnectVoice() {
  this._destroyed = true;
  if (this._voiceReconnectTimer) {
    clearTimeout(this._voiceReconnectTimer);
    this._voiceReconnectTimer = null;
  }
  if (this._voiceRoom) {
    try { this._voiceRoom.disconnect(); } catch (e) {}
    this._voiceRoom = null;
  }
  this.setData({
    'voiceStatus.connected': false,
    'voiceStatus.muted': false,
    'voiceStatus.speaking.red': false,
    'voiceStatus.speaking.black': false
  });
},

  _base64ToArrayBuffer(base64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(128);
    for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
    const len = base64.length;
    const pad = base64[len - 2] === '=' ? 2 : base64[len - 1] === '=' ? 1 : 0;
    const bytes = ((len * 3) / 4) - pad;
    const buffer = new ArrayBuffer(bytes);
    const view = new Uint8Array(buffer);
    for (let i = 0, j = 0; i < len; i += 4, j += 3) {
      const a = lookup[base64.charCodeAt(i)];
      const b = lookup[base64.charCodeAt(i + 1)];
      const c = lookup[base64.charCodeAt(i + 2)];
      const d = lookup[base64.charCodeAt(i + 3)];
      view[j] = (a << 2) | (b >> 4);
      if (j + 1 < bytes) view[j + 1] = ((b & 15) << 4) | (c >> 2);
      if (j + 2 < bytes) view[j + 2] = ((c & 3) << 6) | d;
    }
    return buffer;
  },

  onUnload() {
    this.disconnectVoice();
  }
});
