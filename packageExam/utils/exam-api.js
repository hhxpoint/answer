/**
 * 公考题库 · 数据访问层
 *
 * 数据全部放在服务器静态目录（不走接口）：
 *   https://hhxpoint.me/couple-api/files/exam/index.json
 *   https://hhxpoint.me/couple-api/files/exam/papers/<key>.json
 *   https://hhxpoint.me/couple-api/files/exam/img/<key>/<hash>.webp
 *
 * 三层兜底：
 *   1) 正常：命中本地缓存（索引 30 分钟、试卷 24 小时）直接返回
 *   2) 网络失败但本地有旧缓存 → 用旧数据（stale），功能不中断
 *   3) 需要应急切域名 → wx.setStorageSync('exam:base', 'https://新域名/couple-api/files/exam')
 */
const DEFAULT_BASE = 'https://hhxpoint.me/couple-api/files/exam';

// 数据版本：题库内容有更新时 +1，旧的本地缓存自动失效
const DATA_VERSION = 3;
const K_INDEX = 'exam:index:v' + DATA_VERSION;
const K_PAPER = 'exam:paper:v' + DATA_VERSION + ':';
const K_BASE = 'exam:base';

const TTL_INDEX = 30 * 60 * 1000;
const TTL_PAPER = 24 * 60 * 60 * 1000;

function now() {
  return Date.now();
}

/** 允许运维/应急通过本地存储改数据源（无需重新发版） */
function base() {
  try {
    const v = wx.getStorageSync(K_BASE);
    if (v && /^https?:\/\//.test(v)) return String(v).replace(/\/+$/, '');
  } catch (e) {
    // ignore
  }
  return DEFAULT_BASE;
}

function imgBase() {
  return base() + '/img';
}

function readRaw(key) {
  try {
    const raw = wx.getStorageSync(key);
    if (!raw || !raw.t || !raw.v) return null;
    return raw;
  } catch (e) {
    return null;
  }
}

function readCache(key, ttl) {
  const raw = readRaw(key);
  if (!raw) return null;
  if (ttl && now() - raw.t > ttl) return null;
  return raw.v;
}

const K_PAPER_PREFIX = 'exam:paper:';
const MAX_CACHED_PAPERS = 8;

/** 试卷缓存是几百 KB 一份，必须有上限，否则会撑爆本地 10MB 配额 */
function prunePapers() {
  try {
    const keys = (wx.getStorageInfoSync().keys || []).filter(function (k) {
      return k.indexOf(K_PAPER_PREFIX) === 0;
    });
    if (keys.length <= MAX_CACHED_PAPERS) return;
    const items = keys.map(function (k) {
      const raw = wx.getStorageSync(k) || {};
      return { k: k, t: raw.t || 0 };
    }).sort(function (a, b) { return b.t - a.t; });
    items.slice(MAX_CACHED_PAPERS).forEach(function (it) {
      try { wx.removeStorageSync(it.k); } catch (e) {}
    });
  } catch (e) {
    // 清理失败不影响主流程
  }
}

function writeCache(key, v) {
  try {
    wx.setStorageSync(key, { t: now(), v: v });
  } catch (e) {
    // 存储满：先清掉旧试卷再试一次，仍失败就放弃（下次还会从服务器取）
    prunePapers();
    try { wx.setStorageSync(key, { t: now(), v: v }); } catch (e2) {}
    return;
  }
  if (key.indexOf(K_PAPER_PREFIX) === 0) prunePapers();
}

function getJSON(url) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'GET',
      timeout: 20000,
      success: function (res) {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data);
        } else {
          reject(new Error('数据加载失败(' + res.statusCode + ')'));
        }
      },
      fail: function (err) {
        reject(new Error((err && err.errMsg) || '网络异常'));
      }
    });
  });
}

/**
 * 通用取数：先缓存 → 网络 → 网络失败回退到过期缓存
 * @returns Promise<{data, stale}> stale=true 表示用的是过期缓存
 */
function fetchWithFallback(url, cacheKey, ttl) {
  const fresh = readCache(cacheKey, ttl);
  if (fresh) return Promise.resolve({ data: fresh, stale: false });

  return getJSON(url)
    .then(function (data) {
      writeCache(cacheKey, data);
      return { data: data, stale: false };
    })
    .catch(function (err) {
      const any = readCache(cacheKey, 0); // 不过期检查
      if (any) return { data: any, stale: true };
      throw err;
    });
}

