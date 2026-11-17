




// pages/lab/lab.js
import { SliderGame } from '../../utils/num.js';

Page({
  data: {
    size: 3,
    board: [],
    steps: 0,
    isWin: false,
    
    // 计时相关
    timeStr: '00:00.00', // 修改点 1：初始加上毫秒位
    seconds: 0,
    isPlaying: false // 是否开始计时的标志位
  },

  gameInstance: null,
  timer: null,
  startTime: 0, // 修改点 2：新增变量记录真实的物理开始时间

  onLoad() {
    this.initGame(this.data.size);
  },

  // 页面隐藏或卸载时清理定时器
  onHide() { this.stopTimer(); },
  onUnload() { this.stopTimer(); },

  initGame(size) {
    this.stopTimer(); // 重置先停掉定时器
    this.gameInstance = new SliderGame(size);
    const newBoard = this.gameInstance.init();
    
    this.setData({
      size: size,
      board: [...newBoard],
      steps: 0,
      isWin: false,
      timeStr: '00:00.00', // 修改点 3：重置时也加上毫秒位
      seconds: 0,
      isPlaying: false
    });
  },

  // 切换难度
  changeSize(e) {
    const newSize = parseInt(e.currentTarget.dataset.size);
    if (newSize !== this.data.size) {
      this.initGame(newSize);
    }
  },

  // 重新开始
  restart() {
    this.initGame(this.data.size);
  },

  // 点击方块
  onTapTile(e) {
    if (this.data.isWin) return; 

    const index = e.currentTarget.dataset.index;
    const moved = this.gameInstance.move(index);

    if (moved) {
      // 第一次成功移动时开始计时
      if (!this.data.isPlaying) {
        this.startTimer();
      }

      const isWin = this.gameInstance.checkWin();
      this.setData({
        board: [...this.gameInstance.board],
        steps: this.data.steps + 1,
        isWin: isWin
      });

      if (isWin) {
        this.stopTimer();
      }
    }
  },

  // 开始计时 (核心修改点 4：改为高频刷新和时间戳计算)
  startTimer() {
    this.setData({ isPlaying: true });
    this.startTime = Date.now(); // 记录此刻的物理时间戳

    this.timer = setInterval(() => {
      let msElapsed = Date.now() - this.startTime; // 计算已经过去的毫秒数
      this.setData({
        timeStr: this.formatTime(msElapsed) // 传入毫秒去格式化
      });
    }, 50); // 改为 50 毫秒执行一次，实现疯狂跳动效果
  },

  // 停止计时
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  onShareAppMessage() {
    return { title: '蝴蝶飞过沧海，而你就是混沌世界唯一的魔法师', path: 'packagepdf/pages/lab/lab' };
  },

  onShareTimeline() {
    return {
      title: '蝴蝶飞过沧海，而你就是混沌世界唯一的魔法师',
      query: 'id=share', // 点击朋友圈进入时带的参数
      imageUrl: '/assets/banner2.png' // 朋友圈显示的配图
    };
  },

  // 格式化时间为 MM:SS.xx (核心修改点 5)
  formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let m = Math.floor(totalSeconds / 60);
    let s = totalSeconds % 60;
    // 取毫秒的两位数 (00 - 99)
    let cs = Math.floor((ms % 1000) / 10); 

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    cs = cs < 10 ? '0' + cs : cs;
    return `${m}:${s}.${cs}`;
  }

});