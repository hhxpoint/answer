import { CONFIG } from '../../utils/config.js';
const app = getApp();

// 本地题库
const WORDS = [
  '苹果', '香蕉', '西瓜', '草莓', '葡萄', '猫咪', '小狗', '兔子', '大象', '长颈鹿',
  '太阳', '月亮', '星星', '彩虹', '闪电', '飞机', '汽车', '自行车', '火车', '轮船',
  '钢琴', '吉他', '小提琴', '鼓', '话筒', '眼镜', '帽子', '围巾', '手套', '鞋子',
  '蛋糕', '冰淇淋', '汉堡', '披萨', '面条', '足球', '篮球', '乒乓球', '游泳', '滑雪',
  '电脑', '手机', '电视', '冰箱', '空调', '书本', '铅笔', '剪刀', '钥匙', '雨伞',
  '花朵', '大树', '蘑菇', '仙人掌', '竹子', '蝴蝶', '蜜蜂', '蚂蚁', '蜗牛', '螃蟹',
  '城堡', '桥梁', '火箭', '热气球', '灯笼', '医生', '消防员', '警察', '厨师', '画家',
  '钻石', '珍珠', '皇冠', '戒指', '宝剑', '饺子', '包子', '火锅', '月饼', '汤圆',
  '洗衣机', '吸尘器', '电风扇', '台灯', '沙发', '龙', '凤凰', '独角兽', '美人鱼', '机器人',
];

