const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const fileName = path.join(__dirname, 'text.txt');

const writeableStream = fs.createWriteStream(fileName);
const { stdin, stdout } = process;
const rl = readLine.createInterface({
  input: stdin,
  output: stdout,
  prompt: '\nPlease enter your text...\n>',
});

stdout.write('\nHello! To exit type `exit` or ctrl + c.\n');

rl.prompt();
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
  } else {
    writeableStream.write(`${input}\n`);
    rl.prompt();
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write(`\nBye! File saved in path: ${fileName}\n`);
  writeableStream.close();
  rl.close();
});
