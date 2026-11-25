/**
 * 公考题库 · 本地进度层
 *
 * 不依赖服务端：作答记录、进度、连续天数都存在本机。
 * 键：exam:progress:<paperKey>  exam:stats
 */
const K_PROGRESS = 'exam:progress:';
const K_STATS = 'exam:stats';

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function read(key, def) {
  try {
    const v = wx.getStorageSync(key);
    return v || def;
  } catch (e) {
    return def;
  }
}

function write(key, v) {
  try {
    wx.setStorageSync(key, v);
  } catch (e) {
    // ignore
  }
}

/** 单卷进度：{ answers: { qid: {pick, correct} }, idx, updatedAt } */
function getProgress(paperKey) {
  const p = read(K_PROGRESS + paperKey, null);
  return p || { answers: {}, idx: 0, updatedAt: 0 };
}

function saveProgress(paperKey, progress) {
  progress.updatedAt = Date.now();
  write(K_PROGRESS + paperKey, progress);
}

/** 记录一次作答，同时累计当日统计 */
function recordAnswer(paperKey, qid, pick, correct) {
  const p = getProgress(paperKey);
  const prev = p.answers[qid];
  p.answers[qid] = { pick: pick, correct: !!correct };
  saveProgress(paperKey, p);

  const stats = getStats();
  if (!prev) {
    stats.total += 1;
    stats.correct += correct ? 1 : 0;
    const t = today();
    if (stats.day !== t) {
      // 新的一天：结算连续天数
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yKey = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
      stats.streak = stats.day === yKey ? (stats.streak || 0) + 1 : 1;
      stats.day = t;
      stats.todayCount = 0;
    }
    stats.todayCount += 1;
    write(K_STATS, stats);
  } else if (prev.correct !== correct) {
    // 重做改判：修正累计
    stats.correct += correct ? 1 : -1;
    write(K_STATS, stats);
  }
  return p;
}

function getStats() {
  const s = read(K_STATS, null);
  const base = { total: 0, correct: 0, todayCount: 0, streak: 0, day: today() };
  if (!s) return base;
  if (s.day !== today()) {
    // 跨天但还没做题：今日计数归零，streak 在首次作答时才结算
    s.todayCount = 0;
    s.day = today();
    write(K_STATS, s);
  }
  return Object.assign(base, s);
}

/** 清空某卷进度 */
function resetPaper(paperKey) {
  try {
    wx.removeStorageSync(K_PROGRESS + paperKey);
  } catch (e) {
    // ignore
  }
}

module.exports = {
  getProgress: getProgress,
  saveProgress: saveProgress,
  recordAnswer: recordAnswer,
  getStats: getStats,
  resetPaper: resetPaper
};
