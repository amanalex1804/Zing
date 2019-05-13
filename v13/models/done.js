// for completed or satisfied chat
 
var mongoose = require("mongoose");

var doneSchema = new mongoose.Schema({
	author :{
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref :"User"
		},
		username : String
	},
	tutor : {
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref :"User"
		},
		username : String
	},
	rating : Number,
	room : String
});

module.exports = mongoose.model("done",doneSchema);