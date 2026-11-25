// 举报后若触发自动下架：弹告知框 + 返回；冷启动无页面栈时兜底回市场页
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'utils', 'api.js');

let response = { ok: true, reported: true, report_count: 3, auto_hidden: true };
let failBack = false;
const calls = { modal: [], toast: [], back: 0, relaunch: null };

const fakeApi = {
  ensureLogin: function () { return Promise.resolve(); },
  request: function () { return Promise.resolve(response); }
};
require.cache[API] = { id: API, filename: API, loaded: true, exports: fakeApi };

let pageDef = null;
global.Page = function (def) { pageDef = def; };
global.wx = {
  showActionSheet: function (o) { if (o && o.success) o.success({ tapIndex: 0 }); },
  showToast: function (o) { calls.toast.push(o.title); },
  showModal: function (o) { calls.modal.push({ title: o.title, content: o.content }); if (o.success) o.success({ confirm: true }); },
  navigateBack: function (o) {
    calls.back += 1;
    if (failBack && o && o.fail) o.fail({ errMsg: 'navigateBack:fail no page' });
  },
  reLaunch: function (o) { calls.relaunch = o.url; },
  navigateTo: function () {},
  setNavigationBarTitle: function () {},
  previewImage: function () {},
  getStorageSync: function () { return ''; },
  setStorageSync: function () {},
  showShareMenu: function () {}
};

require(path.join(ROOT, 'pages', 'listing', 'listing.js'));

const page = Object.assign({}, pageDef);
page.data = JSON.parse(JSON.stringify(pageDef.data || {}));
page.data.listing = { id: 9, title: 'x', images: [], price: 1 };
page.setData = function (patch) { Object.assign(this.data, patch); };

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

function reset() {
  calls.modal = [];
  calls.toast = [];
  calls.back = 0;
  calls.relaunch = null;
}

const steps = [
  function () {
    // 场景 1：触发自动下架，正常有上一页
    reset();
    failBack = false;
    response = { ok: true, reported: true, report_count: 3, auto_hidden: true };
    page.report();
    setTimeout(function () {
      check('触发自动下架时弹告知框', calls.modal.length === 1, 'n=' + calls.modal.length);
      check('文案包含「自动下架」', calls.modal[0] && calls.modal[0].content.indexOf('自动下架') >= 0);
      check('不弹普通 toast', calls.toast.length === 0);
      check('返回上一页', calls.back === 1, 'back=' + calls.back);
      steps[1]();
    }, 50);
  },
  function () {
    // 场景 2：冷启动无页面栈 → navigateBack 失败 → 兜底回市场
    reset();
    failBack = true;
    response = { ok: true, reported: true, report_count: 3, auto_hidden: true };
    page.report();
    setTimeout(function () {
      check('navigateBack 失败时兜底 reLaunch', calls.relaunch === '/packageTrade/pages/market/market',
        'relaunch=' + calls.relaunch);
      steps[2]();
    }, 50);
  },
  function () {
    // 场景 3：未触发自动下架 → 普通 toast
    reset();
    failBack = false;
    response = { ok: true, reported: true, report_count: 1, auto_hidden: false };
    page.report();
    setTimeout(function () {
      check('未触发时只弹 toast', calls.toast.length === 1 && calls.modal.length === 0,
        'toast=' + calls.toast.join(',') + ' modal=' + calls.modal.length);
      console.log(fails.length ? '\nREPORT_AUTOHIDE_FAILED: ' + fails.join(', ') : '\nREPORT_AUTOHIDE_OK');
      process.exit(fails.length ? 1 : 0);
    }, 50);
  }
];

steps[0]();
