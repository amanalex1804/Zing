// generate object for testing

var moment = require('moment');
var date = moment();  

 var generateMessage = (from,text) =>{
 	return {
 		from,
 		text,
 		createdAt : moment().valueOf()
 	};
 };


 module.exports = {generateMessage};