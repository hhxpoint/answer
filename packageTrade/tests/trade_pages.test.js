// Page-level smoke for trade pages without a real WeChat runtime.
const path = require('path');
const ROOT = path.join(__dirname, '..');
const calls = [];
let pageDef = null;
global.Page = function (def) { pageDef = def; };
global.wx = {
  getStorageSync: () => [],
  setStorageSync: () => {},
  removeStorageSync: () => {},
  showToast: () => {},
  showModal: (o) => { if (o && o.success) o.success({ confirm: false }); },
  navigateTo: (o) => calls.push(o.url),
  setNavigationBarTitle: () => {},
  chooseMedia: () => {},
  chooseImage: () => {},
  getWindowInfo: () => ({ pixelRatio: 2, statusBarHeight: 44 }),
  getSystemInfoSync: () => ({ pixelRatio: 2, statusBarHeight: 44 })
};
function load(rel) {
  pageDef = null;
  delete require.cache[require.resolve(rel)];
  require(rel);
  if (!pageDef) throw new Error('Page() not called: ' + rel);
  const p = Object.assign({}, pageDef);
  p.data = JSON.parse(JSON.stringify(pageDef.data || {}));
  p.setData = function (patch, cb) { Object.assign(this.data, patch); if (cb) cb(); };
  return p;
}
function run(name, fn) {
  try { fn(); console.log('PAGE_OK', name); }
  catch (e) { console.error('PAGE_FAIL', name, e.message); process.exitCode = 1; }
}
run('home', function () {
  const p = load(path.join(ROOT, 'pages/home/home.js'));
  p.onLoad();
  if (!p.data.results.length) throw new Error('home results empty');
  if (p.data.results.length > 8) throw new Error('home results too many');
  p.onInput({ detail: { value: 'Y9000P' } });
  p.refresh();
  if (!p.data.results.length) throw new Error('home search empty');
});
run('list', function () {
  const p = load(path.join(ROOT, 'pages/list/list.js'));
  p.onLoad({ q: '天选' });
  if (!p.data.results.length) throw new Error('list search empty');
  p.onBrand({ currentTarget: { dataset: { key: 'asus' } } });
  if (!p.data.results.length) throw new Error('list brand empty');
});
run('detail', function () {
  const p = load(path.join(ROOT, 'pages/detail/detail.js'));
  p.onLoad({ id: 'legion-y9000p-2025', variant: '32-1t' });
  if (!p.data.model || !p.data.variant) throw new Error('detail missing model');
  if (!p.data.specs.length) throw new Error('detail specs empty');
  p.selectVariant({ currentTarget: { dataset: { id: '32-1t-70ti' } } });
  if (p.data.variantId !== '32-1t-70ti') throw new Error('detail variant switch');
});
run('estimate', function () {
  const p = load(path.join(ROOT, 'pages/estimate/estimate.js'));
  p.onLoad({ id: 'legion-y9000p-2025', variant: '32-1t' });
  if (!p.data.result) throw new Error('estimate result missing');
  p.selectOption({ currentTarget: { dataset: { group: 'condition', id: 'B' } } });
  if (p.data.answers.condition !== 'B') throw new Error('estimate option');
  p.onCustomPrice({ detail: { value: '10500' } });
  if (!p.data.result.customState) throw new Error('estimate custom state');
});
console.log('TRADE_PAGE_SMOKE_OK', 'calls=' + calls.length);