Page({
  data: {
    // 游戏状态
    gameStarted: false,
    waiting: false,
    statusText: '选择模式开始游戏',
    mode: '',
    round: 0,
    totalRounds: 5,
    timeLeft: 0,
    isDrawer: false,
    currentWord: '',
    hint: '',
    guessText: '',

    // 画板
    colors: ['#000000', '#ff0000', '#0000ff', '#00aa00', '#ff8800', '#8800ff', '#00cccc', '#888888'],
    currentColor: '#000000',
    currentSize: 4,
    isEraser: false,

    // 玩家
    players: [],
    defaultAvatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',

    // 消息
    messages: [],
    scrollToMsg: '',
    msgCounter: 0,

    // 结算
    showResult: false,
    resultRankings: [],
  },

  // --- 内部状态（不触发渲染）---
  _ctx: null,
  _canvas: null,
  _canvasWidth: 0,
  _canvasHeight: 0,
  _isDrawing: false,
  _lastX: 0,
  _lastY: 0,
  _currentStroke: [],
  _strokes: [],
  _timer: null,
  _socket: null,
  _myId: '',
  _guessedPlayers: new Set(),



  onLoad(options) {
    this._guessedPlayers = new Set();
    this._strokes = [];
    const mode = options.mode || 'local';

    this._pendingAction = options.action || '';
    this._pendingRoomId = options.roomId || app.globalData.pictionaryRoomId || '';

    this.setData({ mode, waiting: mode === 'online' });
    this._initCanvas();

    if (mode === 'online') {
      this._connectSocket();
      // 重放 lobby 缓存的消息（game_start, new_round 等）
      const queue = app.globalData.pictionaryMsgQueue;
      if (queue && queue.length > 0) {
        app.globalData.pictionaryMsgQueue = null;
        queue.forEach(msg => this._dispatchMessage(msg));
      }
      // 如果有保存的游戏状态（页面被重建），恢复它
      const saved = app.globalData.pictionaryGameState;
      if (saved && saved.gameStarted) {
        this._restoreGameState(saved);
      }
    }
  },

  _updateDisplayPlayers(playersList) {
    // 【关键防御】：先滤除数组里的旧空位，防止叠加 bug
    const realPlayers = playersList.filter(p => !p.isEmpty);
    const maxPlayers = 8;
    let displayPlayers = [];
    for (let i = 0; i < maxPlayers; i++) {
      if (i < realPlayers.length) {
        displayPlayers.push({ ...realPlayers[i], isEmpty: false });
      } else {
        displayPlayers.push({ isEmpty: true, id: 'empty_' + i });
      }
    }
    this.setData({ players: displayPlayers });
  },




  onReady() {
    // canvas 在 onReady 后才能获取
  },

  onShow() {
    // 从后台切回：如果有保存的游戏状态，恢复显示
    const saved = app.globalData.pictionaryGameState;
    if (saved && saved.gameStarted) {
      this._restoreGameState(saved);
    }

    // 检查 socket 状态，断线则重连
    if (this.data.mode === 'online') {
      if (this._socket && this._socket.readyState === 1) {
        // socket 还活着，确保事件绑定
        this._bindSocketEvents();
      } else if (app.globalData.pictionarySocket && app.globalData.pictionarySocket.readyState === 1) {
        // globalData 里的 socket 还活着
        this._socket = app.globalData.pictionarySocket;
        this._bindSocketEvents();
      } else if (this.data.gameStarted || this.data.waiting) {
        // socket 断了，需要重连
        this._socket = null;
        app.globalData.pictionarySocket = null;
        this._connectSocket();
      }
    }
  },

  onUnload() {
    this._clearTimer();
    // 【关键】不关闭 socket，保留在 globalData 中供后续页面复用
    // 保存当前游戏状态，以便 onShow 恢复
    if (this.data.gameStarted || this.data.showResult) {
      this._saveGameState();
    }
  },

  _saveGameState() {
    const realPlayers = this.data.players.filter(p => !p.isEmpty);
    app.globalData.pictionaryGameState = {
      gameStarted: this.data.gameStarted,
      showResult: this.data.showResult,
      mode: this.data.mode,
      round: this.data.round,
      totalRounds: this.data.totalRounds,
      timeLeft: this.data.timeLeft,
      isDrawer: this.data.isDrawer,
      currentWord: this.data.currentWord,
      hint: this.data.hint,
      players: realPlayers,
      messages: this.data.messages,
      msgCounter: this.data.msgCounter,
      resultRankings: this.data.resultRankings,
    };
  },

  _restoreGameState(saved) {
    this._myId = app.globalData.pictionaryMyId || this._myId;
    this._gameStarted = saved.gameStarted;
    this._updateDisplayPlayers(saved.players || []);

    this.setData({
      gameStarted: saved.gameStarted,
      showResult: saved.showResult || false,
      mode: saved.mode || 'online',
      round: saved.round || 0,
      totalRounds: saved.totalRounds || 5,
      timeLeft: saved.timeLeft || 0,
      isDrawer: saved.isDrawer || false,
      currentWord: saved.currentWord || '',
      hint: saved.hint || '',
      messages: saved.messages || [],
      msgCounter: saved.msgCounter || 0,
      resultRankings: saved.resultRankings || [],
      waiting: false,
    });

    // 如果游戏还在进行中，重启计时器
    if (saved.gameStarted && saved.timeLeft > 0) {
      this._startTimer();
    }
  },

  // ========== 画布初始化 ==========
  _initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#drawCanvas')
      .fields({ node: true, size: true, rect: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        this._canvas = canvas;
        this._ctx = ctx;
        this._canvasCssWidth = res[0].width;
        this._canvasCssHeight = res[0].height;

        this._clearCanvas();
      });
  },

  // 触摸坐标 → 归一化坐标 0~1（适配不同屏幕尺寸）
  _touchToNormalized(touch) {
    return {
      x: Math.max(0, Math.min(1, touch.x / this._canvasCssWidth)),
      y: Math.max(0, Math.min(1, touch.y / this._canvasCssHeight)),
    };
  },

  // 归一化坐标 → 当前画布 CSS 坐标
  _denormalize(p) {
    return {
      x: p.x * this._canvasCssWidth,
      y: p.y * this._canvasCssHeight,
    };
  },

  _clearCanvas() {
    if (!this._ctx) return;
    this._ctx.fillStyle = '#ffffff';
    this._ctx.fillRect(0, 0, this._canvasCssWidth, this._canvasCssHeight);
  },

  // ========== 触摸事件 ==========
  onTouchStart(e) {
    if (!this.data.isDrawer || !this._ctx) return;
    const n = this._touchToNormalized(e.touches[0]);
    this._isDrawing = true;
    this._lastN = n;
    this._currentStroke = [n];

    const p = this._denormalize(n);
    this._ctx.beginPath();
    this._ctx.arc(p.x, p.y, this.data.currentSize / 2, 0, Math.PI * 2);
    this._ctx.fillStyle = this.data.isEraser ? '#ffffff' : this.data.currentColor;
    this._ctx.fill();
  },

  onTouchMove(e) {
    if (!this._isDrawing || !this._ctx) return;
    const n = this._touchToNormalized(e.touches[0]);
    const from = this._denormalize(this._lastN);
    const to = this._denormalize(n);

    this._ctx.beginPath();
    this._ctx.moveTo(from.x, from.y);
    this._ctx.lineTo(to.x, to.y);
    this._ctx.strokeStyle = this.data.isEraser ? '#ffffff' : this.data.currentColor;
    this._ctx.lineWidth = this.data.currentSize;
    this._ctx.lineCap = 'round';
    this._ctx.lineJoin = 'round';
    this._ctx.stroke();

    this._currentStroke.push(n);
    this._lastN = n;
  },

  onTouchEnd() {
    if (!this._isDrawing) return;
    this._isDrawing = false;

    if (this._currentStroke.length > 0) {
      const strokeData = {
        points: this._currentStroke,
        color: this.data.isEraser ? '#ffffff' : this.data.currentColor,
        width: this.data.currentSize,
      };
      this._strokes.push(strokeData);
      this._sendDrawData(strokeData);
      this._currentStroke = [];
    }
  },

  // ========== 绘图数据同步 ==========
  _sendDrawData(strokeData) {
    if (this._socket && this._socket.readyState === 1) {
      this._socket.send({
        data: JSON.stringify({
          action: 'draw',
          payload: strokeData
        })
      });
    }
  },

  _renderStroke(stroke) {
    if (!this._ctx || !stroke.points || stroke.points.length === 0) return;
    const ctx = this._ctx;
    // 归一化坐标 → 本地画布坐标，宽度按画布比例缩放
    const pts = stroke.points.map(p => this._denormalize(p));
    const w = stroke.width * (this._canvasCssWidth / 750);

    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, w / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.color;
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  },

  // ========== 工具栏事件 ==========
  onColorTap(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ currentColor: color, isEraser: false });
  },

  onSizeChange(e) {
    this.setData({ currentSize: e.detail.value });
  },

  toggleEraser() {
    this.setData({ isEraser: !this.data.isEraser });
  },

  onUndo() {
    if (this._strokes.length === 0) return;
    this._strokes.pop();
    this._redrawAll();
    // 通知其他人重绘
    if (this._socket && this._socket.readyState === 1) {
      this._socket.send({
        data: JSON.stringify({
          action: 'draw',
          payload: { action: 'undo' }
        })
      });
    }
  },

  onClear() {
    this._strokes = [];
    this._clearCanvas();
    if (this._socket && this._socket.readyState === 1) {
      this._socket.send({
        data: JSON.stringify({
          action: 'draw',
          payload: { action: 'clear' }
        })
      });
    }
  },

  _redrawAll() {
    this._clearCanvas();
    for (const stroke of this._strokes) {
      this._renderStroke(stroke);
    }
  },

  // ========== 猜词 ==========
  onGuessInput(e) {
    this.setData({ guessText: e.detail.value });
  },

  sendGuess() {
    const text = this.data.guessText.trim();
    if (!text) return;

    if (this._socket && this._socket.readyState === 1) {
      this._socket.send({
        data: JSON.stringify({
          action: 'guess',
          payload: { text }
        })
      });
    }

    this.setData({ guessText: '' });
  },

  // ========== 消息系统 ==========
  _addMessage(text, type = 'system') {
    const id = this.data.msgCounter + 1;
    const messages = [...this.data.messages, { id, text, type }];
    // 只保留最近30条
    if (messages.length > 30) messages.shift();
    this.setData({
      messages,
      msgCounter: id,
      scrollToMsg: 'msg-' + id
    });
  },

  // ========== WebSocket 连接（联机模式）==========
  _connectSocket() {
    // 优先复用 lobby 传过来的已有 socket（已经在房间里了）
    if (app.globalData.pictionarySocket && app.globalData.pictionarySocket.readyState === 1) {
      console.log('[Game] 复用已有 Socket');
      this._socket = app.globalData.pictionarySocket;
      this._bindSocketEvents();
      return;
    }

    // 没有已有 socket，创建新连接（直接进入游戏页的场景）
    if (this._socket) {
      try { this._socket.close(); } catch(e) {}
    }

    const token = wx.getStorageSync('token');
    let targetWsUrl = CONFIG.WS_URL;
    if (targetWsUrl.endsWith('/ws') && !targetWsUrl.includes('/pictionary/ws')) {
      targetWsUrl = targetWsUrl.replace(/\/ws$/, '/pictionary/ws');
    }
    const wsUrl = token ? `${targetWsUrl}?token=${token}` : targetWsUrl;

    console.log('[Game] 创建新 Socket:', wsUrl);
    this._socket = wx.connectSocket({ url: wsUrl });
    app.globalData.pictionarySocket = this._socket;

    this._socket.onOpen(() => {
      console.log('[Game] Socket 已连接');
      const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
      if (profile && profile.nickname) {
        this._socket.send({
          data: JSON.stringify({
            action: 'set_profile',
            payload: { nickname: profile.nickname, avatar: profile.avatar || '' }
          })
        });
      }

      // 直接进入游戏页时，发送创建/加入指令
      if (this._pendingAction === 'create') {
        this._socket.send({ data: JSON.stringify({ action: 'create_room' }) });
      } else if (this._pendingAction === 'join' && this._pendingRoomId) {
        this._socket.send({ data: JSON.stringify({ action: 'join_room', payload: { roomId: this._pendingRoomId } }) });
      }

      this._bindSocketEvents();
    });

    this._socket.onError((err) => {
      console.error('[Game] Socket错误:', err);
      this._addMessage('网络连接失败', 'system');
    });
  },

  _bindSocketEvents() {
    if (!this._socket) return;
    this._socket.onMessage((res) => {
      const data = JSON.parse(res.data);
      this._dispatchMessage(data);
    });
  },

  _dispatchMessage(data) {
    console.log('[Game] 收到消息:', data.action);

    switch (data.action) {
      case 'game_start':
        this._handleGameStart(data.payload || data);
        break;
      case 'new_round':
        this._handleNewRound(data.payload);
        break;
      case 'draw':
        this._handleRemoteDraw(data.payload);
        break;
      case 'correct':
        this._handleCorrect(data.payload);
        break;
      case 'wrong_guess':
        this._addMessage(`${data.payload.nickname}: ${data.payload.text}`, 'chat');
        break;
      case 'hint':
        this.setData({ hint: data.payload.text });
        break;
      case 'room_created':
        app.globalData.pictionaryRoomId = data.payload?.roomId || data.roomId;
        this.setData({ waiting: true });
        this._addMessage('房间创建成功，点击底部加号邀请好友', 'system');
        break;
      case 'round_end':
        this._handleRoundEnd(data.payload);
        break;
      case 'game_over':
        this._handleGameOver(data.payload);
        break;
      case 'player_joined':
        this._addMessage(`${data.payload.nickname} 加入了房间`, 'system');
        const pList = this.data.players.filter(p => !p.isEmpty);
        if (!pList.find(p => p.id === data.payload.id)) {
          pList.push({ ...data.payload, score: 0, isDrawer: false, correct: false });
          this._updateDisplayPlayers(pList);
        }
        break;
      case 'player_left':
          this._addMessage(`${data.payload.nickname} 离开了房间`, 'system');
          // 【新增】：有人离开，移除并重新补齐空位
          const remain = this.data.players.filter(p => !p.isEmpty && p.id !== data.payload.id);
          this._updateDisplayPlayers(remain);
          break;
      
        case 'error':
          wx.showToast({ title: data.payload?.message || '操作失败', icon: 'none' });
          break;
      }
  },

  _handleGameStart(payload) {
    if (this._gameStarted) return;
    this._gameStarted = true;

    const players = (payload.players || payload || []).map(p => ({
      ...p,
      score: p.score || 0,
      isDrawer: false,
      correct: false,
    }));
    this._myId = payload.myId || app.globalData.pictionaryMyId || '';
    if (this._myId) app.globalData.pictionaryMyId = this._myId;
    
    // 【必须】通过辅助函数渲染，不要直接 setData
    this._updateDisplayPlayers(players);

    this.setData({
      gameStarted: true,
      waiting: false,
      round: 0,
      totalRounds: payload.totalRounds || app.globalData.pictionarySelectedRounds || 5,
    });
    this._addMessage('游戏开始！', 'system');
  },

  _handleNewRound(payload) {
    const { drawerId, round, timeLimit, hint, word } = payload;
    const isDrawer = drawerId === this._myId;

    const players = this.data.players.map(p => ({
      ...p,
      isDrawer: p.id === drawerId,
      correct: false,
    }));

    this._guessedPlayers.clear();
    this._strokes = [];
    this._clearCanvas();

    // 【必须】通过辅助函数渲染，不要直接 setData
    this._updateDisplayPlayers(players);

    this.setData({
      round,
      timeLeft: timeLimit || 60,
      isDrawer,
      currentWord: isDrawer ? (word || '') : '',
      hint: hint || '',
      guessText: '',
    });

    const drawer = players.find(p => p.id === drawerId);
    const drawerName = drawer ? drawer.nickname : '未知';
    this._addMessage(`第 ${round} 轮：${drawerName} 开始画`, 'system');

    this._startTimer();
  },



  _handleRemoteDraw(payload) {
    if (this.data.isDrawer) return; // 画手不处理远端绘图

    if (payload.action === 'clear') {
      this._strokes = [];
      this._clearCanvas();
    } else if (payload.action === 'undo') {
      this._strokes.pop();
      this._redrawAll();
    } else if (payload.points) {
      this._strokes.push(payload);
      this._renderStroke(payload);
    }
  },

  _handleCorrect(payload) {
    const { userId, nickname, word } = payload;
    this._guessedPlayers.add(userId);
    this._addMessage(`${nickname} 猜对了！答案是：${word}`, 'correct');

    const players = this.data.players.map(p => {
      if (p.id === userId) return { ...p, correct: true, score: (p.score || 0) + (payload.score || 10) };
      return p;
    });
    // this.setData({ players });
    this._updateDisplayPlayers(players);

  },

  _handleRoundEnd(payload) {
    this._clearTimer();
    const { word, scores } = payload;
    this._addMessage(`回合结束！答案是：${word}`, 'system');

    if (scores) {
      const players = this.data.players.map(p => ({
        ...p,
        score: scores[p.id] || p.score || 0
      }));
      // this.setData({ players });
      this._updateDisplayPlayers(players);
    }
  },

  _handleGameOver(payload) {
    this._clearTimer();
    const { scores, rankings } = payload;

    // 用后端分数更新 players
    if (scores) {
      const players = this.data.players.map(p => ({
        ...p,
        score: scores[p.id] || p.score || 0
      }));
      this._updateDisplayPlayers(players);
    }

    // 始终从 players 数据构建排名（保留头像等完整信息）
    const scoreMap = {};
    if (rankings) rankings.forEach(r => { if (r.id) scoreMap[r.id] = r.score; });
    const realPlayers = this.data.players.filter(p => !p.isEmpty);
    const resultRankings = realPlayers
      .map(p => ({
        id: p.id,
        nickname: p.nickname || '未知',
        avatar: p.avatar || '',
        score: scoreMap[p.id] || p.score || 0,
      }))
      .sort((a, b) => b.score - a.score);

    this.setData({
      showResult: true,
      resultRankings: resultRankings,
      gameStarted: false,
    });
  },

  // ========== 计时器 ==========
  _startTimer() {
    this._clearTimer();
    this._timer = setInterval(() => {
      let t = this.data.timeLeft - 1;
      if (t <= 0) {
        this._clearTimer();
        t = 0;
      }
      this.setData({ timeLeft: t });
    }, 1000);
  },

  _clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  // ========== 本地模式 ==========
  _startLocalGame() {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    const wordList = shuffled.slice(0, this.data.totalRounds);
    this._localWordList = wordList;
    this._localRoundIndex = 0;

    const profile = app.globalData.gameProfile || wx.getStorageSync('gameProfile');
    this._myId = 'local_' + Date.now();

    this.setData({
      gameStarted: true,
      waiting: false,
      players: [{
        id: this._myId,
        nickname: profile ? profile.nickname : '画手',
        avatar: profile ? profile.avatar : '',
        score: 0,
        isDrawer: true,
        correct: false,
      }],
      round: 0,
    });

    this._nextLocalRound();
  },

  _nextLocalRound() {
    this._localRoundIndex++;
    if (this._localRoundIndex > this.data.totalRounds) {
      this._addMessage('所有轮次结束！', 'system');
      const realPlayers = this.data.players.filter(p => !p.isEmpty);
      const rankings = realPlayers
        .map(p => ({ nickname: p.nickname, avatar: p.avatar, score: p.score || 0 }))
        .sort((a, b) => b.score - a.score);
      this.setData({ showResult: true, resultRankings: rankings, gameStarted: false });
      return;
    }

    const word = this._localWordList[this._localRoundIndex - 1];
    this._strokes = [];
    this._clearCanvas();

    this.setData({
      round: this._localRoundIndex,
      currentWord: word,
      hint: word[0] + ' ' + '_'.repeat(word.length - 1),
      timeLeft: 60,
      isDrawer: true,
      guessText: '',
    });

    this._addMessage(`第 ${this._localRoundIndex} 轮，请画：${word}`, 'system');
    this._startTimer();
  },

  // ========== 页面事件 ==========
  onStartLocal() {
    this._startLocalGame();
  },

  onStartOnline() {
    this.setData({ waiting: true });
    this._connectSocket();
  },

  onNextLocalRound() {
    this._nextLocalRound();
  },

  onGoLobby() {
    wx.redirectTo({ url: '/pictionary/pages/lobby/lobby' });
  },

  onBackToLobby() {
    this._clearTimer();
    this._gameStarted = false;
    app.globalData.pictionaryRoomId = '';
    app.globalData.pictionaryPlayers = [];
    app.globalData.pictionaryGameState = null;
    // 主动关闭 socket（用户明确离开）
    if (this._socket) {
      try { this._socket.close(); } catch(e) {}
      this._socket = null;
      app.globalData.pictionarySocket = null;
    }
    wx.redirectTo({ url: '/pictionary/pages/lobby/lobby' });
  },
  // 【新增】：允许游戏进行中点击 ➕ 号触发分享邀请
  onShareAppMessage() {
    const roomId = app.globalData.pictionaryRoomId || '';
    return {
      title: '我正在玩你画我猜，快来加入房间！',
      path: `/pictionary/pages/lobby/lobby?action=join&roomId=${roomId}`
    };
  }

});
