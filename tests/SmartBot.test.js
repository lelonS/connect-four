require('./helpers/load-all-classes.js');
const BoardPositions = require('./helpers/BoardPositions.js');

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

// Test getLegalMoves()
test('getLegalMoves returns correct number of moves', () => {
  const bot = new SmartBot('test', 1);
  const board = new Board();
  let moves = bot.getLegalMoves(board);
  expect(moves.length).toBe(7);

  // Check that getLegalMoves returns the only valid move
  board.board = BoardPositions.lastMoveCol6Win.board;
  moves = bot.getLegalMoves(board);
  expect(moves.length).toBe(1);
});

// Test countColors()
test('countColors returns correct number of colors', () => {
  const bot = new SmartBot('test', 1);
  const board = new Board();
  board.board = BoardPositions.fullDraw.board;

  // Check that no combo count is 4
  for (const combo of bot.winCombos) {
    expect(bot.countColors(board, combo, 0)).toBeLessThan(4);
    expect(bot.countColors(board, combo, 1)).toBeLessThan(4);
    expect(bot.countColors(board, combo, null)).toBe(0);
  }

  // Check that countColors returns the correct number of colors
  expect(bot.countColors(board, [[0, 0], [1, 0], [2, 0], [3, 0]], 0)).toBe(2);
  expect(bot.countColors(board, [[0, 0], [1, 0], [2, 0], [3, 0]], 1)).toBe(2);

  expect(bot.countColors(board, [[1, 0], [2, 0], [3, 0], [4, 0]], 0)).toBe(1);
  expect(bot.countColors(board, [[1, 0], [2, 0], [3, 0], [4, 0]], 1)).toBe(3);
});

// Test calcMoveScore()
test('calcMoveScore for winning move returns Infinity', () => {
  const bot = new SmartBot('test', 1);
  const board = new Board();
  board.board = BoardPositions.lastMoveCol6Win.board;
  board.turn = BoardPositions.lastMoveCol6Win.turn;
  expect(bot.calcMoveScore(board, 6)).toBe(Infinity);
});
