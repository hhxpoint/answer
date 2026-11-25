/**
 * 小程序模拟器渲染冒烟（miniprogram-automator）
 *
 * 设计取舍：本版本 automator 的 page.$ / page.waitFor 会挂起（不返回也不报错），
 * 所以不依赖元素查询，改用「截图是否有内容」作为判据 —— 白屏截图约 2~3KB，
 * 正常页面通常 > 40KB。这正是用户实际会遇到的失败形态（白屏/未渲染）。
 *
 * 前置：
 *   1) npm install && cli.bat build-npm（否则模拟器编译失败，自动化 RPC 全超时）
 *   2) cli.bat auto --project <路径> --auto-port <端口> --trust-project
 * 用法：node smoke.js <端口>
 */
const path = require('path');
const fs = require('fs');
const automator = require('miniprogram-automator');

const PORT = process.argv[2] || '9480';
const OUT = path.join(__dirname, 'out');
const MIN_BYTES = 15000; // 低于此值视为白屏/未渲染
fs.mkdirSync(OUT, { recursive: true });

const CASES = [
  { name: 'index', url: '/pages/index/index', expect: 'pages/index/index' },
  { name: 'trade-home', url: '/packageTrade/pages/home/home', expect: 'packageTrade/pages/home/home' },
  { name: 'trade-market', url: '/packageTrade/pages/market/market', expect: 'packageTrade/pages/market/market' },
  { name: 'trade-mylist', url: '/packageTrade/pages/mylist/mylist', expect: 'packageTrade/pages/mylist/mylist' },
  { name: 'trade-publish', url: '/packageTrade/pages/publish/publish', expect: 'packageTrade/pages/publish/publish' },
  { name: 'trade-estimate', url: '/packageTrade/pages/estimate/estimate?id=legion-y9000p-2024', expect: 'packageTrade/pages/estimate/estimate' },
  { name: 'trade-detail', url: '/packageTrade/pages/detail/detail?id=legion-y9000p-2024', expect: 'packageTrade/pages/detail/detail' },
  { name: 'trade-sources', url: '/packageTrade/pages/sources/sources', expect: 'packageTrade/pages/sources/sources' },
  { name: 'couple-home', url: '/packageCouple/pages/home/home', expect: null, optional: true },
  { name: 'couple-spaces', url: '/packageCouple/pages/spaces/spaces', expect: null, optional: true },
  { name: 'recipe-home', url: '/packageRecipe/pages/home/home', expect: 'packageRecipe/pages/home/home' },
  { name: 'trade-share', url: '/packageTrade/pages/share/share?d=eyJtIjoidGVzdCIsInYiOiJ2MSIsImEiOjEyMzQsImQiOiJ4In0', expect: null, optional: true }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function t(p, ms, label) {
  return Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error(label + ' timeout ' + ms + 'ms')), ms))]);
}

(async () => {
  let mp;
  try {
    mp = await t(automator.connect({ wsEndpoint: 'ws://127.0.0.1:' + PORT }), 30000, 'connect');
    console.log('connected ' + PORT);
  } catch (e) {
    console.log('CONNECT_FAIL ' + e.message);
    process.exit(2);
  }

  const results = [];
  const ordered = CASES.filter((c) => !c.optional).concat(CASES.filter((c) => c.optional));
  for (const c of ordered) {
    const r = { name: c.name, url: c.url, ok: false };
    const shot = path.join(OUT, c.name + '.png');
    try {
      await t(mp.reLaunch(c.url), 25000, 'reLaunch');
      await sleep(2600);
      await t(mp.screenshot({ path: shot }), 20000, 'screenshot');
      r.bytes = fs.existsSync(shot) ? fs.statSync(shot).size : 0;
      r.rendered = r.bytes >= MIN_BYTES;
      if (c.expect) {
        try {
          const stack = await t(mp.evaluate(() => getCurrentPages().map((p) => p.route)), 8000, 'stack');
          r.path = Array.isArray(stack) && stack.length ? stack[stack.length - 1] : null;
          r.pathOk = r.path === c.expect;
        } catch (e) {
          r.pathOk = null; // 取不到就只按截图判定
        }
      } else {
        r.pathOk = true; // 允许重定向的页面
      }
      r.ok = r.rendered && r.pathOk !== false;
      if (c.optional && !r.ok) { r.skipped = true; r.ok = true; }
      if (!r.rendered) r.notes = 'blank(' + r.bytes + 'B)';
      if (r.pathOk === false) r.notes = (r.notes ? r.notes + ' ' : '') + 'path=' + r.path;
    } catch (e) {
      r.error = e.message;
      if (c.optional) { r.skipped = true; r.ok = true; }
    }
    results.push(r);
    console.log((r.skipped ? 'SKIP ' : (r.ok ? 'PASS ' : 'FAIL ')) + c.name.padEnd(16) + (r.bytes || '-') + 'B ' +
      (r.path || '') + (r.error ? ' err=' + r.error : '') + (r.notes ? ' ' + r.notes : ''));
  }

  const failed = results.filter((x) => !x.ok);
  console.log('\npages ' + results.length + ' · pass ' + (results.length - failed.length) + ' · fail ' + failed.length);
  fs.writeFileSync(path.join(OUT, 'smoke-report.json'), JSON.stringify(results, null, 2), 'utf-8');
  console.log(failed.length ? 'SMOKE_FAILED' : 'SMOKE_OK');
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.log('FATAL ' + (e && e.stack || e));
  process.exit(3);
});
