const sportApi = require('../../utils/sportApi.js');

// 成就定义
const ACHIEVEMENTS = [
  // ===== 距离累计成就 =====
  { id: 'd1', name: '初出茅庐', desc: '累计跑步1公里', icon: '🌱', category: 'distance', type: 'totalDistance', target: 1000 },
  { id: 'd2', name: '小试牛刀', desc: '累计跑步10公里', icon: '🌿', category: 'distance', type: 'totalDistance', target: 10000 },
  { id: 'd3', name: '渐入佳境', desc: '累计跑步50公里', icon: '🌳', category: 'distance', type: 'totalDistance', target: 50000 },
  { id: 'd4', name: '百公里人', desc: '累计跑步100公里', icon: '🏅', category: 'distance', type: 'totalDistance', target: 100000 },
  { id: 'd5', name: '马拉松之心', desc: '累计跑步42.195公里', icon: '🎖', category: 'distance', type: 'totalDistance', target: 42195 },
  { id: 'd6', name: '千里之行', desc: '累计跑步500公里', icon: '🏆', category: 'distance', type: 'totalDistance', target: 500000 },
  { id: 'd7', name: '万公里征途', desc: '累计跑步1000公里', icon: '👑', category: 'distance', type: 'totalDistance', target: 1000000 },

  // ===== 单次距离成就 =====
  { id: 's1', name: '5K完赛', desc: '单次跑步5公里', icon: '⭐', category: 'single', type: 'singleDistance', target: 5000 },
  { id: 's2', name: '10K达人', desc: '单次跑步10公里', icon: '🌟', category: 'single', type: 'singleDistance', target: 10000 },
  { id: 's3', name: '半马勇士', desc: '单次跑步21.1公里', icon: '💫', category: 'single', type: 'singleDistance', target: 21097 },
  { id: 's4', name: '全马英雄', desc: '单次跑步42.195公里', icon: '🦸', category: 'single', type: 'singleDistance', target: 42195 },

  // ===== 配速成就 =====
  { id: 'p1', name: '稳步前进', desc: '配速突破7分钟/km', icon: '🐢', category: 'pace', type: 'bestPace', target: 7 },
  { id: 'p2', name: '速度达人', desc: '配速突破6分钟/km', icon: '🐇', category: 'pace', type: 'bestPace', target: 6 },
  { id: 'p3', name: '疾风奔跑', desc: '配速突破5分钟/km', icon: '🦅', category: 'pace', type: 'bestPace', target: 5 },
  { id: 'p4', name: '闪电飞人', desc: '配速突破4分30秒/km', icon: '⚡', category: 'pace', type: 'bestPace', target: 4.5 },
  { id: 'p5', name: '破四传奇', desc: '配速突破4分钟/km', icon: '🔥', category: 'pace', type: 'bestPace', target: 4 },
  { id: 'p6', name: '极速之王', desc: '配速突破3分30秒/km', icon: '💨', category: 'pace', type: 'bestPace', target: 3.5 },

  // ===== 次数成就 =====
  { id: 'c1', name: '运动新手', desc: '完成第1次运动', icon: '🎯', category: 'count', type: 'totalCount', target: 1 },
  { id: 'c2', name: '小有成就', desc: '完成10次运动', icon: '🎪', category: 'count', type: 'totalCount', target: 10 },
  { id: 'c3', name: '坚持不懈', desc: '完成50次运动', icon: '💪', category: 'count', type: 'totalCount', target: 50 },
  { id: 'c4', name: '百次达人', desc: '完成100次运动', icon: '🦸‍♂️', category: 'count', type: 'totalCount', target: 100 },
  { id: 'c5', name: '运动狂人', desc: '完成200次运动', icon: '🦾', category: 'count', type: 'totalCount', target: 200 },
  { id: 'c6', name: '传说级别', desc: '完成500次运动', icon: '🧬', category: 'count', type: 'totalCount', target: 500 },

  // ===== 连续天数成就 =====
  { id: 'l1', name: '三天之约', desc: '连续运动3天', icon: '📅', category: 'streak', type: 'streak', target: 3 },
  { id: 'l2', name: '周冠军', desc: '连续运动7天', icon: '📆', category: 'streak', type: 'streak', target: 7 },
  { id: 'l3', name: '半月战士', desc: '连续运动15天', icon: '🗓', category: 'streak', type: 'streak', target: 15 },
  { id: 'l4', name: '月度传奇', desc: '连续运动30天', icon: '🏅', category: 'streak', type: 'streak', target: 30 },
  { id: 'l5', name: '季度王者', desc: '连续运动90天', icon: '👑', category: 'streak', type: 'streak', target: 90 },

  // ===== 卡路里成就 =====
  { id: 'k1', name: '燃脂开始', desc: '累计消耗1000千卡', icon: '🔥', category: 'calorie', type: 'totalCalorie', target: 1000 },
  { id: 'k2', name: '热量克星', desc: '累计消耗5000千卡', icon: '💥', category: 'calorie', type: 'totalCalorie', target: 5000 },
  { id: 'k3', name: '卡路里猎人', desc: '累计消耗10000千卡', icon: '🎯', category: 'calorie', type: 'totalCalorie', target: 10000 },
  { id: 'k4', name: '燃烧大师', desc: '累计消耗50000千卡', icon: '🔥', category: 'calorie', type: 'totalCalorie', target: 50000 },

  // ===== 时长成就 =====
  { id: 't1', name: '时间旅行者', desc: '累计运动1小时', icon: '⏰', category: 'duration', type: 'totalDuration', target: 3600 },
  { id: 't2', name: '持久战士', desc: '累计运动10小时', icon: '⏳', category: 'duration', type: 'totalDuration', target: 36000 },
  { id: 't3', name: '时间大师', desc: '累计运动50小时', icon: '🕐', category: 'duration', type: 'totalDuration', target: 180000 },
  { id: 't4', name: '永恒奔跑', desc: '累计运动100小时', icon: '⌚', category: 'duration', type: 'totalDuration', target: 360000 },

  // ===== 特殊成就 =====
  { id: 'e1', name: '早起鸟儿', desc: '早上6点前完成运动', icon: '🌅', category: 'special', type: 'earlyBird', target: 1 },
  { id: 'e2', name: '夜跑达人', desc: '晚上10点后完成运动', icon: '🌙', category: 'special', type: 'nightOwl', target: 1 },
  { id: 'e3', name: '周末战士', desc: '周末完成10次运动', icon: '🎉', category: 'special', type: 'weekend', target: 10 },
  { id: 'e4', name: '全能选手', desc: '完成跑步/步行/骑行各一次', icon: '🏅', category: 'special', type: 'allTypes', target: 1 },
];

