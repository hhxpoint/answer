/**
 * 公考题库 · 本地进度层（按账号隔离 + 旧数据迁移）
 *
 * 键结构：
 *   exam:p:<uid>:<paperKey>   套卷/专项进度 { answers, idx, updatedAt }
 *   exam:s:<uid>              累计统计 { total, correct, todayCount, streak, day }
 *   exam:d:<uid>:<essayKey>   申论草稿 { tab, qIndex, answers, checked, grades, startedAt }
 *
 * uid 来自 exam-identity（服务端 users.id），未登录时用 'local'。
 * 历史版本的键（没有 uid 段）会在首次读写时迁移到当前账号名下。
 */
const identity = require('./exam-identity.js');

const P = 'exam:p:';
const S = 'exam:s:';
const D = 'exam:d:';
const LEGACY_P = 'exam:progress:';
const LEGACY_S = 'exam:stats';
const LEGACY_D = 'exam:essay:draft:';

const migrated = {};

function uid() {
  return identity.uid();
}

function read(key, def) {
  try {
    const v = wx.getStorageSync(key);
    return v === '' || v === undefined ? def : v;
  } catch (e) {
    return def;
  }
}

function write(key, v) {
  try {
    wx.setStorageSync(key, v);
  } catch (e) {
    // 存储满时静默失败
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    // ignore
  }
}

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

// ---------------- 迁移 ----------------

/**
 * 把历史键迁到当前账号名下：
 *   exam:progress:<paperKey>      -> exam:p:<uid>:<paperKey>
 *   exam:stats                    -> exam:s:<uid>
 *   exam:essay:draft:<key>        -> exam:d:<uid>:<key>
 *   exam:p:local:<...>            -> exam:p:<uid>:<...>（登录后接管本地数据）
 */
function migrate() {
  const u = uid();
  if (migrated[u]) return;
  migrated[u] = 1;
  if (u === identity.FALLBACK_UID) return;

  let keys = [];
  try {
    keys = (wx.getStorageInfoSync().keys || []).slice();
  } catch (e) {
    return;
  }

  keys.forEach(function (k) {
    try {
      if (k.indexOf(LEGACY_P) === 0) {
        const rest = k.slice(LEGACY_P.length);
        if (rest.indexOf(':') >= 0) return; // 已是新格式
        const nk = P + u + ':' + rest;
        if (!read(nk, null)) write(nk, read(k, null));
        remove(k);
        return;
      }
      if (k === LEGACY_S) {
        const nk = S + u;
        if (!read(nk, null)) write(nk, read(k, null));
        remove(k);
        return;
      }
      if (k.indexOf(LEGACY_D) === 0) {
        const rest = k.slice(LEGACY_D.length);
        if (rest.indexOf(':') >= 0) return;
        const nk = D + u + ':' + rest;
        if (!read(nk, null)) write(nk, read(k, null));
        remove(k);
        return;
      }
      // local -> 真实账号
      [P, S, D].forEach(function (prefix) {
        if (k.indexOf(prefix + identity.FALLBACK_UID) !== 0) return;
        const nk = prefix + u + k.slice((prefix + identity.FALLBACK_UID).length);
        if (!read(nk, null)) write(nk, read(k, null));
        remove(k);
      });
    } catch (e) {
      // 单条迁移失败不影响其他
    }
  });
}

// ---------------- 套卷 / 专项 ----------------

function progressKey(paperKey) {
  return P + uid() + ':' + paperKey;
}

function getProgress(paperKey) {
  migrate();
  const p = read(progressKey(paperKey), null);
  return p || { answers: {}, idx: 0, updatedAt: 0 };
}

function saveProgress(paperKey, progress) {
  migrate();
  progress.updatedAt = Date.now();
  write(progressKey(paperKey), progress);
  return progress;
}

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
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yKey = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
      stats.streak = stats.day === yKey ? (stats.streak || 0) + 1 : 1;
      stats.day = t;
      stats.todayCount = 0;
    }
    stats.todayCount += 1;
    write(S + uid(), stats);
  } else if (prev.correct !== correct) {
    stats.correct += correct ? 1 : -1;
    write(S + uid(), stats);
  }
  return p;
}

function getStats() {
  migrate();
  const s = read(S + uid(), null);
  const base = { total: 0, correct: 0, todayCount: 0, streak: 0, day: today() };
  if (!s) return base;
  if (s.day !== today()) {
    s.todayCount = 0;
    s.day = today();
    write(S + uid(), s);
  }
  return Object.assign(base, s);
}

function resetPaper(paperKey) {
  remove(progressKey(paperKey));
}

// ---------------- 申论 ----------------

function essayKey(key) {
  return D + uid() + ':' + key;
}

