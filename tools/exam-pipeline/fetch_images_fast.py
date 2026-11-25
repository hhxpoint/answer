# -*- coding: utf-8 -*-
"""并发补抓图片（比单线程快一个数量级）。

用法：python fetch_images_fast.py <卷目录名或 all>
"""
import concurrent.futures as cf
import os
import time
import re
import sys
import urllib.parse
import urllib.request

REPO = 'ERRRC/xingcezhenti'
RAW = 'https://raw.githubusercontent.com/%s/HEAD/' % REPO
UA = {'User-Agent': 'exam-bank-pipeline/1.0'}
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
IMG = os.path.join(CACHE, '_img')
WORKERS = int(os.environ.get('EXAM_FETCH_WORKERS', '12'))
ATTEMPTS = int(os.environ.get('EXAM_FETCH_ATTEMPTS', '2'))

IMG_REF = re.compile(r'src="([^"]+)"')


def refs_of(md_path):
    with open(md_path, encoding='utf-8') as f:
        txt = f.read()
    out = []
    for r in IMG_REF.findall(txt):
        norm = r.replace('../', '').strip()
        out.append(norm)
    return out


def get(url, timeout=15):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def main():
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if which == 'all':
        dirs = [d for d in os.listdir(CACHE) if os.path.isdir(os.path.join(CACHE, d)) and not d.startswith('_')]
    else:
        dirs = [which]

    need = {}
    for d in dirs:
        p = os.path.join(CACHE, d)
        if not os.path.isdir(p):
            continue
        for fn in os.listdir(p):
            if fn.endswith('.md'):
                for rel in refs_of(os.path.join(p, fn)):
                    need.setdefault(rel, os.path.basename(rel))

    os.makedirs(IMG, exist_ok=True)
    todo = []
    for rel, name in need.items():
        local = os.path.join(IMG, name)
        if os.path.exists(local) and os.path.getsize(local) > 100:
            continue
        todo.append((rel, local))

    print('引用 %d 张，已存在 %d，待下载 %d' % (len(need), len(need) - len(todo), len(todo)))
    if not todo:
        return

    ok = fail = 0

    def one(item):
        rel, local = item
        url = RAW + urllib.parse.quote(rel)
        for attempt in range(ATTEMPTS):
            try:
                data = get(url)
                if not data:
                    raise RuntimeError('empty')
                with open(local, 'wb') as f:
                    f.write(data)
                return True, rel
            except Exception:  # noqa: BLE001
                time.sleep(0.6 * (attempt + 1))
                if attempt == ATTEMPTS - 1:
                    return False, rel
        return False, rel

    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for i, (fine, rel) in enumerate(ex.map(one, todo), 1):
            if fine:
                ok += 1
            else:
                fail += 1
                print('  [miss] %s' % rel)
            if i % 25 == 0:
                print('  ... %d/%d' % (i, len(todo)))

    print('完成 ok=%d fail=%d' % (ok, fail))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
