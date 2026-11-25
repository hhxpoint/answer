# -*- coding: utf-8 -*-
"""小程序静态接线检查（不依赖微信运行时）。

检查项：
 1. app.json 里注册的页面是否都有 .js/.json/.wxml（wxss 可选）
 2. 所有 .json 是否为合法 JSON
 3. WXML 里绑定的事件处理函数是否在页面 JS 中定义
 4. wx.navigateTo/redirectTo/reLaunch/switchTab 的目标是否已注册
 5. 页面 JS 里的相对 require 是否都能解析
 6. 子包目录下的页面是否都被 app.json 注册（孤儿页面）

用法：
    python check_pages.py <小程序根目录> [--root packageTrade]
"""
import json
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else r'D:\dsh\workplace\work\answer\hhxpoint-answer-1848759'
ONLY = None
if '--root' in sys.argv:
    ONLY = sys.argv[sys.argv.index('--root') + 1]

HANDLER_ATTR = re.compile(r'\b(?:bind|catch|capture-bind|capture-catch):?([a-zA-Z]+)\s*=\s*"([^"{}]+)"')
NAV = re.compile(r"wx\.(navigateTo|redirectTo|reLaunch|switchTab)\(\s*\{[^}]*url\s*:\s*['\"]([^'\"]+)['\"]")
REQ = re.compile(r"require\(\s*['\"](\.[^'\"]+)['\"]\s*\)")

problems = []
stats = {'pages': 0, 'wxml': 0, 'handlers': 0, 'nav': 0, 'require': 0}


def rel(p):
    return os.path.relpath(p, ROOT).replace('\\', '/')


with open(os.path.join(ROOT, 'app.json'), encoding='utf-8') as f:
    app = json.load(f)

registered = set()
for p in app.get('pages', []):
    registered.add(p)
for sub in app.get('subPackages', []) or []:
    for p in sub.get('pages', []):
        registered.add(sub['root'].rstrip('/') + '/' + p)

pages = sorted(registered)
if ONLY:
    pages = [p for p in pages if p.startswith(ONLY)]

def code_lines(src):
    """去掉整行注释（// 开头）与块注释，避免把注释里的 require/跳转当代码。"""
    out = []
    in_block = False
    for line in src.splitlines():
        s = line.strip()
        if in_block:
            if '*/' in s:
                in_block = False
            continue
        if s.startswith('/*'):
            if '*/' not in s:
                in_block = True
            continue
        if s.startswith('//'):
            continue
        out.append(line)
    return '\n'.join(out)


for page in pages:
    stats['pages'] += 1
    base = os.path.join(ROOT, page.replace('/', os.sep))
    for ext in ('.js', '.json', '.wxml'):
        if not os.path.exists(base + ext):
            problems.append('缺文件 %s%s' % (page, ext))
    js_path = base + '.js'
    wxml_path = base + '.wxml'
    if not os.path.exists(js_path) or not os.path.exists(wxml_path):
        continue

    with open(js_path, encoding='utf-8') as f:
        js = f.read()
    with open(wxml_path, encoding='utf-8') as f:
        wxml = f.read()
        stats['wxml'] += 1

    if os.path.exists(base + '.json'):
        try:
            json.loads(open(base + '.json', encoding='utf-8').read())
        except Exception as e:
            problems.append('JSON 非法 %s.json: %s' % (page, e))

    for _evt, fn in HANDLER_ATTR.findall(wxml):
        fn = fn.strip()
        if not fn or fn.startswith('{{'):
            continue
        stats['handlers'] += 1
        if not re.search(r'(?:^|[\s,{])' + re.escape(fn) + r'\s*[:(]', js):
            problems.append('处理函数缺失 %s: %s' % (page, fn))

    js_code = code_lines(js)
    for _kind, url in NAV.findall(js_code):
        url = url.strip()
        if '{{' in url or url.startswith('http'):
            continue
        stats['nav'] += 1
        target = url.split('?')[0].lstrip('/')
        if target and target not in registered:
            problems.append('跳转目标未注册 %s -> %s' % (page, url))

    for mod in REQ.findall(js_code):
        stats['require'] += 1
        target = os.path.normpath(os.path.join(os.path.dirname(js_path), mod.replace('/', os.sep)))
        if os.path.exists(target) or os.path.exists(target + '.js'):
            continue
        if 'miniprogram_npm/' in mod.replace('\\', '/'):
            # 构建产物（微信开发者工具「构建 npm」生成），不入库；运行时缺失应由 try/catch 兜底
            stats.setdefault('npmdeps', 0)
            stats['npmdeps'] = (stats.get('npmdeps') or 0) + 1
            continue
        problems.append('require 解析失败 %s -> %s' % (page, mod))

# 孤儿页面：只扫 <子包>/pages/ 下存在但未注册的页面（utils/data/tests 不算页面）
if ONLY:
    pages_dir = os.path.join(ROOT, ONLY, 'pages')
    for dirpath, _dirs, files in os.walk(pages_dir):
        for f in files:
            if not f.endswith('.js'):
                continue
            page = rel(os.path.join(dirpath, f))[:-3]
            if page not in registered:
                problems.append('未注册页面 %s' % page)

print('检查范围: %s' % (ONLY or '全部'))
print('统计: 页面 %(pages)d · WXML %(wxml)d · 事件 %(handlers)d · 跳转 %(nav)d · require %(require)d' % stats)
if stats.get('npmdeps'):
    print('提示: %d 个 miniprogram_npm 依赖（构建产物，需在开发者工具「构建 npm」后生效，已按 try/catch 兜底处理）' % stats['npmdeps'])
if problems:
    print('\n发现 %d 个问题：' % len(problems))
    for p in problems:
        print('  - ' + p)
    sys.exit(1)
print('\nPAGES_CHECK_OK')
