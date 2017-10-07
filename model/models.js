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

	var fileSchema = mongoose.Schema({
		filename: String,
		path: String,
		encoding: String,
		scale: String
	});  
    // try to get model, if doesn't exit then init with schema
    let models 
    try {
	    models = {
			Coach: mongoose.model('Coach'),
			Candidate: mongoose.model('Candidate')
	    };
	} catch (error) {
		models = {
			Coach: mongoose.model('Coach', coachSchema),
			Candidate: mongoose.model('Candidate', candidateSchema)
	    };
	}
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