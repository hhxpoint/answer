# -*- coding: utf-8 -*-
"""为 M2 新页面生成静态视觉预览（与 WXSS 同一套令牌），用 Chrome 截图验收。

说明：开发者工具的模拟器渲染在当前环境挂了，这里用等价 HTML 复核排版与配色。
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
OUT = os.path.join(DIST, 'preview-pages.html')

CSS = '''
*{box-sizing:border-box;-webkit-font-smoothing:antialiased}
html,body{margin:0;background:#e9e6df;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
.row{display:flex;gap:26px;padding:26px;align-items:flex-start;justify-content:center}
.phone{width:390px;background:#f6f4ef;border-radius:22px;overflow:hidden;
  box-shadow:0 18px 60px -30px rgba(0,0,0,.45);min-height:760px;color:#1d2530}
.hero{padding:20px 20px 4px}
.eyebrow{font-size:10px;letter-spacing:3px;color:#8a8578}
.title{margin-top:6px;font-family:"Songti SC",serif;font-size:32px;font-weight:600;letter-spacing:1px}
.title i{color:#2b4a8b;font-style:italic}
.sub{margin-top:5px;font-size:12px;color:#8a8578}
.stats{display:flex;margin:14px 20px 4px;border-radius:14px;background:#fffefb;border:1px solid #e6e0d4;overflow:hidden}
.stats div{flex:1;padding:12px 0;text-align:center}
.stats div+div{border-left:1px solid #f0ebe1}
.stats .n{font-family:"Songti SC",serif;font-size:22px;font-weight:700}
.stats .l{font-size:10px;color:#a9a294;margin-top:3px;letter-spacing:1px}
.sec{display:flex;align-items:center;gap:7px;margin:20px 20px 8px}
.sec .bar{width:3px;height:13px;border-radius:2px;background:#2b4a8b}
.sec .t{font-size:12px;letter-spacing:2px;color:#4a5568}
.sec .line{flex:1;height:1px;background:#e6e0d4}
.card{display:flex;align-items:center;margin:0 20px 8px;padding:15px;border-radius:14px;background:#fffefb;
  border:1px solid #e6e0d4;box-shadow:0 5px 15px -11px rgba(29,37,48,.4)}
.card .ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-size:17px;margin-right:12px;flex:0 0 38px}
.ico.indigo{background:#eef1f8;color:#2b4a8b}
.ico.gold{background:#fbf4e3;color:#b8892f}
.ico.ink{background:#f1efe9;color:#6b6558}
.card .ttl{font-size:15px;font-weight:600}
.card .desc{margin-top:4px;font-size:11px;color:#8a8578;line-height:1.5}
.card .arrow{margin-left:8px;color:#c9c2b4;font-size:17px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 20px 8px}
.tcard{padding:13px 12px 11px;border-radius:12px;background:#fffefb;border:1px solid #e6e0d4;
  box-shadow:0 5px 15px -13px rgba(29,37,48,.45)}
.tcard .tn{font-family:"Songti SC",serif;font-size:15px;font-weight:700}
.tcard .td{margin-top:5px;font-size:10px;color:#8a8578;line-height:1.6;min-height:32px}
.tcard .tc{margin-top:4px;font-size:10px;color:#2b4a8b}
.bignums{display:flex;margin:13px 20px 4px;padding:14px 0;border-radius:14px;
  background:linear-gradient(160deg,#fdfcf8,#f4f1e9);border:1px solid #e6e0d4}
.bignums div{flex:1;text-align:center}
.bignums div+div{border-left:1px solid #ece6da}
.bignums .n{font-family:"Songti SC",serif;font-size:26px;font-weight:700;color:#2b4a8b}
.bignums .l{font-size:10px;color:#a9a294;margin-top:4px}
.prow{margin:0 20px 8px;padding:12px 13px;border-radius:11px;background:#fffefb;border:1px solid #e6e0d4}
.ptop{display:flex;align-items:baseline;gap:6px}
.ptop .pt{flex:1;font-size:13.5px}
.ptop .pn{font-family:"Songti SC",serif;font-size:12px;color:#8a8578}
.pbar{height:3px;border-radius:3px;background:#f0ebe1;margin:7px 0 5px;overflow:hidden}
.pfill{height:100%;border-radius:3px;background:linear-gradient(90deg,#2b4a8b,#5b79b8)}
.pfoot{display:flex;justify-content:space-between;font-size:10px;color:#a9a294}
.pfoot .go{color:#2b4a8b}
.wrow{display:flex;align-items:center;gap:8px;padding:11px 12px;margin-bottom:6px;border-radius:10px;
  background:#fffefb;border:1px solid #e6e0d4}
.wrow .no{font-family:"Songti SC",serif;font-size:13px;font-weight:600}
.wrow .tp{font-size:10px;padding:1px 6px;border-radius:999px;background:#fbeee9;color:#b5442c}
.wrow .g{margin-left:auto;font-size:11px;color:#2b4a8b}
.gh{font-size:11px;color:#8a8578;margin:14px 20px 6px;line-height:1.6}
.foot{margin:22px 22px 0;font-size:10px;line-height:1.9;color:#a9a294}
'''


def phone_section():
    pools = [
        ('逻辑填空', '语境 + 词语辨析', 273), ('片段阅读', '中心理解、细节判断、标题填入', 242),
        ('常识判断', '政治、法律、经济、科技、人文', 227), ('数学运算', '行程、工程、排列组合、几何', 186),
        ('类比推理', '词项关系：近义、种属、组成、对应', 185), ('图形推理', '九宫格 / 序列 / 分类，图像规律专项', 160),
        ('定义判断', '抓定义关键词，逐个选项比对', 158), ('政治理论', '新思想、时政、马原', 137),
        ('逻辑判断', '加强削弱、前提假设、真假推理', 122), ('语句表达', '语句排序、语句填充、接语选择', 95)
    ]
    cards = ''.join(
        '<div class="tcard"><div class="tn">%s</div><div class="td">%s</div><div class="tc">%d 题</div></div>'
        % (n, d, c) for n, d, c in pools)
    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">DRILL BY TYPE</div>
    <div class="title">专项<i>练习</i></div>
    <div class="sub">按题型跨年份抽题 · 一次只攻一类</div></div>
  <div class="grid">%s</div>
  <div class="card"><div class="ico gold">料</div><div><div class="ttl">资料分析</div>
    <div class="desc">题目依赖共用材料与图表，请在套卷中练习</div></div><div class="arrow">›</div></div>
  <div class="foot">专项题按题型跨卷抽取；作答记录与本卷练习分开统计。</div>
</div>''' % cards


def phone_report():
    rows = [
        ('2025 副省级', 135, 32, 28), ('2025 地市级', 130, 18, 15),
        ('2024 副省级', 135, 6, 4), ('2023 行政执法', 130, 0, 0)
    ]
    items = ''.join('''<div class="prow"><div class="ptop"><span class="pt">%s</span><span class="pn">%d/%d</span></div>
      <div class="pbar"><div class="pfill" style="width:%d%%"></div></div>
      <div class="pfoot"><span>正确率 %d%%</span><span class="go">继续 ›</span></div></div>'''
                    % (t, done, total, round(done * 100 / total), acc) for t, total, done, acc in rows)
    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">MY PROGRESS</div>
    <div class="title">学习<i>报告</i></div><div class="sub">共 16 卷 · 2109 题</div></div>
  <div class="bignums">
    <div><div class="n">243</div><div class="l">累计作答</div></div>
    <div><div class="n">78%%</div><div class="l">正确率</div></div>
    <div><div class="n">5</div><div class="l">连续天数</div></div>
  </div>
  <div class="sec"><span class="bar"></span><span class="t">各卷进度</span><span class="line"></span></div>
  %s
  <div class="foot">报告基于本机作答记录统计；换设备不会同步。</div>
</div>''' % items


def phone_wrong():
    groups = [('2025年国家公务员录用考试《行测》题（副省级网友回忆版）',
               [(12, '图形推理'), (35, '逻辑判断'), (78, '资料分析')]),
              ('2024年国家公务员录用考试《行测》题（地市级网友回忆版）',
               [(9, '定义判断'), (41, '片段阅读')])]
    html = ''
    for title, rows in groups:
        html += '<div class="gh">%s</div>' % title
        for no, tp in rows:
            html += ('<div class="wrow"><span class="no">第 %d 题</span>'
                     '<span class="tp">%s</span><span class="g">重做 ›</span></div>' % (no, tp))
    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">WRONG ANSWERS</div>
    <div class="title">错题<i>本</i></div><div class="sub">共 5 道待复盘</div></div>
  %s
  <div class="foot">错题来自本机作答记录；重做答对后会自动移出。</div>
</div>''' % html


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    html = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
            '<title>公考题库 · M2 页面预览</title><style>%s</style></head><body>'
            '<div class="row">%s%s%s</div></body></html>'
            % (CSS, phone_section(), phone_wrong(), phone_report()))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('preview ->', OUT, len(html), 'bytes')


if __name__ == '__main__':
    main()
