
/**
 *  Schema for blogs
 *  
 */

var mongoose   = require("mongoose");

var answersSchema = new mongoose.Schema({
	   
	   content    : String,

     created    : {type: Date,default : Date.now},
	   author: {
            	id: {
     					type : mongoose.Schema.Types.ObjectId, 
     					ref : "User"
     	            },
     			username : String
     },
     likes_count    : Number,
   
      

});


 module.exports = mongoose.model("Answers",answersSchema);