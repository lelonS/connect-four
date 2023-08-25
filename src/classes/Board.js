const GameStates = Object.freeze({
  Playing: 'playing',
  Win: 'win',
  Draw: 'draw'
});

class Board {
  get playerCount() { return 2; }
  get colCount() { return 7; }
  get rowCount() { return 6; }

  get isFull() {
      for (let i = 0; i < this.colCount; i++) {
          if (this.board[i].length !== this.rowCount) {
              return false;
          }
      }
      return true;
  }

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

  makeMove(col) {
      if (col < 0 || col >= this.colCount) {
          return false;
      }
      this.board[col].push(this.turn);
      if (this.isFull) {
          this.gameState = GameStates.Draw;
          console.log('game is drawed!');
      } else {
          this.nextTurn();
      }
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