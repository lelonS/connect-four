// fs -> node.js library to handle the file system
let fs = require('fs');
// path -> node.js library to handle file paths
let path = require('path');
// path to index.html
let indexPath = path.join(__dirname, '..', 'src/index.html');
// path to the classes folder
let classesPath = path.join(__dirname, '..', 'src/classes');

// get all the classNames from index.html
let classNames = fs.readFileSync(indexPath, 'utf-8')
  .split('classes/').slice(1)
  .map(fileName => fileName.split('"')[0].slice(0, -3));

// load the classes into memory for use with Jest tests
classNames.forEach(className => {
  let content = fs.readFileSync(
    path.join(classesPath, className + '.js'), 'utf-8'
  );
  eval(`globalThis.${className} = ${content}`);
});