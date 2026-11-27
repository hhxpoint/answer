// 新建关系空间：密码必须在「点新建」的那一刻拦（跳转前）
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'utils', 'couple-api.js');
const SHARE = path.join(ROOT, 'utils', 'share.js');
const SPACE = path.join(ROOT, 'utils', 'space.js');
const GATE = path.join(ROOT, 'utils', 'create-gate.js');
const CREATE_JS = path.join(ROOT, 'pages', 'create', 'create.js');

const nav = [];
const created = [];
const toasts = [];

global.wx = new Proxy({
  navigateTo: (o) => nav.push(o.url),
  redirectTo: (o) => nav.push(o.url),
  showToast: (o) => toasts.push(o.title),
  showShareMenu: () => {},
  getStorageSync: () => '',
  setStorageSync: () => {},
  removeStorageSync: () => {},
  getStorageInfoSync: () => ({ keys: [] }),
  vibrateShort: () => {}
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});
global.Page = (d) => { global.__def = d; };

require.cache[require.resolve(API)] = {
  id: API, filename: API, loaded: true,
  exports: {
    ensureLogin: () => Promise.resolve({}),
    createSpace: (d) => { created.push(d); return Promise.resolve({ space: { id: 1 } }); }
  }
};
require.cache[require.resolve(SHARE)] = {
  id: SHARE, filename: SHARE, loaded: true,
  exports: { cover: () => '/x.jpg', homePath: () => '/h', timelineQuery: () => '' }
};
require.cache[require.resolve(SPACE)] = {
  id: SPACE, filename: SPACE, loaded: true,
  exports: { getCurrentSpaceId: () => 1, setCurrentSpaceId: () => {} }
};

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

function freshPage(jsPath) {
  delete require.cache[require.resolve(jsPath)];
  require(jsPath);
  const def = global.__def;
  const page = Object.assign({}, def);
  page.data = JSON.parse(JSON.stringify(def.data || {}));
  page.setData = function (patch) { Object.assign(this.data, patch); };
  return page;
}

// ---------- 空间列表页 ----------
const spaces = freshPage(path.join(ROOT, 'pages', 'spaces', 'spaces.js'));

spaces.goCreate();
check('点新建先弹密码框', spaces.data.passModal === true);
check('弹窗时不跳转', nav.length === 0, JSON.stringify(nav));

spaces.confirmPass();
check('空密码提示', spaces.data.passErr === '请输入密码', spaces.data.passErr);
check('空密码不跳转', nav.length === 0);

spaces.data.passInput = '1234';
spaces.confirmPass();
check('错误密码提示', spaces.data.passErr === '密码不正确', spaces.data.passErr);
check('错误密码不跳转', nav.length === 0, JSON.stringify(nav));

spaces.data.passInput = '1314';
spaces.confirmPass();
check('正确密码才跳创建页', nav.length === 1 && nav[0].indexOf('/packageCouple/pages/create/create') >= 0, JSON.stringify(nav));
check('跳转后弹窗关闭', spaces.data.passModal === false);

const gate = require(GATE);
check('授权已记录', gate.peek() === true);

// ---------- 创建页：已授权就不再问 ----------
const create = freshPage(CREATE_JS);
create.data.selectedType = 'partner';
create.data.myLabel = '恋人';
create.data.title = '测试空间';
create.onCreate();
check('已授权时不再弹窗', create.data.passModal === false);
check('已授权直接进入创建中', create.data.creating === true);

setTimeout(function () {
  check('创建请求已发出', created.length === 1, 'n=' + created.length);
  check('请求带正确密码', created[0] && created[0].pass === '1314', JSON.stringify(created[0] || {}));
  check('授权被消费一次', gate.peek() === false);

  // ---------- 创建页：直接打开（无授权）仍要密码 ----------
  const create2 = freshPage(CREATE_JS);
  create2.onCreate();
  check('无授权时自己弹窗', create2.data.passModal === true);

  // ---------- 界面不泄露密码 ----------
  const fs = require('fs');
  ['create', 'spaces'].forEach(function (p) {
    const wxml = fs.readFileSync(path.join(ROOT, 'pages', p, p + '.wxml'), 'utf8');
    check(p + ' 界面不含密码值', wxml.indexOf('1314') < 0);
  });

  console.log(fails.length ? '\nSPACES_GATE_FAILED: ' + fails.join(', ') : '\nSPACES_GATE_OK');
  process.exit(fails.length ? 1 : 0);
}, 50);
