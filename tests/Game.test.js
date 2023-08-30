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

test('RenderBoard method outputs the board', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.board.board[0][0] = 0; // Set a sample value on the board
  game.renderBoard();
  const logOutput = getConsoleLogOutput();
  expect(logOutput).toEqual(
    [[`⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
🔴⚪⚪⚪⚪⚪⚪
0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣`]]);
});

test('inputName method handles invalid names', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.inputName('27');
  expect(game.players[0].name).not.toBe('27');
  expect(game.expectedInput).toBe(0);
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(['Invalid name. Only alphabetical values'])
});

test('inputName method adds player', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.inputName('Albin');
  expect(game.players[0].name).toBe('Albin');
  expect(game.expectedInput).toBe(1);
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(['Player Albin (🔴) added.'])
});

test('inputName method adds players and proceeds', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.inputName('Albin');
  game.inputName('Leon');
  expect(game.players[0].name).toBe('Albin');
  expect(game.players[1].name).toBe('Leon');
  expect(game.expectedInput).toBe(2);
  const logOutput = getConsoleLogOutput();
  expect(logOutput[3]).toEqual(['All players named.'])
});

test('Move method handles out of bounds column', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.move(10);
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(['Invalid column.'])
});

test('Move method hanldes string input', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.move('27');
  const logOutput = getConsoleLogOutput();
  expect(logOutput).toEqual([])
});

test('Move method makes a move and proceeds', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.move(0);
  expect(game.board.board[0][0]).toBe(0);
  expect(game.board.turn).toBe(1);
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(['Making move in column', 0])
});

test('waitForMove method displays correct message when playing', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.waitForMove();
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(
    [`⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣`]);
  expect(logOutput[1]).toEqual(['Use "game.input(0-6)" player (🔴)\'s turn'])
});

test('waitForMove method displays correct message for win', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.board.gameState = Board.GameStates.Win;
  game.board.winner = 0;
  game.waitForMove();
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(
    [`⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣`]);
  expect(logOutput[1]).toEqual(['Winner player (🔴)!'])
  expect(logOutput[2]).toEqual(['Game over. Use "game.reset()" to start a new game.'])
});

test('waitForMove method displays correct message for draw', () => {
  const game = new Game();
  resetConsoleLogOutput();
  game.board.gameState = Board.GameStates.Draw;
  game.waitForMove();
  const logOutput = getConsoleLogOutput();
  expect(logOutput[0]).toEqual(
    [`⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
⚪⚪⚪⚪⚪⚪⚪
0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣`]);
  expect(logOutput[1]).toEqual(['Draw!'])
  expect(logOutput[2]).toEqual(['Game over. Use "game.reset()" to start a new game.'])
});

test('input method handles input correctly', () => {
  const game = new Game();
  const spyName = jest.spyOn(game, 'inputName');
  const spyMove = jest.spyOn(game, 'move');
  game.input('Albin');
  game.input('Leon');
  expect(spyName).toHaveBeenCalledTimes(2);
  expect(spyMove).not.toHaveBeenCalled();
  game.input(2);
  expect(spyMove).toHaveBeenCalled();
});