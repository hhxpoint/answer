// 情侣小火苗 API 封装
// Base: https://hhxpoint.me/couple-api （已在 request 合法域名中）
const spaceCtx = require('./space.js');

const BASE = 'https://hhxpoint.me/couple-api';
const TOKEN_KEY = 'couple_token';
const USER_KEY = 'couple_user';

function getToken() {
  try { return wx.getStorageSync(TOKEN_KEY) || ''; } catch (e) { return ''; }
}
function setToken(t) {
  try { wx.setStorageSync(TOKEN_KEY, t || ''); } catch (e) {}
}
function clearToken() {
  try { wx.removeStorageSync(TOKEN_KEY); } catch (e) {}
}
function getCachedUser() {
  try { return wx.getStorageSync(USER_KEY) || null; } catch (e) { return null; }
}
function setCachedUser(u) {
  try { wx.setStorageSync(USER_KEY, u || null); } catch (e) {}
}

function request(path, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    const header = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) header.Authorization = 'Bearer ' + token;
    const spaceId = spaceCtx.getCurrentSpaceId();
    if (spaceId > 0) header['X-Space-Id'] = String(spaceId);
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
        const err = data.error || { code: 'HTTP_' + res.statusCode, msg: '请求失败' };
        if (res.statusCode === 401) clearToken();
        if (err.code === 'NOT_MEMBER' || err.code === 'SPACE_NOT_FOUND') {
          spaceCtx.clearCurrentSpace();
        }
        reject(err);
      },
      fail: function () {
        reject({ code: 'NETWORK', msg: '网络不太好，稍后再试' });
      }
    });
  });
}

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (!res.code) {
          reject({ code: 'NO_CODE', msg: '微信登录失败' });
          return;
        }
        request('/login', { method: 'POST', data: { code: res.code } })
          .then(function (r) {
            setToken(r.token);
            setCachedUser(r.user);
            if (r.active_space_id) spaceCtx.setCurrentSpaceId(r.active_space_id);
            if (Array.isArray(r.spaces)) spaceCtx.setCachedSpaces(r.spaces);
            resolve(r);
          })
          .catch(reject);
      },
      fail: function () {
        reject({ code: 'LOGIN_FAIL', msg: '微信登录失败' });
      }
    });
  });
}

function ensureLogin() {
  if (getToken()) return Promise.resolve();
  return login();
}

function me() { return request('/me'); }

// ===== 关系空间 =====
function getSpaceId() { return spaceCtx.getCurrentSpaceId(); }
function setSpaceId(id) { return spaceCtx.setCurrentSpaceId(id); }
function clearSpace() { spaceCtx.clearCurrentSpace(); }
function listSpaces() {
  return request('/spaces').then(function (r) {
    spaceCtx.setCachedSpaces(r.spaces || []);
    return r;
  });
}
function createSpace(data) { return request('/spaces', { method: 'POST', data: data || {} }); }
function joinSpace(code, myLabel) {
  return request('/spaces/join', { method: 'POST', data: { code: code, my_label: myLabel || '' } });
}
function getSpace(id) { return request('/spaces/' + id); }
function updateSpace(id, data) { return request('/spaces/' + id, { method: 'PATCH', data: data || {} }); }
function leaveSpace(id) { return request('/spaces/' + id + '/leave', { method: 'POST', data: { confirm: true } }); }
function markRead(id) { return request('/messages/read', { method: 'POST', data: { id: id || 0 } }); }

function saveProfile(nickname, avatar) { return request('/profile', { method: 'POST', data: { nickname: nickname || '', avatar: avatar || '' } }); }
function createCouple() { return request('/couple/create', { method: 'POST' }); }
function joinCouple(code) { return request('/couple/join', { method: 'POST', data: { code: code } }); }
function unbind() { return request('/couple/unbind', { method: 'POST' }); }
function getPet() { return request('/pet'); }
function interact(type) { return request('/pet/interact', { method: 'POST', data: { type: type } }); }
function renamePet(name) { return request('/pet/rename', { method: 'POST', data: { name: name } }); }
function listMessages(after) { return request('/messages?after=' + (after || 0)); }
function recentMessages(limit) { return request('/messages/recent?limit=' + (limit || 50)); }
function sendMessage(content, replyTo, clientMsgId) {
  return request('/messages', {
    method: 'POST',
    data: { content: content, reply_to: replyTo || 0, client_msg_id: clientMsgId || '' }
  });
}
function recallMessage(id) { return request('/messages/' + id + '/recall', { method: 'POST' }); }

// 我们的时光
function uploadImage(dataUrl) { return request('/upload', { method: 'POST', data: { image: dataUrl } }); }
function listDiaries(before, limit) {
  return request('/diaries?before=' + (before || 0) + '&limit=' + (limit || 10));
}
function createDiary(content, images) {
  return request('/diaries', { method: 'POST', data: { content: content || '', images: images || [] } });
}
function deleteDiary(id) { return request('/diaries/' + id, { method: 'DELETE' }); }

// 纪念日
function listAnniversaries() { return request('/anniversaries'); }
function createAnniversary(title, date, repeatYearly) {
  return request('/anniversaries', { method: 'POST', data: { title: title, date: date, repeat_yearly: !!repeatYearly } });
}
function updateAnniversary(id, title, date, repeatYearly) {
  return request('/anniversaries/' + id, { method: 'PUT', data: { title: title, date: date, repeat_yearly: !!repeatYearly } });
}
function deleteAnniversary(id) { return request('/anniversaries/' + id, { method: 'DELETE' }); }

// 侧耳倾听（语音信箱）
function sendVoice(audioDataUrl) { return request('/voice', { method: 'POST', data: { audio: audioDataUrl } }); }
function listVoices(before, limit) {
  return request('/voice?before=' + (before || 0) + '&limit=' + (limit || 20));
}
function recallVoice(id) { return request('/voice/' + id + '/recall', { method: 'POST' }); }

// 把服务端返回的相对头像地址补全成完整 URL
function absUrl(u) {
  const s = String(u || '');
  if (!s) return '';
  if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0) return s;
  if (s.charAt(0) === '/') return 'https://hhxpoint.me' + s;
  return '';
}

module.exports = {
  request: request,
  login: login,
  ensureLogin: ensureLogin,
  getToken: getToken,
  clearToken: clearToken,
  getCachedUser: getCachedUser,
  setCachedUser: setCachedUser,
  me: me,
  getSpaceId: getSpaceId,
  setSpaceId: setSpaceId,
  clearSpace: clearSpace,
  listSpaces: listSpaces,
  createSpace: createSpace,
  joinSpace: joinSpace,
  getSpace: getSpace,
  updateSpace: updateSpace,
  leaveSpace: leaveSpace,
  markRead: markRead,
  saveProfile: saveProfile,
  createCouple: createCouple,
  joinCouple: joinCouple,
  unbind: unbind,
  getPet: getPet,
  interact: interact,
  renamePet: renamePet,
  listMessages: listMessages,
  recentMessages: recentMessages,
  sendMessage: sendMessage,
  recallMessage: recallMessage,
  uploadImage: uploadImage,
  listDiaries: listDiaries,
  createDiary: createDiary,
  deleteDiary: deleteDiary,
  listAnniversaries: listAnniversaries,
  createAnniversary: createAnniversary,
  updateAnniversary: updateAnniversary,
  deleteAnniversary: deleteAnniversary,
  sendVoice: sendVoice,
  listVoices: listVoices,
  recallVoice: recallVoice,
  absUrl: absUrl
};
