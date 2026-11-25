// 专项池模式与跳题参数测试
const path = require('path');
const ROOT = path.join(__dirname, '..');

const storage = {};

const POOL = {
  slug: 'tuxing', type: '图形推理', count: 2,
  questions: [
    {
      id: 'gk2025-fsx:q1', qid: '1', paper: 'gk2025-fsx', section: 'pd', type: '图形推理',
      stem: [{ parts: [{ t: '选出下一个：' }] }, { parts: [{ src: 'https://x/img/a.webp', w: 600, h: 280, tex: false }] }],
      options: [
        { key: 'A', blocks: [{ parts: [{ t: 'A' }] }] },
        { key: 'B', blocks: [{ parts: [{ t: 'B' }] }] },
        { key: 'C', blocks: [{ parts: [{ t: 'C' }] }] },
        { key: 'D', blocks: [{ parts: [{ t: 'D' }] }] }
      ],
      answer: 'C', analysis: [{ parts: [{ t: '对称。' }] }]
    },
    {
      id: 'gk2024-fsx:q9', qid: '9', paper: 'gk2024-fsx', section: 'pd', type: '图形推理',
      stem: [{ parts: [{ t: '第二题' }] }],
      options: [
        { key: 'A', blocks: [{ parts: [{ t: 'A' }] }] },
        { key: 'B', blocks: [{ parts: [{ t: 'B' }] }] },
        { key: 'C', blocks: [{ parts: [{ t: 'C' }] }] },
        { key: 'D', blocks: [{ parts: [{ t: 'D' }] }] }
      ],
      answer: 'A', analysis: []
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
    if (url.indexOf('pools/index.json') >= 0) data = { pools: [{ slug: 'tuxing', type: '图形推理', count: 2 }] };
    else if (url.indexOf('pools/') >= 0) data = POOL;
    if (data) opts.success({ statusCode: 200, data: data });
    else if (opts.fail) opts.fail({ errMsg: 'no stub ' + url });
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
require(path.join(ROOT, 'pages', 'practice', 'practice.js'));

// ---------- 池索引 ----------
api.loadPoolIndex().then(function (idx) {
  check('题型池索引', Array.isArray(idx.pools) && idx.pools.length === 1);
  check('池题量', idx.pools[0].count === 2);

  return api.loadPool('tuxing');
}).then(function (pool) {
  check('池内容', pool.questions.length === 2 && pool.type === '图形推理');

  // ---------- 池模式做题页 ----------
  const page = Object.assign({}, pageDef);
  page.data = JSON.parse(JSON.stringify(pageDef.data));
  page.setData = function (patch) { Object.assign(this.data, patch); };
  page.onLoad({ pool: 'tuxing' });

  setTimeout(function () {
    check('池模式加载', !!page.paper && page.data.total === 2, 'total=' + page.data.total);
    check('池标题带专项', /专项/.test(page.data.paperTitle || ''), page.data.paperTitle);
    check('题目带图', !!page.data.q && page.data.q.stem[1].parts[0].src.indexOf('http') === 0);
    check('池进度键独立', page.paper.key === 'pool-tuxing', page.paper.key);

    page.pick({ currentTarget: { dataset: { key: 'C' } } });
    check('池模式判对', page.data.isCorrect === true);

    // ---------- 跳题参数 ----------
    const page2 = Object.assign({}, pageDef);
    page2.data = JSON.parse(JSON.stringify(pageDef.data));
    page2.setData = function (patch) { Object.assign(this.data, patch); };
    page2.onLoad({ pool: 'tuxing', jump: '1' });

    setTimeout(function () {
      check('jump 参数生效', page2.data.idx === 1, 'idx=' + page2.data.idx);
      console.log(fails.length ? '\nPOOL_FAILED: ' + fails.join(', ') : '\nPOOL_OK');
      process.exit(fails.length ? 1 : 0);
    }, 120);
  }, 120);
}).catch(function (e) {
  console.log('FATAL ' + (e && e.message));
  process.exit(2);
});
