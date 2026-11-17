/**
 * 智能代码格式化
 * 会自动判断是否为 Python(无大括号)，如果是则保留原有缩进；否则进行基础的 {} 缩进排版。
 */
function formatCode(code) {
  if (!code || !code.trim()) return '';
  let raw = code.trim();

  // 粗略判断是否为 Python (没有分号，没有大括号，有 def 或 import)
  const isPython = !raw.includes('{') && (raw.includes('def ') || raw.includes('import '));
  if (isPython) {
    // Python 绝对不能破坏前置空格，只清理多余空行
    return raw.replace(/^\s*[\r\n]/gm, '');
  }

  // C++/Java/JS 风格格式化
  let formatted = '';
  let indentLevel = 0;
  const indentChar = '    '; // 4个空格
  let inString = false;
  let strChar = '';

  // 预清理多余空白，但保留换行符用于逻辑判断
  let cleanCode = raw.replace(/[ \t]+/g, ' ').replace(/\s*([\{\};])\s*/g, '$1');

  for (let i = 0; i < cleanCode.length; i++) {
    let char = cleanCode[i];

    if ((char === '"' || char === "'" || char === '`') && cleanCode[i-1] !== '\\') {
      if (!inString) { inString = true; strChar = char; } 
      else if (char === strChar) { inString = false; }
    }

    if (inString) {
      formatted += char; continue;
    }

    if (char === '{') {
      indentLevel++;
      formatted += ' {\n' + indentChar.repeat(indentLevel);
    } else if (char === '}') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += '\n' + indentChar.repeat(indentLevel) + '}\n' + indentChar.repeat(indentLevel);
    } else if (char === ';') {
      formatted += ';\n' + indentChar.repeat(indentLevel);
    } else {
      formatted += char;
    }
  }
  return formatted.replace(/\n\s*\n/g, '\n').trim(); // 清理多出来的连续空行
}

/**
 * 高级安全语法高亮 (防 HTML 标签注入冲突版)
 */
function highlightCode(code) {
  if (!code) return '';

  // 1. 转义基础 HTML 字符
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 2. 建立安全字典，防止正则误伤
  const dict = [];
  const pushDict = (str, color) => {
    dict.push(`<span style="color: ${color};">${str}</span>`);
    return `__TOKEN_${dict.length - 1}__`;
  };

  // 3. 抽取字符串 (橙红色) 和 注释 (绿色)
  html = html
    .replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, match => pushDict(match, '#CE9178'))
    .replace(/(\/\/.*?)(\n|$)/g, (match, p1, p2) => pushDict(p1, '#6A9955') + p2)
    .replace(/(\/\*[\s\S]*?\*\/)/g, match => pushDict(match, '#6A9955'))
    .replace(/(#.*?)(\n|$)/g, (match, p1, p2) => pushDict(p1, '#6A9955') + p2); // Python注释

  // 4. 关键字高亮 (Java/C++/Python/JS 核心词汇)
  const keywords1 = "public|private|protected|class|static|void|int|float|double|char|boolean|String|bool|auto|def|self|import|from|as|include|using|namespace|const|let|var|function|return|if|else|for|while|break|continue|new|try|catch".split('|').join('|');
  const reg1 = new RegExp(`\\b(${keywords1})\\b`, 'g');
  html = html.replace(reg1, match => pushDict(match, '#C586C0')); // 紫粉色关键字

  const keywords2 = "this|true|false|null|undefined|None".split('|').join('|');
  const reg2 = new RegExp(`\\b(${keywords2})\\b`, 'g');
  html = html.replace(reg2, match => pushDict(match, '#569CD6')); // 蓝色关键字

  // 5. 数字高亮
  html = html.replace(/\b(\d+(\.\d+)?)\b/g, match => pushDict(match, '#B5CEA8'));

  // 6. 函数名调用高亮
  html = html.replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)\s*(?=\()/g, match => pushDict(match, '#DCDCAA'));

  // 7. 符号淡化处理
  html = html.replace(/([\{\}\[\]\(\)\.,;:+\-\*\/%&|^!~=<>?])/g, match => pushDict(match, '#858585'));

  // 8. 还原占位符
  for (let i = 0; i < dict.length; i++) {
    html = html.replace(`__TOKEN_${i}__`, dict[i]);
  }

  // 9. 处理换行和缩进，保证 rich-text 严格按照等宽显示
  html = html.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');

  // 优化后的外层容器：指定系统级等宽字体
  return `<div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 26rpx; line-height: 1.6; color: #D4D4D4;">${html}</div>`;
}

module.exports = { formatCode, highlightCode };