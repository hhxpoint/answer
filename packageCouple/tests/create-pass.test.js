// 新建关系空间必须输入密码（1314）：前端门禁行为测试
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API_PATH = path.join(ROOT, 'utils', 'couple-api.js');
const SPACE_PATH = path.join(ROOT, 'utils', 'space.js');
const SHARE_PATH = path.join(ROOT, 'utils', 'share.js');

const calls = [];
const toasts = [];

global.wx = new Proxy({
  showToast: (o) => toasts.push(o.title),
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

// 打桩依赖，避免真发请求
require.cache[require.resolve(API_PATH)] = {
  id: API_PATH, filename: API_PATH, loaded: true,
  exports: {
    ensureLogin: () => Promise.resolve({}),
    createSpace: (data) => {
      calls.push(data);
      return Promise.resolve({ space: { id: 999, invite_code: 'ABC123' } });
    }
  }
};
require.cache[require.resolve(SPACE_PATH)] = {
  id: SPACE_PATH, filename: SPACE_PATH, loaded: true,
  exports: { setCurrentSpaceId: () => {} }
};
require.cache[require.resolve(SHARE_PATH)] = {
  id: SHARE_PATH, filename: SHARE_PATH, loaded: true,
  exports: { cover: () => '/x.jpg', homePath: () => '/h', timelineQuery: () => '' }
};

require(path.join(ROOT, 'pages', 'create', 'create.js'));

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const page = Object.assign({}, global.__def);
page.data = Object.assign({}, global.__def.data, {
  selectedType: 'partner', myLabel: '恋人', title: '我们的小空间'
});
page.setData = function (patch) { Object.assign(this.data, patch); };

// 1) 直接创建不应放行，必须先弹密码
page.onCreate();
check('点创建先弹密码框', page.data.passModal === true);
check('还没创建', calls.length === 0, 'calls=' + calls.length);

// 2) 空密码
page.confirmPass();
check('空密码被拦', page.data.passErr === '请输入密码', page.data.passErr);
check('空密码不创建', calls.length === 0);

// 3) 错误密码
page.data.passInput = '1234';
page.confirmPass();
check('错误密码被拦', page.data.passErr === '密码不正确', page.data.passErr);
check('错误密码不创建', calls.length === 0);
check('错误后弹窗还在', page.data.passModal === true);

// 4) 取消
page.cancelPass();
check('取消关闭弹窗', page.data.passModal === false);

// 5) 正确密码
page.onCreate();
page.data.passInput = '1314';
page.confirmPass();
check('弹窗已关闭', page.data.passModal === false);
check('进入创建中', page.data.creating === true);

// doCreate 里是异步链路，等一拍再断言
setTimeout(function () {
  check('正确密码放行', calls.length === 1, 'calls=' + calls.length);
  check('请求带 pass=1314', calls[0] && calls[0].pass === '1314', JSON.stringify(calls[0] || {}));
  check('请求带关系类型', calls[0] && calls[0].relation_type === 'partner');

  // 6) 密码不落界面
  const fs = require('fs');
  const wxml = fs.readFileSync(path.join(ROOT, 'pages', 'create', 'create.wxml'), 'utf8');
  check('界面不显示密码值', wxml.indexOf('1314') < 0);
  check('界面有密码输入框', wxml.indexOf('pass-input') >= 0);

  console.log(fails.length ? '\nCREATE_PASS_FAILED: ' + fails.join(', ') : '\nCREATE_PASS_OK');
  process.exit(fails.length ? 1 : 0);
}, 40);
