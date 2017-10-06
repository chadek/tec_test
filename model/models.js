//====Mongoose model==== 
module.exports = function(mongoose) {
    var coachSchema = mongoose.Schema({
	  email: String,
	  password: String
	});
	var candidateSchema = mongoose.Schema({
	  name: String,
	  surname: String
	});
    // declare seat covers here too
    var models = {
		Coach: mongoose.model('Coach', coachSchema),
		Candidate: mongoose.model('Candidate', candidateSchema)
    };
    return models;
}





/*



const coachSchema = mongoose.Schema({
  email: String,
  password: String
});

const candidateSchema = mongoose.Schema({
  name: String,
  surname: String
});

var Coach = mongoose.model('Coach', coachSchema);
var Candidate = mongoose.model('Candidate', candidateSchema);
*/