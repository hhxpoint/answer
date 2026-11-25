/**
 * 小程序模拟器冒烟 v3：渲染 + 内容双重断言
 *
 * 判定分三层：
 *   1) 截图字节数 ≥ 15KB      → 页面渲染出来了（白屏约 2.5KB）
 *   2) getCurrentPages() 末位 → 真的跳到了目标路由
 *   3) 页面 data 语义断言     → 内容对（数据加载成功、字段齐全）
 *
 * 前置：npm install + cli.bat build-npm（否则编译失败、RPC 全超时）
 * 用法：node smoke.js <端口>
 * 注意：automator 实例跑久了会退化，建议用 run-smoke.ps1（每次重启实例）
 */
const path = require('path');
const fs = require('fs');
const automator = require('miniprogram-automator');

const PORT = process.argv[2] || '9490';
const OUT = path.join(__dirname, 'out');
const MIN_BYTES = 15000;
fs.mkdirSync(OUT, { recursive: true });

const CASES = [
  {
    name: 'index', url: '/pages/index/index', expect: 'pages/index/index',
    check: (d) => [true, '']
  },
  {
    name: 'trade-home', url: '/packageTrade/pages/home/home', expect: 'packageTrade/pages/home/home',
    // 68 款行情：分类 >= 3，且总数/结果至少有一个被填充
    check: (d) => {
      const cats = Array.isArray(d.categories) ? d.categories.length : 0;
      const total = Math.max(Number(d.total) || 0, Number(d.recordCount) || 0);
      return [cats >= 3, 'categories=' + cats + ' total=' + total];
    }
  },
  {
    name: 'trade-market', url: '/packageTrade/pages/market/market', expect: 'packageTrade/pages/market/market',
    check: (d) => [Array.isArray(d.categories) && d.categories.length >= 3 && Array.isArray(d.listings),
      'categories=' + (d.categories || []).length + ' listings=' + (d.listings || []).length]
  },
  {
    name: 'trade-mylist', url: '/packageTrade/pages/mylist/mylist', expect: 'packageTrade/pages/mylist/mylist',
    check: (d) => [Array.isArray(d.listings), 'listings=' + (d.listings || []).length]
  },
  {
    name: 'trade-publish', url: '/packageTrade/pages/publish/publish', expect: 'packageTrade/pages/publish/publish',
    check: (d) => [d.picking === true || d.model !== undefined, 'picking=' + d.picking]
  },
  {
    name: 'trade-estimate', url: '/packageTrade/pages/estimate/estimate?id=legion-y9000p-2024', expect: 'packageTrade/pages/estimate/estimate',
    check: (d) => [!!d.model && d.notFound !== true, 'model=' + (d.model && d.model.model_name)]
  },
  {
    name: 'trade-detail', url: '/packageTrade/pages/detail/detail?id=legion-y9000p-2024', expect: 'packageTrade/pages/detail/detail',
    check: (d) => {
      const name = (d.model && (d.model.model || d.model.model_name)) || '';
      const specs = Array.isArray(d.specs) ? d.specs.length : 0;
      return [/Y9000P/i.test(name) && d.notFound !== true && specs > 0,
        'model=' + name + ' specs=' + specs];
    }
  },
  {
    // 该页 sources.js 是 Page({})，内容全在静态 WXML 里，无 data 可断言 → 仅截图判定
    name: 'trade-sources', url: '/packageTrade/pages/sources/sources', expect: 'packageTrade/pages/sources/sources'
  },
  {
    name: 'recipe-home', url: '/packageRecipe/pages/home/home', expect: 'packageRecipe/pages/home/home',
    check: (d) => {
      const n = Array.isArray(d.results) ? d.results.length : 0;
      return [n > 0, 'results=' + n];
    }
  },
  // 依赖线上接口 / 分享参数，本机网络不通会挂起；放最后并计 SKIP
  { name: 'couple-home', url: '/packageCouple/pages/home/home', optional: true },
  { name: 'couple-spaces', url: '/packageCouple/pages/spaces/spaces', optional: true },
  { name: 'trade-share', url: '/packageTrade/pages/share/share?d=eyJtIjoidGVzdCIsInYiOiJ2MSIsImEiOjEyMzQsImQiOiJ4In0', optional: true }
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
    const r = { name: c.name, url: c.url, ok: false, checks: [] };
    const shot = path.join(OUT, c.name + '.png');
    try {
      await t(mp.reLaunch(c.url), 25000, 'reLaunch');
      await sleep(2600);

      await t(mp.screenshot({ path: shot }), 20000, 'screenshot');
      r.bytes = fs.existsSync(shot) ? fs.statSync(shot).size : 0;
      r.rendered = r.bytes >= MIN_BYTES;
      r.checks.push(['render', r.rendered, r.bytes + 'B']);

      // 路由 + 页面数据（一次 evaluate 拿到，避免多次往返）
      const snap = await t(mp.evaluate(() => {
        const ps = getCurrentPages();
        const p = ps[ps.length - 1];
        return { route: p.route, data: p.data };
      }), 12000, 'evaluate');
      r.path = snap && snap.route;
      r.checks.push(['route', !c.expect || r.path === c.expect, r.path || '']);

      if (c.check && snap && snap.data) {
        let verdict = [false, ''];
        try {
          verdict = c.check(snap.data) || [false, 'check returned empty'];
        } catch (e) {
          verdict = [false, 'check threw: ' + e.message];
        }
        r.checks.push(['data', !!verdict[0], verdict[1] || '']);
      }

      r.ok = r.checks.every((x) => x[1]);
    } catch (e) {
      r.error = e.message;
      r.checks.push(['exec', false, e.message]);
    }

    if (c.optional && !r.ok) { r.skipped = true; r.ok = true; }
    results.push(r);

    const tag = r.skipped ? 'SKIP' : (r.ok ? 'PASS' : 'FAIL');
    const detail = r.checks.map((x) => (x[1] ? '' : x[0] + ':' + x[2])).filter(Boolean).join(' ');
    console.log(tag.padEnd(5) + c.name.padEnd(16) + (r.bytes || '-') + 'B ' + (r.path || '') +
      (detail ? '  ✗ ' + detail : '') + (r.error && !r.skipped ? '  err=' + r.error : ''));
  }

  const pass = results.filter((x) => x.ok && !x.skipped).length;
  const skip = results.filter((x) => x.skipped).length;
  const fail = results.filter((x) => !x.ok).length;
  console.log('\n=== summary ===');
  console.log('pages ' + results.length + ' · PASS ' + pass + ' · SKIP ' + skip + ' · FAIL ' + fail);
  fs.writeFileSync(path.join(OUT, 'smoke-report.json'), JSON.stringify({ pass, skip, fail, results }, null, 2), 'utf-8');
  console.log(fail === 0 ? 'SMOKE_OK' : 'SMOKE_FAILED');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.log('FATAL ' + (e && e.stack || e));
  process.exit(3);
});
