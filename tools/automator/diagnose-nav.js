const automator = require('miniprogram-automator');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function t(p, ms, label) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(label + ' timeout')), ms))]);
}

(async () => {
  const port = process.argv[2];
// 用途：用 wx.navigateTo 直接跳目标页，打印 success/fail/pending —— 用于区分
//   「automator 的问题」还是「小程序内部页面创建的问题」
  const url = process.argv[3];
  const mp = await t(automator.connect({ wsEndpoint: 'ws://127.0.0.1:' + port }), 20000, 'connect');
  console.log('connected, target=' + url);

  await t(mp.evaluate((u) => {
    const g = typeof globalThis !== 'undefined' ? globalThis : this;
    g.__nav = { state: 'pending' };
    try {
      wx.navigateTo({
        url: u,
        success: function () { g.__nav = { state: 'success' }; },
        fail: function (e) { g.__nav = { state: 'fail', msg: (e && e.errMsg) || String(e) }; }
      });
    } catch (e) {
      g.__nav = { state: 'throw', msg: e.message };
    }
    return g.__nav.state;
  }, url), 12000, 'call');

  await sleep(4000);

  const out = await t(mp.evaluate(() => {
    const g = typeof globalThis !== 'undefined' ? globalThis : this;
    let stack = [];
    try { stack = getCurrentPages().map((p) => p.route); } catch (e) { stack = ['<err>']; }
    return { nav: g.__nav, stack };
  }), 10000, 'read');

  console.log('nav=' + JSON.stringify(out.nav));
  console.log('stack=' + JSON.stringify(out.stack));
  process.exit(0);
})().catch((e) => { console.log('FATAL ' + e.message); process.exit(1); });
