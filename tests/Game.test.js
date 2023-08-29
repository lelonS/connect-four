require('./load-all-classes.js');
const { getConsoleLogOutput, resetConsoleLogOutput } = require('./capture-console-log.js');

test('Temp', () => {
  expect(true).toBe(true);
})
