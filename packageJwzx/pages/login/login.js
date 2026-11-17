const jwzxApi = require('../../../utils/jwzx-api');

Page({
  data: {
    username: '',
    password: '',
    captchaImage: '',
    captchaInput: '',
    token: '',
    loading: false,
    captchaLoading: false,
    showPassword: false,
    hasCachedCreds: false,
    autoLoginLoading: false,
    // 来源页面，登录成功后跳回
    fromPage: ''
  },

  onLoad(options) {
    if (options.from) {
      this.setData({ fromPage: decodeURIComponent(options.from) });
    }
    // 检查是否有缓存的凭据
    if (jwzxApi.hasCredentials()) {
      const creds = jwzxApi.getCredentials();
      this.setData({
        username: creds.username,
        password: creds.password,
        hasCachedCreds: true
      });
      // 尝试自动登录
      this.tryAutoLogin();
    }
  },

  /** 尝试自动登录 (免验证码) */
  tryAutoLogin() {
    const { username, password } = this.data;
    if (!username || !password) return;

    this.setData({ autoLoginLoading: true });
    jwzxApi.autoLogin(username, password).then(res => {
      if (res.success) {
        // 自动登录成功
        jwzxApi.saveToken(res.token);
        jwzxApi.saveCredentials(username, password);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => this.navigateBack(), 800);
      } else if (res.need_captcha) {
        // 需要验证码
        this.setData({
          token: res.token || '',
          captchaImage: res.captcha_image || '',
          autoLoginLoading: false
        });
      } else {
        // 密码可能已变更，清除缓存
        jwzxApi.clearAll();
        this.setData({
          hasCachedCreds: false,
          autoLoginLoading: false,
          password: ''
        });
        wx.showToast({ title: res.message || '密码已变更，请重新登录', icon: 'none' });
        // 获取新验证码
        this.getCaptchaFresh();
      }
    }).catch(() => {
      this.setData({ autoLoginLoading: false });
      // 网络错误，获取验证码让用户手动登录
      this.getCaptchaFresh();
    });
  },

  /** 使用用户名密码获取验证码 (首次) */
  getCaptchaFresh() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({ title: '请先输入用户名和密码', icon: 'none' });
      return;
    }
    this.setData({ captchaLoading: true });
    jwzxApi.getCaptchaWithCredentials(username, password).then(res => {
      if (res.success) {
        this.setData({
          captchaImage: res.image,
          token: res.token,
          captchaLoading: false
        });
      } else {
        this.setData({ captchaLoading: false });
        wx.showToast({ title: res.message || '获取验证码失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ captchaLoading: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  /** 刷新验证码 (使用已有 token) */
  refreshCaptcha() {
    const { username, password, token } = this.data;
    if (!username || !password) {
      wx.showToast({ title: '请先输入用户名和密码', icon: 'none' });
      return;
    }
    this.setData({ captchaLoading: true });
    // 如果有token用token刷新，否则用凭据
    const req = token
      ? jwzxApi.getCaptcha(token)
      : jwzxApi.getCaptchaWithCredentials(username, password);

    req.then(res => {
      if (res.success) {
        this.setData({
          captchaImage: res.image,
          token: res.token || token,
          captchaLoading: false,
          captchaInput: ''
        });
      } else {
        this.setData({ captchaLoading: false });
        wx.showToast({ title: res.message || '刷新失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ captchaLoading: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  /** 提交登录 */
  doLogin() {
    const { username, password, captchaInput, token } = this.data;
    if (!username.trim()) {
      wx.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (!captchaInput.trim()) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    jwzxApi.login(username.trim(), password, captchaInput.trim(), token).then(res => {
      this.setData({ loading: false });
      if (res.success) {
        // 登录成功
        jwzxApi.saveToken(res.token);
        jwzxApi.saveCredentials(username.trim(), password);
        if (res.student_name) {
          jwzxApi.saveStudentInfo({
            name: res.student_name,
            id: res.student_id || username.trim()
          });
        }
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => this.navigateBack(), 800);
      } else {
        // 登录失败，刷新验证码
        wx.showToast({ title: res.message || '登录失败', icon: 'none' });
        this.refreshCaptcha();
        this.setData({ captchaInput: '' });
      }
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    });
  },

  /** 跳转回来源页面 */
  navigateBack() {
    const from = this.data.fromPage;
    if (from) {
      wx.redirectTo({ url: from });
    } else {
      wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
    }
  },

  /** 输入事件 */
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
    // 用户名变化时清除验证码状态
    if (this.data.captchaImage) {
      this.setData({ captchaImage: '', captchaInput: '', token: '' });
    }
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
    if (this.data.captchaImage) {
      this.setData({ captchaImage: '', captchaInput: '', token: '' });
    }
  },
  onCaptchaInput(e) {
    this.setData({ captchaInput: e.detail.value });
  },

  /** 切换密码可见性 */
  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  /** 预热连接 */
  onReady() {
    const { username, password } = this.data;
    if (username && password && !this.data.hasCachedCreds) {
      jwzxApi.warmup(username, password).catch(() => {});
    }
  }
});
