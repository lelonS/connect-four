/**
 * @jest-environment jsdom
 */
require('./load-all-classes.js');
const IndexBody = require('./IndexBody.js');

// Before all tests
beforeAll(() => {
  // Create the index.html DOM
  document.body.innerHTML = IndexBody.get();
});

test('New game has correct initial variables', () => {
  const game = new Game();
  expect(game.board).toBeInstanceOf(Board);
  expect(game.playerCount).toBe(2);
  expect(game.players.length).toBe(2);
  expect(game.moveAllowed).toBe(false);
  for (const player of game.players) {
    expect(player).toBeInstanceOf(Player);
  }
});

test('New game has correct initial DOM', () => {
  const game = new Game();
  const board = document.querySelector('.board');
  expect(board).not.toBeNull();
  const gameInfo = document.querySelector('.game-info');
  expect(gameInfo).not.toBeNull();
  const inputElements = gameInfo.querySelectorAll('input');
  expect(inputElements.length).toBe(2);
  const submitButton = gameInfo.querySelector('button');
  expect(submitButton).not.toBeNull();
});

// reset() tests
test('reset() creates new board and players', () => {
  const game = new Game();
  const board = game.board;
  const players = game.players;
  game.reset();
  expect(game.board).not.toBe(board);
  expect(game.players).not.toBe(players);
});

test('reset(false) creates new board and keeps players', () => {
  const game = new Game();
  const board = game.board;
  const players = game.players;
  game.reset(false);
  expect(game.board).not.toBe(board);
  expect(game.players).toBe(players);
});

// createPlayers() tests
test('createPlayers() creates players', () => {
  const game = new Game();
  game.createPlayers();
  expect(game.players.length).toBe(2);
  for (const player of game.players) {
    expect(player).toBeInstanceOf(Player);
  }
});

// askForPlayerNames() tests
test('askForPlayerNames() creates 2 input elements and button', () => {
  const game = new Game();
  const gameInfo = document.querySelector('.game-info');
  gameInfo.innerHTML = '';
  game.askForPlayerNames();
  const inputElements = gameInfo.querySelectorAll('input');
  expect(inputElements.length).toBe(2);
  const submitButton = gameInfo.querySelector('button');
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
  game.board.gameState = Board.GameStates.Win;
  game.board.winner = 0;
  game.players[0].name = 'Alice';
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
  game.board.turn = 0;
  game.players[0].name = 'Alice';
  game.renderTurn();

  let gameInfo = document.querySelector('.game-info');
  let gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("Alice's turn");

  // Change turn and check output
  game.board.turn = 1;
  game.players[1].name = 'Bob';
  game.renderTurn();

  gameInfo = document.querySelector('.game-info');
  gameInfoTitle = gameInfo.querySelector('h3');
  expect(gameInfoTitle.textContent).toBe("Bob's turn");
});

// waitForMove() tests
test('waitForMove() sets moveAllowed to true', () => {
  const game = new Game();
  game.moveAllowed = false;
  game.waitForMove();
  expect(game.moveAllowed).toBe(true);
});

// Create test for shakeGameSidebar()
test('shakeGameSidebar() adds and removes error-animation class to game-sidebar', () => {
  const game = new Game();
  jest.useFakeTimers(); // Fake timer to make sure animation is removed
  game.shakeGameSidebar();
  const gameSidebar = document.querySelector('.game-sidebar');
  expect(gameSidebar.classList.contains('error-animation')).toBe(true);
  jest.runAllTimers(); // Run all timers to remove animation
  expect(gameSidebar.classList.contains('error-animation')).toBe(false);
});





