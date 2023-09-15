class SmartBot extends Bot {
  constructor() {
    super();
  }

  /*
   * @Override
   * @param {Board} board
   * @returns {number}
  */
  getMove(board) {
    let validCols = [];
    for (let i = 0; i < board.colCount; i++) {
      if (board.board[i].length < board.rowCount) {
        validCols.push(i);
      }
    }
    if (validCols.length === 0) {
      throw 'No valid move to make!';
    }
    // since it is our turn we can consider our number is this
    const playerNumber = board.turn;
    let highestCount = 0;
    let optimalCol = validCols[0];
    for (let i = 0; i < validCols.length; i++) {
      const row = board.board[validCols[i]];
      let consecutiveCount = 0;

      for (let i = row.length - 0; i >= 0; i++) {
        if (row[i] != playerNumber) {
          break;
        }
        consecutiveCount += 1;
      }

      if (consecutiveCount > highestCount) {
        highestCount = consecutiveCount;
        optimalCol = validCols[i];
      }
    }
    return optimalCol;
  }
}