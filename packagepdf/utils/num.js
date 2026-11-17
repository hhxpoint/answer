// utils/num.js
class SliderGame {
  constructor(size) {
    this.size = size;
    this.board = [];
  }

  init() {
    this.board = [];
    const total = this.size * this.size;
    for (let i = 0; i < total - 1; i++) {
      this.board.push(i + 1);
    }
    this.board.push(0); 
    this.shuffle();
    return this.board;
  }

  shuffle() {
    let emptyIndex = this.board.length - 1;
    const moves = this.size === 3 ? 150 : 300; 
    
    for (let i = 0; i < moves; i++) {
      const validMoves = this.getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      this.swap(emptyIndex, randomMove);
      emptyIndex = randomMove;
    }
  }

  getValidMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / this.size);
    const col = emptyIndex % this.size;
    if (row > 0) moves.push(emptyIndex - this.size); // 上
    if (row < this.size - 1) moves.push(emptyIndex + this.size); // 下
    if (col > 0) moves.push(emptyIndex - 1); // 左
    if (col < this.size - 1) moves.push(emptyIndex + 1); // 右
    return moves;
  }

  swap(i, j) {
    let temp = this.board[i];
    this.board[i] = this.board[j];
    this.board[j] = temp;
  }

  move(index) {
    const emptyIndex = this.board.indexOf(0);
    if (this.getValidMoves(emptyIndex).includes(index)) {
      this.swap(index, emptyIndex);
      return true;
    }
    return false;
  }

  checkWin() {
    const total = this.size * this.size;
    for (let i = 0; i < total - 1; i++) {
      if (this.board[i] !== i + 1) return false;
    }
    return this.board[total - 1] === 0;
  }
}

module.exports = { SliderGame };