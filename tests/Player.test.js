require('./load-all-classes.js');

test('Player creation', () => {
  const player = new Player('test', 'blue');
  expect(player.name).toBe('test');
  expect(player.color).toBe('blue');
})

test('isValidName test', () => {
  expect(Player.isValidName('123test')).toBe(false);
  expect(Player.isValidName('@@@#######test')).toBe(false);
  expect(Player.isValidName('')).toBe(false);
  expect(Player.isValidName('test')).toBe(true);
  expect(Player.isValidName('  testtt')).toBe(false);
  expect(Player.isValidName(true)).toBe(false);
  expect(Player.isValidName(123)).toBe(false);
})

test('player toString', () => {
  const player = new Player('test', 'blue');
  expect(player.toString()).toBe('test (blue)');
})

test('setName', () => {
  const player = new Player('test', 'blue');
  player.name = 'someOtherName';
  expect(player.name).toBe('someOtherName');
})

test('test no name', () => {
  const t = () => new Player();
  expect(t).toThrow(new Error('Invalid player name: "undefined"'));
})

test('change name error throw', () => {
  const player = new Player('test');
  const t = () => player.name = '    123';
  expect(t).toThrow(new Error('Invalid player name: "    123"'));
});