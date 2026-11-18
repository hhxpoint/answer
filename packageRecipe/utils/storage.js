// 纯本地存储：收藏 / 历史 / 最近搜索（不依赖服务端）
const FAV_KEY = 'recipe_favorites_v1';
const HIS_KEY = 'recipe_history_v1';
const Q_KEY = 'recipe_queries_v1';

function get(key, def) {
  try {
    const v = wx.getStorageSync(key);
    return v || def;
  } catch (e) {
    return def;
  }
}

function set(key, val) {
  try {
    wx.setStorageSync(key, val);
  } catch (e) {}
}

function favorites() {
  return get(FAV_KEY, []);
}

function isFavorite(id) {
  return favorites().indexOf(id) >= 0;
}

function toggleFavorite(id) {
  const list = favorites();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(id);
  set(FAV_KEY, list.slice(0, 200));
  return idx < 0;
}

function history() {
  return get(HIS_KEY, []);
}

function pushHistory(id) {
  const list = history().filter((x) => x !== id);
  list.unshift(id);
  set(HIS_KEY, list.slice(0, 40));
}

function recentQueries() {
  return get(Q_KEY, []);
}

function pushQuery(q) {
  const text = String(q || '').trim();
  if (!text) return;
  const list = recentQueries().filter((x) => x !== text);
  list.unshift(text);
  set(Q_KEY, list.slice(0, 10));
}

module.exports = {
  favorites: favorites,
  isFavorite: isFavorite,
  toggleFavorite: toggleFavorite,
  history: history,
  pushHistory: pushHistory,
  recentQueries: recentQueries,
  pushQuery: pushQuery,
};
