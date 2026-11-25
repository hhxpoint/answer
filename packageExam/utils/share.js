/**
 * 公考题库 · 分享
 *
 * 约定（与 packageCouple / packageTrade 一致）：
 *   · 每个页面实现 onShareAppMessage（转发给好友）与 onShareTimeline（朋友圈）
 *   · 标题/路径/封面统一收在这里，避免各页各写一套、改文案漏改
 *   · 朋友圈只能带 query，不能带完整 path，用 queryOf(path) 转换
 *
 * 隐私：错题本 / 学习报告 / 设置页属于个人数据页，分享时统一回落到公考首页，
 *       不把个人进度带进分享链接。
 */
const COVERS = {
  home: '/packageExam/assets/share/share-home.jpg',
  papers: '/packageExam/assets/share/share-papers.jpg',
  practice: '/packageExam/assets/share/share-practice.jpg',
  section: '/packageExam/assets/share/share-section.jpg',
  essay: '/packageExam/assets/share/share-essay.jpg',
  review: '/packageExam/assets/share/share-review.jpg'
};

const HOME = '/packageExam/pages/home/home';

function cover(name) {
  return COVERS[name] || COVERS.home;
}

/** 开启转发 + 朋友圈入口（页面 onLoad/onShow 里调用一次） */
function enableMenu() {
  try {
    if (!wx.showShareMenu) return;
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
      withShareTicket: false
    });
  } catch (e) {
    // 个别基础库/客户端会抛错，分享入口失败不能影响页面
  }
}

/** 完整路径 → 朋友圈 query（去掉路径与问号） */
function queryOf(path) {
  const s = String(path || '');
  const i = s.indexOf('?');
  return i >= 0 ? s.slice(i + 1) : '';
}

function enc(v) {
  return encodeURIComponent(String(v == null ? '' : v));
}

// ---------------- 各页分享内容 ----------------

function home() {
  return { title: '公考题库｜行测 3257 题 + 申论 6 套，点开就能练', path: HOME };
}

function papers(meta) {
  const n = meta && meta.total;
  const q = meta && meta.questions;
  const title = (n && q)
    ? ('国考+省考真题 ' + n + ' 卷 ' + q + ' 题，一起刷')
    : '国考+省考历年行测真题';
  return { title: title, path: '/packageExam/pages/papers/papers' };
}

function practice(paperKey, q, idx) {
  let path = '/packageExam/pages/practice/practice';
  const parts = [];
  if (paperKey) parts.push('paper=' + enc(paperKey));
  if (typeof idx === 'number' && idx >= 0) parts.push('jump=' + idx);
  if (parts.length) path += '?' + parts.join('&');

  let title = '来刷一道公考行测题';
  if (q && q.type) {
    title = '这道' + q.type + '题，你能做对吗？';
  } else if (q && q.no) {
    title = '第 ' + q.no + ' 题，来试试';
  }
  return { title: title, path: path };
}

function section() {
  return { title: '专项练习：按题型跨年份刷，图推/定义/逻辑/言语/数量', path: '/packageExam/pages/section/section' };
}

function essayHome() {
  return { title: '申论精练：6 套国考真题，材料·题目·作答三栏', path: '/packageExam/pages/essay-home/essay-home' };
}

function essayPractice(key, q, qIndex) {
  let path = '/packageExam/pages/essay-practice/essay-practice';
  if (key) path += '?paper=' + enc(key) + (typeof qIndex === 'number' ? '&q=' + qIndex : '');
  const title = (q && q.type)
    ? ('申论' + q.type + '题：' + String(q.stem || '').slice(0, 18) + '…')
    : '申论真题精练：材料·题目·作答';
  return { title: title, path: path };
}

function essayReview(key, q) {
  let path = '/packageExam/pages/essay-review/essay-review';
  if (key) path += '?paper=' + enc(key) + (q && q.no ? '&q=' + q.no : '');
  return {
    title: '红领巾批改：申论要点逐条对照，看看能得多少分',
    path: path
  };
}

/** 个人数据页（错题本/报告/资料设置）→ 统一分享首页，不带个人进度 */
function fallback() {
  return home();
}

/** 生成 onShareTimeline 返回值 */
function timeline(shareObj, coverName) {
  const s = shareObj || home();
  return {
    title: s.title,
    query: queryOf(s.path),
    imageUrl: cover(coverName)
  };
}

module.exports = {
  COVERS: COVERS,
  HOME: HOME,
  cover: cover,
  enableMenu: enableMenu,
  queryOf: queryOf,
  home: home,
  papers: papers,
  practice: practice,
  section: section,
  essayHome: essayHome,
  essayPractice: essayPractice,
  essayReview: essayReview,
  fallback: fallback,
  timeline: timeline
};
