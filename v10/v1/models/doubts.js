
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
      
    answers : [{
         content    : String,
         author: {
                 id: {
                        type : mongoose.Schema.Types.ObjectId, 
                        ref : "User"
                    },
                username : String
             },
         likes_count    : Number,

      }]


    /*
     answers : [
     {
      type : mongoose.Schema.Types.ObjectId,
      ref: "Answers"
     }]
     */
});


 module.exports = mongoose.model("Doubts",doubtsSchema);