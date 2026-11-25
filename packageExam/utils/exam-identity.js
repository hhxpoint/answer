/**
 * 公考题库 · 身份
 *
 * 唯一标识：服务端 users.id（微信 openid 唯一），本地表现是 userProfile.userId = 'u<id>'。
 * 头像昵称复用全局资料（pages/user/user 同一套存储 userProfile），不另起一套。
 *
 * 门禁策略：
 *   · 入口（首页点「公考题库」）硬门禁：没头像昵称先去 setup 填
 *   · 直接进入某页（分享/历史栈）不拦，只由页面顶部提示，避免打断已开始的练习
 */
const gp = require('../../utils/global-profile.js');

const SETUP_URL = '/packageExam/pages/setup/setup';
const FALLBACK_UID = 'local';

function localProfile() {
  try {
    return gp.getLocalProfile() || {};
  } catch (e) {
    return {};
  }
}

/** 头像 + 昵称是否齐（纯本地判断，不依赖网络） */
function profileReady() {
  const p = localProfile();
  return !!(p && p.nickName && p.avatarUrl && String(p.avatarUrl).length > 8);
}

/** 已缓存的账号标识（'u5' / 'local'） */
function uid() {
  const p = localProfile();
  const id = p && p.userId ? String(p.userId) : '';
  if (!id) return FALLBACK_UID;
  return id;
}

function isRealUser() {
  return uid() !== FALLBACK_UID;
}

/**
 * 确保拿到真实账号 id（必要时走 wx.login）。
 * 失败不抛错：返回 'local'，让本地功能照常可用，等下次联网再迁。
 */
function ensureUid() {
  if (isRealUser()) return Promise.resolve(uid());
  return gp.ensureLogin()
    .then(function () { return gp.syncFromServer(); })
    .then(function () { return uid(); })
    .catch(function () { return FALLBACK_UID; });
}

/**
 * 入口门禁：填过资料直接进；没填过先去 setup，填完自动跳回目标页。
 * @param {string} target 目标页绝对路径
 * @returns {boolean} 是否直接放行
 */
function enter(target) {
  if (profileReady()) {
    wx.navigateTo({ url: target });
    return true;
  }
  wx.navigateTo({ url: SETUP_URL + '?from=' + encodeURIComponent(target) });
  return false;
}

module.exports = {
  SETUP_URL: SETUP_URL,
  FALLBACK_UID: FALLBACK_UID,
  profileReady: profileReady,
  uid: uid,
  isRealUser: isRealUser,
  ensureUid: ensureUid,
  enter: enter,
  localProfile: localProfile
};
