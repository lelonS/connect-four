class RandomBot extends Bot {
  constructor() {
    super();
  }
  /*
   * @Override
   * @param {Board} board
   * @returns {number}
  */
  getMove(board) {
    // empty cols where we can make a move
    const validCols = [];
    for (let i = 0; i < board.colCount; i++) {
      if (board.board[i].length < board.rowCount) {
        validCols.push(i);
      }
    }
    if (validCols.length === 0) {
      throw 'No valid move to make!';
    }
    // select a random col
    return validCols[Math.floor(Math.random() * (validCols.length))];
  }
}