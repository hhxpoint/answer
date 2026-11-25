/**
 * 红领巾批改 · 规则引擎
 *
 * 定位：基于「参考要点 + 作答结构」的确定性批改，不调用任何生成式模型，
 *      同一份作答每次得分完全一致，便于复盘对比。
 *
 * 评分构成（按题目满分折算）：
 *   要点覆盖 60%  —— 关键词命中
 *   结构规范 25%  —— 分条 10% / 字数合规 10% / 扣材料 5%
 *   表达完整 15%  —— 字数充实度
 */

const STOP = [
  '我们', '他们', '可以', '进行', '通过', '以及', '但是', '因为', '所以', '这个', '那个',
  '一个', '没有', '就是', '不是', '还是', '这样', '那样', '什么', '已经', '需要', '应该',
  '方面', '问题', '工作', '发展', '建设', '推进', '加强', '进一步', '有关', '相关'
];

const WEIGHTS = { content: 0.60, structure: 0.25, expression: 0.15 };
const STRUCT = { enum: 0.10, words: 0.10, material: 0.05 };

function cnOnly(s) {
  return String(s || '').replace(/[^\u4e00-\u9fa5]/g, '');
}

/** 从要点原文取关键词（2 字词元，去停用词，按出现顺序去重） */
function termsOf(text, limit) {
  const cn = cnOnly(text);
  const out = [];
  const seen = {};
  for (let i = 0; i + 2 <= cn.length; i++) {
    const g = cn.substr(i, 2);
    if (STOP.indexOf(g) >= 0) continue;
    if (seen[g]) continue;
    seen[g] = 1;
    out.push(g);
    if (out.length >= (limit || 8)) break;
  }
  return out;
}

/** 单条要点命中判定：关键词命中率 ≥ 0.34 记为覆盖 */
function hitPoint(point, answerCn) {
  const terms = termsOf((point && (point.detail || point.label)) || '', 10);
  if (!terms.length) return { hit: false, ratio: 0, terms: [] };
  let hit = 0;
  const matched = [];
  terms.forEach(function (t) {
    if (answerCn.indexOf(t) >= 0) {
      hit += 1;
      matched.push(t);
    }
  });
  const ratio = hit / terms.length;
  return { hit: ratio >= 0.34, ratio: ratio, terms: matched };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

/**
 * 批改主函数
 * @param {object} question 题目（含 score / wordMin / wordMax / keyPoints）
 * @param {string} answer   作答原文
 * @param {object} inspect  store.inspectAnswer 的结果（可选，内部会重算）
 * @returns {object} { total, full, breakdown:{content,structure,expression}, hitRate,
 *                     points:[{index,label,from,hit,ratio}], issues:[], suggestions:[] }
 */
function grade(question, answer, inspect) {
  const full = Number(question && question.score) || 0;
  const text = String(answer || '');
  const cn = cnOnly(text);
  const chars = cn.length;

  const ins = inspect || {
    chars: chars,
    hasEnum: /(^|\n)\s*([0-9]{1,2}[.、]|[一二三四五六七八九十][、.]|[①②③④⑤⑥⑦⑧⑨⑩])/.test(text),
    refMat: /资料|材料/.test(text),
    lines: text.split(/\n+/).filter(function (x) { return x.trim(); }).length
  };

  const points = (question.keyPoints || []).map(function (p, i) {
    const r = hitPoint(p, cn);
    return {
      index: i,
      label: p.label,
      from: p.from,
      hit: r.hit,
      ratio: round1(r.ratio),
      matched: r.terms
    };
  });

  const totalPts = points.length || 1;
  const hitCount = points.filter(function (p) { return p.hit; }).length;
  const hitRate = hitCount / totalPts;

  // 要点分
  const content = WEIGHTS.content * full * hitRate;

  // 结构分
  let structureRatio = 0;
  if (ins.hasEnum) structureRatio += STRUCT.enum;
  const max = Number(question.wordMax) || 0;
  const min = Number(question.wordMin) || 0;
  const overLimit = max > 0 && chars > max;
  const underLimit = (min > 0 && chars < min) || (max > 0 && chars < max * 0.6);
  if (chars > 0 && !overLimit && !underLimit) structureRatio += STRUCT.words;
  if (ins.refMat) structureRatio += STRUCT.material;
  const structure = WEIGHTS.structure * full * (structureRatio / (STRUCT.enum + STRUCT.words + STRUCT.material));

  // 表达分：字数充实度（达到上限 85% 视为满分，不足按比例）
  let exprRatio = 0;
  if (max > 0) {
    exprRatio = Math.min(1, chars / (max * 0.85));
  } else if (min > 0) {
    exprRatio = Math.min(1, chars / min);
  } else {
    exprRatio = chars > 0 ? 1 : 0;
  }
  if (overLimit) exprRatio = Math.max(0, 1 - (chars - max) / Math.max(1, max));
  const expression = WEIGHTS.expression * full * exprRatio;

  const total = round1(Math.min(full, content + structure + expression));

  // 问题与建议（全部由规则命中生成）
  const issues = [];
  const suggestions = [];
  if (!chars) {
    issues.push('作答为空');
    suggestions.push('先写出总括句，再分条展开要点。');
  }
  points.forEach(function (p) {
    if (!p.hit) {
      issues.push('第 ' + (p.index + 1) + ' 条要点未覆盖');
      suggestions.push('补「' + p.label + '」（来自资料 ' + p.from + '）。');
    }
  });
  if (!ins.hasEnum && chars > 0) {
    issues.push('未分条作答');
    suggestions.push('用 1. / 2. / 3. 分行列出要点，阅卷更易给分。');
  }
  if (overLimit) {
    issues.push('超出字数上限 ' + (chars - max) + ' 字');
    suggestions.push('删去修饰性表述，优先保留动宾结构的要点句。');
  }
  if (underLimit && chars > 0) {
    issues.push('字数偏少');
    suggestions.push('补充材料中的具体做法或数据，写到 ' + (max ? Math.round(max * 0.85) : (min || 200)) + ' 字左右。');
  }
  if (!ins.refMat && chars > 0) {
    issues.push('未明确扣材料');
    suggestions.push('点明「根据资料 X」或引用材料关键词，避免被判脱离材料。');
  }

  return {
    total: total,
    full: full,
    hitRate: round1(hitRate),
    hitCount: hitCount,
    pointCount: totalPts,
    chars: chars,
    breakdown: {
      content: round1(content),
      structure: round1(structure),
      expression: round1(expression)
    },
    points: points,
    issues: issues,
    suggestions: suggestions,
    label: '红领巾批改'
  };
}

module.exports = {
  grade: grade,
  termsOf: termsOf,
  hitPoint: hitPoint,
  WEIGHTS: WEIGHTS
};
