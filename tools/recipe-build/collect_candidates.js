// 菜谱图片候选采集：中/英维基页面首图 + Commons 元数据（只下载候选，不直接写入 assets）
// 在服务器运行；输出 /tmp/recipe_candidates（每人最多 2 张）+ report.json
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RECIPES = require('/home/point/couple/recipe_data.js');
const QUERIES = require('/home/point/couple/image_queries.json');
const OUT = '/tmp/recipe_candidates';
const RAW = '/tmp/recipe_candidates_raw';
const UA = 'HHXPOINT-recipe-assets/1.0 (https://hhxpoint.me; offline mini program)';
const ALLOW = /public domain|cc0|cc by|cc-by|attribution/i;
const DENY = /\b(nc|nd)\b|noncommercial|no derivative|gfdl/i;
const BAD = /djvu|pdf|svg|\.tif|\.tiff|logo|icon|map|diagram|chart|scan|book|page|封面|插图|图纸|stamp|coin/i;

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

async function pageImages(host, titles) {
  if (!titles.length) return {};
  const params = new URLSearchParams({
    action: 'query', titles: titles.join('|'), prop: 'pageimages',
    piprop: 'thumbnail|name', pithumbsize: '1400', format: 'json',
    formatversion: '2', redirects: '1',
  });
  const data = await getJSON('https://' + host + '/w/api.php?' + params.toString());
  const out = {};
  for (const p of (data.query || {}).pages || []) {
    if (p.missing) continue;
    const thumb = (p.thumbnail || {}).source || '';
    if (!thumb || !p.pageimage) continue;
    out[p.title] = { title: p.title, image: p.pageimage, thumb: thumb };
  }
  return out;
}

async function commonsInfo(files) {
  if (!files.length) return {};
  const params = new URLSearchParams({
    action: 'query', titles: files.map((f) => 'File:' + f).join('|'),
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1600',
    format: 'json', formatversion: '2',
  });
  const data = await getJSON('https://commons.wikimedia.org/w/api.php?' + params.toString());
  const out = {};
  for (const p of (data.query || {}).pages || []) {
    const ii = (p.imageinfo || [{}])[0];
    const meta = ii.extmetadata || {};
    out[p.title.replace(/^File:/, '').replace(/ /g, '_')] = {
      title: p.title,
      thumb: ii.thumburl || '',
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
    '-vf', 'scale=800:600:force_original_aspect_ratio=increase,crop=800:600',
    '-q:v', '3', dst,
  ], { timeout: 30000 });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RAW, { recursive: true });

  const zhTitles = RECIPES.map((r) => r.title);
  const enTitles = RECIPES.map((r) => (QUERIES[r.id] || {}).en).filter(Boolean);
  const zh = {}, en = {};
  try { Object.assign(zh, await pageImages('zh.wikipedia.org', zhTitles)); } catch (e) { console.log('zh fail', e.message); }
  await sleep(1500);
  try { Object.assign(en, await pageImages('en.wikipedia.org', enTitles)); } catch (e) { console.log('en fail', e.message); }
  console.log('zh pageimages', Object.keys(zh).length, 'en', Object.keys(en).length);

  // 收集候选文件名
  const wanted = [];
  RECIPES.forEach((r) => {
    const q = QUERIES[r.id] || {};
    const seen = {};
    [zh[r.title], en[q.en]].forEach((p) => {
      if (p && !seen[p.image] && !BAD.test(p.image)) {
        seen[p.image] = 1;
        wanted.push(p.image);
      }
    });
  });
  const info = await commonsInfo([...new Set(wanted)]);
  console.log('commons info', Object.keys(info).length, '/', new Set(wanted).size);

  const report = [];
  for (const r of RECIPES) {
    const q = QUERIES[r.id] || {};
    const cands = [];
    const seen = {};
    [zh[r.title], en[q.en]].forEach((p) => {
      if (!p || seen[p.image]) return;
      const meta = info[p.image.replace(/ /g, '_')];
      if (!meta || !meta.thumb) return;
      if (!ALLOW.test(meta.license) || DENY.test(meta.license)) return;
      if (Number(meta.width || 0) < 600 || Number(meta.height || 0) < 450) return;
      seen[p.image] = 1;
      cands.push({ file: p.image, meta: meta, source: p.title === r.title ? 'zh.wikipedia' : 'en.wikipedia' });
    });
    const saved = [];
    for (let i = 0; i < Math.min(2, cands.length); i++) {
      const c = cands[i];
      const raw = path.join(RAW, r.id + '_' + i + '.jpg');
      const out = path.join(OUT, r.id + '_' + i + '.jpg');
      try {
        await download(c.meta.thumb, raw);
        compress(raw, out);
        saved.push({
          index: i, file: out, width: c.meta.width, height: c.meta.height,
          license: c.meta.license, artist: c.meta.artist, landing: c.meta.landing,
          orig_title: c.file, source: c.source,
        });
        console.log('[OK]', r.id, i, c.meta.license, c.file.slice(0, 60));
      } catch (e) {
        console.log('[FAIL]', r.id, i, e.message);
      }
      await sleep(400);
    }
    report.push({ id: r.id, title: r.title, candidates: saved });
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('done; dishes with candidates:', report.filter((x) => x.candidates.length).length, '/', report.length);
  execFileSync('/bin/tar', ['czf', '/tmp/recipe_candidates.tar.gz', '-C', '/tmp', 'recipe_candidates']);
  console.log('tar', Math.round(fs.statSync('/tmp/recipe_candidates.tar.gz').size / 1024) + 'KB');
})();
