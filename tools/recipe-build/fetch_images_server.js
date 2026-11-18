// 菜谱图片下载/压缩（在服务器上运行；不打包进小程序）
// 输入：/home/point/couple/recipe_data.js（由 build.py 生成的 recipes.js）
// 输出：/tmp/recipe_assets/*.jpg + credits.json
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RECIPES = require('/home/point/couple/recipe_data.js');
const OUT = '/tmp/recipe_assets';
const RAW = '/tmp/recipe_assets_raw';
const UA = 'HHXPOINT-recipe-assets/1.0 (local mini program)';
const ALLOW_LICENSE = /public domain|cc0|cc by|cc-by|attribution/i;
const DENY_LICENSE = /\b(nc|nd)\b|noncommercial|no derivative|gfdl/i;
const BAD_TITLE = /djvu|pdf|svg|\.tif|\.tiff|logo|icon|map|diagram|chart|scan|book|page|封面|插图|图纸/i;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function getJSON(url, retry = 3) {
  for (let attempt = 1; attempt <= retry; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      const wait = 8000 * attempt;
      console.log('  [429] wait', wait, 'ms');
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }
  throw new Error('HTTP 429 after retries');
}

async function searchWikimedia(term, mode = 'plain') {
  const q = mode === 'intitle' ? 'intitle:' + term : term;
  const params = new URLSearchParams({
    action: 'query', generator: 'search', gsrsearch: q, gsrnamespace: '6',
    gsrlimit: '15', prop: 'imageinfo', iiprop: 'url|extmetadata',
    iiurlwidth: '1400', format: 'json',
  });
  let data;
  try {
    data = await getJSON('https://commons.wikimedia.org/w/api.php?' + params.toString());
  } catch (e) {
    return [];
  }
  const pages = (data.query || {}).pages || {};
  return Object.values(pages).map((p) => {
    const ii = (p.imageinfo || [{}])[0];
    const meta = ii.extmetadata || {};
    return {
      title: p.title || '',
      license: stripHtml((meta.LicenseShortName || {}).value),
      artist: stripHtml((meta.Artist || {}).value),
      landing: ii.descriptionurl || '',
      width: ii.width || 0,
      height: ii.height || 0,
      thumb: ii.thumburl || '',
      source: 'Wikimedia Commons',
    };
  });
}

function pick(candidates, used, dishTitle) {
  const filtered = candidates.filter((c) => {
    if (!c.thumb) return false;
    if (!/\.(jpe?g|png|webp)$/i.test(c.title)) return false;
    if (BAD_TITLE.test(c.title)) return false;
    if (!ALLOW_LICENSE.test(c.license) || DENY_LICENSE.test(c.license)) return false;
    if (Number(c.width || 0) < 500 || Number(c.height || 0) < 400) return false;
    if (used.has(c.thumb)) return false;
    return true;
  });
  // 优先标题里包含菜名/关键词的候选
  const key = dishTitle.slice(0, 2);
  filtered.sort((a, b) => {
    const sa = (a.title.includes(dishTitle) ? 2 : a.title.includes(key) ? 1 : 0);
    const sb = (b.title.includes(dishTitle) ? 2 : b.title.includes(key) ? 1 : 0);
    return sb - sa;
  });
  return filtered[0] || null;
}

async function download(url, dst) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dst, buf);
  return buf.length;
}

function compress(src, dst) {
  execFileSync('/usr/bin/ffmpeg', [
    '-y', '-loglevel', 'error', '-i', src,
    '-vf', 'scale=600:450:force_original_aspect_ratio=increase,crop=600:450,eq=saturation=1.04:contrast=1.02',
    '-q:v', '6', dst,
  ], { timeout: 30000 });
  return fs.statSync(dst).size;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RAW, { recursive: true });
  const used = new Set();
  const credits = [];
  let ok = 0;
  let miss = 0;
  for (const r of RECIPES) {
    const candidates = [];
    try {
      candidates.push(...await searchWikimedia(r.title, 'plain'));
      if (!candidates.length) {
        await sleep(2500);
        candidates.push(...await searchWikimedia(r.title, 'intitle'));
      }
    } catch (e) {
      console.error('search fail', r.title, e.message);
    }
    const c = pick(candidates, used, r.title);
    if (!c) {
      miss += 1;
      console.log('[MISS]', r.id, r.title);
      credits.push({ id: r.id, title: r.title, image: '', source: '', license: '', artist: '', landing: '' });
      await sleep(1800);
      continue;
    }
    const raw = path.join(RAW, r.id + '.jpg');
    const out = path.join(OUT, r.id + '.jpg');
    try {
      await download(c.thumb, raw);
      const bytes = compress(raw, out);
      used.add(c.thumb);
      ok += 1;
      credits.push({
        id: r.id, title: r.title, image: '/packageRecipe/assets/recipes/' + r.id + '.jpg',
        source: c.source, license: c.license, artist: c.artist, landing: c.landing,
        orig_title: c.title, width: c.width, height: c.height,
      });
      console.log('[OK]', r.id, r.title, '|', c.license, '|', Math.round(bytes / 1024) + 'KB', '|', c.title.slice(0, 70));
    } catch (e) {
      miss += 1;
      console.log('[FAIL]', r.id, r.title, e.message);
      credits.push({ id: r.id, title: r.title, image: '', source: '', license: '', artist: '', landing: '' });
    }
    await sleep(1800);
  }
  fs.writeFileSync(path.join(OUT, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log('\nDONE ok=%d miss=%d', ok, miss);
  execFileSync('/bin/tar', ['czf', '/tmp/recipe_assets.tar.gz', '-C', '/tmp', 'recipe_assets']);
  console.log('tar size', Math.round(fs.statSync('/tmp/recipe_assets.tar.gz').size / 1024) + 'KB');
})();
