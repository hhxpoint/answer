// 离线兜底测试：网络挂了用旧缓存、无缓存才报错、应急切域名
const path = require('path');
const ROOT = path.join(__dirname, '..');

const storage = {};
const urls = [];
let failNext = false;

global.wx = new Proxy({
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  request: (o) => {
    urls.push(o.url);
    if (failNext) { o.fail({ errMsg: 'request:fail timeout' }); return; }
    const data = String(o.url).indexOf('index.json') >= 0
      ? { paperCount: 1, papers: [{ key: 'gk1', title: 't', questionCount: 1 }] }
      : { key: 'gk1', title: 't', questions: [], materials: {} };
    o.success({ statusCode: 200, data: data });
  }
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

function expire(prefix) {
  Object.keys(storage).forEach(function (k) {
    if (k.indexOf(prefix) !== 0) return;
    const raw = storage[k];
    if (raw && typeof raw === 'object' && raw.t) {
      raw.t = Date.now() - 999 * 24 * 3600 * 1000;
      storage[k] = raw;
    }
  });
}

const api = require(path.join(ROOT, 'utils', 'exam-api.js'));

// 1) 联网：索引 + 单卷都进缓存
Promise.all([api.loadIndex(), api.loadPaper('gk1')]).then(function (r) {
  check('联网可拿到索引', r[0] && r[0].papers.length === 1);
  check('联网可拿到单卷', r[1] && r[1].key === 'gk1');
  check('索引已缓存', Object.keys(storage).some(function (k) { return k.indexOf('exam:index') === 0; }));
  check('单卷已缓存', Object.keys(storage).some(function (k) { return k.indexOf('exam:paper:') === 0; }));

  // 2) 让缓存全部过期
  expire('exam:index');
  expire('exam:paper:');

  // 3) 断网：应回退过期缓存
  failNext = true;
  return Promise.all([api.loadIndex(), api.loadPaper('gk1')]);
}).then(function (r) {
  check('断网仍能打开索引（旧缓存）', r[0] && r[0].papers.length === 1);
  check('断网仍能做卷（旧缓存）', r[1] && r[1].key === 'gk1');

  // 4) 无缓存 + 断网 → 必须报错（不能假装成功）
  return api.loadPaper('gk-never-cached').then(function () {
    return 'RESOLVED';
  }).catch(function (e) {
    return 'REJECTED:' + e.message;
  });
}).then(function (r) {
  check('无缓存断网才报错', String(r).indexOf('REJECTED') === 0, String(r));

  // 5) 应急域名
  failNext = false;
  storage['exam:base'] = 'https://backup.example.com/couple-api/files/exam';
  urls.length = 0;
  return api.loadIndex(true).then(function () {
    check('应急域名生效', String(urls[0]).indexOf('https://backup.example.com') === 0, urls[0]);
    check('默认域名常量未变', api.BASE.indexOf('hhxpoint.me') > 0, api.BASE);
  });
}).then(function () {

  // 6) 试卷缓存上限：最多留 8 份，避免撑爆 10MB
  storage['exam:base'] = 'https://hhxpoint.me/couple-api/files/exam';
  const loads = [];
  for (let i = 0; i < 10; i++) {
    loads.push(api.loadPaper('cap-' + i, true));
  }
  return Promise.all(loads).then(function () {
    const paperKeys = Object.keys(storage).filter(function (k) { return k.indexOf('exam:paper:') === 0; });
    check('试卷缓存不超过 8 份', paperKeys.length <= 8, 'count=' + paperKeys.length);
  });

}).then(function () {
  console.log(fails.length ? '\nOFFLINE_FAILED: ' + fails.join(', ') : '\nOFFLINE_OK');
  process.exit(fails.length ? 1 : 0);
}).catch(function (e) {
  console.log('FATAL ' + (e && e.message));
  process.exit(2);
});
