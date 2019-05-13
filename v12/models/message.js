
// message schema

var mongoose   = require("mongoose");
var moment     = require("moment");

var messageSchema = new mongoose.Schema({
	   
	   content    : String,
	   img        : {data: Buffer,contentType:String},

       createdAt :  {
		            type: String, 
                    default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
             },
	   author: {
            	id: {
     					type : mongoose.Schema.Types.ObjectId, 
     					ref : "User"
     	            },
     			username : String
            }
   
      

});


 module.exports = mongoose.model("message",messageSchema);