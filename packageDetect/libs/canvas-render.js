// packageDetect/libs/canvas-render.js
// 目标检测 Canvas 绘制引擎
// 绘制 bbox、标签、置信度、调试信息

var COLORS = {
  digitBbox: '#00ff88',
  digitLabel: '#00ff88',
  yoloBbox: '#00ff88',
  yoloLabel: '#00ff88',
  labelBg: 'rgba(0, 0, 0, 0.7)',
  labelText: '#ffffff',
  confBar: '#00ff88',
  confBarBg: 'rgba(255, 255, 255, 0.2)',
  overlayBg: 'rgba(0, 0, 0, 0.6)',
  debugText: 'rgba(255, 255, 255, 0.5)'
};

var YOLO_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F1948A', '#82E0AA', '#F8C471', '#AED6F1', '#D7BDE2'
];

function clearCanvas(ctx, canvasW, canvasH) {
  ctx.clearRect(0, 0, canvasW, canvasH);
}

// 绘制数字检测结果
function drawDigitDetections(ctx, digits, canvasW, canvasH) {
  if (!digits || digits.length === 0) return;

  for (var i = 0; i < digits.length; i++) {
    var d = digits[i];
    var x = d.x, y = d.y, w = d.w, h = d.h;

    // 检测框
    ctx.strokeStyle = COLORS.digitBbox;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // 标签背景
    var label = d.digit + ' (' + Math.round(d.confidence * 100) + '%)';
    ctx.font = 'bold 18px sans-serif';
    var tw = ctx.measureText(label).width;
    ctx.fillStyle = COLORS.labelBg;
    roundRect(ctx, x, y - 28, tw + 16, 26, 4);
    ctx.fill();

    // 标签文字
    ctx.fillStyle = COLORS.digitLabel;
    ctx.fillText(label, x + 8, y - 8);
  }
}

// 绘制 YOLO 检测结果
function drawYoloDetections(ctx, detections, canvasW, canvasH) {
  if (!detections || detections.length === 0) return;

  for (var i = 0; i < detections.length; i++) {
    var d = detections[i];
    var color = YOLO_COLORS[d.classId % YOLO_COLORS.length];

    var x1 = d.x1, y1 = d.y1, x2 = d.x2, y2 = d.y2;
    var bw = x2 - x1, bh = y2 - y1;

    // 检测框
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, bw, bh);

    // 标签
    var label = d.className + ' ' + Math.round(d.score * 100) + '%';
    ctx.font = 'bold 16px sans-serif';
    var tw = ctx.measureText(label).width;
    var labelH = 24;
    var labelY = y1 > labelH + 4 ? y1 - labelH - 4 : y1;

    // 标签背景
    ctx.fillStyle = color;
    roundRect(ctx, x1, labelY, tw + 16, labelH, 4);
    ctx.fill();

    // 标签文字
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, x1 + 8, labelY + 17);

    // 置信度条
    var barY = y1 + bh + 4;
    if (barY + 6 < canvasH) {
      ctx.fillStyle = COLORS.confBarBg;
      ctx.fillRect(x1, barY, bw, 4);
      ctx.fillStyle = color;
      ctx.fillRect(x1, barY, bw * d.score, 4);
    }
  }
}

// 绘制统计信息
function drawStats(ctx, stats, canvasW, canvasH) {
  var x = 12;
  var y = 12;
  var lineHeight = 20;

  ctx.fillStyle = COLORS.overlayBg;
  var boxW = 180;
  var boxH = lineHeight * stats.length + 16;
  roundRect(ctx, x - 8, y - 8, boxW, boxH, 8);
  ctx.fill();

  ctx.font = '14px sans-serif';
  for (var i = 0; i < stats.length; i++) {
    ctx.fillStyle = stats[i].color || '#ffffff';
    ctx.fillText(stats[i].text, x, y + 12 + i * lineHeight);
  }
}

// 绘制调试信息（右上角）
function drawDebugInfo(ctx, inferenceTime, fps, canvasW) {
  ctx.fillStyle = COLORS.debugText;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('推理: ' + inferenceTime + 'ms | FPS: ' + fps, canvasW - 10, 20);
  ctx.textAlign = 'left';
}

// 绘制加载提示
function drawLoadingOverlay(ctx, canvasW, canvasH, text) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text || '加载中...', canvasW / 2, canvasH / 2);
  ctx.textAlign = 'left';
}

// 绘制空状态提示
function drawEmptyState(ctx, canvasW, canvasH, text) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text || '未检测到目标', canvasW / 2, canvasH / 2);
  ctx.textAlign = 'left';
}

// 绘制数字识别结果面板（底部）
function drawDigitResultPanel(ctx, result, canvasW, canvasH) {
  if (!result) return;

  var panelH = 80;
  var panelY = canvasH - panelH - 10;
  var panelX = 10;
  var panelW = canvasW - 20;

  // 背景
  ctx.fillStyle = COLORS.overlayBg;
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.fill();

  if (result.digit >= 0) {
    // 大号数字
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('' + result.digit, canvasW / 2, panelY + 52);

    // 置信度
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px sans-serif';
    ctx.fillText('置信度: ' + Math.round(result.confidence * 100) + '%', canvasW / 2, panelY + 72);
  } else {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('未识别到数字', canvasW / 2, panelY + 45);
  }

  ctx.textAlign = 'left';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

module.exports = {
  clearCanvas: clearCanvas,
  drawDigitDetections: drawDigitDetections,
  drawYoloDetections: drawYoloDetections,
  drawStats: drawStats,
  drawDebugInfo: drawDebugInfo,
  drawLoadingOverlay: drawLoadingOverlay,
  drawEmptyState: drawEmptyState,
  drawDigitResultPanel: drawDigitResultPanel,
  COLORS: COLORS,
  YOLO_COLORS: YOLO_COLORS
};
