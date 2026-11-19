// 你画我猜 · 双人关系空间内的小画板
// 不使用独立房间：直接复用 couple-ws，只发给同一个 couple 空间里的另一个人。
const api = require('../../utils/couple-api.js');
const wsClient = require('../../utils/couple-ws.js');

const CATEGORY_WORDS = {
  食物: '苹果 香蕉 西瓜 草莓 葡萄 橘子 桃子 梨 柠檬 樱桃 菠萝 芒果 椰子 蛋糕 冰淇淋 汉堡 披萨 面条 饺子 包子 火锅 月饼 汤圆 寿司 三明治 薯条 爆米花 奶茶 咖啡 可乐 果汁 面包 饼干 糖果 巧克力 鸡蛋 米饭 粽子 烤鸭 糖葫芦 棉花糖 布丁 蛋挞 甜甜圈 热狗 沙拉 南瓜 玉米 蘑菇 胡萝卜',
  动物: '猫咪 小狗 兔子 大象 长颈鹿 熊猫 老虎 狮子 猴子 河马 犀牛 斑马 袋鼠 考拉 狐狸 狼 熊 鹿 松鼠 刺猬 企鹅 海豚 鲸鱼 鲨鱼 章鱼 水母 海星 螃蟹 龙虾 乌龟 青蛙 蛇 鳄鱼 恐龙 独角兽 凤凰 龙 蝴蝶 蜜蜂 蚂蚁 蜗牛 蜻蜓 瓢虫 蜘蛛 小鸟 公鸡 鸭子 猫头鹰 孔雀 火烈鸟',
  日常: '太阳 月亮 星星 彩虹 雨伞 眼镜 帽子 围巾 手套 鞋子 手表 书包 铅笔 剪刀 钥匙 台灯 沙发 床 椅子 桌子 电视 手机 电脑 冰箱 洗衣机 电风扇 空调 水杯 牙刷 毛巾 镜子 梳子 闹钟 雨衣 口罩 戒指 项链 皇冠 钻石 宝石 灯笼 风筝 气球 礼物 相框 花瓶 扫把 拖把 锅 碗 筷子',
  自然: '大树 花朵 小草 蘑菇 仙人掌 竹子 枫叶 雪花 闪电 云朵 太阳花 向日葵 玫瑰 郁金香 荷花 蒲公英 海浪 沙滩 贝壳 火山 瀑布 山峰 河流 湖泊 森林 草地 石头 岛屿 星空 银河 流星 极光 露珠 彩虹桥 春天 夏天 秋天 冬天',
  交通: '自行车 摩托车 汽车 公交车 火车 高铁 飞机 直升机 热气球 轮船 帆船 潜水艇 火箭 飞船 滑板 轮滑 地铁 出租车 救护车 消防车 警车 卡车 挖掘机 吊车 校车 三轮车 独木舟 降落伞',
  人物: '医生 护士 老师 警察 消防员 厨师 画家 歌手 演员 宇航员 科学家 农民 渔夫 司机 飞行员 理发师 快递员 服务员 摄影师 运动员 魔术师 小丑 国王 王后 公主 王子 骑士 海盗 忍者 超人 美人鱼 雪人 机器人',
  建筑: '城堡 房子 学校 医院 图书馆 博物馆 教堂 塔 桥 摩天轮 游乐园 电影院 超市 餐厅 酒店 机场 车站 灯塔 风车 帐篷 凉亭 长城 金字塔 埃菲尔铁塔 摩天大楼 小屋 树屋',
  娱乐: '钢琴 吉他 小提琴 鼓 话筒 耳机 游戏机 足球 篮球 乒乓球 羽毛球 网球 排球 棒球 保龄球 游泳 滑雪 冲浪 跳绳 秋千 滑梯 积木 拼图 象棋 围棋 扑克牌 风筝 陀螺 弹珠 绘本 电影 相机 画笔 颜料 调色盘',
  动作: '跑步 跳跃 游泳 跳舞 唱歌 画画 读书 写字 吃饭 喝水 睡觉 微笑 哭泣 拥抱 挥手 眨眼 打哈欠 伸懒腰 鼓掌 蹦床 骑自行车 放风筝 堆雪人 吹泡泡 看星星 数星星 打电话 自拍 做鬼脸 转圈圈',
  节日: '春节 红包 鞭炮 灯笼 春联 烟花 年夜饭 饺子 月饼 粽子 龙舟 汤圆 圣诞树 圣诞帽 南瓜灯 生日蛋糕 蜡烛 礼物 许愿 团圆饭 元宵 七夕 重阳 新年',
};

