// 红领巾批改 · 规则引擎测试（纯函数，无 wx 依赖）
const path = require('path');
const G = require(path.join(__dirname, '..', 'utils', 'essay-grader.js'));

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const Q = {
  no: 1, score: 15, wordMin: 0, wordMax: 350,
  keyPoints: [
    { label: '数字孪生黄河提升防汛预警能力', detail: '数字孪生黄河提升防汛预警能力，实现四预功能', from: 1 },
    { label: '河务通应用提高巡河效率', detail: '河务通应用提高巡河效率，及时发现处置问题', from: 1 },
    { label: '模型黄河为决策提供支撑', detail: '模型黄河为防汛决策提供物理参数支撑', from: 1 }
  ]
};

// ---------- 词元 ----------
const terms = G.termsOf('数字孪生黄河提升防汛预警能力');
check('词元为 2 字', terms.every(function (t) { return t.length === 2; }));
check('词元去重', new Set(terms).size === terms.length);
check('停用词被过滤', G.termsOf('我们需要进行工作').every(function (t) {
  return ['我们', '需要', '进行', '工作'].indexOf(t) < 0;
}));

// ---------- 单条命中 ----------
const hit = G.hitPoint(Q.keyPoints[0], '数字孪生黄河提升了防汛预警能力');
check('同一表述判命中', hit.hit === true, 'ratio=' + hit.ratio);
const miss = G.hitPoint(Q.keyPoints[0], '这条完全无关的内容');
check('无关内容判未命中', miss.hit === false);

// ---------- 空作答 ----------
const g0 = G.grade(Q, '');
check('空作答 0 分', g0.total === 0, 'total=' + g0.total);
check('空作答给出问题', g0.issues.indexOf('作答为空') >= 0);

// ---------- 标准作答 ----------
const good = [
  '1. 根据资料1，数字孪生黄河提升防汛预警能力，实现预报、预警、预演、预案四预功能，把实体黄河装进计算机同步仿真运行，防汛会商时一屏掌控省、市、县、班、点五级联防联动，发现险情可以第一时间处置。',
  '2. 根据资料1，河务通应用提高巡河效率，监测数据汇集到手机端，巡查人员能及时发现问题并启动无人机复核，把处置结果上传平台，形成闭环，河道管理更加高效。',
  '3. 根据资料1，模型黄河为防汛决策提供物理参数支撑，通过实体模型试验为洪水预演、工程调度和水沙运动规律探索提供依据，服务重大水利工程建设论证。'
].join('\n') + '\n' + '根据资料1，持续推进数字化建设，完善监测感知网络，提升协同处置水平，形成闭环管理机制。'.repeat(2);
const g1 = G.grade(Q, good);
check('要点全中 → 命中率 1', g1.hitRate === 1, 'rate=' + g1.hitRate);
check('总分接近满分', g1.total >= 13 && g1.total <= 15, 'total=' + g1.total);
check('要点分 9 分', g1.breakdown.content === 9, 'content=' + g1.breakdown.content);
check('结构分给满', g1.breakdown.structure === 3.8, 'structure=' + g1.breakdown.structure);
check('无遗漏问题', g1.issues.filter(function (x) { return x.indexOf('未覆盖') >= 0; }).length === 0);

// ---------- 部分作答 ----------
const partial = '1. 数字孪生黄河提升了防汛预警能力。';
const g2 = G.grade(Q, partial);
check('部分作答命中 1 条', g2.hitCount === 1, 'hit=' + g2.hitCount);
check('部分作答得分低于满分', g2.total < g1.total);
check('给出未覆盖提示', g2.issues.some(function (x) { return x.indexOf('未覆盖') >= 0; }));
check('建议含补充要点', g2.suggestions.some(function (x) { return x.indexOf('补「') >= 0; }));
check('字数偏少被指出', g2.issues.indexOf('字数偏少') >= 0);

// ---------- 超字数 ----------
const long = good + '补'.repeat(400);
const g3 = G.grade(Q, long);
check('超字数被指出', g3.issues.some(function (x) { return x.indexOf('超出字数上限') >= 0; }));
check('超字数表达分下降', g3.breakdown.expression < g1.breakdown.expression, g3.breakdown.expression + ' < ' + g1.breakdown.expression);

// ---------- 确定性 ----------
const a = G.grade(Q, good);
const b = G.grade(Q, good);
check('同输入同输出', JSON.stringify(a) === JSON.stringify(b));

// ---------- 不含 AI 字样 ----------
const blob = JSON.stringify(a) + JSON.stringify(g0.suggestions);
check('输出无 AI 字样', !/\bAI\b|人工智能|大模型|智能生成/i.test(blob), 'ok');
check('批改名称', a.label === '红领巾批改');

console.log(fails.length ? '\nGRADER_FAILED: ' + fails.join(', ') : '\nGRADER_OK');
process.exit(fails.length ? 1 : 0);
