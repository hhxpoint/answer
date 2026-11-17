// // pages/hash/hash.js
// const HashGame = require('../../utils/hashGame.js');

// Page({
//   data: {
//     board: [],         
//     solution: [],      
//     selectedIdx: -1,   
//     difficulty: 'easy',
//     aiMessage: '请自己尝试解题，若卡关可点击下方“AI演示”',
//     isAiPlaying: false,
    
//     // 计时器相关
//     timeElapsed: 0,
//     formattedTime: '00:00:00',
//     gameTimerId: null,
//     aiTimerId: null
//   },

//   onLoad() {
//     this.initGame('easy');
//   },

//   onUnload() {
//     this.stopAi();
//     this.stopGameTimer();
//   },

//   // 1. 游戏初始化与计时器
//   initGame(difficulty) {
//     this.stopAi();
//     this.stopGameTimer();
    
//     wx.showLoading({ title: '生成中...' });
    
//     setTimeout(() => {
//       let { puzzle, solution } = HashGame.generatePuzzle(difficulty);
      
//       let board1D = [];
//       let solution1D = [];
//       for (let r = 0; r < 9; r++) {
//         for (let c = 0; c < 9; c++) {
//           board1D.push({
//             r, c,
//             val: puzzle[r][c],
//             type: puzzle[r][c] !== 0 ? 'fixed' : 'empty' 
//           });
//           solution1D.push(solution[r][c]);
//         }
//       }

//       this.setData({
//         board: board1D,
//         solution: solution1D,
//         selectedIdx: -1,
//         difficulty: difficulty,
//         aiMessage: '请自己尝试解题，若卡关可点击下方“AI演示”',
//         isAiPlaying: false,
//         timeElapsed: 0,
//         formattedTime: '00:00:00'
//       });
//       wx.hideLoading();
      
//       // 开始计时
//       this.startGameTimer();
//     }, 100);
//   },

//   // --- 计时器逻辑 ---
//   startGameTimer() {
//     this.data.gameTimerId = setInterval(() => {
//       let sec = this.data.timeElapsed + 1;
//       let h = String(Math.floor(sec / 3600)).padStart(2, '0');
//       let m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
//       let s = String(sec % 60).padStart(2, '0');
      
//       this.setData({
//         timeElapsed: sec,
//         formattedTime: `${h}:${m}:${s}`
//       });
//     }, 1000);
//   },

//   stopGameTimer() {
//     if (this.data.gameTimerId) {
//       clearInterval(this.data.gameTimerId);
//     }
//   },

//   // 2. 玩家操作
//   changeDifficulty(e) {
//     if (this.data.isAiPlaying) return;
//     let diff = e.currentTarget.dataset.diff;
//     this.initGame(diff);
//   },

//   selectCell(e) {
//     if (this.data.isAiPlaying) return;
//     let idx = e.currentTarget.dataset.idx;
//     if (this.data.board[idx].type === 'fixed') return;
//     this.setData({ selectedIdx: idx });
//   },

//   inputNumber(e) {
//     if (this.data.isAiPlaying || this.data.selectedIdx === -1) return;
    
//     let num = e.currentTarget.dataset.num;
//     let idx = this.data.selectedIdx;
//     let board = this.data.board;

//     if (num === 'C') { 
//       board[idx].val = 0;
//       board[idx].type = 'empty';
//     } else {
//       board[idx].val = num;
//       if (num === this.data.solution[idx]) {
//         board[idx].type = 'user';
//       } else {
//         board[idx].type = 'error'; // 填错标红
//       }
//     }
//     this.setData({ board });
//     this.checkWin();
//   },

//   // 3. AI 逻辑 (核心改造点：开关控制与纠错)
//   toggleAi() {
//     if (this.data.isAiPlaying) {
//       // 如果正在运行，则中断 AI
//       this.stopAi();
//       this.setData({ aiMessage: '⏸ AI已暂停，你可以继续作答。' });
//     } else {
//       // 启动 AI
//       this.setData({ 
//         isAiPlaying: true, 
//         selectedIdx: -1,
//         aiMessage: '🤖 AI已接管，正在分析盘面...'
//       });
//       this.data.aiTimerId = setInterval(() => {
//         this.doAiStep();
//       }, 1500);
//     }
//   },

//   stopAi() {
//     if (this.data.aiTimerId) {
//       clearInterval(this.data.aiTimerId);
//     }
//     this.setData({ isAiPlaying: false });
//   },

//   doAiStep() {
//     let board = this.data.board;

//     // ✨ 新增逻辑：AI 第一步先查错！
//     // 遍历盘面，看看有没有玩家填错的格子 (type === 'error')
//     for (let i = 0; i < board.length; i++) {
//       if (board[i].type === 'error') {
//         let correctVal = this.data.solution[i];
//         board[i].val = correctVal;
//         board[i].type = 'ai'; // 纠正后变成 AI 颜色

//         this.setData({
//           board: board,
//           selectedIdx: i,
//           aiMessage: `🚨 发现错误：第${board[i].r + 1}行第${board[i].c + 1}列填错了，AI已强制修正为正确的【${correctVal}】。`
//         });
//         this.checkWin();
//         return; // 纠错一次就结束当前回合
//       }
//     }

