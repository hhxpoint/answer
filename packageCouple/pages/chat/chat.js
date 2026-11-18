const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const wsClient = require('../../utils/couple-ws.js');

const RECALL_WINDOW = 2 * 60 * 1000; // 与微信一致：2 分钟内可撤回
const TIME_GAP = 5 * 60 * 1000; // 超过 5 分钟显示时间分隔
const CACHE_PREFIX = 'couple_chat_cache_v1_';

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
    this.pending = {};
    this.lastScrollTop = 0;
    this.touchPos = { x: 0, y: 0 };
    this.cacheKey = CACHE_PREFIX + (api.getSpaceId() || 0);
    try {
      this.sys = wx.getSystemInfoSync();
    } catch (e) {
      this.sys = { windowWidth: 375, windowHeight: 667 };
    }
    if (wx.showShareMenu) {
      wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'], withShareTicket: false });
    }
    this.loadCache();
    this.load();
  },

  onShow: function () {
    if (this.data.ready) this.connectSocket();
  },

  onHide: function () {
    this.cacheMessages();
    this.teardown();
  },

  onUnload: function () {
    this.cacheMessages();
    this.teardown();
  },

  teardown: function () {
    this.stopReconcile();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },

  // 本地缓存最近消息：进入聊天先渲染，网络回来再刷新
  loadCache: function () {
    try {
      const cache = wx.getStorageSync(this.cacheKey);
      if (!cache || !Array.isArray(cache.messages) || !cache.messages.length) return;
      this.setData({
        ready: true,
        myId: cache.myId || 0,
        myName: cache.myName || '我',
        myAvatar: cache.myAvatar || '',
        partnerName: cache.partnerName || 'TA',
        partnerInitial: cache.partnerInitial || 'TA',
        partnerAvatar: cache.partnerAvatar || ''
      });
      this.mergeMessages(cache.messages, true);
    } catch (e) {}
  },

  cacheMessages: function () {
    try {
      const list = [];
      this.order.forEach(function (id) {
        if (id >= 1e12) return;
        const d = this.msgMap[id];
        if (!d || d.pending || d.failed) return;
        list.push(d);
      }, this);
      wx.setStorageSync(this.cacheKey, {
        myId: this.data.myId,
        myName: this.data.myName,
        myAvatar: this.data.myAvatar,
        partnerName: this.data.partnerName,
        partnerInitial: this.data.partnerInitial,
        partnerAvatar: this.data.partnerAvatar,
        messages: list.slice(-50)
      });
    } catch (e) {}
  },

  load: function () {
    const that = this;
    const hadCache = !!this.data.ready && this.data.messages.length > 0;
    return api.ensureLogin()
      .then(function () {
        that.connectSocket();
        return Promise.all([api.me(), api.recentMessages(50)]);
      })
      .then(function (arr) {
        const res = arr[0];
        const recent = arr[1];
        if (!res.couple) {
          wx.redirectTo({ url: '/packageCouple/pages/spaces/spaces' });
          return;
        }
        const user = res.user || {};
        const partner = res.couple.partner || {};
        const pname = partner.nickname || 'TA';
        that.setData({
          ready: true,
          errorText: '',
          myId: user.id || 0,
          myName: user.nickname || '我',
          myAvatar: api.absUrl(user.avatar),
          partnerName: pname,
          partnerInitial: pname.slice(0, 1) || 'TA',
          partnerAvatar: api.absUrl(partner.avatar)
        });
        that.mergeMessages(recent.messages || [], true);
        api.markRead().catch(function () {});
        that.cacheMessages();
      })
      .catch(function (err) {
        if (hadCache) {
          wx.showToast({ title: '网络不稳定，消息可能不是最新', icon: 'none' });
          return;
        }
        that.setData({ ready: true, errorText: err.msg || '加载失败，返回重试' });
      });
  },

  startReconcile: function () {
    const that = this;
    if (this.reconcileTimer || this.data.connOk) return;
    this.reconcileTimer = setInterval(function () {
      if (that.data.connOk) return;
      api.recentMessages(50)
        .then(function (r) { that.mergeMessages(r.messages || []); that.cacheMessages(); })
        .catch(function () {});
    }, 8000);
  },

  stopReconcile: function () {
    if (this.reconcileTimer) {
      clearInterval(this.reconcileTimer);
      this.reconcileTimer = null;
    }
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
          that.stopReconcile();
          if (that._connectedOnce) {
            api.recentMessages(50)
              .then(function (r) { that.mergeMessages(r.messages || []); })
              .catch(function () {});
          }
          that._connectedOnce = true;
        } else {
          that.startReconcile();
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
      // 服务端消息到达时，按 client_msg_id 移除本地“发送中”临时消息
      if (d.client_msg_id && !d.pending) {
        const tempId = that.pending[d.client_msg_id];
        if (tempId) {
          delete that.pending[d.client_msg_id];
          that.removeLocalMessage(tempId);
          changed = true;
        }
      }
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
      // 临时消息 id 很大，不参与 lastId；避免滚动锚点错乱
      if (d.id < 1e12 && d.id > maxId) maxId = d.id;
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
    this.cacheMessages();
  },

  removeLocalMessage: function (id) {
    if (!this.msgMap || !this.msgMap[id]) return;
    delete this.msgMap[id];
    this.order = this.order.filter(function (x) { return x !== id; });
    this.setData({ messages: this.buildRows() });
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
        pending: !!d.pending,
        failed: !!d.failed,
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
    if (!d || d.recalled || d.pending || d.failed) return;
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
        quote: { id: id, user_id: d.user_id, name: name, content: (d.content || '').slice(0, 80) },
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
    const content = (this.data.input || '').trim();
    if (!content) return;
    const quote = this.data.quote;
    const replyTo = quote ? quote.id : 0;
    const replyObj = quote ? {
      id: quote.id,
      user_id: quote.user_id || 0,
      content: quote.content || '',
      recalled: false
    } : null;
    const clientId = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    this.sendContent(content, replyTo, clientId, replyObj);
  },

  // 乐观发送：本地先出现“发送中”，网络返回后替换为服务端消息
  sendContent: function (content, replyTo, clientId, replyObj) {
    const that = this;
    const tempId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
    const pending = {
      id: tempId,
      user_id: this.data.myId,
      type: 'text',
      content: content,
      created_at: Date.now(),
      recalled: false,
      recalled_at: 0,
      recall_deadline: 0,
      client_msg_id: clientId,
      pending: true,
      failed: false,
      reply: replyObj || undefined
    };
    this.pending[clientId] = tempId;
    this.mergeMessages([pending]);
    this.setData({ input: '', quote: null, sending: false, atBottom: true, newCount: 0 });
    this.scrollToId(tempId);

    api.sendMessage(content, replyTo, clientId)
      .then(function (r) {
        delete that.pending[clientId];
        that.removeLocalMessage(tempId);
        if (r && r.message) that.mergeMessages([r.message]);
        that.cacheMessages();
        that.scrollToBottom();
      })
      .catch(function (err) {
        // 如果 WS 已经送达并移除了临时消息，视为成功，不报错
        delete that.pending[clientId];
        const row = that.msgMap[tempId];
        if (row) {
          row.failed = true;
          that.setData({ messages: that.buildRows() });
          wx.showToast({ title: (err && err.msg) || '发送失败', icon: 'none' });
        }
      });
  },

  retryMessage: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const d = (this.msgMap || {})[id];
    if (!d || !d.failed) return;
    const content = d.content || '';
    const replyTo = d.reply ? d.reply.id : 0;
    const replyObj = d.reply || null;
    const clientId = d.client_msg_id || ('c' + Date.now().toString(36));
    this.removeLocalMessage(id);
    this.sendContent(content, replyTo, clientId, replyObj);
  },

  scrollToId: function (id) {
    this.setData({ scrollInto: 'msg-' + id, atBottom: true, newCount: 0 });
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
      title: '有些话，只说给懂的人听',
      path: share.homePath(),
      imageUrl: share.cover('chat')
    };
  },

  onShareTimeline: function () {
    return {
      title: '有些话，只说给懂的人听',
      query: share.timelineQuery(),
      imageUrl: share.cover('chat')
    };
  }

});
