/**
 * 避开了微信小程序的 new Function 限制，全手工解析
 */
const MathParser = {
  ops: { '+': 1, '-': 1, '*': 2, '/': 2, 'sin': 3, 'cos': 3, 'tan': 3 },

  // 计算逻辑
  calc: (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return 0;
    }
  },

  // 三角函数计算
  calcFunc: (a, op) => {
    const rad = a * Math.PI / 180;
    switch (op) {
      case 'sin': return Math.sin(rad);
      case 'cos': return Math.cos(rad);
      case 'tan': return Math.tan(rad);
      default: return a;
    }
  },

  /**
   * 核心解析引擎
   * @param {string} str 表达式
   * @param {Object} vars 变量映射，如 {x: 5}
   */
  evaluate: function(str, vars = {}) {
    try {
      let s = str.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, Math.PI).replace(/e/g, Math.E);
      
      // 变量替换：把 x 替换为具体数值
      for (let key in vars) {
        let reg = new RegExp('\\b' + key + '\\b', 'g');
        s = s.replace(reg, '(' + vars[key] + ')');
      }

      // 词法分析：处理负数和符号
      const tokens = s.match(/([0-9\.]+|sin|cos|tan|[\+\-\*\/\(\)])/g);
      if (!tokens) return 0;

      const values = [];
      const ops = [];

      const applyOp = () => {
        const op = ops.pop();
        if (['sin', 'cos', 'tan'].includes(op)) {
          values.push(this.calcFunc(values.pop(), op));
        } else {
          const b = values.pop();
          const a = values.pop();
          values.push(this.calc(a, b, op));
        }
      };

      for (let i = 0; i < tokens.length; i++) {
        let t = tokens[i];
        if (!isNaN(t)) {
          values.push(parseFloat(t));
        } else if (t === '(') {
          ops.push(t);
        } else if (t === ')') {
          while (ops.length && ops[ops.length - 1] !== '(') applyOp();
          ops.pop();
        } else {
          // 处理负数开头
          if (t === '-' && (i === 0 || tokens[i-1] === '(')) {
             values.push(0);
          }
          while (ops.length && ops[ops.length - 1] !== '(' && this.ops[ops[ops.length - 1]] >= this.ops[t]) {
            applyOp();
          }
          ops.push(t);
        }
      }
      while (ops.length) applyOp();
      return values[0];
    } catch (e) { return NaN; }
  }
};

// --- 对外接口 ---

// 1. 普通执行
const exec = (expr) => {
  const res = MathParser.evaluate(expr);
  return isNaN(res) ? "格式错误" : parseFloat(res.toFixed(10));
};

// 2. 微分运算 d/dx(expr, xVal)
const calculateDiff = (expr, xVal) => {
  const h = 0.0001;
  const f = (v) => MathParser.evaluate(expr, { x: v });
  const res = (f(xVal + h) - f(xVal - h)) / (2 * h);
  return isNaN(res) ? "计算错误" : parseFloat(res.toFixed(6));
};

// 3. 积分运算 ∫(expr, a, b)
const calculateInt = (expr, a, b) => {
  const n = 100, h = (b - a) / n;
  const f = (v) => MathParser.evaluate(expr, { x: v });
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  const res = (h / 3) * sum;
  return isNaN(res) ? "计算错误" : parseFloat(res.toFixed(6));
};

// 4. 矩阵行列式 det([1,2;3,4])
const calculateDet = (str) => {
  try {
    let m = str.replace(/[\[\]\s]/g, '').split(';').map(r => r.split(',').map(Number));
    const det = (mat) => {
      if (mat.length === 1) return mat[0][0];
      if (mat.length === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
      return mat[0].reduce((acc, curr, i) => {
        let sub = mat.slice(1).map(r => r.filter((_, j) => j !== i));
        return acc + (i % 2 === 0 ? 1 : -1) * curr * det(sub);
      }, 0);
    };
    return det(m);
  } catch (e) { return "格式错误"; }
};

module.exports = { exec, calculateDiff, calculateInt, calculateDet };