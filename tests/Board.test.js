require('./load-all-classes.js');
const BoardPositions = require('./BoardPositions.js');

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
  expect(board.moveHistory).toEqual([]);
  // Check board array
  expect(board.board).toEqual(BoardPositions.empty.board);
});

// Test createEmptyBoard()
test('createEmptyBoard() creates an empty board', () => {
  const board = new Board();
  board.board = BoardPositions.fullDraw.board;
  board.createEmptyBoard();
  expect(board.board).toEqual(BoardPositions.empty.board);
});

// Test getLastMove()
test('getLastMove() returns last move player, col and row', () => {
  const board = new Board();
  board.makeMove(0);
  expect(board.getLastMove()).toEqual({ player: 0, col: 0, row: 0 });
  board.makeMove(3);
  expect(board.getLastMove()).toEqual({ player: 1, col: 3, row: 0 });
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
  board.board = BoardPositions.fullDraw.board;
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
  board.board = BoardPositions.fullDraw.board;
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
  board.board = BoardPositions.lastMoveCol6Win.board;
  board.turn = BoardPositions.lastMoveCol6Win.turn;
  // Make move should return true
  expect(board.makeMove(6)).toBe(true);
  // Make move changes gameState to Win
  expect(board.gameState).toBe(Board.GameStates.Win);
});

// Test checkDraw()
test('checkDraw() returns true if board is full', () => {
  const board = new Board();
  board.board = BoardPositions.fullDraw.board;
  expect(board.checkDraw()).toBe(true);
});

test('checkDraw() returns false if board is not full', () => {
  const board = new Board();
  expect(board.checkDraw()).toBe(false);
  // Fill board except for 1 space
  board.board = BoardPositions.fullDraw.board;
  board.board[0].pop();
  expect(board.checkDraw()).toBe(false);
});

// Test checkWinAt()
// Test win positions from BoardPositions.js.
// This makes sure a win from both player1 and player2 is detected.
// And all directions are tested. (Horizontal, vertical, diagonal downright, diagonal upright)
// And boundary conditions are tested (win at edge of board)
test.each(BoardPositions.winPositions)
  ('checkWinAt() returns true if win, position: $name', ({ winnerCoords, board }) => {
    const boardInstance = new Board();
    boardInstance.board = board;
    for ([col, row] of winnerCoords) {
      expect(boardInstance.checkWinAt(col, row)).toBe(true);
    }
  });

test('checkWinAt() returns false if no win', () => {
  const board = new Board();
  expect(board.checkWinAt(0, 0)).toBe(false);
  // Fill board with no win (2 in a row and 3 in a row)
  board.board = BoardPositions.fullDraw.board;
  // Check all cells (should be no win)
  for (let col = 0; col < board.colCount; col++) {
    for (let row = 0; row < board.rowCount; row++) {
      expect(board.checkWinAt(col, row)).toBe(false);
    }
  }
});
