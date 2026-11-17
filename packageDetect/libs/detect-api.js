// packageDetect/libs/detect-api.js
// 目标检测服务端 API 模块
// 与 pictionary/chess 使用相同的 hhxgo.tech 服务器

var API_URL = 'https://hhxgo.tech';

function _getAuthHeader() {
  var token = wx.getStorageSync('token');
  var header = { 'Content-Type': 'application/json' };
  if (token) header['Authorization'] = 'Bearer ' + token;
  return header;
}

function _imageToBase64(filePath) {
  return new Promise(function(resolve, reject) {
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64',
      success: function(res) {
        resolve('data:image/jpeg;base64,' + res.data);
      },
      fail: function(err) {
        reject(new Error('图片读取失败: ' + (err.errMsg || '')));
      }
    });
  });
}

function recognizeDigit(imagePath) {
  return _imageToBase64(imagePath).then(function(base64) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: API_URL + '/api/detect/digit',
        method: 'POST',
        header: _getAuthHeader(),
        data: JSON.stringify({ image: base64 }),
        timeout: 15000,
        success: function(res) {
          if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
            resolve(res.data);
          } else {
            reject(new Error('服务返回错误: ' + res.statusCode));
          }
        },
        fail: function(err) {
          reject(new Error('网络请求失败: ' + (err.errMsg || '')));
        }
      });
    });
  });
}

function detectObjects(imagePath) {
  return _imageToBase64(imagePath).then(function(base64) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: API_URL + '/api/detect/objects',
        method: 'POST',
        header: _getAuthHeader(),
        data: JSON.stringify({ image: base64 }),
        timeout: 15000,
        success: function(res) {
          if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
            resolve(res.data);
          } else {
            reject(new Error('服务返回错误: ' + res.statusCode));
          }
        },
        fail: function(err) {
          reject(new Error('网络请求失败: ' + (err.errMsg || '')));
        }
      });
    });
  });
}

function recognizeHerbs(imagePath) {
  return _imageToBase64(imagePath).then(function(base64) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: API_URL + '/api/detect/herbs',
        method: 'POST',
        header: _getAuthHeader(),
        data: JSON.stringify({ image: base64 }),
        timeout: 15000,
        success: function(res) {
          if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
            resolve(res.data);
          } else {
            reject(new Error('服务返回错误: ' + res.statusCode));
          }
        },
        fail: function(err) {
          reject(new Error('网络请求失败: ' + (err.errMsg || '')));
        }
      });
    });
  });
}

module.exports = {
  recognizeDigit: recognizeDigit,
  detectObjects: detectObjects,
  recognizeHerbs: recognizeHerbs
};
