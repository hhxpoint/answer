# -*- coding: utf-8 -*-
"""通过 api.github.com（带 token）下载图片。

背景：raw.githubusercontent.com 在本机被限速/干扰，逐张 20s 级超时；
api.github.com 稳定可用（gh 命令一直正常），认证额度 5000 次/小时，足够 2355 张。
"""
import concurrent.futures as cf
import json
import os
import re
import subprocess
import sys
import base64
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
IMG = os.path.join(CACHE, '_img')
REPO = 'ERRRC/xingcezhenti'
WORKERS = int(os.environ.get('EXAM_API_WORKERS', '10'))

IMG_REF = re.compile(r'src="([^"]+)"')


def token():
    out = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
    return out.stdout.strip()


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
    tok = token()
    if not tok:
        raise SystemExit('gh 未登录')

    need = collect()
    missing = [r for r in need
               if not (os.path.exists(os.path.join(IMG, os.path.basename(r)))
                       and os.path.getsize(os.path.join(IMG, os.path.basename(r))) > 100)]
    print('引用 %d，已有 %d，待下 %d' % (len(need), len(need) - len(missing), len(missing)))
    if not missing:
        return

    def one(rel):
        url = 'https://api.github.com/repos/%s/contents/%s' % (REPO, urllib.parse.quote(rel))
        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={
                    'Authorization': 'Bearer ' + tok,
                    'Accept': 'application/vnd.github+json',
                    'User-Agent': 'exam-pipeline'
                })
                with urllib.request.urlopen(req, timeout=20) as r:
                    data = json.loads(r.read().decode('utf-8'))
                content = base64.b64decode(data['content'])
                with open(os.path.join(IMG, os.path.basename(rel)), 'wb') as f:
                    f.write(content)
                return True, rel, len(content)
            except Exception as e:  # noqa: BLE001
                if attempt == 2:
                    return False, rel, str(e)[:80]
                time.sleep(0.8 * (attempt + 1))
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
            if i % 200 == 0:
                rate = i / max(0.1, time.time() - t0)
                print('  ... %d/%d  %.1f 张/秒  余约 %.0f 秒' % (i, len(missing), rate, (len(missing) - i) / max(0.01, rate)))

    dur = time.time() - t0
    print('完成 ok=%d bad=%d 用时 %.0fs' % (ok, bad, dur))


if __name__ == '__main__':
    main()
