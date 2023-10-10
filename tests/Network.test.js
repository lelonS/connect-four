/**
 * @jest-environment jsdom
 */

require('./helpers/load-all-classes.js');
const { EventSource, messageObject, joinMessage, leaveMessage } = require('./helpers/network-helpers.js');
globalThis.EventSource = EventSource; // EventSource is not supported by JSDOM


test('New Network has correct properties', () => {
  const game = new Game();
  const network = new Network(game);
  expect(network.game).toBe(game);
  expect(network.urlPrefix).toBe('https://sse.nodehill.com');
  expect(network.userName).toBe(null);
  expect(network.userType).toBe('human');
  expect(network.playerUsers).toEqual({});
  expect(network.isConnected).toBe(false);
  expect(network.closeInfo).toBe('');
  expect(network.channel).toBe(null);
  expect(network.token).toBe(null);
  expect(network.latest).toBe(0);
  expect(network.eventSource).toBe(null);
});

// startConnection() tests
test('startConnection() sets properties correctly', () => {
  const game = new Game();
  const network = new Network(game);
  network.closeConnection = jest.fn();
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');

  expect(network.closeConnection).toBeCalledTimes(1); // closeConnection() is called to reset properties
  expect(network.closeInfo).toBe('');

  expect(network.userName).toBe('user');
  expect(network.userType).toBe(Player.PlayerTypes.RandomBot);
  expect(network.channel).toBe('channel');
  expect(network.isConnected).toBe(true);
  expect(game.players).toEqual([]);
  // EventSource mock
  expect(network.eventSource).not.toBe(null);
  expect(network.eventSource.addEventListener).toBeCalledWith('token', expect.any(Function));
  expect(network.eventSource.onmessage).not.toBe(null);
  expect(network.eventSource.onerror).not.toBe(null);
  expect(network.eventSource.close).not.toBeCalled();
});

// closeConnection() and closeConnectionAndReset() tests
test('closeConnection resets properties', () => {
  const game = new Game();
  const network = new Network(game);
  // Set properties
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  // closeConnection
  network.closeConnection('reason');
  expect(network.userName).toBe(null);
  expect(network.userType).toBe('human');
  expect(network.channel).toBe(null);
  expect(network.isConnected).toBe(false);
  expect(network.closeInfo).toBe('reason');
  expect(network.token).toBe(null);
  expect(network.latest).toBe(0);
  expect(network.eventSource).toBe(null);
});

// messageListener() tests
test('messageListener() handles system messages', () => {
  const network = new Network(new Game());
  network.processMessageFromRemote = jest.fn();
  network.processMessageFromServer = jest.fn();
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  network.messageListener(joinMessage('user', 'channel'));
  expect(network.processMessageFromRemote).toBeCalledTimes(0);
  expect(network.processMessageFromServer).toBeCalledTimes(1);
});

test('messageListener() handles remote messages', () => {
  const network = new Network(new Game());
  network.processMessageFromRemote = jest.fn();
  network.processMessageFromServer = jest.fn();
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  network.messageListener(messageObject('otherUser', 'message'));
  expect(network.processMessageFromRemote).toBeCalledTimes(1);
  expect(network.processMessageFromServer).toBeCalledTimes(0);
});

test('messageListener() ignores own messages', () => {
  const network = new Network(new Game());
  network.processMessageFromRemote = jest.fn();
  network.processMessageFromServer = jest.fn();
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  network.messageListener(messageObject('user', 'message'));
  expect(network.processMessageFromRemote).toBeCalledTimes(0);
  expect(network.processMessageFromServer).toBeCalledTimes(0);
});

// processMessageFromServer() tests
test('processMessageFromServer() handles join messages', () => {
  const network = new Network(new Game());
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  network.processMessageFromServer(joinMessage('user', 'channel').data);
  expect(network.playerUsers).toEqual({ 'user': 0 });
  expect(network.game.players.length).toBe(1);
  network.processMessageFromServer(joinMessage('user2', 'channel').data);
  expect(network.playerUsers).toEqual({ 'user': 0, 'user2': 1 });
  expect(network.game.players.length).toBe(2);
  // Joining again after 2 players are already in the game
  network.processMessageFromServer(joinMessage('user3', 'channel').data);
  expect(network.playerUsers).toEqual({ 'user': 0, 'user2': 1 });
  expect(network.game.players.length).toBe(2);
});

