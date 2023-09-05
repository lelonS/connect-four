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

    this.askForPlayerNames();
  }

  askForPlayerNames() {
    // Get .game-info element
    const gameInfo = document.querySelector('.game-info');
    // Clear .game-info
    gameInfo.innerHTML = /*html*/`
      <h3>Enter player names</h3>
      <p>Only alphabetical characters</p>
      `;

    // Create input elements
    const nameInputElements = [];
    for (let i = 0; i < this.playerCount; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Player ' + (i + 1);
      nameInputElements.push(input);
    }
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    // Add elements to .game-info
    nameInputElements.forEach(input => gameInfo.appendChild(input));
    gameInfo.appendChild(submitButton);

    // Add event listener to submit button
    submitButton.addEventListener('click', () => {
      // Get input values
      const inputNames = nameInputElements.map(input => input.value);
      if (!this.#checkPlayerNames(inputNames, nameInputElements)) { return; }

      this.#setPlayerNames(inputNames);

      this.expectedInput += inputNames.length;
      this.waitForMove();
      // Remove elements from .game-info
      gameInfo.innerHTML = '';
    });
  }

  #checkPlayerNames(names, inputElements) {
    let valid = true;
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      if (!Player.isValidName(name)) {
        valid = false;
        if (inputElements) { inputElements[i].value = ''; }
      }
    }
    return valid;
  }

  #setPlayerNames(names) {
    for (let i = 0; i < names.length; i++) {
      this.players[i].name = names[i];
    }
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
}