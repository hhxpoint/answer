# -*- coding: utf-8 -*-
"""生成可视化 demo（手机宽度），用于验收数据结构与视觉方向。

输出：dist/demo.html
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')


def parts_html(blocks, key):
    out = []
    for b in blocks:
        inner = []
        for p in b['parts']:
            if 'img' in p:
                w = p.get('w') or 0
                style = ''
                inner.append('<img class="qimg%s" src="img/%s/%s"%s alt="">'
                             % (' tex' if p.get('tex') else '', key, p['img'], style))
            else:
                inner.append('<span>%s</span>' % p['t'])
        out.append('<p>%s</p>' % ''.join(inner))
    return ''.join(out)


CSS = '''
:root{
  --paper:#f6f4ef; --ink:#1d2530; --ink-2:#4a5568; --ink-3:#8a8578;
  --line:#e6e0d4; --card:#fffefb; --indigo:#2b4a8b; --indigo-soft:#eef1f8;
  --vermilion:#b5442c; --vermilion-soft:#fbeee9; --gold:#b8892f;
}
*{box-sizing:border-box;-webkit-font-smoothing:antialiased}
html,body{width:100%;max-width:100%;overflow-x:hidden}
img{max-width:100%!important;height:auto}
p,span,div{overflow-wrap:anywhere}
body{margin:0;background:var(--paper);color:var(--ink);
  font:15px/1.75 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;}
.phone{width:100%;max-width:390px;margin:0 auto;padding:0 0 60px;background:var(--paper);
  min-height:100vh;overflow-x:hidden}
.topbar{position:sticky;top:0;z-index:9;background:rgba(246,244,239,.94);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--line);
  padding:13px 16px;display:flex;align-items:baseline;gap:9px}
.topbar .eyebrow{font-size:11px;letter-spacing:.22em;color:var(--ink-3)}
.topbar .ttl{font-family:"Songti SC","STSong",serif;font-size:16px;font-weight:600;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.topbar .meta{margin-left:auto;font-size:12px;color:var(--ink-3)}
.wrap{padding:16px 18px 0}
.qcard{background:var(--card);border:1px solid var(--line);border-radius:16px;
  padding:18px 18px 20px;margin-bottom:16px;box-shadow:0 1px 0 rgba(29,37,48,.02),0 8px 24px -18px rgba(29,37,48,.35)}
.qhead{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.qno{font-family:"Songti SC",serif;font-size:15px;font-weight:700;color:var(--indigo)}
.chip{font-size:11px;padding:2px 9px;border-radius:999px;background:var(--indigo-soft);color:var(--indigo);letter-spacing:.02em}
.chip.gold{background:#fbf4e3;color:var(--gold)}
.qtext{font-size:15.5px;line-height:1.85;color:var(--ink)}
.qtext p{margin:0 0 10px}
.qimg{display:block;max-width:100%;margin:12px auto;border:1px solid #eee8dc;
  border-radius:8px;background:#fff;padding:3px}
.see{color:#a9a294;font-size:13px}
.qimg.tex{display:inline-block;max-height:22px;margin:0 1px;padding:0;border:0;vertical-align:-4px}
.opts{margin-top:14px;display:flex;flex-direction:column;gap:9px}
.opt{display:flex;gap:11px;align-items:flex-start;border:1px solid var(--line);
  border-radius:12px;padding:11px 13px;background:#fff;transition:.16s}
.opt .k{flex:0 0 22px;height:22px;line-height:22px;text-align:center;border-radius:50%;
  border:1px solid var(--line);font-size:12px;font-weight:600;color:var(--ink-2);background:#faf8f4}
.opt .v{flex:1;font-size:14.5px;line-height:1.6}
.opt.ok{border-color:#e8c9c0;background:var(--vermilion-soft)}
.opt.ok .k{background:var(--vermilion);border-color:var(--vermilion);color:#fff}
.opt.pick{border-color:#b9c6e2;background:var(--indigo-soft)}
.opt.pick .k{background:var(--indigo);border-color:var(--indigo);color:#fff}
.sect{margin:26px 4px 10px;display:flex;align-items:center;gap:10px}
.sect .bar{width:3px;height:14px;background:var(--indigo);border-radius:2px}
.sect .t{font-size:13px;letter-spacing:.06em;color:var(--ink-2)}
.sect .line{flex:1;height:1px;background:var(--line)}
.mat{background:#fbf9f3;border:1px dashed #ddd5c4;border-radius:14px;padding:14px 16px;margin-bottom:12px}
.mat .cap{font-size:11px;letter-spacing:.18em;color:var(--gold);margin-bottom:8px}
.mat p{font-size:14px;line-height:1.85;color:var(--ink-2);margin:0 0 8px}
.ans{margin-top:14px;border-top:1px dashed var(--line);padding-top:12px}
.ans .row{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-2);margin-bottom:8px}
.ans .val{font-family:"Songti SC",serif;font-size:16px;font-weight:700;color:var(--vermilion)}
.analysis{font-size:14px;line-height:1.85;color:var(--ink-2)}
.analysis p{margin:0 0 8px}
.tag{display:inline-block;font-size:11px;padding:1px 8px;border-radius:4px;
  background:#f2efe8;color:var(--ink-3);margin-right:6px}
'''


SECTION_LABEL = {'zzll': '政治理论', 'cs': '常识判断', 'yy': '言语理解', 'sl': '数量关系', 'pd': '判断推理', 'zl': '资料分析'}


def render_question(q, key, paper, idx, show_answer=True):
    opts = []
    for o in q['options']:
        cls = 'opt'
        if show_answer and o['key'] == q['answer']:
            cls += ' ok'
        v = parts_html(o['blocks'], key) or ''
        v = v.replace('<p>', '').replace('</p>', '')
        plain = re.sub(r'<[^>]+>', '', v).strip()
        if plain == o['key']:
            v = '<span class="see">见下图选项</span>' 
        opts.append('<div class="%s"><div class="k">%s</div><div class="v">%s</div></div>' % (cls, o['key'], v))

    mat = ''
    if q.get('material'):
        blocks = paper['materials'].get(q['section'], {}).get(str(q['material']))
        if blocks:
            mat = '<div class="mat"><div class="cap">材料 %d</div>%s</div>' % (q['material'], parts_html(blocks, key))

    ans = ''
    if show_answer:
        ans = ('<div class="ans"><div class="row"><span>参考答案</span><span class="val">%s</span>'
               '<span class="tag">%s</span></div><div class="analysis">%s</div></div>'
               % (q['answer'], q['type'], parts_html(q['analysis'], key)))

    return ('<div class="qcard"><div class="qhead"><span class="qno">第 %d 题</span>'
            '<span class="chip">%s</span><span class="chip gold">%s</span></div>'
            '%s<div class="qtext">%s</div><div class="opts">%s</div>%s</div>'
            % (idx, q['type'], SECTION_LABEL.get(q['section'], q['section']), mat, parts_html(q['stem'], key), ''.join(opts), ans))


def main():
    path = os.path.join(DIST, 'papers', 'gk2025-fsx.json')
    paper = json.load(open(path, encoding='utf-8'))
    key = paper['key']
    qs = paper['questions']

    def has_img(q):
        return any('img' in p for b in q['stem'] for p in b['parts'])

    picks = []
    tu = [q for q in qs if q['type'] == '图形推理' and has_img(q)][:2]
    zl = [q for q in qs if q['section'] == 'zl'][:1]
    yy = [q for q in qs if q['section'] == 'yy' and not has_img(q)][:1]
    picks = tu + zl + yy

    body = []
    body.append('<div class="sect"><i class="bar"></i><span class="t">图形推理 · 图推整图方案</span><i class="line"></i></div>')
    for i, q in enumerate(tu, 1):
        body.append(render_question(q, key, paper, i))
    body.append('<div class="sect"><i class="bar"></i><span class="t">资料分析 · 材料共用</span><i class="line"></i></div>')
    for i, q in enumerate(zl, 1):
        body.append(render_question(q, key, paper, i))
    body.append('<div class="sect"><i class="bar"></i><span class="t">言语理解 · 纯文字</span><i class="line"></i></div>')
    for i, q in enumerate(yy, 1):
        body.append(render_question(q, key, paper, i))

    html = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=390,initial-scale=1">'
            '<title>公考题库 · 视觉原型</title><style>%s</style></head><body>'
            '<div class="phone"><div class="topbar"><span class="eyebrow">EXAM</span>'
            '<span class="ttl">%s</span><span class="meta">%d 题 · %s</span></div>'
            '<div class="wrap">%s</div></div></body></html>'
            % (CSS, paper['title'].replace('2025年国家公务员录用考试《行测》题', '2025 国考行测'), paper['questionCount'], paper['year'], ''.join(body)))

    out = os.path.join(DIST, 'demo.html')
    open(out, 'w', encoding='utf-8').write(html)
    print('demo ->', out, len(html), 'bytes; 示例题', len(picks))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
