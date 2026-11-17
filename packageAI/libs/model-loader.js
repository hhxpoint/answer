// packageAI/libs/model-loader.js
// 模型缓存已由 TFJS 插件的 fileStorageIO 自动管理
// 本文件保留作为导出接口，实际逻辑在 pose-estimator.js 中

const modelUrl =
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/model/movenet_singlepose_lightning_4/model.json';

/**
 * 获取模型 CDN 地址
 */
function getModelUrl() {
  return modelUrl;
}

/**
 * 清除本地模型缓存
 */
function clearModelCache() {
  try {
    const fs = wx.getFileSystemManager();
    const basePath = wx.env.USER_DATA_PATH;
    // fileStorageIO 生成的缓存文件名
    const files = ['movenet_lightning.model.json', 'movenet_lightning.weights.bin'];
    files.forEach(f => {
      try { fs.unlinkSync(`${basePath}/${f}`); } catch (e) {}
    });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getModelUrl,
  clearModelCache
};
