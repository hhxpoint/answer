# -*- coding: utf-8 -*-
"""挑选省考卷：按关键词在 6 个模块里求交集，确认同名存在。"""
import json
import os
import subprocess
import sys
import urllib.parse

REPO = 'ERRRC/xingcezhenti'
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
MODULES = ['01-政治理论', '02-常识判断', '03-言语理解与表达', '04-数量关系', '05-判断推理', '06-资料分析']

# 目标：2024–2025 代表性省考 10 套（年份 + 省份 + 类别关键词）
WANT = [
    ('2025', '上海', 'A类'),
    ('2025', '山东', ''),
    ('2025', '江苏', 'A类'),
    ('2025', '浙江', 'A类'),
    ('2025', '广东', ''),
    ('2024', '北京', ''),
    ('2024', '四川', ''),
    ('2024', '河南', ''),
    ('2024', '湖北', ''),
    ('2024', '深圳', ''),
]


def gh(path):
    out = subprocess.run(['gh', 'api', path], capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        raise SystemExit(out.stderr[:300])
    return json.loads(out.stdout)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    names = {}
    for mod in MODULES:
        items = gh('repos/%s/contents/%s' % (REPO, urllib.parse.quote(mod)))
        names[mod] = {x['name'][:-3] for x in items if x['type'] == 'file' and x['name'].endswith('.md')}

    picked = []
    for year, prov, cls in WANT:
        cands = [n for n in names[MODULES[0]]
                 if n.startswith(year) and prov in n and '公务员' in n and cls in n and '国家' not in n]
        if not cands:
            print('  [miss] %s %s %s' % (year, prov, cls))
            continue
        # 取最短的（通常是不带额外限定的正卷）
        cands.sort(key=len)
        name = cands[0]
        ok = all(name in names[m] for m in MODULES)
        print('  %s %s' % ('OK  ' if ok else 'PART', name))
        if ok:
            picked.append(name)

    out = os.path.join(CACHE, 'papers_sk.txt')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(picked))
    print('\n省考选中 %d 套 -> %s' % (len(picked), out))


if __name__ == '__main__':
    main()
