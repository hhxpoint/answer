// packageDetect/libs/yolo-postprocess.js
// YOLOv8 后处理：输出解码 + NMS
// 支持 TFJS 导出的两种输出格式

var COCO_CLASSES = [
  'person','bicycle','car','motorcycle','airplane','bus','train','truck','boat',
  'traffic light','fire hydrant','stop sign','parking meter','bench','bird','cat',
  'dog','horse','sheep','cow','elephant','bear','zebra','giraffe','backpack',
  'umbrella','handbag','tie','suitcase','frisbee','skis','snowboard','sports ball',
  'kite','baseball bat','baseball glove','skateboard','surfboard','tennis racket',
  'bottle','wine glass','cup','fork','knife','spoon','bowl','banana','apple',
  'sandwich','orange','broccoli','carrot','hot dog','pizza','donut','cake','chair',
  'couch','potted plant','bed','dining table','toilet','tv','laptop','mouse',
  'remote','keyboard','cell phone','microwave','oven','toaster','sink',
  'refrigerator','book','clock','vase','scissors','teddy bear','hair drier',
  'toothbrush'
];

var DEFAULT_CONF_THRESHOLD = 0.25;
var DEFAULT_IOU_THRESHOLD = 0.45;

function decode(rawData, outputShape, inputSize, imgW, imgH) {
  var numClasses = COCO_CLASSES.length;
  var confThresh = DEFAULT_CONF_THRESHOLD;
  var iouThresh = DEFAULT_IOU_THRESHOLD;

  var candidates;

  // 检测输出格式
  if (outputShape.length === 3 && outputShape[1] === numClasses + 4) {
    // [1, 84, 8400] 格式 (ultralytics ONNX 直出)
    candidates = decodeFormat84(rawData, outputShape, numClasses, imgW, imgH, inputSize);
  } else if (outputShape.length === 3 && outputShape[2] === numClasses + 4) {
    // [1, 8400, 84] 格式 (TFJS converter 可能转置)
    candidates = decodeFormat8400(rawData, outputShape, numClasses, imgW, imgH, inputSize);
  } else if (outputShape.length === 4 && outputShape[3] === numClasses + 4) {
    // [1, H, W, 84] 格式 (简化模型输出)
    candidates = decodeFormatHW84(rawData, outputShape, numClasses, imgW, imgH, inputSize);
  } else {
    console.warn('[YOLO] 未知输出格式:', outputShape);
    candidates = [];
  }

  // 按类别分组做 NMS
  var finalDetections = nmsByClass(candidates, iouThresh);

  return finalDetections;
}

// 解码 [1, 84, 8400] 格式
function decodeFormat84(rawData, shape, numClasses, imgW, imgH, inputSize) {
  var channels = shape[1]; // 84
  var numAnchors = shape[2]; // 8400
  var candidates = [];

  for (var a = 0; a < numAnchors; a++) {
    // rawData 布局: [batch, channel, anchor] → rawData[b * channels * numAnchors + c * numAnchors + a]
    var cx = rawData[0 * numAnchors + a];
    var cy = rawData[1 * numAnchors + a];
    var w = rawData[2 * numAnchors + a];
    var h = rawData[3 * numAnchors + a];

    var bestClass = -1;
    var bestScore = 0;
    for (var c = 0; c < numClasses; c++) {
      var score = rawData[(4 + c) * numAnchors + a];
      if (score > bestScore) {
        bestScore = score;
        bestClass = c;
      }
    }

    if (bestScore < DEFAULT_CONF_THRESHOLD) continue;

    // YOLOv8 输出已经是像素坐标 (相对于输入尺寸)
    // 需要缩放到原图尺寸
    var scaleX = imgW / inputSize;
    var scaleY = imgH / inputSize;

    candidates.push({
      x1: Math.max(0, (cx - w / 2) * scaleX),
      y1: Math.max(0, (cy - h / 2) * scaleY),
      x2: Math.min(imgW, (cx + w / 2) * scaleX),
      y2: Math.min(imgH, (cy + h / 2) * scaleY),
      score: bestScore,
      classId: bestClass,
      className: COCO_CLASSES[bestClass]
    });
  }

  return candidates;
}

