
require('dotenv').config();

const express = require('express');

const app = express();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const dbInitialize = require('./services/dbInitialize');
const routeInitialize = require('./routes');
const passportInitialize = require('./config/passport');
const session = require('express-session');

/*const sslOptions = {
  key: fs.readFileSync('config/cert/backend.key', 'utf8'),
  cert: fs.readFileSync('config/cert/backend.pem', 'utf8'),
};*/

let server; //eslint-disable-line
if(process.env.NODE_ENV === 'development') {
  server = require('http').createServer(app); // eslint-disable-line
} else {
  server = require('https').createServer(sslOptions, app); //eslint-disable-line
  http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url }); // eslint-disable-line
    res.end();
  });
}

app.options('*', cors());
app.use(cors());
// Wide-open CORS configuration (change before this is considered production-ready)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.use(require('morgan')('dev'));
app.use(require('body-parser').urlencoded({ limit: '50mb', extended: true }));
app.use(require('body-parser').json({ limit: '50mb' }));
app.use(require('express-session')({ secret: config.app.secret, resave: true, saveUninitialized: true }));
app.use(require('cookie-parser')());

app.use(passport.initialize());
app.use(passport.session());
dbInitialize(app);
const { tbusers } = app.get('models');
passportInitialize(passport, tbusers);
app.use(express.static(path.join(__dirname, '/public'))); //eslint-disable-line
routeInitialize(app);

if(process.env.NODE_ENV === 'development') {
  server.listen(config.app.port, () => {
    console.log('Server listening at port %d', config.app.port);
  });
} else {
  server.listen(config.app.port, () => {
    console.log('SSL server is running at ', config.app.port);
  });
}


