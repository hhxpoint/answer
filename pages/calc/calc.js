// // pages/calc/calc.js
// const math = require('../../utils/mathEngine.js');

// Page({
//   data: {
//     expr: "",
//     result: "0",
//     isAdvanced: false
//   },
  
//   press: function(e) {
//     const val = e.currentTarget.dataset.val;
//     if (val === 'AC') { this.setData({ expr: "", result: "0" }); return; }
//     if (val === '=') { this.calculateFinal(); return; }

//     let input = val;
//     // 映射显示符号
//     const map = { 'sin':'sin(', 'cos':'cos(', 'tan':'tan(', 'int':'∫(', 'diff':'d/dx(', 'pi':'π' };
//     if (map[val]) input = map[val];
    
//     this.setData({ expr: this.data.expr + input });
//   },

//   calculateFinal: function() {
//     const expr = this.data.expr;
//     if (!expr) return;

//     // 特殊模式识别
//     if (expr.includes('∫(')) {
//       let m = expr.match(/∫\((.+),(.+),(.+)\)/);
//       if (m) return this.setData({ result: math.calculateInt(m[1], parseFloat(m[2]), parseFloat(m[3])) });
//     }
//     if (expr.includes('d/dx(')) {
//       let m = expr.match(/d\/dx\((.+),(.+)\)/);
//       if (m) return this.setData({ result: math.calculateDiff(m[1], parseFloat(m[2])) });
//     }
//     if (expr.startsWith('det(')) {
//       let m = expr.match(/det\((.+)\)/);
//       if (m) return this.setData({ result: math.calculateDet(m[1]) });
//     }

//     // 普通计算模式
//     this.setData({ result: math.exec(expr).toString() });
//   }
// });



// pages/calc/calc.js
const math = require('../../utils/mathEngine.js');

Page({
  data: {
    expr: "",      // 输入框显示的字符串
    result: "0",   // 结果
    isAdvanced: false
  },

  // 切换模式按钮
  toggleMode: function() {
    this.setData({ isAdvanced: !this.data.isAdvanced });
  },

  // 按钮点击
  press: function(e) {
    const val = e.currentTarget.dataset.val;
    if (val === 'AC') { this.setData({ expr: "", result: "0" }); return; }
    if (val === '=') { this.calculateFinal(); return; }

    let input = val;
    // UI 映射逻辑
    const map = {
      'int': '∫(', 
      'diff': 'd/dx(', 
      'det': 'det(', 
      'sin': 'sin(', 
      'cos': 'cos(', 
      'tan': 'tan(', 
      'pi': 'π',
      'e': 'e',
      'x': 'x' // 高级模式下的变量x
    };
    if (map[val]) input = map[val];
    
    this.setData({ expr: this.data.expr + input });
  },

  // 计算总控
  calculateFinal: function() {
    const expr = this.data.expr;
    if (!expr) return;

    try {
      // --- 1. 积分模式识别 ---
      // 格式：∫(x*x, 0, 1)
      if (expr.includes('∫(')) {
        let m = expr.match(/∫\((.+),(.+),(.+)\)/);
        if (m) {
          let res = math.calculateInt(m[1], parseFloat(m[2]), parseFloat(m[3]));
          this.setData({ result: res.toString() });
          return;
        }
      }

      // --- 2. 微分模式识别 ---
      // 格式：d/dx(sin(x), 90)
      if (expr.includes('d/dx(')) {
        let m = expr.match(/d\/dx\((.+),(.+)\)/);
        if (m) {
          let res = math.calculateDiff(m[1], parseFloat(m[2]));
          this.setData({ result: res.toString() });
          return;
        }
      }

      // --- 3. 行列式模式识别 ---
      // 格式：det([1,2;3,4])
      if (expr.startsWith('det(')) {
        let m = expr.match(/det\((.+)\)/);
        if (m) {
          let res = math.calculateDet(m[1]);
          this.setData({ result: res.toString() });
          return;
        }
      }

      // --- 4. 万能基础计算模式 ---
      // 处理 3+3, sin(30), π+2 等
      let finalRes = math.exec(expr);
      this.setData({ result: finalRes.toString() });

    } catch (e) {
      this.setData({ result: "格式错误" });
    }
  },

     // 1. 实现“发送给朋友”功能
    onShareAppMessage: function () {
      return {
        title: '鸿蒙计算器', // 分享显示的标题
        path: '/pages/calc/calc', // 用户点击分享链接后进入的页面路径
        
      }
    },
  
    // 2. 实现“分享到朋友圈”功能
    onShareTimeline: function () {
      return {
        title: '鸿蒙计算器', // 朋友圈显示的标题
        query: 'id=share', // 点击朋友圈进入时带的参数
        
      }
    },

  

});