test('processMessageFromServer() handles leave messages', () => {
  const network = new Network(new Game());
  network.closeConnectionAndReset = jest.fn();

  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  // Join 2 users
  network.messageListener(joinMessage('user', 'channel'));
  network.messageListener(joinMessage('user2', 'channel'));

  // Someone other than playing leaving
  network.messageListener(joinMessage('user3', 'channel'));
  network.processMessageFromServer(leaveMessage('user3', 'channel').data);
  expect(network.playerUsers).toEqual({ 'user': 0, 'user2': 1 });
  expect(network.game.players.length).toBe(2);

  // Other player leaving closes connection
  network.processMessageFromServer(leaveMessage('user2', 'channel').data);
  expect(network.closeConnectionAndReset).toBeCalledTimes(1);
  expect(network.closeConnectionAndReset).toBeCalledWith('Opponent left the game. Try a different channel');
});

// processMessageFromRemote() tests
test('processMessageFromRemote() handles resetBoard messages', () => {
  const game = new Game();
  const network = new Network(game);
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  game.reset = jest.fn();
  network.closeConnection = jest.fn();

  // Join 2 users
  network.messageListener(joinMessage('user', 'channel'));
  network.messageListener(joinMessage('user2', 'channel'));
  // Reset board
  network.processMessageFromRemote('resetBoard', 'user2');
  expect(game.reset).toBeCalledTimes(1);
  expect(network.closeConnection).toBeCalledTimes(0);
});

test('processMessageFromRemote() handles move messages', () => {
  const game = new Game();
  const network = new Network(game);
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  game.move = jest.fn();

  // Join 2 users
  network.messageListener(joinMessage('user', 'channel'));
  network.messageListener(joinMessage('user2', 'channel'));
  // Move isnt allowed as it is player 1's turn
  network.processMessageFromRemote(0, 'user2');
  expect(game.move).toBeCalledTimes(0);
  // Move is allowed as it is player 2's turn
  game.board.turn = 1;
  network.processMessageFromRemote(0, 'user2');
  expect(game.move).toBeCalledTimes(1);
});

test('processMessageFromRemote() ignores messages from unknown users or local user', () => {
  const game = new Game();
  const network = new Network(game);
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  game.move = jest.fn();
  game.reset = jest.fn();

  // Join 2 users
  network.messageListener(joinMessage('user', 'channel'));
  network.messageListener(joinMessage('user2', 'channel'));
  // Join 3rd user
  network.messageListener(joinMessage('user3', 'channel'));
  // Reset board
  network.processMessageFromRemote('resetBoard', 'user3');
  network.processMessageFromRemote('resetBoard', 'user');
  expect(game.reset).toBeCalledTimes(0);
  // Move
  network.processMessageFromRemote(0, 'user3');
  network.processMessageFromRemote(0, 'user');
  expect(game.move).toBeCalledTimes(0);
});

test('processMessageFromRemote() does not throw error if invalid data is received', () => {
  const game = new Game();
  const network = new Network(game);
  network.startConnection('user', Player.PlayerTypes.RandomBot, 'channel');
  game.move = jest.fn();
  game.reset = jest.fn();

  // Join 2 users
  network.messageListener(joinMessage('user', 'channel'));
  network.messageListener(joinMessage('user2', 'channel'));

  // Invalid string
  network.processMessageFromRemote('not a real command', 'user2');
  expect(game.reset).toBeCalledTimes(0);
  expect(game.move).toBeCalledTimes(0);

  // Invalid number
  network.processMessageFromRemote(0.1, 'user2');
  expect(game.reset).toBeCalledTimes(0);
  expect(game.move).toBeCalledTimes(0);
});

// plrNameFromUser() tests
test('plrNameFromUser() returns same name if valid', () => {
  const network = new Network(new Game());
  expect(network.plrNameFromUser('user')).toBe('user');
  expect(network.plrNameFromUser('user2')).toBe('user2');
});

test('plrNameFromUser() returns a valid name if invalid', () => {
  const network = new Network(new Game());
  const validName = network.plrNameFromUser('invalid name');
  expect(Player.isValidName(validName)).toBe(true);

  // Join the generated name
  network.startConnection(validName, Player.PlayerTypes.RandomBot, 'channel');
  network.messageListener(joinMessage(validName, 'channel'));

  // Join another user with invalid name
  const validName2 = network.plrNameFromUser('invalid name!');
  expect(Player.isValidName(validName2)).toBe(true);
  expect(validName2).not.toBe(validName);
});


