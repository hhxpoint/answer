// 纯本地菜谱检索（无网络、无大模型）
// 查询理解（食材/时间/口味/菜系）→ 多路召回 → 规则排序 → 模板化提示
const RECIPES = require('../data/recipes.js');
const SYNONYMS = require('../data/synonyms.js');
const INGREDIENTS = require('../data/ingredients.js');

const PANTRY = {};
('盐 油 食用油 生抽 老抽 料酒 醋 白糖 冰糖 淀粉 葱 小葱 姜 姜片 蒜 蒜末 花椒 花椒粉 干辣椒 豆瓣酱 蚝油 香油 咖喱块 番茄酱 葱花 葱丝 姜丝 蒜片 豆豉 五香粉'.split(' ')).forEach((x) => { PANTRY[x] = 1; });

const TASTES = ['清淡', '微辣', '麻辣', '辣', '酸甜', '甜', '咸', '下饭', '快手', '简单', '素菜', '汤', '早餐', '主食', '硬菜', '蒸菜', '凉菜', '炖煮', '面食', '粥'];
const CATEGORY_LIST = ['全部', '家常菜', '快手菜', '汤羹', '主食', '早餐', '硬菜'];

const COVER_CLASS = { 家常菜: 1, 快手菜: 2, 汤羹: 3, 主食: 4, 早餐: 5, 硬菜: 6 };
const EMOJI_RULES = [
  ['鱼', '🐟'], ['鸡翅', '🍗'], ['鸡', '🍗'], ['牛', '🥩'], ['排骨', '🍖'], ['肉', '🥩'],
  ['豆腐', '🧊'], ['蛋', '🥚'], ['虾', '🦐'], ['面', '🍜'], ['粥', '🥣'], ['饭', '🍚'],
  ['汤', '🍲'], ['羹', '🥣'], ['三明治', '🥪'], ['饼', '🥞'], ['包菜', '🥬'],
  ['西兰花', '🥦'], ['茄子', '🍆'], ['土豆', '🥔'], ['黄瓜', '🥒'], ['番茄', '🍅'],
  ['西红柿', '🍅'], ['韭菜', '🌿'], ['豆角', '🫘'], ['银耳', '🍄'], ['香菇', '🍄'], ['玉米', '🌽'],
];

