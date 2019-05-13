
/**
 *  Schema for blogs
 *  
 */

var mongoose   = require("mongoose");

var blogsSchema = new mongoose.Schema({
	   
	   title      : String,
	   content    : String,

       created    : {type: Date,default : Date.now},
	   author: {
            	id: {
     					type : mongoose.Schema.Types.ObjectId, 
     					ref : "User"
     	            },
     			username : String
     }

});


 module.exports = mongoose.model("Blogs",blogsSchema);