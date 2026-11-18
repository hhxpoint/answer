// 当前关系空间上下文（纯本地存储）
// 所有页面/请求都通过它确定"当前在哪个空间"，避免串数据。
const CURRENT_KEY = 'couple_space_id';
const LIST_KEY = 'couple_spaces_cache';

function getCurrentSpaceId() {
  try {
    const v = wx.getStorageSync(CURRENT_KEY);
    const n = parseInt(v, 10) || 0;
    return n > 0 ? n : 0;
  } catch (e) {
    return 0;
  }
}

function setCurrentSpaceId(id) {
  const n = parseInt(id, 10) || 0;
  try {
    if (n > 0) wx.setStorageSync(CURRENT_KEY, n);
    else wx.removeStorageSync(CURRENT_KEY);
  } catch (e) {}
  return n;
}

function clearCurrentSpace() {
  try { wx.removeStorageSync(CURRENT_KEY); } catch (e) {}
}

function getCachedSpaces() {
  try {
    const v = wx.getStorageSync(LIST_KEY);
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

function setCachedSpaces(list) {
  try { wx.setStorageSync(LIST_KEY, Array.isArray(list) ? list : []); } catch (e) {}
}

function clear() {
  clearCurrentSpace();
  try { wx.removeStorageSync(LIST_KEY); } catch (e) {}
}

module.exports = {
  getCurrentSpaceId: getCurrentSpaceId,
  setCurrentSpaceId: setCurrentSpaceId,
  clearCurrentSpace: clearCurrentSpace,
  getCachedSpaces: getCachedSpaces,
  setCachedSpaces: setCachedSpaces,
  clear: clear,
};
