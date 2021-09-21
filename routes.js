const express  = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const msal = require('@azure/msal-node');
const app         = express();



const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const credentials  = require('./credentials');
const ddb = require('./ddb');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);

// Before running the sample, you will need to replace the values in the config,
    // including the clientSecret
    const config = {
        auth: {
            clientId: "a67b6cad-0b0c-43cb-b656-13bc254f82ef",
            authority: "https://login.microsoftonline.com//52e06996-39e8-4918-baf6-87adb493f63e",
            clientSecret: "y9fwzN3E~~-vsyHS7hG.tO4XvIQFL9BALx",
            knownAuthorities:["https://login.microsoftonline.com//52e06996-39e8-4918-baf6-87adb493f63e"]
            // clientSecret: "2e101530-637b-4e84-9ec9-75d0948952be"
        },
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message, containsPii) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: msal.LogLevel.Verbose,
            }
        }
    };

     // Create msal application object
     const cca = new msal.ConfidentialClientApplication(config);


app.get('/', (req,res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "http://localhost:7000/redirect",
    };

    // get url to sign user in and consent to scopes needed for application
    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:7000/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        // res.sendStatus(200);
        res.render('login');
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

app.get('/signup',(req,res) =>{
    res.render('signup');
})

app.post('/signup',(req,res)=>{
    const newUser = {
        id:req.body.id,
        password:req.body.password
    };

    if (!req.body.id) return res.send('Enter username to proceed');
    if(!req.body.password) return res.send('Enter password to proceed');

    newUser.password = bcrypt.hashSync(newUser.password,10);

    const tokenName = 'Test Token';

    

    ddb.addUser(user).then(result => console.log(`User Added to Database. The user data is ${result}`));
    res.redirect('/login');
    
})

app.get('/login', (req,res) =>{
    // console.log('Logged In');
    // res.send('User is Logged in');
    res.render('login');
});

app.post('/login',(req,res)=>{
    
    const user = {
        id : req.body.id,
        password : req.body.password
    };


    if (!req.body.id) return res.send('Enter username to proceed');
    if(!req.body.password) return res.send('Enter password to proceed');

    ddb.getUserById({'id':user.id}).then((user) =>{
        if(!user) return res.send('No user found');
    
 bcrypt.compare(req.body.password,user.password,(err,isMatch) =>{
     if(!isMatch) return res.send({message:"Entered Password is incorrect"});
    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24, // expires after one day
        sameSite: 'None',
        secure: true,
      };

      cookieOptions.domain  = '127.0.0.1'; 

      res.cookie('Test Token', generateToken(req.body.id,req.path), cookieOptions);
      res.redirect('/data');
      
     })
})
});

app.get('/data',(req,res) =>{
    if(req.user){
    let {id}  = req.user;
    console.log('User',id);
  
    res.render('data',{loggedUser:id? id : 'N/A'});
    }
    else{
        res.redirect('/login');
    }

})

app.post('/api/logout',(req,res) =>{
    console.log('Logout');
    const cookieOptions = {
        maxAge:1000*60*60*24,
        domain: '127.0.0.1'
    };

    res.cookie('Test Token','',cookieOptions);
    res.redirect('/login');
    // res.send({ message:'Logged out successfully'});
    
});

app.get('/chat', (req,res)=>{
    res.sendFile(__dirname + '/views/index.html');
});


  io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  
  io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    })
  });


function logger (req,res,next) {
    // console.log('Log');
    next();
}

async function auth (req,res,next){
    isAuthenticated = () =>{
    const tokenName = 'Test Token';
    const token= req.cookies[tokenName] ;
    if (token) {
        try {
          return jwt.verify(token, credentials.Token_Secret);
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    console.log('Cookies',req.cookies[tokenName] );
    }
    const payload = isAuthenticated();
    // console.log('Payload:',payload);
    if (payload){
        req.user = await ddb.getUserById({id:payload.sub})
        }
        next();
    }


function generateToken(user,appUrl){
    const payload = {
        iss: appUrl,
        sub:user,
        iat: moment().unix(),
      };
      return jwt.sign(payload, credentials.Token_Secret,{expiresIn: moment().add(5,'days').unix()});
}

server.listen(7000);

clientSecret: "-TvE50GS2PpjK71S_4z_3BmWn.3H-xmfDc"