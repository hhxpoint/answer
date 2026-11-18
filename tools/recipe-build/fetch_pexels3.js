// 第三轮：补齐 3 个薄弱菜（土豆丝/紫菜蛋花汤/蒜苔炒肉）
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const OUT = '/tmp/pexels3';
const RAW = '/tmp/pexels3_raw';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const JINA = 'https://r.jina.ai/http://www.pexels.com/search/';
const QUERIES = [
  ['suanla_tudousi', 'shredded potato stir fry', ['potato']],
  ['suanla_tudousi', 'hot sour potato', ['potato']],
  ['zicai_danhua_tang', 'egg drop soup', ['egg', 'soup']],
  ['suantai_chaorou', 'garlic scapes pork', ['garlic', 'scape', 'pork']],
  ['fanqie_dantang', 'tomato egg drop soup', ['tomato', 'egg']],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchText(url) { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }
async function download(url, dst) { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error('HTTP ' + r.status); fs.writeFileSync(dst, Buffer.from(await r.arrayBuffer())); }
function compress(src, dst) { execFileSync('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', 'scale=800:600:force_original_aspect_ratio=increase,crop=800:600', '-q:v', '3', dst], { timeout: 30000 }); }
function parseCards(md) {
  const re = /!\[Image\s+\d+:\s*([^\]]*)\]\((https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^)]+)\)/g;
  const out = []; const seen = {}; let m;
  while ((m = re.exec(md))) { if (seen[m[3]]) continue; seen[m[3]] = 1; out.push({ id: m[3], alt: m[1] || '', url: m[2] }); }
  return out;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(RAW, { recursive: true });
  const report = [];
  for (let qi = 0; qi < QUERIES.length; qi++) {
    const [id, term, kws] = QUERIES[qi];
    let md = '';
    try { md = await fetchText(JINA + encodeURIComponent(term)); } catch (e) { console.log('ERR', id, e.message); await sleep(2500); continue; }
    const cards = parseCards(md).map((c) => { const h = c.alt.toLowerCase(); c.score = kws.reduce((n, k) => n + (h.indexOf(k) >= 0 ? 1 : 0), 0); return c; }).filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
    const saved = [];
    for (let i = 0; i < Math.min(4, cards.length); i++) {
      const c = cards[i];
      const base = c.url.split('?')[0];
      const ext = /\.png(\?|$)/i.test(c.url) ? 'png' : 'jpg';
      const raw = path.join(RAW, id + '_q' + qi + '_' + i + '.' + ext);
      const out = path.join(OUT, id + '_q' + qi + '_' + i + '.jpg');
      try { await download(base + '?auto=compress&cs=tinysrgb&w=1400', raw); compress(raw, out); saved.push({ index: i, file: out, alt: c.alt.slice(0, 160), score: c.score, id: c.id, page: 'https://www.pexels.com/photo/' + c.id + '/', license: 'Pexels License (free to use)', query: term }); console.log('[OK]', id, term, i, c.alt.slice(0, 70)); } catch (e) { console.log('[FAIL]', id, i, e.message); }
      await sleep(400);
    }
    report.push({ id, query: term, candidates: saved });
    await sleep(2200);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  execFileSync('/bin/tar', ['czf', '/tmp/pexels3.tar.gz', '-C', '/tmp', 'pexels3']);
  console.log('done; tar', Math.round(fs.statSync('/tmp/pexels3.tar.gz').size / 1024) + 'KB');
})();
