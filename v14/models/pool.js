// model for storing unsolved asks

var mongoose   = require("mongoose");


var moment     = require("moment");

var poolSchema = new mongoose.Schema({
   
   content    : String,
   img        : {data: Buffer,contentType:String},
   room       : String,
   author: {
              id: {
              type : mongoose.Schema.Types.ObjectId, 
              ref : "User"
                  },
          username : String
            }
   
      

});


 module.exports = mongoose.model("pool",poolSchema);