# -*- coding: utf-8 -*-
"""生成『题型池』：把各卷题目按题型聚合，供专项练习跨卷抽题。

输出：dist/pools/<slug>.json     { type, slug, count, questions:[...] }
      dist/pools/index.json      { pools:[{slug,type,count}] }

说明：资料分析依赖「材料共用」，不适合单独抽题，专项池里排除；
      它通过套卷练习覆盖（材料会一起带出）。
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
PDIR = os.path.join(DIST, 'papers')
OUT = os.path.join(DIST, 'pools')
BASE = 'https://hhxpoint.me/couple-api/files/exam'

# 题型 → slug（只保留「值得单独练」的题型；常识/政治按模块整体归并）
SLUG = {
    '图形推理': 'tuxing',
    '定义判断': 'dingyi',
    '类比推理': 'leibi',
    '逻辑判断': 'luoji',
    '逻辑填空': 'luojitiankong',
    '片段阅读': 'pianduan',
    '语句表达': 'yuju',
    '数学运算': 'shuxue',
    '数字推理': 'shuzi',
}

# 按模块整体归并（该模块下所有细分题型合成一个池）
SECTION_POOL = {
    'cs': ('changshi', '常识判断'),
    'zzll': ('zhengzhi', '政治理论'),
}

# 资料分析（综合/增长/比重/平均数/倍数…）统一归到「资料分析」，不进池
ZL_TYPES = {'综合', '增长', '比重', '平均数', '倍数', '同比', '环比'}


def slug_of(t, section):
    if t in SLUG:
        return SLUG[t], t
    if section in SECTION_POOL:
        return SECTION_POOL[section]
    return 'x-' + re.sub(r'[^\w]+', '', t)[:12], t


def expand(blocks, key):
    out = []
    for b in blocks or []:
        parts = []
        for p in b.get('parts') or []:
            if p.get('img'):
                name = re.sub(r'\.\w+$', '.webp', p['img'])
                parts.append({'src': '%s/img/%s/%s' % (BASE, key, name),
                              'w': p.get('w', 0), 'h': p.get('h', 0), 'tex': bool(p.get('tex'))})
            else:
                parts.append({'t': p.get('t', '')})
        if parts:
            out.append({'parts': parts})
    return out


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(OUT, exist_ok=True)
    pools = {}

    for fn in sorted(os.listdir(PDIR)):
        if not fn.endswith('.json'):
            continue
        paper = json.load(open(os.path.join(PDIR, fn), encoding='utf-8'))
        key = paper['key']
        for q in paper.get('questions', []):
            t = q.get('type') or ''
            if q.get('section') == 'zl' or t in ZL_TYPES:
                continue
            s, label = slug_of(t, q.get('section'))
            pools.setdefault(s, {'slug': s, 'type': label, 'questions': []})
            pools[s]['questions'].append({
                'id': key + ':' + q['id'],
                'qid': q['qid'],
                'paper': key,
                'section': q.get('section'),
                'type': t,
                'stem': expand(q.get('stem'), key),
                'options': [{'key': o['key'], 'blocks': expand(o.get('blocks'), key)} for o in q.get('options', [])],
                'answer': q.get('answer'),
                'analysis': expand(q.get('analysis'), key),
            })

    index = []
    for s, pool in sorted(pools.items(), key=lambda kv: -len(kv[1]['questions'])):
        pool['count'] = len(pool['questions'])
        json.dump(pool, open(os.path.join(OUT, s + '.json'), 'w', encoding='utf-8'),
                  ensure_ascii=False, separators=(',', ':'))
        index.append({'slug': s, 'type': pool['type'], 'count': pool['count']})
        print('  %-16s %-8s %4d 题' % (pool['type'], s, pool['count']))

    json.dump({'pools': index}, open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    total = sum(p['count'] for p in index)
    print('\n题型池 %d 类，共 %d 题' % (len(index), total))


if __name__ == '__main__':
    main()
