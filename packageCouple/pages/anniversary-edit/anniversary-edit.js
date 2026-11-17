const api = require('../../utils/couple-api.js');
const chineseCalendar = require('../../utils/chinese-calendar.js');

const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function fmtDate(y, m, d) {
  return y + '-' + pad(m) + '-' + pad(d);
}
function todayStr() {
  const d = new Date();
  return fmtDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}
function fmtLabel(dateStr) {
  const p = String(dateStr || '').split('-');
  const y = Number(p[0]);
  const m = Number(p[1]);
  const d = Number(p[2]);
  const w = new Date(y, m - 1, d).getDay();
  return y + '年' + m + '月' + d + '日 · 周' + WEEK[w];
}

Page({
  data: {
    id: 0,
    title: '',
    date: '',
    dateLabel: '',
    repeatYearly: true,
    year: 0,
    month: 0,
    monthLabel: '',
    week: WEEK,
    cells: [],
    loading: true,
    errorText: '',
    holidayText: '',
    saving: false
  },

  onLoad: function (options) {
    const id = Number(options && options.id) || 0;
    const t = new Date();
    this.setData({
      id: id,
      year: t.getFullYear(),
      month: t.getMonth() + 1,
      date: todayStr(),
      dateLabel: fmtLabel(todayStr())
    });
    this.buildCalendar(t.getFullYear(), t.getMonth() + 1, todayStr());
    this.init(id);
  },

  init: function (id) {
    const that = this;
    api.ensureLogin()
      .then(function () {
        return Promise.all([id ? api.listAnniversaries() : Promise.resolve(null), api.me()]);
      })
      .then(function (arr) {
        const res = arr[0];
        const me = arr[1];
        if (!me.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/bind/bind' });
          return;
        }
        if (!me.user || !me.user.nickname || !me.user.avatar) {
          wx.redirectTo({ url: '/packageCouple/pages/profile/profile?next=home' });
          return;
        }
        if (id && res) {
          const item = (res.anniversaries || []).filter(function (x) { return x.id === id; })[0];
          if (!item) {
            wx.showToast({ title: '这个纪念日不存在了', icon: 'none' });
            setTimeout(function () { wx.navigateBack(); }, 500);
            return;
          }
          const p = String(item.date).split('-');
          that.setData({
            loading: false,
            title: item.title,
            date: item.date,
            dateLabel: fmtLabel(item.date),
            repeatYearly: !!item.repeat_yearly
          });
          that.buildCalendar(Number(p[0]), Number(p[1]), item.date);
        } else {
          that.setData({ loading: false });
        }
      })
      .catch(function (err) {
        that.setData({ loading: false, errorText: err.msg || '加载失败，返回重试' });
      });
  },

  buildCalendar: function (year, month, selectedDate) {
    const cells = [];
    const first = new Date(year, month - 1, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevDays = new Date(prevYear, prevMonth, 0).getDate();
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const today = todayStr();
    const sel = selectedDate || today;

    for (let i = 0; i < 42; i++) {
      let y = year;
      let m = month;
      let d = 0;
      let inMonth = true;
      if (i < startWeekday) {
        y = prevYear;
        m = prevMonth;
        d = prevDays - startWeekday + 1 + i;
        inMonth = false;
      } else if (i >= startWeekday + daysInMonth) {
        y = nextYear;
        m = nextMonth;
        d = i - startWeekday - daysInMonth + 1;
        inMonth = false;
      } else {
        d = i - startWeekday + 1;
      }
      const ds = fmtDate(y, m, d);
      cells.push({
        key: ds,
        day: d,
        dateStr: ds,
        inMonth: inMonth,
        holiday: inMonth ? chineseCalendar.getHolidayName(y, m, d) : '',
        isToday: ds === today,
        selected: ds === sel
      });
    }
    const sp = String(sel).split('-');
    this.setData({
      year: year,
      month: month,
      monthLabel: year + '年' + month + '月',
      cells: cells,
      date: sel,
      dateLabel: fmtLabel(sel),
      holidayText: chineseCalendar.getHolidayName(Number(sp[0]), Number(sp[1]), Number(sp[2]))
    });
  },

  prevMonth: function () {
    let month = this.data.month - 1;
    let year = this.data.year;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    this.buildCalendar(year, month, this.data.date);
  },

  nextMonth: function () {
    let month = this.data.month + 1;
    let year = this.data.year;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    this.buildCalendar(year, month, this.data.date);
  },

  tapDay: function (e) {
    const ds = e.currentTarget.dataset.date;
    if (!ds) return;
    const p = ds.split('-');
    this.buildCalendar(Number(p[0]), Number(p[1]), ds);
  },

  todayTap: function () {
    const t = new Date();
    this.buildCalendar(t.getFullYear(), t.getMonth() + 1, todayStr());
  },

  onTitleInput: function (e) {
    this.setData({ title: e.detail.value });
  },

  pickTitle: function (e) {
    this.setData({ title: e.currentTarget.dataset.title || '' });
  },

  toggleRepeat: function (e) {
    this.setData({ repeatYearly: !!e.detail.value });
  },

  save: function () {
    const that = this;
    if (this.data.saving) return;
    const title = (this.data.title || '').trim();
    if (!title) {
      wx.showToast({ title: '先给这个日子起个名字吧', icon: 'none' });
      return;
    }
    if (!this.data.date) {
      wx.showToast({ title: '选一个日期', icon: 'none' });
      return;
    }
    this.setData({ saving: true });
    const id = this.data.id;
    const task = id
      ? api.updateAnniversary(id, title, this.data.date, this.data.repeatYearly)
      : api.createAnniversary(title, this.data.date, this.data.repeatYearly);
    task
      .then(function () {
        wx.showToast({ title: '记住啦', icon: 'none' });
        setTimeout(function () { wx.navigateBack(); }, 450);
      })
      .catch(function (err) {
        that.setData({ saving: false });
        wx.showToast({ title: err.msg || '保存失败，再试一次', icon: 'none' });
      });
  },

  doDelete: function () {
    const that = this;
    if (!this.data.id) return;
    wx.showModal({
      title: '删除这个纪念日？',
      content: '删除后就找不回来了哦',
      confirmText: '删除',
      confirmColor: '#e05a4f',
      success: function (res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '删除中…', mask: true });
        api.deleteAnniversary(that.data.id)
          .then(function () {
            wx.hideLoading();
            wx.showToast({ title: '已删除', icon: 'none' });
            setTimeout(function () { wx.navigateBack(); }, 450);
          })
          .catch(function (err) {
            wx.hideLoading();
            wx.showToast({ title: err.msg || '删除失败', icon: 'none' });
          });
      }
    });
  }
});
