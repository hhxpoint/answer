/**
 * 全局资料门禁
 *
 * 规则：除了「完善资料」页和用户中心，任何页面在 onShow 时如果还没有
 * 头像 + 昵称，就先跳到完善资料页；填完回到原来那一页（带原 query）。
 *
 * 说明：分享链接进来也走这一套，保证新用户/没填过的老用户都被规范一次。
 */
const gp = require('./global-profile.js');

const WELCOME = '/pages/welcome/welcome';
const FROM_KEY = 'onboard:from';
const SKIP_PREFIX = ['/pages/welcome/welcome', '/pages/user/user'];

function ready() {
  try {
    const p = gp.getLocalProfile() || {};
    return !!(p.nickName && p.avatarUrl && String(p.avatarUrl).length > 8);
  } catch (e) {
    return false;
  }
}

/** 当前页面完整地址（含 query），用于填完资料后原路返回 */
function currentUrl() {
  try {
    const pages = getCurrentPages();
    const p = pages && pages[pages.length - 1];
    if (!p || !p.route) return '';
    const opts = p.options || {};
    const qs = Object.keys(opts)
      .filter(function (k) { return opts[k] !== undefined && opts[k] !== ''; })
      .map(function (k) { return k + '=' + encodeURIComponent(opts[k]); })
      .join('&');
    return '/' + p.route + (qs ? '?' + qs : '');
  } catch (e) {
    return '';
  }
}

function shouldSkip(url) {
  for (let i = 0; i < SKIP_PREFIX.length; i++) {
    if (url.indexOf(SKIP_PREFIX[i]) === 0) return true;
  }
  return false;
}

/**
 * 页面 onShow 里调用。
 * @returns {boolean} true 表示已经触发跳转，调用方应直接 return
 */
function guard() {
  const cur = currentUrl();
  if (!cur || shouldSkip(cur)) return false;
  if (ready()) return false;

  try {
    wx.setStorageSync(FROM_KEY, cur);
  } catch (e) {
    // 忽略
  }
  wx.reLaunch({ url: WELCOME + '?from=' + encodeURIComponent(cur) });
  return true;
}

function takeFrom() {
  try {
    return wx.getStorageSync(FROM_KEY) || '';
  } catch (e) {
    return '';
  }
}

function clearFrom() {
  try {
    wx.removeStorageSync(FROM_KEY);
  } catch (e) {
    // ignore
  }
}

module.exports = {
  WELCOME: WELCOME,
  FROM_KEY: FROM_KEY,
  ready: ready,
  currentUrl: currentUrl,
  guard: guard,
  takeFrom: takeFrom,
  clearFrom: clearFrom
};
