class Game {
  constructor() {
    this.playerCount = 2;
    this.createPlayers();

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
}