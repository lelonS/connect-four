class RandomBot extends Bot {

  getMove(board) {
      // empty cols where we can make a move
      const validCols = [];
      for (let i = 0; i < board.colCount; i++) {
          if (board.board[i].length < board.rowCount) {
              validCols.push(i);
          }
      }
      if (validCols.length === 0) {
          throw new Error('no valid move');
      }
      // select a random col
      return validCols[Math.floor(Math.random() * (validCols.length))];
  }
}