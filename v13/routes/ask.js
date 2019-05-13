
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

var cnt = Math.random();

 router.get("/",function(req,res){
 	res.redirect("/");
 });

 router.get("/ask",function(req,res){

  mongo.connect(url,async function(err,db){
    if(err) throw err;
    var dbo = db.db("chatsdb");

    dbo.collection("author").find({"author.username":req.user.username}).toArray(function(err,found){
      if(err) throw err;
      if(found.length>0){
        req.flash("success","Please complete your chats as Asked before");
        res.redirect("/chats");
      }else{
        dbo.collection("tutor").find({"tutor.username":req.user.username}).toArray(function(err,foundt){
          if(err) throw err;

          if(foundt.length>0){

            req.flash("success","Please complete your chats as taken before");
            res.redirect("/chats");
          }else{

             res.render("ask/ask");
          }

        });
      }
    });
  });

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
   
   var newAsk = {content : content,author : author,room : room};

 
         mongo.connect(url,async function(err,db){
               if(err) throw err;

               var dbo = db.db("chatsdb");

               var ok = generateMessage(req.user.username,content,room);
               console.log("pahla");
               console.log(ok);
            
               var docs = await dbo.collection("message").insertOne(ok);
                console.log("ban gya");

               var docs = Pool.create(newAsk,function(err,newlyCreated){
                    	if(err) throw err;
                      res.redirect("/wait/"+room);
                  });
               
                var docs = await dbo.collection("author").insertOne({room : room,author : author});    
            

              
             });


	// push into not done array
	

});



router.get("/wait/:id",function(req,res){
     var feed = { room : req.params.id};
     res.render("ask/wait",{room : req.params.id,currentUser : req.user});

});

router.get("/solve",function(req,res){


  mongo.connect(url,async function(err,db){
    if(err) throw err;
    var dbo = db.db("chatsdb");

    dbo.collection("author").find({"author.username":req.user.username}).toArray(function(err,found){
      if(err) throw err;
      if(found.length>0){
        req.flash("success","Please complete your chats as Asked before");
        res.redirect("/chats");
      }else{
         Pool.find({},function(err,allAsk){
        if(err) throw err;
         
        if(allAsk.length>0){
           res.render("solve/pool",{feeds:allAsk,currentUser : req.user});
        } else{
           req.flash("error","No chats to solve");
           res.redirect("/");
            
        }
      });
      }
    });
  });
       




});



router.get("/take/:id",async function(req,res){

 var room;
	var docs = await Pool.findById(req.params.id).exec(async function(err,foundTake){

		if(err) throw err;

    if(foundTake){

		var author   = foundTake.author;
		var content  = foundTake.content;
	  room     = foundTake.room;

		var newMessage = { author : author, content :content};
		var tutor   = {
	   	  id       : req.user._id,
	   	  username : req.user.username
	   }

	     var temp = req.params.id;


       var feed ={ room : room,id : req.params.id};
	     var newChat = {room: room,author : foundTake.author,tutor: tutor};

            mongo.connect(url,async function(err,db){
               if(err) throw err;

               var dbo = db.db("chatsdb");
            
               var docs = await dbo.collection("undone").insertOne({room : room,author : author, tutor:tutor});
               var docs = await dbo.collection("temp").insertOne({room : room,author : author, tutor:tutor});
               var docs = await dbo.collection("all").insertOne({room : room,author : author, tutor:tutor});
               var docs = await dbo.collection("tutor").insertOne({room : room,tutor : tutor});
               
               res.redirect("/wait/"+room);
         
             });


          }
          else{

             req.flash("error","Sorry Taken");
            res.redirect("/solve");
          }


	});

 Pool.findByIdAndRemove(req.params.id).exec(async function(err){
 
  if(err) throw err;
 });
 
  
   // mongo.connect(url,async function(err,db){
   //      if(err) throw err;

   //       var dbo = db.db("chatsdb");
            
   //    var docs = await dbo.collection("undone").findOne({room : room},function(err,found){
   //      if(err) throw err;
   //      console.log("room dekho");
   //      console.log(room);
   //       res.render("ask/wait",{room: room,currentUser : req.user});
   //    });

         
   // });
             

});

// reopen the chat port

router.get("/reopen/:id",async function(req,res){
   
    var room = req.params.id;
    res.redirect("/wait/"+room);


});

// closing the chat part

 router.get("/close/:id",function(req,res){

     // mongo.connect(url,async function(err,db){
     //  if(err) throw err;

     //  var dbo = db.db("chatsdb");
      
     //  var docs =await dbo.collection("undone").findOne({room: req.params.id},async function(err,found){
     //    if(err) throw err;
     //     if(found){
     //      res.render("ask/close",{room : req.params.id,currentUser:req.user,tutor: found.tutor.username});
     //     }else{
     //             console.log("yaha dddbhi pahiche uaa nai");
     //            var docs = await dbo.collection("temp").findOne({room : req.params.id},async function(err,foundt){
     //          if(err) throw err;

     //           if(foundt.tutor.username==req.user.username) var docs = await dbo.collection("report").insertOne({room : foundt.room,author : foundt.author,tutor: foundt.tutor,reason:"",by:"tutor"});
     //          else var docs = await dbo.collection("report").insertOne({room : foundt.room,author : foundt.author,tutor: foundt.tutor,reason:"",by:"Student"});
     //          res.render("ask/report",{room: req.params.id,tutor : foundt.tutor.username,currentUser : req.user});
     //      });
     //     }

     //  });

     // });
     
     mongo.connect(url,async function(err,db){
      if(err) throw err;
     var dbo = db.db("chatsdb");
      var docs = await dbo.collection("all").findOne({room : req.params.id},async function(err,found){
        if(err) throw err;
        res.render("ask/close",{room : req.params.id,currentUser : req.user, tutor : found.tutor.username});
      })

     })

 });
  

