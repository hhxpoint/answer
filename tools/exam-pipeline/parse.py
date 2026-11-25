# -*- coding: utf-8 -*-
"""公考题库数据管线 · 解析层

md（每卷 6 个模块）→ 结构化 JSON。

要点：
  · 两种结构：`## 第 N 题`（独立题）与 `## 材料 N` + `### 第 N 题`（资料分析，材料共用）
  · 内容按「段落 / 行内图片」保序切分，图片转成文件名引用，便于客户端渲染
  · 答案取自 ✓ 标记或 `**答案**：X`，两者不一致时标 needsReview

用法：
    python parse.py --paper <卷目录名> [--out dist]
"""
import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')

SECTIONS = {
    '政治理论': 'zzll',
    '常识判断': 'cs',
    '言语理解与表达': 'yy',
    '数量关系': 'sl',
    '判断推理': 'pd',
    '资料分析': 'zl',
}

QUESTION_HEAD = re.compile(r'^(#{2,3})\s*第\s*(\d+)\s*题\s*<sub>qid\s*(\d+)\s*·\s*([^<]+?)</sub>\s*$', re.M)
MATERIAL_HEAD = re.compile(r'^##\s*材料\s*(\d+)\s*$', re.M)
OPTION_LINE = re.compile(r'^-\s*\*\*([A-D])\*\*\.\s*(.*)$', re.M)
IMG_TAG = re.compile(r'<img\b([^>]*?)/?>')
FRONT = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.S)


def parse_front(text):
    m = FRONT.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip().strip('"').strip("'")
    return meta, text[m.end():]


def img_attrs(attr_text):
    src = re.search(r'src="([^"]+)"', attr_text)
    w = re.search(r'width="(\d+)', attr_text)
    h = re.search(r'height="(\d+)', attr_text)
    flag = re.search(r'flag="([^"]*)"', attr_text)
    if not src:
        return None
    name = os.path.basename(src.group(1))
    return {
        'img': name,
        'w': int(w.group(1)) if w else 0,
        'h': int(h.group(1)) if h else 0,
        'tex': (flag.group(1) == 'tex') if flag else False,
    }


def html_to_blocks(raw):
    """把一段 HTML/文本 转成 [{parts:[{t:'文字'} | {img, w, h, tex}]}]，保持顺序"""
    raw = raw.strip()
    if not raw:
        return []

    # 统一换行：把 <p> 当作段落分隔
    segments = re.split(r'</p>\s*', raw)
    blocks = []
    for seg in segments:
        seg = seg.strip()
        if not seg:
            continue
        seg = re.sub(r'^<p[^>]*>', '', seg)
        # 段落内可能有多张图
        parts = []
        pos = 0
        for m in IMG_TAG.finditer(seg):
            before = seg[pos:m.start()]
            before = re.sub(r'<[^>]+>', '', before)
            if before.strip():
                parts.append({'t': unescape(before)})
            info = img_attrs(m.group(1))
            if info:
                parts.append(info)
            pos = m.end()
        tail = seg[pos:]
        tail = re.sub(r'<[^>]+>', '', tail)
        if tail.strip():
            parts.append({'t': unescape(tail)})
        if parts:
            blocks.append({'parts': parts})
    return blocks


def unescape(s):
    return (s.replace('&nbsp;', ' ')
             .replace('&amp;', '&')
             .replace('&lt;', '<')
             .replace('&gt;', '>')
             .replace('&quot;', '"')
             .replace('\u3000', ' ')
             .strip())


def split_question(body):
    """题干/选项/答案/解析 切分"""
    answer = ''
    m = re.search(r'\*\*答案\*\*[：:]\s*([A-D])', body)
    if m:
        answer = m.group(1)

    parts = re.split(r'\*\*答案\*\*[：:]\s*[A-D]\s*', body, maxsplit=1)
    head = parts[0]
    tail = parts[1] if len(parts) > 1 else ''

    # 解析：去掉「官方解析」标题
    tail = re.sub(r'^\s*\*\*官方解析\*\*\s*', '', tail)

    # 选项
    opts = []
    first_opt = None
    for m2 in OPTION_LINE.finditer(head):
        if first_opt is None:
            first_opt = m2.start()
        text = m2.group(2).replace('✅', '').strip()
        opts.append({
            'key': m2.group(1),
            'blocks': html_to_blocks(text),
            'marked': '✅' in m2.group(2),
        })

    stem_end = first_opt if first_opt is not None else len(head)
    stem_raw = head[:stem_end]
    return {
        'stem': html_to_blocks(stem_raw),
        'options': opts,
        'answer': answer,
        'analysis': html_to_blocks(tail),
    }



