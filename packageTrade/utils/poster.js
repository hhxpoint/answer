const PAPER = '#F5F0E7';
const INK = '#221D18';
const MUTED = '#7C6B59';
const RULE = 'rgba(65, 48, 34, 0.16)';
const ACCENT = '#9A5A3B';
const SAGE = '#637363';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function wrap(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = String(text || '').split('');
  let line = '';
  let lines = [];
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = chars[i];
      if (lines.length >= (maxLines || 4)) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < (maxLines || 4)) lines.push(line);
  lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lineHeight); });
  return y + lines.length * lineHeight;
}

function drawLaptop(ctx, x, y, w, accent) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  // screen
  ctx.strokeStyle = 'rgba(34, 29, 24, 0.44)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 16, y, w - 32, h(w) * 0.62 * 0.9);
  // base
  ctx.beginPath();
  ctx.moveTo(x, y + h(w) * 0.62 * 0.9 + 12);
  ctx.lineTo(x + w, y + h(w) * 0.62 * 0.9 + 12);
  ctx.lineTo(x + w - 14, y + h(w) * 0.62 * 0.9 + 30);
  ctx.lineTo(x + 14, y + h(w) * 0.62 * 0.9 + 30);
  ctx.closePath();
  ctx.stroke();
  // screen glow line
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(x + 34, y + 12);
  ctx.lineTo(x + 34, y + h(w) * 0.62 * 0.9 - 8);
  ctx.stroke();
  ctx.restore();
}

function h(w) {
  return w * 0.62;
}

function draw(ctx, data, width, height) {
  const W = width;
  const H = height;
  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  // paper rules
  ctx.strokeStyle = 'rgba(65, 48, 34, 0.07)';
  ctx.lineWidth = 1;
  for (let y = 64; y < H; y += 42) {
    ctx.beginPath();
    ctx.moveTo(56, y);
    ctx.lineTo(W - 56, y);
    ctx.stroke();
  }

  // header
  ctx.fillStyle = MUTED;
  ctx.font = '18px "SF Mono", Menlo, monospace';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SECOND NOTES / APPRAISAL', 56, 74);
  ctx.textAlign = 'right';
  ctx.fillText(data.dateText || '', W - 56, 74);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(65, 48, 34, 0.24)';
  ctx.beginPath();
  ctx.moveTo(56, 92);
  ctx.lineTo(W - 56, 92);
  ctx.stroke();

  // title
  ctx.fillStyle = INK;
  ctx.font = '600 48px "Songti SC", "STSong", "Noto Serif SC", serif';
  ctx.fillText('游戏本二手估价单', 56, 170);

  ctx.fillStyle = MUTED;
  ctx.font = '22px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText('型号 / 配置 / 成色 / 参考区间', 58, 206);

  // laptop mark
  drawLaptop(ctx, 570, 128, 120, ACCENT);

  // model block
  ctx.fillStyle = INK;
  ctx.font = '600 34px "Songti SC", "STSong", serif';
  wrap(ctx, data.modelName, 56, 286, 620, 44, 2);

  ctx.fillStyle = MUTED;
  ctx.font = '22px "PingFang SC", sans-serif';
  ctx.fillText(data.brand + ' · ' + data.year + ' 款', 58, 334);
  ctx.fillText(data.variantLabel, 58, 366);

  // rule
  ctx.strokeStyle = 'rgba(65, 48, 34, 0.24)';
  ctx.beginPath();
  ctx.moveTo(56, 398);
  ctx.lineTo(W - 56, 398);
  ctx.stroke();

  // price block
  ctx.fillStyle = MUTED;
  ctx.font = '18px "SF Mono", Menlo, monospace';
  ctx.fillText('REFERENCE RANGE', 56, 440);
  ctx.fillStyle = INK;
  ctx.font = '600 64px "Songti SC", "STSong", serif';
  ctx.fillText(data.rangeText, 56, 506);

  // three prices
  const cols = [
    { label: '快速出手', value: data.quickText },
    { label: '合理挂价', value: data.fairText },
    { label: '耐心价', value: data.patientText }
  ];
  cols.forEach(function (c, i) {
    const x = 56 + i * 216;
    ctx.fillStyle = MUTED;
    ctx.font = '18px "PingFang SC", sans-serif';
    ctx.fillText(c.label, x, 558);
    ctx.fillStyle = i === 1 ? ACCENT : INK;
    ctx.font = '600 30px "Songti SC", "STSong", serif';
    ctx.fillText(c.value, x, 594);
  });

  // condition card
  ctx.strokeStyle = 'rgba(65, 48, 34, 0.18)';
  roundRect(ctx, 56, 632, W - 112, 136, 14);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 251, 245, 0.46)';
  ctx.fill();

  const facts = [
    ['成色', data.conditionLabel],
    ['电池', data.batteryLabel],
    ['维修', data.repairLabel],
    ['配件', data.accessoryLabel],
    ['屏幕', data.screenLabel]
  ];
  facts.forEach(function (f, i) {
    const x = 82 + (i % 2) * 300;
    const y = 664 + Math.floor(i / 2) * 34;
    ctx.fillStyle = MUTED;
    ctx.font = '16px "PingFang SC", sans-serif';
    ctx.fillText(f[0], x, y);
    ctx.fillStyle = INK;
    ctx.font = '500 19px "PingFang SC", sans-serif';
    ctx.fillText(f[1], x + 44, y);
  });

  // custom price
  if (data.customText) {
    ctx.fillStyle = MUTED;
    ctx.font = '18px "PingFang SC", sans-serif';
    ctx.fillText('卖家报价', 56, 824);
    ctx.fillStyle = ACCENT;
    ctx.font = '600 32px "Songti SC", "STSong", serif';
    ctx.fillText(data.customText, 168, 826);
    ctx.fillStyle = MUTED;
    ctx.font = '18px "PingFang SC", sans-serif';
    ctx.fillText('自述价格 · 非平台成交价', 288, 824);
  }

  // footer
  ctx.strokeStyle = 'rgba(65, 48, 34, 0.24)';
  ctx.beginPath();
  ctx.moveTo(56, 884);
  ctx.lineTo(W - 56, 884);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.font = '17px "PingFang SC", sans-serif';
  ctx.fillText('个人估价 · 仅供参考 · 不构成交易凭证', 56, 920);
  ctx.fillText('数据基准 ' + (data.updatedAt || '2026-11') + ' / 非真机验机结果', 56, 950);
  ctx.textAlign = 'right';
  ctx.fillStyle = SAGE;
  ctx.font = '16px "SF Mono", Menlo, monospace';
  ctx.fillText('HHXPOINT / 2026', W - 56, 950);
  ctx.textAlign = 'left';
  ctx.restore();
}

module.exports = { draw: draw };
