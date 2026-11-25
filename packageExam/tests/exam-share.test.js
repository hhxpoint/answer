// 分享守卫：每个公考页面都必须能分享，且标题/路径/封面合法
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const APP = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const SUB = (APP.subPackages || []).find((s) => s.root === 'packageExam');
const PAGES = (SUB && SUB.pages) || [];
const ROUTES = new Set(PAGES.map((p) => 'packageExam/' + p));
const COVER_DIR = path.join(ROOT, 'packageExam', 'assets', 'share');

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

// ---------- wx / Page 桩 ----------
const storage = {};
let captured = null;

global.getApp = () => ({ globalData: {} });
global.wx = new Proxy({
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  showShareMenu: (o) => { global.__menu = o; },
  request: (o) => { if (o.fail) o.fail({ errMsg: 'offline' }); },
  navigateTo: () => {},
  showToast: () => {}
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});
global.Page = (def) => { captured = def; };
global.Component = () => {};

// ---------- share 工具本身 ----------
const share = require(path.join(ROOT, 'packageExam', 'utils', 'share.js'));

check('queryOf 去路径', share.queryOf('/a/b?paper=x&jump=3') === 'paper=x&jump=3');
check('queryOf 无参数为空', share.queryOf('/a/b') === '');
check('cover 兜底', share.cover('不存在的名字') === share.COVERS.home);

Object.keys(share.COVERS).forEach(function (k) {
  const p = share.COVERS[k].replace('/packageExam/', '');
  const file = path.join(ROOT, 'packageExam', p.replace('assets/', 'assets/'));
  check('封面存在: ' + k, fs.existsSync(file), path.relative(ROOT, file));
});

// ---------- 逐页 ----------
const OVERRIDES = {
  'pages/practice/practice': { paperKey: 'gk2025-fsx', q: { type: '图形推理', no: 1, stem: '选出下一个' }, idx: 2 },
  'pages/card/card': { key: 'gk2025-fsx' },
  'pages/essay-practice/essay-practice': { key: 'sl2025-fsx', q: { type: '归纳概括', no: 1, stem: '概括材料中的问题' }, qIndex: 0 },
  'pages/essay-review/essay-review': { key: 'sl2025-fsx', q: { no: 1, type: '归纳概括' } },
  'pages/papers/papers': { totalPapers: 26, totalQuestions: 3257 }
};

function assertShape(page, obj, kind) {
  const label = page + ' → ' + kind;
  check(label + ' 标题非空', typeof obj.title === 'string' && obj.title.length > 0, obj.title);
  check(label + ' 标题不过长', (obj.title || '').length <= 40, String((obj.title || '').length));

  if (kind === 'message') {
    const p = String(obj.path || '');
    check(label + ' path 以 / 开头', p.charAt(0) === '/', p);
    const route = p.split('?')[0].replace(/^\//, '');
    check(label + ' 路由存在', ROUTES.has(route), route);
    check(label + ' 封面合法', /^\/packageExam\/assets\/share\/share-[\w-]+\.jpg$/.test(obj.imageUrl || ''), obj.imageUrl);
    const file = path.join(ROOT, String(obj.imageUrl || '').replace('/', ''));
    check(label + ' 封面文件存在', fs.existsSync(file), path.relative(ROOT, file));
  } else {
    check(label + ' query 为字符串', typeof obj.query === 'string', typeof obj.query);
    check(label + ' query 不以 ? 开头', String(obj.query || '').charAt(0) !== '?', obj.query);
  }
}

const WAIT = [];
PAGES.forEach(function (p) {
  const file = path.join(ROOT, 'packageExam', p + '.js');
  check('页面文件存在: ' + p, fs.existsSync(file));
  if (!fs.existsSync(file)) return;

  captured = null;
  delete require.cache[require.resolve(file)];
  require(file);

  const def = captured;
  check(p + ' 有 onShareAppMessage', def && typeof def.onShareAppMessage === 'function');
  check(p + ' 有 onShareTimeline', def && typeof def.onShareTimeline === 'function');

  // 朋友圈入口需要 showShareMenu，页面里必须真的调了
  const src = fs.readFileSync(file, 'utf8');
  check(p + ' 调用了 enableMenu', src.indexOf('share.enableMenu()') >= 0);
  const override = OVERRIDES[p] || {};
  const inst = Object.assign({}, def, {
    data: Object.assign({}, def.data, override),
    paperKey: override.paperKey,
    key: override.key,
    paper: override.key ? { key: override.key } : (override.paperKey ? { key: override.paperKey } : null)
  });

  if (def && typeof def.onShareAppMessage === 'function') {
    let msg = null;
    try {
      msg = def.onShareAppMessage.call(inst, { from: 'menu' });
    } catch (e) {
      check(p + ' 转发不抛错', false, e.message);
    }
    if (msg) assertShape(p, msg, 'message');
  }

  if (def && typeof def.onShareTimeline === 'function') {
    let tl = null;
    try {
      tl = def.onShareTimeline.call(inst);
    } catch (e) {
      check(p + ' 朋友圈不抛错', false, e.message);
    }
    if (tl) assertShape(p, tl, 'timeline');
  }
});

console.log('\n页面数 ' + PAGES.length + ' · 失败 ' + fails.length);
console.log(fails.length ? 'SHARE_FAILED: ' + fails.slice(0, 8).join(' | ') : 'SHARE_OK');
process.exit(fails.length ? 1 : 0);
