// 首页入口测试：公考题库必须跳 packageExam，不能被考研的 goExam 覆盖
// 资料门禁已统一到全局 profile-guard（由目标页 onShow 处理），入口本身只负责跳转
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const INDEX_JS = path.join(ROOT, 'pages', 'index', 'index.js');

const calls = [];
const storage = {};

global.getApp = () => ({ globalData: {} });
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

// 1) 公考入口：直接跳公考首页（资料门禁由目标页统一处理）
calls.length = 0;
def.goGongkao();
check('公考入口跳 packageExam', calls[0] === '/packageExam/pages/home/home', String(calls[0]));
check('不再跳独立 setup 页', String(calls[0]).indexOf('setup') < 0);

// 2) 考研入口未被破坏
calls.length = 0;
def.goExam({ currentTarget: { dataset: { type: '408' } } });
check('考研入口仍跳 packagetoken', /^\/packagetoken\/pages\/exam\/exam\?type=408$/.test(String(calls[0])), String(calls[0]));

// 3) 源码层面：Page 对象里不能有重复键
const src = fs.readFileSync(INDEX_JS, 'utf8');
const body = src.slice(src.indexOf('Page({'));
const occurrences = (body.match(/^\s{2}goExam\s*[:(]/gm) || []).length;
check('goExam 只定义一次', occurrences === 1, 'count=' + occurrences);

// 4) WXML 绑定
const wxml = fs.readFileSync(path.join(ROOT, 'pages', 'index', 'index.wxml'), 'utf8');
const m = /class="exam-entry"[^>]*bindtap="([^"]+)"/.exec(wxml);
check('WXML 绑定 goGongkao', !!m && m[1] === 'goGongkao', m ? m[1] : 'not found');

// 5) 默认启动页仍是首页（welcome 不能排第一）
const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
check('默认启动页是 index', app.pages[0] === 'pages/index/index', app.pages[0]);
check('welcome 已注册', app.pages.indexOf('pages/welcome/welcome') >= 0);

console.log(fails.length ? '\nENTRY_FAILED: ' + fails.join(', ') : '\nENTRY_OK');
process.exit(fails.length ? 1 : 0);
