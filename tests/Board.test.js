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
// lastMoveWinBoard, turn = 1, col = 6
const lastMoveWinBoard = [
  [0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1]
]

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

// Test makeMove()
test('makeMove() makes move, switches turn, and returns true', () => {
  const board = new Board();
  expect(board.makeMove(0)).toBe(true);
  expect(board.board[0]).toEqual([0]);
  expect(board.turn).toBe(1);
  expect(board.gameState).toBe(Board.GameStates.Playing);
});

test('makeMove() returns false if move is invalid or illegal', () => {
  const board = new Board();
  expect(board.makeMove(-1)).toBe(false);
  expect(board.makeMove(7)).toBe(false);
  // Invalid move should not change turn
  expect(board.turn).toBe(0);

  // Fill column 0
  board.board[0] = [0, 1, 0, 1, 0, 1];
  expect(board.makeMove(0)).toBe(false);
  // Column is full, so turn and board should not change
  expect(board.turn).toBe(0);
  expect(board.board[0]).toEqual([0, 1, 0, 1, 0, 1]);

  // Set game state to Win
  board.gameState = Board.GameStates.Win;
  // Try to make move after game is over in empty column
  expect(board.makeMove(1)).toBe(false);
});

test('makeMove() sets gameState to Draw if board is full', () => {
  const board = new Board();
  board.board = fullBoardDraw.slice();
  // Remove last player from column 0 to make it empty
  board.turn = board.board[0].pop();
  // Make move should return true
  expect(board.makeMove(0)).toBe(true);
  // Make move changes gameState to Draw
  expect(board.gameState).toBe(Board.GameStates.Draw);
});

test('makeMove() sets gameState to Win and sets winner if move results in win', () => {
  const board = new Board();
  // Fill column 0 with three player 0 in a row
  board.board[0] = [0, 0, 0];
  // Make move should return true
  expect(board.makeMove(0)).toBe(true);
  // Make move changes gameState to Win
  expect(board.gameState).toBe(Board.GameStates.Win);
  // Make move sets winner to player 0
  expect(board.winner).toBe(0);
});

test('makeMove() sets gameState to Win (not draw) if last move on full board results in win', () => {
  const board = new Board();
  board.board = lastMoveWinBoard;
  board.turn = 1;
  // Make move should return true
  expect(board.makeMove(6)).toBe(true);
  // Make move changes gameState to Win
  expect(board.gameState).toBe(Board.GameStates.Win);
});

// Test checkDraw()
test('checkDraw() returns true if board is full', () => {
  const board = new Board();
  board.board = fullBoardDraw;
  expect(board.checkDraw()).toBe(true);
});

test('checkDraw() returns false if board is not full', () => {
  const board = new Board();
  expect(board.checkDraw()).toBe(false);
  // Fill board except for 1 space
  board.board = fullBoardDraw.slice();
  board.board[0].pop();
  expect(board.checkDraw()).toBe(false);
});

