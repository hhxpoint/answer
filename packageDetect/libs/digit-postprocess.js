// packageDetect/libs/digit-postprocess.js
// 手写数字检测后处理：灰度化 → 二值化 → 轮廓检测 → 数字区域提取
// 纯 JS 实现，无需 OpenCV

var MIN_REGION_SIZE = 15;
var MAX_REGION_RATIO = 5.0;

// 灰度化
function toGrayscale(imageData) {
  var d = imageData.data;
  var n = imageData.width * imageData.height;
  var gray = new Uint8Array(n);
  for (var i = 0; i < n; i++) {
    var idx = i * 4;
    gray[i] = Math.round(d[idx] * 0.299 + d[idx+1] * 0.587 + d[idx+2] * 0.114);
  }
  return gray;
}

// 自适应阈值二值化（局部均值法）
function adaptiveThreshold(gray, w, h, blockSize, C) {
  blockSize = blockSize || 15;
  C = C || 8;
  var binary = new Uint8Array(w * h);
  var half = Math.floor(blockSize / 2);

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sum = 0;
      var count = 0;
      var y1 = Math.max(0, y - half);
      var y2 = Math.min(h - 1, y + half);
      var x1 = Math.max(0, x - half);
      var x2 = Math.min(w - 1, x + half);

      for (var ny = y1; ny <= y2; ny++) {
        for (var nx = x1; nx <= x2; nx++) {
          sum += gray[ny * w + nx];
          count++;
        }
      }

      var mean = sum / count;
      binary[y * w + x] = gray[y * w + x] > (mean - C) ? 0 : 1;
    }
  }

  return binary;
}

// 连通区域标记（简化版 flood fill）
function findContours(binary, w, h) {
  var visited = new Uint8Array(w * h);
  var contours = [];
  var minPixels = MIN_REGION_SIZE;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var idx = y * w + x;
      if (binary[idx] === 1 && visited[idx] === 0) {
        var region = floodFill(binary, visited, w, h, x, y);
        if (region.pixels >= minPixels) {
          contours.push(region);
        }
      }
    }
  }

  return contours;
}

// Flood fill 连通区域提取
function floodFill(binary, visited, w, h, startX, startY) {
  var stack = [startY * w + startX];
  var minX = startX, maxX = startX, minY = startY, maxY = startY;
  var pixels = 0;

  while (stack.length > 0) {
    var idx = stack.pop();
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx] === 1 || binary[idx] !== 1) continue;

    visited[idx] = 1;
    pixels++;
    var px = idx % w;
    var py = Math.floor(idx / w);

    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;

    stack.push(idx - 1);     // 左
    stack.push(idx + 1);     // 右
    stack.push(idx - w);     // 上
    stack.push(idx + w);     // 下
  }

  return {
    x: minX, y: minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
    pixels: pixels
  };
}

// 合并重叠区域
function mergeOverlappingRegions(regions) {
  if (regions.length <= 1) return regions;

  var merged = [];
  var used = new Array(regions.length);
  for (var i = 0; i < used.length; i++) used[i] = false;

  for (var i = 0; i < regions.length; i++) {
    if (used[i]) continue;
    var group = [regions[i]];
    used[i] = true;

    for (var j = i + 1; j < regions.length; j++) {
      if (used[j]) continue;
      if (regionsOverlap(regions[i], regions[j])) {
        group.push(regions[j]);
        used[j] = true;
      }
    }

    var minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    for (var k = 0; k < group.length; k++) {
      if (group[k].x < minX) minX = group[k].x;
      if (group[k].y < minY) minY = group[k].y;
      if (group[k].x + group[k].w > maxX) maxX = group[k].x + group[k].w;
      if (group[k].y + group[k].h > maxY) maxY = group[k].y + group[k].h;
    }

    merged.push({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
  }

  return merged;
}

// 判断两个区域是否重叠或紧邻
function regionsOverlap(a, b) {
  var margin = 5;
  return !(a.x - margin > b.x + b.w || a.x + a.w + margin < b.x ||
           a.y - margin > b.y + b.h || a.y + a.h + margin < b.y);
}

// 过滤不合理区域
function filterRegions(regions, imgW, imgH) {
  var maxArea = imgW * imgH * 0.5;
  return regions.filter(function(r) {
    if (r.w < MIN_REGION_SIZE || r.h < MIN_REGION_SIZE) return false;
    if (r.w * r.h > maxArea) return false;
    var ratio = r.w / r.h;
    if (ratio > MAX_REGION_RATIO || ratio < 1 / MAX_REGION_RATIO) return false;
    return true;
  });
}

// 添加 padding
function addPadding(regions, imgW, imgH, padding) {
  padding = padding || 5;
  return regions.map(function(r) {
    return {
      x: Math.max(0, r.x - padding),
      y: Math.max(0, r.y - padding),
      w: Math.min(imgW, r.x + r.w + padding) - Math.max(0, r.x - padding),
      h: Math.min(imgH, r.y + r.h + padding) - Math.max(0, r.y - padding)
    };
  });
}

// 主函数：从图像中找到数字区域
function findDigitRegions(imageData, imgW, imgH) {
  var gray = toGrayscale(imageData);
  var binary = adaptiveThreshold(gray, imgW, imgH, 15, 8);
  var contours = findContours(binary, imgW, imgH);
  var filtered = filterRegions(contours, imgW, imgH);
  var merged = mergeOverlappingRegions(filtered);
  var padded = addPadding(merged, imgW, imgH, 5);
  return padded;
}

// 判断是否为深色像素
function isDarkPixel(imageData, x, y, w) {
  var idx = (y * w + x) * 4;
  var gray = imageData.data[idx] * 0.299 + imageData.data[idx+1] * 0.587 + imageData.data[idx+2] * 0.114;
  return gray < 128;
}

module.exports = {
  findDigitRegions: findDigitRegions,
  toGrayscale: toGrayscale,
  adaptiveThreshold: adaptiveThreshold,
  isDarkPixel: isDarkPixel
};
