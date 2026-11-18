// 菜谱图片：Wikipedia 页面首图 + Commons 元数据（批量、低频，避免 429）
// 在服务器上运行，输入 /home/point/couple/recipe_data.js，输出 /tmp/recipe_assets
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RECIPES = require('/home/point/couple/recipe_data.js');
const OUT = '/tmp/recipe_assets';
const RAW = '/tmp/recipe_assets_raw';
const UA = 'HHXPOINT-recipe-assets/1.0 (https://hhxpoint.me; offline mini program)';
const ALLOW = /public domain|cc0|cc by|cc-by|attribution/i;
const DENY = /\b(nc|nd)\b|noncommercial|no derivative|gfdl/i;
const BAD = /djvu|pdf|svg|\.tif|\.tiff|logo|icon|map|diagram|chart|scan|book|page|封面|插图|图纸/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function getJSON(url, retry = 3) {
  for (let i = 1; i <= retry; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      console.log('  [429] wait', 10000 * i, 'ms');
      await sleep(10000 * i);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }
  throw new Error('429 after retries');
}

async function pageImages(titles) {
  const params = new URLSearchParams({
    action: 'query',
    titles: titles.join('|'),
    prop: 'pageimages',
    piprop: 'thumbnail|name',
    pithumbsize: '1400',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    variant: 'zh-cn',
  });
  const data = await getJSON('https://zh.wikipedia.org/w/api.php?' + params.toString());
  const out = {};
  for (const p of (data.query || {}).pages || []) {
    if (p.missing) continue;
    const thumb = (p.thumbnail || {}).source || '';
    if (!thumb || !p.pageimage) continue;
    out[p.title] = { title: p.title, image: p.pageimage, thumb: thumb };
  }
  return out;
}

async function wikiSearch(term) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: term, srlimit: '1',
    format: 'json', formatversion: '2', variant: 'zh-cn',
  });
  const data = await getJSON('https://zh.wikipedia.org/w/api.php?' + params.toString());
  return ((data.query || {}).search || [])[0] || null;
}

async function commonsInfo(files) {
  const params = new URLSearchParams({
    action: 'query', titles: files.map((f) => 'File:' + f).join('|'),
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1400',
    format: 'json', formatversion: '2',
  });
  const data = await getJSON('https://commons.wikimedia.org/w/api.php?' + params.toString());
  const out = {};
  for (const p of (data.query || {}).pages || []) {
    const ii = (p.imageinfo || [{}])[0];
    const meta = ii.extmetadata || {};
    out[p.title] = {
      title: p.title,
      thumb: ii.thumburl || '',
      url: ii.url || '',
      width: ii.width || 0,
      height: ii.height || 0,
      license: strip((meta.LicenseShortName || {}).value),
      artist: strip((meta.Artist || {}).value),
      landing: ii.descriptionurl || '',
    };
  }
  return out;
}

async function download(url, dst) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  fs.writeFileSync(dst, Buffer.from(await res.arrayBuffer()));
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

  // 1) 批量查页面首图
  const titles = RECIPES.map((r) => r.title);
  const pages = {};
  try {
    Object.assign(pages, await pageImages(titles));
  } catch (e) {
    console.log('pageimages fail', e.message);
  }
  console.log('pageimages hit', Object.keys(pages).length, '/', RECIPES.length);

  // 2) 缺失的逐条搜索（低频）
  for (const r of RECIPES) {
    if (pages[r.title]) continue;
    try {
      const hit = await wikiSearch(r.title);
      if (hit) {
        const p = await pageImages([hit.title]);
        const v = p[hit.title];
        if (v) {
          pages[r.title] = v;
          console.log('search hit', r.title, '->', hit.title);
        }
      }
    } catch (e) {
      console.log('search fail', r.title, e.message);
    }
    await sleep(1200);
  }

  // 3) 批量查 Commons 元数据
  const byFile = {};
  const fileNames = [];
  for (const r of RECIPES) {
    const v = pages[r.title];
    if (!v) continue;
    fileNames.push(v.image);
  }
  try {
    const info = await commonsInfo([...new Set(fileNames)]);
    for (const k of Object.keys(info)) {
      // MediaWiki 会把下划线归一化为空格，key 统一用下划线
      byFile[k.replace(/^File:/, '').replace(/ /g, '_')] = info[k];
    }
  } catch (e) {
    console.log('commons info fail', e.message);
  }

  // 4) 下载 + 压缩
  const used = new Set();
  const credits = [];
  let ok = 0;
  let miss = 0;
  for (const r of RECIPES) {
    const v = pages[r.title];
    const info = v ? byFile[v.image.replace(/ /g, '_')] : null;
    const allowed = info && info.thumb && !BAD.test(v.image) &&
      ALLOW.test(info.license) && !DENY.test(info.license) &&
      Number(info.width || 0) >= 500 && Number(info.height || 0) >= 400 &&
      !used.has(v.image);
    if (!allowed) {
      miss += 1;
      console.log('[MISS]', r.id, r.title, v ? ('license=' + (info && info.license) + ' ' + v.image) : 'no pageimage');
      credits.push({ id: r.id, title: r.title, image: '', source: '', license: '', artist: '', landing: '' });
      continue;
    }
    const raw = path.join(RAW, r.id + '.jpg');
    const out = path.join(OUT, r.id + '.jpg');
    try {
      await download(info.thumb, raw);
      const bytes = compress(raw, out);
      used.add(v.image);
      ok += 1;
      credits.push({
        id: r.id, title: r.title,
        image: '/packageRecipe/assets/recipes/' + r.id + '.jpg',
        source: 'Wikipedia / Wikimedia Commons',
        license: info.license, artist: info.artist, landing: info.landing,
        orig_title: v.image, width: info.width, height: info.height,
      });
      console.log('[OK]', r.id, r.title, '|', info.license, '|', Math.round(bytes / 1024) + 'KB', '|', v.image.slice(0, 60));
    } catch (e) {
      miss += 1;
      console.log('[FAIL]', r.id, r.title, e.message);
      credits.push({ id: r.id, title: r.title, image: '', source: '', license: '', artist: '', landing: '' });
    }
  }

  fs.writeFileSync(path.join(OUT, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log('\nDONE ok=%d miss=%d', ok, miss);
  execFileSync('/bin/tar', ['czf', '/tmp/recipe_assets.tar.gz', '-C', '/tmp', 'recipe_assets']);
  console.log('tar', Math.round(fs.statSync('/tmp/recipe_assets.tar.gz').size / 1024) + 'KB');
})();
