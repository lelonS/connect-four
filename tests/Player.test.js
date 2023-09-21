require('./load-all-classes.js');

test('Initial Player variables are correct', () => {
  const player = new Player('test', 1);
  expect(player.name).toBe('test');
  expect(player.plrNumber).toBe(1);
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