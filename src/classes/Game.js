class Game {
  get playerCount() { return this.board.playerCount; }

  constructor() {
    this.reset();
  }

  reset() {
    this.board = new Board();
    // Numbers below playerCount are used for naming player with that index.
    this.expectedInput = 0;
    this.start();
  }

  start() {
    const colors = ['🔴', '🔵']
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const player = new Player('player', colors[i]);
      this.players.push(player);
    }

    console.log('Use "game.input(\'name\')" to set player names.');
    console.log('Player 1:');
  }

  renderBoard() {
    const emptyCell = '⚪';
    let output = '';
    // Add board to output
    for (let row = this.board.rowCount - 1; row >= 0; row--) {
      for (let col = 0; col < this.board.colCount; col++) {
        const playerIndex = this.board.getCell(col, row);
        const cellColor = playerIndex === null ? emptyCell : this.players[playerIndex].color;
        output += cellColor;
      }
      output += '\n';
    }

    // Add column numbers to output
    const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
    for (let col = 0; col < this.board.colCount; col++) {
      output += numbers[col];
    }

    console.log(output);
  }

  inputName(name) {
    if (!Player.isValidName(name)) {
      console.log('Invalid name. Only alphabetical values');
      return;
    }

    this.players[this.expectedInput].name = name
    console.log('Player ' + this.players[this.expectedInput].toString() + ' added.');

    this.expectedInput++;
    if (this.expectedInput < this.playerCount) {
      console.log('Player ' + (this.expectedInput + 1) + ':');
    } else {
      console.log('All players named.');
      // console.log('Players:', this.players);
      this.waitForMove();
    }
  }

  waitForMove() {
    this.renderBoard();

    // Write result to console
    if (this.board.gameState === Board.GameStates.Draw) {
      console.log('Draw!');
    } else if (this.board.gameState === Board.GameStates.Win) {
      const winnerIndex = this.board.winner;
      console.log(`Winner ${this.players[winnerIndex].toString()}!`);
    }

    if (this.board.gameState === Board.GameStates.Playing) {
      console.log(`Use "game.input(0-6)" ${this.players[this.board.turn].toString()}\'s turn`);
    } else {
      // Game is not playing
      console.log('Game over. Use "game.reset()" to start a new game.');
    }
  }

  move(col) {
    // Check if input is a number.
    if (typeof col !== 'number') { return; }
    if (!Number.isInteger(col)) { return; }

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