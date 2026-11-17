const defaultAvatar = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

// ===================== 【纯新增：双后端接口配置】 =====================
// 原有Go后端 + 新增Python后端，同时支持，自动匹配
const API_CONFIG = {
  hhxgo: "https://hhxgo.tech/api/wechat/miniapp-login",
  hhxpoint: "https://hhxpoint.me/auth/api/wechat/miniapp-login" // ✅ 加上 /auth
};
// ====================================================================

Page({
  data: {
    sceneStr: "",
    avatarUrl: defaultAvatar,
    nickname: "",
    // 【纯新增】标记当前登录的网站来源
    source: "hhxgo"
  },

  onLoad(options) {
    // 1. 获取原始的 scene 字符串 (例如 "7110dfd...:hhxpoint")
    let rawScene = decodeURIComponent(options.scene || "");
    
    let sceneStr = "";
    let source = "hhxgo"; // 默认值

    if (rawScene) {
        // 【关键修改】：尝试用冒号拆分
        if (rawScene.includes(':')) {
            const parts = rawScene.split(':');
            sceneStr = parts[0]; // 第一部分是 scan_id
            source = parts[1];   // 第二部分是 source (hhxpoint)
        } else {
            sceneStr = rawScene; // 如果没有冒号，就当做纯 scan_id
        }
    }

    console.log("DEBUG: 解析出的 sceneStr:", sceneStr);
    console.log("DEBUG: 解析出的 source:", source);

    this.setData({ sceneStr, source });

    if (!sceneStr) {
        wx.showToast({ title: "登录参数异常", icon: "none" });
    }
},



  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl });
  },

  onInputChange(e) {
    this.setData({ nickname: e.detail.value });
  },

  doLogin() {
    if (!this.data.sceneStr) return wx.showToast({ title: "参数异常", icon: "none" });
    if (this.data.avatarUrl === defaultAvatar) return wx.showToast({ title: "请选择头像", icon: "none" });
    if (!this.data.nickname) return wx.showToast({ title: "请输入昵称", icon: "none" });

    wx.showLoading({ title: '登录中...' });

    // 核心步骤：头像转Base64（原代码完全不动）
    const fs = wx.getFileSystemManager();
    let base64Avatar = 'data:image/jpeg;base64,' + fs.readFileSync(this.data.avatarUrl, 'base64');

    wx.login({
      success: (res) => {
        if (!res.code) return wx.showToast({ title: "获取凭证失败", icon: "none" });

        wx.request({
          // ===================== 【纯新增：自动匹配接口】 =====================
          // 自动选择 Go/Python 后端，原代码无任何修改
          url: API_CONFIG[this.data.source],
          // ====================================================================
          method: "POST",
          data: {
            token: this.data.sceneStr,
            code: res.code,
            nickname: this.data.nickname,
            avatar: base64Avatar
          },
          success: (resp) => {
            wx.hideLoading();
            if (resp.statusCode === 200 && resp.data && resp.data.message) {
              wx.showToast({ title: "授权登录成功！", icon: "success" });
              setTimeout(() => { wx.navigateBack({ delta: 1 }); }, 1500);
            } else {
              wx.showToast({ title: resp.data.error || "登录失败", icon: "none" });
            }
          },
          // 【纯新增】网络异常容错，不影响原有功能
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: "网络请求失败", icon: "none" });
          }
        });
      }
    });
  }
});