# -*- coding: utf-8 -*-
"""申论解析：Typst 题目册 → 结构化 JSON（材料 / 题目 / 参考要点）。

要点来源：题库不含参考答案，因此按**规则**从对应材料里抽取关键句作为参考要点
（信号词 + 题干关键词重合度排序），标注“机器提取，供自评参考”，不做任何生成式加工。
"""
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache', 'shenlun')
DIST = os.path.join(HERE, 'dist')
OUT = os.path.join(DIST, 'essay')

HEAD_MATERIAL = re.compile(r'^==\s*资料\s*(\d+)\s*$', re.M)
HEAD_QUESTION = re.compile(r'^===\s*(.+?)\s*$', re.M)
HEAD_ANSWER = re.compile(r'^=\s*作答要求\s*$', re.M)
HEAD_DATA = re.compile(r'^=\s*给定资料\s*$', re.M)

SIGNAL = ['问题', '原因', '对策', '建议', '措施', '应', '需', '要', '关键', '核心', '重点',
          '经验', '做法', '成效', '短板', '困境', '难题', '机制', '保障', '统筹', '协同']

TYPE_RULES = [
    ('文章写作', ['写一篇文章', '自拟题目', '文章']),
    ('贯彻执行', ['拟写', '文稿', '讲话稿', '宣传', '展板', '汇报', '倡议书', '短评', '编者按']),
    ('提出对策', ['提出', '建议', '对策', '措施']),
    ('综合分析', ['谈一谈', '理解', '分析', '认识', '看法', '评析']),
    ('归纳概括', ['概括', '梳理', '归纳', '总结', '指出']),
]


def clean(text):
    """去掉 Typst 的轻量标记。"""
    t = text
    t = re.sub(r'#\w+\([^)]*\)', '', t)
    t = t.replace('\\*', '*').replace('\\_', '_').replace('\\#', '#')
    t = re.sub(r'(?<!\*)\*{1,2}([^*]+)\*{1,2}', r'\1', t)
    return t.strip()


def split_sections(text):
    """返回 (materials{no: [para]}, questions_raw [(stem, [para])])"""
    body = text
    # 去掉文件头的 typst 配置
    i = HEAD_DATA.search(body)
    if i:
        body = body[i.start():]

    ans = HEAD_ANSWER.search(body)
    mat_part = body[:ans.start()] if ans else body
    q_part = body[ans.end():] if ans else ''

    materials = {}
    marks = list(HEAD_MATERIAL.finditer(mat_part))
    for idx, m in enumerate(marks):
        no = int(m.group(1))
        start = m.end()
        end = marks[idx + 1].start() if idx + 1 < len(marks) else len(mat_part)
        seg = mat_part[start:end]
        paras = [clean(p) for p in re.split(r'\n\s*\n', seg)]
        materials[no] = [p for p in paras if p]

    questions = []
    qmarks = list(HEAD_QUESTION.finditer(q_part))
    for idx, m in enumerate(qmarks):
        stem = clean(m.group(1))
        start = m.end()
        end = qmarks[idx + 1].start() if idx + 1 < len(qmarks) else len(q_part)
        seg = q_part[start:end]
        paras = [clean(p) for p in re.split(r'\n\s*\n', seg)]
        questions.append((stem, [p for p in paras if p]))
    return materials, questions


def parse_score(stem):
    m = re.search(r'[（(]\s*(\d+)\s*分\s*[)）]', stem)
    return int(m.group(1)) if m else 0


def parse_word_limit(stem, paras):
    blob = stem + ' ' + ' '.join(paras)
    m = re.search(r'(\d{3,4})\s*[—\-~至]\s*(\d{3,4})\s*字', blob)
    if m:
        return int(m.group(1)), int(m.group(2))
    m = re.search(r'不超过\s*(\d{3,4})\s*字', blob)
    if m:
        return 0, int(m.group(1))
    m = re.search(r'(\d{3,4})\s*字左右', blob)
    if m:
        n = int(m.group(1))
        return int(n * 0.9), int(n * 1.1)
    return 0, 0


def classify(stem):
    for name, keys in TYPE_RULES:
        for k in keys:
            if k in stem:
                return name
    return '归纳概括'


def material_refs(stem, total):
    """从题干里解析引用的资料序号"""
    refs = set()
    for m in re.finditer(r'给定资料\s*(\d+)\s*[-—~至]\s*(\d+)', stem):
        a, b = int(m.group(1)), int(m.group(2))
        refs.update(range(min(a, b), max(a, b) + 1))
    for m in re.finditer(r'资料\s*(\d+)\s*[-—~至]\s*(\d+)', stem):
        a, b = int(m.group(1)), int(m.group(2))
        refs.update(range(min(a, b), max(a, b) + 1))
    for m in re.finditer(r'(?:给定)?资料\s*(\d+)', stem):
        refs.add(int(m.group(1)))
    for m in re.finditer(r'材料\s*(\d+)', stem):
        refs.add(int(m.group(1)))
    refs = {r for r in refs if 1 <= r <= total}
    if not refs:
        # 未指明：整卷（文章写作常见）
        refs = set(range(1, total + 1))
    return sorted(refs)


