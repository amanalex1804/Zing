// generate object for testing

var moment = require('moment');
var date = moment();  

 var generateMessage = (from,text,room) =>{
 	return {
 		from,
 		text,
 		createdAt : moment().valueOf(),
 		room,
 		img : "0"
 	};
 };

 var generateimg = (from,text,room) =>{
 	return {
 		from,
 		text,
 		createdAt : moment().valueOf(),
 		room,
 		img : "1"
 	}
 }


 module.exports = {generateMessage,generateimg};