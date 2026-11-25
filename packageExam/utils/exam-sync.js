/**
 * 公考题库 · 云端同步
 *
 * 策略：
 *   · 只有真实账号（uid != 'local'）且有 token 才同步
 *   · 拉取：进模块时 GET 全量，按 updatedAt 新者覆盖
 *   · 上传：作答后 2.5 秒防抖 PUT；失败进待办队列，下次进模块重试
 *   · 首次登录：把本地历史 batch 上传一次
 */
const gp = require('../../utils/global-profile.js');
const identity = require('./exam-identity.js');
const store = require('./exam-store.js');

const BASE = 'https://hhxpoint.me/couple-api/exam';
const K_PENDING = 'exam:sync:pending';
const K_BOOTSTRAPPED = 'exam:sync:boot';

const timers = {};
let pulling = false;

function token() {
  try {
    return gp.getToken() || '';
  } catch (e) {
    return '';
  }
}

function canSync() {
  return identity.isRealUser() && !!token();
}

function request(method, path, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: BASE + path,
      method: method,
      data: data,
      timeout: 20000,
      header: { 'content-type': 'application/json', Authorization: 'Bearer ' + token() },
      success: function (res) {
        if (res.statusCode === 200 && res.data && res.data.ok) resolve(res.data);
        else reject(new Error((res.data && res.data.error && res.data.error.msg) || ('HTTP ' + res.statusCode)));
      },
      fail: function (err) {
        reject(new Error((err && err.errMsg) || '网络异常'));
      }
    });
  });
}

// ---------------- 待办队列 ----------------

function readPending() {
  try {
    const v = wx.getStorageSync(K_PENDING);
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

function writePending(list) {
  try {
    wx.setStorageSync(K_PENDING, list.slice(0, 200));
  } catch (e) {
    // ignore
  }
}

function enqueue(kind, key) {
  const list = readPending();
  const id = kind + '|' + key;
  if (!list.some(function (x) { return x === id; })) {
    list.push(id);
    writePending(list);
  }
}

// ---------------- 上传 ----------------

function pushNow(kind, key, payload) {
  if (!canSync() || !payload) return Promise.resolve(false);
  return request('PUT', '/progress', {
    item: { kind: kind, key: key, payload: payload, updatedAt: payload.updatedAt || Date.now() }
  }).then(function () {
    return true;
  }).catch(function () {
    enqueue(kind, key);
    return false;
  });
}

/** 作答后调用：按 key 防抖，避免每选一次就发一次请求 */
function pushSoon(kind, key, payload) {
  if (!canSync()) {
    enqueue(kind, key);
    return;
  }
  const id = kind + '|' + key;
  if (timers[id]) clearTimeout(timers[id]);
  timers[id] = setTimeout(function () {
    delete timers[id];
    pushNow(kind, key, payload);
  }, 2500);
}

// ---------------- 拉取 ----------------

function pull() {
  if (!canSync() || pulling) return Promise.resolve({ merged: 0 });
  pulling = true;
  return request('GET', '/progress?since=0')
    .then(function (res) {
      const items = (res && res.items) || [];
      let merged = 0;
      items.forEach(function (it) {
        if (store.applyRemote(it.kind, it.key, it.payload || {}, it.updatedAt || 0)) merged += 1;
      });
      return { merged: merged, total: items.length };
    })
    .catch(function () {
      return { merged: 0, error: true };
    })
    .then(function (r) {
      pulling = false;
      return r;
    });
}

/** 首次登录：本地历史整包上传（只做一次） */
function bootstrap() {
  if (!canSync()) return Promise.resolve(false);
  try {
    if (wx.getStorageSync(K_BOOTSTRAPPED) === identity.uid()) return Promise.resolve(false);
  } catch (e) {
    // ignore
  }
  const items = store.listLocal().slice(0, 60);
  if (!items.length) {
    try { wx.setStorageSync(K_BOOTSTRAPPED, identity.uid()); } catch (e) {}
    return Promise.resolve(false);
  }
  return request('POST', '/progress/batch', { items: items })
    .then(function () {
      try { wx.setStorageSync(K_BOOTSTRAPPED, identity.uid()); } catch (e) {}
      return true;
    })
    .catch(function () { return false; });
}

/** 重试待办（上传失败的） */
function flush() {
  const list = readPending();
  if (!list.length || !canSync()) return Promise.resolve(0);
  const all = store.listLocal();
  const byId = {};
  all.forEach(function (it) { byId[it.kind + '|' + it.key] = it; });

  const items = [];
  const keep = [];
  list.forEach(function (id) {
    const it = byId[id];
    if (it) items.push(it);
    else keep.push(id);
  });
  if (!items.length) {
    writePending(keep);
    return Promise.resolve(0);
  }
  return request('POST', '/progress/batch', { items: items.slice(0, 60) })
    .then(function () {
      writePending(keep);
      return items.length;
    })
    .catch(function () {
      return 0;
    });
}

/** 进模块时调用：拉取 → 引导上传 → 补传 */
function auto() {
  return pull()
    .then(function () { return bootstrap(); })
    .then(function () { return flush(); })
    .then(function () {
      return { ok: true, uid: identity.uid() };
    })
    .catch(function () {
      return { ok: false, uid: identity.uid() };
    });
}

module.exports = {
  canSync: canSync,
  pull: pull,
  pushSoon: pushSoon,
  pushNow: pushNow,
  flush: flush,
  bootstrap: bootstrap,
  auto: auto,
  pendingCount: function () { return readPending().length; }
};
