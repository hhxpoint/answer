/**
 * 公考题库 · 数据访问层
 *
 * 数据全部放在服务器静态目录（不走接口）：
 *   https://hhxpoint.me/couple-api/files/exam/index.json
 *   https://hhxpoint.me/couple-api/files/exam/papers/<key>.json
 *   https://hhxpoint.me/couple-api/files/exam/img/<key>/<hash>.webp
 *
 * 本地缓存：索引 30 分钟、试卷 24 小时（试卷是 200~400KB，重复拉不划算）
 */
const BASE = 'https://hhxpoint.me/couple-api/files/exam';
const IMG_BASE = BASE + '/img';

const TTL_INDEX = 30 * 60 * 1000;
const TTL_PAPER = 24 * 60 * 60 * 1000;

// 数据版本：题库内容有更新时 +1，旧的本地缓存自动失效
const DATA_VERSION = 3;
const K_INDEX = 'exam:index:v' + DATA_VERSION;
const K_PAPER = 'exam:paper:';

function now() {
  return Date.now();
}

function readCache(key, ttl) {
  try {
    const raw = wx.getStorageSync(key);
    if (!raw || !raw.t || !raw.v) return null;
    if (now() - raw.t > ttl) return null;
    return raw.v;
  } catch (e) {
    return null;
  }
}

function writeCache(key, v) {
  try {
    wx.setStorageSync(key, { t: now(), v: v });
  } catch (e) {
    // 存储满时静默失败，不影响使用
  }
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

/** 卷索引 */
function loadIndex(force) {
  if (!force) {
    const hit = readCache(K_INDEX, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/index.json?v=' + DATA_VERSION).then(function (data) {
    writeCache(K_INDEX, data);
    return data;
  });
}

/** 单卷（含题目、材料） */
function loadPaper(key, force) {
  const cacheKey = K_PAPER + key;
  if (!force) {
    const hit = readCache(cacheKey, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/papers/' + key + '.json').then(function (data) {
    writeCache(cacheKey, data);
    return data;
  });
}

/** 图片绝对地址 */
function imgUrl(paperKey, name) {
  return IMG_BASE + '/' + paperKey + '/' + name;
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


/** 题型池索引（专项练习） */
function loadPoolIndex(force) {
  const k = 'exam:pools';
  if (!force) {
    const hit = readCache(k, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/pools/index.json?v=' + DATA_VERSION).then(function (data) {
    writeCache(k, data);
    return data;
  });
}

/** 单个题型池 */
function loadPool(slug, force) {
  const k = 'exam:pool:' + slug;
  if (!force) {
    const hit = readCache(k, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/pools/' + slug + '.json').then(function (data) {
    writeCache(k, data);
    return data;
  });
}

/** 申论卷索引 */
function loadEssayIndex(force) {
  const k = 'exam:essay:index';
  if (!force) {
    const hit = readCache(k, TTL_INDEX);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/essay/index.json?v=' + DATA_VERSION).then(function (data) {
    writeCache(k, data);
    return data;
  });
}

/** 单套申论 */
function loadEssay(key, force) {
  const k = 'exam:essay:' + key;
  if (!force) {
    const hit = readCache(k, TTL_PAPER);
    if (hit) return Promise.resolve(hit);
  }
  return getJSON(BASE + '/essay/' + key + '.json').then(function (data) {
    writeCache(k, data);
    return data;
  });
}
module.exports = {
  BASE: BASE,
  loadIndex: loadIndex,
  loadPoolIndex: loadPoolIndex,
  loadPool: loadPool,
  loadEssayIndex: loadEssayIndex,
  loadEssay: loadEssay,
  loadPaper: loadPaper,
  normalizePaper: normalizePaper,
  imgUrl: imgUrl
};
