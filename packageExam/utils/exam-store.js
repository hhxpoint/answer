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


// ---------------- 申论：草稿 / 计时 / 自评 ----------------
const K_ESSAY = 'exam:essay:draft:';

/** 草稿：{ tab, qIndex, answers:{qNo:text}, startedAt, elapsedMs, checked:{qNo:[idx]} } */
function getEssayDraft(key) {
  const d = read(K_ESSAY + key, null);
  return d || { tab: 0, qIndex: 0, answers: {}, startedAt: 0, elapsedMs: 0, checked: {} };
}

function saveEssayDraft(key, draft) {
  draft.updatedAt = Date.now();
  write(K_ESSAY + key, draft);
}

function resetEssayDraft(key) {
  try { wx.removeStorageSync(K_ESSAY + key); } catch (e) { /* ignore */ }
}

/** 自评得分：勾选的要点分值之和（按要点数均分题目分值） */
function scoreEssay(question, checkedIdx) {
  const pts = question.keyPoints || [];
  if (!pts.length) return 0;
  const total = Number(question.score) || 0;
  const each = total / pts.length;
  return Math.round(each * (checkedIdx || []).length * 10) / 10;
}

/** 作答结构检查（规则，不涉及生成） */
function inspectAnswer(text, question) {
  const t = String(text || '');
  const chars = t.replace(/\s/g, '').length;
  const lines = t.split(/\n+/).filter(function (x) { return x.trim(); });
  const hasEnum = /(^|\n)\s*([0-9]{1,2}[.、]|[一二三四五六七八九十][、.]|[①②③④⑤⑥⑦⑧⑨⑩])/.test(t);
  const refMat = /资料|材料/.test(t);
  const max = Number(question.wordMax) || 0;
  const min = Number(question.wordMin) || 0;
  return {
    chars: chars,
    lines: lines.length,
    hasEnum: hasEnum,
    refMat: refMat,
    overLimit: max > 0 && chars > max,
    underLimit: min > 0 && chars < min,
    empty: chars === 0
  };
}
module.exports = {
  getProgress: getProgress,
  saveProgress: saveProgress,
  recordAnswer: recordAnswer,
  getStats: getStats,
  resetPaper: resetPaper,
  getEssayDraft: getEssayDraft,
  saveEssayDraft: saveEssayDraft,
  resetEssayDraft: resetEssayDraft,
  scoreEssay: scoreEssay,
  inspectAnswer: inspectAnswer
};