function normalize(s) {
  return String(s || '')
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, '')
    .replace(/[，。！？、,.!?;；:：'"“”‘’]/g, '')
    .toLowerCase();
}

function emojiOf(r) {
  const t = r.title + r.tags.join('');
  for (let i = 0; i < EMOJI_RULES.length; i++) if (t.indexOf(EMOJI_RULES[i][0]) >= 0) return EMOJI_RULES[i][1];
  return '🍽️';
}

function ingredientNames(r) {
  return r.ingredients.map((x) => x[0]);
}

// 预处理：文本、食材集合
const DATA = RECIPES.map((r) => {
  const ing = ingredientNames(r);
  return Object.assign({}, r, {
    _text: normalize([r.title].concat(r.aliases, r.category, r.cuisine, r.tags, ing, r.steps).join('')),
    _ingset: ing,
    emoji: emojiOf(r),
    coverClass: COVER_CLASS[r.category] || 1,
  });
});

const BY_ID = {};
DATA.forEach((r) => { BY_ID[r.id] = r; });

// 食材匹配：查询词里出现食材名
function extractIngredients(text) {
  const found = [];
  INGREDIENTS.forEach((name) => {
    if (text.indexOf(name) >= 0 || text.indexOf(name.slice(0, 1)) >= 0 && name.length === 1) found.push(name);
  });
  // 长词优先去重
  const out = [];
  found.sort((a, b) => b.length - a.length).forEach((n) => {
    if (!out.some((x) => x.indexOf(n) >= 0)) out.push(n);
  });
  return out.slice(0, 6);
}

function extractTime(text) {
  if (/半小时|30分钟|三十分钟/.test(text)) return 30;
  if (/一小时|1小时|60分钟/.test(text)) return 60;
  const m = text.match(/(\d+)\s*(分钟|分|min)/);
  if (m) return parseInt(m[1], 10);
  return 0;
}

function extractTastes(text) {
  return TASTES.filter((t) => text.indexOf(t) >= 0);
}

function extractCategory(text) {
  for (let i = 1; i < CATEGORY_LIST.length; i++) {
    const c = CATEGORY_LIST[i];
    if (text.indexOf(c) >= 0) return c;
  }
  if (text.indexOf('汤') >= 0) return '汤羹';
  return '';
}

function parseQuery(q) {
  const raw = String(q || '').trim();
  const text = normalize(raw);
  return {
    raw: raw,
    text: text,
    ingredients: extractIngredients(text),
    timeMax: extractTime(text),
    tastes: extractTastes(text),
    category: extractCategory(text),
    tokens: tokensOf(text),
  };
}

function tokensOf(text) {
  const out = {};
  // 词表分词（食材、同义词、标签、菜系）
  const dict = INGREDIENTS.concat(Object.keys(SYNONYMS), CATEGORY_LIST.slice(1), TASTES);
  const sorted = dict.filter((w) => w && w.length >= 2).sort((a, b) => b.length - a.length);
  let i = 0;
  while (i < text.length) {
    let hit = '';
    for (let j = 0; j < sorted.length; j++) {
      const w = sorted[j];
      if (text.substr(i, w.length) === w) { hit = w; break; }
    }
    if (hit) { out[hit] = 1; i += hit.length; continue; }
    // 中文二元组兜底
    if (/[\u4e00-\u9fa5]/.test(text[i]) && /[\u4e00-\u9fa5]/.test(text[i + 1] || '')) {
      out[text.substr(i, 2)] = 1;
    }
    i += 1;
  }
  return Object.keys(out);
}

function matchIngredient(recipeIng, selected) {
  return selected.some((s) => recipeIng.indexOf(s) >= 0 || s.indexOf(recipeIng) >= 0);
}

function scoreRecipe(r, parsed) {
  let score = 0;
  const text = parsed.text;
  if (!text) return 40 + (r.heat || 0) / 20;

  if (text === normalize(r.title)) score += 120;
  else if (text.indexOf(normalize(r.title)) >= 0 || normalize(r.title).indexOf(text) >= 0) score += 70;
  r.aliases.forEach((a) => {
    const na = normalize(a);
    if (text.indexOf(na) >= 0 || na.indexOf(text) >= 0) score += 46;
  });

  const ingHits = parsed.ingredients.filter((n) => r._ingset.some((x) => x.indexOf(n) >= 0 || n.indexOf(x) >= 0));
  score += ingHits.length * 20;

  parsed.tastes.forEach((t) => { if (r.tags.join('').indexOf(t) >= 0 || r.title.indexOf(t) >= 0) score += 8; });
  if (parsed.category === r.category) score += 16;

  parsed.tokens.forEach((t) => {
    if (t.length < 2) return;
    if (r._text.indexOf(t) >= 0) score += 4;
  });

  if (parsed.timeMax && r.time <= parsed.timeMax) score += 14;
  else if (parsed.timeMax && r.time > parsed.timeMax) score -= 30;

  // 热度轻微加权
  score += (r.heat || 0) / 50;
  return score;
}

function filterList(list, opts) {
  opts = opts || {};
  return list.filter((r) => {
    if (opts.category && opts.category !== '全部' && r.category !== opts.category) return false;
    if (opts.timeMax && r.time > opts.timeMax) return false;
    if (opts.tastes && opts.tastes.length) {
      const joined = r.tags.join('') + r.title;
      if (!opts.tastes.some((t) => joined.indexOf(t) >= 0)) return false;
    }
    return true;
  });
}

function search(query, opts) {
  opts = opts || {};
  const parsed = parseQuery(query);
  let list = DATA.slice();
  list = filterList(list, Object.assign({}, opts, { timeMax: opts.timeMax || parsed.timeMax, tastes: opts.tastes || parsed.tastes, category: opts.category || parsed.category }));

  const scored = list.map((r) => ({ r: r, s: scoreRecipe(r, parsed) }))
    .filter((x) => !parsed.text || x.s > 10)
    .sort((a, b) => b.s - a.s || (b.r.heat || 0) - (a.r.heat || 0));

  const result = scored.map((x) => x.r);
  return {
    parsed: parsed,
    list: result,
    total: result.length,
    intro: buildIntro(parsed, result.length),
  };
}

function buildIntro(parsed, count) {
  if (!parsed.text) return '按热度给你挑了几道，也可以搜「番茄、鸡蛋、30分钟」';
  if (!count) {
    return '没有完全符合的菜谱。试试放宽时间，或只搜一个食材，比如「鸡蛋」。';
  }
  const bits = [];
  if (parsed.ingredients.length) bits.push('食材：' + parsed.ingredients.join('、'));
  if (parsed.timeMax) bits.push(parsed.timeMax + ' 分钟内');
  if (parsed.tastes.length) bits.push(parsed.tastes.slice(0, 2).join('、'));
  const cond = bits.length ? '（' + bits.join(' · ') + '）' : '';
  return '找到 ' + count + ' 道' + cond + '，点开看做法。';
}

function fridge(selected) {
  const sel = selected || [];
  const out = [];
  DATA.forEach((r) => {
    const required = r._ingset.filter((n) => !PANTRY[n]);
    if (!required.length) return;
    const matched = required.filter((n) => matchIngredient(n, sel));
    const missing = required.filter((n) => !matchIngredient(n, sel));
    const coverage = matched.length / required.length;
    if (matched.length === 0) return;
    out.push({ r: r, matched: matched, missing: missing, coverage: coverage });
  });
  out.sort((a, b) => b.coverage - a.coverage || a.missing.length - b.missing.length || a.r.time - b.r.time);
  return out.slice(0, 20);
}

function tonight(seed) {
  const quick = DATA.filter((r) => r.time <= 30 && r.category !== '汤羹');
  const pool = quick.length ? quick : DATA;
  const idx = Math.abs(seed || Date.now()) % pool.length;
  return pool[idx];
}

function byId(id) {
  return BY_ID[id] || null;
}

function hot(limit) {
  return DATA.slice().sort((a, b) => (b.heat || 0) - (a.heat || 0)).slice(0, limit || 8);
}

module.exports = {
  DATA: DATA,
  CATEGORY_LIST: CATEGORY_LIST,
  search: search,
  fridge: fridge,
  tonight: tonight,
  byId: byId,
  hot: hot,
  normalize: normalize,
};