def cn_grams(s, n=2):
    """粗糙的 2-gram 中文词元（无需分词库）"""
    out = set()
    cn = re.sub(r'[^\u4e00-\u9fa5]', '', s)
    for i in range(len(cn) - n + 1):
        out.add(cn[i:i + n])
    return out


LEAD_BAD = re.compile(r'^[，。、；：？！“”"\'’‘\s\-—…·]+')
DIALOGUE = re.compile(r'(介绍|说道|表示|坦言|笑称|回忆|告诉记者|问他|他说|她说|问道|答复)')
SUMMARY = re.compile(r'(要|应|需|必须|通过|实现|推动|建立|完善|加强|以.{0,6}为重点|关键|核心|重点)')


def tidy(s):
    """去掉引号与首尾标点，压掉多余空白"""
    s = s.strip()
    for ch in '“”"‘’':
        s = s.replace(ch, '')
    s = LEAD_BAD.sub('', s)
    s = re.sub(r'\s+', '', s)
    return s


def is_dialogue(s):
    """对话/转述句不适合当要点"""
    if DIALOGUE.search(s):
        return True
    # 引号密度高、或「，」很多且没有结论词，多为叙述
    if s.count('“') + s.count('”') >= 2:
        return True
    return False


def make_label(s, n=30):
    """截断到标点边界，避免半个词"""
    if len(s) <= n:
        return s
    cut = s[:n]
    for sep in ('，', '。', '；', '：'):
        i = cut.rfind(sep)
        if i >= n * 0.5:
            return cut[:i] + '…'
    return cut + '…'


def extract_points(stem, materials, refs, limit=8):
    """从对应材料中挑关键句作为参考要点（结论句优先，排除对话句）"""
    stem_grams = cn_grams(stem)
    cands = []
    for no in refs:
        for para in materials.get(no, []):
            for sent in re.split(r'[。！？；]', para):
                s = tidy(sent)
                if not (18 <= len(s) <= 160):
                    continue
                if is_dialogue(s):
                    continue
                score = 0
                for w in SIGNAL:
                    if w in s:
                        score += 2
                if SUMMARY.search(s):
                    score += 3
                grams = cn_grams(s)
                score += len(stem_grams & grams) * 1.0
                if re.search(r'\d', s):
                    score += 1
                if '，' in s:
                    score += 0.5
                cands.append((score, no, s))
    cands.sort(key=lambda x: (-x[0], x[1]))
    picked = []
    seen = set()
    for score, no, s in cands:
        key = s[:18]
        if key in seen:
            continue
        seen.add(key)
        picked.append({
            'label': make_label(s),
            'detail': s,
            'from': no,
            'weight': 1
        })
        if len(picked) >= limit:
            break
    return picked


def paper_key(year, kind):
    suf = {'副省级': 'fsx', '地市级': 'dsx', '行政执法卷': 'zf', '行政执法': 'zf'}.get(kind, kind)
    return 'sl%s-%s' % (year, suf)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(OUT, exist_ok=True)
    index = []
    for fn in sorted(os.listdir(CACHE)):
        if not fn.endswith('.typ'):
            continue
        text = io.open(os.path.join(CACHE, fn), encoding='utf-8').read()
        m = re.match(r'(\d{4})-(.+)\.typ$', fn)
        year, kind = m.group(1), m.group(2)
        materials, raws = split_sections(text)
        total_mat = len(materials)

        questions = []
        for i, (stem, paras) in enumerate(raws, 1):
            lo, hi = parse_word_limit(stem, paras)
            refs = material_refs(stem, total_mat)
            questions.append({
                'no': i,
                'type': classify(stem),
                'stem': re.sub(r'[（(]\s*\d+\s*分\s*[)）]\s*$', '', stem).strip(),
                'rawStem': stem,
                'requirement': paras,
                'score': parse_score(stem),
                'wordMin': lo,
                'wordMax': hi,
                'materialRefs': refs,
                'keyPoints': extract_points(stem, materials, refs),
                'keyPointNote': '参考要点由材料关键句按规则提取，供自评对照，非官方答案'
            })

        paper = {
            'key': paper_key(year, kind),
            'title': '%s 年国考申论（%s）' % (year, kind),
            'year': year,
            'examType': 'guokao',
            'kind': kind,
            'durationMin': 180,
            'materials': [{'no': no, 'paras': materials[no]} for no in sorted(materials)],
            'questions': questions,
            'questionCount': len(questions),
            'source': 'LeonardoTan19/GuoKaoShenLun（题目册）'
        }
        out = os.path.join(OUT, paper['key'] + '.json')
        json.dump(paper, io.open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        chars = sum(len(''.join(x['paras'])) for x in paper['materials'])
        index.append({'key': paper['key'], 'title': paper['title'], 'year': year,
                      'kind': kind, 'questionCount': len(questions),
                      'materialCount': total_mat, 'materialChars': chars})
        print('  %-12s 材料 %d 篇 / %5d 字 · 题目 %d · 要点 %d'
              % (paper['key'], total_mat, chars, len(questions),
                 sum(len(q['keyPoints']) for q in questions)))

    json.dump({'papers': index}, io.open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('\n申论 %d 套' % len(index))


if __name__ == '__main__':
    main()
