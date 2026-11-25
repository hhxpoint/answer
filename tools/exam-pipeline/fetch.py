# -*- coding: utf-8 -*-
"""公考题库数据管线 · 抓取层

从 GitHub 公开题库仓库抓取指定试卷的 6 个模块 md 及其引用的图片。

用法：
    python fetch.py --paper "2025年国家公务员录用考试《行测》题（副省级网友回忆版）"
    python fetch.py --list papers.txt      # 每行一个卷名（不含扩展名）
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

REPO = 'ERRRC/xingcezhenti'
REF = 'HEAD'
RAW = 'https://raw.githubusercontent.com/%s/%s/' % (REPO, REF)
API = 'https://api.github.com/repos/%s/contents/' % REPO

MODULES = [
    '01-政治理论',
    '02-常识判断',
    '03-言语理解与表达',
    '04-数量关系',
    '05-判断推理',
    '06-资料分析',
]

IMG_DIR = '90-图片'
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')

UA = {'User-Agent': 'exam-bank-pipeline/1.0'}


def get(url, binary=False, retry=3):
    last = None
    for i in range(retry):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            return data if binary else data.decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.2 * (i + 1))
    raise RuntimeError('GET failed %s -> %s' % (url, last))


def raw_url(path):
    return RAW + urllib.parse.quote(path)


def fetch_paper(basename, out_dir):
    """抓一卷（6 模块）的 md，返回本地文件路径列表"""
    os.makedirs(out_dir, exist_ok=True)
    got = []
    for mod in MODULES:
        remote = '%s/%s.md' % (mod, basename)
        local = os.path.join(out_dir, mod.split('-', 1)[1] + '.md')
        if os.path.exists(local) and os.path.getsize(local) > 200:
            got.append(local)
            continue
        try:
            text = get(raw_url(remote))
        except Exception as e:  # noqa: BLE001
            print('  [skip] %s (%s)' % (remote, e))
            continue
        # 保留 front-matter 里的原始路径信息，便于溯源
        with open(local, 'w', encoding='utf-8') as f:
            f.write(text)
        got.append(local)
        print('  [ok] %-22s %6d bytes' % (mod, len(text)))
    return got


IMG_REF = re.compile(r'src="([^"]+)"')


def collect_images(md_files):
    """从 md 里收集图片相对路径"""
    refs = []
    for p in md_files:
        with open(p, encoding='utf-8') as f:
            for m in IMG_REF.findall(f.read()):
                refs.append(m)
    uniq = []
    seen = set()
    for r in refs:
        # ../90-图片/题目图/xxx.png -> 90-图片/题目图/xxx.png
        norm = r.replace('../', '').strip()
        if norm not in seen:
            seen.add(norm)
            uniq.append(norm)
    return uniq


def fetch_images(paths, img_dir):
    os.makedirs(img_dir, exist_ok=True)
    ok = bad = skip = 0
    for i, rel in enumerate(paths, 1):
        local = os.path.join(img_dir, os.path.basename(rel))
        if os.path.exists(local) and os.path.getsize(local) > 100:
            skip += 1
            continue
        try:
            data = get(raw_url(rel), binary=True)
            with open(local, 'wb') as f:
                f.write(data)
            ok += 1
        except Exception:  # noqa: BLE001
            bad += 1
            print('  [miss] %s' % rel)
        if i % 20 == 0:
            print('  ... %d/%d' % (i, len(paths)))
    return {'ok': ok, 'skip': skip, 'bad': bad}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--paper', help='卷名（不含 .md）')
    ap.add_argument('--list', help='卷名清单文件')
    ap.add_argument('--key', help='输出目录名（默认按卷名 slug）')
    args = ap.parse_args()

    names = []
    if args.paper:
        names = [args.paper]
    elif args.list:
        with open(args.list, encoding='utf-8') as f:
            names = [ln.strip() for ln in f if ln.strip() and not ln.startswith('#')]
    else:
        ap.error('需要 --paper 或 --list')

    for name in names:
        key = args.key or re.sub(r'[^\w\u4e00-\u9fa5]+', '-', name)[:60]
        out_dir = os.path.join(CACHE, key)
        print('== %s' % name)
        mds = fetch_paper(name, out_dir)
        if not mds:
            print('  [fail] 没有抓到任何模块')
            continue
        imgs = collect_images(mds)
        print('  图片引用 %d 个' % len(imgs))
        stat = fetch_images(imgs, os.path.join(HERE, 'cache', '_img'))
        print('  图片: ok=%d skip=%d miss=%d' % (stat['ok'], stat['skip'], stat['bad']))
        with open(os.path.join(out_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
            json.dump({'paper': name, 'key': key, 'md': [os.path.basename(x) for x in mds],
                       'images': imgs, 'image_stat': stat}, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
