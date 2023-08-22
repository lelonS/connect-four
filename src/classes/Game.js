class Game {
  constructor() {
    this.board = new Board();
    this.playerCount = this.board.playerCount;
    this.start();

    this.expectedPlrName = 0;
  }

  start() {
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const player = new Player('Player ' + (i + 1));
      this.players.push(player);
    }

    console.log('Use "game.inputName(name)" to set player names.');
    console.log('Player 1:');
  }

  inputName(name) {
    if (this.expectedPlrName < this.playerCount) {
      this.players[this.expectedPlrName].name = name
      this.expectedPlrName++;
      if (this.expectedPlrName < this.playerCount) {
        console.log('Player ' + (this.expectedPlrName + 1) + ':');
      } else {
        console.log('All players named.');
        console.log('Players:', this.players);
        this.waitForMove();
      }
    }
  }

  waitForMove() {
    this.board.render();
    console.log('Use "game.move(0-6) ' + this.players[this.board.turn].name);
  }

  move(col) {
    const success = this.board.makeMove(col);
    if (success) {
      console.log('Making move in column', col);
      this.waitForMove();
    }
  }
}