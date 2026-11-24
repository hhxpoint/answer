// 「我的发布」审核说明展示：rejected/hidden 且有 note 才显示，其余不显示
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'utils', 'api.js');

const LISTINGS = [
  { id: 11, title: '被驳回的', model_name: 'A', variant_label: 'v1', price: 100, status: 'rejected', images: [], review_note: '图片与描述不符，请补充实拍图' },
  { id: 12, title: '被隐藏的', model_name: 'B', variant_label: 'v2', price: 200, status: 'hidden', images: [], review_note: '疑似重复发布' },
  { id: 13, title: '已通过的', model_name: 'C', variant_label: 'v3', price: 300, status: 'approved', images: [], review_note: '历史备注' },
  { id: 14, title: '审核中的', model_name: 'D', variant_label: 'v4', price: 400, status: 'pending', images: [] },
  { id: 15, title: '驳回但无说明', model_name: 'E', variant_label: 'v5', price: 500, status: 'rejected', images: [] }
];

const fakeApi = {
  ensureLogin: function () { return Promise.resolve(); },
  request: function () { return Promise.resolve({ ok: true, listings: LISTINGS }); }
};
require.cache[API] = { id: API, filename: API, loaded: true, exports: fakeApi };

let pageDef = null;
global.Page = function (def) { pageDef = def; };
global.wx = {
  showToast: function () {},
  showModal: function () {},
  navigateTo: function () {},
  setNavigationBarTitle: function () {}
};

require(path.join(ROOT, 'pages', 'mylist', 'mylist.js'));

const page = Object.assign({}, pageDef);
page.data = JSON.parse(JSON.stringify(pageDef.data || {}));
page.setData = function (patch) { Object.assign(this.data, patch); };

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

page.load();

setTimeout(function () {
  const by = {};
  page.data.listings.forEach(function (x) { by[x.id] = x; });

  check('驳回 + 有说明 → 显示', by[11] && by[11].showReason === true);
  check('驳回说明原文保留', by[11] && by[11].reasonText === '图片与描述不符，请补充实拍图');
  check('隐藏 + 有说明 → 显示', by[12] && by[12].showReason === true);
  check('已通过 → 不显示说明', by[13] && by[13].showReason === false);
  check('待审 → 不显示说明', by[14] && by[14].showReason === false);
  check('驳回但无说明 → 不显示', by[15] && by[15].showReason === false);
  check('全部 5 条都被映射', page.data.listings.length === 5);
  check('状态文案已本地化', by[11].statusText === '未通过' && by[13].statusText === '已公开');

  console.log(fails.length ? '\nMYLIST_REASON_FAILED: ' + fails.join(', ') : '\nMYLIST_REASON_OK');
  process.exit(fails.length ? 1 : 0);
}, 60);
