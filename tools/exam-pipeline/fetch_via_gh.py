# -*- coding: utf-8 -*-
"""用 gh CLI 并行下载图片（gh 自带 TLS，绕开本机证书链问题）。"""
import base64
import concurrent.futures as cf
import os
import re
import subprocess
import sys
import time
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
IMG = os.path.join(CACHE, '_img')
REPO = 'ERRRC/xingcezhenti'
WORKERS = int(os.environ.get('EXAM_GH_WORKERS', '8'))
IMG_REF = re.compile(r'src="([^"]+)"')


def collect():
    need = set()
    for d in os.listdir(CACHE):
        p = os.path.join(CACHE, d)
        if not os.path.isdir(p) or d.startswith('_'):
            continue
        for fn in os.listdir(p):
            if fn.endswith('.md'):
                for r in IMG_REF.findall(open(os.path.join(p, fn), encoding='utf-8').read()):
                    need.add(r.replace('../', '').strip())
    return need


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(IMG, exist_ok=True)
    need = collect()
    missing = [r for r in need
               if not (os.path.exists(os.path.join(IMG, os.path.basename(r)))
                       and os.path.getsize(os.path.join(IMG, os.path.basename(r))) > 100)]
    print('引用 %d，待下 %d' % (len(need), len(missing)))
    if not missing:
        return

    def one(rel):
        url = 'repos/%s/contents/%s' % (REPO, urllib.parse.quote(rel))
        for attempt in range(2):
            try:
                out = subprocess.run(['gh', 'api', url, '--jq', '.content'],
                                     capture_output=True, text=True, timeout=40)
                if out.returncode:
                    raise RuntimeError(out.stderr[:100])
                raw = out.stdout.strip().replace('\n', '')
                data = base64.b64decode(raw)
                with open(os.path.join(IMG, os.path.basename(rel)), 'wb') as f:
                    f.write(data)
                return True, rel, len(data)
            except Exception as e:  # noqa: BLE001
                if attempt == 1:
                    return False, rel, str(e)[:80]
                time.sleep(0.5)
        return False, rel, 'unreachable'

    t0 = time.time()
    ok = bad = 0
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for i, (fine, rel, info) in enumerate(ex.map(one, missing), 1):
            if fine:
                ok += 1
            else:
                bad += 1
                print('  [miss] %s %s' % (rel, info))
            if i % 100 == 0:
                rate = i / max(0.1, time.time() - t0)
                print('  ... %d/%d %.1f 张/秒 余约 %.0f 秒' % (i, len(missing), rate, (len(missing) - i) / max(0.01, rate)))
    print('完成 ok=%d bad=%d 用时 %.0fs' % (ok, bad, time.time() - t0))


if __name__ == '__main__':
    main()
