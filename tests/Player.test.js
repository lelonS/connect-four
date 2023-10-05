require('./helpers/load-all-classes.js');

test('Initial Player variables are correct', () => {
  const player = new Player('test', 1);
  expect(player.name).toBe('test');
  expect(player.plrNumber).toBe(1);
});

test('create returns correct Player of correct type', () => {
  const player = Player.create('test', 1, Player.PlayerTypes.Human);
  expect(player instanceof Player).toBe(true);
  expect(player instanceof Bot).toBe(false);

  const randomBot = Player.create('test', 1, Player.PlayerTypes.RandomBot);
  expect(randomBot instanceof Player).toBe(true);
  expect(randomBot instanceof Bot).toBe(true);
  expect(randomBot instanceof RandomBot).toBe(true);
  expect(randomBot instanceof SmartBot).toBe(false);

  const smartBot = Player.create('test', 1, Player.PlayerTypes.SmartBot);
  expect(smartBot instanceof Player).toBe(true);
  expect(smartBot instanceof Bot).toBe(true);
  expect(smartBot instanceof SmartBot).toBe(true);
  expect(smartBot instanceof RandomBot).toBe(false);
});

test('create throws error on invalid player type', () => {
  const t = () => Player.create('test', 1, 'invalid');
  expect(t).toThrow(new Error('Invalid player type: invalid'));
});

test('isValidName only returns true on valid names', () => {
  expect(Player.isValidName('player')).toBe(true);
  expect(Player.isValidName('Player1')).toBe(true);
  expect(Player.isValidName('Player 1')).toBe(false);
  expect(Player.isValidName('Player-1')).toBe(false);
  expect(Player.isValidName('Player_1')).toBe(false);
  expect(Player.isValidName('')).toBe(false);
  expect(Player.isValidName('0123456789')).toBe(true);
  expect(Player.isValidName('01234567890')).toBe(false);

});

test('toString returns Player name and plrNumber', () => {
  const player = new Player('test', 1);
  expect(player.toString()).toBe('test (1)');
});

test('setName with valid name changes Player.name', () => {
  const player = new Player('test', 'blue');
  player.name = 'someName';
  expect(player.name).toBe('someName');
});

test('Initial creation of player with invalid name throws error', () => {
  const t = () => new Player();
  expect(t).toThrow(new Error('Invalid player name: "undefined"'));
});

test('setName to invalid name throws error', () => {
  const player = new Player('test');
  const t = () => player.name = '    123';
  expect(t).toThrow(new Error('Invalid player name: "    123"'));
});