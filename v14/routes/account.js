
var express = require('express'),
	  router  = express.Router();
var Pool    = require("../models/pool"),
    Chat    = require("../models/chat"),
    User    = require("../models/user"), 
    Message = require("../models/message"), 
    middleware  = require("../middleware"),
    Done    = require("../models/done");
    const {generateMessage,generateimg} = require('../utils/message');
    // for alert
 


  var url = "mongodb://localhost/zingf";
 const mongo = require('mongodb').MongoClient;

 router.get("/",function(req,res){
 	res.redirect("/");
 });

// payment gateway for subscription
// 
router.get("/sub",function(req,res){
	res.send("WWOHHHH");
});

router.get("/account",function(req,res){
	res.render("account/index",{currentUser:req.user});
});



router.get("/author/:id",function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("done").find({"author.username": req.params.id}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0) {
				res.render("account/author",{feeds : found,currentUser : req.user});
			}else{
				req.flash("error","Nothing to show");
				res.redirect("/account");
			}
		});
	});
});

router.get("/tutor/:id",function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("done").find({"tutor.username": req.params.id}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0) {
				res.render("account/author",{feeds : found,currentUser : req.user});
			}else{
				req.flash("error","Nothing to show");
				res.redirect("/account");
			}
		});
	});
});

// show chats

router.get("/show/:id",function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("message").find({"room":req.params.id}).toArray(function(err,found){
			if(err) throw err;
			console.log("message aate hum");
			console.log(found.length);
			res.render("account/show",{feeds : found});
		})
	})
})





module.exports = router;