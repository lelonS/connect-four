class Game {
  constructor() {
    this.playerCount = 2;
    this.createPlayers();

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
}