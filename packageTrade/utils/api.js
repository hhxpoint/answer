const BASE = 'https://hhxpoint.me';
const TOKEN_KEY = 'trade_token';

function token() {
  try { return wx.getStorageSync(TOKEN_KEY) || ''; } catch (e) { return ''; }
}

function setToken(t) {
  try { wx.setStorageSync(TOKEN_KEY, t || ''); } catch (e) {}
}

function request(path, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    wx.request({
      url: BASE + path,
      method: options.method || 'GET',
      data: options.data || {},
      header: Object.assign({
        'content-type': 'application/json',
        Authorization: token() ? 'Bearer ' + token() : ''
      }, options.header || {}),
      timeout: 15000,
      success: function (res) {
        const body = res.data || {};
        if (res.statusCode >= 200 && res.statusCode < 300 && body.ok) {
          resolve(body);
          return;
        }
        if (res.statusCode === 401 && !options.noRetry) {
          login().then(function () {
            return request(path, Object.assign({}, options, { noRetry: true }));
          }).then(resolve).catch(reject);
          return;
        }
        const err = new Error((body.error && body.error.msg) || '网络请求失败');
        err.code = body.error && body.error.code;
        err.status = res.statusCode;
        reject(err);
      },
      fail: function () {
        reject(new Error('网络连接失败，稍后再试'));
      }
    });
  });
}

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (r) {
        if (!r || !r.code) {
          reject(new Error('微信登录失败'));
          return;
        }
        wx.request({
          url: BASE + '/couple-api/login',
          method: 'POST',
          data: { code: r.code },
          header: { 'content-type': 'application/json' },
          timeout: 15000,
          success: function (res) {
            const body = res.data || {};
            if (res.statusCode >= 200 && res.statusCode < 300 && body.ok && body.token) {
              setToken(body.token);
              resolve(body);
            } else {
              reject(new Error((body.error && body.error.msg) || '登录失败'));
            }
          },
          fail: function () { reject(new Error('登录网络失败')); }
        });
      },
      fail: function () { reject(new Error('微信登录失败')); }
    });
  });
}

function ensureLogin() {
  if (token()) return Promise.resolve();
  return login();
}

function uploadImage(filePath) {
  return new Promise(function (resolve, reject) {
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64',
      success: function (res) {
        const extMatch = /\.(png|jpe?g|webp)$/i.exec(filePath || '');
        let ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
        if (ext === 'jpeg') ext = 'jpg';
        const mime = ext === 'jpg' ? 'jpeg' : ext;
        const dataUrl = 'data:image/' + mime + ';base64,' + res.data;
        request('/trade-api/upload', { method: 'POST', data: { image: dataUrl } })
          .then(function (body) { resolve(body.url); })
          .catch(reject);
      },
      fail: function () { reject(new Error('图片读取失败')); }
    });
  });
}

module.exports = {
  BASE: BASE,
  token: token,
  login: login,
  ensureLogin: ensureLogin,
  request: request,
  uploadImage: uploadImage
};
