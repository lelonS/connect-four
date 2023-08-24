class Game {
  get playerCount() { return this.board.playerCount; }

  constructor() {
    this.board = new Board();
    // Numbers below playerCount are used for naming player with that index.
    this.expectedInput = 0;

    this.start();
  }

  start() {
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const player = new Player('Player ' + (i + 1));
      this.players.push(player);
    }

    console.log('Use "game.input(\'name\')" to set player names.');
    console.log('Player 1:');
  }

  inputName(name) {
    this.players[this.expectedInput].name = name
    console.log('Player ' + name + ' added.');

    this.expectedInput++;
    if (this.expectedInput < this.playerCount) {
      console.log('Player ' + (this.expectedInput + 1) + ':');
    } else {
      console.log('All players named.');
      console.log('Players:', this.players);
      this.waitForMove();
    }
  }

  waitForMove() {
    this.board.writeToConsole();
    console.log(`Use "game.input(0-6)" ${this.players[this.board.turn].name}\'s turn (${this.board.turn})`);
  }

  move(col) {
    // Check if input is a number.
    if (typeof col !== 'number') { return; }

    const success = this.board.makeMove(col);
    if (success) {
      console.log('Making move in column', col);
      this.waitForMove();
    }
  }

  input(userInput) {
    if (this.expectedInput < this.playerCount) {
      this.inputName(userInput);
    } else {
      this.move(userInput);
    }
  }
}