const WORDS = [];
Object.keys(CATEGORY_WORDS).forEach(function (category) {
  CATEGORY_WORDS[category].split(/\s+/).forEach(function (w) {
    if (w && w.length <= 6) WORDS.push({ w: w, c: category });
  });
});

const COLORS = ['#4a4038', '#e8786e', '#e6a15c', '#7aa88f', '#6f9ec4', '#a88bc4', '#d98aa8', '#8d7b68'];
const SIZES = [4, 7, 11];

function maskOf(word) {
  let s = '';
  for (let i = 0; i < word.length; i++) {
    s += /[\u4e00-\u9fa5]/.test(word.charAt(i)) ? '＿' : word.charAt(i);
  }
  return s;
}
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\s,，。.!！?？、;；:："'“”‘’()（）]/g, '');
}
function timeText(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return (s >= 60 ? Math.floor(s / 60) : 0) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
}
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

Page({
  data: {
    ready: false,
    errorText: '',
    online: false,
    partnerOnline: false,
    connText: '连接中…',
    myId: 0,
    myName: '我',
    myInitial: '我',
    myAvatar: '',
    partnerId: 0,
    partnerName: 'TA',
    partnerAvatar: '',
    partnerInitial: 'TA',

    stage: 'lobby', // lobby | playing | result
    round: 1,
    totalRounds: 5,
    totalOptions: [3, 5, 8],
    isDrawer: false,
    drawerId: 0,
    word: '',
    mask: '',
    category: '',
    hintText: '',
    timeLeft: 60,
    timeText: '1:00',
    timeUrgent: false,
    myScore: 0,
    partnerScore: 0,
    showResult: false,
    resultTitle: '',
    resultSub: '',
    winnerName: '',

    palette: COLORS,
    currentColor: COLORS[0],
    currentSize: SIZES[1],
    sizes: SIZES,
    isEraser: false,
    strokesCount: 0,
    boardReady: false,

    feed: [],
    guessText: '',
    canGuess: false,
    scrollTo: '',
    roundReveal: '',
    roundRevealSub: '',
    shareVisible: false,
  },

  onLoad: function () {
    this._strokes = [];
    this._current = [];
    this._drawing = false;
    this._lastPoint = null;
    this._lastSend = 0;
    this._timer = null;
    this._timerEnd = 0;
    this._gameId = '';
    this._scores = {};
    this._round = 1;
    this._drawerId = 0;
    this._myWord = '';
    this._guessed = false;
    this._used = {};
    this._socket = null;
    this._feedSeq = 0;
    this._rect = null;
    this._canvasW = 0;
    this._canvasH = 0;
    this._loading = true;

    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res || !res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
          return;
        }
        if (!res.couple.partner) {
          that.setData({
            ready: true,
            errorText: '先邀请 TA 进入你们的小火苗，才能一起玩哦',
          });
          that._loading = false;
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
          partnerAvatar: api.absUrl(partner.avatar),
        });
        that._loading = false;
        that.connect();
        if (wx.showShareMenu) {
          wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
        }
      })
      .catch(function (err) {
        that._loading = false;
        that.setData({ ready: true, errorText: (err && (err.msg || err.message)) || '加载失败，请稍后再试' });
      });
  },

  onReady: function () {
    this.initCanvas();
  },

  onShow: function () {
    if (!this._loading && this.data.myId && (!this._socket || !this.data.online)) {
      this.connect();
    }
    if (this.data.stage === 'playing') this.redraw();
  },

  onUnload: function () {
    this.teardown();
    if (this._socket) {
      try { this._socket.send({ type: 'pictionary', payload: { action: 'leave' } }); } catch (e) {}
      this._socket.close();
      this._socket = null;
    }
  },

  teardown: function () {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  // ===== 连接 =====
  connect: function () {
    if (!this.data.partnerId) return;
    if (this._socket) {
      try { this._socket.close(); } catch (e) {}
      this._socket = null;
    }
    const that = this;
    this.setData({ connText: '连接中…' });
    this._socket = wsClient.createChatSocket({
      getToken: api.getToken,
      getSpaceId: api.getSpaceId,
      onStatus: function (status) {
        if (status === 'offline') {
          that.setData({ online: false, partnerOnline: false, connText: '网络重连中…' });
        }
      },
      onReady: function (data) {
        const online = (data && data.online) || [];
        const partnerOnline = online.indexOf(that.data.partnerId) >= 0;
        that.setData({ online: true, partnerOnline: partnerOnline, connText: partnerOnline ? 'TA 在线' : '等 TA 上线' });
        if (that._gameId && (that.data.stage === 'playing' || that.data.stage === 'result')) {
          that.sendEvent('sync_req');
        }
      },
      onMessage: function (data) {
        that.handleWs(data);
      },
    });
  },

  handleWs: function (data) {
    if (!data) return;
    if (data.type === 'presence') {
      if (data.user_id === this.data.partnerId) {
        const online = !!data.online;
        this.setData({ partnerOnline: online, connText: online ? 'TA 在线' : '等 TA 上线' });
        if (!online && this.data.stage === 'playing') {
          this.pushFeed('system', 'TA 暂时离开了，等你回来继续');
        }
      }
      return;
    }
    if (data.type !== 'pictionary') return;
    const p = data.payload || {};
    if (data.from === this.data.myId) return; // 自己的事件本地已处理
    const action = p.action;
    if (action === 'round_start') return this.onRemoteRoundStart(p);
    if (action === 'point') return this.onRemotePoint(p);
    if (action === 'stroke') return this.onRemoteStroke(p);
    if (action === 'clear') return this.onRemoteClear();
    if (action === 'strokes') return this.onRemoteStrokes(p);
    if (action === 'guess') return this.onRemoteGuess(p);
    if (action === 'wrong') return this.onRemoteWrong(p);
    if (action === 'correct') return this.onRemoteCorrect(p);
    if (action === 'round_end') return this.onRemoteRoundEnd(p);
    if (action === 'game_over') return this.onRemoteGameOver(p);
    if (action === 'sync_req') return this.onSyncRequest(p);
    if (action === 'sync_state') return this.onSyncState(p);
    if (action === 'leave') return this.onRemoteLeave();
    if (action === 'hint') return this.onRemoteHint(p);
  },

  sendEvent: function (action, payload) {
    if (!this._socket) return false;
    return this._socket.send({
      type: 'pictionary',
      payload: Object.assign({ action: action }, payload || {}),
    });
  },

  // ===== 开局 =====
  selectRounds: function (e) {
    if (this.data.stage === 'playing') return;
    this.setData({ totalRounds: Number(e.currentTarget.dataset.rounds) || 5 });
  },

  startGame: function () {
    if (!this.data.ready || this.data.errorText) return;
    if (!this.data.partnerOnline) {
      wx.showToast({ title: '等 TA 上线再开始吧', icon: 'none' });
      return;
    }
    if (this.data.stage === 'playing') return;
    this._gameId = 'g' + Date.now() + '_' + this.data.myId;
    this._scores = {};
    this._scores[this.data.myId] = 0;
    this._scores[this.data.partnerId] = 0;
    this._round = 1;
    this._drawerId = this.data.myId;
    this._used = {};
    this._guessed = false;
    this.setData({
      stage: 'playing',
      round: 1,
      totalRounds: this.data.totalRounds || 5,
      myScore: 0,
      partnerScore: 0,
      showResult: false,
      roundReveal: '',
      feed: [],
      hintText: '',
    });
    this.beginRound();
  },

  beginRound: function () {
    const drawer = this._drawerId;
    const isDrawer = drawer === this.data.myId;
    const total = this.data.totalRounds || 5;
    const round = this._round;
    this._guessed = false;
    this._roundEnding = false;
    this._strokes = [];
    // 画布可能因上一局/结算被销毁重建，必须重新拿 node
    this._ctx = null;
    this._canvas = null;
    this.setData({
      boardReady: false,
      stage: 'playing',
      round: round,
      isDrawer: isDrawer,
      drawerId: drawer,
      canGuess: !isDrawer,
      word: '',
      mask: '',
      category: '',
      hintText: '',
      roundReveal: '',
      strokesCount: 0,
      guessText: '',
    });
    this.clearCanvas();
    this.ensureCanvas();
    if (isDrawer) {
      const item = this.pickWord();
      this._myWord = item.w;
      this.setData({
        word: item.w,
        mask: maskOf(item.w),
        category: item.c,
        myScore: this._scores[this.data.myId] || 0,
        partnerScore: this._scores[this.data.partnerId] || 0,
      });
      const endsAt = Date.now() + 60000;
      this.startTimer(endsAt);
      this.sendEvent('round_start', {
        game_id: this._gameId,
        round: round,
        total_rounds: total,
        drawer_id: drawer,
        mask: maskOf(item.w),
        category: item.c,
        word_len: item.w.length,
        scores: this._scores,
        ends_at: endsAt,
      });
      this.pushFeed('system', '第 ' + round + ' 回合 · 你来画，TA 来猜');
    } else {
      this.pushFeed('system', '第 ' + round + ' 回合 · TA 画，你来猜');
    }
  },

  pickWord: function () {
    if (!WORDS.length) return { w: '苹果', c: '食物' };
    const available = [];
    for (let i = 0; i < WORDS.length; i++) {
      if (!this._used[i]) available.push(i);
    }
    if (!available.length) {
      this._used = {};
      for (let i = 0; i < WORDS.length; i++) available.push(i);
    }
    const idx = pickRandom(available);
    this._used[idx] = true;
    return WORDS[idx];
  },

  // ===== 计时 =====
  startTimer: function (endsAt) {
    this.teardown();
    this._timerEnd = endsAt || (Date.now() + 60000);
    const that = this;
    const tick = function () {
      const left = Math.max(0, Math.ceil((that._timerEnd - Date.now()) / 1000));
      that.setData({ timeLeft: left, timeText: timeText(left), timeUrgent: left <= 10 && left > 0 });
      if (left <= 0) {
        that.teardown();
        if (that.data.isDrawer && that.data.stage === 'playing' && !that._guessed) {
          that.finishRound('timeout', 0);
        }
      }
    };
    tick();
    this._timer = setInterval(tick, 1000);
  },

  // ===== 回合结束 =====
  finishRound: function (reason, winnerId) {
    if (!this.data.isDrawer || this._roundEnding) return;
    this._roundEnding = true;
    this._guessed = true;
    this.teardown();
    const word = this._myWord;
    const total = this.data.totalRounds || 5;
    const round = this._round;
    const isLast = round >= total;
    const nextDrawer = this._drawerId === this.data.myId ? this.data.partnerId : this.data.myId;
    const scores = this._scores;
    let sub = reason === 'correct' ? '猜对啦，这一分属于 TA' : '时间到，这个词是「' + word + '」';
    if (!isLast) sub += ' · 下一回合交换画手';
    this.setData({
      roundReveal: word,
      roundRevealSub: sub,
      word: word,
      myScore: scores[this.data.myId] || 0,
      partnerScore: scores[this.data.partnerId] || 0,
    });
    this.sendEvent('round_end', {
      game_id: this._gameId,
      round: round,
      word: word,
      scores: scores,
      reason: reason,
      winner_id: winnerId || 0,
      next_round: isLast ? 0 : round + 1,
      next_drawer: nextDrawer,
      is_last: isLast,
    });
    const that = this;
    if (isLast) {
      setTimeout(function () { that.endGame(); }, 1600);
    } else {
      setTimeout(function () {
        if (that.data.myId === nextDrawer) {
          that._drawerId = nextDrawer;
          that._round = round + 1;
          that.beginRound();
        }
      }, 2200);
    }
  },

  endGame: function () {
    this.teardown();
    const scores = this._scores;
    const mine = scores[this.data.myId] || 0;
    const theirs = scores[this.data.partnerId] || 0;
    let title = '平局';
    let winner = '';
    if (mine > theirs) { title = '你赢了'; winner = this.data.myName; }
    else if (theirs > mine) { title = 'TA 赢了'; winner = this.data.partnerName; }
    this.setData({
      stage: 'result',
      showResult: true,
      myScore: mine,
      partnerScore: theirs,
      resultTitle: title,
      winnerName: winner,
      resultSub: '这一局辛苦啦，和 TA 再画一局吧',
      roundReveal: '',
    });
    this.sendEvent('game_over', { game_id: this._gameId, scores: scores, winner_id: winner ? (mine > theirs ? this.data.myId : this.data.partnerId) : 0 });
  },

  // ===== 远端事件 =====
  onRemoteRoundStart: function (p) {
    if (!p || !p.game_id) return;
    this._gameId = p.game_id;
    this._round = p.round || 1;
    this._drawerId = p.drawer_id || 0;
    this._scores = p.scores || {};
    this._guessed = false;
    this._roundEnding = false;
    this._strokes = [];
    this._ctx = null;
    this._canvas = null;
    const isDrawer = this._drawerId === this.data.myId;
    this.setData({
      boardReady: false,
      stage: 'playing',
      round: this._round,
      totalRounds: p.total_rounds || 5,
      isDrawer: isDrawer,
      drawerId: this._drawerId,
      word: '',
      mask: p.mask || '',
      category: p.category || '',
      hintText: '',
      canGuess: !isDrawer,
      myScore: this._scores[this.data.myId] || 0,
      partnerScore: this._scores[this.data.partnerId] || 0,
      roundReveal: '',
      strokesCount: 0,
      guessText: '',
    });
    this.clearCanvas();
    this.ensureCanvas();
    this.startTimer(p.ends_at || (Date.now() + 60000));
    this.pushFeed('system', '第 ' + this._round + ' 回合 · ' + (isDrawer ? '你来画，TA 来猜' : 'TA 画，你来猜'));
  },

  onRemotePoint: function (p) {
    if (this.data.isDrawer) return;
    if (!this._ctx || p.x0 === undefined) return;
    this.drawSegment(p.x0, p.y0, p.x1, p.y1, p.color || '#4a4038', p.size || 7, p.eraser);
  },

  onRemoteStroke: function (p) {
    if (this.data.isDrawer || !p || !p.points) return;
    this._strokes.push({ points: p.points, color: p.color || '#4a4038', size: p.size || 7, eraser: !!p.eraser });
    this.setData({ strokesCount: this._strokes.length });
    this.redraw();
  },

  onRemoteClear: function () {
    if (this.data.isDrawer) return;
    this._strokes = [];
    this.setData({ strokesCount: 0 });
    this.redraw();
  },

  onRemoteStrokes: function (p) {
    if (this.data.isDrawer || !p || !p.strokes) return;
    this._strokes = p.strokes;
    this.setData({ strokesCount: this._strokes.length });
    this.redraw();
  },

  onRemoteGuess: function (p) {
    if (!this.data.isDrawer) return;
    const text = String(p.text || '').slice(0, 24);
    this.pushFeed('them', this.data.partnerName + '：' + text);
    if (this._guessed) return;
    if (normalize(text) === normalize(this._myWord)) {
      this._guessed = true;
      this._scores[this.data.partnerId] = (this._scores[this.data.partnerId] || 0) + 100;
      this.setData({
        partnerScore: this._scores[this.data.partnerId],
        word: this._myWord,
      });
      this.pushFeed('system', '🎉 TA 猜对啦！答案是「' + this._myWord + '」');
      this.sendEvent('correct', {
        user_id: this.data.partnerId,
        word: this._myWord,
        scores: this._scores,
        round: this._round,
      });
      this.finishRound('correct', this.data.partnerId);
    } else {
      this.sendEvent('wrong', { text: text });
    }
  },

  onRemoteWrong: function (p) {
    if (this.data.isDrawer) return;
    this.pushFeed('system', '不太对哦，再看看画里的细节');
  },

  onRemoteCorrect: function (p) {
    if (this.data.isDrawer) return;
    this._scores = p.scores || this._scores;
    this.setData({
      myScore: this._scores[this.data.myId] || 0,
      partnerScore: this._scores[this.data.partnerId] || 0,
      word: p.word || '',
      roundReveal: p.word || '',
      roundRevealSub: '你猜对啦，好厉害',
      canGuess: false,
    });
    this.pushFeed('system', '🎉 你猜对啦！答案是「' + p.word + '」');
    this.teardown();
  },

  onRemoteRoundEnd: function (p) {
    this.teardown();
    this._scores = p.scores || this._scores;
    const isLast = !!p.is_last;
    this.setData({
      myScore: this._scores[this.data.myId] || 0,
      partnerScore: this._scores[this.data.partnerId] || 0,
      word: p.word || '',
      mask: '',
      roundReveal: p.word || '',
      roundRevealSub: p.reason === 'correct'
        ? '猜对啦，答案是「' + p.word + '」'
        : '时间到，答案是「' + p.word + '」',
      canGuess: false,
    });
    if (p.next_drawer === this.data.myId && !isLast) {
      const that = this;
      setTimeout(function () {
        that._drawerId = that.data.myId;
        that._round = (p.next_round || (that._round + 1));
        that.beginRound();
      }, 2000);
    }
  },

  onRemoteGameOver: function (p) {
    this.teardown();
    this._scores = p.scores || this._scores;
    const mine = this._scores[this.data.myId] || 0;
    const theirs = this._scores[this.data.partnerId] || 0;
    let title = '平局';
    if (mine > theirs) title = '你赢了';
    else if (theirs > mine) title = 'TA 赢了';
    this.setData({
      stage: 'result',
      showResult: true,
      myScore: mine,
      partnerScore: theirs,
      resultTitle: title,
      resultSub: '这一局辛苦啦，和 TA 再画一局吧',
      canGuess: false,
      roundReveal: '',
    });
  },

  onSyncRequest: function () {
    if (!this._gameId || this.data.stage === 'lobby') return;
    if (!this.data.isDrawer) return; // 只有画手回传当前画布/分数；猜的人只接收
    this.sendEvent('sync_state', {
      game_id: this._gameId,
      drawer_id: this._drawerId,
      round: this._round,
      total_rounds: this.data.totalRounds,
      mask: this.data.mask,
      category: this.data.category,
      scores: this._scores,
      ends_at: this._timerEnd,
      strokes: this._strokes,
    });
  },

  onSyncState: function (p) {
    if (this.data.isDrawer) return;
    if (!p || !p.game_id || p.game_id !== this._gameId) return;
    this._round = p.round || this._round;
    this._drawerId = p.drawer_id || this._drawerId;
    this._scores = p.scores || this._scores;
    this._strokes = p.strokes || [];
    this.setData({
      stage: 'playing',
      round: this._round,
      drawerId: this._drawerId,
      mask: p.mask || this.data.mask,
      category: p.category || this.data.category,
      myScore: this._scores[this.data.myId] || 0,
      partnerScore: this._scores[this.data.partnerId] || 0,
      strokesCount: this._strokes.length,
      canGuess: this._drawerId !== this.data.myId,
    });
    this.startTimer(p.ends_at || (Date.now() + 60000));
    this.redraw();
  },

  onRemoteHint: function (p) {
    if (this.data.isDrawer) return;
    this.setData({ hintText: p.hint ? '提示：' + p.hint : '' });
  },

  onRemoteLeave: function () {
    this.teardown();
    this.setData({
      stage: 'result',
      showResult: true,
      resultTitle: 'TA 先离开了',
      resultSub: '画板先收起来，等 TA 回来再玩',
      roundReveal: '',
    });
  },

  // ===== 画板 =====
  ensureCanvas: function () {
    if (this._ctx) return;
    const that = this;
    setTimeout(function () { that.initCanvas(); }, 120);
  },

  initCanvas: function () {
    const that = this;
    // 2D canvas 必须用 node 查询；fields 和 rect 分开查，避免链式调用丢失 node
    const query = wx.createSelectorQuery().in(this);
    query.select('#board').fields({ node: true, size: true });
    query.select('#board').boundingClientRect();
    query.exec(function (res) {
      const info = res && res[0];
      const rect = res && res[1];
      if (!info || !info.node) {
        // 页面/弹层切换时节点可能还没渲染好，重试几次
        that._canvasRetry = (that._canvasRetry || 0) + 1;
        if (that._canvasRetry <= 10) {
          setTimeout(function () { that.initCanvas(); }, 150);
        }
        return;
      }
      that._canvasRetry = 0;
      const canvas = info.node;
      let dpr = 1;
      try { dpr = wx.getSystemInfoSync().pixelRatio || 1; } catch (e) {}
      const w = info.width || 320;
      const h = info.height || 320;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      that._canvas = canvas;
      that._ctx = ctx;
      that._canvasW = w;
      that._canvasH = h;
      that._rect = rect || null;
      that.setData({ boardReady: true });
      that.redraw();
    });
  },

  pointFromTouch: function (e) {
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || {};
    const rect = this._rect || { left: 0, top: 0 };
    let x = 0;
    let y = 0;
    // canvas 触摸事件的 x/y 通常是画布内坐标；pageX/pageY 才是页面坐标。
    if (t.pageX !== undefined && t.pageY !== undefined) {
      x = t.pageX - (rect.left || 0);
      y = t.pageY - (rect.top || 0);
    } else if (t.clientX !== undefined && t.clientY !== undefined && t.x === undefined) {
      x = t.clientX - (rect.left || 0);
      y = t.clientY - (rect.top || 0);
    } else {
      x = Number(t.x) || 0;
      y = Number(t.y) || 0;
      // 少数基础库的 x/y 是页面坐标：明显超出画布时回退为减去 rect
      if (x > (this._canvasW || 320) || y > (this._canvasH || 320)) {
        x -= (rect.left || 0);
        y -= (rect.top || 0);
      }
    }
    x = Math.max(0, Math.min(this._canvasW || 320, x));
    y = Math.max(0, Math.min(this._canvasH || 320, y));
    return { x: x / (this._canvasW || 320), y: y / (this._canvasH || 320) };
  },

  onTouchStart: function (e) {
    if (!this.data.isDrawer || this.data.stage !== 'playing') return;
    if (!this._ctx) this.initCanvas();
    const p = this.pointFromTouch(e);
    this._drawing = true;
    this._lastPoint = p;
    this._current = [p];
    this.drawDot(p.x, p.y, this.data.currentColor, this.data.currentSize, this.data.isEraser);
    if (this.data.isEraser) this.setData({ isEraser: true });
  },

  onTouchMove: function (e) {
    if (!this._drawing || !this.data.isDrawer) return;
    const p = this.pointFromTouch(e);
    const from = this._lastPoint || p;
    this.drawSegment(from.x, from.y, p.x, p.y, this.data.currentColor, this.data.currentSize, this.data.isEraser);
    this._current.push(p);
    this._lastPoint = p;
    const now = Date.now();
    if (now - this._lastSend > 45) {
      this._lastSend = now;
      this.sendEvent('point', {
        x0: from.x, y0: from.y, x1: p.x, y1: p.y,
        color: this.data.currentColor, size: this.data.currentSize, eraser: this.data.isEraser,
      });
    }
  },

  onTouchEnd: function () {
    if (!this._drawing) return;
    this._drawing = false;
    if (this.data.isDrawer && this._current.length) {
      const stroke = {
        points: this._current,
        color: this.data.currentColor,
        size: this.data.currentSize,
        eraser: this.data.isEraser,
      };
      this._strokes.push(stroke);
      this.setData({ strokesCount: this._strokes.length });
      this.sendEvent('stroke', stroke);
    }
    this._current = [];
    this._lastPoint = null;
  },

  drawDot: function (nx, ny, color, size, eraser) {
    const ctx = this._ctx;
    if (!ctx) return;
    const x = nx * this._canvasW;
    const y = ny * this._canvasH;
    ctx.beginPath();
    ctx.fillStyle = eraser ? '#fffaf5' : color;
    ctx.arc(x, y, (eraser ? size * 2.2 : size) / 2, 0, Math.PI * 2);
    ctx.fill();
  },

  drawSegment: function (nx0, ny0, nx1, ny1, color, size, eraser) {
    const ctx = this._ctx;
    if (!ctx) return;
    const x0 = nx0 * this._canvasW;
    const y0 = ny0 * this._canvasH;
    const x1 = nx1 * this._canvasW;
    const y1 = ny1 * this._canvasH;
    ctx.beginPath();
    ctx.strokeStyle = eraser ? '#fffaf5' : color;
    ctx.lineWidth = eraser ? size * 2.2 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  },

  redraw: function () {
    const ctx = this._ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this._canvasW, this._canvasH);
    ctx.fillStyle = '#fffaf5';
    ctx.fillRect(0, 0, this._canvasW, this._canvasH);
    ctx.strokeStyle = 'rgba(160,130,105,0.16)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo((this._canvasW / 6) * i, 0);
      ctx.lineTo((this._canvasW / 6) * i, this._canvasH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (this._canvasH / 6) * i);
      ctx.lineTo(this._canvasW, (this._canvasH / 6) * i);
      ctx.stroke();
    }
    for (let i = 0; i < this._strokes.length; i++) {
      const s = this._strokes[i];
      if (!s || !s.points || !s.points.length) continue;
      const pts = s.points;
      if (pts.length === 1) {
        this.drawDot(pts[0].x, pts[0].y, s.color, s.size, s.eraser);
      } else {
        for (let j = 1; j < pts.length; j++) {
          this.drawSegment(pts[j - 1].x, pts[j - 1].y, pts[j].x, pts[j].y, s.color, s.size, s.eraser);
        }
      }
    }
  },

  clearCanvas: function () {
    if (this._ctx) this.redraw();
  },

  // ===== 工具栏 =====
  selectColor: function (e) {
    if (!this.data.isDrawer) return;
    this.setData({ currentColor: e.currentTarget.dataset.color, isEraser: false });
  },
  selectSize: function (e) {
    if (!this.data.isDrawer) return;
    this.setData({ currentSize: Number(e.currentTarget.dataset.size) });
  },
  toggleEraser: function () {
    if (!this.data.isDrawer) return;
    this.setData({ isEraser: !this.data.isEraser });
  },
  undoStroke: function () {
    if (!this.data.isDrawer || !this._strokes.length) return;
    this._strokes.pop();
    this.setData({ strokesCount: this._strokes.length });
    this.redraw();
    this.sendEvent('strokes', { strokes: this._strokes });
  },
  clearBoard: function () {
    if (!this.data.isDrawer) return;
    this._strokes = [];
    this.setData({ strokesCount: 0 });
    this.redraw();
    this.sendEvent('clear');
  },
  sendHint: function () {
    if (!this.data.isDrawer || !this._myWord) return;
    this.sendEvent('hint', { hint: this._myWord.charAt(0) + '＿' });
    this.pushFeed('system', '你给了一个提示');
  },

  // ===== 猜词 =====
  onGuessInput: function (e) {
    this.setData({ guessText: e.detail.value });
  },
  submitGuess: function () {
    if (!this.data.canGuess || this.data.isDrawer) return;
    const text = (this.data.guessText || '').trim();
    if (!text) return;
    this.setData({ guessText: '' });
    this.pushFeed('me', '你猜：' + text);
    this.sendEvent('guess', { text: text });
  },

  // ===== 结果/分享 =====
  again: function () {
    if (!this.data.partnerOnline) {
      wx.showToast({ title: '等 TA 上线再开一局', icon: 'none' });
      return;
    }
    this.setData({ stage: 'lobby', showResult: false, roundReveal: '', round: 1, myScore: 0, partnerScore: 0 });
    this.startGame();
  },
  backHome: function () {
    wx.navigateBack({ delta: 1 });
  },

  pushFeed: function (kind, text) {
    const item = { id: 'f' + (++this._feedSeq), kind: kind, text: text };
    const feed = this.data.feed.slice(-18);
    feed.push(item);
    this.setData({ feed: feed, scrollTo: 'feed-' + item.id });
  },

  openShare: function () {
    this.setData({ shareVisible: true });
  },

  closeShare: function () {
    this.setData({ shareVisible: false });
  },

  onShareTap: function () {
    this.setData({ shareVisible: false });
  },

  noop: function () {},

  onShareAppMessage: function () {
    return {
      title: '我画了一张只有你能猜的画，来看看？',
      path: '/packageCouple/pages/draw-guess/draw-guess?from=share',
      imageUrl: '/assets/draw-guess-share.png',
    };
  },

  onShareTimeline: function () {
    return {
      title: '你画我猜 · 只属于我们俩的小画板',
      query: 'from=timeline',
      imageUrl: '/assets/draw-guess-share.png',
    };
  },
});
