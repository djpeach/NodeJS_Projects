// ------------------- IMPORTS ------------------- //
const express = require('express'); // express module for building web app
const path = require('path'); // path package for specifying static paths
const logger = require('morgan'); // developer's logging tool for http requests
const cookieParser = require('cookie-parser'); // parses cookie information
const session = require('express-session'); // gives us integrated session capabilities with express
const passport = require('passport'); // authentication package for local or remote logins
const LocalStrategy = require('passport-local').Strategy; // Strategies (method implementations) for passport
const bodyParser = require('body-parser'); // parses the http request body
const flash = require('connect-flash'); // Gives us integrated flash message capabilities
const mongoose = require('mongoose'); // Library for interacting with MongoDB more naturally

// ------------------- CONNECT TO DATABASE ------------------- //
const dbUrl = 'mongodb://localhost/loginExample'; // set database address to var dbUrl
mongoose.connect(dbUrl); // connect to database using dbUrl
mongoose.Promise = global.Promise; // Set mongoose's Promises to global type Promises??? LOOK INTO
const db = mongoose.connection; // get a reference to the database connection for configuration
db.on('error', console.error.bind(console, 'MongoDB connection error')); // Configure database connection to bind errors to console

// ------------------- IMPORT ROUTES ------------------- //
const index = require('./routes/index'); // Get reference to index route module
const users = require('./routes/users'); // Get reference to users route module

// ------------------- START APP ------------------- //
const app = express(); // Start express app and store reference to it

// ------------------- VIEW ENGINE SETUP ------------------- //
app.set('views', path.join(__dirname, 'views')); // Use path module to set static path to the views directory
app.set('view engine', 'pug'); // Set view engine to pug (aka jade)

// ------------------- MIDDLEWARE SETUP ------------------- //
app.use(logger('dev')); // Set logger to development to get http request and response logging in console LOOK INTO
app.use(bodyParser.json()); // Configure bodyParser to expect json data LOOK INTO
app.use(bodyParser.urlencoded({ extended: true })); // Further configure bodyParser LOOK INTO
app.use(cookieParser()); // Use cookie parser in app
app.use(express.static(path.join(__dirname, 'public'))); // Use path module to set static paths for static files (imgs, css, etc)


app.use(session({
  secret: 'secret',
  saveUninitialized: 'true',
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session()); // Needs to come after express-session

// Flash and express-messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
