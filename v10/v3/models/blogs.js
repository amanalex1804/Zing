
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
     },
     likes_count    : Number,
   
    comments : [
     {
      type : mongoose.Schema.Types.ObjectId,
      ref: "Comment"
     }]
     

});


 module.exports = mongoose.model("Blogs",blogsSchema);