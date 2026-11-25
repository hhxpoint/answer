# -*- coding: utf-8 -*-
"""题库内容审计：答案 / 解析 / 选项 / 题干 / 图文绑定 的完整性与异常。"""
import json
import os
import re
import sys
from collections import Counter, defaultdict

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DIST = r'D:\dsh\workplace\work\exam-pipeline\dist'
PDIR = os.path.join(DIST, 'papers')


def text_of(blocks):
    out = []
    for b in blocks or []:
        for p in b.get('parts') or []:
            if p.get('t'):
                out.append(p['t'])
    return ''.join(out).strip()


def imgs_of(blocks):
    n = 0
    for b in blocks or []:
        for p in b.get('parts') or []:
            if p.get('img'):
                n += 1
    return n


def main():
    files = sorted(f for f in os.listdir(PDIR) if f.endswith('.json'))
    total = 0
    no_answer = []
    no_analysis = []
    analysis_img_only = []
    analysis_short = []
    empty_stem = []
    short_stem = []
    empty_opt = []
    dup_opt = []
    fig_no_img = []
    zl_no_mat = []
    opt_counts = Counter()
    type_counts = Counter()
    ana_len = []
    per_paper = []

    for fn in files:
        p = json.load(open(os.path.join(PDIR, fn), encoding='utf-8'))
        key = p['key']
        qs = p.get('questions') or []
        n_no_ana = 0
        for q in qs:
            total += 1
            type_counts[q.get('type')] += 1
            opt_counts[len(q.get('options') or [])] += 1

            ans = q.get('answer')
            keys = [o['key'] for o in q.get('options') or []]
            if ans not in keys:
                no_answer.append((key, q['id'], ans, keys))

            stem = text_of(q.get('stem'))
            if not stem and imgs_of(q.get('stem')) == 0:
                empty_stem.append((key, q['id']))
            elif len(stem) < 8 and imgs_of(q.get('stem')) == 0:
                short_stem.append((key, q['id'], stem))

            opts = q.get('options') or []
            seen = {}
            for o in opts:
                t = text_of(o.get('blocks'))
                if not t and imgs_of(o.get('blocks')) == 0:
                    empty_opt.append((key, q['id'], o['key']))
                # 判重必须带图片：公式图不同则选项不同
                full = t + ''.join('#' + p['img'] for b in o.get('blocks') or []
                                    for p in b.get('parts') or [] if p.get('img'))
                if t or '#' in full:
                    seen[full] = seen.get(full, 0) + 1
            for t, c in seen.items():
                if c > 1:
                    dup_opt.append((key, q['id'], t[:16], c))

            ana = text_of(q.get('analysis'))
            ana_len.append(len(ana))
            if ana:
                if len(ana) < 12 and imgs_of(q.get('analysis')) == 0:
                    analysis_short.append((key, q['id'], ana))
            elif imgs_of(q.get('analysis')) > 0:
                analysis_img_only.append((key, q['id']))
            else:
                no_analysis.append((key, q['id'], q.get('type')))
                n_no_ana += 1

            if q.get('type') == '图形推理' and imgs_of(q.get('stem')) == 0:
                fig_no_img.append((key, q['id']))
            if q.get('section') == 'zl' and not q.get('material'):
                zl_no_mat.append((key, q['id']))

        per_paper.append((key, len(qs), n_no_ana))

    print('== 规模 ==')
    print('卷 %d · 题 %d' % (len(files), total))
    print()
    print('== 答案 ==')
    print('答案不在选项内: %d' % len(no_answer))
    for x in no_answer[:5]:
        print('   ', x)
    print()
    print('== 解析 ==')
    with_ana = total - len(no_analysis) - len(analysis_img_only)
    print('有文字解析: %d (%.1f%%)' % (with_ana, with_ana * 100.0 / max(1, total)))
    print('仅图片解析: %d' % len(analysis_img_only))
    print('无解析:     %d' % len(no_analysis))
    print('解析过短(<12字): %d' % len(analysis_short))
    if no_analysis:
        by_type = Counter(t for _, _, t in no_analysis)
        print('   无解析按题型:', by_type.most_common(8))
        by_paper = Counter(k for k, _, _ in no_analysis)
        print('   无解析按卷:', by_paper.most_common(8))
    lens = sorted(ana_len)
    print('解析字数: 中位 %d / 均值 %d / 最短 %d' %
          (lens[len(lens) // 2], sum(lens) // max(1, len(lens)), lens[0]))
    print()
    print('== 题干 / 选项 ==')
    print('空题干: %d   过短题干: %d' % (len(empty_stem), len(short_stem)))
    for x in short_stem[:5]:
        print('   ', x)
    print('空选项: %d   同题重复选项: %d' % (len(empty_opt), len(dup_opt)))
    for x in empty_opt[:5]:
        print('   ', x)
    for x in dup_opt[:5]:
        print('   ', x)
    print('选项数分布:', dict(opt_counts))
    print()
    print('== 图文绑定 ==')
    print('图推无图: %d   资料分析无材料: %d' % (len(fig_no_img), len(zl_no_mat)))
    for x in fig_no_img[:5]:
        print('   ', x)
    print()
    print('== 题型分布（前 12）==')
    for t, c in type_counts.most_common(12):
        print('   %-8s %d' % (t, c))
    print()
    print('== 每卷无解析数 ==')
    for key, n, bad in sorted(per_paper, key=lambda x: -x[2])[:10]:
        print('   %-12s 题 %4d  无解析 %d' % (key, n, bad))

    problems = (len(no_answer) + len(empty_stem) + len(empty_opt) +
                len(fig_no_img) + len(zl_no_mat))
    print()
    print('硬缺陷合计: %d' % problems)
    print('AUDIT_OK' if problems == 0 else 'AUDIT_FAILED')


if __name__ == '__main__':
    main()
