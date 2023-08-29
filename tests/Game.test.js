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