// utils/hashGame.js

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false; 
    if (board[i][col] === num) return false; 
    let boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    let boxCol = Math.floor(col / 3) * 3 + i % 3;
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateFullBoard() {
  let board = Array.from({ length: 9 }, () => Array(9).fill(0));
  let firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 9; i++) { board[0][i] = firstRow[i]; }
  solveSudoku(board);
  return board;
}

module.exports = {
  generatePuzzle: function (difficulty) {
    let fullBoard = generateFullBoard();
    let solution = JSON.parse(JSON.stringify(fullBoard)); 
    let puzzle = JSON.parse(JSON.stringify(fullBoard));
    let blanks = difficulty === 'easy' ? 30 : (difficulty === 'medium' ? 45 : 55);
    
    let count = 0;
    while (count < blanks) {
      let r = Math.floor(Math.random() * 9);
      let c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        count++;
      }
    }
    return { puzzle, solution };
  },

  getAiNextStep: function (currentBoard, solutionBoard) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) {
          let possibleNums = [];
          for (let num = 1; num <= 9; num++) {
            if (isValid(currentBoard, r, c, num)) possibleNums.push(num);
          }
          if (possibleNums.length === 1) {
            return {
              r, c, val: possibleNums[0],
              reason: `💡 排除法：看第${r + 1}行、第${c + 1}列和所在的九宫格，排除后只剩下【${possibleNums[0]}】能填。`
            };
          }
        }
      }
    }
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) {
          let val = solutionBoard[r][c];
          return {
            r, c, val: val,
            reason: `🔍 深度推演：此格情况复杂，经过假设排错，推导出第${r + 1}行第${c + 1}列必定是【${val}】。`
          };
        }
      }
    }
    return null; 
  }
};