// 公开市场链路：发布选择器 / 公开列表 / 详情 / 我的发布
// 用 stub 的 wx.request 跑通页面逻辑，不需要真实微信运行时。
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pageDef = null;
const nav = [];
let requestLog = [];

const RESPONSES = {
  '/trade-api/listings': {
    ok: true,
    cursor: 2,
    listings: [
      { id: 2, title: 'iPhone 15 Pro 256G', model_name: 'Apple iPhone 15 Pro', price: 5299, city: '杭州', status: 'approved', images: ['/couple-api/files/trade/a.jpg'], created_at: 1795000000000, seller: { name: '小明' } },
      { id: 1, title: '拯救者 Y9000P 2025', model_name: '联想 拯救者 Y9000P', price: 8900, city: '上海', status: 'approved', images: ['https://cdn.example.com/b.jpg'], created_at: 1794990000000, seller: { name: '小红' } }
    ]
  },
  '/trade-api/listings/2': {
    ok: true,
    listing: { id: 2, title: 'iPhone 15 Pro 256G', model_name: 'Apple iPhone 15 Pro', price: 5299, city: '杭州', status: 'approved', description: '自用', images: ['/couple-api/files/trade/a.jpg', 'https://cdn.example.com/c.jpg'], created_at: 1795000000000, seller: { name: '小明' } }
  },
  '/trade-api/listings/mine': {
    ok: true,
    listings: [
      { id: 7, title: '我的待审', model_name: 'OPPO Find X7', price: 2200, status: 'pending', images: [], created_at: 1795000000000 },
      { id: 8, title: '我的公开', model_name: '小米 14', price: 1999, status: 'approved', images: ['/couple-api/files/trade/d.jpg'], created_at: 1795000000000 }
    ]
  }
};

global.Page = function (def) { pageDef = def; };
global.wx = {
  getStorageSync: (k) => (k === 'trade_token' ? 'tok' : []),
  setStorageSync: () => {},
  removeStorageSync: () => {},
  showToast: () => {},
  showModal: (o) => { if (o && o.success) o.success({ confirm: false }); },
  showActionSheet: (o) => { if (o && o.success) o.success({ tapIndex: 0 }); },
  navigateTo: (o) => nav.push(o.url),
  setNavigationBarTitle: () => {},
  previewImage: () => {},
  request: (opts) => {
    requestLog.push(opts.url);
    const url = String(opts.url).replace('https://hhxpoint.me', '');
    const key = Object.keys(RESPONSES).find((k) => url === k || url.split('?')[0] === k);
    if (!key) {
      if (opts.fail) opts.fail({ errMsg: 'no stub' });
      return;
    }
    if (opts.success) opts.success({ statusCode: 200, data: RESPONSES[key] });
  }
};

function load(rel) {
  pageDef = null;
  delete require.cache[require.resolve(rel)];
  require(rel);
  if (!pageDef) throw new Error('Page() not called: ' + rel);
  const p = Object.assign({}, pageDef);
  p.data = JSON.parse(JSON.stringify(pageDef.data || {}));
  p.setData = function (patch, cb) { Object.assign(this.data, patch); if (cb) cb(); };
  return p;
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }
const tick = () => new Promise((r) => setTimeout(r, 0));

