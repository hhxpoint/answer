const { qaList, hotKeywords } = require('../../data.js');

Page({
  data: {
    hotKeywords: hotKeywords,
    searchResult: [],
    keyword: '',
    isSearching: false
  },

  // 输入框输入事件
  onSearchInput(e) {
    const val = e.detail.value;
    this.executeSearch(val);
  },

  // 点击推荐标签
  onTagTap(e) {
    const word = e.currentTarget.dataset.word;
    this.setData({ keyword: word });
    this.executeSearch(word);
  },

  // 搜索核心逻辑
  executeSearch(val) {
    if (!val || val.trim() === '') {
      this.setData({ searchResult: [], isSearching: false, keyword: val });
      return;
    }
    const results = qaList.filter(item => 
      item.question.includes(val) || item.answer.includes(val)
    );
    this.setData({
      searchResult: results,
      isSearching: true,
      keyword: val
    });
  }
});