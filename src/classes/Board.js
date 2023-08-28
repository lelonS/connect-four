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

  getCell(col, row) {
    // Check if out of bounds
    if (col < 0 || col >= this.colCount || row < 0 || row >= this.rowCount) {
      return null;
    }
    const cell = this.board[col][row];
    // If cell is undefined (empty), return null. Otherwise return the cell (player index).
    return cell === undefined ? null : cell;
  }

  nextTurn() {
    this.turn = (this.turn + 1) % this.playerCount;
  }

  isValidMove(col) {
    if (this.gameState !== GameStates.Playing) {
      console.log("The game is over.");
      return false;
    }

    if (col < 0 || col >= this.colCount) {
      console.log("Invalid column.");
      return false;
    }

    if (this.board[col].length >= this.rowCount) {
      console.log("Column is full.");
      return false;
    }

    return true;
  }

  makeMove(col) {
    if (!this.isValidMove(col)) { return false; }

    this.board[col].push(this.turn);

    // Check result
    const lastRow = this.board[col].length - 1;
    if (this.checkWinAt(col, lastRow)) {
      this.gameState = GameStates.Win;
      this.winner = this.turn;
    } else if (this.checkDraw()) {
      this.gameState = GameStates.Draw;
    }

    // Next turn
    this.nextTurn();
    return true;
  }

  checkDraw() {
    for (let col = 0; col < this.colCount; col++) {
      if (this.board[col].length < this.rowCount) {
        return false;
      }
    }
    return true;
  }

  #countInDirection(col, row, colDir, rowDir) {
    const player = this.getCell(col, row);
    if (player === null) { return 0; }

    let count = 0;

    for (let i = 1; i < this.winCount; i++) {
      const colCheck = col + i * colDir;
      const rowCheck = row + i * rowDir;
      // Check if cell is the same player, if not don't count and stop
      const cell = this.getCell(colCheck, rowCheck);
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
}