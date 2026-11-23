const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const catalog = require(root + '/utils/catalog.js');
const estimate = require(root + '/utils/estimate.js');
let errors = [];
if (catalog.ALL.length !== 68) errors.push('models != 68: ' + catalog.ALL.length);
const ids = {};
catalog.ALL.forEach(function (m) {
  if (ids[m.id]) errors.push('duplicate id ' + m.id);
  ids[m.id] = 1;
  if (!m.image) errors.push('no image ' + m.id);
  if (m.image.indexOf('http') !== 0 && !fs.existsSync(path.join(root, '..', m.image.replace(/^\//, '')))) errors.push('missing image ' + m.id);
  if (!m.variants || !m.variants.length) errors.push('no variants ' + m.id);
  m.variants.forEach(function (v) {
    if (!(v.priceLow > 0) || !(v.priceHigh >= v.priceLow)) errors.push('bad price ' + m.id + '/' + v.id);
    const r = estimate.calc(m, v, { condition: 'A', battery: 'good', repair: 'none', accessory: 'full', warranty: 'expired', screen: 'perfect' });
    if (!r || !(r.low > 0) || !(r.high >= r.low) || !(r.fair >= r.low && r.fair <= r.high)) errors.push('bad calc ' + m.id + '/' + v.id);
    const r2 = estimate.calc(m, v, { condition: 'D', battery: 'bad', repair: 'board', accessory: 'none', warranty: 'unknown', screen: 'broken' });
    if (!(r2.high < r.high)) errors.push('condition not reducing ' + m.id);
  });
});
const s = catalog.list({ query: 'Y9000P' });
if (!s.length) errors.push('search Y9000P empty');
const t = catalog.list({ query: '天选' });
if (!t.length) errors.push('search 天选 empty');
const h = catalog.list({ gpu: 'high' });
if (!h.length) errors.push('high gpu empty');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('TRADE_DATA_OK', 'models=' + catalog.ALL.length, 'variants=' + catalog.ALL.reduce(function(a,m){return a+m.variants.length},0), 'searchY9000P=' + s.length, 'searchTUF=' + t.length, 'high=' + h.length);
