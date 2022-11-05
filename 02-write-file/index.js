const readline = require('readline');
const {stdin: input, stdout: output} = require('process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({input, output});
const fileName = path.join(__dirname, 'out.txt');

openFile(fileName);
console.log('Input data:');

rl.on('line', (input) => {
  if (input === 'exit') end();
  appendFile(input + '\n');
});

rl.on('SIGINT', end);

function openFile(name){
  fs.open(name, 'w', (err) => {
    if(err) throw `Open file error: ${err}`;
  });
}

function appendFile(input){
  fs.appendFile(fileName, input, (err) => {
    if(err) throw `Append file error: ${err}`;
  });
}

function end(){
  console.log(`Data entry is completed. Data is saved in file ${fileName}`);
  rl.close();
}