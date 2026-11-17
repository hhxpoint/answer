// packageGame/utils/canvas-render.js
// Canvas骨骼绘制引擎

// MoveNet COCO 17关键点连线
const SKELETON_CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 4],     // 头部
  [5, 6],                               // 肩膀连线
  [5, 7], [7, 9],                       // 左臂
  [6, 8], [8, 10],                      // 右臂
  [5, 11], [6, 12], [11, 12],           // 躯干
  [11, 13], [13, 15],                   // 左腿
  [12, 14], [14, 16]                    // 右腿
];

// 颜色定义
const COLORS = {
  userBone: '#00ff88',          // 用户骨骼 - 绿色
  userBoneGlow: 'rgba(0, 255, 136, 0.3)',
  targetBone: 'rgba(100, 180, 255, 0.5)', // 目标骨骼 - 半透明蓝
  targetBoneSolid: '#64b4ff',
  warningJoint: '#ff4444',       // 偏差关节 - 红色
  warningGlow: 'rgba(255, 68, 68, 0.5)',
  normalJoint: '#ffffff',        // 正常关节
  scoreGood: '#00ff88',
  scoreOk: '#ffcc00',
  scoreBad: '#ff4444',
  overlayBg: 'rgba(0, 0, 0, 0.6)'
};

/**
 * 在Canvas上绘制用户骨骼
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} keypoints 17个关键点
 * @param {number} canvasW Canvas宽度
 * @param {number} canvasH Canvas高度
 * @param {object} options 可选配置
 */
