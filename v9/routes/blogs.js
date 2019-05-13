var  express      = require("express"),
     router       = express.Router();
 var Blogs        = require("../models/blogs"),
     User         = require("../models/user"),   
     middleware   = require("../middleware");


router.get("/",function(req,res){
		res.render("index");
});


router.get("/why",function(req,res){
     res.send("WHY");
});

/*
Feeds page
 */
router.get("/feeds",middleware.isLoggedIn,function(req,res){
		  
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


router.get("/feeds/:id",middleware.isLoggedIn,function(req,res){
       var x            =req.user._id;
       var y            =req.params.id;
       var alreadyLiked =0;
       User
          .findById(x).exec(function(err,foundUser){

           var logs = foundUser.liked_posts;
           var isInArray = logs.some(function (logs) {
                return alreadyLiked=(logs.equals(y));
           });
             
       });

       Blogs.findById(req.params.id).exec(function(err,foundCampground){
              if(err){
                    console.log(err);
              }
              else{
                console.log(foundCampground);
                res.render("feeds/show",{feed:foundCampground,alreadyLiked:alreadyLiked});
              }
  });
  

});

/*
router.get("/feeds/:id",middleware.isLoggedIn,function(req,res){
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


/**.
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



  router.post('/feeds/:id/act/:action',middleware.isLoggedIn, (req, res, next) => {

        
        var action = req.params.action;
        
        var counter = action === 'Like' ? 1 : -1;
      
        Blogs.update({_id: req.params.id}, {$inc: {likes_count: counter}}, {}, (err, numberAffected) => {
            res.send('');
        });
        if(counter==1){
           console.log("counter is one");
           User.update({
             _id : req.user._id
           }, {
              $push :{
                 liked_posts : req.params.id
              }
           }).exec(function(err,foundUser){
             console.log("Liked post added to user");
           })
        }else{
           console.log("counter is not one");
           User.update({
             _id : req.user._id
           }, {
              $pull :{
                 liked_posts : req.params.id
              }
           }).exec(function(err,foundUser){
             console.log("UnLiked post removed to user");
           })
        }
    });

 module.exports = router;