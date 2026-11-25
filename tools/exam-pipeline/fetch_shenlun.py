# -*- coding: utf-8 -*-
"""抓取 5 套国考申论题目册（Typst 源）。

来源：LeonardoTan19/GuoKaoShenLun（国考申论历年真题，Typst 排版）
"""
import base64
import io
import json
import os
import subprocess
import sys
import urllib.parse

REPO = 'LeonardoTan19/GuoKaoShenLun'
DIR = '题目册'
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache', 'shenlun')

PAPERS = [
    ('2025', '副省级'),
    ('2025', '地市级'),
    ('2025', '行政执法卷'),
    ('2024', '副省级'),
    ('2024', '地市级'),
    ('2023', '副省级'),
]


def gh(path):
    out = subprocess.run(['gh', 'api', path], capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        raise SystemExit(out.stderr[:300])
    return json.loads(out.stdout)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(CACHE, exist_ok=True)
    base = '中央机关及其直属机构录用公务员考试申论'
    ok = 0
    for year, kind in PAPERS:
        name = '%s年%s（%s）.typ' % (year, base, kind)
        local = os.path.join(CACHE, '%s-%s.typ' % (year, kind))
        if os.path.exists(local) and os.path.getsize(local) > 1000:
            ok += 1
            continue
        try:
            data = gh('repos/%s/contents/%s' % (REPO, urllib.parse.quote(DIR + '/' + name)))
            txt = base64.b64decode(data['content']).decode('utf-8', 'replace')
        except SystemExit as e:
            print('  [skip] %s (%s)' % (name, e))
            continue
        io.open(local, 'w', encoding='utf-8').write(txt)
        print('  [ok] %-28s %6d bytes' % ('%s-%s' % (year, kind), len(txt)))
        ok += 1
    print('共 %d 套' % ok)


if __name__ == '__main__':
    main()
