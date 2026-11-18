// 页面展示辅助：补全封面/标签/版权信息
const CREDITS = require('../data/credits.js');

const BY_ID = {};
CREDITS.forEach((c) => { BY_ID[c.id] = c; });

function decorate(r) {
  if (!r) return null;
  const c = BY_ID[r.id] || {};
  const out = Object.assign({}, r, {
    image: c.image || '',
    credit: c.image ? c : null,
    tagsShort: (r.tags || []).slice(0, 2),
    metaText: r.time + ' 分钟 · ' + r.difficulty + ' · ' + r.servings + ' 人份',
    ingText: r.ingredients.map((x) => x[0]).slice(0, 4).join('、'),
  });
  return out;
}

function decorateList(list) {
  return (list || []).map(decorate);
}

module.exports = { decorate: decorate, decorateList: decorateList };