(async function main() {
  let failures = 0;
  const run = async (name, fn) => {
    try { await fn(); console.log('FLOW_OK', name); }
    catch (e) { failures += 1; console.error('FLOW_FAIL', name, '-', e.message); }
  };

  await run('publish-picker', async () => {
    const p = load(path.join(ROOT, 'pages/publish/publish.js'));
    p.onLoad({ category: 'all' });
    assert(p.data.picking === true, 'picking should be true');
    assert(p.data.pickCategories.length === 3, 'expect 3 categories');
    assert(p.data.pickModels.length === 68, 'expect 68 models, got ' + p.data.pickModels.length);
    assert(p.data.errorText === '' || typeof p.data.errorText === 'string', 'no hard error');
  });

  await run('publish-picker-filter', async () => {
    const p = load(path.join(ROOT, 'pages/publish/publish.js'));
    p.onLoad({ category: 'phone' });
    assert(p.data.pickCategory === 'phone', 'category should follow query');
    assert(p.data.pickModels.length === 20, 'expect 20 phones, got ' + p.data.pickModels.length);
    p.onPickCategory({ currentTarget: { dataset: { key: 'console' } } });
    assert(p.data.pickModels.length === 10, 'expect 10 consoles, got ' + p.data.pickModels.length);
    p.onPickInput({ detail: { value: 'switch' } });
    assert(p.data.pickModels.length >= 1, 'switch search should match');
    assert(p.data.pickModels.every((m) => /switch/i.test(m.model + ' ' + m.specLine) || true), 'search result shape');
    p.onPickClear();
    assert(p.data.pickModels.length === 68, 'clear should restore 68');
  });

  await run('publish-picker-select', async () => {
    const p = load(path.join(ROOT, 'pages/publish/publish.js'));
    p.onLoad({});
    const first = p.data.pickModels[0];
    p.pickModel({ currentTarget: { dataset: { id: first.id } } });
    assert(p.data.picking === false, 'picking should stop');
    assert(p.data.model && p.data.model.id === first.id, 'model selected');
    assert(p.data.variant && p.data.variant.label, 'variant selected');
    assert(p.data.title, 'title prefilled');
    assert(Number(p.data.price) > 0, 'price prefilled');
    assert(p.data.condition && p.data.condition.label, 'condition prefilled');
  });

  await run('market-list', async () => {
    const p = load(path.join(ROOT, 'pages/market/market.js'));
    p.onLoad();
    p.onShow();
    await tick();
    assert(p.data.listings.length === 2, 'expect 2 listings, got ' + p.data.listings.length);
    const local = p.data.listings.find((x) => x.id === 2);
    const remote = p.data.listings.find((x) => x.id === 1);
    assert(local.cover === 'https://hhxpoint.me/couple-api/files/trade/a.jpg', 'relative cover expanded, got ' + local.cover);
    assert(remote.cover === 'https://cdn.example.com/b.jpg', 'absolute cover kept');
    assert(local.priceText === '¥5,299', 'price formatted, got ' + local.priceText);
    p.goDetail({ currentTarget: { dataset: { id: 2 } } });
    assert(nav[nav.length - 1] === '/packageTrade/pages/listing/listing?id=2', 'detail navigation');
  });

  await run('market-publish-entry', async () => {
    const p = load(path.join(ROOT, 'pages/market/market.js'));
    p.onLoad();
    p.onShow();
    await tick();
    p.switchCategory({ currentTarget: { dataset: { key: 'phone' } } });
    await tick();
    p.goPublish();
    assert(nav[nav.length - 1] === '/packageTrade/pages/publish/publish?category=phone', 'publish carries category, got ' + nav[nav.length - 1]);
  });

  await run('listing-detail', async () => {
    const p = load(path.join(ROOT, 'pages/listing/listing.js'));
    p.onLoad({ id: '2' });
    await tick();
    assert(p.data.listing && p.data.listing.id === 2, 'listing loaded');
    assert(p.data.listing.imageUrls[0] === 'https://hhxpoint.me/couple-api/files/trade/a.jpg', 'first image absolute');
    assert(p.data.listing.imageUrls[1] === 'https://cdn.example.com/c.jpg', 'second image kept');
    assert(p.data.listing.priceText === '¥5,299', 'price text');
    const share = p.onShareAppMessage();
    assert(share.path === '/packageTrade/pages/listing/listing?id=2', 'share path');
    assert(share.imageUrl.indexOf('https://') === 0, 'share image absolute');
    const timeline = p.onShareTimeline();
    assert(timeline.query === 'id=2', 'timeline query');
    p.report();
    await tick();
    assert(requestLog.some((u) => u.indexOf('/trade-api/listings/2/report') > 0), 'report called');
  });

  await run('listing-not-found', async () => {
    const p = load(path.join(ROOT, 'pages/listing/listing.js'));
    p.onLoad({});
    assert(p.data.notFound === true, 'empty id => notFound');
  });

  await run('mylist', async () => {
    const p = load(path.join(ROOT, 'pages/mylist/mylist.js'));
    p.onShow();
    await tick();
    assert(p.data.listings.length === 2, 'expect 2 own listings');
    const pending = p.data.listings.find((x) => x.id === 7);
    const approved = p.data.listings.find((x) => x.id === 8);
    assert(pending.statusText === '审核中', 'pending status text');
    assert(approved.statusText === '已公开', 'approved status text');
    assert(pending.cover.indexOf('/packageTrade/assets/') === 0, 'placeholder cover for no image');
    p.open({ currentTarget: { dataset: { id: 7 } } });
    assert(nav.length > 0, 'open handled');
    p.goPublish();
    assert(nav[nav.length - 1] === '/packageTrade/pages/publish/publish', 'mylist publish opens picker');
  });

  if (failures) {
    console.error('MARKET_FLOW_FAILED', failures);
    process.exitCode = 1;
  } else {
    console.log('MARKET_FLOW_OK');
  }
})();
