class Game {
  get playerCount() { return this.board.playerCount; }

  constructor() {
    this.#createElements();
    this.#addEventListeners();
    this.reset();
  }

  #createElements() {
    document.body.innerHTML = '';
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');

    const board = document.createElement('div');
    board.classList.add('board');

    const gameSidebar = document.createElement('div');
    gameSidebar.classList.add('game-sidebar');

    const gameTitle = document.createElement('h2');
    gameTitle.textContent = 'Connect 4';

    const gameInfo = document.createElement('div');
    gameInfo.classList.add('game-info');

    gameSidebar.appendChild(gameTitle);
    gameSidebar.appendChild(gameInfo);
    gameContainer.appendChild(board);
    gameContainer.appendChild(gameSidebar);
    document.body.appendChild(gameContainer);
  }

  reset(createPlayers = true) {
    clearTimeout(this.botTimer); // Stop any pending bot move
    this.board = new Board();
    this.moveAllowed = false;

    this.renderBoard();
    if (createPlayers) {
      this.askForPlayerNames();
    }
    else {
      this.waitForMove();
    }
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
      input.placeholder = 'Player' + (i + 1);
      input.maxLength = Player.nameMaxLength;
      input.minLength = Player.nameMinLength;
      input.pattern = Player.nameRegex.source;

      input.classList.add(`player-${i + 1}-border`);
      nameInputElements.push(input);
    }

    // Create dropdown elements
    const playerTypes = Player.PlayerTypes;
    const dropdownElements = [];
    for (let i = 0; i < this.playerCount; i++) {
      const dropdown = document.createElement('select');
      dropdown.innerHTML = /*html*/`
        <option value="${playerTypes.Human}">Human</option>
        <option value="${playerTypes.RandomBot}">Random Bot</option>
        <option value="${playerTypes.SmartBot}">Smart Bot</option>
        `;
      dropdown.classList.add(`player-${i + 1}-border`);
      dropdownElements.push(dropdown);
    }

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Start';

    // Add elements to .game-info
    for (let i = 0; i < this.playerCount; i++) {
      gameInfo.appendChild(nameInputElements[i]);
      gameInfo.appendChild(dropdownElements[i]);
    }
    gameInfo.appendChild(submitButton);

    // Add event listener to submit button
    submitButton.addEventListener('click', () => {
      // Get input values
      const inputNames = nameInputElements.map(input => input.value.trim() || input.placeholder);
      const inputTypes = dropdownElements.map(dropdown => dropdown.value);
      if (!this.#checkPlayerNames(inputNames, nameInputElements)) { return; }

      this.#createPlayers(inputNames, inputTypes);

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

  #createPlayers(names, types) {
    this.players = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const type = types[i];
      let player;
      if (type === Player.PlayerTypes.Human) {
        player = new Player(name, i + 1);
      } else if (type === Player.PlayerTypes.RandomBot) {
        player = new RandomBot(name, i + 1);
      } else if (type === Player.PlayerTypes.SmartBot) {
        player = new SmartBot(name, i + 1);
      }
      this.players.push(player);
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
          cellElement.classList.add(`player-${player.plrNumber}`);
        }
      }
    }
  }

  renderResults() {
    const gameInfo = document.querySelector('.game-info');
    // Write result to sidebar
    if (this.board.gameState === Board.GameStates.Draw) {
      gameInfo.innerHTML = /*html*/`
        <h3 class="game-result">It's a draw!</h3>`
    } else if (this.board.gameState === Board.GameStates.Win) {
      const winnerIndex = this.board.winner;
      const winner = this.players[winnerIndex];
      gameInfo.innerHTML = /*html*/`
        <h3 class="game-result">${winner.name} won!</h3>
        <div class="cell player-${winner.plrNumber}"></div> `
    }

    // Play again buttons
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    gameInfo.appendChild(newGameButton);
    newGameButton.addEventListener('click', () => {
      gameInfo.innerHTML = '';
      this.reset();
    });

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    gameInfo.appendChild(playAgainButton);
    playAgainButton.addEventListener('click', () => {
      gameInfo.innerHTML = '';
      this.reset(false);
    });

  }

  renderTurn() {
    const gameInfo = document.querySelector('.game-info');
    const player = this.players[this.board.turn];
    gameInfo.innerHTML = /*html*/`
      <h3>${player.name}'s turn</h3>
      <!-- Draws a circle with the player's color thats a bit smaller than the cells -->
      <div class="cell player-${player.plrNumber}" style="width: calc(var(--board-width) / 7 * 0.6);"></div>`;
    let newGameButton = document.createElement('button');
    newGameButton.innerText = 'Reset Game';
    newGameButton.classList.add('abort-button');

    newGameButton.addEventListener('click', (e) => {
      this.reset();
    });
    gameInfo.appendChild(newGameButton);
  }

  #playBotMove() {
    const bot = this.players[this.board.turn];
    const col = bot.getMove(this.board);
    const botTimerMs = 200 + Math.random() * 800;
    this.moveAllowed = false;
    this.botTimer = setTimeout(() => {
      this.moveAllowed = true;
      this.move(col);
    }, botTimerMs);
  }

  waitForMove() {
    this.moveAllowed = true;
    this.renderBoard();
    if (this.board.gameState === Board.GameStates.Playing) {
      this.renderTurn();
      if (this.players[this.board.turn] instanceof Bot) {
        this.#playBotMove();
      }
    } else {
      // Game is not playing
      this.renderResults();
    }
  }

  shakeGameSidebar() {
    const gameSidebar = document.querySelector('.game-sidebar');
    if (!gameSidebar.classList.contains('error-animation')) {
      gameSidebar.classList.add('error-animation');
      setTimeout(() => { gameSidebar.classList.remove('error-animation'); }, 500);
    }
  }

  move(col) {
    if (!this.moveAllowed) {
      this.shakeGameSidebar();
      return;
    }
    if (!this.board.isValidMove(col)) { return; }

    const success = this.board.makeMove(col);
    if (success) {
      this.waitForMove();
    }
  }

  #addEventListeners() {
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