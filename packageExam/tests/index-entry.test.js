// 首页入口点击测试：公考题库必须跳 packageExam，不能被考研的 goExam 覆盖
// 门禁：没填头像昵称时先去 setup，填过直接进
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const INDEX_JS = path.join(ROOT, 'pages', 'index', 'index.js');

const calls = [];
const storage = {};

global.getApp = () => ({ globalData: {}, onLaunch: () => {} });
global.wx = new Proxy({
  navigateTo: (o) => calls.push(o.url),
  switchTab: (o) => calls.push(o.url),
  reLaunch: (o) => calls.push(o.url),
  redirectTo: (o) => calls.push(o.url),
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  request: (o) => { if (o.fail) o.fail({ errMsg: 'offline' }); }
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});

let def = null;
global.Page = (d) => { def = d; };
global.Component = () => {};
global.App = () => {};

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

require(INDEX_JS);

check('goGongkao 存在', typeof def.goGongkao === 'function');
check('考研 goExam 仍在', typeof def.goExam === 'function');

// 1) 没资料 → 先去 setup，并带上回跳目标
calls.length = 0;
def.goGongkao();
const toSetup = String(calls[0] || '');
check('未完善资料先去 setup', toSetup.indexOf('/packageExam/pages/setup/setup?from=') === 0, toSetup);
check('setup 带 from 回跳', decodeURIComponent(toSetup).indexOf('/packageExam/pages/home/home') > 0, toSetup);
check('未完善时不直接进模块', toSetup.indexOf('packageExam/pages/home/home') !== 0, toSetup);

// 2) 有资料 → 直接进公考首页
storage.userProfile = { userId: 'u5', nickName: '阿星', avatarUrl: 'https://x/a.png' };
calls.length = 0;
def.goGongkao();
check('已完善资料直接进公考首页', calls[0] === '/packageExam/pages/home/home', String(calls[0]));
check('不再跳 setup', String(calls[0]).indexOf('setup') < 0);

// 3) 考研入口未被破坏
calls.length = 0;
def.goExam({ currentTarget: { dataset: { type: '408' } } });
check('考研入口仍跳 packagetoken', /^\/packagetoken\/pages\/exam\/exam\?type=408$/.test(String(calls[0])), String(calls[0]));

// 4) 源码层面：Page 对象里不能有重复键
const src = fs.readFileSync(INDEX_JS, 'utf8');
const body = src.slice(src.indexOf('Page({'));
const occurrences = (body.match(/^\s{2}goExam\s*[:(]/gm) || []).length;
check('goExam 只定义一次', occurrences === 1, 'count=' + occurrences);

// 5) WXML 绑定：入口必须绑到 goGongkao
const wxml = fs.readFileSync(path.join(ROOT, 'pages', 'index', 'index.wxml'), 'utf8');
const m = /class="exam-entry"[^>]*bindtap="([^"]+)"/.exec(wxml);
check('WXML 绑定 goGongkao', !!m && m[1] === 'goGongkao', m ? m[1] : 'not found');

console.log(fails.length ? '\nENTRY_FAILED: ' + fails.join(', ') : '\nENTRY_OK');
process.exit(fails.length ? 1 : 0);