JUDGE_HINT = re.compile(r'（\s*）\s*$')


def clean_option_artifact(blocks):
    """源数据判断题会留下「- （选项）[]」占位，清掉"""
    out = []
    for b in blocks or []:
        parts = []
        for p in b.get('parts') or []:
            if p.get('t'):
                t = re.sub(r'\s*-\s*（选项）\s*\[\]\s*', '', p['t'])
                t = re.sub(r'\n{3,}', '\n\n', t).strip()
                if t:
                    parts.append({'t': t})
            else:
                parts.append(p)
        if parts:
            out.append({'parts': parts})
    return out


def fix_judgement(q):
    """判断题：源数据无选项、答案为 A/B，题干以括号结尾 → 合成为 正确 / 错误"""
    q['stem'] = clean_option_artifact(q.get('stem'))
    if q.get('options'):
        return q
    if q.get('answer') not in ('A', 'B'):
        return q
    stem_text = ''.join(p.get('t', '') for b in q['stem'] for p in b.get('parts') or [])
    if not JUDGE_HINT.search(stem_text) and '（    ）' not in stem_text:
        return q
    q['options'] = [
        {'key': 'A', 'blocks': [{'parts': [{'t': '正确'}]}], 'marked': q['answer'] == 'A'},
        {'key': 'B', 'blocks': [{'parts': [{'t': '错误'}]}], 'marked': q['answer'] == 'B'},
    ]
    q['type'] = '判断题'
    q['synthesized'] = 'judgement'
    return q

def fix_type(q):
    """源数据偶有题型标错：无图但选项是「A：B」词项的「图形推理」其实是类比推理。"""
    if q.get('type') != '图形推理':
        return q
    has_img = any('img' in p for b in q.get('stem') or [] for p in b.get('parts') or [])
    if has_img:
        return q
    texts = []
    for o in q.get('options') or []:
        for b in o.get('blocks') or []:
            for p in b.get('parts') or []:
                if p.get('t'):
                    texts.append(p['t'])
    joined = ' '.join(texts)
    if ('：' in joined) or (':' in joined):
        q['type'] = '类比推理'
        q['typeFixed'] = 'figure_to_analogy'
    return q


def parse_module(path, section_code):
    text = open(path, encoding='utf-8').read()
    meta, body = parse_front(text)

    # 收集材料块的位置
    mats = [(m.start(), int(m.group(1))) for m in MATERIAL_HEAD.finditer(body)]
    questions = []
    heads = list(QUESTION_HEAD.finditer(body))

    for i, m in enumerate(heads):
        seq = int(m.group(2))
        qid = m.group(3)
        qtype = m.group(4).strip()
        start = m.end()
        end = heads[i + 1].start() if i + 1 < len(heads) else len(body)
        # 到下一个材料标题也截止
        for pos, _n in mats:
            if start < pos < end:
                end = pos
                break
        chunk = body[start:end]
        chunk = chunk.split('\n---')[0]

        # 属于哪个材料
        material = None
        for pos, n in mats:
            if pos < m.start():
                material = n
        if m.group(1) == '###':
            material = material or 1

        parsed = split_question(chunk)
        parsed.update({
            'id': 'q' + qid,
            'qid': qid,
            'seq': seq,
            'section': section_code,
            'type': qtype,
            'material': material,
        })
        fix_judgement(parsed)
        fix_type(parsed)
        questions.append(parsed)

    # 材料正文（材料标题到其下第一题之间）
    materials = {}
    for pos, n in mats:
        nxt = len(body)
        for m2 in heads:
            if m2.start() > pos:
                nxt = m2.start()
                break
        seg = body[pos:nxt]
        seg = seg.split('\n', 1)[1] if '\n' in seg else ''
        seg = seg.split('\n---')[0]
        materials[n] = html_to_blocks(seg)

    return meta, questions, materials



PROV_CODE = {
    '北京': 'bj', '上海': 'sh', '天津': 'tj', '重庆': 'cq', '河北': 'heb', '山西': 'sx',
    '辽宁': 'ln', '吉林': 'jl', '黑龙江': 'hlj', '江苏': 'js', '浙江': 'zj', '安徽': 'ah',
    '福建': 'fj', '江西': 'jx', '山东': 'sd', '河南': 'hn', '湖北': 'hb', '湖南': 'hun',
    '广东': 'gd', '广西': 'gx', '海南': 'hai', '四川': 'sc', '贵州': 'gz', '云南': 'yn',
    '陕西': 'sn', '甘肃': 'gs', '青海': 'qh', '宁夏': 'nx', '新疆': 'xj',
    '内蒙古': 'nmg', '西藏': 'xz', '深圳': 'sz',
}


