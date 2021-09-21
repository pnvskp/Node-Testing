let userid=  'pnvskp@gmail.com';

let password = 'g.c?Vm37)PjxQg@';

const bcrypt = require('bcrypt');

// console.log('Before:',hashedpassword);

let hashedpassword = bcrypt.hashSync(password, 10, (err,hash)=>{
    return hash;
});

let Token_Secret = '43ref;sfdhg.';
// console.log('Result',hashedpassword);

module.exports = {userid, hashedpassword,Token_Secret};