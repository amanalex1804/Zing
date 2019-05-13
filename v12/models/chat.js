// chat model for each room

var mongoose = require('mongoose'),
    moment   = require('moment');

var chatSchema  = new mongoose.Schema({

	createdAt :  {
		type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
       },
	author    : {
		id :{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	},

	tutor     : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	},

	messages :[{
		author :{
			id :{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
	        	}
		},
		content : String
	}]


});

module.exports = mongoose.model("chats",chatSchema);

