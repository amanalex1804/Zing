/**
 *  User Schema
 * 
 */

 
 var mongoose              = require("mongoose");
 var passportLocalMongoose = require("passport-local-mongoose");
 var uniqueValidator       = require("mongoose-unique-validator");



 

 var UserSchema = new mongoose.Schema({
  		username : {
  			type     : String,
  			index    : true,
  			unique   : true,
  			required : [true, "can't be blank"],
  			match    : [/^[a-zA-Z0-9]+$/,'is invalid']
  		},

  		email :{
  			type        : String,
  			unique      : true,
  			required    : [true,"can't be blank"],
  			match       : [/\S+@\S+\.\S+/,'is invalid'],
  			index       : true
  		},

      password : String

  

 });


 UserSchema.plugin(uniqueValidator,{message : 'is already taken'});
 UserSchema.plugin(passportLocalMongoose);


 module.exports = mongoose.model("User",UserSchema);