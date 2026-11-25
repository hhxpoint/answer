// 入口/完善资料 的兜底行为：跳转失败要回退、头像没选也能开始、能跳过
const path = require('path');
const ROOT = path.join(__dirname, '..');

const storage = {};
const nav = [];
let failSetupNav = false;

global.wx = new Proxy({
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  navigateTo: (o) => {
    nav.push(['navigateTo', o.url]);
    if (failSetupNav && String(o.url).indexOf('setup') >= 0) {
      if (o.fail) o.fail({ errMsg: 'navigateTo:fail page not found' });
      return;
    }
    if (o.success) o.success({});
  },
  redirectTo: (o) => { nav.push(['redirectTo', o.url]); if (o.success) o.success({}); },
  navigateBack: () => nav.push(['navigateBack', '']),
  showToast: () => {},
  showModal: () => {},
  showShareMenu: () => {},
  request: (o) => { if (o.fail) o.fail({ errMsg: 'offline' }); },
  login: (o) => { if (o.fail) o.fail({ errMsg: 'offline' }); }
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});
global.getApp = () => ({ globalData: {} });
global.Page = (d) => { global.__def = d; };

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const identity = require(path.join(ROOT, 'utils', 'exam-identity.js'));

// ---------- 入口兜底 ----------
storage.userProfile = { userId: 'u1', nickName: '阿星', avatarUrl: 'https://x/a.png' };
nav.length = 0;
identity.enter('/packageExam/pages/home/home');
check('资料齐全直接进目标页', nav[0] && nav[0][1] === '/packageExam/pages/home/home', JSON.stringify(nav[0]));

// 未完善 + setup 跳转失败 → 回退到目标页（不能变成死按钮）
storage.userProfile = {};
failSetupNav = true;
nav.length = 0;
identity.enter('/packageExam/pages/home/home');
const last = nav[nav.length - 1] || [];
check('setup 跳不过去时回退目标页', last[1] === '/packageExam/pages/home/home', JSON.stringify(nav));
failSetupNav = false;

// ---------- 完善资料页 ----------
delete require.cache[require.resolve(path.join(ROOT, 'pages', 'setup', 'setup.js'))];
require(path.join(ROOT, 'pages', 'setup', 'setup.js'));
const def = global.__def;
const page = Object.assign({}, def, {
  data: Object.assign({}, def.data, { nickName: '', avatarUrl: '', from: '/packageExam/pages/home/home' }),
  setData: function (patch) { Object.assign(this.data, patch); }
});

page.save();
check('没写昵称给提示不崩', /昵称/.test(page.data.tip), page.data.tip);

page.data.nickName = '阿星';
page.save();
check('没选头像也能保存（用默认头像）', page.data.saving === true || !!storage.userProfile);
check('默认头像写入资料', String((storage.userProfile || {}).avatarUrl || '').indexOf('default-avatar') > 0,
  String((storage.userProfile || {}).avatarUrl || ''));

nav.length = 0;
page.skip();
check('跳过直接进目标页', nav[0] && nav[0][1] === '/packageExam/pages/home/home', JSON.stringify(nav));

console.log(fails.length ? '\nSETUP_FAILED: ' + fails.join(', ') : '\nSETUP_OK');
process.exit(fails.length ? 1 : 0);
