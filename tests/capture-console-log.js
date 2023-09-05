// Monkey patch console.log so we can read and test
// output to the console
let orgLogMethod = console.log;
let savedConsoleLogOutput = [];
console.log = (...args) => {
  // Save the console output for tests
  savedConsoleLogOutput.push(args);
  // apply takes a function and calls it with 
  // a certain "this" (in this case the console)
  // and an array of argument
  return orgLogMethod.apply(console, args);
}
function getConsoleLogOutput() {
  let copy = savedConsoleLogOutput.slice();
  savedConsoleLogOutput.length = 0 // empty original array
  return copy;
}

function resetConsoleLogOutput() {
  savedConsoleLogOutput.length = 0 // empty original array
}


module.exports = { getConsoleLogOutput, resetConsoleLogOutput };
