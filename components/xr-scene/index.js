// components/xr-scene/index.js
// xr-frame组件 - 必须使用Component而不是Page

Component({
  properties: {
    width: { type: Number, value: 300 },
    height: { type: Number, value: 300 }
  },

  data: {
    loaded: false
  },

  methods: {
    // 场景就绪回调
    handleReady({ detail }) {
      this.scene = detail.value;
      const xrFS = wx.getXrFrameSystem();
      this.xrFS = xrFS;

      console.log('=== XR Scene Ready ===');
      console.log('scene:', !!this.scene);

      // 获取相机组件
      try {
        const cameraEl = this.scene.getElementById('camera');
        if (cameraEl) {
          this.camera = cameraEl.getComponent(xrFS.Camera);
        }
      } catch (e) {}

      // 通知父页面场景就绪
      this.triggerEvent('ready', { scene: this.scene });
    },

    // 资源加载完成
    handleAssetsLoaded() {
      console.log('=== Assets Loaded ===');
      this.setData({ loaded: true });
      this.triggerEvent('assetsLoaded');
    },

    handleTouchStart(e) {
      // 当在场景点击时
      // this.scene.ar.placeHere('setitem', true);
      // 为了让父页面控制放置逻辑，我们将点击事件冒泡出去
      this.triggerEvent('sceneTouch', e.detail);
    },

    // 每帧回调
    handleTick({ detail }) {
      const delta = detail.value;

      // 让setitem旋转
      if (this.scene) {
        try {
          const setitem = this.scene.getElementById('setitem');
          if (setitem) {
            const transform = setitem.getComponent(this.xrFS.Transform);
            if (transform) {
              transform.rotation.y += delta * 50;
            }
          }
        } catch (e) {}
      }

      // 通知父页面帧更新
      this.triggerEvent('tick', { delta });
    },

    // 对外暴露场景引用
    getScene() {
      return this.scene;
    },

    // 对外暴露相机引用
    getCamera() {
      return this.camera;
    }
  }
});
