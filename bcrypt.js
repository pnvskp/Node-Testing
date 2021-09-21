const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')();

const credentials= require('./credentials');

let username = prompt('Enter username:');
console.log(username);
if(!username) return 'error';

let password = prompt('Enter Password : ');
console.log(password);
if(!password) return 'error';

let plainTextpassword = 'g.c?Vm37)PjxQg@';


let hashedResult = bcrypt.hashSync(plainTextpassword,10,async (err,hash) =>{
    console.log(hash);
    let result = hash;
    return res
    
    });

// console.log('Hash: ',credentials);

let output = bcrypt.compareSync(plainTextpassword, credentials.hashedpassword);

// console.log(output);