Page({
  data: {
    achievements: [],
    categories: [
      { key: 'all', name: '全部' },
      { key: 'distance', name: '距离' },
      { key: 'pace', name: '配速' },
      { key: 'count', name: '次数' },
      { key: 'streak', name: '连续' },
      { key: 'special', name: '特殊' }
    ],
    currentCategory: 'all',
    unlockedCount: 0,
    totalCount: ACHIEVEMENTS.length
  },

  onLoad() {
    this.loadAchievements();
  },

  onShow() {
    this.loadAchievements();
  },

  loadAchievements() {
    const history = sportApi.getSportHistory();
    const stats = this.calculateStats(history);
    const achievements = this.checkAchievements(stats, history);
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    this.setData({
      achievements,
      unlockedCount
    });
  },

  calculateStats(history) {
    const totalDistance = history.reduce((sum, r) => sum + (r.distance || 0), 0);
    const totalCount = history.length;
    const totalCalorie = history.reduce((sum, r) => sum + (r.calories || 0), 0);
    const totalDuration = history.reduce((sum, r) => sum + (r.duration || 0), 0);
    const maxSingleDistance = history.length > 0 ? Math.max(...history.map(r => r.distance || 0)) : 0;

    // 计算最好配速
    let bestPace = Infinity;
    history.forEach(r => {
      if (r.distance >= 1000) {
        const pace = sportApi.calculatePace(r.distance, r.duration);
        if (pace < bestPace && pace > 0) bestPace = pace;
      }
    });

    // 计算连续天数
    const streak = this.calculateStreak(history);

    // 检查特殊成就
    const hasEarlyBird = history.some(r => new Date(r.createTime).getHours() < 6);
    const hasNightOwl = history.some(r => new Date(r.createTime).getHours() >= 22);
    const weekendCount = history.filter(r => {
      const day = new Date(r.createTime).getDay();
      return day === 0 || day === 6;
    }).length;
    const hasAllTypes = ['RUN', 'WALK', 'CYCLE'].every(type => 
      history.some(r => r.type === type)
    );

    return {
      totalDistance,
      totalCount,
      totalCalorie,
      totalDuration,
      maxSingleDistance,
      bestPace: bestPace === Infinity ? 0 : bestPace,
      streak,
      hasEarlyBird,
      hasNightOwl,
      weekendCount,
      hasAllTypes
    };
  },

  calculateStreak(history) {
    if (history.length === 0) return 0;

    const dates = [...new Set(history.map(r => {
      const d = new Date(r.createTime);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))].sort().reverse();

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    if (dates[0] !== todayStr) return 0;

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev - curr) / (24 * 60 * 60 * 1000);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  },

  checkAchievements(stats, history) {
    return ACHIEVEMENTS.map(a => {
      let current = 0;
      let unlocked = false;

      switch (a.type) {
        case 'totalDistance':
          current = stats.totalDistance;
          unlocked = current >= a.target;
          break;
        case 'singleDistance':
          current = stats.maxSingleDistance;
          unlocked = current >= a.target;
          break;
        case 'bestPace':
          current = stats.bestPace;
          unlocked = current > 0 && current <= a.target;
          break;
        case 'totalCount':
          current = stats.totalCount;
          unlocked = current >= a.target;
          break;
        case 'streak':
          current = stats.streak;
          unlocked = current >= a.target;
          break;
        case 'totalCalorie':
          current = stats.totalCalorie;
          unlocked = current >= a.target;
          break;
        case 'totalDuration':
          current = stats.totalDuration;
          unlocked = current >= a.target;
          break;
        case 'earlyBird':
          unlocked = stats.hasEarlyBird;
          current = unlocked ? 1 : 0;
          break;
        case 'nightOwl':
          unlocked = stats.hasNightOwl;
          current = unlocked ? 1 : 0;
          break;
        case 'weekend':
          current = stats.weekendCount;
          unlocked = current >= a.target;
          break;
        case 'allTypes':
          unlocked = stats.hasAllTypes;
          current = unlocked ? 1 : 0;
          break;
      }

      let progress = 0;
      if (unlocked) {
        progress = 100;
      } else if (a.target > 0) {
        if (a.type === 'bestPace') {
          progress = current > 0 ? Math.min(100, (a.target / current) * 100) : 0;
        } else {
          progress = Math.min(100, (current / a.target) * 100);
        }
      }
      progress = isNaN(progress) || !isFinite(progress) ? 0 : Math.round(progress);
      const progressText = unlocked ? '已达成' : progress + '%';

      return { ...a, current, unlocked, progress, progressText };
    });
  },

  switchCategory(e) {
    this.setData({ currentCategory: e.currentTarget.dataset.key });
  },

  goBack() {
    wx.navigateBack();
  },

  // 分享给朋友
  onShareAppMessage() {
    const { unlockedCount, totalCount } = this.data;
    return {
      title: `🏆 我已在酸奶运动解锁${unlockedCount}/${totalCount}个成就，快来挑战我吧！`,
      path: '/packageSport/pages/achievements/achievements'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { unlockedCount } = this.data;
    return {
      title: unlockedCount > 0 
        ? `🏆 已解锁${unlockedCount}个运动成就，每一步都是勋章`
        : '🏆 酸奶运动 - 解锁属于你的运动勋章'
    };
  }
});