function getEssayDraft(key) {
  migrate();
  const d = read(essayKey(key), null);
  return d || { tab: 0, qIndex: 0, answers: {}, startedAt: 0, elapsedMs: 0, checked: {} };
}

function saveEssayDraft(key, draft) {
  migrate();
  draft.updatedAt = Date.now();
  write(essayKey(key), draft);
  return draft;
}

function resetEssayDraft(key) {
  remove(essayKey(key));
}

function scoreEssay(question, checkedIdx) {
  const pts = question.keyPoints || [];
  if (!pts.length) return 0;
  const total = Number(question.score) || 0;
  const each = total / pts.length;
  return Math.round(each * (checkedIdx || []).length * 10) / 10;
}

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

// ---------------- 同步用 ----------------

/** 本地全部进度（供首次上传） */
function listLocal() {
  migrate();
  const u = uid();
  let keys = [];
  try {
    keys = (wx.getStorageInfoSync().keys || []).slice();
  } catch (e) {
    return [];
  }
  const out = [];
  keys.forEach(function (k) {
    if (k.indexOf(P + u + ':') === 0) {
      const v = read(k, null);
      if (v) out.push({ kind: 'paper', key: k.slice((P + u + ':').length), payload: v, updatedAt: v.updatedAt || 0 });
    } else if (k === S + u) {
      const v = read(k, null);
      if (v) out.push({ kind: 'stats', key: 'stats', payload: v, updatedAt: v.updatedAt || 0 });
    } else if (k.indexOf(D + u + ':') === 0) {
      const v = read(k, null);
      if (v) out.push({ kind: 'essay', key: k.slice((D + u + ':').length), payload: v, updatedAt: v.updatedAt || 0 });
    }
  });
  return out;
}

/** 远端记录合并到本地：只有远端更新才覆盖 */
/** 套卷：按题目 id 合并答案，避免两台设备各自做了不同题时互相覆盖 */
function mergePaper(cur, incoming, updatedAt, remoteNewer) {
  const out = Object.assign({}, cur || {}, incoming || {});
  out.answers = Object.assign({}, (cur && cur.answers) || {}, (incoming && incoming.answers) || {});
  // 答案取并集；进度位置只认更新的那条，旧远端不能把本地进度拽回去
  out.idx = remoteNewer
    ? ((incoming && typeof incoming.idx === 'number') ? incoming.idx : ((cur && cur.idx) || 0))
    : ((cur && typeof cur.idx === 'number') ? cur.idx : 0);
  out.updatedAt = updatedAt;
  return out;
}

/** 申论：作答/勾选/批改结果都按题号合并，取更早的开始时间 */
function mergeEssay(cur, incoming, updatedAt, remoteNewer) {
  const out = Object.assign({}, cur || {}, incoming || {});
  out.answers = Object.assign({}, (cur && cur.answers) || {}, (incoming && incoming.answers) || {});
  out.checked = Object.assign({}, (cur && cur.checked) || {}, (incoming && incoming.checked) || {});
  out.grades = Object.assign({}, (cur && cur.grades) || {}, (incoming && incoming.grades) || {});
  if (remoteNewer) {
    if (incoming && typeof incoming.qIndex === 'number') out.qIndex = incoming.qIndex;
    if (incoming && typeof incoming.tab === 'number') out.tab = incoming.tab;
  }
  const a = (cur && cur.startedAt) || 0;
  const b = (incoming && incoming.startedAt) || 0;
  out.startedAt = a && b ? Math.min(a, b) : (a || b);
  out.updatedAt = updatedAt;
  return out;
}

function applyRemote(kind, key, payload, updatedAt) {
  migrate();
  let k;
  if (kind === 'paper') k = P + uid() + ':' + key;
  else if (kind === 'stats') k = S + uid();
  else if (kind === 'essay') k = D + uid() + ':' + key;
  else return false;

  const cur = read(k, null);
  const curAt = (cur && cur.updatedAt) || 0;
  const remoteNewer = !cur || updatedAt >= curAt;

  let merged;
  if (kind === 'paper') {
    merged = mergePaper(cur, payload || {}, Math.max(curAt, updatedAt), remoteNewer);
  } else if (kind === 'essay') {
    merged = mergeEssay(cur, payload || {}, Math.max(curAt, updatedAt), remoteNewer);
  } else {
    // 统计是派生汇总，不能相加（会重复计数），只接受更新的整条
    if (cur && curAt >= updatedAt) return false;
    merged = Object.assign({}, payload || {}, { updatedAt: updatedAt });
  }

  if (cur && JSON.stringify(cur) === JSON.stringify(merged)) return false;
  write(k, merged);
  return true;
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
  inspectAnswer: inspectAnswer,
  listLocal: listLocal,
  applyRemote: applyRemote,
  migrate: migrate,
  uid: uid
};
