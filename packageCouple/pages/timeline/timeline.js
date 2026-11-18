const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const wsClient = require('../../utils/couple-ws.js');

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function fmtTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  const sameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  if (sameDay) return '今天 ' + hm;
  const y = new Date(now.getTime() - 86400000);
  if (d.getFullYear() === y.getFullYear() && d.getMonth() === y.getMonth() && d.getDate() === y.getDate()) {
    return '昨天 ' + hm;
  }
  if (d.getFullYear() === now.getFullYear()) {
    return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + hm;
  }
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
}

Page({
  data: {
    ready: false,
    errorText: '',
    days: 1,
    total: 0,
    diaries: [],
    hasMore: false,
    loading: false,
    loadingMore: false,
    myId: 0,
    myAvatar: '',
    myInitial: '我',
    partnerAvatar: '',
    partnerInitial: 'TA'
  },

  onLoad: function () {
    this.rowsMap = {};
    this.firstShow = true;
    this.load(true);
  },

  onShow: function () {
    if (this.firstShow) {
      this.firstShow = false;
      return;
    }
    this.load(true);
    this.connect();
  },

  onHide: function () {
    this.teardown();
  },

  onUnload: function () {
    this.teardown();
  },

  teardown: function () {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },

  toRow: function (d, myId) {
    const author = d.author || {};
    const images = (d.images || []).map(function (u) { return api.absUrl(u); }).filter(Boolean);
    return {
      id: d.id,
      content: d.content || '',
      images: images,
      imageClass: images.length === 1 ? 'one' : images.length === 2 ? 'two' : 'many',
      mine: d.user_id === myId,
      authorName: author.nickname || 'TA',
      authorAvatar: api.absUrl(author.avatar),
      authorInitial: (author.nickname || 'TA').slice(0, 1),
      timeText: fmtTime(d.created_at),
      dayNo: d.day_no || 1
    };
  },

  load: function (reset) {
    const that = this;
    if (this.loading && !reset) return;
    if (reset && this.data.loading) return;
    this.loading = true;
    if (reset) {
      this.setData({ loading: true, errorText: '' });
    } else {
      this.setData({ loadingMore: true });
    }
    const before = reset ? 0 : this.data.diaries.length ? this.data.diaries[this.data.diaries.length - 1].id : 0;

    api.ensureLogin()
      .then(function () {
        return Promise.all([api.me(), api.listDiaries(before)]);
      })
      .then(function (arr) {
        const me = arr[0];
        const res = arr[1];
        if (!me.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/bind/bind' });
          return;
        }
        if (!me.user || !me.user.nickname || !me.user.avatar) {
          wx.redirectTo({ url: '/packageCouple/pages/profile/profile?next=home' });
          return;
        }
        const myId = me.user.id;
        const partner = me.couple.partner || {};
        const rows = (res.diaries || []).map(function (d) { return that.toRow(d, myId); });
        const patch = {
          ready: true,
          loading: false,
          loadingMore: false,
          errorText: '',
          days: me.couple.days_together || 1,
          total: res.total || 0,
          hasMore: !!res.has_more,
          myId: myId,
          myAvatar: api.absUrl(me.user.avatar),
          myInitial: (me.user.nickname || '我').slice(0, 1),
          partnerAvatar: api.absUrl(partner.avatar),
          partnerInitial: (partner.nickname || 'TA').slice(0, 1)
        };
        if (reset) {
          that.rowsMap = {};
          rows.forEach(function (r) { that.rowsMap[r.id] = true; });
          patch.diaries = rows;
        } else {
          const fresh = rows.filter(function (r) { return !that.rowsMap[r.id]; });
          fresh.forEach(function (r) { that.rowsMap[r.id] = true; });
          patch.diaries = that.data.diaries.concat(fresh);
        }
        that.setData(patch);
        that.connect();
        wx.stopPullDownRefresh();
      })
      .catch(function (err) {
        that.setData({
          ready: true,
          loading: false,
          loadingMore: false,
          errorText: that.data.diaries.length ? '' : err.msg || '加载失败，下拉重试'
        });
        wx.stopPullDownRefresh();
        if (that.data.diaries.length) wx.showToast({ title: err.msg || '加载失败', icon: 'none' });
      })
      .then(function () {
        that.loading = false;
      });
  },

  onPullDownRefresh: function () {
    if (this.loading) {
      wx.stopPullDownRefresh();
      return;
    }
    this.load(true);
  },

  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loadingMore) this.load(false);
  },

  loadMore: function () {
    if (this.data.hasMore && !this.data.loadingMore) this.load(false);
  },

  connect: function () {
    if (this.socket) return;
    const that = this;
    this.socket = wsClient.createChatSocket({
      getToken: api.getToken,
      onStatus: function () {},
      onMessage: function (data) {
        if (!data) return;
        if (data.type === 'diary_new' && data.diary) {
          const d = data.diary;
          if (that.rowsMap && that.rowsMap[d.id]) return;
          const row = that.toRow(d, that.data.myId);
          that.rowsMap[d.id] = true;
          that.setData({
            diaries: [row].concat(that.data.diaries),
            total: (that.data.total || 0) + 1
          });
        } else if (data.type === 'diary_delete' && data.id) {
          const list = that.data.diaries.filter(function (r) { return r.id !== data.id; });
          if (list.length !== that.data.diaries.length) {
            if (that.rowsMap) delete that.rowsMap[data.id];
            that.setData({ diaries: list, total: Math.max(0, (that.data.total || 0) - 1) });
          }
        }
      }
    });
  },

  goEdit: function () {
    wx.navigateTo({ url: '/packageCouple/pages/timeline-edit/timeline-edit' });
  },

  previewImage: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const src = e.currentTarget.dataset.src;
    const row = this.data.diaries.filter(function (r) { return r.id === id; })[0];
    const urls = row ? row.images : [src];
    wx.previewImage({ current: src, urls: urls });
  },

  onMore: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    this.askDelete(id);
  },

  onLongPress: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const row = this.data.diaries.filter(function (r) { return r.id === id; })[0];
    if (!row || !row.mine) return;
    this.askDelete(id);
  },

  askDelete: function (id) {
    const that = this;
    if (!id) return;
    wx.showActionSheet({
      itemList: ['删除这条记录'],
      success: function (res) {
        if (res.tapIndex !== 0) return;
        wx.showModal({
          title: '删除这条记录？',
          content: '删除后就找不回来了哦',
          confirmText: '删除',
          confirmColor: '#e05a4f',
          success: function (m) {
            if (!m.confirm) return;
            that.doDelete(id);
          }
        });
      }
    });
  },

  doDelete: function (id) {
    const that = this;
    wx.showLoading({ title: '删除中…', mask: true });
    api.deleteDiary(id)
      .then(function () {
        wx.hideLoading();
        const list = that.data.diaries.filter(function (r) { return r.id !== id; });
        if (that.rowsMap) delete that.rowsMap[id];
        that.setData({ diaries: list, total: Math.max(0, (that.data.total || 0) - 1) });
        wx.showToast({ title: '已删除', icon: 'none' });
      })
      .catch(function (err) {
        wx.hideLoading();
        wx.showToast({ title: err.msg || '删除失败', icon: 'none' });
      });
  },

  onShareAppMessage: function () {
    return {
      title: '把今天，收进我们的时光',
      path: share.homePath(),
      imageUrl: share.cover('timeline')
    };
  },

  onShareTimeline: function () {
    return {
      title: '把今天，收进我们的时光',
      query: share.timelineQuery(),
      imageUrl: share.cover('timeline')
    };
  }

});