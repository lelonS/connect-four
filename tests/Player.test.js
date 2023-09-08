require('./load-all-classes.js');

test('Initial Player variables are correct', () => {
  const player = new Player('test', 1);
  expect(player.name).toBe('test');
  expect(player.plrNumber).toBe(1);
});

test('isValidName only returns true when name is string with alphabetical chararacters', () => {
  expect(Player.isValidName('123test')).toBe(false);
  expect(Player.isValidName('@@@#######test')).toBe(false);
  expect(Player.isValidName('')).toBe(false);
  expect(Player.isValidName('test')).toBe(true);
  expect(Player.isValidName('  testtt')).toBe(false);
  expect(Player.isValidName(true)).toBe(false);
  expect(Player.isValidName(123)).toBe(false);
});

test('toString returns Player name and plrNumber', () => {
  const player = new Player('test', 1);
  expect(player.toString()).toBe('test (1)');
});

test('setName with valid name changes Player.name', () => {
  const player = new Player('test', 'blue');
  player.name = 'someOtherName';
  expect(player.name).toBe('someOtherName');
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