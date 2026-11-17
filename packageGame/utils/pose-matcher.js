// packageGame/utils/pose-matcher.js
// 动作匹配与评分算法

// MoveNet COCO 17关键点定义
const KEYPOINT_NAMES = [
  'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
  'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
  'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
];

// 各关键点的评分权重
// 躯干和核心关节权重更高，末端肢体相对较低
const JOINT_WEIGHTS = {
  nose: 0.3,
  left_eye: 0.2, right_eye: 0.2,
  left_ear: 0.1, right_ear: 0.1,
  left_shoulder: 1.0, right_shoulder: 1.0,
  left_elbow: 0.8, right_elbow: 0.8,
  left_wrist: 0.7, right_wrist: 0.7,
  left_hip: 1.0, right_hip: 1.0,
  left_knee: 0.9, right_knee: 0.9,
  left_ankle: 0.7, right_ankle: 0.7
};

// 归一化基准的对（用于计算body height）
const HEIGHT_PAIRS = [
  ['nose', 'left_hip'],
  ['nose', 'right_hip'],
  ['left_shoulder', 'left_ankle'],
  ['right_shoulder', 'right_ankle']
];

/**
 * 计算两点之间的欧氏距离
 */
function euclideanDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 从关键点数组估计人体高度（归一化基准）
 * 使用肩膀到脚踝的距离作为主要参考
 * @param {Array} keypoints 17个关键点
 * @returns {number} 估计的身体高度
 */
function estimateBodyHeight(keypoints) {
  // 方法1：肩膀到脚踝
  const leftShoulder = keypoints[5];
  const rightShoulder = keypoints[6];
  const leftAnkle = keypoints[15];
  const rightAnkle = keypoints[16];

  let heights = [];

  if (leftShoulder.score > 0.3 && leftAnkle.score > 0.3) {
    heights.push(euclideanDistance(leftShoulder, leftAnkle));
  }
  if (rightShoulder.score > 0.3 && rightAnkle.score > 0.3) {
    heights.push(euclideanDistance(rightShoulder, rightAnkle));
  }

  // 方法2：肩膀到臀部的2.5倍
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];

  if (leftShoulder.score > 0.3 && leftHip.score > 0.3) {
    heights.push(euclideanDistance(leftShoulder, leftHip) * 2.5);
  }
  if (rightShoulder.score > 0.3 && rightHip.score > 0.3) {
    heights.push(euclideanDistance(rightShoulder, rightHip) * 2.5);
  }

  // 方法3：鼻子到臀部的2倍
  const nose = keypoints[0];
  if (nose.score > 0.3 && leftHip.score > 0.3) {
    heights.push(euclideanDistance(nose, leftHip) * 2);
  }

  if (heights.length === 0) {
    // 兜底：使用画面高度的一半
    return 200;
  }

  // 返回中位数（比均值更稳健）
  heights.sort((a, b) => a - b);
  return heights[Math.floor(heights.length / 2)];
}

/**
 * 匹配单帧姿态
 * @param {Array} currentPoints 当前用户17个关键点 [{x, y, score, name}]
 * @param {Array} targetPoints  目标标准17个关键点
 * @returns {{ score, details, warnings, top3 }}
 */
function matchPose(currentPoints, targetPoints) {
  if (!currentPoints || currentPoints.length !== 17 ||
      !targetPoints || targetPoints.length !== 17) {
    return { score: 0, details: [], warnings: ['关键点数据不完整'], top3: [] };
  }

  // 1. 估计身体高度用于归一化
  const bodyHeight = estimateBodyHeight(currentPoints);
  if (bodyHeight < 1) {
    return { score: 0, details: [], warnings: ['无法估计身体高度'], top3: [] };
  }

  // 2. 逐关节计算
  const details = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (let i = 0; i < 17; i++) {
    const curr = currentPoints[i];
    const target = targetPoints[i];
    const name = KEYPOINT_NAMES[i];
    const weight = JOINT_WEIGHTS[name] || 0.5;

    // 跳过低置信度的关键点
    if (curr.score < 0.2 || target.score < 0.2) {
      details.push({
        name,
        index: i,
        distance: -1,
        normDistance: -1,
        score: 0,
        skipped: true,
        warning: '置信度过低'
      });
      continue;
    }

    // 计算归一化距离
    const dist = euclideanDistance(curr, target);
    const normDist = dist / bodyHeight;

    // 评分：使用指数衰减
    // normDist = 0 → score = 100
    // normDist = 0.1 → score ≈ 61
    // normDist = 0.2 → score ≈ 25
    // normDist = 0.3 → score ≈ 8
    let jointScore = 100 * Math.exp(-12 * normDist);
    jointScore = Math.max(0, Math.min(100, jointScore));

    // 应用关键点置信度
    const effectiveScore = jointScore * Math.min(curr.score, target.score);

    details.push({
      name,
      index: i,
      distance: Math.round(dist * 10) / 10,
      normDistance: Math.round(normDist * 1000) / 1000,
      score: Math.round(effectiveScore),
      rawScore: Math.round(jointScore),
      skipped: false
    });

    totalWeightedScore += effectiveScore * weight;
    totalWeight += weight;
  }

  // 3. 计算总分
  const totalScore = totalWeight > 0 ?
    Math.round(totalWeightedScore / totalWeight) : 0;

  // 4. 找出偏差最大的前3个关节
  const activeDetails = details.filter(d => !d.skipped);
  activeDetails.sort((a, b) => a.score - b.score);
  const top3 = activeDetails.slice(0, 3).map(d => ({
    name: d.name,
    score: d.score,
    normDistance: d.normDistance
  }));

  // 5. 生成警告
  const warnings = [];
  if (top3.length > 0 && top3[0].score < 40) {
    warnings.push(`${KEYPOINT_CN[top3[0].name] || top3[0].name}偏差较大`);
  }
  if (activeDetails.filter(d => d.score < 30).length > 5) {
    warnings.push('整体姿态偏差较大，请调整姿势');
  }

  return { score: totalScore, details, warnings, top3 };
}

