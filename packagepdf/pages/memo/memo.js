const MAX_STORAGE_KB = 10240; 
const VINTAGE_COLORS = ['#E2C2A4', '#B5C4B1', '#C6B2A3', '#A8B1AD', '#D9C8B6', '#C1A5A9'];

const LITERARY_QUOTES = [
  "笔锋所至，皆是心之所向。日拱一卒，功不唐捐。",
  "岁月不居，时节如流。你的每一笔，都在雕刻时光。",
  "长风破浪会有时。文字的韧性，在于日复一日的坚持。",
  "点滴墨香，可汇江海。把岁月交给笔尖，把坚持交给时间。",
  "慢慢来，比较快。耐得住寂寞的灵魂，终能写出繁星满天。"
];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

Page({
  data: {
    memos: [],
    storagePercent: 0,
    remainingChars: 0,
    isInputing: false,
    currentTitle: '',  
    currentInput: '',
    editingMemoId: null, // 【新增】用于记录当前正在编辑的是哪条笔记
    
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    currentDay: new Date().getDate(),
    checkInDays: 0,
    hasCheckedIn: false,
    
    showQuote: false,
    currentQuote: "",
    showCalendarModal: false,
    yearCalendarData: []
  },

  onLoad() {
    this.initCheckInSystem();
    this.loadMemos();
    this.calculateStorage();
  },

  onShow() {
    this.initCheckInSystem();
    this.calculateStorage();
  },

  calculateStorage() {
    try {
      const res = wx.getStorageInfoSync();
      const currentSizeKB = res.currentSize;
      let percent = (currentSizeKB / MAX_STORAGE_KB) * 100;
      percent = percent.toFixed(1);
      const remainingKB = MAX_STORAGE_KB - currentSizeKB;
      let chars = Math.floor(remainingKB * 400); 
      this.setData({ storagePercent: percent, remainingChars: chars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    } catch (e) {}
  },

  loadMemos() { this.setData({ memos: wx.getStorageSync('coconut_memos') || [] }); },

  initCheckInSystem() {
    const now = new Date();
    const todayStr = formatDate(now);
    
    let history = wx.getStorageSync('coconut_checkin_history');
    if (!Array.isArray(history)) {
      history = [];
      wx.setStorageSync('coconut_checkin_history', history);
    }
    
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentDay: now.getDate(),
      checkInDays: history.length,
      hasCheckedIn: history.includes(todayStr)
    });
  },

  handleCheckIn() {
    if (this.data.hasCheckedIn) return;

    const now = new Date();
    const todayStr = formatDate(now);
    
    let history = wx.getStorageSync('coconut_checkin_history');
    if (!Array.isArray(history)) history = []; 
    
    if (!history.includes(todayStr)) {
      history.push(todayStr); 
      wx.setStorageSync('coconut_checkin_history', history);
    }

    wx.vibrateShort({ type: 'medium' });

    this.setData({
      hasCheckedIn: true,
      checkInDays: history.length,
      currentQuote: LITERARY_QUOTES[Math.floor(Math.random() * LITERARY_QUOTES.length)],
      showQuote: true
    });
    
    if(this.data.showCalendarModal) {
      this.generateYearCalendar();
    }
  },

  closeQuote() { this.setData({ showQuote: false }); },

  openHistoryCalendar() {
    this.generateYearCalendar();
    this.setData({ showCalendarModal: true });
  },
  
  closeHistoryCalendar() { this.setData({ showCalendarModal: false }); },

  generateYearCalendar() {
    const now = new Date();
    const year = now.getFullYear(); 
    const todayStr = formatDate(now);

    let history = wx.getStorageSync('coconut_checkin_history') || [];
    if (!Array.isArray(history)) history = [];

    let calendarData = [];

    for (let month = 0; month < 12; month++) {
      let daysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfWeek = new Date(year, month, 1).getDay();
      
      let emptyDays = Array(firstDayOfWeek).fill('');
      let days = [];

      for (let day = 1; day <= daysInMonth; day++) {
        let mStr = String(month + 1).padStart(2, '0');
        let dStr = String(day).padStart(2, '0');
        let dateStr = `${year}-${mStr}-${dStr}`; 
        
        days.push({
          day: day,
          dateStr: dateStr,
          isChecked: history.includes(dateStr), 
          isToday: dateStr === todayStr         
        });
      }
      calendarData.push({ month: month + 1, emptyDays: emptyDays, days: days });
    }

    this.setData({ currentYear: year, yearCalendarData: calendarData });
  },

  // 【修改点】点击右下角按钮：创建新笔记
  openEditor() { 
    this.setData({ 
      isInputing: true, 
      currentTitle: '', 
      currentInput: '',
      editingMemoId: null // 设为null代表是新建
    }); 
  },

  // 【新增功能】点击列表卡片：查看/编辑历史笔记
  viewMemo(e) {
    const id = e.currentTarget.dataset.id;
    const memo = this.data.memos.find(m => m.id === id);
    if (memo) {
      this.setData({
        isInputing: true,
        currentTitle: memo.title,
        // 去除占位符还原空白
        currentInput: memo.content === '（无正文）' ? '' : memo.content,
        editingMemoId: id // 记住正在编辑哪一条
      });
    }
  },

  closeEditor() {
    this.setData({ isInputing: false });
  },

  // 【修改点】保存逻辑：区分是“新建”还是“编辑更新”
  saveMemo() {
    let title = this.data.currentTitle.trim(); 
    let text = this.data.currentInput.trim();
    if (!title && !text) return; 

    if (!title) title = text.length > 10 ? text.substring(0, 10) + '...' : text;
    if (!text) text = "（无正文）";
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let updatedMemos = [...this.data.memos];
    const editingId = this.data.editingMemoId;

    if (editingId) {
      // 模式：编辑旧笔记（直接更新，不改原有的卡片颜色，仅更新时间、标题、正文）
      const index = updatedMemos.findIndex(m => m.id === editingId);
      if (index !== -1) {
        updatedMemos[index].title = title;
        updatedMemos[index].content = text;
        updatedMemos[index].date = dateStr;
      }
    } else {
      // 模式：新建笔记
      const newMemo = { 
        id: Date.now().toString(), 
        title, 
        content: text, 
        date: dateStr, 
        color: VINTAGE_COLORS[Math.floor(Math.random() * VINTAGE_COLORS.length)] 
      };
      updatedMemos = [newMemo, ...updatedMemos]; // 插入到最前面
    }
    
    try { 
      wx.setStorageSync('coconut_memos', updatedMemos); 
      this.setData({ 
        memos: updatedMemos, 
        isInputing: false,
        editingMemoId: null // 保存后清空状态
      }); 
      wx.showToast({ title: '已收录' }); 
      this.calculateStorage(); 
    } catch (e) { 
      wx.showToast({ title: '容量已满', icon: 'error' }); 
    }
  },

  deleteMemo(e) {
    wx.showModal({ 
      title: '确认撕毁', 
      content: '不可找回，确定吗？', 
      confirmColor: '#D35400', 
      success: (res) => { 
        if (res.confirm) { 
          const updated = this.data.memos.filter(item => item.id !== e.currentTarget.dataset.id); 
          wx.setStorageSync('coconut_memos', updated); 
          this.setData({ memos: updated }); 
          this.calculateStorage(); 
        } 
      } 
    });
  }
});