// 五子棋纯逻辑（无 wx 依赖，可在 Node 里测试）
const SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

function createBoard() {
  const b = [];
  for (let r = 0; r < SIZE; r++) {
    b.push(new Array(SIZE).fill(EMPTY));
  }
  return b;
}

function inBounds(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function checkWin(board, row, col, color) {
  if (!board || !inBounds(row, col) || !color) return null;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let d = 0; d < dirs.length; d++) {
    const dr = dirs[d][0];
    const dc = dirs[d][1];
    const line = [[row, col]];
    let r = row - dr;
    let c = col - dc;
    while (inBounds(r, c) && board[r][c] === color) {
      line.unshift([r, c]);
      r -= dr;
      c -= dc;
    }
    r = row + dr;
    c = col + dc;
    while (inBounds(r, c) && board[r][c] === color) {
      line.push([r, c]);
      r += dr;
      c += dc;
    }
    if (line.length >= 5) return line;
  }
  return null;
}

function isDraw(board, moves) {
  if (moves && moves.length >= SIZE * SIZE) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === EMPTY) return false;
    }
  }
  return true;
}

function applyMove(board, row, col, color) {
  if (!board || !inBounds(row, col) || board[row][col] !== EMPTY) return false;
  board[row][col] = color;
  return true;
}

function rebuild(moves) {
  const board = createBoard();
  (moves || []).forEach(function (m) {
    if (!m) return;
    if (inBounds(m.x, m.y)) board[m.x][m.y] = m.c;
  });
  return board;
}

module.exports = {
  SIZE: SIZE,
  EMPTY: EMPTY,
  BLACK: BLACK,
  WHITE: WHITE,
  createBoard: createBoard,
  checkWin: checkWin,
  isDraw: isDraw,
  applyMove: applyMove,
  rebuild: rebuild
};
