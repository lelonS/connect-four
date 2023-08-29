require('./load-all-classes.js');

const emptyBoard = [[], [], [], [], [], [], []];
const fullBoardDraw = [
  [0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1]
];

// Test initial board state
test('Initial board variables are correct', () => {
  const board = new Board();
  // Check Connect-4 constants
  expect(board.playerCount).toBe(2);
  expect(board.colCount).toBe(7);
  expect(board.rowCount).toBe(6);
  expect(board.winCount).toBe(4);
  // Check initial state
  expect(board.gameState).toBe(Board.GameStates.Playing);
  expect(board.turn).toBe(0);
  expect(board.winner).toBe(null);
  // Check board array
  expect(board.board).toEqual(emptyBoard);
});

// Test createEmptyBoard()
test('createEmptyBoard() creates an empty board', () => {
  const board = new Board();
  board.board = fullBoardDraw;
  board.createEmptyBoard();
  expect(board.board).toEqual(emptyBoard);
});

// Test getCell()
test('getCell() returns null for out of bounds', () => {
  const board = new Board();
  // Negative values
  expect(board.getCell(-1, 0)).toBe(null); // col
  expect(board.getCell(0, -1)).toBe(null); // row

  // Too large values
  expect(board.getCell(7, 0)).toBe(null); // col
  expect(board.getCell(0, 6)).toBe(null); // row
});

test('getCell() returns null for empty cells', () => {
  const board = new Board();
  // Empty board
  expect(board.getCell(0, 0)).toBe(null);
});

test('getCell() returns player index for non-empty cells', () => {
  const board = new Board();
  board.board = fullBoardDraw;
  expect(board.getCell(0, 0)).toBe(0);
  expect(board.getCell(6, 5)).toBe(1);
});

// Test nextTurn()
test('nextTurn() increments turn', () => {
  const board = new Board();
  expect(board.turn).toBe(0);
  board.nextTurn(); // From 0 to 1
  expect(board.turn).toBe(1);
  board.nextTurn(); // From 1 to 0
  expect(board.turn).toBe(0);
});

// Test isValidMove()
test('isValidMove() returns true if move is valid', () => {
  const board = new Board();
  expect(board.isValidMove(6)).toBe(true);
  // Fill column 0 but leave 1 space
  board.board[0] = [0, 1, 0, 1, 0];
  expect(board.isValidMove(0)).toBe(true);
});

test('isValidMove() returns false if game is over', () => {
  const board = new Board();
  // Set game state to Draw
  board.gameState = Board.GameStates.Draw;
  expect(board.isValidMove(0)).toBe(false);
  // Set game state to Win
  board.gameState = Board.GameStates.Win;
  expect(board.isValidMove(0)).toBe(false);
});

test('isValidMove() returns false if column is out of bounds', () => {
  const board = new Board();
  expect(board.isValidMove(-1)).toBe(false);
  expect(board.isValidMove(7)).toBe(false);
});

test('isValidMove() returns false if column is full', () => {
  const board = new Board();
  // Fill column 0
  board.board[0] = [0, 1, 0, 1, 0, 1];
  expect(board.isValidMove(0)).toBe(false);
});
