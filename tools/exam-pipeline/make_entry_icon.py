# -*- coding: utf-8 -*-
"""生成公考题库入口图标（96×96 RGBA）——竖向渐变 + 试卷 + 朱砂勾。"""
import os
from PIL import Image, ImageDraw

OUT = r'D:\dsh\workplace\work\answer\hhxpoint-answer-1848759\assets\exam-entry.png'
S = 96
SS = 4


def vgrad(size, top, bottom, radius):
    w, h = size
    grad = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    px = grad.load()
    for y in range(h):
        t = y / float(h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b, 255)
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    grad.putalpha(mask)
    return grad


def main():
    W = S * SS
    im = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    tile = vgrad((88 * SS, 88 * SS), (72, 108, 182), (33, 58, 112), 24 * SS)
    im.paste(tile, (4 * SS, 4 * SS), tile)

    d = ImageDraw.Draw(im)
    # 纸片
    d.rounded_rectangle((26 * SS, 19 * SS, 70 * SS, 79 * SS), radius=6 * SS, fill=(255, 253, 248, 255))
    # 折角
    d.polygon([(59 * SS, 19 * SS), (70 * SS, 19 * SS), (70 * SS, 31 * SS)], fill=(228, 230, 238, 255))
    # 文字行
    for i, y in enumerate((33, 43, 53)):
        w = (28, 22, 26)[i]
        d.rounded_rectangle((32 * SS, y * SS, (32 + w) * SS, (y + 3.5) * SS), radius=1.75 * SS,
                            fill=(160, 170, 188, 255))
    # 朱砂勾
    d.line([(35 * SS, 66 * SS), (41 * SS, 72 * SS)], fill=(181, 68, 44, 255), width=int(3.4 * SS))
    d.line([(41 * SS, 72 * SS), (55 * SS, 59 * SS)], fill=(181, 68, 44, 255), width=int(3.4 * SS))

    im = im.resize((S, S), Image.LANCZOS)
    im.save(OUT)
    print('icon ->', OUT, os.path.getsize(OUT), 'bytes')


if __name__ == '__main__':
    main()