//     // 如果没有错误，执行正常的 AI 推导
//     let current2D = Array.from({ length: 9 }, () => Array(9).fill(0));
//     let solution2D = Array.from({ length: 9 }, () => Array(9).fill(0));
    
//     board.forEach((cell, i) => {
//       current2D[cell.r][cell.c] = cell.val; 
//       solution2D[cell.r][cell.c] = this.data.solution[i];
//     });

//     let step = HashGame.getAiNextStep(current2D, solution2D);

//     if (!step) {
//       this.stopAi();
//       return;
//     }

//     let idx = step.r * 9 + step.c;
//     board[idx].val = step.val;
//     board[idx].type = 'ai'; 

//     this.setData({
//       board: board,
//       aiMessage: step.reason,
//       selectedIdx: idx 
//     });

//     this.checkWin();
//   },


//   onShareAppMessage() {
//     return { title: '世界灿烂盛大，欢迎来到哈希宇宙', path: '/pages/hash/hash' };
//   },

//   onShareTimeline() {
//     return {
//       title: '世界灿烂盛大，欢饮来到哈希宇宙',
//       query: 'id=share', // 点击朋友圈进入时带的参数
//       imageUrl: '/assets/banner2.png' // 朋友圈显示的配图
//     };
//   },




//   checkWin() {
//     let isWin = this.data.board.every((cell, i) => cell.val === this.data.solution[i]);
//     if (isWin) {
//       this.stopAi();
//       this.stopGameTimer(); // 停止计时
//       setTimeout(() => {
//         wx.showModal({
//           title: '🎉 挑战成功！',
//           content: `恭喜你完成了解答！\n总耗时：${this.data.formattedTime}`,
//           showCancel: false,
//           confirmText: '太棒了'
//         });
//       }, 500);
//     }
//   }
// });



// pages/hash/hash.js
const HashGame = require('../../utils/hashGame.js');

