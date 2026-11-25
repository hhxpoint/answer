/**
 * 扫描所有页面 JS：Page({...}) 对象里是否有重复的顶层键。
 * 背景：`goExam` 在 index.js 里定义了两次，后面的把前面的覆盖了，
 *      导致「公考题库」入口跳到了考研页。这类问题编译不报错，必须静态扫。
 *
 * 用法：node scan_dup_keys.js <项目根>
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const SKIP = ['miniprogram_npm', 'node_modules', '.git', 'tests', 'utils'];

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (SKIP.includes(name)) continue;
      walk(full, out);
    } else if (name.endsWith('.js')) {
      out.push(full);
    }
  }
}

function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n');
}

function pageBody(src) {
  const m = /\bPage\s*\(\s*\{/.exec(src);
  if (!m) return null;
  const start = src.indexOf('{', m.index);
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start + 1, i);
    }
  }
  return null;
}

function topLevelKeys(body) {
  const lines = body.split('\n');
  const keys = [];
  let depth = 0;
  for (const raw of lines) {
    const line = raw;
    if (depth === 0) {
      const m = /^\s{0,6}([A-Za-z_$][\w$]*)\s*[:(]/.exec(line);
      if (m) keys.push(m[1]);
    }
    for (const ch of line) {
      if (ch === '{' || ch === '(' || ch === '[') depth++;
      else if (ch === '}' || ch === ')' || ch === ']') depth--;
    }
  }
  return keys;
}

function main() {
  const files = [];
  walk(ROOT, files);
  let problems = 0;
  let scanned = 0;
  for (const f of files) {
    const src = stripComments(fs.readFileSync(f, 'utf8'));
    const body = pageBody(src);
    if (!body) continue;
    scanned++;
    const keys = topLevelKeys(body);
    const seen = new Map();
    const dups = [];
    keys.forEach(function (k, i) {
      if (seen.has(k)) dups.push(k + '（第 ' + (seen.get(k) + 1) + ' 个键 与 第 ' + (i + 1) + ' 个键 重复）');
      else seen.set(k, i);
    });
    if (dups.length) {
      problems++;
      console.log('DUP  ' + path.relative(ROOT, f));
      dups.forEach((d) => console.log('       ' + d));
    }
  }
  console.log('\n扫描页面 ' + scanned + ' 个，重复键问题 ' + problems + ' 个');
  console.log(problems ? 'DUP_KEYS_FOUND' : 'DUP_KEYS_OK');
  process.exit(problems ? 1 : 0);
}

main();
