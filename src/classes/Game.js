class Game {
  get playerCount() { return this.board.playerCount; }

  constructor() {
    this.addEventListeners();
    this.reset();
  }

  reset() {
    this.board = new Board();
    // Numbers below playerCount are used for naming player with that index.
    this.expectedInput = 0;
    this.renderBoard();
    this.start();
  }

  start() {
    const colors = ['red', 'yellow']
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const player = new Player('player', colors[i]);
      this.players.push(player);
    }

    console.log('Use "game.input(\'name\')" to set player names.');
    console.log('Player 1:');
  }

  renderBoard() {
    // Get .board element
    const boardElement = document.querySelector('.board');
    // Clear board
    boardElement.innerHTML = '';

    //Create columns
    for (let col = 0; col < this.board.colCount; col++) {
      const colElement = document.createElement('div');
      colElement.classList.add('column');
      boardElement.appendChild(colElement);

      // Create cells
      for (let row = 0; row < this.board.rowCount; row++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        colElement.appendChild(cellElement);

        // Get cell value
        const cellValue = this.board.getCell(col, row);
        if (cellValue !== null) {
          const player = this.players[cellValue];
          cellElement.style.backgroundColor = player.color;
        }
      }
    }
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
    if (typeof col !== 'number') { console.log('Move must be integer'); return; }
    if (!Number.isInteger(col)) { console.log('Move must be integer'); return; }
    if (!this.board.isValidMove(col)) { console.log('Move not allowed'); return; }

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

  addEventListeners() {
    // Get .board
    const boardElement = document.querySelector('.board');
    // Add event listener
    boardElement.addEventListener('click', (event) => {
      // Get clicked element
      const target = event.target;
      // Get column element
      const columnElement = target.closest('.column');
      // Get column index
      const columnElements = [...boardElement.querySelectorAll('.column')];
      const colIndex = columnElements.indexOf(columnElement);
      // Make move
      this.move(colIndex);
    });
  }
}