
var express = require('express'),
	router  = express.Router();
var Pool    = require("../models/pool"),
    Chat    = require("../models/chat"),
    User    = require("../models/user"), 
    Message = require("../models/message"), 
    middleware  = require("../middleware");

var cnt = Math.random();

 router.get("/",function(req,res){
 	res.redirect("/");
 });

 router.get("/ask",function(req,res){
 	res.render("ask/ask");
 });

router.post("/ask",function(req,res){
	console.log(req.body);


  ///image part is not done
  /// tag part is also not done
  
	var content = req.body.message;
	var author  = {
		id       : req.user._id,
		username : req.user.username
	}
    var room = "room-"+cnt;
    cnt = Math.random();
    console.log("room bante");
    console.log(room);
    console.log(typeof room);
   var newAsk = {content : content,author : author,room : room};

   Pool.create(newAsk,function(err,newlyCreated){
   	if(err) throw err;
   	console.log("Ask added");
   	res.render("ask/wait",{feed : newlyCreated,currentUser : req.user.username});
   });



	// push into not done array
	

});

router.get("/solve",function(req,res){

	//print the notdone array
	
	  
      Pool.find({},function(err,allAsk){
        if(err){
          console.log(err);
        }else{
          res.render("solve/pool",{feeds:allAsk,currentUser : req.user});
        }
      });


});



router.get("/take/:id",async function(req,res){

	await Pool.findById(req.params.id).exec(async function(err,foundTake){

		if(err) throw err;

		var author   = foundTake.author;
		var content  = foundTake.content;
		var room     = foundTake.room;

		var newMessage = { author : author, content :content};
		var tutor   = {
	   	  id       : req.user._id,
	   	  username : req.user.username
	   }

	    var temp;





          var feed ={ room : room};
	      var newChat = {author : foundTake.author,tutor: tutor};

          var docs = await Chat.create(newChat,async function(err,chat){
            	if(err) throw err;

            	console.log("acha new chat hai");
            	console.log(chat);
            	temp =chat._id;
            	console.log(typeof chat._id);
            	console.log("tem ka val");
            	console.log(temp);
            	console.log(typeof temp);
            	chat.messages.push(newMessage);
            	chat.save();
                console.log(chat);


                res.render("ask/wait",{feed : feed,currentUser : req.user.username});
                console.log("Niche k  kaam krta hu");
            });
          console.log("USse bhi niche");



    


	});

	

});
module.exports = router;