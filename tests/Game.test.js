require('./load-all-classes.js');
const { getConsoleLogOutput, resetConsoleLogOutput } = require('./capture-console-log.js');

test('New game has correct initial variables', () => {
  const game = new Game();
  expect(game.board).toBeInstanceOf(Board);
  expect(game.expectedInput).toBe(0);
  expect(game.playerCount).toBe(2);
  expect(game.players.length).toBe(2);
  for (const player of game.players) {
    expect(player).toBeInstanceOf(Player);
  }
});

test('Reset method starts a new game', () => {
  const game = new Game();
  // Setting incorrect variables
  game.expectedInput = 1;
  game.players = [];
  game.board = null;
  game.reset();
  // Checking if game has reset with correct initial variables
  expect(game.board).toBeInstanceOf(Board);
  expect(game.expectedInput).toBe(0);
  expect(game.playerCount).toBe(2);
  expect(game.players.length).toBe(2);
  for (const player of game.players) {
    expect(player).toBeInstanceOf(Player);
  }
});

test('Start method initializes players', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.start();
  expect(game.players.length).toBe(game.playerCount);
  expect(game.players[0]).toBeInstanceOf(Player);
  expect(game.players[1]).toBeInstanceOf(Player);
  const logOutput = getConsoleLogOutput();
  expect(logOutput).toEqual([
    ['Use "game.input(\'name\')" to set player names.'],
    ['Player 1:']]);
});