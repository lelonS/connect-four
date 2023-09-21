class SmartBot extends Bot {

  constructor(name, plrNumber) {
    super(name, plrNumber);
    this.winCombos = this.calcAllWinCombos();
  }

  calcAllWinCombos() {
    const baseCombos = [
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [1, 1], [2, 2], [3, 3]],
      [[0, 0], [-1, 1], [-2, 2], [-3, 3]]
    ];
    let winningCombos = [];
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 6; row++) {
        for (const baseCombo of baseCombos) {
          // Move combo to current cell
          let combo = baseCombo.map(([c, r]) => [c + col, r + row]);
          winningCombos.push(combo);
        }

      }
    }
    // Filter out combos that are out of bounds
    return winningCombos.filter(co => co.every(([c, r]) => c >= 0 && c < 7 && r >= 0 && r < 6));;
  }

  getLegalMoves(board) {
    const legalMoves = [];
    for (let col = 0; col < board.colCount; col++) {
      if (board.isValidMove(col)) {
        legalMoves.push(col);
      }
    }
    return legalMoves;
  }

  countColors(board, combo, color) {
    // Get cells in combo from board and count how many are the given color
    return combo.map(([col, row]) => board.getCell(col, row)).filter(cell => cell === color).length;
  }

  calcMoveScore(board, move) {
    // Make move on a copy of the board
    const boardAfterMove = board.copy();
    boardAfterMove.makeMove(move);

    const ownColor = board.turn;
    const opponentColor = boardAfterMove.turn;

    let score = 0
    for (const combo of this.winCombos) {
      let countBeforeMove = {
        own: this.countColors(board, combo, ownColor),
        opponent: this.countColors(board, combo, opponentColor)
      };
      let countAfterMove = {
        own: this.countColors(boardAfterMove, combo, ownColor),
      };
      score +=
        (countAfterMove.own === 4 && Infinity) ||
        (countBeforeMove.opponent === 3 && countBeforeMove.own === 0 && countAfterMove.own === 1 && 69 ** 6) ||
        (countBeforeMove.opponent === 2 && countBeforeMove.own === 0 && countAfterMove.own === 1 && 69 ** 5) ||
        (countBeforeMove.opponent === 1 && countBeforeMove.own === 0 && countAfterMove.own === 1 && 69 ** 3.05) ||
        (countAfterMove.own === 3 && countBeforeMove.own === 2 && countBeforeMove.opponent === 0 && 69 ** 3) ||
        (countAfterMove.own === 2 && countBeforeMove.own === 1 && countBeforeMove.opponent === 0 && 69 ** 3) ||
        (countAfterMove.own === 1 && countBeforeMove.own === 0 && countBeforeMove.opponent === 0 && 69 ** 3) || 0;
    };
    return score;

  }


  getMove(board, checkOppMove = true) {
    const legalMoves = this.getLegalMoves(board).map(col => ({ col }));

    for (const move of legalMoves) {


      move.score = this.calcMoveScore(board, move.col);

      if (checkOppMove && move.score !== Infinity && legalMoves.length > 1) {
        // adjust based on opponents best move after my move
        // for now only adjust if the opponent can win in next move
        const boardAfterMove = board.copy();
        boardAfterMove.makeMove(move.col);
        let opMove = this.getMove(boardAfterMove, false);
        boardAfterMove.makeMove(opMove);
        if (boardAfterMove.gameState === Board.GameStates.Win) {
          move.score = -Infinity;
        }
      }
    }

    legalMoves.sort((x, y) => {
      if (x.score === y.score) {
        if (x[0] > y[0]) { return -1; } // higher row prio
        return [-1, 1][Math.floor(Math.random() * 2)];
      }
      return x.score > y.score ? -1 : 1;
    });

    return legalMoves[0].col;
  }
}