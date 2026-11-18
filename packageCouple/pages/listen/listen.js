const api = require('../../utils/couple-api.js');
const share = require('../../utils/share.js');
const wsClient = require('../../utils/couple-ws.js');

const MAX_MS = 60 * 1000;
const RECALL_WINDOW = 2 * 60 * 1000;
const TIME_GAP = 5 * 60 * 1000;
const BAR_COUNT = 16;

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
function fmtDur(ms) {
  const s = Math.max(1, Math.round((ms || 0) / 1000));
  return Math.floor(s / 60) + ':' + pad(s % 60);
}
// 根据语音 id 生成稳定的"波形"装饰条（纯视觉，不代表真实波形）
function barsFor(id) {
  const bars = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const v = Math.abs(Math.sin((id || 1) * (i + 3) * 1.71)) * 24 + 12;
    bars.push(Math.round(v));
  }
  return bars;
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
    voices: [],
    total: 0,
    hasMore: false,
    connText: '连接中',
    connOk: false,
    recording: false,
    recordSec: 0,
    recordHint: '松开发送 · 上滑取消',
    cancelHint: false,
    playingId: 0,
    playingProgress: 0,
    scrollInto: '',
    atBottom: true,
    newCount: 0
  },

  onLoad: function () {
    this.msgMap = {};
    this.order = [];
    this.firstShow = true;
    this.lastId = 0;
    this.lastScrollTop = 0;
    this.fingerDown = false;
    this.recordStartAt = 0;
    this.discard = false;
    try {
      this.sys = wx.getSystemInfoSync();
    } catch (e) {
      this.sys = { windowHeight: 667 };
    }
    this.initRecorder();
    this.initAudio();
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
    if (this.audio) {
      try {
        this.audio.stop();
        this.audio.destroy();
      } catch (e) {}
      this.audio = null;
    }
  },

  teardown: function () {
    if (this.data.recording) {
      this.discard = true;
      try { this.recorder.stop(); } catch (e) {}
    }
    if (this.reconcileTimer) {
      clearInterval(this.reconcileTimer);
      this.reconcileTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.audio && this.data.playingId) {
      try { this.audio.stop(); } catch (e) {}
      this.setData({ playingId: 0, playingProgress: 0 });
    }
  },

  load: function (withMe) {
    const that = this;
    if (this.loading) return;
    this.loading = true;
    const needMe = withMe || !this.me;
    const mePromise = needMe ? api.me() : Promise.resolve(this.me);
    api.ensureLogin()
      .then(function () { return Promise.all([mePromise, api.listVoices(0, 20)]); })
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
        const user = me.user || {};
        const partner = me.couple.partner || {};
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
        that.mergeVoices(res.voices || [], true);
        that.connect();
        wx.stopPullDownRefresh();
      })
      .catch(function (err) {
        that.setData({ ready: true, errorText: that.data.voices.length ? '' : err.msg || '加载失败，下拉重试' });
        wx.stopPullDownRefresh();
        if (that.data.voices.length) wx.showToast({ title: err.msg || '加载失败', icon: 'none' });
      })
      .then(function () {
        that.loading = false;
      });
  },

  mergeVoices: function (list, reset) {
    const that = this;
    if (!list || !list.length) {
      if (reset) this.setData({ ready: true });
      return;
    }
    let changed = false;
    let hasNew = false;
    let maxId = this.lastId || 0;
    list.forEach(function (v) {
      if (!v || !v.id) return;
      const prev = that.msgMap[v.id];
      if (!prev) {
        that.order.push(v.id);
        hasNew = !reset;
        changed = true;
      }
      that.msgMap[v.id] = Object.assign({}, prev || {}, v);
      if (prev && (prev.recalled !== v.recalled || prev.url !== v.url || prev.hidden !== v.hidden)) changed = true;
      if (v.id > maxId) maxId = v.id;
    });
    if (!changed && !reset) return;
    this.order.sort(function (a, b) { return a - b; });
    this.lastId = maxId;
    const rows = this.buildRows();
    const activeTotal = this.order.filter(function (id) { return !that.msgMap[id].recalled; }).length;
    const patch = { voices: rows, total: activeTotal };
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
      const v = that.msgMap[id];
      if (!v || v.id === undefined) return;
      const showTime = !prevTime || (v.created_at - prevTime) > TIME_GAP;
      if (v.created_at) prevTime = v.created_at;
      const mine = v.user_id === myId;
      if (v.recalled) {
        rows.push({
          id: id,
          system: true,
          mine: mine,
          text: mine ? '你撤回了一条语音' : pname + '撤回了一条语音',
          showTime: showTime,
          timeText: fmtTime(v.created_at)
        });
        return;
      }
      if (v.hidden) {
        rows.push({
          id: id,
          system: true,
          mine: mine,
          text: mine ? '你发布的语音未通过内容审核，已隐藏' : '对方有一条语音未通过内容审核，已隐藏',
          showTime: showTime,
          timeText: fmtTime(v.created_at)
        });
        return;
      }
      rows.push({
        id: id,
        system: false,
        mine: mine,
        created_at: v.created_at,
        url: api.absUrl(v.url),
        durationText: fmtDur(v.duration_ms),
        bars: barsFor(id),
        avatar: mine ? that.data.myAvatar : that.data.partnerAvatar,
        avatarText: mine ? (that.data.myName || '我').slice(0, 1) : (that.data.partnerInitial || 'TA'),
        authorName: mine ? (that.data.myName || '我') : pname,
        showTime: showTime,
        timeText: fmtTime(v.created_at)
      });
    });
    return rows;
  },

  // ===== 播放 =====
  initAudio: function () {
    const that = this;
    this.audio = wx.createInnerAudioContext();
    this.audio.obeyMuteSwitch = false;
    this.audio.onTimeUpdate(function () {
      const dur = that.audio.duration || 0;
      const cur = that.audio.currentTime || 0;
      if (!that.data.playingId) return;
      that.setData({ playingProgress: dur ? Math.min(100, Math.round((cur / dur) * 100)) : 0 });
    });
    this.audio.onEnded(function () {
      that.setData({ playingId: 0, playingProgress: 0 });
    });
    this.audio.onError(function () {
      that.setData({ playingId: 0, playingProgress: 0 });
      wx.showToast({ title: '播放失败，稍后再试', icon: 'none' });
    });
  },

  togglePlay: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const row = this.data.voices.filter(function (r) { return r.id === id; })[0];
    if (!row || row.system || !row.url) return;
    if (this.data.playingId === id) {
      this.audio.pause();
      this.setData({ playingId: 0, playingProgress: 0 });
      return;
    }
    try { this.audio.stop(); } catch (e) {}
    this.audio.src = row.url;
    this.audio.play();
    this.setData({ playingId: id, playingProgress: 0 });
  },

  // ===== 录音 =====
  initRecorder: function () {
    const that = this;
    this.recorder = wx.getRecorderManager();
    this.recorder.onStop(function (res) { that.handleRecordStop(res); });
    this.recorder.onError(function () {
      that.clearRecordTimer();
      that.recorderBusy = false;
      that.setData({ recording: false, recordSec: 0, cancelHint: false });
      wx.showToast({ title: '录音失败，检查一下麦克风权限', icon: 'none' });
    });
  },

  ensureRecordPermission: function (cb) {
    const that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.record']) {
          cb();
          return;
        }
        wx.authorize({
          scope: 'scope.record',
          success: function () { cb(); },
          fail: function () {
            that.setData({ recording: false, recordSec: 0 });
            wx.showModal({
              title: '需要麦克风权限',
              content: '开启麦克风后才能录语音给 TA',
              confirmText: '去设置',
              success: function (m) {
                if (m.confirm) wx.openSetting({});
              }
            });
          }
        });
      },
      fail: function () { cb(); }
    });
  },

  onRecordStart: function (e) {
    if (this.data.recording || this.recorderBusy) return;
    const t = e.touches && e.touches[0];
    if (t) this.startY = t.clientY;
    this.fingerDown = true;
    this.cancelHint = false;
    const that = this;
    this.ensureRecordPermission(function () { that.beginRecord(); });
  },

  beginRecord: function () {
    if (!this.fingerDown) return;
    if (this.recorderBusy || this.data.recording) return;
    const that = this;
    this.recorderBusy = true;
    this.recordStartAt = Date.now();
    this.discard = false;
    this.cancelHint = false;
    this.setData({ recording: true, recordSec: 0, cancelHint: false, recordHint: '松开发送 · 上滑取消' });
    this.recorder.start({
      duration: MAX_MS,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 24000,
      format: 'mp3'
    });
    this.recordTimer = setInterval(function () {
      const sec = Math.min(60, Math.floor((Date.now() - that.recordStartAt) / 1000));
      that.setData({ recordSec: sec });
      if (sec >= 60) {
        that.autoStop = true;
        that.stopRecord();
      }
    }, 200);
  },

  onRecordMove: function (e) {
    if (!this.data.recording) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    const up = (this.startY || t.clientY) - t.clientY;
    const cancel = up > 60;
    if (cancel !== this.cancelHint) {
      this.cancelHint = cancel;
      this.setData({ cancelHint: cancel, recordHint: cancel ? '松开手指，取消发送' : '松开发送 · 上滑取消' });
    }
  },

  onRecordEnd: function () {
    this.fingerDown = false;
    if (!this.data.recording) return;
    this.discard = this.cancelHint;
    this.stopRecord();
  },

  onRecordCancel: function () {
    this.fingerDown = false;
    if (!this.data.recording) return;
    this.discard = true;
    this.stopRecord();
  },

  stopRecord: function () {
    this.clearRecordTimer();
    try { this.recorder.stop(); } catch (e) {}
  },

  clearRecordTimer: function () {
    if (this.recordTimer) {
      clearInterval(this.recordTimer);
      this.recordTimer = null;
    }
  },

  handleRecordStop: function (res) {
    const that = this;
    this.clearRecordTimer();
    this.recorderBusy = false;
    const discard = this.discard || false;
    this.discard = false;
    const duration = (res && res.duration) || Date.now() - (this.recordStartAt || Date.now());
    this.setData({ recording: false, recordSec: 0, cancelHint: false });
    if (discard) {
      wx.showToast({ title: '已取消', icon: 'none' });
      return;
    }
    if (duration < 500) {
      wx.showToast({ title: '说话时间太短', icon: 'none' });
      return;
    }
    const path = res && res.tempFilePath;
    if (!path) {
      wx.showToast({ title: '录音失败，再试一次', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发送中…', mask: true });
    this.readBase64(path)
      .then(function (dataUrl) { return api.sendVoice(dataUrl); })
      .then(function (r) {
        wx.hideLoading();
        that.mergeVoices([r.voice]);
        that.setData({ atBottom: true, newCount: 0 });
        setTimeout(function () { that.scrollBottom(); }, 80);
      })
      .catch(function (err) {
        wx.hideLoading();
        wx.showToast({ title: (err && err.msg) || '发送失败，再试一次', icon: 'none' });
      });
  },

  readBase64: function (filePath) {
    return new Promise(function (resolve, reject) {
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success: function (res) { resolve('data:audio/mpeg;base64,' + (res.data || '')); },
        fail: function () { reject({ msg: '语音读取失败' }); }
      });
    });
  },

  // ===== 撤回 =====
  onLongPress: function (e) {
    const id = Number(e.currentTarget.dataset.id);
    const v = this.msgMap[id];
    if (!v || v.recalled || v.user_id !== this.data.myId) return;
    if (Date.now() - (v.created_at || 0) > RECALL_WINDOW) {
      wx.showToast({ title: '超过 2 分钟的语音不能撤回', icon: 'none' });
      return;
    }
    const that = this;
    wx.showActionSheet({
      itemList: ['撤回这条语音'],
      success: function (res) {
        if (res.tapIndex !== 0) return;
        wx.showLoading({ title: '撤回中…', mask: true });
        api.recallVoice(id)
          .then(function (r) {
            wx.hideLoading();
            that.mergeVoices([r.voice]);
          })
          .catch(function (err) {
            wx.hideLoading();
            wx.showToast({ title: (err && err.msg) || '撤回失败', icon: 'none' });
          });
      }
    });
  },

  // ===== 实时与对账 =====
  connect: function () {
    if (this.socket) return;
    const that = this;
    this.socket = wsClient.createChatSocket({
      getToken: api.getToken,
      onStatus: function (status) {
        const online = status === 'online';
        that.setData({ connOk: online, connText: online ? '已连接' : '重连中…' });
        if (online) {
          api.listVoices(0, 20)
            .then(function (r) { that.mergeVoices(r.voices || []); })
            .catch(function () {});
        }
      },
      onMessage: function (data) {
        if (!data) return;
        if (data.type === 'voice_new' && data.voice) that.mergeVoices([data.voice]);
        else if (data.type === 'voice_recall' && data.voice) that.mergeVoices([data.voice]);
        else if (data.type === 'voice_update' && data.voice) that.mergeVoices([data.voice]);
      }
    });
    if (!this.reconcileTimer) {
      this.reconcileTimer = setInterval(function () {
        api.listVoices(0, 20)
          .then(function (r) { that.mergeVoices(r.voices || []); })
          .catch(function () {});
      }, 10000);
    }
  },

  onPullDownRefresh: function () {
    if (this.loading) {
      wx.stopPullDownRefresh();
      return;
    }
    this.load(false);
  },

  onScroll: function (e) {
    const top = e.detail.scrollTop;
    if (top < this.lastScrollTop - 24) this.setData({ atBottom: false });
    this.lastScrollTop = top;
  },

  onToLower: function () {
    this.setData({ atBottom: true, newCount: 0 });
  },

  scrollBottom: function () {
    const that = this;
    this.setData({ scrollInto: '', atBottom: true, newCount: 0 });
    setTimeout(function () {
      that.setData({ scrollInto: 'msg-' + that.lastId });
    }, 40);
  },

  onShareAppMessage: function () {
    return {
      title: '有些话，想慢慢说给你听',
      path: share.homePath(),
      imageUrl: share.cover('listen')
    };
  },

  onShareTimeline: function () {
    return {
      title: '有些话，想慢慢说给你听',
      query: share.timelineQuery(),
      imageUrl: share.cover('listen')
    };
  }

});