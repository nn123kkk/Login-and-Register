//Use the application generator tool, express-generator, to quickly create an application skeleton.

//including all dependies

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer'); //for file uploads
var upload = multer({dest: './uploads'});  ////multer for file uplloads
var flash = require('connect-flash'); //ability to add messages, eg: when you are logged in
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose'); //way to interact with the database with application
var db = mongoose.connection;

var routes = require('./routes/index'); //setting up the index file in routes folder
var users = require('./routes/users');  //setting up the users file in routes folder


//intializing the app

var app = express();

// view engine setup jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




//middleware
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //want public to be a static folder

// Create a session middleware with the given options.
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//middleware for the messages

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
})


//using the route that have been declared

app.use('/', routes); //using the route that have been declared 
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
