var express = require('express');
var session = require('express-session')
var path = require('path');
var fs = require('fs');
var mv = require('./mv');
var bodyParser = require('body-parser');
var multer  = require('multer')
var passport = require("./auth"); 
var mongoose = require('mongoose');
var dirPath = require('./filePath.json');

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

// config multer middleware with storage configured previously
var upload = multer({ storage: storage });


/*------Route------*/

//=====GET ROUTE===//
// index route
app.get('/', function(req, res, next) {
  if(req.user){
    res.send("Your are succesfully log in "+ req.user);
  } else{
    res.render('index');
  }
});

// route to upload file form
app.get('/upload', function(req, res, next) {
  if(req.user){
    res.render('upload', {user: req.user });
  } else{
    res.redirect('/');
  }
});

// route to candidates list
app.get('/candidates', function(req, res, next) {
  if(req.user){
    models.Candidate.find( function(err, result) {
      if (err) throw err;
      //console.log(result);
      res.render('candidates', {user: req.user, candidates: result });
  });
  } else{
    res.redirect('/');
  }
});

// route to files list
app.get('/files', function(req, res, next) {
  if(req.user){
    models.File.find( function(err, result) {
      if (err) throw err;
      //console.log(result);
      res.render('files', {user: req.user, files: result });
  });
  } else{
    res.redirect('/');
  }
});


// route to log out
app.get('/logout', function(req, res){
  console.log("LOGGIN OUT " + req.user);
  req.logout();
  res.redirect('/');
});


//=====POST ROUTE===//

// upload file using multer on post request
app.post('/upload/file', upload.single('video'), function(req, res) {
  if(req.user){
    if (req.file == undefined){
      console.log("No file sent");
      res.send(" Please choose a file before sending");
    } else {
      //console.log(req.file);

      var filePath = dirPath.in.mp4_1080p+req.file.filename;
      mv(req.file.path, filePath, function(err){
        if (err) throw err;
        console.log("File succesfully moved to input_mp4_1080p creating links...");
        console.log(filePath);
        console.log(filePath.mp4_720p+req.file.filename);
        fs.link(filePath, dirPath.in.mp4_720p+req.file.filename, function(){console.log("Linked mp4_720")});
        fs.link(filePath, dirPath.in.mp4_480p+req.file.filename, function(){console.log("Linked mp4_480")});
        fs.link(filePath, dirPath.in.ogv_1080p+req.file.filename, function(){console.log("Linked ogv_1080")});
        fs.link(filePath, dirPath.in.ogv_720p+req.file.filename, function(){console.log("Linked ogv_720")});
        fs.link(filePath, dirPath.in.ogv_480p+req.file.filename, function(){console.log("Linked ogv_480")});
      });

      res.end('File is uploaded');
    }
  } else {
    res.redirect('/');
  }

  
});



/* post request that trigger the local-signin auth process (see auth.js) */
app.post('/authenticate', passport.authenticate('local-signin', { 
  successRedirect: '/upload',
  failureRedirect: '/'
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send("Error 404 file not found...")
});

// start app on port 3000
app.listen(3000, function() {  
    console.log("My API is running...");
});

module.exports = app;