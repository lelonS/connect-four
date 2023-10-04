class Elements {

  static gameContainerElement() {
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
    return gameContainer;
  }

  static nameInputElement(placeholder) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.maxLength = Player.nameMaxLength;
    input.minLength = Player.nameMinLength;
    input.pattern = Player.nameRegex.source;

    return input;
  }

  static channelInputElement() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Channel';
    input.maxLength = 20;
    input.minLength = 1;
    input.classList.add('channel');

    return input;
  }

  static playerTypeDropdownElement() {
    const playerTypes = Player.PlayerTypes;
    const dropdown = document.createElement('select');
    dropdown.innerHTML = /*html*/`
        <option value="${playerTypes.Human}">Human</option>
        <option value="${playerTypes.RandomBot}">Random Bot</option>
        <option value="${playerTypes.SmartBot}">Smart Bot</option>
        `;
    return dropdown;
  }

  static boardCellElement(board, col, row) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    const cellValue = board.getCell(col, row);
    if (cellValue !== null) {
      cell.classList.add(`player-${cellValue + 1}`);
    }
    return cell;
  }

  static boardColumnElement(board, col) {
    const column = document.createElement('div');
    column.classList.add('column');
    for (let row = 0; row < board.rowCount; row++) {
      const cellElement = Elements.boardCellElement(board, col, row);
      column.appendChild(cellElement);
    }
    return column;
  }

  static newGameButton(game) {
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.addEventListener('click', () => {
      game.reset();
    });
    return newGameButton;
  }

  static playAgainButton(game) {
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.addEventListener('click', () => {
      game.reset(false);
    });
    return playAgainButton;
  }

  static resetButton(game) {
    const resetButton = Elements.newGameButton(game);
    resetButton.textContent = 'Reset Game';
    resetButton.classList.add('abort-button');
    return resetButton;
  }

  static mainMenuButton(game) {
    const mainMenuButton = document.createElement('button');
    mainMenuButton.textContent = 'Main Menu';
    mainMenuButton.addEventListener('click', () => {
      game.gamemode = Game.Gamemodes.Menu;
      game.reset();
    });
    return mainMenuButton;
  }

  static drawResultHtml() {
    return /*html*/`
    <h3 class="game-result">It's a draw!</h3>`;
  }

  static winResultHtml(winner, winnerIndex) {
    return /*html*/`
    <h3 class="game-result">${winner.name} won!</h3>
    <div class="cell player-${winnerIndex + 1}"></div>`
  }

  static resultHtml(game) {
    if (game.board.gameState === Board.GameStates.Draw) {
      return Elements.drawResultHtml();
    } else if (game.board.gameState === Board.GameStates.Win) {
      const winnerIndex = game.board.winner;
      const winner = game.players[winnerIndex];
      return Elements.winResultHtml(winner, winnerIndex);
    }
  }

  static turnHtml(player, playerIndex) {
    return /*html*/`
    <h3>${player.name}'s turn</h3>
    <!-- Draws a circle with the player's color thats a bit smaller than the cells -->
    <div class="cell player-${playerIndex + 1}" style="width: calc(var(--board-width) / 7 * 0.6);"></div>`;
  }

  static playerNameInfoHtml() {
    return /*html*/`
    <h3>Enter player names</h3>
    <p>Only letters and numbers</p>
    `;
  }

  static onlineParametersHtml() {
    return /*html*/`
    <h3>Enter name and channel</h3>
    <p>Only letters and numbers</p>
    `;
  }

  static gamemodeHtml() {
    return /*html*/`
    <h3>Select a gamemode</h3>
    `;
  }

  static waitingForOpponentHtml() {
    return /*html*/`
    <h3>Waiting for opponent</h3>
    <p>Share this channel:</p>
    <h3>${Network.channel}</h3>
    `;
  }
}