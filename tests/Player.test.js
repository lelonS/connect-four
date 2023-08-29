require('./load-all-classes.js');

test('Player creation', () => {
  const player = new Player('test', 'blue');
  expect(player.name).toBe('test');
  expect(player.color).toBe('blue');
})

test('isValidName test', () => {
  expect(Player.isValidName('123test')).toBe(false);
  expect(Player.isValidName('@@@#######test')).toBe(false);
  expect(Player.isValidName('test')).toBe(true);
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