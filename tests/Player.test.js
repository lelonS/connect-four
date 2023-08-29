require('./load-all-classes.js');

test('Player creation', () => {
  const player = new Player('test', 'blue');
  expect(player.name).toBe('test');
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