function drawUserSkeleton(ctx, keypoints, canvasW, canvasH, options = {}) {
  if (!keypoints || keypoints.length < 17) return;

  const { lineWidth = 4, jointRadius = 6, mirror = true } = options;

  // 如果是前置摄像头，水平镜像
  const getX = mirror ? (x) => canvasW - x : (x) => x;

  // 1. 绘制连线（骨骼）
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  SKELETON_CONNECTIONS.forEach(([i, j]) => {
    const p1 = keypoints[i];
    const p2 = keypoints[j];
    if (p1.score < 0.2 || p2.score < 0.2) return;

    // 发光效果
    ctx.strokeStyle = COLORS.userBoneGlow;
    ctx.lineWidth = lineWidth + 4;
    ctx.beginPath();
    ctx.moveTo(getX(p1.x), p1.y);
    ctx.lineTo(getX(p2.x), p2.y);
    ctx.stroke();

    // 主线
    ctx.strokeStyle = COLORS.userBone;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(getX(p1.x), p1.y);
    ctx.lineTo(getX(p2.x), p2.y);
    ctx.stroke();
  });

  // 2. 绘制关键点
  keypoints.forEach((kp) => {
    if (kp.score < 0.2) return;
    const x = getX(kp.x);
    const y = kp.y;

    // 发光环
    ctx.fillStyle = COLORS.userBoneGlow;
    ctx.beginPath();
    ctx.arc(x, y, jointRadius + 3, 0, Math.PI * 2);
    ctx.fill();

    // 实心圆
    ctx.fillStyle = COLORS.userBone;
    ctx.beginPath();
    ctx.arc(x, y, jointRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * 在Canvas上绘制目标（标准）骨骼
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} keypoints 17个关键点
 * @param {number} canvasW Canvas宽度
 * @param {number} canvasH Canvas高度
 * @param {object} options
 */
function drawTargetSkeleton(ctx, keypoints, canvasW, canvasH, options = {}) {
  if (!keypoints || keypoints.length < 17) return;

  const { lineWidth = 3, jointRadius = 5, mirror = true, opacity = 0.5 } = options;
  const getX = mirror ? (x) => canvasW - x : (x) => x;

  ctx.globalAlpha = opacity;

  // 连线
  ctx.strokeStyle = COLORS.targetBoneSolid;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.setLineDash([8, 6]); // 虚线区分

  SKELETON_CONNECTIONS.forEach(([i, j]) => {
    const p1 = keypoints[i];
    const p2 = keypoints[j];
    if (p1.score < 0.2 || p2.score < 0.2) return;

    ctx.beginPath();
    ctx.moveTo(getX(p1.x), p1.y);
    ctx.lineTo(getX(p2.x), p2.y);
    ctx.stroke();
  });

  ctx.setLineDash([]); // 恢复实线

  // 关节点
  keypoints.forEach((kp) => {
    if (kp.score < 0.2) return;
    const x = getX(kp.x);
    const y = kp.y;

    ctx.strokeStyle = COLORS.targetBoneSolid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, jointRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
}

/**
 * 高亮偏差过大的关节（红色标记）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} keypoints 用户关键点
 * @param {Array} top3Worst 偏差最大的前3个 [{name, score}]
 * @param {number} canvasW
 * @param {number} canvasH
 */
function drawWarningJoints(ctx, keypoints, top3Worst, canvasW, canvasH, mirror = true) {
  if (!top3Worst || top3Worst.length === 0) return;

  const getX = mirror ? (x) => canvasW - x : (x) => x;
  const nameIndex = {};
  const KEYPOINT_NAMES = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
  ];
  KEYPOINT_NAMES.forEach((n, i) => { nameIndex[n] = i; });

  top3Worst.forEach((w) => {
    const idx = nameIndex[w.name];
    if (idx === undefined) return;
    const kp = keypoints[idx];
    if (!kp || kp.score < 0.2) return;

    const x = getX(kp.x);
    const y = kp.y;

    // 红色发光警告
    ctx.fillStyle = COLORS.warningGlow;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // 红色圆圈
    ctx.strokeStyle = COLORS.warningJoint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();

    // 叉号标记
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.moveTo(x + 5, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.stroke();
  });
}

/**
 * 绘制实时分数显示
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} score 0-100
 * @param {number} canvasW
 * @param {number} canvasH
 */
function drawScore(ctx, score, canvasW, canvasH) {
  const x = 20;
  const y = 20;
  const barW = 150;
  const barH = 12;

  // 背景
  ctx.fillStyle = COLORS.overlayBg;
  roundRect(ctx, x - 10, y - 10, barW + 60, 60, 8);
  ctx.fill();

  // 分数数字
  const scoreColor = score >= 80 ? COLORS.scoreGood :
                     score >= 50 ? COLORS.scoreOk : COLORS.scoreBad;
  ctx.fillStyle = scoreColor;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(`${score}`, x, y + 22);

  // 分数条
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, x + 50, y + 8, barW, barH, 6);
  ctx.fill();

  ctx.fillStyle = scoreColor;
  roundRect(ctx, x + 50, y + 8, barW * (score / 100), barH, 6);
  ctx.fill();

  // "匹配度" 标签
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '12px sans-serif';
  ctx.fillText('匹配度', x + 50, y + 38);
}

/**
 * 绘制警告信息
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} warnings
 * @param {number} canvasW
 * @param {number} canvasH
 */
function drawWarnings(ctx, warnings, canvasW, canvasH) {
  if (!warnings || warnings.length === 0) return;

  const x = canvasW / 2;
  const y = canvasH - 80;

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  roundRect(ctx, x - 140, y - 16, 280, 36, 8);
  ctx.fill();

  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(warnings[0], x, y + 5);
  ctx.textAlign = 'left';
}

/**
 * 绘制推理耗时
 */
function drawDebugInfo(ctx, inferenceTime, fps, canvasW) {
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`推理: ${inferenceTime}ms | FPS: ${fps}`, canvasW - 10, 20);
  ctx.textAlign = 'left';
}

/**
 * 清空Canvas
 */
function clearCanvas(ctx, canvasW, canvasH) {
  ctx.clearRect(0, 0, canvasW, canvasH);
}

/**
 * 绘制圆角矩形辅助函数
 */
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
  drawUserSkeleton,
  drawTargetSkeleton,
  drawWarningJoints,
  drawScore,
  drawWarnings,
  drawDebugInfo,
  clearCanvas,
  SKELETON_CONNECTIONS,
  COLORS
};
