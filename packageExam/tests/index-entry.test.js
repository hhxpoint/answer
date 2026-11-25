// 首页入口点击测试：公考题库必须跳 packageExam，不能被考研的 goExam 覆盖
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const INDEX_JS = path.join(ROOT, 'pages', 'index', 'index.js');

const calls = [];
global.wx = new Proxy({
  navigateTo: (o) => calls.push(o.url),
  switchTab: (o) => calls.push(o.url),
  reLaunch: (o) => calls.push(o.url)
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});

global.getApp = () => ({ globalData: {}, onLaunch: () => {} });
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

calls.length = 0;
if (def.goGongkao) def.goGongkao();
check('公考入口跳 packageExam', calls[0] === '/packageExam/pages/home/home', String(calls[0]));

calls.length = 0;
if (def.goExam) def.goExam({ currentTarget: { dataset: { type: '408' } } });
check('考研入口仍跳 packagetoken', /^\/packagetoken\/pages\/exam\/exam\?type=408$/.test(String(calls[0])), String(calls[0]));

// 源码层面：Page 对象里不能有重复键
const fs = require('fs');
const src = fs.readFileSync(INDEX_JS, 'utf8');
const body = src.slice(src.indexOf('Page({'));
const occurrences = (body.match(/^\s{2}goExam\s*[:(]/gm) || []).length;
check('goExam 只定义一次', occurrences === 1, 'count=' + occurrences);


// WXML 绑定：入口必须绑到 goGongkao，而不是 goExam
const wxml = fs.readFileSync(path.join(ROOT, 'pages', 'index', 'index.wxml'), 'utf8');
const m = /class="exam-entry"[^>]*bindtap="([^"]+)"/.exec(wxml);
check('WXML 绑定 goGongkao', !!m && m[1] === 'goGongkao', m ? m[1] : 'not found');
console.log(fails.length ? '\nENTRY_FAILED: ' + fails.join(', ') : '\nENTRY_OK');
process.exit(fails.length ? 1 : 0);
