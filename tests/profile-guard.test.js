// 全局资料门禁：没填头像昵称时，任何页面都要先去完善资料
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const GP = path.join(ROOT, 'utils', 'global-profile.js');
const GUARD = path.join(ROOT, 'utils', 'profile-guard.js');
const WELCOME = path.join(ROOT, 'pages', 'welcome', 'welcome.js');

const storage = {};
const relaunches = [];
let current = { route: 'packageCouple/pages/home/home', options: { space: '3' } };
let profile = {};

global.wx = new Proxy({
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  reLaunch: (o) => { relaunches.push(o.url); if (o.success) o.success({}); },
  showToast: () => {},
  getStorageInfoSync: () => ({ keys: Object.keys(storage) })
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});
global.getCurrentPages = () => [current];
global.getApp = () => ({ globalData: {} });
global.Page = (d) => { global.__def = d; };

require.cache[require.resolve(GP)] = {
  id: GP, filename: GP, loaded: true,
  exports: {
    getLocalProfile: () => profile,
    pushLocalProfile: () => Promise.resolve({ avatarUrl: 'https://x/a.png' }),
    markLoggedIn: () => {},
    markDirty: () => {},
    clearSession: () => {},
    getToken: () => '',
    absUrl: (u) => u
  }
};

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const guard = require(GUARD);

// 1) 没资料 → 拦
profile = {};
relaunches.length = 0;
const blocked = guard.guard();
check('没资料时拦下', blocked === true);
check('跳到完善资料页', String(relaunches[0] || '').indexOf('/pages/welcome/welcome?from=') === 0, relaunches[0]);
check('带上原页面（含 query）', decodeURIComponent(relaunches[0] || '').indexOf('/packageCouple/pages/home/home?space=3') > 0, relaunches[0]);
check('来源已记住', guard.takeFrom() === '/packageCouple/pages/home/home?space=3', guard.takeFrom());

// 2) 有资料 → 放行
profile = { nickName: '阿星', avatarUrl: 'https://hhxpoint.me/a.png' };
relaunches.length = 0;
check('有资料时放行', guard.guard() === false);
check('不放行时不跳转', relaunches.length === 0);

// 3) 只有昵称 / 只有头像 → 仍拦
profile = { nickName: '阿星', avatarUrl: '' };
check('只有昵称也拦', guard.guard() === true);
profile = { nickName: '', avatarUrl: 'https://x/a.png' };
check('只有头像也拦', guard.guard() === true);

// 4) 资料页与用户中心不拦（避免死循环）
profile = {};
current = { route: 'pages/welcome/welcome', options: {} };
check('资料页自身不拦', guard.guard() === false);
current = { route: 'pages/user/user', options: {} };
check('用户中心不拦', guard.guard() === false);

// 5) 所有页面都注入了门禁（除豁免页）
const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const pages = [];
(app.pages || []).forEach((p) => pages.push(p));
(app.subPackages || []).forEach((s) => (s.pages || []).forEach((p) => pages.push(s.root + '/' + p)));
const SKIP = ['pages/welcome/welcome', 'pages/user/user'];
let injected = 0;
let missing = [];
pages.forEach(function (p) {
  const js = path.join(ROOT, p + '.js');
  if (!fs.existsSync(js)) return;
  const src = fs.readFileSync(js, 'utf8');
  if (src.indexOf('profileGuard') >= 0) injected++;
  else if (SKIP.indexOf(p) < 0) missing.push(p);
});
check('除豁免页外全部注入', missing.length === 0, 'injected=' + injected + ' missing=' + missing.length);
check('页面总数合理', pages.length >= 80, 'pages=' + pages.length);

// 6) 完善资料页：保存逻辑
profile = {};
current = { route: 'pages/welcome/welcome', options: { from: encodeURIComponent('/pages/index/index') } };
delete require.cache[require.resolve(WELCOME)];
require(WELCOME);
const w = Object.assign({}, global.__def);
w.data = JSON.parse(JSON.stringify(global.__def.data));
w.setData = function (patch) { Object.assign(this.data, patch); };
w.onLoad(current.options);
check('资料页带回来源', w.data.from === '/pages/index/index', w.data.from);

w.save();
check('没填昵称给提示', w.data.tip === '请填写昵称', w.data.tip);

w.data.nickName = '阿星';
w.data.avatarUrl = 'https://x/a.png';
relaunches.length = 0;
w.save();

setTimeout(function () {
  check('保存后写本地资料', (storage.userProfile || {}).nickName === '阿星', JSON.stringify(storage.userProfile || {}));
  check('保存后回到来源页', String(relaunches[0] || '') === '/pages/index/index', String(relaunches[0] || ''));
  check('来源已清理', !storage['onboard:from']);

  console.log(fails.length ? '\nGUARD_FAILED: ' + fails.join(', ') : '\nGUARD_OK');
  process.exit(fails.length ? 1 : 0);
}, 420);