/** 卷索引 */
function loadIndex(force) {
  if (!force) {
    const hit = readCache(K_INDEX, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/index.json?v=' + DATA_VERSION, K_INDEX, TTL_INDEX)
    .then(function (r) { return r.data; });
}

/** 单卷（含题目、材料） */
function loadPaper(key, force) {
  const cacheKey = K_PAPER + key;
  if (!force) {
    const hit = readCache(cacheKey, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/papers/' + key + '.json?v=' + DATA_VERSION, cacheKey, TTL_PAPER)
    .then(function (r) { return r.data; });
}

/** 题型池索引（专项练习） */
function loadPoolIndex(force) {
  const k = 'exam:pools:v' + DATA_VERSION;
  if (!force) {
    const hit = readCache(k, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/pools/index.json?v=' + DATA_VERSION, k, TTL_INDEX)
    .then(function (r) { return r.data; });
}

/** 单个题型池 */
function loadPool(slug, force) {
  const k = 'exam:pool:v' + DATA_VERSION + ':' + slug;
  if (!force) {
    const hit = readCache(k, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/pools/' + slug + '.json?v=' + DATA_VERSION, k, TTL_PAPER)
    .then(function (r) { return r.data; });
}

/** 申论卷索引 */
function loadEssayIndex(force) {
  const k = 'exam:essay:index:v' + DATA_VERSION;
  if (!force) {
    const hit = readCache(k, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/essay/index.json?v=' + DATA_VERSION, k, TTL_INDEX)
    .then(function (r) { return r.data; });
}

/** 单套申论 */
function loadEssay(key, force) {
  const k = 'exam:essay:v' + DATA_VERSION + ':' + key;
  if (!force) {
    const hit = readCache(k, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return fetchWithFallback(base() + '/essay/' + key + '.json?v=' + DATA_VERSION, k, TTL_PAPER)
    .then(function (r) { return r.data; });
}

/** 图片绝对地址 */
function imgUrl(paperKey, name) {
  return imgBase() + '/' + paperKey + '/' + name;
}

/**
 * 把数据里的图文块补全成可直接渲染的模型：
 *   块：[{ parts:[{t:'文字'} | {src:'url', w, h}] }]
 */
function expandBlocks(blocks, paperKey) {
  const out = [];
  (blocks || []).forEach(function (b, bi) {
    const parts = [];
    (b.parts || []).forEach(function (p, pi) {
      if (p && p.img) {
        parts.push({
          i: bi + '-' + pi,
          src: imgUrl(paperKey, p.img),
          w: p.w || 0,
          h: p.h || 0,
          tex: !!p.tex
        });
      } else if (p && p.t) {
        parts.push({ i: bi + '-' + pi, t: p.t });
      }
    });
    if (parts.length) out.push({ i: bi, parts: parts });
  });
  return out;
}

/** 预处理整卷：补全图片地址，方便页面直接绑定 */
function normalizePaper(paper) {
  const key = paper.key;
  const materials = {};
  Object.keys(paper.materials || {}).forEach(function (sec) {
    const group = paper.materials[sec] || {};
    materials[sec] = {};
    Object.keys(group).forEach(function (n) {
      materials[sec][n] = expandBlocks(group[n], key);
    });
  });

  const questions = (paper.questions || []).map(function (q, i) {
    return {
      id: q.id,
      qid: q.qid,
      seq: q.seq,
      no: i + 1,
      section: q.section,
      type: q.type,
      material: q.material,
      stem: expandBlocks(q.stem, key),
      options: (q.options || []).map(function (o) {
        return { key: o.key, blocks: expandBlocks(o.blocks, key) };
      }),
      answer: q.answer,
      analysis: expandBlocks(q.analysis, key),
      needsReview: (q.needsReview || []).length
    };
  });

  return {
    key: key,
    title: paper.title,
    examType: paper.examType,
    year: paper.year,
    province: paper.province,
    questionCount: questions.length,
    materials: materials,
    questions: questions
  };
}

module.exports = {
  BASE: DEFAULT_BASE,
  base: base,
  loadIndex: loadIndex,
  loadPoolIndex: loadPoolIndex,
  loadPool: loadPool,
  loadEssayIndex: loadEssayIndex,
  loadEssay: loadEssay,
  loadPaper: loadPaper,
  normalizePaper: normalizePaper,
  imgUrl: imgUrl
};
