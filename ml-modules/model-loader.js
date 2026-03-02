// TensorFlow.js 模型加载器
export default class ModelLoader {
  constructor() {
    this.tf = null;
    this.model = null;
    this.isLoaded = false;
  }


  
  // 加载TensorFlow.js核心库
  loadTFJS() {
    return new Promise((resolve) => {
      if (typeof tf !== 'undefined') {
        this.tf = tf;
        resolve();
        return;
      }

      // 动态加载TensorFlow.js
      try {
        // 加载核心库
        require('../../libs/tensorflow/tf-core.js');
        
        // 加载WASM后端（推荐，兼容性最好）
        require('../../libs/tensorflow/tf-backend-wasm.js');
        
        // 检查是否加载成功
        const checkInterval = setInterval(() => {
          if (typeof tf !== 'undefined') {
            clearInterval(checkInterval);
            this.tf = tf;
            
            // 设置WASM后端
            this.tf.setBackend('wasm').then(() => {
              console.log('TensorFlow.js加载完成，使用WASM后端');
              resolve();
            });
          }
        }, 100);
        
        // 5秒超时
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('TensorFlow.js加载超时'));
        }, 5000);
        
      } catch (error) {
        console.error('TensorFlow.js加载失败:', error);
        reject(error);
      }
    });
  }

  // 加载情感分析模型
  async loadEmotionModel() {
    if (!this.tf) {
      await this.loadTFJS();
    }

    try {
      // 模型文件路径
      const modelPath = '/models/emotion/model.json';
      
      // 加载模型
      this.model = await this.tf.loadLayersModel(modelPath);
      this.isLoaded = true;
      
      console.log('情感分析模型加载成功');
      return true;
    } catch (error) {
      console.error('模型加载失败:', error);
      this.isLoaded = false;
      return false;
    }
  }

  // 获取模型
  getModel() {
    if (!this.isLoaded) {
      throw new Error('模型未加载');
    }
    return this.model;
  }

  // 获取TensorFlow实例
  getTF() {
    return this.tf;
  }

  // 清理资源
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isLoaded = false;
  }
}