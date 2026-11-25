# -*- coding: utf-8 -*-
"""用 gh api 补下缺失的模块 md（raw 被限流时的可靠通道）。"""
import base64
import concurrent.futures as cf
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


def slug(name):
    return re.sub(r'[^\w\u4e00-\u9fa5]+', '-', name)[:60]


def gh_content(path):
    out = subprocess.run(['gh', 'api', 'repos/%s/contents/%s' % (REPO, urllib.parse.quote(path)),
                          '--jq', '.content'], capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        return None
    return base64.b64decode(out.stdout.strip().replace('\n', '')).decode('utf-8', 'replace')


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    lst = os.path.join(CACHE, 'papers_sk.txt')
    papers = [x.strip() for x in open(lst, encoding='utf-8') if x.strip()]
    jobs = []
    for name in papers:
        d = os.path.join(CACHE, slug(name))
        os.makedirs(d, exist_ok=True)
        for mod in MODULES:
            local = os.path.join(d, mod.split('-', 1)[1] + '.md')
            if os.path.exists(local) and os.path.getsize(local) > 200:
                continue
            jobs.append((mod + '/' + name + '.md', local))
    print('待补 md: %d' % len(jobs))

    def one(job):
        rel, local = job
        txt = gh_content(rel)
        if not txt:
            return False, local
        with open(local, 'w', encoding='utf-8') as f:
            f.write(txt)
        return True, local

    ok = bad = 0
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        for fine, local in ex.map(one, jobs):
            if fine:
                ok += 1
            else:
                bad += 1
                print('  [miss] ' + os.path.basename(os.path.dirname(local)) + ' / ' + os.path.basename(local))
    print('补齐 ok=%d bad=%d' % (ok, bad))


if __name__ == '__main__':
    main()
