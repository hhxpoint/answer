# -*- coding: utf-8 -*-
"""公考题库数据管线 · 图片层

PNG → WebP（长边 ≤ 900，保留宽高比），落到 dist/img/<paperKey>/<name>.webp，
并把 JSON 里的 png 文件名改写为 webp。

用法：python build_images.py [--paper gk2025-fsx]
"""
import argparse
import json
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE_IMG = os.path.join(HERE, 'cache', '_img')
DIST = os.path.join(HERE, 'dist')
MAX_SIDE = 900
QUALITY = 86


def convert(src, dst):
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA', 'P'):
        bg = Image.new('RGB', im.size, (255, 255, 255))
        rgba = im.convert('RGBA')
        bg.paste(rgba, mask=rgba.split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    w, h = im.size
    scale = min(1.0, MAX_SIDE / float(max(w, h)))
    if scale < 1.0:
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=QUALITY, method=6)
    return os.path.getsize(dst)


def walk_imgs(node, out):
    """收集 JSON 里出现的所有图片文件名"""
    if isinstance(node, dict):
        if 'img' in node and isinstance(node['img'], str):
            out.add(node['img'])
        for v in node.values():
            walk_imgs(v, out)
    elif isinstance(node, list):
        for v in node:
            walk_imgs(v, out)


def rewrite(node):
    if isinstance(node, dict):
        if 'img' in node and isinstance(node['img'], str):
            node['img'] = re.sub(r'\.(png|jpe?g|gif|jfif|webp)$', '.webp', node['img'], flags=re.I)
        for v in node.values():
            rewrite(v)
    elif isinstance(node, list):
        for v in node:
            rewrite(v)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--paper', help='只处理某卷')
    args = ap.parse_args()

    pdir = os.path.join(DIST, 'papers')
    files = sorted(f for f in os.listdir(pdir) if f.endswith('.json'))
    if args.paper:
        files = [f for f in files if f.startswith(args.paper)]

    total_ok = total_miss = 0
    total_bytes = 0
    for fn in files:
        key = fn[:-5]
        path = os.path.join(pdir, fn)
        paper = json.load(open(path, encoding='utf-8'))

        names = set()
        walk_imgs(paper, names)
        ok = miss = 0
        size = 0
        for name in sorted(names):
            src = os.path.join(CACHE_IMG, name)
            if not os.path.exists(src):
                miss += 1
                continue
            dst = os.path.join(DIST, 'img', key, re.sub(r'\.\w+$', '.webp', name))
            if not os.path.exists(dst):
                try:
                    size += convert(src, dst)
                except Exception as e:  # noqa: BLE001
                    miss += 1
                    print('  [conv-fail] %s %s' % (name, e))
                    continue
            else:
                size += os.path.getsize(dst)
            ok += 1

        rewrite(paper)
        paper['imageCount'] = ok
        json.dump(paper, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        print('  %-12s 图片 ok=%-4d miss=%-3d %6.2f MB' % (key, ok, miss, size / 1048576))
        total_ok += ok
        total_miss += miss
        total_bytes += size

    print('\n合计: ok=%d miss=%d  %.2f MB' % (total_ok, total_miss, total_bytes / 1048576))
    if total_miss:
        print('!! 有缺失图片，相关题目会在校验中标记')
        sys.exit(0)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
