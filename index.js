var express = require('express');
var session = require('express-session')
var path = require('path');
var bodyParser = require('body-parser');


var passport = require("./auth.js"); 


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(req, res, next) {
  if(req.user){
    res.render('candidate', {user: req.user.user });
  } else{
    res.render('index', { user: '' });
  }
});

app.get('/upload', function(req, res, next) {
  if(req.user){
    res.render('upload', {user: req.user.user });
  } else{
    res.render('index', { user: '' });
  }
});

/* connection */
app.post('/authenticate', passport.authenticate('local-signin', { 
  successRedirect: '/upload',
  failureRedirect: '/'
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, function() {  
    console.log("My API is running...");
});

module.exports = app;