def province_key(name):
    """省考卷：省份 + 类别 → 稳定短键"""
    prov = None
    for p, code in PROV_CODE.items():
        if p in name:
            prov = code
            break
    if not prov:
        return None
    cls = ''
    m = re.search(r'（([ABC])类）', name)
    if m:
        cls = '-' + m.group(1).lower()
    elif '乡镇' in name:
        cls = '-xz'
    elif '县级' in name:
        cls = '-xj'
    elif '省市' in name:
        cls = '-ss'
    elif '执法' in name:
        cls = '-zf'
    return prov + cls

def paper_key(name, year):
    if '副省级' in name:
        suffix = 'fsx'
    elif '地市级' in name:
        suffix = 'dsx'
    elif '行政执法' in name:
        suffix = 'zf'
    else:
        suffix = re.sub(r'[^\w]+', '', name)[-8:]
    if '国家公务员' in name:
        return 'gk%s-%s' % (year, suffix)
    if '联考' in name:
        pk = province_key(name)
        return 'lk%s-%s' % (year, pk or suffix)
    pk = province_key(name)
    return 'sk%s-%s' % (year, pk or suffix)


def validate(q):
    """自动校验：返回 needsReview 原因列表"""
    bad = []
    if not q['stem']:
        bad.append('empty_stem')
    if len(q['options']) != (2 if q.get('synthesized') == 'judgement' else 4):
        bad.append('options_%d' % len(q['options']))
    if q['answer'] not in ('A', 'B', 'C', 'D'):
        bad.append('no_answer')
    else:
        keys = [o['key'] for o in q['options']]
        if q['answer'] not in keys:
            bad.append('answer_not_in_options')
        marked = [o['key'] for o in q['options'] if o.get('marked')]
        if marked and q['answer'] not in marked:
            bad.append('answer_conflict')
    has_img = any('img' in p for b in q['stem'] for p in b['parts'])
    if q['type'] == '图形推理' and not has_img:
        bad.append('figure_no_image')
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--paper', required=True, help='cache 下的卷目录名')
    ap.add_argument('--out', default=os.path.join(HERE, 'dist'))
    args = ap.parse_args()

    src = os.path.join(CACHE, args.paper)
    if not os.path.isdir(src):
        raise SystemExit('目录不存在: ' + src)

    all_q = []
    materials = {}
    meta0 = {}
    for fn in sorted(os.listdir(src)):
        if not fn.endswith('.md'):
            continue
        mod = fn[:-3]
        code = SECTIONS.get(mod)
        if not code:
            print('  [skip] 未知模块 %s' % mod)
            continue
        meta, qs, mats = parse_module(os.path.join(src, fn), code)
        meta0 = meta0 or meta
        all_q.extend(qs)
        if mats:
            materials[code] = mats
        print('  %-10s 题数=%-4d 材料=%d' % (mod, len(qs), len(mats)))

    all_q.sort(key=lambda x: (x['section'], x['seq']))

    year = meta0.get('年份', '')
    name = meta0.get('试卷', args.paper)
    key = paper_key(name, year)
    exam_type = 'guokao' if '国家公务员' in name else ('liankao' if '联考' in name else 'shengkao')

    total = len(all_q)
    review = []
    for q in all_q:
        bad = validate(q)
        q['needsReview'] = bad
        if bad:
            review.append((q['id'], bad))

    out = os.path.join(args.out, 'papers')
    os.makedirs(out, exist_ok=True)
    paper = {
        'key': key,
        'title': name,
        'examType': exam_type,
        'year': year,
        'province': meta0.get('地区', ''),
        'modules': meta0.get('模块', ''),
        'questionCount': total,
        'materials': materials,
        'questions': all_q,
        'source': meta0.get('来源', ''),
    }
    with open(os.path.join(out, key + '.json'), 'w', encoding='utf-8') as f:
        json.dump(paper, f, ensure_ascii=False, separators=(',', ':'))

    print('\n== %s' % name)
    print('   key=%s  题数=%d  待复核=%d' % (key, total, len(review)))
    if review:
        for qid, bad in review[:10]:
            print('   [review] %s %s' % (qid, ','.join(bad)))
    print('   输出: %s' % os.path.join(out, key + '.json'))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
