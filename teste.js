const readline = require('readline');

const r1 = readline.createInterface({input: process.stdin});

r1.on('line', line => console.log(line))