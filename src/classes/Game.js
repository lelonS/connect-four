class Game {
  get playerCount() { return this.board.playerCount; }

  constructor() {
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

      // Remove elements from .game-info
      gameInfo.innerHTML = '';

      this.waitForMove();

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

  renderResults() {
    const gameInfo = document.querySelector('.game-info');
    // Write result to sidebar
    if (this.board.gameState === Board.GameStates.Draw) {
      const draw = this.board.checkDraw();
      gameInfo.innerHTML = /*html*/`
        <h3 class="game-result">It's a draw!</h3>`
    } else if (this.board.gameState === Board.GameStates.Win) {
      const winnerIndex = this.board.winner;
      const winner = this.players[winnerIndex];
      gameInfo.innerHTML = /*html*/`
        <h3 class="game-result">${winner.name} won!</h3>
        <div class="cell" style="background-color:${winner.color}"></div> `
    }
  }

  renderTurn() {
    const gameInfo = document.querySelector('.game-info');
    const player = this.players[this.board.turn];
    gameInfo.innerHTML = /*html*/`
      <h3>${player.name}'s turn</h3>
      <div class="cell" style="background-color:${player.color}; width: calc(var(--board-width) / 7 * 0.6);"></div>`
    // Draws a circle with the player's color thats a bit smaller than the cells
  }

  waitForMove() {
    this.renderBoard();
    if (this.board.gameState === Board.GameStates.Playing) {
      this.renderTurn();
    } else {
      // Game is not playing
      console.log('Game over. Use "game.reset()" to start a new game.');
      this.renderResults();
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