// 解码 [1, 8400, 84] 格式
function decodeFormat8400(rawData, shape, numClasses, imgW, imgH, inputSize) {
  var numAnchors = shape[1]; // 8400
  var stride = shape[2]; // 84
  var candidates = [];

  for (var a = 0; a < numAnchors; a++) {
    var base = a * stride;
    var cx = rawData[base];
    var cy = rawData[base + 1];
    var w = rawData[base + 2];
    var h = rawData[base + 3];

    var bestClass = -1;
    var bestScore = 0;
    for (var c = 0; c < numClasses; c++) {
      var score = rawData[base + 4 + c];
      if (score > bestScore) {
        bestScore = score;
        bestClass = c;
      }
    }

    if (bestScore < DEFAULT_CONF_THRESHOLD) continue;

    var scaleX = imgW / inputSize;
    var scaleY = imgH / inputSize;

    candidates.push({
      x1: Math.max(0, (cx - w / 2) * scaleX),
      y1: Math.max(0, (cy - h / 2) * scaleY),
      x2: Math.min(imgW, (cx + w / 2) * scaleX),
      y2: Math.min(imgH, (cy + h / 2) * scaleY),
      score: bestScore,
      classId: bestClass,
      className: COCO_CLASSES[bestClass]
    });
  }

  return candidates;
}

// 解码 [1, H, W, 84] 格式 (简化模型输出)
function decodeFormatHW84(rawData, shape, numClasses, imgW, imgH, inputSize) {
  var h = shape[1];
  var w = shape[2];
  var channels = shape[3]; // 84
  var candidates = [];

  var cellH = inputSize / h;
  var cellW = inputSize / w;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var base = (y * w + x) * channels;
      var cx = rawData[base];
      var cy = rawData[base + 1];
      var bw = rawData[base + 2];
      var bh = rawData[base + 3];

      var bestClass = -1;
      var bestScore = 0;
      for (var c = 0; c < numClasses; c++) {
        var score = rawData[base + 4 + c];
        if (score > bestScore) {
          bestScore = score;
          bestClass = c;
        }
      }

      if (bestScore < DEFAULT_CONF_THRESHOLD) continue;

      // 坐标转换: 相对于 cell 的坐标 -> 输入图像坐标
      var absCx = (x + cx) * cellW;
      var absCy = (y + cy) * cellH;
      var absW = bw * inputSize;
      var absH = bh * inputSize;

      var scaleX = imgW / inputSize;
      var scaleY = imgH / inputSize;

      candidates.push({
        x1: Math.max(0, (absCx - absW / 2) * scaleX),
        y1: Math.max(0, (absCy - absH / 2) * scaleY),
        x2: Math.min(imgW, (absCx + absW / 2) * scaleX),
        y2: Math.min(imgH, (absCy + absH / 2) * scaleY),
        score: bestScore,
        classId: bestClass,
        className: COCO_CLASSES[bestClass]
      });
    }
  }

  return candidates;
}

// 按类别分组 NMS
function nmsByClass(candidates, iouThresh) {
  // 按类别分组
  var classGroups = {};
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].classId;
    if (!classGroups[cid]) classGroups[cid] = [];
    classGroups[cid].push(candidates[i]);
  }

  var results = [];
  var classIds = Object.keys(classGroups);
  for (var g = 0; g < classIds.length; g++) {
    var group = classGroups[classIds[g]];
    var kept = nms(group, iouThresh);
    for (var k = 0; k < kept.length; k++) {
      results.push(kept[k]);
    }
  }

  // 按置信度降序排列
  results.sort(function(a, b) { return b.score - a.score; });
  return results;
}

// 标准 NMS (贪心算法)
function nms(dets, iouThresh) {
  if (dets.length === 0) return [];

  // 按 score 降序排序
  dets.sort(function(a, b) { return b.score - a.score; });

  var picked = [];
  var active = new Array(dets.length);
  for (var i = 0; i < active.length; i++) active[i] = true;

  for (var i = 0; i < dets.length; i++) {
    if (!active[i]) continue;
    picked.push(dets[i]);

    for (var j = i + 1; j < dets.length; j++) {
      if (!active[j]) continue;
      var iou = computeIoU(dets[i], dets[j]);
      if (iou > iouThresh) {
        active[j] = false;
      }
    }
  }

  return picked;
}

// 计算 IoU (Intersection over Union)
function computeIoU(a, b) {
  var x1 = Math.max(a.x1, b.x1);
  var y1 = Math.max(a.y1, b.y1);
  var x2 = Math.min(a.x2, b.x2);
  var y2 = Math.min(a.y2, b.y2);

  var interW = Math.max(0, x2 - x1);
  var interH = Math.max(0, y2 - y1);
  var interArea = interW * interH;

  var areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  var areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
  var unionArea = areaA + areaB - interArea;

  return unionArea > 0 ? interArea / unionArea : 0;
}

module.exports = {
  decode: decode,
  COCO_CLASSES: COCO_CLASSES,
  computeIoU: computeIoU,
  nms: nms
};
