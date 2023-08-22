class Game {
  constructor() {
    this.board = new Board();
    this.playerCount = this.board.playerCount;
    this.createPlayers();
    this.waitForMove();

    console.log('Players:', this.players);
  }

  createPlayers() {
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const player = new Player();
      player.setNameFromInput(i + 1);
      this.players.push(player);
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