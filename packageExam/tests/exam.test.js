// 公考题库模块测试：数据层 / 进度层 / 做题页逻辑（不需要微信运行时）
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ---------- wx 桩 ----------
const storage = {};
let requestCount = 0;

const FIXTURE = {
  key: 'gktest-x1',
  title: '测试卷',
  year: '2025',
  examType: 'guokao',
  province: '国考',
  questionCount: 2,
  materials: { zl: { '1': [{ parts: [{ t: '材料正文' }] }] } },
  questions: [
    {
      id: 'q1', qid: '1', seq: 1, section: 'pd', type: '图形推理', material: null,
      stem: [{ parts: [{ t: '选出下一个图形：' }] }, { parts: [{ img: 'a.png', w: 600, h: 300, tex: false }] }],
      options: [
        { key: 'A', blocks: [{ parts: [{ t: 'A' }] }], marked: false },
        { key: 'B', blocks: [{ parts: [{ t: 'B' }] }], marked: true },
        { key: 'C', blocks: [{ parts: [{ t: 'C' }] }], marked: false },
        { key: 'D', blocks: [{ parts: [{ t: 'D' }] }], marked: false }
      ],
      answer: 'B',
      analysis: [{ parts: [{ t: '因为对称。' }] }],
      needsReview: []
    },
    {
      id: 'q2', qid: '2', seq: 1, section: 'zl', type: '综合', material: 1,
      stem: [{ parts: [{ t: '下列说法正确的是：' }] }],
      options: [
        { key: 'A', blocks: [{ parts: [{ t: '甲' }] }], marked: true },
        { key: 'B', blocks: [{ parts: [{ t: '乙' }] }], marked: false },
        { key: 'C', blocks: [{ parts: [{ t: '丙' }] }], marked: false },
        { key: 'D', blocks: [{ parts: [{ t: '丁' }] }], marked: false }
      ],
      answer: 'A',
      analysis: [],
      needsReview: []
    }
  ]
};

global.wx = {
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  request: (opts) => {
    requestCount += 1;
    const url = String(opts.url || '');
    let data = null;
    if (url.indexOf('index.json') >= 0) {
      data = { papers: [{ key: FIXTURE.key, title: FIXTURE.title, year: '2025', questionCount: 2 }] };
    } else if (url.indexOf('papers/') >= 0) {
      data = FIXTURE;
    }
    if (data) opts.success({ statusCode: 200, data: data });
    else if (opts.fail) opts.fail({ errMsg: 'no stub' });
  },
  showToast: () => {},
  vibrateShort: () => {},
  navigateTo: () => {},
  previewImage: () => {}
};

let pageDef = null;
global.Page = (def) => { pageDef = def; };

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

const api = require(path.join(ROOT, 'utils', 'exam-api.js'));
const store = require(path.join(ROOT, 'utils', 'exam-store.js'));

// ---------- 1. 数据层 ----------
const paper = api.normalizePaper(FIXTURE);
check('normalize 题数', paper.questions.length === 2);
check('题目序号重排', paper.questions[0].no === 1 && paper.questions[1].no === 2);
const img = paper.questions[0].stem[1].parts[0];
check('图片地址补全', img.src === 'https://hhxpoint.me/couple-api/files/exam/img/gktest-x1/a.png', img.src);
check('块与部件有稳定 key', typeof paper.questions[0].stem[0].i !== 'undefined' && typeof img.i === 'string', img.i);
check('材料补全', paper.materials.zl['1'][0].parts[0].t === '材料正文');
check('解析为空时返回空数组', paper.questions[1].analysis.length === 0);

// ---------- 2. 进度层 ----------
store.recordAnswer(paper.key, 'q1', 'B', true);
store.recordAnswer(paper.key, 'q2', 'B', false);
const prog = store.getProgress(paper.key);
check('进度记录两条', Object.keys(prog.answers).length === 2);
check('对的记为 true', prog.answers.q1.correct === true);
check('错的记为 false', prog.answers.q2.correct === false);
const st = store.getStats();
check('累计题数', st.total === 2, 'total=' + st.total);
check('累计正确', st.correct === 1, 'correct=' + st.correct);
check('今日计数', st.todayCount === 2, 'today=' + st.todayCount);

// 重做改判
store.recordAnswer(paper.key, 'q2', 'A', true);
const st2 = store.getStats();
check('重做改判后正确数+1', st2.correct === 2, 'correct=' + st2.correct);
check('重做不重复计题数', st2.total === 2, 'total=' + st2.total);

store.resetPaper(paper.key);
check('重置后进度清空', Object.keys(store.getProgress(paper.key).answers).length === 0);

// ---------- 3. 做题页 ----------
require(path.join(ROOT, 'pages', 'practice', 'practice.js'));
const page = Object.assign({}, pageDef);
page.data = JSON.parse(JSON.stringify(pageDef.data));
page.setData = function (patch) { Object.assign(this.data, patch); };

page.onLoad({ paper: paper.key });

setTimeout(function () {
  check('试卷已加载', !!page.paper, 'req=' + requestCount);
  check('首题渲染', !!page.data.q && page.data.q.id === 'q1', page.data.q && page.data.q.id);
  check('图推选项显示「见下图选项」', page.data.q.options[0].seeHint === true);
  check('初始未揭晓', page.data.revealed === false);
  check('总数正确', page.data.total === 2);

  // 选错
  page.pick({ currentTarget: { dataset: { key: 'A' } } });
  check('选择后揭晓答案', page.data.revealed === true);
  check('判错', page.data.isCorrect === false);
  check('已答计数 +1', page.data.answered === 1, 'answered=' + page.data.answered);

  // 下一题（带材料）
  page.next();
  check('切到第 2 题', page.data.idx === 1 && page.data.q.id === 'q2');
  check('绑定材料', page.data.materials.length === 1 && page.data.materials[0].parts[0].t === '材料正文');

  // 选对
  page.pick({ currentTarget: { dataset: { key: 'A' } } });
  check('判对', page.data.isCorrect === true);
  check('正确计数', page.data.correct === 1, 'correct=' + page.data.correct);

  // 答题卡跳转
  storage['exam:jump'] = 0;
  page.onShow();
  check('答题卡跳回第 1 题', page.data.idx === 0, 'idx=' + page.data.idx);

  console.log(fails.length ? '\nEXAM_FAILED: ' + fails.join(', ') : '\nEXAM_OK');
  process.exit(fails.length ? 1 : 0);
}, 80);
