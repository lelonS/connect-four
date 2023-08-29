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

test('createEmptyBoard() creates an empty board', () => {
  const board = new Board();
  board.board = fullBoardDraw;
  board.createEmptyBoard();
  expect(board.board).toEqual(emptyBoard);
});
