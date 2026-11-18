// Openverse 候选采集（CC 授权、可商用可修改），在服务器运行
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = '/tmp/recipe_ov';
const RAW = '/tmp/recipe_ov_raw';
const UA = 'HHXPOINT-recipe-assets/1.0 (https://hhxpoint.me; offline mini program)';
const ALLOW = /^(cc0|pdm|by|by-sa)/i;

const QUERIES = [
  ['suanrong_xilanhua', 'broccoli stir fry', ['broccoli']],
  ['ganbian_doujiao', 'green beans stir fry', ['bean', 'green']],
  ['suanrong_fensi_wawacai', 'napa cabbage', ['cabbage']],
  ['qingchao_shishu', 'stir fried vegetables', ['vegetable', 'greens']],
  ['zicai_danhua_tang', 'seaweed soup', ['seaweed', 'soup']],
  ['donggua_paigu_tang', 'winter melon soup', ['melon', 'soup']],
  ['yiner_lianzi_geng', 'snow fungus soup', ['fungus', 'soup']],
  ['hongshao_jitui', 'braised chicken', ['chicken']],
  ['suantai_chaorou', 'garlic scapes', ['garlic', 'scape']],
  ['suanla_tudousi', 'shredded potato', ['potato']],
  ['xianggu_huaji', 'mushroom chicken', ['mushroom', 'chicken']],
  ['jiucai_chaodan', 'chive omelette', ['chive', 'egg', 'omelette']],
  ['qingjiao_rousi', 'green pepper pork', ['pepper', 'pork']],
  ['fanqie_jidan_mian', 'tomato egg noodles', ['noodle', 'tomato']],
  ['shousi_baocai', 'cabbage stir fry', ['cabbage']],
  ['qingzheng_luyu', 'steamed fish', ['fish', 'steam']],
  ['xihongshi_niunan', 'beef brisket', ['beef', 'brisket']],
  ['mapo_doufu', 'mapo tofu', ['tofu', 'mapo']],
  ['gongbao_jiding', 'kung pao chicken', ['chicken', 'kung']],
  ['fanqie_chaodan', 'tomato egg', ['tomato', 'egg']],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, retry = 3) {
  for (let i = 1; i <= retry; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 504) {
      console.log('  [' + res.status + '] wait', 8000 * i);
      await sleep(8000 * i);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }
  throw new Error('retry failed');
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
  for (const [id, q, kws] of QUERIES) {
    const params = new URLSearchParams({ q, page_size: '20', license_type: 'commercial,modification' });
    let data = null;
    try {
      data = await getJSON('https://api.openverse.org/v1/images/?' + params.toString());
    } catch (e) {
      console.log('[ERR]', id, e.message);
      report.push({ id, q, candidates: [], error: e.message });
      await sleep(1500);
      continue;
    }
    const results = (data.results || []).filter((r) => {
      const lic = String(r.license || '').toLowerCase();
      if (!ALLOW.test(lic)) return false;
      if ((r.license_version || '').indexOf('nc') >= 0) return false;
      if (Number(r.width || 0) < 700) return false;
      const t = String(r.title || '').toLowerCase();
      return kws.some((k) => t.indexOf(k) >= 0);
    });
    const cands = [];
    for (let i = 0; i < Math.min(3, results.length); i++) {
      const r = results[i];
      const raw = path.join(RAW, id + '_' + i + '.jpg');
      const out = path.join(OUT, id + '_' + i + '.jpg');
      try {
        await download(r.url || r.thumbnail, raw);
        compress(raw, out);
        cands.push({
          index: i, file: out, width: r.width, height: r.height,
          license: r.license + ' ' + (r.license_version || ''),
          creator: r.creator, landing: r.foreign_landing_url, source: r.source,
          title: r.title,
        });
        console.log('[OK]', id, i, r.title.slice(0, 60), '|', r.license);
      } catch (e) {
        console.log('[FAIL]', id, i, e.message);
      }
      await sleep(300);
    }
    report.push({ id, q, candidates: cands });
    await sleep(1200);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('done; dishes with candidates:', report.filter((x) => x.candidates.length).length, '/', report.length);
  execFileSync('/bin/tar', ['czf', '/tmp/recipe_ov.tar.gz', '-C', '/tmp', 'recipe_ov']);
  console.log('tar', Math.round(fs.statSync('/tmp/recipe_ov.tar.gz').size / 1024) + 'KB');
})();
