var  express      = require("express"),
     router       = express.Router();
 var Blogs        = require("../models/blogs"),
     middleware   = require("../middleware");


router.get("/",function(req,res){
		res.render("index");
});

/*
Feeds page
 */
router.get("/feeds",function(req,res){
		  
      Blogs.find({},function(err,allBlogs){
        if(err){
          console.log(err);
        }else{
          res.render("feeds/index",{feeds:allBlogs,currentUser : req.user});
        }
      });
});

/*
 Show feed
 */

router.get("/feeds/:id",function(req,res){
        Blogs.findById(req.params.id,function(err,foundBlog){
            res.render("feeds/show",{feed : foundBlog});
        });
});

/**
 * Edit Post
 */


router.get("/feeds/:id/edit",function(req,res){
    Blogs.findById(req.params.id,function(err,foundBlog){
         if(err){
            
            res.redirect("/feeds");
         }else{
            res.render("feeds/edit",{feed : foundBlog});
         }
    });
});

router.put("/feeds/:id",function(req,res){
    Blogs.findByIdAndUpdate(req.params.id,req.body.editFeed,function(err,updatedBlog){
         if(err){
             res.redirect("/feeds");
         }else{
           res.redirect("/feeds/"+req.params.id);

         }
    })
})


/**
 *  DELETE 
 */

  router.delete("/feeds/:id",function(req,res){
    Blogs.findByIdAndRemove(req.params.id,function(err){
        res.redirect("/feeds");
    })
  });

/*
  Creating new posts
 */
router.get("/new",middleware.isLoggedIn,function(req,res){
       res.render("feeds/new");
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