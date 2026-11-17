const STORAGE_KEY = 'learningCenterData';

function createDefaultData() {
  return {
    wrongQuestions: [],
    favorites: [],
    studySessions: [],
    lastStudyAt: 0
  };
}

function safeArray(input) {
  return Array.isArray(input) ? input : [];
}

function getData() {
  const raw = wx.getStorageSync(STORAGE_KEY) || {};
  return {
    wrongQuestions: safeArray(raw.wrongQuestions),
    favorites: safeArray(raw.favorites),
    studySessions: safeArray(raw.studySessions),
    lastStudyAt: Number(raw.lastStudyAt) || 0
  };
}

function saveData(data) {
  wx.setStorageSync(STORAGE_KEY, {
    wrongQuestions: safeArray(data.wrongQuestions),
    favorites: safeArray(data.favorites),
    studySessions: safeArray(data.studySessions),
    lastStudyAt: Number(data.lastStudyAt) || 0
  });
}

function now() {
  return Date.now();
}

function createKey(prefix, source, idText) {
  return `${prefix}_${source}_${idText}`;
}

function normalizeText(val) {
  return (val || '').toString().trim();
}

function addWrongQuestion(payload) {
  const data = getData();
  const source = normalizeText(payload.source) || 'unknown';
  const title = normalizeText(payload.title);
  const answer = normalizeText(payload.answer);
  const userAnswer = normalizeText(payload.userAnswer);
  const questionId = normalizeText(payload.questionId || title || answer || now());
  const key = createKey('wrong', source, questionId);

  const next = {
    key,
    source,
    questionId,
    title,
    answer,
    userAnswer,
    analysis: normalizeText(payload.analysis),
    type: normalizeText(payload.type),
    updatedAt: now()
  };

  const index = data.wrongQuestions.findIndex(item => item.key === key);
  if (index >= 0) {
    data.wrongQuestions[index] = next;
  } else {
    data.wrongQuestions.unshift(next);
  }

  if (data.wrongQuestions.length > 300) {
    data.wrongQuestions = data.wrongQuestions.slice(0, 300);
  }

  data.lastStudyAt = now();
  saveData(data);
  return next;
}

function removeWrongQuestion(key) {
  const data = getData();
  data.wrongQuestions = data.wrongQuestions.filter(item => item.key !== key);
  saveData(data);
}

function isFavorited(source, itemId) {
  const data = getData();
  const key = createKey('fav', normalizeText(source) || 'unknown', normalizeText(itemId));
  return data.favorites.some(item => item.key === key);
}

function toggleFavorite(payload) {
  const data = getData();
  const source = normalizeText(payload.source) || 'unknown';
  const itemId = normalizeText(payload.itemId || payload.title || now());
  const key = createKey('fav', source, itemId);
  const idx = data.favorites.findIndex(item => item.key === key);

  if (idx >= 0) {
    data.favorites.splice(idx, 1);
    saveData(data);
    return { added: false, key };
  }

  data.favorites.unshift({
    key,
    source,
    itemId,
    title: normalizeText(payload.title),
    subtitle: normalizeText(payload.subtitle),
    route: normalizeText(payload.route),
    updatedAt: now()
  });

  if (data.favorites.length > 300) {
    data.favorites = data.favorites.slice(0, 300);
  }

  data.lastStudyAt = now();
  saveData(data);
  return { added: true, key };
}

function removeFavorite(key) {
  const data = getData();
  data.favorites = data.favorites.filter(item => item.key !== key);
  saveData(data);
}

function addStudySession(payload) {
  const data = getData();
  const moduleName = normalizeText(payload.module) || 'unknown';
  const durationSec = Math.max(0, Math.floor(Number(payload.durationSec) || 0));

  data.studySessions.unshift({
    module: moduleName,
    durationSec,
    note: normalizeText(payload.note),
    at: now()
  });

  if (data.studySessions.length > 500) {
    data.studySessions = data.studySessions.slice(0, 500);
  }

  data.lastStudyAt = now();
  saveData(data);
}

function clearAllLearningData() {
  saveData(createDefaultData());
}

function getSummary() {
  const data = getData();
  const totalSec = data.studySessions.reduce((sum, item) => sum + (Number(item.durationSec) || 0), 0);
  const totalMinutes = Math.round(totalSec / 60);

  return {
    wrongCount: data.wrongQuestions.length,
    favoriteCount: data.favorites.length,
    totalMinutes,
    lastStudyAt: data.lastStudyAt || 0
  };
}

module.exports = {
  getData,
  getSummary,
  addWrongQuestion,
  removeWrongQuestion,
  isFavorited,
  toggleFavorite,
  removeFavorite,
  addStudySession,
  clearAllLearningData
};
