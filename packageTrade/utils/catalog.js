const { MODELS, UPDATED_AT } = require('../data/laptops.js');
const { DEVICES: PHONES } = require('../data/phones.js');
const { DEVICES: CONSOLES } = require('../data/consoles.js');

const CATEGORY_META = {
  laptop: { key: 'laptop', name: '游戏本', title: '游戏本二手估价单' },
  phone: { key: 'phone', name: '手机', title: '手机二手估价单' },
  console: { key: 'console', name: '游戏机', title: '游戏机二手估价单' }
};

const RAW = MODELS.concat(PHONES || []).concat(CONSOLES || []);
const ALL = RAW.map(decorate);

function money(n) {
  const v = Math.max(0, Math.round(Number(n) || 0));
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function priceRange(low, high) {
  return '¥' + money(low) + ' – ¥' + money(high);
}

function specItemsFor(model) {
  const s = model.specs || {};
  if (model.categoryKey === 'phone') {
    return [
      { k: '芯片', v: s.chip },
      { k: '内存', v: s.ram },
      { k: '存储', v: s.storage },
      { k: '屏幕', v: s.screen },
      { k: '电池', v: s.battery },
      { k: '影像', v: s.camera },
      { k: '重量', v: s.weight }
    ];
  }
  if (model.categoryKey === 'console') {
    return [
      { k: 'CPU', v: s.cpu },
      { k: 'GPU', v: s.gpu },
      { k: '存储', v: s.storage },
      { k: '屏幕', v: s.screen },
      { k: '输出', v: s.output },
      { k: '手柄', v: s.controller },
      { k: '重量', v: s.weight }
    ];
  }
  return [
    { k: 'CPU', v: s.cpu },
    { k: 'GPU', v: s.gpu },
    { k: '内存', v: s.ram },
    { k: '硬盘', v: s.storage },
    { k: '屏幕', v: s.screen },
    { k: '电池', v: s.battery },
    { k: '重量', v: s.weight }
  ];
}

function specLineFor(model) {
  const s = model.specs || {};
  if (model.categoryKey === 'phone') return [s.chip, s.ram, s.storage, s.screen].join(' / ');
  if (model.categoryKey === 'console') return [s.storage, s.output, s.controller].join(' / ');
  return [s.cpu, s.gpu, s.ram, s.storage].join(' / ');
}

function decorate(model) {
  if (!model) return null;
  const out = Object.assign({}, model);
  const meta = CATEGORY_META[model.categoryKey] || CATEGORY_META.laptop;
  out.categoryKey = meta.key;
  out.categoryName = meta.name;
  out.categoryTitle = meta.title;
  out.priceText = priceRange(model.priceLow, model.priceHigh);
  out.priceLowText = '¥' + money(model.priceLow);
  out.priceHighText = '¥' + money(model.priceHigh);
  out.launchText = '¥' + money(model.launchPrice);
  out.specLine = specLineFor(model);
  out.keySpecs = specItemsFor(model);
  out.specItems = out.keySpecs;
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

function categories() {
  return Object.keys(CATEGORY_META).map(function (key) {
    return {
      key: key,
      name: CATEGORY_META[key].name,
      count: ALL.filter(function (m) { return m.categoryKey === key; }).length
    };
  });
}

function brands(category) {
  const map = {};
  ALL.forEach(function (m) {
    if (category && category !== 'all' && m.categoryKey !== category) return;
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
  if (m.categoryKey !== 'laptop') return false;
  if (gpu === 'rtx50') return /RTX 50/.test(m.specs.gpu || '');
  if (gpu === 'rtx40') return /RTX 40/.test(m.specs.gpu || '');
  if (gpu === 'high') return /5070 Ti|5080|5090|4090/.test(m.specs.gpu || '');
  return true;
}

function specHaystack(m) {
  const s = m.specs || {};
  return [
    m.brand, m.series, m.model, (m.aliases || []).join(' '),
    s.cpu, s.gpu, s.chip, s.ram, s.storage, s.screen, s.camera,
    s.output, s.controller, m.categoryName
  ].filter(Boolean).join(' ').toLowerCase();
}

function list(options) {
  options = options || {};
  const q = String(options.query || '').trim().toLowerCase();
  const brand = options.brand || 'all';
  const gpu = options.gpu || 'all';
  const category = options.category || 'all';
  const sort = options.sort || 'hot';
  let arr = ALL.filter(function (m) {
    if (category !== 'all' && m.categoryKey !== category) return false;
    if (brand !== 'all' && m.brandKey !== brand) return false;
    if (gpu !== 'all' && !matchesGpu(m, gpu)) return false;
    if (q && specHaystack(m).indexOf(q) < 0) return false;
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
  return '全品类 ' + ALL.length + ' 款 · 手机 / 游戏机 / 游戏本 · 更新 ' + UPDATED_AT;
}

module.exports = {
  UPDATED_AT: UPDATED_AT,
  ALL: ALL,
  CATEGORY_META: CATEGORY_META,
  categories: categories,
  brands: brands,
  gpuGroups: gpuGroups,
  list: list,
  getModel: getModel,
  getVariant: getVariant,
  priceRange: priceRange,
  money: money,
  searchIntro: searchIntro
};
