var  express      = require("express"),
     router       = express.Router(),
     middleware   = require("../middleware"),
     Doubts       = require("../models/doubts");


router.get("/",function(req,res){
		res.render("index");
});

router.get("/doubtsnew",function(req,res){
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

 module.exports = router;