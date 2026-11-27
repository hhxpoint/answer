// 新建关系空间：密码不是 1314 时「静默分流」到静态故事页，不报错、不创建
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'utils', 'couple-api.js');
const SHARE = path.join(ROOT, 'utils', 'share.js');
const SPACE = path.join(ROOT, 'utils', 'space.js');
const GATE = path.join(ROOT, 'utils', 'entry-code.js');
const CREATE_JS = path.join(ROOT, 'pages', 'create', 'create.js');

const nav = [];
const created = [];

global.wx = new Proxy({
  navigateTo: (o) => nav.push(o.url),
  redirectTo: (o) => nav.push(o.url),
  reLaunch: (o) => nav.push(o.url),
  showToast: () => {},
  hideShareMenu: () => {},
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
global.getCurrentPages = () => [{ route: 'packageCouple/pages/story/story' }];

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

const STORY = '/packageCouple/pages/intro/intro';
const CREATE = '/packageCouple/pages/create/create';

// ---------- 空间列表页 ----------
const spaces = freshPage(path.join(ROOT, 'pages', 'spaces', 'spaces.js'));

spaces.goCreate();
check('点新建先弹密码框', spaces.data.passModal === true);
check('弹窗时不跳转', nav.length === 0);

// 空密码 → 故事页
nav.length = 0;
spaces.confirmPass();
check('空密码跳故事页', nav[0] === STORY, JSON.stringify(nav));
check('空密码不报错', !spaces.data.passErr, String(spaces.data.passErr || ''));
check('弹窗已关闭', spaces.data.passModal === false);

// 错误密码 → 故事页
spaces.goCreate();
spaces.data.passInput = '1234';
nav.length = 0;
spaces.confirmPass();
check('错误密码跳故事页', nav[0] === STORY, JSON.stringify(nav));
check('错误密码不报错', !spaces.data.passErr);

// 正确密码 → 创建页
spaces.goCreate();
spaces.data.passInput = '1314';
nav.length = 0;
spaces.confirmPass();
check('正确密码跳创建页', nav[0] === CREATE, JSON.stringify(nav));

const gate = require(GATE);
check('授权已记录', gate.peek() === true);

// ---------- 创建页：已授权不再问 ----------
const create = freshPage(CREATE_JS);
create.data.selectedType = 'partner';
create.data.myLabel = '恋人';
create.data.title = '测试空间';
create.onCreate();
check('已授权时不再弹窗', create.data.passModal === false);

setTimeout(function () {
  check('直接发起创建', created.length === 1, 'n=' + created.length);
  check('请求带正确密码', created[0] && created[0].pass === '1314');
  check('授权被消费一次', gate.peek() === false);

  // ---------- 创建页直接打开：错密码也去故事页 ----------
  const create2 = freshPage(CREATE_JS);
  create2.onCreate();
  check('无授权时自己弹窗', create2.data.passModal === true);
  create2.data.passInput = 'abcd';
  nav.length = 0;
  create2.confirmPass();
  check('创建页错密码跳故事页', nav[0] === STORY, JSON.stringify(nav));
  check('创建页错密码不报错', !create2.data.passErr);
  check('创建页错密码不创建', created.length === 1);

  // ---------- 界面不出现密码与错误文案 ----------
  const fs = require('fs');
  ['create', 'spaces', 'intro'].forEach(function (p) {
    const wxml = fs.readFileSync(path.join(ROOT, 'pages', p, p + '.wxml'), 'utf8');
    check(p + ' 不含密码值', wxml.indexOf('1314') < 0);
    check(p + ' 不含「密码不正确」', wxml.indexOf('密码不正确') < 0);
    const js = fs.readFileSync(path.join(ROOT, 'pages', p, p + '.js'), 'utf8');
    check(p + ' js 不含「密码不正确」', js.indexOf('密码不正确') < 0);
  });

  console.log(fails.length ? '\nSPACES_GATE_FAILED: ' + fails.join(', ') : '\nSPACES_GATE_OK');
  process.exit(fails.length ? 1 : 0);
}, 50);
