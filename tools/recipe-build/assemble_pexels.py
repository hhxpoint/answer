# -*- coding: utf-8 -*-
"""把人工挑选的 Pexels/维基图片整理成小程序资源（600x450，统一压缩）并生成 credits.js"""
import json
import os
from PIL import Image, ImageOps

ROOT = r'D:\03-Projects\answer'
P1 = r'D:\dsh\workplace\pexels-candidates\pexels_imgs'
P2 = r'D:\dsh\workplace\pexels2-candidates\pexels2'
P3 = r'D:\dsh\workplace\pexels3-candidates\pexels3'
WIKI = r'D:\dsh\workplace\recipe-candidates\recipe_candidates'
OUT = os.path.join(ROOT, 'packageRecipe', 'assets', 'recipes')
CREDITS_JS = os.path.join(ROOT, 'packageRecipe', 'data', 'credits.js')

# 少量保留/改用维基（更准确）的菜品
WIKI_SELECT = {
    'huiguorou': 'huiguorou_1.jpg',
    'jiandan': 'jiandan_1.jpg',
}

# 选择：id -> 文件所在目录 + 文件名；None 表示保留现有维基图片
SELECT = {
    'fanqie_chaodan': (P2, 'fanqie_chaodan_0.jpg'),
    'gongbao_jiding': (P1, 'gongbao_jiding_0.jpg'),
    'mapo_doufu': (P1, 'mapo_doufu_2.jpg'),
    'yuxiang_rousi': (P2, 'yuxiang_rousi_1.jpg'),
    'huiguorou': (P1, 'huiguorou_2.jpg'),
    'qingjiao_rousi': (P2, 'qingjiao_rousi_2.jpg'),
    'hongshao_qiezi': (P1, 'hongshao_qiezi_1.jpg'),
    'suanrong_xilanhua': (P1, 'suanrong_xilanhua_2.jpg'),
    'shousi_baocai': (P1, 'shousi_baocai_3.jpg'),
    'ganbian_doujiao': (P2, 'ganbian_doujiao_3.jpg'),
    'kele_jichi': (P1, 'kele_jichi_2.jpg'),
    'suanla_tudousi': (P3, 'suanla_tudousi_q0_3.jpg'),
    'suantai_chaorou': (P3, 'suantai_chaorou_q3_1.jpg'),
    'jiucai_chaodan': (P1, 'jiucai_chaodan_0.jpg'),
    'suanrong_fensi_wawacai': (P2, 'suanrong_fensi_wawacai_1.jpg'),
    'liangban_huanggua': (P1, 'liangban_huanggua_2.jpg'),
    'qingchao_shishu': (P2, 'qingchao_shishu_1.jpg'),
    'xianggu_huaji': (P1, 'xianggu_huaji_3.jpg'),
    'zicai_danhua_tang': (P3, 'zicai_danhua_tang_q2_0.jpg'),
    'fanqie_dantang': None,
    'donggua_paigu_tang': (P1, 'donggua_paigu_tang_1.jpg'),
    'yumi_paigu_tang': (P1, 'yumi_paigu_tang_1.jpg'),
    'yiner_lianzi_geng': (P2, 'yiner_lianzi_geng_0.jpg'),
    'dan_chaofan': (P1, 'dan_chaofan_1.jpg'),
    'fanqie_jidan_mian': (P1, 'fanqie_jidan_mian_0.jpg'),
    'congyou_banmian': (P1, 'congyou_banmian_0.jpg'),
    'gali_jifan': (P1, 'gali_jifan_0.jpg'),
    'lurou_fan': (P1, 'lurou_fan_3.jpg'),
    'huangmenji_mifan': (P1, 'huangmenji_mifan_1.jpg'),
    'chaomian': (P1, 'chaomian_0.jpg'),
    'pidan_shourou_zhou': (P2, 'pidan_shourou_zhou_0.jpg'),
    'sanmingzhi': (P1, 'sanmingzhi_2.jpg'),
    'jiandan': None,
    'zheng_dangeng': (P1, 'zheng_dangeng_3.jpg'),
    'congyoubing': (P1, 'congyoubing_3.jpg'),
    'hongshao_rou': (P1, 'hongshao_rou_2.jpg'),
    'qingzheng_luyu': (P1, 'qingzheng_luyu_0.jpg'),
    'tangcu_paigu': None,
    'hongshao_jitui': (P2, 'hongshao_jitui_0.jpg'),
    'xihongshi_niunan': (P1, 'xihongshi_niunan_3.jpg'),
}


def load_js_array(path):
    s = open(path, encoding='utf-8').read()
    s = s[s.index('=') + 1:]
    s = s.rsplit(';', 1)[0].strip()
    return json.loads(s)


