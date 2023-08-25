
const GameStates = Object.freeze({
  Playing: 'playing',
  Win: 'win',
  Draw: 'draw'
});

class Board {
  get playerCount() { return 2; }
  get colCount() { return 7; }
  get rowCount() { return 6; }

  constructor() {
    this.gameState = GameStates.Playing;
    this.turn = 0;

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
    this.nextTurn();
    return true;
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