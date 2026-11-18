const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const wsClient = require('../../utils/couple-ws.js');
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
function fmtMD(dateStr) {
  const p = String(dateStr || '').split('-');
  return Number(p[1]) + '月' + Number(p[2]) + '日';
}
function countdownText(item) {
  if (item.is_today) return '就是今天';
  if (item.passed) return '已过去 ' + Math.abs(item.days_left) + ' 天';
  if (item.days_left === 1) return '就是明天';
  return '还有 ' + item.days_left + ' 天';
}

Page({
  data: {
    ready: false,
    errorText: '',
    days: 1,
    year: 0,
    month: 0,
    monthLabel: '',
    week: WEEK,
    cells: [],
    selectedDate: '',
    selectedLabel: '',
    selectedItems: [],
    selectedHoliday: '',
    motionClass: '',
    anniversaries: [],
    total: 0,
    nextItem: null,
    nextText: '',
    hasData: false
  },

  onLoad: function () {
    const t = new Date();
    this.firstShow = true;
    this.setData({ year: t.getFullYear(), month: t.getMonth() + 1 });
    this.load(true);
  },

  onShow: function () {
    if (this.firstShow) {
      this.firstShow = false;
      return;
    }
    this.load(false);
    this.connect();
  },

  onHide: function () {
    this.teardown();
  },

  onUnload: function () {
    this.teardown();
  },

  teardown: function () {
    if (this.motionTimer) {
      clearTimeout(this.motionTimer);
      this.motionTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },

  load: function (withMe) {
    const that = this;
    if (this.loading) return;
    this.loading = true;
    const needMe = withMe || !this.me;
    const mePromise = needMe ? api.me() : Promise.resolve(this.me);
    api.ensureLogin()
      .then(function () { return Promise.all([mePromise, api.listAnniversaries()]); })
      .then(function (arr) {
        const me = arr[0];
        const res = arr[1];
        if (needMe) {
          if (!me || !me.couple) {
            wx.redirectTo({ url: '/packageCouple/pages/bind/bind' });
            return;
          }
          if (!me.user || !me.user.nickname || !me.user.avatar) {
            wx.redirectTo({ url: '/packageCouple/pages/profile/profile?next=home' });
            return;
          }
          that.me = me;
        }
        that.applyList(res.anniversaries || [], res.total || 0, that.me ? that.me.couple.days_together || 1 : that.data.days);
        that.connect();
        wx.stopPullDownRefresh();
      })
      .catch(function (err) {
        that.setData({ ready: true, errorText: that.data.anniversaries.length ? '' : err.msg || '加载失败，下拉重试' });
        wx.stopPullDownRefresh();
        if (that.data.anniversaries.length) wx.showToast({ title: err.msg || '加载失败', icon: 'none' });
      })
      .then(function () {
        that.loading = false;
      });
  },

  applyList: function (list, total, days) {
    const rows = list.map(function (item) {
      const p = String(item.next_date || item.date).split('-');
      return {
        id: item.id,
        title: item.title,
        date: item.date,
        repeat: !!item.repeat_yearly,
        nextDate: item.next_date,
        daysLeft: item.days_left,
        passed: !!item.passed,
        isToday: !!item.is_today,
        countdown: countdownText(item),
        dateLabel: fmtMD(item.date),
        nextLabel: item.repeat_yearly ? '每年 ' + fmtMD(item.date) : fmtMD(item.date),
        weekday: '周' + WEEK[new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getDay()],
        dayNum: Number(p[2]),
        monthNum: Number(p[1])
      };
    });
    const upcoming = rows
      .filter(function (r) { return !r.passed; })
      .sort(function (a, b) { return a.daysLeft - b.daysLeft; });
    const nextItem = upcoming[0] || null;
    let nextText = '';
    if (nextItem) {
      nextText = nextItem.isToday
        ? '今天就是「' + nextItem.title + '」'
        : '距离「' + nextItem.title + '」还有 ' + nextItem.daysLeft + ' 天';
    } else if (rows.length) {
      nextText = '把接下来的日子也圈起来吧';
    } else {
      nextText = '把重要的日子圈起来吧';
    }
    const selectedDate = this.data.selectedDate || todayStr();
    this.setData({
      ready: true,
      errorText: '',
      anniversaries: rows,
      total: total,
      days: days || 1,
      nextItem: nextItem,
      nextText: nextText,
      hasData: rows.length > 0
    });
    this.rebuildCalendar(this.data.year, this.data.month, selectedDate);
  },

  rebuildCalendar: function (year, month, selectedDate, motion) {
    const list = this.data.anniversaries || [];
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
      let marks = 0;
      list.forEach(function (item) {
        const p = String(item.date || '').split('-');
        if (item.repeat) {
          if (Number(p[1]) === m && Number(p[2]) === d) marks++;
        } else if (Number(p[0]) === y && Number(p[1]) === m && Number(p[2]) === d) {
          marks++;
        }
      });
      cells.push({
        key: ds,
        day: d,
        dateStr: ds,
        inMonth: inMonth,
        holiday: inMonth ? chineseCalendar.getHolidayName(y, m, d) : '',
        isToday: ds === today,
        selected: ds === sel,
        marks: marks
      });
    }

    const selItems = this.itemsOnDate(sel)
      .map(function (item) { return { id: item.id, title: item.title, repeat: item.repeat }; });
    const sp = sel.split('-');
    const weekIdx = new Date(Number(sp[0]), Number(sp[1]) - 1, Number(sp[2])).getDay();
    const selectedHoliday = chineseCalendar.getHolidayName(Number(sp[0]), Number(sp[1]), Number(sp[2]));

    const patch = {
      year: year,
      month: month,
      monthLabel: year + '年' + month + '月',
      cells: cells,
      selectedDate: sel,
      selectedLabel: Number(sp[1]) + '月' + Number(sp[2]) + '日 · 周' + WEEK[weekIdx],
      selectedItems: selItems,
      selectedHoliday: selectedHoliday,
      motionClass: motion || ''
    };
    this.setData(patch);

    if (motion) {
      const that = this;
      if (this.motionTimer) clearTimeout(this.motionTimer);
      this.motionTimer = setTimeout(function () {
        that.setData({ motionClass: '' });
      }, 320);
    }
  },

  itemsOnDate: function (ds) {
    const p = String(ds || '').split('-');
    const y = Number(p[0]);
    const m = Number(p[1]);
    const d = Number(p[2]);
    return (this.data.anniversaries || []).filter(function (item) {
      const q = String(item.date || '').split('-');
      if (item.repeat) return Number(q[1]) === m && Number(q[2]) === d;
      return Number(q[0]) === y && Number(q[1]) === m && Number(q[2]) === d;
    });
  },

  tapDay: function (e) {
    const ds = e.currentTarget.dataset.date;
    if (!ds) return;
    const p = ds.split('-');
    const y = Number(p[0]);
    const m = Number(p[1]);
    const cur = this.data.year * 12 + this.data.month;
    const target = y * 12 + m;
    const motion = target === cur ? '' : target > cur ? 'from-right' : 'from-left';
    this.rebuildCalendar(y, m, ds, motion);
  },

  prevMonth: function () {
    let month = this.data.month - 1;
    let year = this.data.year;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    this.rebuildCalendar(year, month, this.data.selectedDate, 'from-left');
  },

  nextMonth: function () {
    let month = this.data.month + 1;
    let year = this.data.year;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    this.rebuildCalendar(year, month, this.data.selectedDate, 'from-right');
  },

  onCalTouchStart: function (e) {
    const t = e.touches && e.touches[0];
    if (t) this.swipeX = t.clientX;
  },

  onCalTouchEnd: function (e) {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t || this.swipeX === undefined) return;
    const dx = t.clientX - this.swipeX;
    this.swipeX = undefined;
    if (dx > 60) this.prevMonth();
    else if (dx < -60) this.nextMonth();
  },

  onItemTap: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const item = this.data.anniversaries.filter(function (r) { return r.id === id; })[0];
    if (!item) return;
    const p = String(item.nextDate || item.date).split('-');
    const y = Number(p[0]);
    const m = Number(p[1]);
    const cur = this.data.year * 12 + this.data.month;
    const target = y * 12 + m;
    const motion = target === cur ? '' : target > cur ? 'from-right' : 'from-left';
    this.rebuildCalendar(y, m, item.nextDate || item.date, motion);
  },

  onMore: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    this.showItemMenu(id);
  },

  onLongPress: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    this.showItemMenu(id);
  },

  showItemMenu: function (id) {
    const that = this;
    if (!id) return;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({ url: '/packageCouple/pages/anniversary-edit/anniversary-edit?id=' + id });
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '删除这个纪念日？',
            content: '删除后就找不回来了哦',
            confirmText: '删除',
            confirmColor: '#e05a4f',
            success: function (m) {
              if (!m.confirm) return;
              wx.showLoading({ title: '删除中…', mask: true });
              api.deleteAnniversary(id)
                .then(function () {
                  wx.hideLoading();
                  wx.showToast({ title: '已删除', icon: 'none' });
                  that.load(false);
                })
                .catch(function (err) {
                  wx.hideLoading();
                  wx.showToast({ title: err.msg || '删除失败', icon: 'none' });
                });
            }
          });
        }
      }
    });
  },

  goEdit: function () {
    wx.navigateTo({ url: '/packageCouple/pages/anniversary-edit/anniversary-edit' });
  },

  onPullDownRefresh: function () {
    if (this.loading) {
      wx.stopPullDownRefresh();
      return;
    }
    this.load(false);
  },

  connect: function () {
    if (this.socket) return;
    const that = this;
    this.socket = wsClient.createChatSocket({
      getToken: api.getToken,
      onStatus: function () {},
      onMessage: function (data) {
        if (!data) return;
        if (
          data.type === 'anniversary_new' ||
          data.type === 'anniversary_update' ||
          data.type === 'anniversary_delete'
        ) {
          that.load(false);
        }
      }
    });
  },

  onShareAppMessage: function () {
    const n = this.data.nextItem;
    const title = n && n.title
      ? '距离「' + n.title + '」还有 ' + n.days_left + ' 天'
      : '重要的日子，值得被记住';
    return { title: title, path: share.homePath(), imageUrl: share.cover('anniversary') };
  },

  onShareTimeline: function () {
    const n = this.data.nextItem;
    const title = n && n.title
      ? '距离「' + n.title + '」还有 ' + n.days_left + ' 天'
      : '重要的日子，值得被记住';
    return { title: title, query: share.timelineQuery(), imageUrl: share.cover('anniversary') };
  }

});