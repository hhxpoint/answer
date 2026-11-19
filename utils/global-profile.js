// 全局个人资料同步（个人中心 ↔ 小火苗）
// 单一身份：小程序 wx.login -> couple-api 用户（openid 唯一）
// 本地缓存：userProfile / userFirstRegisterAt
// 服务端缓存：couple_token / couple_user / couple_space_id / couple_spaces_cache
const PROFILE_KEY = 'userProfile';
const FIRST_KEY = 'userFirstRegisterAt';
const TOKEN_KEY = 'couple_token';
const USER_KEY = 'couple_user';
const SPACE_KEY = 'couple_space_id';
const SPACES_KEY = 'couple_spaces_cache';
const LOGGED_OUT_KEY = 'globalProfileLoggedOut';
const BASE = 'https://hhxpoint.me/couple-api';

let loginPromise = null;
let syncPromise = null;

function storageGet(key, fallback) {
  try {
    const v = wx.getStorageSync(key);
    return v === undefined || v === '' ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function storageSet(key, value) {
  try { wx.setStorageSync(key, value); } catch (e) {}
}
function storageRemove(key) {
  try { wx.removeStorageSync(key); } catch (e) {}
}
function getToken() { return storageGet(TOKEN_KEY, ''); }
function clearToken() { storageRemove(TOKEN_KEY); storageRemove(USER_KEY); }

function absUrl(u) {
  const s = String(u || '');
  if (!s) return '';
  if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0) return s;
  if (s.charAt(0) === '/') return 'https://hhxpoint.me' + s;
  return s;
}

function getLocalProfile() {
  const p = storageGet(PROFILE_KEY, null);
  return p && typeof p === 'object' ? p : null;
}
function isComplete(p) {
  return !!(p && p.nickName && p.avatarUrl);
}
function saveLocalProfile(profile) {
  const old = getLocalProfile() || {};
  const first = Number(old.createdAt) || Number(storageGet(FIRST_KEY, 0)) || Date.now();
  storageSet(FIRST_KEY, first);
  const merged = Object.assign({}, old, profile || {});
  merged.createdAt = first;
  merged.updatedAt = Date.now();
  storageSet(PROFILE_KEY, merged);
  return merged;
}
// 服务端用户 -> 本地 userProfile（保留本地注册时间）
function acceptServerUser(user) {
  if (!user || (!user.nickname && !user.avatar)) return getLocalProfile();
  const old = getLocalProfile() || {};
  if (user.id) {
    storageSet(USER_KEY, {
      id: user.id,
      nickname: user.nickname || '',
      avatar: user.avatar || '',
    });
  }
  return saveLocalProfile({
    userId: user.id ? 'u' + user.id : old.userId,
    nickName: user.nickname || old.nickName || '',
    avatarUrl: absUrl(user.avatar) || old.avatarUrl || '',
  });
}
function clearSession() {
  storageRemove(PROFILE_KEY);
  storageRemove(FIRST_KEY);
  clearToken();
  storageRemove(SPACE_KEY);
  storageRemove(SPACES_KEY);
  storageSet(LOGGED_OUT_KEY, 1);
}
function isLoggedOut() {
  return !!storageGet(LOGGED_OUT_KEY, false);
}
function markLoggedIn() {
  storageRemove(LOGGED_OUT_KEY);
}

function request(path, options, retried) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    const header = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) header.Authorization = 'Bearer ' + token;
    wx.request({
      url: BASE + path,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      timeout: 20000,
      success: function (res) {
        const data = res.data || {};
        if (data.ok) {
          resolve(data);
          return;
        }
        if (res.statusCode === 401 && !retried) {
          clearToken();
          login().then(function () { return request(path, options, true); }).then(resolve).catch(reject);
          return;
        }
        const err = data.error || { code: 'HTTP_' + res.statusCode, msg: '请求失败' };
        reject(err);
      },
      fail: function () {
        reject({ code: 'NETWORK', msg: '网络不太好，稍后再试' });
      }
    });
  });
}

