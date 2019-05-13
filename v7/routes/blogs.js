var  express      = require("express"),
     router       = express.Router();
 var Blogs        = require("../models/blogs"),
     middleware   = require("../middleware");


router.get("/",function(req,res){
		res.render("index");
});

router.get("/feeds",middleware.isLoggedIn,function(req,res){
		  
      Blogs.find({},function(err,allBlogs){
        if(err){
          console.log(err);
        }else{
          res.render("feeds",{feeds:allBlogs,currentUser : req.user});
        }
      });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
       res.render("new");
});

router.post("/new",middleware.isLoggedIn,function(req,res){
	   var title    = req.body.title;
	   var content  = req.body.content;
	   var author   = {
	   	  id       : req.user._id,
	   	  username : req.user.username
	   }
   
   var newBlogs ={title:title,content:content,author:author};

   Blogs.create(newBlogs,function(err,newlyCreated){
   	    if(err){
   	    	console.log(err);
   	    }else{
   	    	console.log(newlyCreated);
   	    	res.redirect("/feeds");
   	    }
   })



});


 module.exports = router;