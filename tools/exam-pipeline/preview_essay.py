# -*- coding: utf-8 -*-
"""申论页面视觉预览（材料 / 作答 / 红领巾批改），与 WXSS 同一套令牌。"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'dist', 'preview-essay.html')

CSS = '''
*{box-sizing:border-box;-webkit-font-smoothing:antialiased}
html,body{margin:0;background:#e9e6df;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;color:#1d2530}
.row{display:flex;gap:24px;padding:24px;justify-content:center;align-items:flex-start}
.phone{width:390px;background:#f6f4ef;border-radius:20px;overflow:hidden;min-height:820px;
  box-shadow:0 18px 60px -30px rgba(0,0,0,.45)}
.hero{padding:18px 18px 2px}
.eyebrow{font-size:10px;letter-spacing:3px;color:#8a8578}
.title{margin-top:6px;font-family:"Songti SC",serif;font-size:30px;font-weight:600}
.title i{color:#2b4a8b;font-style:italic}
.sub{margin-top:4px;font-size:12px;color:#8a8578}
.tabs{position:sticky;top:0;display:flex;align-items:center;gap:4px;padding:7px 14px;
  background:rgba(246,244,239,.97);border-bottom:1px solid #ece6da}
.tab{padding:5px 13px;border-radius:999px;font-size:12px;color:#6b6558;background:#fffefb;border:1px solid #e6e0d4}
.tab.on{background:#2b4a8b;border-color:#2b4a8b;color:#fff}
.tabs-meta{margin-left:auto;font-size:10px;color:#a9a294}
.mat-block{margin:13px 17px 0}
.mat-title{font-family:"Songti SC",serif;font-size:14px;font-weight:700;color:#2b4a8b;
  border-left:3px solid #2b4a8b;padding-left:7px;margin-bottom:6px}
.mat-p{font-size:13.5px;line-height:1.95;color:#2b3038;text-indent:2em;margin-bottom:8px}
.textarea{margin:9px 17px 0;padding:12px;min-height:420px;background:#fffefb;border:1px solid #e6e0d4;
  border-radius:11px;font-size:14px;line-height:1.95;white-space:pre-wrap}
.count{margin:6px 18px 0;font-size:10.5px;color:#8a8578}
.count .over{color:#b5442c}
.card{margin:12px 17px 0;padding:13px 14px;background:#fffefb;border:1px solid #e6e0d4;border-radius:13px}
.cap{font-size:10px;letter-spacing:3px;color:#b8892f;margin-bottom:6px}
.myans{font-size:13px;line-height:1.9;color:#2b3038;white-space:pre-wrap}
.checks{display:flex;gap:6px;margin-top:10px;padding-top:8px;border-top:1px dashed #e6e0d4}
.chk{flex:1;padding:6px 5px;border-radius:8px;background:#faf8f4;border:1px solid #ece6da;text-align:center}
.chk.ok{background:#eef5ee;border-color:#c3d6c3}
.chk .k{display:block;font-size:9.5px;color:#8a8578}
.chk .v{display:block;margin-top:2px;font-size:11px}
.grade-wrap{margin:12px 17px 0}
.grade-btn{display:flex;align-items:center;gap:7px;padding:12px 13px;border-radius:12px;
  background:linear-gradient(135deg,#fdf1ec,#f8e7e0);border:1px solid #e6c3b8}
.gb-ico{width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;
  background:#b5442c;color:#fff;font-family:"Songti SC",serif;font-size:13px}
.gb-txt{font-size:14.5px;font-weight:600;color:#8f3520}
.gb-sub{margin-left:auto;font-size:10px;color:#a9735f}
.grade-card{margin-top:9px;padding:13px 13px 11px;border-radius:12px;background:#fffefb;border:1px solid #e6e0d4}
.g-top{display:flex;align-items:baseline;gap:4px}
.g-score{font-family:"Songti SC",serif;font-size:32px;font-weight:700;color:#b5442c;line-height:1}
.g-full{font-size:11px;color:#8a8578}
.g-hit{margin-left:auto;font-size:10.5px;color:#2b4a8b}
.g-bars{margin-top:9px}
.g-bar{display:flex;align-items:center;gap:7px;margin-bottom:5px}\n.gl,.gv{flex:0 0 auto}
.gl{width:28px;font-size:10px;color:#8a8578}
.gt{flex:1;height:4px;border-radius:3px;background:#f0ebe1;overflow:hidden}
.gf{height:100%;border-radius:3px;background:linear-gradient(90deg,#b5442c,#d1795f)}
.gv{width:30px;text-align:right;font-size:10px;color:#4a5568}
.g-sec{margin:11px 0 5px;font-size:10px;letter-spacing:3px;color:#b8892f}
.g-pt{display:flex;gap:7px;padding:8px 9px;margin-bottom:5px;border-radius:8px;background:#faf8f4;border:1px solid #ece6da}
.g-pt.on{background:#eef5ee;border-color:#c3d6c3}
.g-mark{font-size:11px;color:#b5442c;line-height:1.5}
.g-pt.on .g-mark{color:#3f6b3f}
.g-label{font-size:12px;line-height:1.6}
.g-from{margin-top:2px;font-size:9.5px;color:#a9a294}
.g-terms{margin-left:7px;color:#2b4a8b}
.g-issue{font-size:11.5px;line-height:1.8;color:#b5442c}
.g-sug{font-size:11.5px;line-height:1.8;color:#4a5568}
.g-note{margin-top:9px;padding-top:7px;border-top:1px dashed #e6e0d4;font-size:9.5px;line-height:1.7;color:#a9a294}
.foot{position:sticky;bottom:0;display:flex;align-items:center;gap:7px;padding:8px 15px;
  background:rgba(255,254,251,.97);border-top:1px solid #ece6da}
.timer{font-family:"Songti SC",serif;font-size:14px;color:#2b4a8b;min-width:56px}
.bbtn{flex:1;height:40px;line-height:40px;text-align:center;border-radius:9px;border:1px solid #e0d9cb;
  background:#fff;font-size:12.5px;color:#4a5568}
.bbtn.primary{background:#2b4a8b;border-color:#2b4a8b;color:#fff}
'''


def phone_material():
    paras = [
        '黄河奔腾生生不息，科技活水澎湃成潮。进入新的发展阶段，信息技术不断迭代升级，各种科技实践也正一幕幕上演，为黄河保护治理赋予新解。',
        '“我手中这个设备俗称‘智慧石头’，它由智能芯片和电池组成。把它放到防洪堤坝根石堆里，它就成了打入根石堆的一个小小‘侦察员’，能够24小时全天候实时预警。”智慧黄河研究院赵工程师介绍说。',
        '其实，“智慧石头”只是数字孪生黄河建设的一个基础应用。数字孪生黄河，就是把实体的原型黄河“装进”计算机，实现与原型黄河的同步仿真运行、虚实交互、迭代优化。'
    ]
    body = ''.join('<div class="mat-p">%s</div>' % p for p in paras)
    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">ESSAY PRACTICE</div>
    <div class="title">申论<i>精练</i></div><div class="sub">材料 · 题目 · 作答 · 要点批改</div></div>
  <div class="tabs"><span class="tab on">材料</span><span class="tab">题目</span><span class="tab">作答</span>
    <span class="tabs-meta">第 1/5 题 · 15 分</span></div>
  <div class="mat-block"><div class="mat-title">资料 1</div>%s</div>
  <div class="foot"><span class="timer">12:34</span><span class="bbtn">存草稿</span><span class="bbtn primary">对要点</span></div>
</div>''' % body


def phone_answer():
    text = ('1. 根据资料1，数字孪生黄河提升防汛预警能力，实现预报、预警、预演、预案四预功能，'
            '把实体黄河装进计算机同步仿真运行。\n'
            '2. 根据资料1，河务通应用提高巡河效率，监测数据汇集手机端，巡查人员能及时发现问题并处置。\n'
            '3. 根据资料1，模型黄河为防汛决策提供物理参数支撑，服务工程调度。')
    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">ESSAY PRACTICE</div>
    <div class="title">申论<i>精练</i></div><div class="sub">材料 · 题目 · 作答 · 要点批改</div></div>
  <div class="tabs"><span class="tab">材料</span><span class="tab">题目</span><span class="tab on">作答</span>
    <span class="tabs-meta">第 1/5 题 · 15 分</span></div>
  <div style="margin:12px 17px 0;font-family:'Songti SC',serif;font-size:14px;font-weight:700;color:#2b4a8b">第 1 题</div>
  <div class="textarea">%s</div>
  <div class="count">216 字 / 上限 350　<span style="color:#b8892f">已保存 18:41</span></div>
  <div class="foot"><span class="timer">12:34</span><span class="bbtn">存草稿</span><span class="bbtn primary">对要点</span></div>
</div>''' % text.replace('\n', '<br>')


def phone_review():
    pts = [
        ('数字孪生黄河提升防汛预警能力，实现四预功能', 1, True, '数字 孪生'),
        ('河务通应用提高巡河效率，及时发现处置问题', 1, True, '河务 通应'),
        ('模型黄河为防汛决策提供物理参数支撑', 1, False, '')
    ]
    rows = ''
    for label, frm, on, terms in pts:
        rows += ('<div class="g-pt %s"><span class="g-mark">%s</span><div><div class="g-label">%s</div>'
                 '<div class="g-from">资料 %d%s</div></div></div>'
                 % ('on' if on else '', '✓' if on else '✕', label, frm,
                    ('<span class="g-terms">命中：' + terms + '</span>') if terms else ''))

    return '''
<div class="phone">
  <div class="hero"><div class="eyebrow">REVIEW &amp; MARKING</div>
    <div class="title">要点<i>批改</i></div><div class="sub">第 1 题 · 归纳概括 · 15 分</div></div>
  <div class="card"><div class="cap">我的作答</div>
    <div class="myans">1. 根据资料1，数字孪生黄河提升防汛预警能力……<br>2. 根据资料1，河务通应用提高巡河效率……<br>3. 根据资料1，模型黄河为防汛决策提供物理参数支撑……</div>
    <div class="checks">
      <div class="chk ok"><span class="k">字数</span><span class="v">216 / 350</span></div>
      <div class="chk ok"><span class="k">分条</span><span class="v">3 行</span></div>
      <div class="chk ok"><span class="k">扣材料</span><span class="v">已引用</span></div>
    </div>
  </div>
  <div class="grade-wrap">
    <div class="grade-btn"><span class="gb-ico">批</span><span class="gb-txt">重新批改</span><span class="gb-sub">按参考要点逐条比对</span></div>
    <div class="grade-card">
      <div class="g-top"><span class="g-score">10.6</span><span class="g-full">/ 15 分</span><span class="g-hit">要点命中 2/3</span></div>
      <div class="g-bars">
        <div class="g-bar"><div class="gl">要点</div><div class="gt"><div class="gf" style="width:67%%"></div></div><div class="gv">6</div></div>
        <div class="g-bar"><div class="gl">结构</div><div class="gt"><div class="gf" style="width:100%%"></div></div><div class="gv">3.8</div></div>
        <div class="g-bar"><div class="gl">表达</div><div class="gt"><div class="gf" style="width:57%%"></div></div><div class="gv">0.9</div></div>
      </div>
      <div class="g-sec">要点比对</div>%s
      <div class="g-sec">待改进</div>
      <div class="g-issue">· 第 3 条要点未覆盖</div>
      <div class="g-issue">· 字数偏少</div>
      <div class="g-sec">建议</div>
      <div class="g-sug">· 补「模型黄河为防汛决策提供物理参数支撑」（来自资料 1）。</div>
      <div class="g-sug">· 补充材料中的具体做法或数据，写到 290 字左右。</div>
      <div class="g-note">批改依据为参考要点命中与作答结构，规则固定、结果可复现；不代表阅卷标准。</div>
    </div>
  </div>
</div>''' % rows


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    html = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
            '<title>申论 · 视觉预览</title><style>%s</style></head><body>'
            '<div class="row">%s%s%s</div></body></html>'
            % (CSS, phone_material(), phone_answer(), phone_review()))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('preview ->', OUT, len(html))


if __name__ == '__main__':
    main()
