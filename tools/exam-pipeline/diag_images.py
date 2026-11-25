# -*- coding: utf-8 -*-
"""图片下载诊断：跑一批，打印成功/失败与速率。"""
import concurrent.futures as cf
import json
import os
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
IMG = os.path.join(CACHE, '_img')
RAW = 'https://raw.githubusercontent.com/ERRRC/xingcezhenti/HEAD/'
UA = {'User-Agent': 'exam-bank-pipeline/1.0'}


def collect():
    need = set()
    for d in os.listdir(CACHE):
        p = os.path.join(CACHE, d)
        if not os.path.isdir(p) or d.startswith('_'):
            continue
        for fn in os.listdir(p):
            if fn.endswith('.md'):
                txt = open(os.path.join(p, fn), encoding='utf-8').read()
                import re
                for r in re.findall(r'src="([^"]+)"', txt):
                    need.add(r.replace('../', '').strip())
    return need


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    need = collect()
    missing = [r for r in need if not (os.path.exists(os.path.join(IMG, os.path.basename(r)))
                                       and os.path.getsize(os.path.join(IMG, os.path.basename(r))) > 100)]
    print('引用 %d，缺失 %d' % (len(need), len(missing)))
    batch = missing[:60]
    workers = 8

    def one(rel):
        t0 = time.time()
        try:
            req = urllib.request.Request(RAW + urllib.parse.quote(rel), headers=UA)
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
            with open(os.path.join(IMG, os.path.basename(rel)), 'wb') as f:
                f.write(data)
            return True, time.time() - t0, len(data)
        except Exception as e:  # noqa: BLE001
            return False, time.time() - t0, str(e)[:60]

    t0 = time.time()
    ok = bad = 0
    times = []
    with cf.ThreadPoolExecutor(max_workers=workers) as ex:
        for fine, dt, info in ex.map(one, batch):
            times.append(dt)
            if fine:
                ok += 1
            else:
                bad += 1
                print('  FAIL %.1fs %s' % (dt, info))
    dur = time.time() - t0
    avg = sum(times) / len(times) if times else 0
    print('\n批次 %d：ok=%d bad=%d 用时 %.1fs 平均 %.2fs 速率 %.1f 张/秒' %
          (len(batch), ok, bad, dur, avg, len(batch) / dur if dur else 0))
    print('剩余 %d 张，预计 %.1f 分钟' % (len(missing) - ok, (len(missing) - ok) / (len(batch) / dur if dur else 1) / 60))


if __name__ == '__main__':
    main()