function login() {
  if (loginPromise) return loginPromise;
  loginPromise = new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (!res.code) {
          reject({ code: 'NO_CODE', msg: '微信登录失败' });
          return;
        }
        request('/login', { method: 'POST', data: { code: res.code } }, true)
          .then(function (r) {
            storageSet(TOKEN_KEY, r.token || '');
            storageSet(USER_KEY, r.user || null);
            if (r.active_space_id) storageSet(SPACE_KEY, r.active_space_id);
            if (Array.isArray(r.spaces)) storageSet(SPACES_KEY, r.spaces);
            resolve(r);
          })
          .catch(reject);
      },
      fail: function () {
        reject({ code: 'LOGIN_FAIL', msg: '微信登录失败' });
      }
    });
  }).finally(function () { loginPromise = null; });
  return loginPromise;
}
function ensureLogin() {
  if (getToken()) return Promise.resolve();
  return login();
}

function readFileDataUrl(filePath) {
  return new Promise(function (resolve, reject) {
    const s = String(filePath || '');
    if (!s) { reject({ code: 'NO_AVATAR', msg: '没有头像' }); return; }
    if (s.indexOf('data:image/') === 0) { resolve(s); return; }
    const m = /\.(png|jpe?g|webp)$/i.exec(s);
    let ext = m ? m[1].toLowerCase() : 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    wx.getFileSystemManager().readFile({
      filePath: s,
      encoding: 'base64',
      success: function (res) {
        resolve('data:image/' + mime + ';base64,' + res.data);
      },
      fail: function () {
        reject({ code: 'READ_FAIL', msg: '头像读取失败' });
      }
    });
  });
}

// 本地头像 -> 服务端可接受的 avatar 字段
function avatarInput(profile) {
  const s = String((profile && profile.avatarUrl) || '');
  if (!s) return Promise.resolve('');
  if (s.indexOf('data:image/') === 0) return Promise.resolve(s);
  if (s.indexOf('/couple-api/files/avatars/') === 0) return Promise.resolve(s);
  if (s.indexOf('https://') === 0) return Promise.resolve(s);
  if (s.indexOf('http://') === 0) return Promise.resolve(''); // 服务端只接受 https/data/相对路径
  return readFileDataUrl(s);
}

// 服务端已有资料 -> 本地（个人中心）
function syncFromServer() {
  if (isLoggedOut()) return Promise.resolve(null);
  return ensureLogin()
    .then(function () { return request('/me'); })
    .then(function (res) {
      const user = res.user || {};
      if (user.nickname && user.avatar) return acceptServerUser(user);
      return getLocalProfile();
    });
}

// 本地已注册 -> 服务端（首次注册 / 小火苗自动带入）
function pushLocalProfile(profileArg) {
  const local = profileArg || getLocalProfile();
  if (isLoggedOut() || !isComplete(local)) {
    return Promise.resolve({ skipped: true, profile: local });
  }
  if (syncPromise) return syncPromise;
  syncPromise = ensureLogin()
    .then(function () { return request('/me'); })
    .then(function (res) {
      const server = res.user || {};
      const serverAvatar = absUrl(server.avatar);
      const localAvatar = String(local.avatarUrl || '');
      const sameNick = server.nickname === local.nickName;
      const localIsServerAvatar = !!localAvatar && (
        localAvatar === serverAvatar ||
        localAvatar.indexOf('/couple-api/files/avatars/') === 0 ||
        localAvatar.indexOf('https://hhxpoint.me/couple-api/files/avatars/') === 0
      );
      // 服务端资料完整且就是这份资料：不重复写
      if (sameNick && server.nickname && server.avatar && localIsServerAvatar) {
        return acceptServerUser(server);
      }
      return avatarInput(local).then(function (data) {
        return request('/profile', {
          method: 'POST',
          data: { nickname: local.nickName, avatar: data }
        });
      }).then(function (r) {
        return acceptServerUser(r.user);
      });
    })
    .finally(function () {
      syncPromise = null;
    });
  return syncPromise;
}

module.exports = {
  PROFILE_KEY: PROFILE_KEY,
  FIRST_KEY: FIRST_KEY,
  getLocalProfile: getLocalProfile,
  saveLocalProfile: saveLocalProfile,
  isComplete: isComplete,
  acceptServerUser: acceptServerUser,
  syncFromServer: syncFromServer,
  pushLocalProfile: pushLocalProfile,
  ensureLogin: ensureLogin,
  getToken: getToken,
  absUrl: absUrl,
  clearSession: clearSession,
};
