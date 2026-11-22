const { MODELS, UPDATED_AT } = require('../data/laptops.js');

const ALL = MODELS.map(decorate);

function money(n) {
  const v = Math.max(0, Math.round(Number(n) || 0));
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function priceRange(low, high) {
  return '¥' + money(low) + ' – ¥' + money(high);
}

function decorate(model) {
  if (!model) return null;
  const out = Object.assign({}, model);
  out.priceText = priceRange(model.priceLow, model.priceHigh);
  out.priceLowText = '¥' + money(model.priceLow);
  out.priceHighText = '¥' + money(model.priceHigh);
  out.launchText = '¥' + money(model.launchPrice);
  out.specLine = [model.specs.cpu, model.specs.gpu, model.specs.ram, model.specs.storage].join(' / ');
  out.keySpecs = [
    { k: 'CPU', v: model.specs.cpu },
    { k: 'GPU', v: model.specs.gpu },
    { k: '内存', v: model.specs.ram },
    { k: '硬盘', v: model.specs.storage },
    { k: '屏幕', v: model.specs.screen + ' ' + model.specs.refresh },
    { k: '电池', v: model.specs.battery },
    { k: '重量', v: model.specs.weight }
  ];
  out.variantCount = (model.variants || []).length;
  return out;
}

function getModel(id) {
  return ALL.find(function (m) { return m.id === id; }) || null;
}

function getVariant(model, variantId) {
  if (!model) return null;
  const list = model.variants || [];
  return list.find(function (v) { return v.id === variantId; }) || list[0] || null;
}

function brands() {
  const map = {};
  ALL.forEach(function (m) {
    if (!map[m.brandKey]) map[m.brandKey] = { key: m.brandKey, name: m.brand, count: 0 };
    map[m.brandKey].count += 1;
  });
  return Object.keys(map).map(function (k) { return map[k]; });
}

function gpuGroups() {
  return [
    { key: 'all', name: '全部显卡' },
    { key: 'rtx50', name: 'RTX 50 系' },
    { key: 'rtx40', name: 'RTX 40 系' },
    { key: 'high', name: '高端旗舰' }
  ];
}

function matchesGpu(m, gpu) {
  if (!gpu || gpu === 'all') return true;
  if (gpu === 'rtx50') return /RTX 50/.test(m.specs.gpu);
  if (gpu === 'rtx40') return /RTX 40/.test(m.specs.gpu);
  if (gpu === 'high') return /5070 Ti|5080|5090|4090/.test(m.specs.gpu);
  return true;
}

function list(options) {
  options = options || {};
  const q = String(options.query || '').trim().toLowerCase();
  const brand = options.brand || 'all';
  const gpu = options.gpu || 'all';
  const sort = options.sort || 'hot';
  let arr = ALL.filter(function (m) {
    if (brand !== 'all' && m.brandKey !== brand) return false;
    if (!matchesGpu(m, gpu)) return false;
    if (q) {
      const hay = [m.brand, m.series, m.model, m.aliases.join(' '), m.specs.cpu, m.specs.gpu].join(' ').toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });
  if (sort === 'price-asc') arr.sort(function (a, b) { return a.priceLow - b.priceLow; });
  else if (sort === 'price-desc') arr.sort(function (a, b) { return b.priceHigh - a.priceHigh; });
  else if (sort === 'newest') arr.sort(function (a, b) { return b.year - a.year; });
  else arr.sort(function (a, b) { return (b.year - a.year) || (b.launchPrice - a.launchPrice); });
  return arr;
}

function searchIntro(q, total) {
  q = String(q || '').trim();
  if (q) return '搜索「' + q + '」 · ' + total + ' 款匹配';
  return '首批 ' + total + ' 款主流游戏本 · 数据更新 ' + UPDATED_AT;
}

module.exports = {
  UPDATED_AT: UPDATED_AT,
  ALL: ALL,
  brands: brands,
  gpuGroups: gpuGroups,
  list: list,
  getModel: getModel,
  getVariant: getVariant,
  priceRange: priceRange,
  money: money,
  searchIntro: searchIntro
};
