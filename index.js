var express = require('express');
var session = require('express-session')
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer')
var passport = require("./auth.js"); 
var mongoose = require('mongoose');

// connecting to db
var url = "mongodb://localhost:27017/tec_test";
mongoose.connect(url, { useMongoClient: true });

// require mongoose model (define in /model/models.js)
var models = require('./model/models')(mongoose);


var app = express();

// setting views path and render engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setting up session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

// initiate passport module
app.use(passport.initialize());
app.use(passport.session());

// setting up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// setting up multer conf : store in disk in ./tmp folder 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({ storage: storage }).single('video');

/*------Route------*/

//=====GET ROUTE===//
app.get('/', function(req, res, next) {
  if(req.user){
    res.send("Your are succesfully log in "+ req.user);
  } else{
    res.render('index');
  }
});

app.get('/upload', function(req, res, next) {
  if(req.user){
    res.render('upload', {user: req.user });
  } else{
    res.redirect('/');
  }
});

app.get('/candidates', function(req, res, next) {
  if(req.user){
    models.Candidate.find( function(err, result) {
    if (err) throw err;
    console.log(result);
    res.render('candidates', {user: req.user, candidates: result });
  });
  } else{
    res.redirect('/');
  }
});


// logging out
app.get('/logout', function(req, res){
  console.log("LOGGIN OUT " + req.user);
  req.logout();
  res.redirect('/');
});


//=====POST ROUTE===//

// upload file using multer
app.post('/upload/file', function(req, res) {
  if(req.user){
    var buffer = req.file
    upload(req, res, function(err) {
        res.end('File is uploaded');
  
    })
  } else {
    res.redirect('/');
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

// start app on port 3000
app.listen(3000, function() {  
    console.log("My API is running...");
});

module.exports = app;
