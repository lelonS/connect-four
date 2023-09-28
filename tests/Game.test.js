/**
 * @jest-environment jsdom
 */
require('./load-all-classes.js');


test('New game has correct initial variables', () => {
  const game = new Game();
  expect(game.board).toBeInstanceOf(Board);
  expect(game.playerCount).toBe(2);
  expect(game.moveAllowed).toBe(false);
});

test('New game has correct initial DOM', () => {
  const game = new Game();

  // Check DOM elements exist
  const board = document.querySelector('.board');
  const gameSidebar = document.querySelector('.game-sidebar');
  const gameInfo = document.querySelector('.game-info');
  // Ask for player names
  const inputElements = gameInfo.querySelectorAll('input');
  const selectElements = gameInfo.querySelectorAll('select');
  const submitButton = gameInfo.querySelector('button');

  expect(board).not.toBeNull();
  expect(gameSidebar).not.toBeNull();
  expect(gameInfo).not.toBeNull();
  expect(inputElements.length).toBe(2);
  expect(selectElements.length).toBe(2);
  expect(submitButton).not.toBeNull();
});

// reset() tests
test('reset() creates new board and players', () => {
  const game = new Game();
  game.askForPlayerNames = jest.fn();
  const board = game.board;
  game.reset();
  expect(game.board).not.toBe(board);
  expect(game.askForPlayerNames).toHaveBeenCalled();
});

test('reset(false) creates new board and keeps players', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.RandomBot]);
  const board = game.board;
  const players = game.players;
  game.reset(false);
  expect(game.board).not.toBe(board);
  expect(game.players).toBe(players);
});

// createPlayers() tests
test('createPlayers() creates players', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.RandomBot]);
  expect(game.players.length).toBe(2);
  expect(game.players[1]).toBeInstanceOf(Bot);
  for (const player of game.players) {
    expect(player).toBeInstanceOf(Player);
  }
});

// askForPlayerNames() tests
test('askForPlayerNames() creates 2 plr inputs and a submit button', () => {
  const game = new Game();
  const gameInfo = document.querySelector('.game-info');
  gameInfo.innerHTML = '';
  game.askForPlayerNames();
  const inputElements = gameInfo.querySelectorAll('input'); // Player name inputs
  const selectElements = gameInfo.querySelectorAll('select'); // Player type selects
  const submitButton = gameInfo.querySelector('button'); // Submit button

  expect(inputElements.length).toBe(2);
  expect(selectElements.length).toBe(2);
  expect(submitButton).not.toBeNull();
});

// renderBoard() tests
test('renderBoard() creates 7 columns and 6 rows', () => {
  const game = new Game();
  game.renderBoard();
  const board = document.querySelector('.board');
  const columns = board.querySelectorAll('.column');
  expect(columns.length).toBe(7);
  // Check each column has 6 rows
  for (const column of columns) {
    const rows = column.querySelectorAll('.cell');
    expect(rows.length).toBe(6);
  }
});

test('renderBoard() renders players', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.RandomBot]);
  // Make two moves in first column
  game.board.board[0] = [0, 1];
  game.renderBoard();
  const board = document.querySelector('.board');
  // Select first column
  const column = board.querySelector('.column');
  const cells = column.querySelectorAll('.cell');
  // Check first 2 cells have player-n class
  expect(cells[0].classList.contains('player-1')).toBe(true);
  expect(cells[1].classList.contains('player-2')).toBe(true);
});

// renderMove() tests
test('renderMove() renders correct player', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.Human]);
  game.renderMove(0, 0);
  const board = document.querySelector('.board');
  const column = board.querySelector('.column');
  const cell = column.querySelector('.cell'); // First cell
  expect(cell.classList.contains('player-1')).toBe(true);
});

// renderResults() tests
test('renderResults() renders correct output for draw', () => {
  const game = new Game();
  game.board.gameState = Board.GameStates.Draw;
  game.renderResults();
  const gameInfo = document.querySelector('.game-info');
  const gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("It's a draw!");

  // Check that buttons to restart exist
  const buttons = gameInfo.querySelectorAll('button');
  expect(buttons.length).toBe(2);
});

test('renderResults() renders correct output for win', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.RandomBot]);
  game.board.gameState = Board.GameStates.Win;
  game.board.winner = 0;
  game.renderResults();
  const gameInfo = document.querySelector('.game-info');
  const gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("Alice won!");

  // Check that buttons to restart exist
  const buttons = gameInfo.querySelectorAll('button');
  expect(buttons.length).toBe(2);
});

// renderTurn() tests
test('renderTurn() renders correct output', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.RandomBot]);
  game.board.turn = 0;
  game.renderTurn();

  let gameInfo = document.querySelector('.game-info');
  let gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("Alice's turn");

  // Change turn and check output
  game.board.turn = 1;
  game.renderTurn();

  gameInfo = document.querySelector('.game-info');
  gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("Bob's turn");

  // Check that button (to restart) exist
  const button = gameInfo.querySelector('button');
  expect(button).not.toBeNull();
});

// waitForMove() tests
test('waitForMove() sets moveAllowed to true', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.Human, Player.PlayerTypes.Human]);
  game.moveAllowed = false;
  game.waitForMove();
  expect(game.moveAllowed).toBe(true);
});

test('waitForMove() gets bot move', () => {
  const game = new Game();
  game.createPlayers(['Alice', 'Bob'], [Player.PlayerTypes.RandomBot, Player.PlayerTypes.Human]);
  game.move = jest.fn();
  jest.useFakeTimers();
  game.waitForMove();
  jest.runAllTimers(); // Run all timers to avoid the bot move delay
  expect(game.move).toHaveBeenCalled();
});

// shakeGameSidebar() test
test('shakeGameSidebar() adds and removes error-animation class to game-sidebar', () => {
  const game = new Game();
  jest.useFakeTimers(); // Fake timer to make sure animation is removed
  game.shakeGameSidebar();
  const gameSidebar = document.querySelector('.game-sidebar');
  expect(gameSidebar.classList.contains('error-animation')).toBe(true);
  jest.runAllTimers(); // Run all timers to remove animation
  expect(gameSidebar.classList.contains('error-animation')).toBe(false);
});

// move() tests
test('move() calls makeMove() on board when valid move', () => {
  const game = new Game();
  game.moveAllowed = true;
  const board = game.board;
  board.makeMove = jest.fn();
  game.move(0);
  expect(board.makeMove).toHaveBeenCalledWith(0);
});

test('move() does not call makeMove() on board when invalid move', () => {
  const game = new Game();
  game.moveAllowed = true;
  const board = game.board;
  board.makeMove = jest.fn();
  game.move(-1);
  expect(board.makeMove).not.toHaveBeenCalled();
});

test('move() does not call makeMove() on board when moveAllowed is false', () => {
  const game = new Game();
  game.moveAllowed = false;
  const board = game.board;
  board.makeMove = jest.fn();
  game.move(0);
  expect(board.makeMove).not.toHaveBeenCalled();
});
