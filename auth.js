var passport = require('passport');
var LocalStrategy = require('passport-local');
var sanitize = require('mongo-sanitize');
var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

// connecting to db
var url = "mongodb://localhost:27017/tec_test";
mongoose.connect(url, { useMongoClient: true });

// require mongoose model (define in /model/models.js)
var models = require('./model/models')(mongoose);


// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  //{ passReqToCallback : true }, //allows us to pass back the request to the callback
  function(username, password, done) {

    console.log(password);
    // prevent noSQL injection
    username = sanitize(username);
    password = sanitize(password);

    console.log(username);

    //connect to db
    models.Coach.findOne({email: username}, function(err, result) {

      console.log("USERNAME input :", username);
      if (err) throw err;
      // if no match 
      if (null == result) {
        console.log("USERNAME NOT FOUND:", username);
        //req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        //req.session.errorCause = 'badLog';
        done(null, result.email);

      } else {
        console.log("FOUND USER: " + result.email);
        // compare pwd to pwd store in db
        if (bcrypt.compareSync(password, result.password)){
          console.log("LOGGED IN AS: " + result.email);
          //req.session.success = 'You are successfully logged in ' + resul.email + '!';
          // sending back user
          done(null, result.email);
        } else {
          console.log("AUTHENTICATION FAILED");
          //req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
          //req.session.errorCause = 'badLog';
          done(null, result.email);
        }
      }
    });
  }
));

module.exports = passport;