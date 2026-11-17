// puzzle.js
Page({
  data: {
    secretCode: [],    // 答案 [1, 5, 2, 3]
    currentInput: [],  // 当前输入
    history: [],
    numsStatus: {},    // 键盘数字状态: {1: true, 5: true} 表示已用
    
    // 游戏状态
    timer: null,
    timeSeconds: 0,
    timeStr: "00:00",
    gameState: 'playing',
    
    hintText: "游戏开始！请选择 4 个数字",
    isError: false,
    showHelpModal: false,
    scrollId: ''
  },

  onLoad() {
    this.restartGame();
  },
  
  onUnload() { this.stopTimer(); },

  restartGame() {
    this.stopTimer();
    const secret = this.generateSecret();
    console.log('Secret:', secret); // 调试用

    this.setData({
      secretCode: secret,
      currentInput: [],
      history: [],
      numsStatus: {},
      timeSeconds: 0,
      timeStr: "00:00",
      gameState: 'playing',
      hintText: "游戏开始！请选择 4 个数字",
      isError: false,
      showHelpModal: false
    });
    this.startTimer();
  },

  generateSecret() {
    let pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let result = [];
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * pool.length);
      result.push(pool[index]);
      pool.splice(index, 1);
    }
    return result;
  },

  // --- 💡 修复后的提示功能 ---
  onUseHint() {
    if (this.data.gameState !== 'playing') return;
    
    const { currentInput, secretCode, numsStatus } = this.data;

    // 1. 如果已经填满了，无法提示
    if (currentInput.length >= 4) {
      this.triggerError("请先删除或提交当前数字");
      return;
    }

    // 2. 核心逻辑：找出当前需要填写的那个位置的正确答案
    // 例如 currentInput 是 [1, 2]，长度为2，下一个位置索引是2
    const nextIndex = currentInput.length;
    const correctNum = secretCode[nextIndex];

    // 3. 检查这个数字是否已经被用户在前面误用了
    // (虽然1A2B逻辑里通常不重复，但为了代码健壮性)
    if (numsStatus[correctNum]) {
      // 这种情况比较少见，说明用户前面猜错了位置且用了后面的数字
      // 这里我们可以选择强制填入，或者提示用户
      // 为了体验流畅，我们直接填入
    }

    // 4. 执行填入
    const newInput = [...currentInput, correctNum];
    const newStatus = { ...numsStatus, [correctNum]: true };

    this.setData({
      currentInput: newInput,
      numsStatus: newStatus,
      hintText: `已自动填入数字 ${correctNum}`
    });
    
    // 提示震动
    wx.vibrateShort({ type: 'light' });
  },

  // --- 键盘交互 ---
  onTapKey(e) {
    if (this.data.gameState !== 'playing') return;
    
    const val = parseInt(e.currentTarget.dataset.val);
    const { currentInput, numsStatus } = this.data;

    // 禁用已选数字 或 已满
    if (numsStatus[val] || currentInput.length >= 4) return;

    // 正常输入不震动
    const newInput = [...currentInput, val];
    const newStatus = { ...numsStatus, [val]: true };
    
    let txt = "请继续选择";
    if (newInput.length === 4) txt = "点击 OK 确认答案";

    this.setData({
      currentInput: newInput,
      numsStatus: newStatus,
      hintText: txt
    });
  },

  onDelete() {
    if (this.data.currentInput.length === 0) return;
    
    const { currentInput, numsStatus } = this.data;
    const removedNum = currentInput[currentInput.length - 1];
    
    const newInput = currentInput.slice(0, -1);
    const newStatus = { ...numsStatus };
    delete newStatus[removedNum]; // 释放该数字

    this.setData({
      currentInput: newInput,
      numsStatus: newStatus,
      hintText: "删除一位",
      isError: false
    });
  },

  onConfirm() {
    const { currentInput, secretCode, history } = this.data;

    if (currentInput.length !== 4) {
      this.triggerError("请填满 4 个数字");
      wx.vibrateShort({ type: 'medium' });
      return;
    }

    let A = 0, B = 0;
    currentInput.forEach((num, index) => {
      if (num === secretCode[index]) A++;
      else if (secretCode.includes(num)) B++;
    });

    const newHistory = [...history, { guess: currentInput, a: A, b: B }];
    
    this.setData({
      history: newHistory,
      currentInput: [],
      numsStatus: {}, // 重置键盘
      scrollId: 'scroll-bottom'
    });

    if (A === 4) {
      this.stopTimer();
      wx.vibrateLong(); // 胜利长震动
      this.setData({ gameState: 'won', hintText: "太棒了！" });
    } else {
      wx.vibrateShort({ type: 'medium' }); // 错误短震动
      this.setData({ hintText: "没猜对，再试一次" });
    }
  },

  triggerError(msg) {
    this.setData({ isError: true, hintText: msg });
    setTimeout(() => { this.setData({ isError: false }); }, 400);
  },

  startTimer() {
    this.data.timer = setInterval(() => {
      const s = this.data.timeSeconds + 1;
      const mins = Math.floor(s / 60).toString().padStart(2, '0');
      const secs = (s % 60).toString().padStart(2, '0');
      this.setData({ timeSeconds: s, timeStr: `${mins}:${secs}` });
    }, 1000);
  },

  stopTimer() {
    if (this.data.timer) { clearInterval(this.data.timer); this.data.timer = null; }
  },

  showHelp() { this.setData({ showHelpModal: true }); },
  closeHelp() { this.setData({ showHelpModal: false }); },
  get secretCodeStr() { return this.data.secretCode.join(' '); },


    onShareAppMessage() {
    return { title: '做选择很难，所以我们总在试错中找到答案', path: 'packagepdf/pages/puzzle/puzzle' };
  },

  onShareTimeline() {
    return {
      title: '做选择很难，所以我们总在试错中找到答案',
      query: 'id=share', // 点击朋友圈进入时带的参数
      path: '/pages/puzzle/puzzle'
    };
  },


});