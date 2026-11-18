// Pexels 二次采集：针对第一轮匹配不佳的菜，换更精准的英文查询
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = '/tmp/pexels2';
const RAW = '/tmp/pexels2_raw';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const JINA = 'https://r.jina.ai/http://www.pexels.com/search/';

const QUERIES = [
  ['qingchao_shishu', 'stir fried greens', ['stir', 'greens', 'vegetable']],
  ['suanla_tudousi', 'potato stir fry', ['potato']],
  ['suanrong_fensi_wawacai', 'cabbage stir fry', ['cabbage']],
  ['suantai_chaorou', 'garlic scapes stir fry', ['garlic', 'scape']],
  ['yiner_lianzi_geng', 'white fungus soup', ['fungus', 'soup']],
  ['yuxiang_rousi', 'shredded pork stir fry', ['pork', 'shredded']],
  ['qingjiao_rousi', 'green pepper stir fry', ['pepper']],
  ['fanqie_dantang', 'tomato egg soup', ['tomato', 'egg']],
  ['hongshao_jitui', 'braised chicken', ['chicken', 'braised']],
  ['pidan_shourou_zhou', 'century egg congee', ['congee', 'egg']],
  ['zicai_danhua_tang', 'seaweed egg soup', ['seaweed', 'egg']],
  ['ganbian_doujiao', 'dry fried green beans', ['bean', 'green']],
  ['fanqie_chaodan', 'tomato scrambled eggs', ['tomato', 'egg']],
  ['shousi_baocai', 'hand torn cabbage', ['cabbage']],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.text();
}
async function download(url, dst) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  fs.writeFileSync(dst, Buffer.from(await res.arrayBuffer()));
}
function compress(src, dst) {
  execFileSync('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
    '-vf', 'scale=800:600:force_original_aspect_ratio=increase,crop=800:600', '-q:v', '3', dst], { timeout: 30000 });
}
function parseCards(md) {
  const re = /!\[Image\s+\d+:\s*([^\]]*)\]\((https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^)]+)\)/g;
  const out = [];
  const seen = {};
  let m;
  while ((m = re.exec(md))) {
    if (seen[m[3]]) continue;
    seen[m[3]] = 1;
    out.push({ id: m[3], alt: m[1] || '', url: m[2] });
  }
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RAW, { recursive: true });
  const report = [];
  for (const [id, term, kws] of QUERIES) {
    let md = '';
    try { md = await fetchText(JINA + encodeURIComponent(term)); } catch (e) {
      console.log('[ERR]', id, e.message); report.push({ id, query: term, candidates: [] }); await sleep(2500); continue;
    }
    const cards = parseCards(md).map((c) => {
      const hay = c.alt.toLowerCase();
      c.score = kws.reduce((n, k) => n + (hay.indexOf(k) >= 0 ? 1 : 0), 0);
      return c;
    }).filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
    const saved = [];
    for (let i = 0; i < Math.min(4, cards.length); i++) {
      const c = cards[i];
      const base = c.url.split('?')[0];
      const ext = /\.png(\?|$)/i.test(c.url) ? 'png' : 'jpg';
      const raw = path.join(RAW, id + '_' + i + '.' + ext);
      const out = path.join(OUT, id + '_' + i + '.jpg');
      try {
        await download(base + '?auto=compress&cs=tinysrgb&w=1400', raw);
        compress(raw, out);
        saved.push({ index: i, file: out, alt: c.alt.slice(0, 160), score: c.score, id: c.id, page: 'https://www.pexels.com/photo/' + c.id + '/', license: 'Pexels License (free to use)' });
        console.log('[OK]', id, i, c.alt.slice(0, 80));
      } catch (e) { console.log('[FAIL]', id, i, e.message); }
      await sleep(400);
    }
    report.push({ id, query: term, candidates: saved });
    await sleep(2200);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('done; dishes:', report.filter((x) => x.candidates.length).length, '/', report.length);
  execFileSync('/bin/tar', ['czf', '/tmp/pexels2.tar.gz', '-C', '/tmp', 'pexels2']);
  console.log('tar', Math.round(fs.statSync('/tmp/pexels2.tar.gz').size / 1024) + 'KB');
})();
