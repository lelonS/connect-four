class Game {
  get playerCount() { return this.board.playerCount; }

  static Gamemodes = { Menu: undefined, Local: 'local', Online: 'online' };

  constructor() {
    this.#createElements();
    this.#addEventListeners();
    this.gamemode = Game.Gamemodes.Menu;
    this.reset();
  }

  #createElements() {
    document.body.innerHTML = '';
    const gameContainer = Elements.gameContainerElement();
    document.body.appendChild(gameContainer);
  }

  reset(createPlayers = true) {
    clearTimeout(this.botTimer); // Stop any pending bot move
    this.board = new Board();
    this.moveAllowed = false;

    this.renderBoard();

    if (!createPlayers) {
      this.waitForMove();
    } else if (this.gamemode === Game.Gamemodes.Local) {
      this.askForPlayerNames();
    } else if (this.gamemode === Game.Gamemodes.Online) {
      this.askForOnlineParameters();
    } else {
      this.askForGamemode();
    }
  }

  askForGamemode() {
    const gameInfo = document.querySelector('.game-info');
    gameInfo.innerHTML = Elements.gamemodeHtml();

    const onlineButton = document.createElement('button');
    onlineButton.textContent = 'Online';

    const localButton = document.createElement('button');
    localButton.textContent = 'Local';

    localButton.addEventListener('click', () => {
      this.gamemode = Game.Gamemodes.Local;
      this.askForPlayerNames();
    });

    onlineButton.addEventListener('click', () => {
      this.gamemode = Game.Gamemodes.Online;
      this.askForOnlineParameters();
    });

    gameInfo.appendChild(onlineButton);
    gameInfo.appendChild(localButton);
  }

  askForOnlineParameters() {
    const gameInfo = document.querySelector('.game-info');
    gameInfo.innerHTML = Elements.onlineParametersHtml();

    const nameInput = Elements.nameInputElement('Player');
    gameInfo.appendChild(nameInput);

    const playerTypeDropdown = Elements.playerTypeDropdownElement();
    gameInfo.appendChild(playerTypeDropdown);

    const channelInput = Elements.channelInputElement();
    gameInfo.appendChild(channelInput);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Connect';
    gameInfo.appendChild(submitButton);

    const mainMenuButton = Elements.mainMenuButton(this);
    gameInfo.appendChild(mainMenuButton);

    submitButton.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const channel = channelInput.value.trim();
      if (!this.#checkPlayerNames([name], [nameInput])) { return; }
      if (channel.length < 1) { return; }

      const playerType = playerTypeDropdown.value;

      Network.startConnection(name, playerType, channel, this);
      this.renderWaitingForOpponent();
    });
  }

  askForPlayerNames() {
    // Get .game-info element
    const gameInfo = document.querySelector('.game-info');
    // Clear .game-info
    gameInfo.innerHTML = Elements.playerNameInfoHtml();

    // Create input elements
    const nameInputElements = [];
    const dropdownElements = [];
    for (let i = 0; i < this.playerCount; i++) {
      const input = Elements.nameInputElement(`Player${i + 1}`);
      input.classList.add(`player-${i + 1}-border`);
      nameInputElements.push(input);

      const dropdown = Elements.playerTypeDropdownElement();
      dropdown.classList.add(`player-${i + 1}-border`);
      dropdownElements.push(dropdown);

      gameInfo.appendChild(input);
      gameInfo.appendChild(dropdown);
    }

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Start';
    gameInfo.appendChild(submitButton);

    const mainMenuButton = Elements.mainMenuButton(this);
    gameInfo.appendChild(mainMenuButton);

    // Add event listener to submit button
    submitButton.addEventListener('click', () => {
      // Get input values
      const inputNames = nameInputElements.map(input => input.value.trim() || input.placeholder);
      const inputTypes = dropdownElements.map(dropdown => dropdown.value);
      if (!this.#checkPlayerNames(inputNames, nameInputElements)) { return; }

      this.createPlayers(inputNames, inputTypes);

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

  createPlayers(names, types) {
    this.players = [];
    for (let i = 0; i < names.length; i++) {
      let player = Player.create(names[i], i + 1, types[i]);
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
      const colElement = Elements.boardColumnElement(this.board, col);
      boardElement.appendChild(colElement);
    }
  }

  renderMove(turn, col, row) {
    if (!this.players) { return; }
    const player = this.players[turn];
    const boardElement = document.querySelector('.board');
    const columnElement = boardElement.querySelectorAll('.column')[col];
    const cell = columnElement.querySelectorAll('.cell')[row];
    cell.classList.add(`player-${turn + 1}`);
  }

  renderWaitingForOpponent() {
    const gameInfo = document.querySelector('.game-info');
    gameInfo.innerHTML = Elements.waitingForOpponentHtml();
    gameInfo.appendChild(Elements.resetButton(this));
  }

  renderResults() {
    const gameInfo = document.querySelector('.game-info');
    // Write result to sidebar
    gameInfo.innerHTML = Elements.resultHtml(this);

    // Play again buttons
    const playAgainButton = Elements.playAgainButton(this);
    gameInfo.appendChild(playAgainButton);

    const newGameButton = Elements.newGameButton(this);
    gameInfo.appendChild(newGameButton);
  }

  renderTurn() {
    const gameInfo = document.querySelector('.game-info');
    const player = this.players[this.board.turn];
    gameInfo.innerHTML = Elements.turnHtml(player, this.board.turn);
    // Add reset button
    let resetButton = Elements.resetButton(this);
    gameInfo.appendChild(resetButton);
  }

  #playBotMove() {
    const bot = this.players[this.board.turn];
    const col = bot.getMove(this.board);
    const botTimerMs = 200 + Math.random() * 800;
    this.botTimer = setTimeout(() => {
      this.move(col);
    }, botTimerMs);
  }

  waitForMove() {
    this.moveAllowed = true;
    // this.renderBoard();
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
      const { player, col, row } = this.board.getLastMove();
      this.renderMove(player, col, row);
      Network.sendMoveFromLocalPlayer(this.players[player], col);
      this.waitForMove();
    }
  }

  #addEventListeners() {
    // Get .board
    const boardElement = document.querySelector('.board');
    // Add event listener
    boardElement.addEventListener('click', (event) => {
      // Don't allow human to move if bot is playing or if current player is a remote player (for online games)
      if (this.players && (this.players[this.board.turn] instanceof Bot || !this.players[this.board.turn].isLocal)) {
        return;
      }
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