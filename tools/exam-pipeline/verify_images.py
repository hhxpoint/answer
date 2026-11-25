# -*- coding: utf-8 -*-
"""上线前校验：每张被引用的图片都必须存在、可解码、且不是空白。

空白判据用像素极差（max-min < 8 视为整幅近同色），与文件大小无关，
这样 5×18 的公式逗号图不会被误杀，真正的空白图也跑不掉。
"""
import json
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
PDIR = os.path.join(DIST, 'papers')
IDIR = os.path.join(DIST, 'img')

MAX_SIDE = 4000


def walk(node, out):
    if isinstance(node, dict):
        if node.get('img'):
            out.add(node['img'])
        for v in node.values():
            walk(v, out)
    elif isinstance(node, list):
        for v in node:
            walk(v, out)


def is_blank(path):
    im = Image.open(path).convert('L')
    lo, hi = im.getextrema()
    return (hi - lo) < 8


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    total_ref = total_ok = 0
    missing, blank, bad = [], [], []

    for fn in sorted(os.listdir(PDIR)):
        if not fn.endswith('.json'):
            continue
        paper = json.load(open(os.path.join(PDIR, fn), encoding='utf-8'))
        key = paper['key']
        refs = set()
        walk(paper.get('questions'), refs)
        walk(paper.get('materials'), refs)
        total_ref += len(refs)
        ok = 0
        for name in refs:
            webp = os.path.join(IDIR, key, os.path.splitext(name)[0] + '.webp')
            if not os.path.exists(webp):
                missing.append('%s/%s' % (key, name))
                continue
            try:
                im = Image.open(webp)
                w, h = im.size
                if w > MAX_SIDE or h > MAX_SIDE:
                    bad.append('%s/%s (%dx%d 过大)' % (key, name, w, h))
                    continue
                if is_blank(webp):
                    blank.append('%s/%s (%dx%d)' % (key, name, w, h))
                    continue
            except Exception:  # noqa: BLE001
                bad.append('%s/%s' % (key, name))
                continue
            ok += 1
        total_ok += ok
        print('  %-12s 引用 %4d  ok %4d  异常 %d' % (key, len(refs), ok, len(refs) - ok))

    print('\n图片引用合计 %d，可用 %d，缺失 %d，空白 %d，损坏 %d'
          % (total_ref, total_ok, len(missing), len(blank), len(bad)))
    for label, arr in (('MISSING', missing), ('BLANK', blank), ('BAD', bad)):
        for x in arr[:8]:
            print('  [%s] %s' % (label, x))
    if missing or blank or bad:
        sys.exit(1)
    print('IMAGES_OK')


if __name__ == '__main__':
    main()
