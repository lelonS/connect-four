require('./load-all-classes.js');
const BoardPositions = require('./BoardPositions.js');

test('Initial SmartBot variables are correct', () => {
  const bot = new SmartBot('test', 1);
  expect(bot).toBeInstanceOf(Player);
  expect(bot.name).toBe('test');
  expect(bot.plrNumber).toBe(1);
});

test('getMove returns a valid a move', () => {
  const bot = new SmartBot('test', 1);
  const board = new Board();
  let move = bot.getMove(board);
  expect(board.isValidMove(move)).toBe(true);

  // Check that getMove returns the only valid move
  board.board = BoardPositions.lastMoveCol6Win.board;
  move = bot.getMove(board);
  expect(board.isValidMove(move)).toBe(true);
});

test('getMove throws error if no valid moves', () => {
  const bot = new SmartBot('test', 1);
  const board = new Board();
  board.board = BoardPositions.fullDraw.board;
  const t = () => bot.getMove(board);
  expect(t).toThrow(Error);
});

// Test calcAllWinCombos()
test('calcAllWinCombos returns correct number of combos', () => {
  const bot = new SmartBot('test', 1);
  const combos = bot.calcAllWinCombos();
  // There are 69 winning combinations in Connect-4
  expect(combos.length).toBe(69);
});

