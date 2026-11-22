const RECORDS_KEY = 'tradeAppraisals';
const DRAFT_KEY = 'tradeDraft';
const MAX_RECORDS = 30;

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function records() {
  try {
    return safeArray(wx.getStorageSync(RECORDS_KEY));
  } catch (e) {
    return [];
  }
}

function saveRecord(record) {
  if (!record) return records();
  const list = records().filter(function (x) { return x.id !== record.id; });
  list.unshift(record);
  const trimmed = list.slice(0, MAX_RECORDS);
  try { wx.setStorageSync(RECORDS_KEY, trimmed); } catch (e) {}
  return trimmed;
}

function removeRecord(id) {
  const list = records().filter(function (x) { return x.id !== id; });
  try { wx.setStorageSync(RECORDS_KEY, list); } catch (e) {}
  return list;
}

function clearRecords() {
  try { wx.removeStorageSync(RECORDS_KEY); } catch (e) {}
}

function saveDraft(draft) {
  try { wx.setStorageSync(DRAFT_KEY, draft); } catch (e) {}
}

function getDraft() {
  try {
    return wx.getStorageSync(DRAFT_KEY) || null;
  } catch (e) {
    return null;
  }
}

function clearDraft() {
  try { wx.removeStorageSync(DRAFT_KEY); } catch (e) {}
}

module.exports = {
  records: records,
  saveRecord: saveRecord,
  removeRecord: removeRecord,
  clearRecords: clearRecords,
  saveDraft: saveDraft,
  getDraft: getDraft,
  clearDraft: clearDraft
};
