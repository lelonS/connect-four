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


