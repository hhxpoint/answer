# -*- coding: utf-8 -*-
"""生成「我们的小火苗」分享封面（800x640，5:4）
设计系统：暖白纸感 + 铜色 + 抽象火苗 + 编辑器式排版 + 细线/颗粒
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = r'D:\03-Projects\answer'
OUT = os.path.join(ROOT, 'packageCouple', 'assets', 'share')
S = 2  # 2x 渲染后缩放，保证字体/线条平滑
W, H = 800 * S, 640 * S

INK = (47, 38, 31)
MUTED = (122, 103, 89)
COPPER = (188, 116, 74)
COPPER_SOFT = (214, 158, 120)
CREAM = (251, 246, 238)
ROSE = (211, 147, 137)
SAGE = (132, 155, 128)
LAV = (145, 135, 168)

FONT_DIR = r'C:\Windows\Fonts'
F_LIGHT = os.path.join(FONT_DIR, 'msyhl.ttc')
F_REG = os.path.join(FONT_DIR, 'msyh.ttc')
F_BOLD = os.path.join(FONT_DIR, 'msyhbd.ttc')
F_SERIF = os.path.join(FONT_DIR, 'georgia.ttf')
F_SERIF_B = os.path.join(FONT_DIR, 'georgiab.ttf')


def F(path, size):
    return ImageFont.truetype(path, int(size * S))


def tracked(draw, xy, text, font, fill, tracking=0.0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking * S
    return x


def gradient_bg(top, bottom, accent1, accent2, accent_pos1=(0.85, 0.18), accent_pos2=(0.12, 0.9)):
    img = Image.new('RGB', (W, H), CREAM)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        # ease
        tt = t * t * (3 - 2 * t)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * tt) for i in range(3))
        d.line([(0, y), (W, y)], fill=c)
    img = add_glow(img, (W * accent_pos1[0], H * accent_pos1[1]), W * 0.55, accent1, 120)
    img = add_glow(img, (W * accent_pos2[0], H * accent_pos2[1]), W * 0.6, accent2, 80)
    return img


def add_glow(img, center, radius, color, alpha):
    gw = int(radius * 2)
    if gw < 8:
        return img
    # radial alpha
    small = Image.radial_gradient('L').resize((gw, gw), Image.Resampling.BILINEAR)
    # radial_gradient is dark center? use invert so center strong
    small = ImageOps.invert(small)
    mask = small.point(lambda v: int(v * alpha / 255))
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    solid = Image.new('RGBA', (gw, gw), color + (255,))
    layer.paste(solid, (int(center[0] - gw / 2), int(center[1] - gw / 2)), mask)
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def add_rings(img, cx, cy, radii, color, alpha=36, widths=(1, 1, 1), arcs=None):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, r in enumerate(radii):
        bbox = [cx - r, cy - r, cx + r, cy + r]
        d.ellipse(bbox, outline=color + (alpha,), width=max(1, int(widths[i] * S)))
    if arcs:
        for start, end, rad, col, a, wid in arcs:
            bbox = [cx - rad, cy - rad, cx + rad, cy + rad]
            d.arc(bbox, start=start, end=end, fill=col + (a,), width=max(1, int(wid * S)))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def add_grid(img, color=(150, 125, 105), alpha=9, step=40):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for x in range(0, W, step * S):
        d.line([(x, 0), (x, H)], fill=color + (alpha,), width=1)
    for y in range(0, H, step * S):
        d.line([(0, y), (W, y)], fill=color + (alpha,), width=1)
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def add_noise(img, amount=8):
    noise = Image.effect_noise((W, H), amount).convert('L')
    layer = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    rgba = Image.merge('RGBA', (noise, noise, noise, noise.point(lambda v: 18)))
    return Image.alpha_composite(img.convert('RGBA'), rgba).convert('RGB')


def warm_wash(img, alpha=26):
    layer = Image.new('RGBA', (W, H), (255, 226, 192, alpha))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def flame_shape(draw, cx, cy, w, h, fill):
    """尖顶 + 圆底的抽象火苗"""
    left = []
    right = []
    for i in range(21):
        t = i / 20.0
        y = cy - h * 0.52 + t * h * 0.64
        half = (w / 2.0) * (t ** 0.78)
        left.append((cx - half, y))
        right.append((cx + half, y))
    pts = [(cx, cy - h * 0.58)] + left + right[::-1]
    draw.polygon(pts, fill=fill)
    # 圆底，和尖顶自然衔接
    draw.ellipse([cx - w / 2, cy + h * 0.03, cx + w / 2, cy + h * 0.5], fill=fill)


def flame(draw, cx, cy, scale, alpha=255, core=True):
    w, h = 118 * scale, 174 * scale
    flame_shape(draw, cx, cy, w, h, (242, 154, 90, alpha))
    flame_shape(draw, cx, cy + 8 * scale, w * 0.72, h * 0.72, (247, 183, 112, alpha))
    flame_shape(draw, cx, cy + 20 * scale, w * 0.42, h * 0.44, (255, 222, 165, alpha))
    if core:
        flame_shape(draw, cx, cy + 36 * scale, w * 0.18, h * 0.22, (255, 248, 223, alpha))


def draw_header(draw, idx, total, accent=COPPER):
    # brand mark
    mx, my = 74 * S, 66 * S
    draw.ellipse([mx - 5 * S, my - 5 * S, mx + 5 * S, my + 5 * S], fill=accent)
    draw.ellipse([mx - 2 * S, my - 2 * S, mx + 2 * S, my + 2 * S], fill=CREAM)
    tracked(draw, (94 * S, 54 * S), 'OUR LITTLE FLAME', F(F_SERIF, 13), (90, 74, 62), 2.6)
    # index
    right = '0%d / 0%d' % (idx, total)
    w = draw.textlength(right, font=F(F_SERIF, 13))
    draw.text((W - 74 * S - w, 54 * S), right, font=F(F_SERIF, 13), fill=(150, 126, 108))
    # thin rule
    draw.line([(74 * S, 96 * S), (W - 74 * S, 96 * S)], fill=(180, 155, 132, 80), width=1)


def draw_footer(draw, accent=COPPER):
    y = 566 * S
    draw.line([(74 * S, y - 18 * S), (74 * S + 46 * S, y - 18 * S)], fill=accent, width=2 * S)
    draw.text((74 * S, y), '我们的小火苗', font=F(F_BOLD, 18), fill=(72, 56, 43))
    tracked(draw, (74 * S + 116 * S, y + 3 * S), 'A PRIVATE SPACE FOR TWO', F(F_SERIF, 11), (146, 122, 102), 1.7)


def headline(draw, lines, y=232, size=64, gap=86, color=INK, accent_index=-1, accent=COPPER):
    f_light = F(F_LIGHT, size)
    f_bold = F(F_BOLD, size)
    for i, line in enumerate(lines):
        f = f_bold if i == accent_index else f_light
        draw.text((74 * S, (y + i * gap) * S), line, font=f, fill=accent if i == accent_index else color)


def subcopy(draw, text, y=446, color=MUTED, size=24):
    draw.text((74 * S, y * S), text, font=F(F_REG, size), fill=color)


def card_home():
    img = gradient_bg((252, 247, 240), (247, 231, 216), (244, 186, 137), (232, 172, 163))
    img = add_grid(img)
    img = add_rings(img, 592 * S, 316 * S, [196 * S, 146 * S], COPPER, 36, (1, 1), arcs=[(200, 340, 196 * S, COPPER, 90, 2)])
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    flame(d, 592 * S, 306 * S, 1.28 * S, 255)
    # orbit dots
    for ang, r, col, sz in [(-40, 196, COPPER, 5), (120, 146, ROSE, 4), (210, 196, SAGE, 3)]:
        x = 592 * S + math.cos(math.radians(ang)) * r * S
        y = 316 * S + math.sin(math.radians(ang)) * r * S
        d.ellipse([x - sz * S, y - sz * S, x + sz * S, y + sz * S], fill=col)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 1, 9)
    headline(d, ['我们的小火苗', '把日子养成光'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '投喂 · 陪伴 · 连续守护，都是我们一起写下的', 462)
    draw_footer(d)
    return img


def card_spaces():
    img = gradient_bg((252, 248, 241), (246, 232, 217), (245, 194, 146), (201, 210, 180))
    img = add_grid(img)
    img = add_rings(img, 600 * S, 318 * S, [204 * S, 152 * S, 100 * S], COPPER, 28)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # central flame
    flame(d, 600 * S, 318 * S, 0.92 * S, 255)
    # three nodes
    nodes = [(420, 206, SAGE), (772, 220, ROSE), (748, 430, COPPER)]
    for x, y, col in nodes:
        d.ellipse([x * S - 8 * S, y * S - 8 * S, x * S + 8 * S, y * S + 8 * S], fill=col + (230,))
        d.ellipse([x * S - 3 * S, y * S - 3 * S, x * S + 3 * S, y * S + 3 * S], fill=CREAM + (255,))
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 2, 9)
    headline(d, ['和重要的人', '一起养一只火苗'], y=226, size=60, gap=82, accent_index=1)
    subcopy(d, '家人 · 恋人 · 朋友，每一段关系都有自己的小火苗', 462, size=21)
    draw_footer(d)
    return img


def card_chat():
    img = gradient_bg((252, 248, 243), (246, 233, 230), (238, 186, 176), (245, 205, 170))
    img = add_grid(img)
    img = add_rings(img, 610 * S, 320 * S, [186 * S], ROSE, 26)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # speech bubbles：放在右上/右侧，避开标题
    b1 = [604 * S, 136 * S, 782 * S, 244 * S]
    d.rounded_rectangle(b1, radius=26 * S, outline=COPPER + (170,), width=2 * S)
    b2 = [642 * S, 272 * S, 790 * S, 368 * S]
    d.rounded_rectangle(b2, radius=22 * S, fill=(255, 251, 246, 230), outline=ROSE + (160,), width=2 * S)
    d.polygon([(626 * S, 244 * S), (648 * S, 266 * S), (662 * S, 244 * S)], fill=COPPER + (170,))
    d.polygon([(720 * S, 368 * S), (744 * S, 388 * S), (744 * S, 358 * S)], fill=ROSE + (160,))
    # dots in bubble 2
    for i, col in enumerate([COPPER, ROSE, SAGE]):
        d.ellipse([(690 + i * 30) * S, 312 * S, (702 + i * 30) * S, 324 * S], fill=col)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 3, 9)
    headline(d, ['有些话', '只说给懂的人听'], y=226, size=62, gap=82, accent_index=1, accent=COPPER)
    subcopy(d, '两个人的悄悄话，安静地留在这里', 462)
    draw_footer(d)
    return img


def card_timeline():
    img = gradient_bg((252, 248, 240), (243, 229, 210), (246, 198, 140), (230, 174, 160))
    img = add_grid(img)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    frames = [
        (556, 128, 748, 296, (255, 252, 247, 235), COPPER),
        (578, 146, 770, 314, (250, 236, 219, 235), ROSE),
        (600, 164, 792, 332, (255, 247, 237, 245), COPPER),
    ]
    for x0, y0, x1, y1, fill, outline in frames:
        d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], radius=16 * S, fill=fill, outline=outline + (150,), width=2 * S)
    # photo lines & sun
    d.ellipse([650 * S, 300 * S, 690 * S, 340 * S], fill=(246, 183, 112, 220))
    d.line([(560 * S, 380 * S), (720 * S, 380 * S)], fill=COPPER + (90,), width=2 * S)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 4, 9)
    headline(d, ['把今天', '收进我们的时光'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '照片、文字，和那些不想忘记的瞬间', 462)
    draw_footer(d)
    return img


def card_anniversary():
    img = gradient_bg((252, 248, 242), (246, 229, 224), (235, 178, 169), (245, 206, 158))
    img = add_grid(img)
    img = add_rings(img, 610 * S, 316 * S, [208 * S, 158 * S], ROSE, 40, arcs=[(190, 350, 208 * S, COPPER, 100, 2)])
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # calendar / date ring
    d.ellipse([530 * S, 236 * S, 690 * S, 396 * S], outline=COPPER + (170,), width=2 * S)
    d.ellipse([562 * S, 268 * S, 658 * S, 364 * S], fill=(255, 249, 241, 235), outline=ROSE + (160,), width=2 * S)
    # tick marks
    for i in range(12):
        ang = math.radians(i * 30 - 90)
        x = 610 * S + math.cos(ang) * 80 * S
        y = 316 * S + math.sin(ang) * 80 * S
        d.ellipse([x - 2 * S, y - 2 * S, x + 2 * S, y + 2 * S], fill=COPPER + (180,))
    d.text((588 * S, 292 * S), '01', font=F(F_SERIF_B, 40), fill=COPPER)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 5, 9)
    headline(d, ['重要的日子', '值得被记住'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '纪念日不是数字，是我们一起走过的证据', 462)
    draw_footer(d)
    return img


def card_listen():
    img = gradient_bg((251, 248, 241), (235, 236, 226), (166, 186, 158), (233, 197, 163))
    img = add_grid(img)
    img = add_rings(img, 650 * S, 318 * S, [190 * S, 146 * S, 102 * S], SAGE, 34)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # sound arcs
    for i, r in enumerate([42, 70, 98, 126]):
        bbox = [(650 - r) * S, (318 - r) * S, (650 + r) * S, (318 + r) * S]
        d.arc(bbox, start=210, end=330, fill=(COPPER if i % 2 == 0 else SAGE) + (170 - i * 20,), width=2 * S)
    d.ellipse([640 * S, 308 * S, 660 * S, 328 * S], fill=COPPER + (230,))
    d.ellipse([645 * S, 313 * S, 655 * S, 323 * S], fill=CREAM + (255,))
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 6, 9)
    headline(d, ['有些话', '想慢慢说给你听'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '一条语音，留给最想听见的人', 462)
    draw_footer(d)
    return img


def card_create():
    img = gradient_bg((252, 248, 242), (247, 233, 216), (246, 194, 142), (236, 175, 160))
    img = add_grid(img)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # dashed ring
    cx, cy, r = 658 * S, 318 * S, 138 * S
    for i in range(36):
        a0 = i * 10
        d.arc([cx - r, cy - r, cx + r, cy + r], start=a0, end=a0 + 5, fill=COPPER + (110,), width=2 * S)
    # sparks
    for ang, ln in [(-90, 28), (-30, 16), (210, 22), (150, 12)]:
        a = math.radians(ang)
        x0 = cx + math.cos(a) * (r + 16 * S)
        y0 = cy + math.sin(a) * (r + 16 * S)
        x1 = cx + math.cos(a) * (r + (16 + ln) * S)
        y1 = cy + math.sin(a) * (r + (16 + ln) * S)
        d.line([(x0, y0), (x1, y1)], fill=COPPER + (160,), width=2 * S)
    flame(d, cx, cy, 1.0 * S, 255)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 7, 9)
    headline(d, ['给这段关系', '点亮一只火苗'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '选一个称呼，生成只属于你们的邀请', 462)
    draw_footer(d)
    return img


def card_join():
    img = gradient_bg((252, 248, 242), (245, 232, 222), (238, 185, 170), (245, 204, 160))
    img = add_grid(img)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # 信封：右上角，避开标题
    x0, y0, x1, y1 = 566 * S, 124 * S, 782 * S, 278 * S
    d.rounded_rectangle([x0, y0, x1, y1], radius=16 * S, outline=COPPER + (170,), width=2 * S)
    d.line([(x0, y0 + 8 * S), ((x0 + x1) // 2, (y0 + y1) // 2)], fill=COPPER + (120,), width=2 * S)
    d.line([(x1, y0 + 8 * S), ((x0 + x1) // 2, (y0 + y1) // 2)], fill=COPPER + (120,), width=2 * S)
    # seal
    d.ellipse([644 * S, 250 * S, 726 * S, 332 * S], fill=(198, 126, 88, 235), outline=(255, 246, 235, 240), width=3 * S)
    flame(d, 685 * S, 286 * S, 0.30 * S, 255)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 8, 9)
    headline(d, ['有人给你', '留了一只小火苗'], y=226, size=62, gap=82, accent_index=1)
    subcopy(d, '打开邀请，和 TA 一起把它养大', 462)
    draw_footer(d)
    return img


def card_bind():
    img = gradient_bg((252, 248, 242), (245, 231, 221), (238, 186, 174), (244, 203, 158))
    img = add_grid(img)
    img = add_rings(img, 610 * S, 318 * S, [178 * S, 128 * S], COPPER, 30)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # interlocking circles
    d.ellipse([500 * S, 240 * S, 640 * S, 380 * S], outline=COPPER + (170,), width=2 * S)
    d.ellipse([580 * S, 240 * S, 720 * S, 380 * S], outline=ROSE + (160,), width=2 * S)
    flame(d, 610 * S, 324 * S, 0.66 * S, 255)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    d = ImageDraw.Draw(img)
    draw_header(d, 9, 9)
    headline(d, ['两个人', '一只火苗'], y=226, size=64, gap=84, accent_index=1)
    subcopy(d, '只属于彼此的小空间，从今天开始', 462)
    draw_footer(d)
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    cards = [
        ('share-home.jpg', card_home),
        ('share-spaces.jpg', card_spaces),
        ('share-chat.jpg', card_chat),
        ('share-timeline.jpg', card_timeline),
        ('share-anniversary.jpg', card_anniversary),
        ('share-listen.jpg', card_listen),
        ('share-create.jpg', card_create),
        ('share-join.jpg', card_join),
        ('share-bind.jpg', card_bind),
    ]
    for name, fn in cards:
        img = fn()
        img = warm_wash(img)
        img = add_noise(img)
        img = ImageEnhance.Color(img).enhance(1.08)
        img = ImageEnhance.Contrast(img).enhance(1.03)
        img = img.resize((800, 640), Image.Resampling.LANCZOS)
        path = os.path.join(OUT, name)
        img.save(path, 'JPEG', quality=86, optimize=True, progressive=True)
        print(name, round(os.path.getsize(path) / 1024, 1), 'KB')


if __name__ == '__main__':
    main()
