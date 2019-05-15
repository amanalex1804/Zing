// js file for account information

var express = require('express'),
	router  = express.Router();
var Pool    = require("../models/pool"),
    
    User    = require("../models/user"), 
   
    middleware  = require("../middleware");
    
    const {generateMessage,generateimg} = require('../utils/message');
    var nodemailer = require('nodemailer');
    
 


// function to send email

 function sendReport(to,sub,con){

		var transporter = nodemailer.createTransport({
		 service: 'gmail',
		 auth: {
		        user: 'kumarrocky436@gmail.com',
		        pass: 'alex2468'
		    }
		});

		const mailOptions = {
		  from: 'kumarrocky436@gmail.com', // sender address
		  to: to, // list of receivers
		  subject: sub, // Subject line
		  html: con// plain text body
		};

		transporter.sendMail(mailOptions, function (err, info) {
               if(err) console.log(err)
              });
 }



 var url = "mongodb://localhost/zingf";
 const mongo = require('mongodb').MongoClient;

 router.get("/",function(req,res){
 	res.redirect("/");
 });

// payment gateway for subscription

router.get("/sub",function(req,res){
	res.render("account/subscription");
});

// account information

router.get("/account",middleware.isLoggedIn,function(req,res){
	res.render("account/index",{currentUser:req.user});
});


// route for chats where user is author

router.get("/author/:id",middleware.isLoggedIn,function(req,res){
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

// route for chats where user is tutor

router.get("/tutor/:id",middleware.isLoggedIn,function(req,res){
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

router.get("/show/:id",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("message").find({"room":req.params.id}).toArray(function(err,found){
			if(err) throw err;
			
			res.render("account/show",{feeds : found});
		});
	});
});




// admin tasks

router.get("/admin",middleware.isLoggedIn,function(req,res){
   
   res.render("admin/index");

});




router.get("/payment",middleware.isLoggedIn,function(req,res){
	res.render("account/payment");
});


// reporting task of admin

router.get("/adminr",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("report").find({}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0){
				res.render("admin/report",{feeds : found});
			}else{
				req.flash("Nothing to show");
				res.redirect("/admin");
			}
		});
	});
});

// show report

router.get("/admin/:id/:id2",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;
		var dbo = db.db("chatsdb");

		dbo.collection("message").find({"room":req.params.id}).toArray(function(err,found){
			if(err) throw err;
			res.render("admin/show",{feeds : found,id:"0",guilty : req.params.id2});
		});
	});
});

//adding vulnerable users

router.get("/admin/:id",middleware.isLoggedIn,function(req,res){

		mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("vuluser").findOne({"username":req.params.id},function(err,found){
			if(err) throw err;
			if(!found){
				dbo.collection("vuluser").insertOne({username:req.params.id,reported:1});
			}else{
				var temp = found.reported;
				dbo.collection("vuluser").updateOne({"username":req.params.id},{$set:{'reported':temp+1}})
			}
		});
	});
});





//for review

router.get("/adminrev",middleware.isLoggedIn,function(req,res){

		mongo.connect(url,function(err,db){
		if(err) throw err;

		var dbo = db.db("chatsdb");

		dbo.collection("review").find({}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0){
				res.render("admin/review",{feeds : found});
			}else{
				req.flash("Nothing to show");
				res.redirect("/admin");
			}
		});
	});

});

// show revieww

router.get("/admin/:id/:id2",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;
		var dbo = db.db("chatsdb");

		dbo.collection("message").find({"room":req.params.id}).toArray(function(err,found){
			if(err) throw err;
			res.render("admin/show",{feeds : found,id:"1"});
		});
	});
});


// paying the base price for review 

router.get("/pay/:id",middleware.isLoggedIn,function(req,res){

var counter =2;
if(counter == 0) counter = 5;
 var mon = 0;
 if(counter <=2) mon =10;
 else if(counter ==3) mon =20;
 else if(counter ==4) mon = 25;
 else if(counter ==5) mon = 30;


mongo.connect(url,async function(err,db){
    if(err) throw err;
    
    var dbo = db.db("chatsdb");
     
    dbo.collection("all").findOne({room : req.params.id},async function (err,found){
        if(err) throw err;
          var docs = await dbo.collection("done").insertOne({room : found.room,author : found.author,tutor: found.tutor,rating :counter});
          
           User.findOneAndUpdate({"username": found.tutor.username }, { $inc: { money: mon } }, {new: true },function(err, response) {
             if(err) throw err;
           });
    });
     
        

          var docs = await dbo.collection("undone").deleteMany({room:req.params.id});
          var docs = await dbo.collection("review").deleteMany({room:req.params.id});
                
          var docs = await dbo.collection("author").deleteMany({"room" : req.params.id,"author.username": req.user.username});
    

    
  });
});


//payment to users

router.get("/adminpay",middleware.isLoggedIn,function(req,res){

	User.find({money :{$gte : 100}}).exec(function(err,found){
		if(err) throw err;
		if(found) res.render("admin/pay",{feeds:found});
		else res.redirect("/admin");
	});

});



router.get("/pays/:id/:id2",middleware.isLoggedIn,function(req,res){
	
	res.render("admin/payment",{username : req.params.id,money : req.params.id2});
    
});


//account for bad users

router.get("/adminusers",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,function(err,db){
		if(err) throw err;

		dbo = db.db("chatsdb");

		dbo.collection("vuluser").find({reported: { $gte: 2 }}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0){
				res.render("admin/users",{feeds : found});

			}else{
				req.flash("success","Nothing to show");
				res.redirect("/admin");
			}

		});
	});
});

// warning to the users

router.get("/sendMessage/:id",middleware.isLoggedIn,function(req,res){

   sendReport('piyuaman2468@gmail.com','Reported','Kindly assure');
   res.redirect("/adminusers");

});

// delete the user

router.get("/remove/:id",middleware.isLoggedIn,function(req,res){
	mongo.connect(url,async function(err,db){
		if(err) throw err;
		var dbo = db.db("chatsdb");
		var docs = User.findOneAndRemove({"username":req.params.id},function(err){
		        if(err) throw err;
		        req.flash("success","successfully deleted"+req.params.id);	
	     });

		var docs = dbo.collection("vuluser").deleteMany({"username":req.params.id});
		var docs = dbo.collection("vuluser").find({}).toArray(function(err,found){
			if(err) throw err;
			if(found.length>0){
				res.redirect("/adminusers");
			}else{
				req.flash("success","Nothing to show");
				res.redirect("/admin");
			}
		});

	});	
});



module.exports = router;