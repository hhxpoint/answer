# -*- coding: utf-8 -*-
"""批量抓取：papers.txt 里所有卷的 6 个模块 md + 全部图片。"""
import concurrent.futures as cf
import os
import re
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
IMG = os.path.join(CACHE, '_img')
RAW = 'https://raw.githubusercontent.com/ERRRC/xingcezhenti/HEAD/'
UA = {'User-Agent': 'exam-bank-pipeline/1.0'}
MODULES = ['01-政治理论', '02-常识判断', '03-言语理解与表达', '04-数量关系', '05-判断推理', '06-资料分析']
IMG_REF = re.compile(r'src="([^"]+)"')

WORKERS = int(os.environ.get('EXAM_FETCH_WORKERS', '6'))
ATTEMPTS = int(os.environ.get('EXAM_FETCH_ATTEMPTS', '4'))


def slug(name):
    return re.sub(r'[^\w\u4e00-\u9fa5]+', '-', name)[:60]


def get(url, timeout=20):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def fetch_text(rel):
    for i in range(ATTEMPTS):
        try:
            return get(RAW + urllib.parse.quote(rel)).decode('utf-8', 'replace')
        except Exception:  # noqa: BLE001
            time.sleep(0.8 * (i + 1))
    return None


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(IMG, exist_ok=True)
    papers = [x.strip() for x in open(os.path.join(CACHE, 'papers.txt'), encoding='utf-8') if x.strip()]
    print('卷数 %d' % len(papers))

    jobs = []
    for name in papers:
        d = os.path.join(CACHE, slug(name))
        os.makedirs(d, exist_ok=True)
        for mod in MODULES:
            rel = '%s/%s.md' % (mod, name)
            local = os.path.join(d, mod.split('-', 1)[1] + '.md')
            if os.path.exists(local) and os.path.getsize(local) > 200:
                continue
            jobs.append((rel, local))

    print('待下载 md: %d' % len(jobs))

    def one(job):
        rel, local = job
        txt = fetch_text(rel)
        if not txt:
            return False, local
        with open(local, 'w', encoding='utf-8') as f:
            f.write(txt)
        return True, local

    ok = bad = 0
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for fine, local in ex.map(one, jobs):
            if fine:
                ok += 1
            else:
                bad += 1
                print('  [md-miss] %s' % local)

    print('md 完成 ok=%d bad=%d' % (ok, bad))

    # 汇总所有图片引用
    need = set()
    for name in papers:
        d = os.path.join(CACHE, slug(name))
        for fn in os.listdir(d):
            if fn.endswith('.md'):
                with open(os.path.join(d, fn), encoding='utf-8') as f:
                    for r in IMG_REF.findall(f.read()):
                        need.add(r.replace('../', '').strip())
    print('图片引用 %d 个' % len(need))

    todo = []
    for rel in need:
        local = os.path.join(IMG, os.path.basename(rel))
        if os.path.exists(local) and os.path.getsize(local) > 100:
            continue
        todo.append((rel, local))
    print('待下载图片 %d 张' % len(todo))

    def img_one(item):
        rel, local = item
        for i in range(ATTEMPTS):
            try:
                data = get(RAW + urllib.parse.quote(rel), timeout=25)
                if data:
                    with open(local, 'wb') as f:
                        f.write(data)
                    return True, rel
            except Exception:  # noqa: BLE001
                time.sleep(0.7 * (i + 1))
        return False, rel

    iok = ibad = 0
    with cf.ThreadPoolExecutor(max_workers=max(2, WORKERS // 2)) as ex:
        for i, (fine, rel) in enumerate(ex.map(img_one, todo), 1):
            if fine:
                iok += 1
            else:
                ibad += 1
                print('  [img-miss] %s' % rel)
            if i % 200 == 0:
                print('  ... %d/%d' % (i, len(todo)))
    print('图片完成 ok=%d bad=%d' % (iok, ibad))


if __name__ == '__main__':
    main()
