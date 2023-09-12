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