def load_report(path):
    return json.load(open(path, encoding='utf-8'))


def build_pool():
    pool = {}
    for base, report_path in [
        (P1, os.path.join(ROOT, 'tools', 'recipe-build', 'pexels_report.json')),
        (P2, os.path.join(ROOT, 'tools', 'recipe-build', 'pexels2_report.json')),
    ]:
        for item in load_report(report_path):
            for c in item.get('candidates', []):
                name = c['file'].replace('\\', '/').rsplit('/', 1)[-1]
                pool[(base, name)] = c
    # p3：文件名带 qX
    report3 = load_report(os.path.join(ROOT, 'tools', 'recipe-build', 'pexels3_report.json'))
    # 重新按文件名生成：报告顺序与文件一致，q 索引在报告条目里
    for item in report3:
        for c in item.get('candidates', []):
            name = c['file'].replace('\\', '/').rsplit('/', 1)[-1]
            pool[(P3, name)] = c
    return pool


def main():
    current = {c['id']: c for c in load_js_array(CREDITS_JS)}
    pool = build_pool()
    os.makedirs(OUT, exist_ok=True)
    credits = []
    total = 0
    for rid, sel in SELECT.items():
        dst = os.path.join(OUT, rid + '.jpg')
        if rid in WIKI_SELECT:
            wiki_name = WIKI_SELECT[rid]
            src = os.path.join(WIKI, wiki_name)
            if not os.path.exists(src):
                raise SystemExit('missing wiki image: ' + src)
            wiki_report = load_report(os.path.join(ROOT, 'tools', 'recipe-build', 'candidates_report.json'))
            rec = None
            for item in wiki_report:
                if item.get('id') == rid:
                    for c in item.get('candidates', []):
                        if c.get('file', '').replace('\\', '/').endswith(wiki_name):
                            rec = c
                            break
            if not rec:
                raise SystemExit('no wiki credit for: ' + wiki_name)
            credit = {
                'id': rid,
                'title': rid,
                'image': '/packageRecipe/assets/recipes/' + rid + '.jpg',
                'source': 'Wikipedia / Wikimedia Commons',
                'license': rec.get('license', ''),
                'artist': rec.get('artist', ''),
                'landing': rec.get('landing', ''),
                'orig_title': (rec.get('orig_title') or '')[:120],
            }
        elif sel is None:
            src = dst
            if not os.path.exists(src):
                raise SystemExit('missing current image: ' + src)
            info = current.get(rid) or {}
            credit = {
                'id': rid,
                'title': info.get('title', ''),
                'image': '/packageRecipe/assets/recipes/' + rid + '.jpg',
                'source': info.get('source', 'Wikimedia Commons'),
                'license': info.get('license', ''),
                'artist': info.get('artist', ''),
                'landing': info.get('landing', ''),
            }
        else:
            base, name = sel
            src = os.path.join(base, name)
            if not os.path.exists(src):
                raise SystemExit('missing selected image: ' + src)
            c = pool.get((base, name))
            if not c:
                raise SystemExit('no credit for: ' + name)
            credit = {
                'id': rid,
                'title': rid,
                'image': '/packageRecipe/assets/recipes/' + rid + '.jpg',
                'source': 'Pexels',
                'license': 'Pexels License (free to use)',
                'artist': '',
                'landing': c.get('page', ''),
                'orig_title': (c.get('alt') or '')[:120],
            }
        # 统一压缩：居中裁切 4:3，600x450，JPEG q68
        im = Image.open(src).convert('RGB')
        im = ImageOps.fit(im, (600, 450), method=Image.Resampling.LANCZOS)
        im.save(dst, 'JPEG', quality=68, optimize=True, progressive=True)
        size = os.path.getsize(dst)
        total += size
        credits.append(credit)
        print('%-28s %-5s %5dKB  %s' % (rid, 'keep' if sel is None else 'new', size / 1024, credit['source']))

    # 按菜谱顺序输出 credits
    recipes = load_js_array(os.path.join(ROOT, 'packageRecipe', 'data', 'recipes.js'))
    order = {r['id']: i for i, r in enumerate(recipes)}
    credits.sort(key=lambda c: order.get(c['id'], 999))
    with open(CREDITS_JS, 'w', encoding='utf-8') as f:
        f.write('// 图片版权信息（Pexels / Wikimedia Commons），由 tools/recipe-build 生成\nmodule.exports = ')
        json.dump(credits, f, ensure_ascii=False, indent=2)
        f.write(';\n')
    print('\nimages:', len(credits), 'total:', round(total / 1024, 1), 'KB')


if __name__ == '__main__':
    main()
