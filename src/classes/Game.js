class Game {
  constructor() {
    this.board = new Board();
    this.playerCount = this.board.playerCount;
    this.createPlayers();
    this.waitForMove();

    this.expectedPlrName = 0;

    // console.log('Players:', this.players);
  }

  createPlayers() {
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
      }
    }
  }

  waitForMove() {
    this.board.render();
    console.log('Waiting for move... ' + this.players[this.board.turn].name);
  }
  move(col) {
    console.log('Making move in column', col);
    this.board.makeMove(col);
    this.waitForMove();
  }
}