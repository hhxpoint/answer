const api = require('../../utils/couple-api.js');
const wsClient = require('../../utils/couple-ws.js');

const RECALL_WINDOW = 2 * 60 * 1000; // 与微信一致：2 分钟内可撤回
const TIME_GAP = 5 * 60 * 1000; // 超过 5 分钟显示时间分隔

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function fmtTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  return sameDay ? hm : d.getMonth() + 1 + '月' + d.getDate() + '日 ' + hm;
}

Page({
  data: {
    ready: false,
    errorText: '',
    myId: 0,
    myName: '我',
    myAvatar: '',
    partnerName: 'TA',
    partnerInitial: 'TA',
    partnerAvatar: '',
    messages: [],
    input: '',
    focus: false,
    sending: false,
    lastId: 0,
    scrollInto: '',
    connText: '连接中',
    connOk: false,
    quote: null,
    menuVisible: false,
    menuX: 0,
    menuY: 0,
    menuItems: [],
    atBottom: true,
    newCount: 0
  },

  onLoad: function () {
    this.msgMap = {};
    this.order = [];
    this.lastScrollTop = 0;
    this.touchPos = { x: 0, y: 0 };
    try {
      this.sys = wx.getSystemInfoSync();
    } catch (e) {
      this.sys = { windowWidth: 375, windowHeight: 667 };
    }
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    this.load();
  },

  onShow: function () {
    if (this.data.ready) this.connectSocket();
  },

  onHide: function () {
    this.teardown();
  },

  onUnload: function () {
    this.teardown();
  },

  teardown: function () {
    if (this.reconcileTimer) {
      clearInterval(this.reconcileTimer);
      this.reconcileTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },

  load: function () {
    const that = this;
    api.ensureLogin()
      .then(function () { return api.me(); })
      .then(function (res) {
        if (!res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/bind/bind' });
          return;
        }
        const user = res.user || {};
        const partner = res.couple.partner || {};
        const pname = partner.nickname || 'TA';
        that.setData({
          ready: true,
          myId: user.id || 0,
          myName: user.nickname || '我',
          myAvatar: api.absUrl(user.avatar),
          partnerName: pname,
          partnerInitial: pname.slice(0, 1) || 'TA',
          partnerAvatar: api.absUrl(partner.avatar)
        });
        return api.recentMessages(50).then(function (r) {
          that.mergeMessages(r.messages || [], true);
          api.markRead().catch(function () {});
          that.connectSocket();
          that.startReconcile();
        });
      })
      .catch(function (err) {
        that.setData({ ready: true, errorText: err.msg || '加载失败，返回重试' });
      });
  },

  startReconcile: function () {
    const that = this;
    if (this.reconcileTimer) return;
    this.reconcileTimer = setInterval(function () {
      api.recentMessages(50)
        .then(function (r) { that.mergeMessages(r.messages || []); })
        .catch(function () {});
    }, 8000);
  },

  connectSocket: function () {
    if (this.socket) return;
    const that = this;
    this.socket = wsClient.createChatSocket({
      getToken: api.getToken,
      getSpaceId: api.getSpaceId,
      onStatus: function (status) {
        const online = status === 'online';
        that.setData({ connOk: online, connText: online ? '已连接' : '重连中…' });
        if (online) {
          api.recentMessages(50)
            .then(function (r) { that.mergeMessages(r.messages || []); })
            .catch(function () {});
        }
      },
      onMessage: function (data) {
        if (!data) return;
        if (data.type === 'message' && data.message) {
          that.mergeMessages([data.message]);
        } else if (data.type === 'message_recall' && data.message) {
          that.mergeMessages([data.message]);
        }
      }
    });
  },

  mergeMessages: function (dtos, reset) {
    const that = this;
    if (!dtos || !dtos.length) return;
    if (!this.msgMap) this.msgMap = {};
    if (!this.order) this.order = [];
    let changed = false;
    let hasNew = false;
    let maxId = this.data.lastId || 0;
    dtos.forEach(function (d) {
      if (!d || !d.id) return;
      const prev = that.msgMap[d.id];
      if (!prev) {
        that.order.push(d.id);
        hasNew = !reset;
        changed = true;
      }
      that.msgMap[d.id] = Object.assign({}, prev || {}, d);
      if (prev) {
        const replyChanged = JSON.stringify(prev.reply || null) !== JSON.stringify(d.reply || null);
        if (prev.recalled !== d.recalled || prev.content !== d.content || replyChanged) changed = true;
      }
      if (d.id > maxId) maxId = d.id;
    });
    if (!changed && !reset) return;
    this.order.sort(function (a, b) { return a - b; });
    const rows = this.buildRows();
    const patch = { messages: rows, lastId: maxId };
    if (reset) {
      patch.atBottom = true;
      patch.newCount = 0;
      patch.scrollInto = '';
      this.setData(patch);
      setTimeout(function () { that.setData({ scrollInto: 'msg-' + maxId }); }, 80);
      return;
    }
    if (hasNew) {
      if (this.data.atBottom) {
        patch.scrollInto = 'msg-' + maxId;
      } else {
        patch.newCount = (this.data.newCount || 0) + 1;
      }
    }
    this.setData(patch);
  },

  buildRows: function () {
    const that = this;
    const myId = this.data.myId;
    const pname = this.data.partnerName;
    const rows = [];
    let prevTime = 0;
    this.order.forEach(function (id) {
      const d = that.msgMap[id];
      if (!d || d.id === undefined) return;
      const showTime = !prevTime || (d.created_at - prevTime) > TIME_GAP;
      if (d.created_at) prevTime = d.created_at;
      if (d.recalled) {
        rows.push({
          id: id,
          system: true,
          text: d.user_id === myId ? '你撤回了一条消息' : pname + '撤回了一条消息',
          showTime: showTime,
          timeText: fmtTime(d.created_at)
        });
        return;
      }
      let replyName = '';
      let replyContent = '';
      if (d.reply) {
        const mineReply = d.reply.user_id === myId;
        replyName = mineReply ? (that.data.myName || '我') : pname;
        replyContent = d.reply.recalled ? '消息已撤回' : (d.reply.content || '');
      }
      const mine = d.user_id === myId;
      rows.push({
        id: id,
        system: false,
        mine: mine,
        content: d.content || '',
        created_at: d.created_at,
        showTime: showTime,
        timeText: fmtTime(d.created_at),
        replyName: replyName,
        replyContent: replyContent,
        avatar: mine ? that.data.myAvatar : that.data.partnerAvatar,
        avatarText: mine ? (that.data.myName || '我').slice(0, 1) : (that.data.partnerInitial || 'TA')
      });
    });
    return rows;
  },

  onTouchStart: function (e) {
    const t = e.touches && e.touches[0];
    if (t) this.touchPos = { x: t.clientX, y: t.clientY };
  },

  onLongPress: function (e) {
    const ds = e.currentTarget.dataset || {};
    const id = Number(ds.id);
    if (!id) return;
    const d = (this.msgMap || {})[id];
    if (!d || d.recalled) return;
    const mine = d.user_id === this.data.myId;
    const within = Date.now() - (d.created_at || 0) <= RECALL_WINDOW;
    const items = [];
    if (d.content) items.push({ key: 'copy', label: '复制' });
    items.push({ key: 'quote', label: '引用' });
    if (mine && within) items.push({ key: 'recall', label: '撤回' });
    if (!items.length) return;

    const sys = this.sys || { windowWidth: 375, windowHeight: 667 };
    const rpx = sys.windowWidth / 750;
    const menuW = 236 * rpx;
    const itemH = 88 * rpx;
    const menuH = items.length * itemH + 16 * rpx;
    let x = this.touchPos.x - menuW / 2;
    let y = this.touchPos.y - menuH - 14 * rpx;
    if (y < 70) y = this.touchPos.y + 24 * rpx;
    x = Math.max(12, Math.min(x, sys.windowWidth - menuW - 12));
    y = Math.max(64, Math.min(y, sys.windowHeight - menuH - 40));

    this.menuTarget = id;
    this.setData({ menuVisible: true, menuX: x, menuY: y, menuItems: items });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  closeMenu: function () {
    this.setData({ menuVisible: false, menuItems: [] });
  },

  noop: function () {},

  onMenuAction: function (e) {
    const key = e.currentTarget.dataset.key;
    const id = this.menuTarget;
    const d = (this.msgMap || {})[id];
    this.closeMenu();
    if (!d) return;
    if (key === 'copy') {
      wx.setClipboardData({ data: d.content || '' });
      return;
    }
    if (key === 'quote') {
      const mine = d.user_id === this.data.myId;
      const name = mine ? (this.data.myName || '我') : this.data.partnerName;
      const that = this;
      this.setData({
        quote: { id: id, name: name, content: (d.content || '').slice(0, 80) },
        focus: true
      });
      setTimeout(function () { that.setData({ focus: false }); }, 400);
      return;
    }
    if (key === 'recall') {
      const that = this;
      api.recallMessage(id)
        .then(function (r) {
          that.mergeMessages([r.message]);
        })
        .catch(function (err) {
          wx.showToast({ title: err.msg || '撤回失败', icon: 'none' });
        });
    }
  },

  cancelQuote: function () {
    this.setData({ quote: null });
  },

  onInput: function (e) {
    this.setData({ input: e.detail.value });
  },

  onConfirm: function () {
    this.send();
  },

  send: function () {
    const that = this;
    const content = (this.data.input || '').trim();
    if (!content || this.data.sending) return;
    const replyTo = this.data.quote ? this.data.quote.id : 0;
    this.setData({ sending: true });
    api.sendMessage(content, replyTo)
      .then(function (r) {
        that.setData({ sending: false, input: '', quote: null, atBottom: true, newCount: 0 });
        that.mergeMessages([r.message]);
        that.scrollToBottom();
      })
      .catch(function (err) {
        that.setData({ sending: false });
        wx.showToast({ title: err.msg || '发送失败', icon: 'none' });
      });
  },

  scrollToBottom: function () {
    const that = this;
    const last = this.data.lastId;
    this.setData({ scrollInto: '', atBottom: true, newCount: 0 });
    setTimeout(function () {
      that.setData({ scrollInto: 'msg-' + last });
    }, 40);
  },

  onScroll: function (e) {
    const top = e.detail.scrollTop;
    if (top < this.lastScrollTop - 24) {
      this.setData({ atBottom: false });
    }
    this.lastScrollTop = top;
  },

  onToLower: function () {
    this.setData({ atBottom: true, newCount: 0 });
  },

  onShareAppMessage: function () {
    return {
      title: '🔥 来和我一起养一只小火苗吧，只属于两个人的小空间',
      path: '/packageCouple/pages/home/home',
      imageUrl: '/assets/couple-share.png'
    };
  },

  onShareTimeline: function () {
    return {
      title: '🔥 我们的小火苗 · 只属于两个人的小空间',
      imageUrl: '/assets/couple-share.png'
    };
  }
});