Page({
  data: {
    board: [],         
    solution: [],      
    selectedIdx: -1,   
    difficulty: 'easy',
    aiMessage: '请自己尝试解题，若卡关可点击下方“AI演示”',
    isAiPlaying: false,
    
    // ✨ 新增：是否处于草稿（待选）模式
    isDraftMode: false, 
    
    // 计时器相关
    timeElapsed: 0,
    formattedTime: '00:00:00',
    gameTimerId: null,
    aiTimerId: null
  },

  onLoad() {
    this.initGame('easy');
  },

  onUnload() {
    this.stopAi();
    this.stopGameTimer();
  },

  initGame(difficulty) {
    this.stopAi();
    this.stopGameTimer();
    
    wx.showLoading({ title: '生成中...' });
    
    setTimeout(() => {
      let { puzzle, solution } = HashGame.generatePuzzle(difficulty);
      
      let board1D = [];
      let solution1D = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          board1D.push({
            r, c,
            val: puzzle[r][c],
            type: puzzle[r][c] !== 0 ? 'fixed' : 'empty',
            notes: [] // ✨ 新增：每个格子自带一个笔记数组
          });
          solution1D.push(solution[r][c]);
        }
      }

      this.setData({
        board: board1D,
        solution: solution1D,
        selectedIdx: -1,
        difficulty: difficulty,
        aiMessage: '请自己尝试解题，若卡关可点击下方“AI演示”',
        isAiPlaying: false,
        isDraftMode: false, // ✨ 新增：初始化时关闭草稿模式
        timeElapsed: 0,
        formattedTime: '00:00:00'
      });
      wx.hideLoading();
      this.startGameTimer();
    }, 100);
  },

  startGameTimer() {
    this.data.gameTimerId = setInterval(() => {
      let sec = this.data.timeElapsed + 1;
      let h = String(Math.floor(sec / 3600)).padStart(2, '0');
      let m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      let s = String(sec % 60).padStart(2, '0');
      
      this.setData({
        timeElapsed: sec,
        formattedTime: `${h}:${m}:${s}`
      });
    }, 1000);
  },

  stopGameTimer() {
    if (this.data.gameTimerId) {
      clearInterval(this.data.gameTimerId);
    }
  },

  changeDifficulty(e) {
    if (this.data.isAiPlaying) return;
    let diff = e.currentTarget.dataset.diff;
    this.initGame(diff);
  },

  selectCell(e) {
    if (this.data.isAiPlaying) return;
    let idx = e.currentTarget.dataset.idx;
    if (this.data.board[idx].type === 'fixed') return;
    
    // ✨ 点击格子时，如果之前被标红了，说明是填满后找出的错误，现在重新点击让它恢复正常状态
    let board = this.data.board;
    if (board[idx].type === 'error') {
      board[idx].type = 'user';
      this.setData({ board });
    }
    
    this.setData({ selectedIdx: idx });
  },

  // ✨ 新增：切换草稿模式
  toggleDraftMode() {
    this.setData({ isDraftMode: !this.data.isDraftMode });
  },

  // ✨ 修改：区分草稿输入和正常输入，取消即时判错
  inputNumber(e) {
    if (this.data.isAiPlaying || this.data.selectedIdx === -1) return;
    
    let num = e.currentTarget.dataset.num;
    let idx = this.data.selectedIdx;
    let board = this.data.board;

    if (this.data.isDraftMode) {
      // --- 草稿模式逻辑 ---
      if (num === 'C') { 
        board[idx].notes = []; // 清空草稿
      } else {
        board[idx].val = 0; // 只要做笔记，就清空原本的大字
        board[idx].type = 'empty';
        
        // 检查草稿中是否已有该数字，有则删，无则加
        let noteIdx = board[idx].notes.indexOf(num);
        if (noteIdx > -1) {
          board[idx].notes.splice(noteIdx, 1); 
        } else {
          board[idx].notes.push(num);
          board[idx].notes.sort(); // 保持 1-9 顺序
        }
      }
    } else {
      // --- 正常输入模式 ---
      if (num === 'C') { 
        board[idx].val = 0;
        board[idx].type = 'empty';
        board[idx].notes = []; 
      } else {
        board[idx].val = num;
        board[idx].type = 'user'; // 直接记录为用户输入，不马上判错
        board[idx].notes = [];    // 填入确定的数字时，清空该格草稿
      }
    }

    this.setData({ board });
    
    // 如果是正常填入，且没有空格了，才去判断输赢
    if (!this.data.isDraftMode && num !== 'C') {
      this.checkWin();
    }
  },

  // ✨ 修改：判定逻辑改为“满格后再统一判错”
  checkWin() {
    let board = this.data.board;
    
    // 1. 先检查是不是全都填满了 (没有0)
    let isFull = board.every(cell => cell.val !== 0);
    if (!isFull) return; // 没填满，不判错

    // 2. 填满了，开始统一核对
    let isWin = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i].val !== this.data.solution[i]) {
        isWin = false;
        board[i].type = 'error'; // 发现错误，全部标红
      }
    }

    this.setData({ board });

    if (isWin) {
      this.stopAi();
      this.stopGameTimer();
      setTimeout(() => {
        wx.showModal({
          title: '🎉 挑战成功！',
          content: `恭喜你完成了解答！\n总耗时：${this.data.formattedTime}`,
          showCancel: false,
          confirmText: '太棒了'
        });
      }, 500);
    } else {
      wx.showToast({
        title: '哎呀有错误，请检查标红的格子',
        icon: 'none',
        duration: 2500
      });
    }
  },

  toggleAi() {
    if (this.data.isAiPlaying) {
      this.stopAi();
      this.setData({ aiMessage: '⏸ AI已暂停，你可以继续作答。' });
    } else {
      this.setData({ 
        isAiPlaying: true, 
        selectedIdx: -1,
        isDraftMode: false, // 启动AI时强制关掉草稿模式
        aiMessage: '🤖 AI已接管，正在分析盘面...'
      });
      this.data.aiTimerId = setInterval(() => {
        this.doAiStep();
      }, 1500);
    }
  },

  stopAi() {
    if (this.data.aiTimerId) {
      clearInterval(this.data.aiTimerId);
    }
    this.setData({ isAiPlaying: false });
  },

  doAiStep() {
    let board = this.data.board;

    // ✨ 修改：AI 第一步查错。因为现在不即时标红了，AI需要自己去和solution对比来找错
    for (let i = 0; i < board.length; i++) {
      // 如果格子填了值，但不是正确答案
      if (board[i].val !== 0 && board[i].val !== this.data.solution[i]) {
        let correctVal = this.data.solution[i];
        board[i].val = correctVal;
        board[i].type = 'ai'; 
        board[i].notes = []; // 清空该格草稿

        this.setData({
          board: board,
          selectedIdx: i,
          aiMessage: `🚨 发现错误：第${board[i].r + 1}行第${board[i].c + 1}列填错了，AI已强制修正为正确的【${correctVal}】。`
        });
        this.checkWin();
        return; 
      }
    }

    let current2D = Array.from({ length: 9 }, () => Array(9).fill(0));
    let solution2D = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    board.forEach((cell, i) => {
      current2D[cell.r][cell.c] = cell.val; 
      solution2D[cell.r][cell.c] = this.data.solution[i];
    });

    let step = HashGame.getAiNextStep(current2D, solution2D);

    if (!step) {
      this.stopAi();
      return;
    }

    let idx = step.r * 9 + step.c;
    board[idx].val = step.val;
    board[idx].type = 'ai'; 
    board[idx].notes = []; // AI填入也清空草稿

    this.setData({
      board: board,
      aiMessage: step.reason,
      selectedIdx: idx 
    });

    this.checkWin();
  },

  onShareAppMessage() {
    return { title: '世界灿烂盛大，欢迎来到哈希宇宙', path: 'packagepdf/pages/hash/hash' };
  },

  onShareTimeline() {
    return {
      title: '世界灿烂盛大，欢饮来到哈希宇宙',
      query: 'id=share',
      imageUrl: '/assets/banner2.png'
    };
  }
});