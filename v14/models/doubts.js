
/**
 *  Schema for doubts
 *  
 */

var mongoose   = require("mongoose");

var doubtsSchema = new mongoose.Schema({
	   
	   title      : String,
	   content    : String,
     tags       : String,
     created    : {type: Date,default : Date.now} ,
	   author: {
            	id: {
     					type : mongoose.Schema.Types.ObjectId, 
     					ref : "User"
     	            },
     			username : String
      },


    
     answers : [
     {
      type : mongoose.Schema.Types.ObjectId,
      ref: "answers"
     }]
     
});


 module.exports = mongoose.model("doubts",doubtsSchema);