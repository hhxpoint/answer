// WebSocket 客户端封装（小程序端）：自动重连 + 心跳 + 断线降级回调
const WSS_URL = 'wss://hhxpoint.me/couple-ws';

function createChatSocket(options) {
  options = options || {};
  const getToken = options.getToken || function () { return ''; };
  const getSpaceId = options.getSpaceId || function () { return 0; };
  const onMessage = options.onMessage || function () {};
  const onStatus = options.onStatus || function () {};
  const onReady = options.onReady || function () {};

  let task = null;
  let closed = false;
  let retry = 0;
  let heartbeatTimer = null;
  let lastPongAt = 0;
  let retryTimer = null;

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function startHeartbeat() {
    stopHeartbeat();
    lastPongAt = Date.now();
    heartbeatTimer = setInterval(function () {
      if (!task) return;
      const silent = Date.now() - lastPongAt;
      if (silent > 70000) {
        // 心跳超时，主动断开重连
        try { task.close({ code: 1000 }); } catch (e) {}
        return;
      }
      try {
        task.send({ data: JSON.stringify({ type: 'ping' }), fail: function () {} });
      } catch (e) {}
    }, 25000);
  }

  function scheduleReconnect() {
    if (closed || retryTimer) return;
    const wait = Math.min(15000, 1000 * Math.pow(2, retry));
    retry += 1;
    retryTimer = setTimeout(function () {
      retryTimer = null;
      start();
    }, wait);
  }

  function start() {
    if (closed) return;
    const token = getToken();
    if (!token) {
      onStatus('offline');
      return;
    }
    try {
      const sid = parseInt(getSpaceId(), 10) || 0;
      const url = WSS_URL + '?token=' + encodeURIComponent(token) + (sid > 0 ? '&space_id=' + sid : '');
      task = wx.connectSocket({
        url: url,
        timeout: 15000
      });
    } catch (e) {
      onStatus('offline');
      scheduleReconnect();
      return;
    }

    task.onOpen(function () {
      retry = 0;
      lastPongAt = Date.now();
      onStatus('online');
      startHeartbeat();
    });

    task.onMessage(function (res) {
      let data = null;
      try {
        data = JSON.parse(res.data);
      } catch (e) {
        return;
      }
      if (!data) return;
      if (data.type === 'pong') {
        lastPongAt = Date.now();
        return;
      }
      if (data.type === 'ready') {
        lastPongAt = Date.now();
        try { onReady(data); } catch (e) {}
        return;
      }
      onMessage(data);
    });

    task.onClose(function () {
      stopHeartbeat();
      task = null;
      if (!closed) {
        onStatus('offline');
        scheduleReconnect();
      }
    });

    task.onError(function () {
      onStatus('offline');
      try { task && task.close({ code: 1000 }); } catch (e) {}
    });
  }

  function close() {
    closed = true;
    stopHeartbeat();
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    try {
      task && task.close({ code: 1000 });
    } catch (e) {}
    task = null;
  }

  start();

  function send(payload) {
    if (!task) return false;
    try {
      task.send({ data: JSON.stringify(payload) });
      return true;
    } catch (e) {
      return false;
    }
  }

  return { close: close, send: send };
}

module.exports = { createChatSocket: createChatSocket };
