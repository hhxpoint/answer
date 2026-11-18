// 免费图源补齐：Commons 关键词搜索，给缺失菜谱抓候选（服务器运行）
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RECIPES = require('/home/point/couple/recipe_data.js');
const OUT = '/tmp/recipe_fill';
const RAW = '/tmp/recipe_fill_raw';
const UA = 'HHXPOINT-recipe-assets/1.0 (https://hhxpoint.me; offline mini program)';
const ALLOW = /public domain|cc0|cc by|cc-by|attribution/i;
const DENY = /\b(nc|nd)\b|noncommercial|no derivative|gfdl/i;
const BAD = /djvu|pdf|svg|\.tif|\.tiff|logo|icon|map|diagram|chart|scan|book|page|封面|插图|图纸|stamp|coin|poster/i;

const Q = {
  hongshao_qiezi: ['braised eggplant', ['eggplant', 'aubergine']],
  suanrong_xilanhua: ['broccoli stir fry', ['broccoli']],
  shousi_baocai: ['cabbage stir fry', ['cabbage']],
  ganbian_doujiao: ['green beans stir fry', ['green bean', 'bean']],
  suanla_tudousi: ['shredded potato', ['potato']],
  suantai_chaorou: ['garlic scapes', ['garlic', 'scape']],
  suanrong_fensi_wawacai: ['napa cabbage', ['cabbage', 'napa']],
  liangban_huanggua: ['cucumber salad', ['cucumber']],
  qingchao_shishu: ['stir fried vegetables', ['vegetable', 'greens']],
  xianggu_huaji: ['mushroom chicken', ['mushroom', 'chicken']],
  zicai_danhua_tang: ['seaweed soup', ['seaweed', 'soup']],
  donggua_paigu_tang: ['winter melon soup', ['melon', 'soup']],
  yumi_paigu_tang: ['corn soup', ['corn', 'soup']],
  yiner_lianzi_geng: ['snow fungus soup', ['fungus', 'soup']],
  fanqie_jidan_mian: ['tomato noodles', ['noodle', 'tomato']],
  lurou_fan: ['braised pork rice', ['pork', 'rice']],
  xihongshi_niunan: ['beef brisket', ['beef', 'brisket']],
  qingzheng_luyu: ['steamed fish', ['fish', 'steam']],
  hongshao_jitui: ['braised chicken', ['chicken']],
  zheng_dangeng: ['steamed egg', ['egg', 'steam']],
  congyoubing: ['scallion pancake', ['scallion', 'pancake']],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function getJSON(url, retry = 3) {
  for (let i = 1; i <= retry; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      console.log('  [429] wait', 12000 * i);
      await sleep(12000 * i);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }
  throw new Error('429 after retries');
}

async function search(q) {
  const params = new URLSearchParams({
    action: 'query', generator: 'search', gsrsearch: q, gsrnamespace: '6',
    gsrlimit: '15', prop: 'imageinfo', iiprop: 'url|size|extmetadata',
    iiurlwidth: '1400', format: 'json', formatversion: '2',
  });
  const data = await getJSON('https://commons.wikimedia.org/w/api.php?' + params.toString());
  return (data.query || {}).pages || [];
}

async function download(url, dst) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  fs.writeFileSync(dst, Buffer.from(await res.arrayBuffer()));
}

function compress(src, dst) {
  execFileSync('/usr/bin/ffmpeg', [
    '-y', '-loglevel', 'error', '-i', src,
    '-vf', 'scale=800:600:force_original_aspect_ratio=increase,crop=800:600',
    '-q:v', '3', dst,
  ], { timeout: 30000 });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RAW, { recursive: true });
  const report = [];
  for (const r of RECIPES) {
    const q = Q[r.id];
    if (!q) continue;
    const [term, kws] = q;
    let pages = [];
    try {
      pages = await search(term);
    } catch (e) {
      console.log('[ERR]', r.id, e.message);
    }
    const cands = [];
    for (const p of pages) {
      const ii = (p.imageinfo || [{}])[0];
      const meta = ii.extmetadata || {};
      const title = p.title || '';
      const file = title.replace(/^File:/, '');
      if (!ii.thumburl || !/\.(jpe?g|png|webp)$/i.test(title)) continue;
      if (BAD.test(title)) continue;
      const license = strip((meta.LicenseShortName || {}).value);
      if (!ALLOW.test(license) || DENY.test(license)) continue;
      if (Number(ii.width || 0) < 600 || Number(ii.height || 0) < 450) continue;
      const hay = title.toLowerCase();
      const hit = kws.some((k) => hay.indexOf(k) >= 0);
      if (!hit) continue;
      cands.push({ title, file, thumb: ii.thumburl, width: ii.width, height: ii.height, license, artist: strip((meta.Artist || {}).value), landing: ii.descriptionurl || '' });
      if (cands.length >= 3) break;
    }
    const saved = [];
    for (let i = 0; i < Math.min(2, cands.length); i++) {
      const c = cands[i];
      const raw = path.join(RAW, r.id + '_' + i + '.jpg');
      const out = path.join(OUT, r.id + '_' + i + '.jpg');
      try {
        await download(c.thumb, raw);
        compress(raw, out);
        saved.push({ index: i, file: out, license: c.license, artist: c.artist, landing: c.landing, orig_title: c.file, width: c.width, height: c.height });
        console.log('[OK]', r.id, i, c.license, c.file.slice(0, 70));
      } catch (e) {
        console.log('[FAIL]', r.id, i, e.message);
      }
      await sleep(500);
    }
    report.push({ id: r.id, title: r.title, query: term, candidates: saved });
    await sleep(2500);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('done; filled dishes with candidates:', report.filter((x) => x.candidates.length).length, '/', report.length);
  execFileSync('/bin/tar', ['czf', '/tmp/recipe_fill.tar.gz', '-C', '/tmp', 'recipe_fill']);
  console.log('tar', Math.round(fs.statSync('/tmp/recipe_fill.tar.gz').size / 1024) + 'KB');
})();
