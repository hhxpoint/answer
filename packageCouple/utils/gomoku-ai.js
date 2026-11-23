// 五子棋 AI：调用 hhxpoint.me 上已有的 Rapfi 强力引擎；失败时本地启发式兜底。
// 服务器坐标：字母 A-O + 行号 1-15（1 在下），本地坐标 row 0 在上。
const AI_URL = 'https://hhxpoint.me/api/gomoku-best-move';
const SIZE = 15;

const LEVELS = {
  easy: { key: 'easy', name: '入门', thinkMs: 300, blunder: 0.38 },
  medium: { key: 'medium', name: '进阶', thinkMs: 1200, blunder: 0.08 },
  hard: { key: 'hard', name: '挑战', thinkMs: 3800, blunder: 0 }
};

function toFront(row, col) {
  return String.fromCharCode(65 + col) + (SIZE - row);
}
function fromFront(move) {
  if (!move || typeof move !== 'string') return null;
  const m = move.trim().toLowerCase();
  const col = m.charCodeAt(0) - 97;
  const num = parseInt(m.slice(1), 10);
  if (!isFinite(col) || !isFinite(num) || col < 0 || col >= SIZE || num < 1 || num > SIZE) return null;
  return { x: SIZE - num, y: col };
}
function inBounds(x, y) { return x >= 0 && x < SIZE && y >= 0 && y < SIZE; }

function candidates(board) {
  const out = [];
  const seen = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== 0) continue;
      let near = false;
      for (let dr = -2; dr <= 2 && !near; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc) && board[nr][nc] !== 0) { near = true; break; }
        }
      }
      if (near) {
        const k = r + ',' + c;
        if (!seen[k]) { seen[k] = 1; out.push({ x: r, y: c }); }
      }
    }
  }
  if (!out.length) out.push({ x: 7, y: 7 });
  return out;
}

function lineCount(board, x, y, dx, dy, color) {
  let n = 1;
  for (let k = 1; k < 5; k++) {
    const nx = x + dx * k, ny = y + dy * k;
    if (!inBounds(nx, ny) || board[nx][ny] !== color) break;
    n++;
  }
  for (let k = 1; k < 5; k++) {
    const nx = x - dx * k, ny = y - dy * k;
    if (!inBounds(nx, ny) || board[nx][ny] !== color) break;
    n++;
  }
  return n;
}

function scorePoint(board, x, y, color) {
  let s = 0;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let i = 0; i < dirs.length; i++) {
    const n = lineCount(board, x, y, dirs[i][0], dirs[i][1], color);
    if (n >= 5) s += 100000;
    else if (n === 4) s += 9000;
    else if (n === 3) s += 700;
    else if (n === 2) s += 45;
  }
  return s;
}

function localBest(board, color) {
  const opp = color === 1 ? 2 : 1;
  const cs = candidates(board);
  let win = null;
  let block = null;
  for (let i = 0; i < cs.length; i++) {
    const p = cs[i];
    if (!win) {
      board[p.x][p.y] = color;
      if (scorePoint(board, p.x, p.y, color) >= 100000) win = p;
      board[p.x][p.y] = 0;
    }
    if (win) break;
  }
  if (win) return win;
  for (let i = 0; i < cs.length; i++) {
    const p = cs[i];
    if (!block) {
      board[p.x][p.y] = opp;
      if (scorePoint(board, p.x, p.y, opp) >= 100000) block = p;
      board[p.x][p.y] = 0;
    }
    if (block) break;
  }
  if (block) return block;
  let best = cs[0];
  let bestScore = -1;
  for (let i = 0; i < cs.length; i++) {
    const p = cs[i];
    const mine = scorePoint(board, p.x, p.y, color);
    const theirs = scorePoint(board, p.x, p.y, opp);
    let center = 30 - (Math.abs(p.x - 7) + Math.abs(p.y - 7));
    if (center < 0) center = 0;
    const sc = mine + theirs * 0.9 + center;
    if (sc > bestScore) { bestScore = sc; best = p; }
  }
  return best;
}

function randomMove(board) {
  const cs = candidates(board);
  return cs[Math.floor(Math.random() * cs.length)];
}

function requestMove(moves, difficulty) {
  const level = LEVELS[difficulty] || LEVELS.medium;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: AI_URL,
      method: 'POST',
      data: { moves: moves, think_ms: level.thinkMs },
      timeout: 15000,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        const d = res.data || {};
        if (!d.move) {
          reject({ code: 'NO_MOVE', msg: d.error || 'AI 没有返回落子' });
          return;
        }
        const p = fromFront(d.move);
        if (!p) {
          reject({ code: 'BAD_MOVE', msg: 'AI 坐标异常' });
          return;
        }
        resolve({ x: p.x, y: p.y, engine: 'rapfi', thinkMs: level.thinkMs });
      },
      fail: function () {
        reject({ code: 'NETWORK', msg: 'AI 连接失败' });
      }
    });
  });
}

function choose(options) {
  options = options || {};
  const moves = options.moves || [];
  const board = options.board;
  const color = options.color || 2;
  const difficulty = options.difficulty || 'medium';
  const level = LEVELS[difficulty] || LEVELS.medium;
  const frontMoves = moves.map(function (m) { return toFront(m.x, m.y); });
  return requestMove(frontMoves, difficulty).then(function (p) {
    if (!inBounds(p.x, p.y) || board[p.x][p.y] !== 0) {
      return localBest(board, color);
    }
    // 入门难度保留一点人情味，避免每局都被引擎碾压
    if (level.blunder > 0 && Math.random() < level.blunder) {
      return randomMove(board);
    }
    return p;
  }).catch(function () {
    return localBest(board, color);
  });
}

module.exports = {
  LEVELS: LEVELS,
  toFront: toFront,
  fromFront: fromFront,
  localBest: localBest,
  choose: choose
};
