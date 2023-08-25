const GameStates = Object.freeze({
  Playing: 'playing',
  Win: 'win',
  Draw: 'draw'
});

const Directions = Object.freeze({
  UpRight: { colDir: 1, rowDir: 1 },
  Right: { colDir: 1, rowDir: 0 },
  DownRight: { colDir: 1, rowDir: -1 },
  Down: { colDir: 0, rowDir: -1 }
});

class Board {
  get playerCount() { return 2; }
  get colCount() { return 7; }
  get rowCount() { return 6; }
  get winCount() { return 4; }

  get checkDraw() {
    for (let i = 0; i < this.colCount; i++) {
      if (this.board[i].length < this.rowCount) {
        return false;
      }
    }
    return true;
  }

  constructor() {
    this.gameState = GameStates.Playing;
    this.turn = 0;
    this.winner = null;

    this.createEmptyBoard();
  }

  createEmptyBoard() {
    this.board = [];
    for (let i = 0; i < this.colCount; i++) {
      this.board.push([]);
    }
  }

  nextTurn() {
    this.turn = (this.turn + 1) % this.playerCount;
  }

  makeMove(col) {
    if (col < 0 || col >= this.colCount) {
      return false;
    }
    // Make move
    this.board[col].push(this.turn);

    // Check win
    const lastRow = this.board[col].length - 1;
    if (this.checkWinAt(col, lastRow)) {
      this.gameState = GameStates.Win;
      this.winner = this.turn;
    } else if (this.checkDraw) {
      this.gameState = GameStates.Draw;
    }

    this.nextTurn();
    return true;
  }

  #countInDirection(col, row, colDir, rowDir) {
    const player = this.board[col][row];
    if (player === undefined) { return 0; }

    let count = 0;

    for (let i = 1; i < this.winCount; i++) {
      const c = col + i * colDir;
      const r = row + i * rowDir;
      // Check if out of bounds
      if (c < 0 || c >= this.colCount || r < 0 || r >= this.rowCount) { break; }
      // Check if cell is the same player, if not don't count and stop
      const cell = this.board[c][r];
      if (cell !== player) { break; }
      count++;
    }
    return count;
  }

  checkWinAt(col, row) {
    const directions = [Directions.UpRight, Directions.Right, Directions.DownRight, Directions.Down];

    for (const { colDir, rowDir } of directions) {
      const count = this.#countInDirection(col, row, colDir, rowDir);
      const countOpposite = this.#countInDirection(col, row, -colDir, -rowDir);
      if (count + countOpposite + 1 >= this.winCount) {
        return true;
      }
    }
    return false;
  }

  writeToConsole() {
    let output = '';
    for (let row = this.rowCount - 1; row >= 0; row--) {
      for (let col = 0; col < this.colCount; col++) {
        const cell = this.board[col][row];
        output += cell === undefined ? '_' : cell;
      }
      output += '\n';
    }
    console.log(output);
  }
}