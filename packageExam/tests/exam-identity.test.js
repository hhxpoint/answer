// 身份 / 账号隔离 / 旧数据迁移 / 云端同步 逻辑测试
const path = require('path');

const ROOT = path.join(__dirname, '..');
const storage = {};
const requests = [];

global.wx = new Proxy({
  getStorageSync: (k) => (k in storage ? storage[k] : ''),
  setStorageSync: (k, v) => { storage[k] = v; },
  removeStorageSync: (k) => { delete storage[k]; },
  getStorageInfoSync: () => ({ keys: Object.keys(storage) }),
  request: (o) => {
    requests.push({ url: o.url, method: o.method, data: o.data, header: o.header });
    if (o.method === 'GET') {
      o.success({
        statusCode: 200,
        data: {
          ok: true,
          items: [
            { kind: 'paper', key: 'gk-remote', payload: { answers: { q1: { pick: 'C', correct: true } }, idx: 7 }, updatedAt: 5000 },
            { kind: 'paper', key: 'gk-old', payload: { answers: {}, idx: 99 }, updatedAt: 100 }
          ]
        }
      });
      return;
    }
    o.success({ statusCode: 200, data: { ok: true, saved: true } });
  },
  navigateTo: () => {},
  showToast: () => {}
}, {
  get: (t, k) => (k in t ? t[k] : function () {}),
  has: () => true
});

const fails = [];
function check(name, cond, extra) {
  console.log((cond ? '  OK   ' : '  FAIL ') + name + (extra ? ' ' + extra : ''));
  if (!cond) fails.push(name);
}

// ---------- 准备：老版本键 + 已完善资料 ----------
storage.userProfile = { userId: 'u5', nickName: '阿星', avatarUrl: 'https://hhxpoint.me/a.png' };
storage.couple_token = 'tok-abc';
storage['exam:progress:gk-legacy'] = { answers: { q9: { pick: 'A', correct: false } }, idx: 3, updatedAt: 1000 };
storage['exam:stats'] = { total: 3, correct: 2, todayCount: 1, streak: 2, day: '2026-11-25' };
storage['exam:essay:draft:sl-legacy'] = { tab: 1, qIndex: 2, answers: { 1: '旧作文' }, startedAt: 1 };

const identity = require(path.join(ROOT, 'utils', 'exam-identity.js'));
const store = require(path.join(ROOT, 'utils', 'exam-store.js'));
const sync = require(path.join(ROOT, 'utils', 'exam-sync.js'));

// ---------- 身份 ----------
check('资料已完善', identity.profileReady() === true);
check('uid 取服务端 id', identity.uid() === 'u5', identity.uid());
check('识别为真实账号', identity.isRealUser() === true);

// ---------- 迁移 ----------
store.migrate();
check('旧套卷进度迁到账号下', !!storage['exam:p:u5:gk-legacy'], Object.keys(storage).filter((k) => k.indexOf('gm') < 0).length + ' keys');
check('旧键已清除', storage['exam:progress:gk-legacy'] === undefined);
check('旧统计迁到账号下', !!storage['exam:s:u5']);
check('旧申论草稿迁到账号下', !!storage['exam:d:u5:sl-legacy']);
check('迁移后内容不丢', storage['exam:p:u5:gk-legacy'].answers.q9.pick === 'A');

// ---------- 账号隔离 ----------
const prog = store.getProgress('gk-new');
check('新进度默认空', Object.keys(prog.answers).length === 0);
store.recordAnswer('gk-new', 'q1', 'B', true);
check('写入当前账号命名空间', !!storage['exam:p:u5:gk-new']);
check('不影响其他 key', (storage['exam:p:u5:gk-legacy'].answers.q9.pick === 'A'));

// ---------- 同步：拉取合并 ----------
sync.pull().then(function (r) {
  check('拉取返回合并数', r.merged >= 1, JSON.stringify(r));
  check('远端新记录落到本地', !!storage['exam:p:u5:gk-remote']);
  check('远端内容正确', storage['exam:p:u5:gk-remote'].idx === 7);
  check('远端旧记录不覆盖空本地', (storage['exam:p:u5:gk-old'].idx === 99));

  // 本地更新时，远端旧数据不应覆盖
  storage['exam:p:u5:gk-remote'].updatedAt = 9999;
  store.applyRemote('paper', 'gk-remote', { answers: {}, idx: 0 }, 5000);
  check('本地较新不被旧远端覆盖', storage['exam:p:u5:gk-remote'].idx === 7);

  // ---------- 同步：上传 ----------
  requests.length = 0;
  return sync.pushNow('paper', 'gk-new', storage['exam:p:u5:gk-new']);
}).then(function (ok) {
  check('上传成功', ok === true);
  const req = requests[requests.length - 1] || {};
  check('走 PUT /progress', req.method === 'PUT' && String(req.url).indexOf('/couple-api/exam/progress') > 0, req.method + ' ' + req.url);
  check('带 Bearer token', req.header && req.header.Authorization === 'Bearer tok-abc', req.header && req.header.Authorization);
  check('payload 带 kind/key', req.data && req.data.item && req.data.item.kind === 'paper' && req.data.item.key === 'gk-new');

  // ---------- 无 token 不同步 ----------
  delete storage.couple_token;
  check('无 token 时 canSync=false', sync.canSync() === false);

  // ---------- 账号 id 优先级：服务端登录态 > 本地资料 ----------
  storage.couple_user = { id: 7, nickname: '服务端账号' };
  check('uid 优先取服务端账号', identity.uid() === 'u7', identity.uid());
  storage['exam:p:u7:gk-x'] = { answers: {}, idx: 1, updatedAt: 1 };
  store.getProgress('gk-x');
  check('按服务端账号命名空间读取', storage['exam:p:u7:gk-x'].idx === 1);

  // ---------- 跨设备合并：两边各做了不同题，不能互相覆盖 ----------
  storage['exam:p:u7:gk-merge'] = { answers: { q1: { pick: 'A', correct: true } }, idx: 2, updatedAt: 1000 };
  store.applyRemote('paper', 'gk-merge', { answers: { q2: { pick: 'C', correct: false } }, idx: 5 }, 2000);
  const merged = storage['exam:p:u7:gk-merge'];
  check('合并后保留本机答案', !!merged.answers.q1);
  check('合并后拿到对方答案', !!merged.answers.q2);
  check('进度位置取较新', merged.idx === 5, String(merged.idx));
  check('合并后时间取较大', merged.updatedAt === 2000, String(merged.updatedAt));

  storage['exam:d:u7:sl-merge'] = { answers: { 1: '我的第一条' }, checked: { 1: [0] }, startedAt: 500, updatedAt: 1000 };
  store.applyRemote('essay', 'sl-merge', { answers: { 2: '对方的第二条' }, checked: { 2: [1, 2] }, startedAt: 300 }, 2000);
  const dm = storage['exam:d:u7:sl-merge'];
  check('申论合并保留双方作答', !!dm.answers['1'] && !!dm.answers['2']);
  check('申论合并保留双方自评', !!dm.checked['1'] && !!dm.checked['2']);
  check('申论开始时间取更早', dm.startedAt === 300, String(dm.startedAt));

  console.log(fails.length ? '\nIDENTITY_FAILED: ' + fails.join(', ') : '\nIDENTITY_OK');
  process.exit(fails.length ? 1 : 0);
}).catch(function (e) {
  console.log('FATAL ' + (e && e.message));
  process.exit(2);
});