// review collection contain those which haven't yet been rated by user , i.e some sort of issues are there 




  // Chosing Close from all options by the tutor
  
  router.get("/closed/:id",function(req,res){
    console.log("bahar hi rehenge");
    mongo.connect(url,async function(err,db){
      if(err) throw err;
      var dbo = db.db("chatsdb");

      var docs = await dbo.collection("done").findOne({room : req.params.id},async function(err,found){
        if(err) throw err;
        console.log("mlaa");
        console.log(found);
        if(!found){
          dbo.collection("review").insertOne({room : req.params.id});
        }
      });
    
      var docs = dbo.collection("undone").deleteMany({room:req.params.id});
      var docs = await dbo.collection("tutor").deleteMany({room : req.params.id});

      res.redirect("/");

    });
  });






  // rate a chat
  
  router.get("/rate/:id",function(req,res){

 
        // mongo.connect(url,async function(err,db){
        //   if(err) throw err;

        //   var dbo = db.db("chatsdb");
        
        //   var docs = await dbo.collection("all").findOne({room : req.params.id},async function(err,found){
        //     if(err) throw err;
            
        //    var docs = await dbo.collection("done").insertOne({room : found.room,author : found.author,tutor: found.tutor,rating :1});

        //   });



        // });
   


         res.render("ask/rate",{room: req.params.id});

  });

// update rating
// a task is completed when it is rated and moved to done

router.post("/rate/:id",(req,res,next) =>{
 var counter =req.body.rat;
  if(counter == 0) counter = 5;
  console.log(counter);


mongo.connect(url,async function(err,db){
    if(err) throw err;
    console.log("andar");
    var dbo = db.db("chatsdb");
     
    dbo.collection("all").findOne({room : req.params.id},async function (err,found){
        if(err) throw err;
          var docs = await dbo.collection("done").insertOne({room : found.room,author : found.author,tutor: found.tutor,rating :counter});


    });

          var docs = await dbo.collection("undone").deleteMany({room:req.params.id});
          var docs = await dbo.collection("review").deleteMany({room:req.params.id});
                
          // var docs = await dbo.collection("tutor").deleteMany({"room" : req.params.id,"tutor.username": req.user.username});
          var docs = await dbo.collection("author").deleteMany({"room" : req.params.id,"author.username": req.user.username});
    

    
  });
  
  
});








router.get("/report/:id",function(req,res){


        // mongo.connect(url,async function(err,db){
        //   if(err) throw err;

        //   var dbo = db.db("chatsdb");
        //   var did = 0;
        //   var docs = await dbo.collection("undone").findOne({room : req.params.id},async function(err,found){
        //     if(err) throw err;
        //     if(found){
            
        //    if(found.tutor.username==req.user.username) var docs = await dbo.collection("report").insertOne({room : found.room,author : found.author,tutor: found.tutor,reason:"",by:req.user.username});
        //    else var docs = await dbo.collection("report").insertOne({room : found.room,author : found.author,tutor: found.tutor,reason:"",by:req.user.username});
        //     res.render("ask/report",{room: req.params.id,tutor : found.tutor.username,currentUser : req.user});
        //   }else{
        //         console.log("yaha bhi pahiche uaa nai");
        //         var docs = await dbo.collection("temp").findOne({room : req.params.id},async function(err,foundt){
        //       if(err) throw err;

        //        if(foundt.tutor.username==req.user.username) var docs = await dbo.collection("report").insertOne({room : foundt.room,author : foundt.author,tutor: foundt.tutor,reason:"",by:req.user.username});
        //       else var docs = await dbo.collection("report").insertOne({room : foundt.room,author : foundt.author,tutor: foundt.tutor,reason:"",by:req.user.username});
        //       res.render("ask/report",{room: req.params.id,tutor : foundt.tutor.username,currentUser : req.user});
        //   });
        //   }
        //   });



        // });
        // 
        
        console.log("report karne aaye ho kyaa");
        mongo.connect(url,async function(err,db){
          if(err) throw err;
           
           var dbo = db.db("chatsdb");
           
           var docs =await dbo.collection("all").findOne({room : req.params.id},async function (err,found){
            if(err) throw err;
            res.render("ask/report",{room : req.params.id,tutor : found.tutor.username,currentUser : req.user});

           });


        });


});

// isko dekho pura

router.post("/report/:id",async function(req,res){

 
   mongo.connect(url,async function(err,db){
    if(err) throw err;

    var dbo = db.db("chatsdb");
    var docs = await dbo.collection("report").insertOne({room : req.params.id,by:req.user.username,reason:req.body.report});

    var docs = await dbo.collection("tutor").deleteMany({"room" : req.params.id,"tutor.username": req.user.username});
    var docs = await dbo.collection("author").deleteMany({"room" : req.params.id,"author.username": req.user.username});
    




   });


  res.redirect("/");
});









router.get("/chats",async function(req,res){

  mongo.connect(url,async function(err,db){
    if(err) throw err;
    var dbo = db.db("chatsdb");
    console.log(req.user);
   var docs = await dbo.collection("author").find({"author.username":req.user.username}).toArray(async function(err,found){
      if(err) throw err;
      if(found.length>0){
         res.render("ask/tutor",{feeds : found,currentUser : req.user});
      }else{
        var docs = await dbo.collection("tutor").find({"tutor.username":req.user.username}).toArray(function(err,foundt){
          if(err) throw err;
          if(foundt.length>0){
            res.render("ask/tutor",{feeds : foundt,currentUser : req.user});
          }else{
            req.flash("success","Nothing to show");
            res.redirect("/");
          }
        })
      }
    })

  })

})


module.exports = router;