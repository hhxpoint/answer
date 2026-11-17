// libs/fetch-wechat.js
// fetch polyfill for WeChat Mini Programs
// 基于 fetch-wechat@0.0.3 源码

function fetchFunc() {
  return function (url, options) {
    options = options || {};
    var method = (options.method || 'GET').toUpperCase();
    var headers = options.headers || {};
    var body = options.body || null;

    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: method,
        header: headers,
        data: body,
        responseType: 'arraybuffer',
        success: function (res) {
          var headerStr = '';
          if (res.header) {
            var keys = Object.keys(res.header);
            for (var i = 0; i < keys.length; i++) {
              headerStr += keys[i] + ': ' + res.header[keys[i]] + '\r\n';
            }
          }
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: '',
            headers: {
              get: function (name) {
                return res.header ? res.header[name.toLowerCase()] : null;
              }
            },
            arrayBuffer: function () {
              return Promise.resolve(res.data);
            },
            text: function () {
              return Promise.resolve(
                typeof res.data === 'string' ? res.data :
                String.fromCharCode.apply(null, new Uint8Array(res.data))
              );
            },
            json: function () {
              return Promise.resolve(
                typeof res.data === 'string' ? JSON.parse(res.data) : res.data
              );
            }
          });
        },
        fail: function (err) {
          reject(new Error(err.errMsg || 'request failed'));
        }
      });
    });
  };
}

module.exports = { fetchFunc: fetchFunc };
