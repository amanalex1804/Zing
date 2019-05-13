
/**
 *  Schema for blogs
 *  
 */

var mongoose   = require("mongoose");

var blogsSchema = new mongoose.Schema({
	   
	   title   : String,
	   image   : String,
	   body    : String

})