// 创建页：直接打开时的密码分支（对 → 创建；错 → 静态故事页，不报错）
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'utils', 'couple-api.js');
const SHARE = path.join(ROOT, 'utils', 'share.js');
const SPACE = path.join(ROOT, 'utils', 'space.js');

const nav = [];
const created = [];

global.wx = new Proxy({
  navigateTo: (o) => nav.push(o.url),
  redirectTo: (o) => nav.push(o.url),
  showToast: () => {},
  hideShareMenu: () => {},
  showShareMenu: () => {},
  getStorageSync: () => '',
  setStorageSync: () => {},
  removeStorageSync: () => {},
  getStorageInfoSync: () => ({ keys: [] })
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});
global.Page = (d) => { global.__def = d; };
global.getCurrentPages = () => [{ route: 'packageCouple/pages/create/create' }];

require.cache[require.resolve(API)] = {
  id: API, filename: API, loaded: true,
  exports: {
    ensureLogin: () => Promise.resolve({}),
    createSpace: (d) => { created.push(d); return Promise.resolve({ space: { id: 9, invite_code: 'X1' } }); }
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

function freshPage() {
  const js = path.join(ROOT, 'pages', 'create', 'create.js');
  delete require.cache[require.resolve(js)];
  require(js);
  const def = global.__def;
  const page = Object.assign({}, def);
  page.data = JSON.parse(JSON.stringify(def.data || {}));
  page.data.selectedType = 'partner';
  page.data.myLabel = '恋人';
  page.data.title = '我们的小空间';
  page.setData = function (patch) { Object.assign(this.data, patch); };
  return page;
}

const STORY = '/packageCouple/pages/story/story';

// 1) 没授权 → 先弹窗
const a = freshPage();
a.onCreate();
check('点创建先弹密码框', a.data.passModal === true);
check('弹窗时未创建', created.length === 0);

// 2) 错误密码 → 故事页
a.data.passInput = '0000';
nav.length = 0;
a.confirmPass();
check('错误密码跳故事页', nav[0] === STORY, JSON.stringify(nav));
check('错误密码不创建', created.length === 0);
check('错误密码不报错', !a.data.passErr, String(a.data.passErr || ''));
check('弹窗关闭', a.data.passModal === false);

// 3) 正确密码 → 创建
const b = freshPage();
b.onCreate();
b.data.passInput = '1314';
nav.length = 0;
b.confirmPass();
check('正确密码进入创建中', b.data.creating === true);
check('正确密码不跳故事页', nav.length === 0, JSON.stringify(nav));

setTimeout(function () {
  check('创建请求已发出', created.length === 1, 'n=' + created.length);
  check('请求带 pass', created[0] && created[0].pass === '1314', JSON.stringify(created[0] || {}));

  // 4) 故事页自身：无分享能力
  const storyJs = require('fs').readFileSync(path.join(ROOT, 'pages', 'story', 'story.js'), 'utf8');
  check('故事页没有分享回调', storyJs.indexOf('onShareAppMessage') < 0);
  check('故事页默认关闭分享菜单', storyJs.indexOf('hideShareMenu') >= 0);
  const storyWxml = require('fs').readFileSync(path.join(ROOT, 'pages', 'story', 'story.wxml'), 'utf8');
  check('故事页无 open-type=share', storyWxml.indexOf('open-type="share"') < 0);

  console.log(fails.length ? '\nCREATE_PASS_FAILED: ' + fails.join(', ') : '\nCREATE_PASS_OK');
  process.exit(fails.length ? 1 : 0);
}, 50);
