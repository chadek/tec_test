// init application by seedind coach and candidate data to bd

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// connecting to db
const url = "mongodb://localhost:27017/tec_test";
mongoose.connect(url, { useMongoClient: true });

// getting json data from seed files
const coachSeed = require('./coachSeed.json');
const candidateSeed = require('./candidateSeed.json');

// require mongoose model (define in /model/models.js)
var models = require('../model/models')(mongoose);


// filling database with coaches data
coachSeed.forEach( function(data,index) {
	// hash password before storage in db
	pwdHash = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
	var coach = new models.Coach({ email: data.email, password: pwdHash });
	coach.save(function(err, result) {
		if (err) throw err;
		console.log("COACH CREATED : " + data.email +" password : "+ data.password);
	}); 
});

// filling database with candidates data
candidateSeed.forEach( function(data,index) {
	var candidate = new models.Candidate({ name: data.name, surname: data.surname});
	candidate.save(function(err, result) {
		if (err) throw err;
		console.log("CANDIADTE CREATED : ", data.name);
	}); 
});

// print coaches stored in database for debug
models.Coach.find(function(err, result) {
	if (err) throw err;
	//console.log(result);
});
// print candidates stored in database for debug
models.Candidate.find(function(err, result) {
	if (err) throw err;
	//console.log(result);
});

mongoose.connection.close();