// 申论模块测试：数据层 / 草稿 / 结构检查 / 自评分 / 作答页与自评页
const path = require('path');
const ROOT = path.join(__dirname, '..');

const storage = {};

const PAPER = {
  key: 'sl2025-fsx',
  title: '2025 年国考申论（副省级）',
  year: '2025',
  kind: '副省级',
  durationMin: 180,
  materials: [
    { no: 1, paras: ['第一段材料内容。', '第二段材料内容。'] },
    { no: 2, paras: ['第二篇材料。'] }
  ],
  questions: [
    {
      no: 1, type: '归纳概括', stem: '概括材料 1 中的主要问题。', requirement: ['要求：全面、准确。'],
      score: 15, wordMin: 0, wordMax: 350, materialRefs: [1],
      keyPoints: [
        { label: '要点一', detail: 'd1', from: 1 },
        { label: '要点二', detail: 'd2', from: 1 },
        { label: '要点三', detail: 'd3', from: 1 }
      ]
    },
    {
      no: 2, type: '文章写作', stem: '写一篇文章。', requirement: ['（1）自拟题目'],
      score: 35, wordMin: 1000, wordMax: 1200, materialRefs: [1, 2],
      keyPoints: [
        { label: 'A', detail: 'a', from: 1 },
        { label: 'B', detail: 'b', from: 1 },
        { label: 'C', detail: 'c', from: 2 },
        { label: 'D', detail: 'd', from: 2 }
      ]
    }
  ]
};

global.wx = {
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  request: (opts) => {
    const url = String(opts.url || '');
    let data = null;
    if (url.indexOf('essay/index.json') >= 0) data = { papers: [{ key: PAPER.key, title: PAPER.title, year: '2025', kind: '副省级', questionCount: 2, materialCount: 2, materialChars: 100 }] };
    else if (url.indexOf('essay/') >= 0) data = PAPER;
    if (data) opts.success({ statusCode: 200, data: data });
    else if (opts.fail) opts.fail({ errMsg: 'no stub' });
  },
  showToast: () => {},
  navigateTo: () => {},
  navigateBack: () => {}
};

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const api = require(path.join(ROOT, 'utils', 'exam-api.js'));
const store = require(path.join(ROOT, 'utils', 'exam-store.js'));

// ---------- 数据层 ----------
api.loadEssay(PAPER.key).then(function (paper) {
  check('申论卷加载', paper.questions.length === 2);
  check('材料篇数', paper.materials.length === 2);

  // ---------- 草稿 ----------
  const d0 = store.getEssayDraft('k1');
  check('草稿默认结构', d0.tab === 0 && d0.qIndex === 0 && typeof d0.answers === 'object');
  d0.answers[1] = '答案内容';
  store.saveEssayDraft('k1', d0);
  const d1 = store.getEssayDraft('k1');
  check('草稿保存/读取', d1.answers[1] === '答案内容');
  store.resetEssayDraft('k1');
  check('草稿重置', Object.keys(store.getEssayDraft('k1').answers).length === 0);

  // ---------- 结构检查 ----------
  const q1 = paper.questions[0];
  const ins1 = store.inspectAnswer('1. 第一条\n2. 第二条', q1);
  check('字数统计（去空白）', ins1.chars === 10, 'chars=' + ins1.chars);
  check('分条识别', ins1.hasEnum === true);
  check('未超字数', ins1.overLimit === false);
  const ins2 = store.inspectAnswer('甲'.repeat(400), q1);
  check('超字数识别', ins2.overLimit === true);
  check('空作答', store.inspectAnswer('', q1).empty === true);
  check('引用材料识别', store.inspectAnswer('根据资料1可知', q1).refMat === true);

  // ---------- 自评分 ----------
  check('未勾选得 0', store.scoreEssay(q1, []) === 0);
  check('勾 1 条 = 15/3', store.scoreEssay(q1, [0]) === 5, '' + store.scoreEssay(q1, [0]));
  check('勾 2 条 = 10', store.scoreEssay(q1, [0, 2]) === 10, '' + store.scoreEssay(q1, [0, 2]));
  check('全勾 = 满分', store.scoreEssay(q1, [0, 1, 2]) === 15);
  check('四条要点按 35 分折算', store.scoreEssay(paper.questions[1], [0, 1]) === 17.5,
    '' + store.scoreEssay(paper.questions[1], [0, 1]));

  // ---------- 作答页 ----------
  let pageDef = null;
  global.Page = (def) => { pageDef = def; };
  require(path.join(ROOT, 'pages', 'essay-practice', 'essay-practice.js'));
  const page = Object.assign({}, pageDef);
  page.data = JSON.parse(JSON.stringify(pageDef.data));
  page.setData = function (patch) { Object.assign(this.data, patch); };
  page.onLoad({ paper: PAPER.key });

  setTimeout(function () {
    check('作答页加载', !!page.data.q && page.data.total === 2);
    check('初始 tab=材料', page.data.tab === 0);
    check('字数上限带出', page.data.wordMax === 350, 'max=' + page.data.wordMax);

    page.onInput({ detail: { value: '一二三' } });
    check('输入更新字数', page.data.chars === 3);
    page.persist();
    check('草稿写入作答', store.getEssayDraft(PAPER.key).answers[1] === '一二三');

    page.nextQ();
    check('切题', page.data.qIndex === 1 && page.data.q.no === 2);
    check('切题后作答为空', page.data.answer === '');

    // ---------- 自评页 ----------
    let reviewDef = null;
    global.Page = (def) => { reviewDef = def; };
    require(path.join(ROOT, 'pages', 'essay-review', 'essay-review.js'));
    const rv = Object.assign({}, reviewDef);
    rv.data = JSON.parse(JSON.stringify(reviewDef.data));
    rv.setData = function (patch) { Object.assign(this.data, patch); };
    rv.onLoad({ paper: PAPER.key, q: '1' });

    setTimeout(function () {
      check('自评页加载题目', !!rv.data.q && rv.data.q.no === 1);
      check('要点列表', rv.data.points.length === 3);
      check('初始估分 0', rv.data.estimated === 0);

      rv.toggle({ currentTarget: { dataset: { i: 1 } } });
      check('勾选后估分 5', rv.data.estimated === 5, '' + rv.data.estimated);
      check('勾选写入草稿', (store.getEssayDraft(PAPER.key).checked['1'] || []).indexOf(1) >= 0);

      rv.toggle({ currentTarget: { dataset: { i: 1 } } });
      check('取消勾选回 0', rv.data.estimated === 0);

      console.log(fails.length ? '\nESSAY_FAILED: ' + fails.join(', ') : '\nESSAY_OK');
      process.exit(fails.length ? 1 : 0);
    }, 120);
  }, 120);
}).catch(function (e) {
  console.log('FATAL ' + (e && e.message));
  process.exit(2);
});
