const { qaList, hotKeywords } = require('../../data.js');

const SEARCH_HISTORY_KEY = 'searchHistoryKeywords';
const MAX_HISTORY = 10;

function normalizeKeyword(val) {
  return String(val || '').trim();
}

Page({
  data: {
    hotKeywords: hotKeywords,
    searchResult: [],
    suggestions: [],
    historyKeywords: [],
    keyword: '',
    isSearching: false,
    searchScope: 'all',
    sortMode: 'relevance',
    scopeOptions: [
      { label: '全部', value: 'all' },
      { label: '仅问题', value: 'question' },
      { label: '仅解析', value: 'answer' }
    ],
    sortOptions: [
      { label: '最相关', value: 'relevance' },
      { label: '最新', value: 'latest' },
      { label: '最短', value: 'shortest' }
    ]
  },

  onLoad() {
    this.loadHistory();
  },

  onUnload() {
    if (this.inputTimer) {
      clearTimeout(this.inputTimer);
    }
  },

  loadHistory() {
    const list = wx.getStorageSync(SEARCH_HISTORY_KEY) || [];
    this.setData({ historyKeywords: Array.isArray(list) ? list : [] });
  },

  saveHistory(word) {
    const keyword = normalizeKeyword(word);
    if (!keyword) {
      return;
    }

    const list = this.data.historyKeywords.filter(item => item !== keyword);
    list.unshift(keyword);
    const next = list.slice(0, MAX_HISTORY);

    wx.setStorageSync(SEARCH_HISTORY_KEY, next);
    this.setData({ historyKeywords: next });
  },

  onSearchInput(e) {
    const val = normalizeKeyword(e.detail.value);
    this.setData({ keyword: val });
    this.updateSuggestions(val);

    if (this.inputTimer) {
      clearTimeout(this.inputTimer);
    }

    this.inputTimer = setTimeout(() => {
      this.executeSearch(val, false);
    }, 160);
  },

  onSearchConfirm() {
    const keyword = normalizeKeyword(this.data.keyword);
    if (!keyword) {
      return;
    }
    this.executeSearch(keyword, true);
  },

  onClearKeyword() {
    this.setData({
      keyword: '',
      searchResult: [],
      suggestions: [],
      isSearching: false
    });
  },

  onTagTap(e) {
    const word = normalizeKeyword(e.currentTarget.dataset.word);
    this.setData({ keyword: word });
    this.executeSearch(word, true);
  },

  onSuggestionTap(e) {
    const word = normalizeKeyword(e.currentTarget.dataset.word);
    this.setData({ keyword: word, suggestions: [] });
    this.executeSearch(word, true);
  },

  onHistoryTap(e) {
    const word = normalizeKeyword(e.currentTarget.dataset.word);
    this.setData({ keyword: word });
    this.executeSearch(word, false);
  },

  onClearHistory() {
    wx.removeStorageSync(SEARCH_HISTORY_KEY);
    this.setData({ historyKeywords: [] });
  },

  onScopeChange(e) {
    const value = e.currentTarget.dataset.value;
    if (!value || value === this.data.searchScope) {
      return;
    }
    this.setData({ searchScope: value });
    this.executeSearch(this.data.keyword, false);
  },

  onSortChange(e) {
    const value = e.currentTarget.dataset.value;
    if (!value || value === this.data.sortMode) {
      return;
    }
    this.setData({ sortMode: value });
    this.executeSearch(this.data.keyword, false);
  },

  updateSuggestions(val) {
    const keyword = normalizeKeyword(val);
    if (!keyword) {
      this.setData({ suggestions: [] });
      return;
    }

    const keywordLower = keyword.toLowerCase();
    const candidate = [];

    hotKeywords.forEach(word => {
      if (String(word).toLowerCase().includes(keywordLower)) {
        candidate.push(word);
      }
    });

    for (let i = 0; i < qaList.length && candidate.length < 8; i += 1) {
      const question = qaList[i].question || '';
      if (question.toLowerCase().includes(keywordLower)) {
        candidate.push(question.replace('什么是', '').replace('？', '').trim());
      }
    }

    const unique = [...new Set(candidate)].filter(Boolean).slice(0, 8);
    this.setData({ suggestions: unique });
  },

  executeSearch(val, shouldSaveHistory) {
    const keyword = normalizeKeyword(val);
    if (!keyword) {
      this.setData({
        searchResult: [],
        isSearching: false,
        keyword,
        suggestions: []
      });
      return;
    }

    const keywordLower = keyword.toLowerCase();
    const scope = this.data.searchScope;
    const sortMode = this.data.sortMode;

    const results = qaList
      .map(item => {
        const question = String(item.question || '');
        const answer = String(item.answer || '');
        const qLower = question.toLowerCase();
        const aLower = answer.toLowerCase();
        const qIndex = qLower.indexOf(keywordLower);
        const aIndex = aLower.indexOf(keywordLower);

        const qMatched = qIndex >= 0;
        const aMatched = aIndex >= 0;
        const matched =
          scope === 'all'
            ? qMatched || aMatched
            : scope === 'question'
              ? qMatched
              : aMatched;

        if (!matched) {
          return null;
        }

        let score = 0;
        if (qMatched) {
          score += qIndex === 0 ? 220 : 140;
          score -= qIndex;
        }
        if (aMatched) {
          score += aIndex === 0 ? 120 : 70;
          score -= aIndex * 0.5;
        }
        if (question === keyword) {
          score += 400;
        }
        if (question.includes(keyword)) {
          score += 30;
        }

        return {
          ...item,
          _score: score,
          _hitText: qMatched && aMatched ? '问题+解析命中' : qMatched ? '问题命中' : '解析命中'
        };
      })
      .filter(Boolean);

    if (sortMode === 'latest') {
      results.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortMode === 'shortest') {
      results.sort((a, b) => (a.question || '').length - (b.question || '').length);
    } else {
      results.sort((a, b) => b._score - a._score);
    }

    if (shouldSaveHistory) {
      this.saveHistory(keyword);
    }

    this.setData({
      searchResult: results,
      isSearching: true,
      keyword,
      suggestions: []
    });
  },

  onCopyQuestion(e) {
    const text = e.currentTarget.dataset.text || '';
    if (!text) {
      return;
    }
    wx.setClipboardData({ data: text });
  },

  onCopyAnswer(e) {
    const text = e.currentTarget.dataset.text || '';
    if (!text) {
      return;
    }
    wx.setClipboardData({ data: text });
  }
});