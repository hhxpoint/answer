// Pexels 免费图源采集（通过 r.jina.ai 读取搜索页，不需要 API key）
// 仅采集候选；最终由人工按菜品匹配度挑选
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RECIPES = require('/home/point/couple/recipe_data.js');
const OUT = '/tmp/pexels_imgs';
const RAW = '/tmp/pexels_imgs_raw';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const JINA = 'https://r.jina.ai/http://www.pexels.com/search/';

const QUERIES = {
  fanqie_chaodan: ['tomato egg stir fry', ['tomato', 'egg']],
  gongbao_jiding: ['kung pao chicken', ['chicken', 'kung']],
  mapo_doufu: ['mapo tofu', ['tofu', 'mapo']],
  yuxiang_rousi: ['shredded pork', ['pork', 'shredded']],
  huiguorou: ['twice cooked pork', ['pork', 'twice']],
  qingjiao_rousi: ['pepper pork', ['pepper', 'pork']],
  hongshao_qiezi: ['braised eggplant', ['eggplant', 'aubergine']],
  suanrong_xilanhua: ['garlic broccoli', ['broccoli']],
  shousi_baocai: ['stir fried cabbage', ['cabbage']],
  ganbian_doujiao: ['green beans', ['green bean', 'beans']],
  kele_jichi: ['chicken wings', ['chicken', 'wing']],
  suanla_tudousi: ['shredded potato', ['potato']],
  suantai_chaorou: ['garlic scapes', ['garlic', 'scape']],
  jiucai_chaodan: ['omelette', ['egg', 'omelette']],
  suanrong_fensi_wawacai: ['napa cabbage', ['cabbage', 'napa']],
  liangban_huanggua: ['cucumber salad', ['cucumber']],
  qingchao_shishu: ['stir fried vegetables', ['vegetable', 'greens']],
  xianggu_huaji: ['mushroom chicken', ['mushroom', 'chicken']],
  zicai_danhua_tang: ['seaweed soup', ['seaweed', 'soup']],
  fanqie_dantang: ['tomato soup', ['tomato', 'soup']],
  donggua_paigu_tang: ['winter melon soup', ['melon', 'soup']],
  yumi_paigu_tang: ['corn soup', ['corn', 'soup']],
  yiner_lianzi_geng: ['mushroom soup', ['mushroom', 'soup']],
  dan_chaofan: ['fried rice', ['rice', 'fried']],
  fanqie_jidan_mian: ['tomato noodles', ['noodle', 'tomato']],
  congyou_banmian: ['scallion noodles', ['noodle', 'scallion']],
  gali_jifan: ['curry rice', ['curry', 'rice']],
  lurou_fan: ['braised pork rice', ['pork', 'rice']],
  huangmenji_mifan: ['braised chicken rice', ['chicken', 'rice']],
  chaomian: ['chow mein', ['noodle', 'chow']],
  pidan_shourou_zhou: ['congee', ['congee', 'porridge']],
  sanmingzhi: ['sandwich', ['sandwich']],
  jiandan: ['fried egg', ['egg']],
  zheng_dangeng: ['steamed egg', ['egg', 'steam']],
  congyoubing: ['scallion pancake', ['pancake', 'scallion']],
  hongshao_rou: ['braised pork belly', ['pork', 'braised']],
  qingzheng_luyu: ['steamed fish', ['fish', 'steam']],
  tangcu_paigu: ['sweet and sour pork', ['pork', 'sweet', 'sour']],
  hongshao_jitui: ['braised chicken', ['chicken']],
  xihongshi_niunan: ['beef brisket', ['beef', 'brisket']],
};

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
  execFileSync('/usr/bin/ffmpeg', [
    '-y', '-loglevel', 'error', '-i', src,
    '-vf', 'scale=800:600:force_original_aspect_ratio=increase,crop=800:600',
    '-q:v', '3', dst,
  ], { timeout: 30000 });
}

function parseCards(md) {
  const re = /!\[Image\s+\d+:\s*([^\]]*)\]\((https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^)]+)\)/g;
  const out = [];
  const seen = {};
  let m;
  while ((m = re.exec(md))) {
    const alt = m[1] || '';
    const url = m[2];
    const id = m[3];
    if (seen[id]) continue;
    seen[id] = 1;
    out.push({ id, alt, url });
  }
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RAW, { recursive: true });
  const report = [];
  for (const r of RECIPES) {
    const q = QUERIES[r.id];
    if (!q) continue;
    const [term, kws] = q;
    let md = '';
    try {
      md = await fetchText(JINA + encodeURIComponent(term));
    } catch (e) {
      console.log('[ERR]', r.id, e.message);
      report.push({ id: r.id, title: r.title, query: term, candidates: [], error: e.message });
      await sleep(2500);
      continue;
    }
    const cards = parseCards(md);
    // 关键词打分
    cards.forEach((c) => {
      const hay = c.alt.toLowerCase();
      c.score = kws.reduce((n, k) => n + (hay.indexOf(k) >= 0 ? 1 : 0), 0);
    });
    cards.sort((a, b) => b.score - a.score || 0);
    const cands = cards.slice(0, 4);
    const saved = [];
    for (let i = 0; i < cands.length; i++) {
      const c = cands[i];
      if (c.score === 0) continue;
      const ext = /\.png(\?|$)/i.test(c.url) ? 'png' : 'jpg';
      const base = c.url.split('?')[0];
      const raw = path.join(RAW, r.id + '_' + i + '.' + ext);
      const out = path.join(OUT, r.id + '_' + i + '.jpg');
      try {
        await download(base + '?auto=compress&cs=tinysrgb&w=1400', raw);
        compress(raw, out);
        saved.push({ index: i, file: out, alt: c.alt.slice(0, 160), score: c.score, id: c.id, page: 'https://www.pexels.com/photo/' + c.id + '/', license: 'Pexels License (free to use)' });
        console.log('[OK]', r.id, i, 'score', c.score, c.alt.slice(0, 80));
      } catch (e) {
        console.log('[FAIL]', r.id, i, e.message);
      }
      await sleep(400);
    }
    report.push({ id: r.id, title: r.title, query: term, candidates: saved });
    await sleep(2200);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('done; dishes with candidates:', report.filter((x) => x.candidates.length).length, '/', report.length);
  execFileSync('/bin/tar', ['czf', '/tmp/pexels_imgs.tar.gz', '-C', '/tmp', 'pexels_imgs']);
  console.log('tar', Math.round(fs.statSync('/tmp/pexels_imgs.tar.gz').size / 1024) + 'KB');
})();
