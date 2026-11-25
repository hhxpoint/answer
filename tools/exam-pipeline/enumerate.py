# -*- coding: utf-8 -*-
"""枚举 2020–2025 国考的 16 卷：确认 6 个模块里的文件是否同名。

输出：cache/papers.txt（卷名，不含 .md）与 cache/module_map.json
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
REPO = 'ERRRC/xingcezhenti'

MODULES = ['01-政治理论', '02-常识判断', '03-言语理解与表达', '04-数量关系', '05-判断推理', '06-资料分析']
YEARS = ('2020', '2021', '2022', '2023', '2024', '2025')


def gh(path):
    out = subprocess.run(['gh', 'api', path], capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        raise SystemExit(out.stderr[:400])
    return json.loads(out.stdout)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(CACHE, exist_ok=True)
    by_mod = {}
    for mod in MODULES:
        items = gh('repos/%s/contents/%s' % (REPO, urllib.parse.quote(mod)))
        names = [x['name'] for x in items if x['type'] == 'file' and x['name'].endswith('.md')]
        hit = [n[:-3] for n in names if '国家公务员' in n and any(y in n for y in YEARS)]
        by_mod[mod] = set(hit)
        print('%-14s %d' % (mod, len(hit)))

    common = set.intersection(*by_mod.values())
    only_some = {}
    for mod, s in by_mod.items():
        diff = s - common
        if diff:
            only_some[mod] = sorted(diff)

    print('\n交集卷数: %d' % len(common))
    if only_some:
        print('存在模块间不一致：')
        for m, d in only_some.items():
            print('  %s: %s' % (m, d))

    papers = sorted(common)
    with open(os.path.join(CACHE, 'papers.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(papers))
    json.dump({m: sorted(s) for m, s in by_mod.items()},
              open(os.path.join(CACHE, 'module_map.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    print('\n卷清单：')
    for p in papers:
        print('  ' + p)


if __name__ == '__main__':
    main()
