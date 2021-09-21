const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const app       = express();

const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

let keycloakConfig = 
    {
        "realm": "demorealm",
        "auth-server-url": "http://localhost:8080/auth/",
        "ssl-required": "external",
        "resource": "democlient",
        "verify-token-audience": true,
        "credentials": {
          "secret": "7cd3f0b0-7d1e-4511-badd-1c05cfff6f14"
        },
        "use-resource-role-mappings": true,
        "confidential-port": 0,
        "policy-enforcer": {}
      }


let keycloak = new Keycloak({
    store:memoryStore
},keycloakConfig);

app.use(keycloak.middleware());

app.get('/login', keycloak.protect('test'), function (req, res) {
   res.send('Logged In');
  });

  app.get('/public',function(req,res){
      res.send('This is a public web page that can be accessed by all');
  })

  app.listen(7000);