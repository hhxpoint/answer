# -*- coding: utf-8 -*-
"""生成题库索引 dist/index.json（客户端拉这个决定显示哪些卷）。"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
PDIR = os.path.join(DIST, 'papers')

SHORT = {
    'fsx': '副省级',
    'dsx': '地市级',
    'zf': '行政执法',
}


def short_name(title, key):
    year = ''
    import re
    m = re.search(r'(20\d{2})', title)
    if m:
        year = m.group(1)
    for suf, label in SHORT.items():
        if key.endswith('-' + suf):
            return ('%s %s' % (year, label)).strip()
    return title


def main():
    papers = []
    for fn in sorted(os.listdir(PDIR)):
        if not fn.endswith('.json'):
            continue
        p = json.load(open(os.path.join(PDIR, fn), encoding='utf-8'))
        papers.append({
            'key': p['key'],
            'title': p['title'],
            'shortName': short_name(p['title'], p['key']),
            'year': p.get('year', ''),
            'examType': p.get('examType', ''),
            'province': p.get('province', ''),
            'questionCount': p.get('questionCount', 0),
            'imageCount': p.get('imageCount', 0),
        })

    papers.sort(key=lambda x: (str(x['year']), x['key']), reverse=True)
    idx = {
        'version': 1,
        'updatedAt': '2026-11-25',
        'paperCount': len(papers),
        'questionTotal': sum(x['questionCount'] for x in papers),
        'papers': papers,
    }
    out = os.path.join(DIST, 'index.json')
    json.dump(idx, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('index -> %s  卷=%d 题=%d' % (out, idx['paperCount'], idx['questionTotal']))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