/**
 * 从模板帧序列中找到与当前时间戳最匹配的帧
 * 使用线性插值平滑过渡
 * @param {Array} templateFrames 模板帧数组 [{timestamp, keypoints}]
 * @param {number} currentTime 当前时间（毫秒）
 * @returns {{ keypoints, frameIndex, progress }}
 */
function findTargetFrame(templateFrames, currentTime) {
  if (!templateFrames || templateFrames.length === 0) {
    return null;
  }

  // 单帧模板（静态姿势）
  if (templateFrames.length === 1) {
    return {
      keypoints: templateFrames[0].keypoints,
      frameIndex: 0,
      progress: 1.0
    };
  }

  // 找到当前时间所在的帧区间
  let idx = 0;
  for (let i = 0; i < templateFrames.length; i++) {
    if (templateFrames[i].timestamp <= currentTime) {
      idx = i;
    } else {
      break;
    }
  }

  // 如果超过最后一帧
  if (idx >= templateFrames.length - 1) {
    return {
      keypoints: templateFrames[templateFrames.length - 1].keypoints,
      frameIndex: templateFrames.length - 1,
      progress: 1.0
    };
  }

  // 线性插值
  const t0 = templateFrames[idx].timestamp;
  const t1 = templateFrames[idx + 1].timestamp;
  const ratio = t1 > t0 ? (currentTime - t0) / (t1 - t0) : 0;

  const p0 = templateFrames[idx].keypoints;
  const p1 = templateFrames[idx + 1].keypoints;

  const interpolated = [];
  for (let i = 0; i < 17; i++) {
    interpolated.push({
      name: KEYPOINT_NAMES[i],
      x: p0[i].x + (p1[i].x - p0[i].x) * ratio,
      y: p0[i].y + (p1[i].y - p0[i].y) * ratio,
      score: Math.min(p0[i].score, p1[i].score)
    });
  }

  const totalDuration = templateFrames[templateFrames.length - 1].timestamp;
  return {
    keypoints: interpolated,
    frameIndex: idx,
    progress: totalDuration > 0 ? currentTime / totalDuration : 0
  };
}

/**
 * 加载动作模板
 * @param {string} templatePath 模板JSON文件路径
 * @returns {Promise<object>} 模板数据
 */
function loadTemplate(templatePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: templatePath,
      encoding: 'utf8',
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (e) {
          reject(new Error('模板文件格式错误'));
        }
      },
      fail: (err) => {
        reject(new Error('无法读取模板文件: ' + err.errMsg));
      }
    });
  });
}

/**
 * 综合报告：从帧记录数组生成最终报告
 * @param {Array} records 记录数组 [{timestamp, score, top3, warnings}]
 * @returns {{ avgScore, minScore, maxScore, passRate, weakestJoints, timeline }}
 */
function generateReport(records) {
  if (!records || records.length === 0) {
    return {
      avgScore: 0, minScore: 0, maxScore: 0,
      passRate: 0, weakestJoints: [], timeline: []
    };
  }

  const scores = records.map(r => r.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const passRate = Math.round(scores.filter(s => s >= 60).length / scores.length * 100);

  // 统计最弱关节出现频率
  const jointFailCount = {};
  records.forEach(r => {
    if (r.top3) {
      r.top3.forEach(j => {
        if (j.score < 60) {
          jointFailCount[j.name] = (jointFailCount[j.name] || 0) + 1;
        }
      });
    }
  });

  const weakestJoints = Object.entries(jointFailCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      label: KEYPOINT_CN[name] || name,
      frequency: Math.round(count / records.length * 100)
    }));

  // 时间线（每秒取一个样本）
  const timeline = [];
  for (let i = 0; i < records.length; i += 10) {
    timeline.push({
      time: Math.round(records[i].timestamp / 1000),
      score: records[i].score
    });
  }

  return { avgScore, minScore, maxScore, passRate, weakestJoints, timeline };
}

// 中文关节名映射
const KEYPOINT_CN = {
  nose: '鼻尖',
  left_eye: '左眼', right_eye: '右眼',
  left_ear: '左耳', right_ear: '右耳',
  left_shoulder: '左肩', right_shoulder: '右肩',
  left_elbow: '左肘', right_elbow: '右肘',
  left_wrist: '左腕', right_wrist: '右腕',
  left_hip: '左髋', right_hip: '右髋',
  left_knee: '左膝', right_knee: '右膝',
  left_ankle: '左踝', right_ankle: '右踝'
};

module.exports = {
  matchPose,
  findTargetFrame,
  loadTemplate,
  generateReport,
  estimateBodyHeight,
  euclideanDistance,
  KEYPOINT_NAMES,
  KEYPOINT_CN,
  JOINT_WEIGHTS
};
