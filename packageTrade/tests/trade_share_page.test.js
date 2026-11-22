const path = require('path');
const ROOT = path.join(__dirname, '..');
const share = require(ROOT + '/utils/share.js');
const catalog = require(ROOT + '/utils/catalog.js');
let pageDef = null;
global.Page = function (d) { pageDef = d; };
global.wx = {
  getStorageSync: () => null,
  setStorageSync: () => {},
  showToast: () => {},
  navigateTo: () => {},
  setNavigationBarTitle: () => {}
};
require(ROOT + '/pages/share/share.js');
const p = Object.assign({}, pageDef);
p.data = JSON.parse(JSON.stringify(pageDef.data || {}));
p.setData = function (patch, cb) { Object.assign(this.data, patch); if (cb) cb(); };
const model = catalog.getModel('legion-y9000p-2025');
const variant = catalog.getVariant(model, '32-1t');
const d = share.encode({ modelId: model.id, variantId: variant.id, answers: { condition: 'B', battery: 'good', repair: 'none', accessory: 'full', warranty: 'expired', screen: 'perfect', customPrice: '10200' }, dateText: '11月22日' });
p.onLoad({ d: d });
if (!p.data.model || !p.data.result) throw new Error('share page did not decode');
if (p.data.result.condition.id !== 'B') throw new Error('share page condition lost');
const msg = p.onShareAppMessage();
if (!msg.path || msg.path.indexOf('/packageTrade/pages/share/share?d=') !== 0) throw new Error('share page card path missing');
const tl = p.onShareTimeline();
if (!tl.query || tl.query.indexOf('d=') !== 0) throw new Error('timeline query missing');
console.log('SHARE_PAGE_OK', 'queryLength=' + d.length, 'range=' + p.data.result.rangeText);
