var  express      = require("express"),
     router       = express.Router(),
     middleware   = require("../middleware"),
     Doubts       = require("../models/doubts"),
     Answers      = require("../models/answers");


router.get("/",function(req,res){
		res.render("index");
});

router.get("/doubtsnew",middleware.isLoggedIn,function(req,res){
       res.render("doubts/new");
});
router.get("/doubts",function(req,res){
	 Doubts.find({},function(err,doubts){
	 	if(err){
	 		console.log("ERROR");
	 	}else{
              res.render("doubts/index",{doubts : doubts});
	 	}
	 });
});

router.post("/doubts",function(req,res){
      
     var title    = req.body.title;
	   var content  = req.body.content;
	   var tags     = req.body.tags;
	   var author   = {
	   	  id       : req.user._id,
	   	  username : req.user.username
	   }
     
      console.log(tags);
   
   var newDoubts ={title:title,tags:tags,content:content,author:author};

   Doubts.create(newDoubts,function(err,newlyCreated){
   	    if(err){
   	    	console.log(err);
   	    }else{
   	    	console.log(newlyCreated);
   	    	res.redirect("/doubts");
   	    }
   });

});




router.get("/doubts/:id",function(req,res){


    Doubts.findById(req.params.id).exec(function(err,foundDoubt){
        if(err){
          console.log(err);
        }else{
              res.render("doubts/show",{doubt : foundDoubt});
        }

    });
    
    
});


router.get("/doubts/:id/take",function(req,res){
     Doubts.findById(req.params.id).exec(function(err,foundDoubt){
        if(err){
          console.log(err);
        }else{
          res.render("doubts/take",{doubt : foundDoubt});
        }

    });
});


router.post("/doubts/:id/take",function(req,res){
      Doubts.findById(req.params.id).exec(function(err,foundDoubt){
         if(err){
              console.log(err);
              res.redirect("/doubts");
         }else{
               console.log("hello");
                console.log(typeof req.body.take);

                var content = (req.body.take);
                var author  ={
                    id       : req.user._id,
                    username : req.user.username
                }
               
                var newTake = {content : content,author :author};

               foundDoubt.answers.push(newTake);
               foundDoubt.save();
                console.log('-----');
               console.log(foundDoubt);
               console.log(content);



               req.flash("success","Succesfully added");
               res.redirect('/doubts/'+req.params.id);

             /*
              Answers.create(req.body.answer,function(err,answer){
                    if(err){
                      console.log(err);
                    }else{
                      console.log(req.body.take);
                      console.log("TYPE"+typeof (toString(req.body.take)));

                      answer.author.id = req.user._id;
                      answer.author.username = req.user.username;
                      answer.content = toString(req.body.take);
                      answer.save();
                      foundDoubt.answers.push(answer);
                      foundDoubt.save();
                      console.log(answer);
                      console.log('-----');
                      console.log(foundDoubt);
                      console.log(answer.content);
                    }
            });
              */
         }
      });
});


 module.exports = router;