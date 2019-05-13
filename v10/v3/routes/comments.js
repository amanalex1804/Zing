var  express      = require("express"),
     router       = express.Router();
 var Comment      = require("../models/comments"),
     Blogs        = require("../models/blogs"),
     middleware   = require("../middleware");


 router.get("/",function(req,res){
		res.render("index");
});


router.get("/why",function(req,res){
     res.send("WHY");
});


router.post("/comments/:id",middleware.isLoggedIn,function(req,res){

	Blogs.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/");
		}else{
		       Comment.create(req.body.comment,function(err,comment){
                    if(err){
                      console.log(err);
                    }else{
                      console.log(req.user.username);
                      comment.author.id = req.user._id;
                      comment.author.username = req.user.username;
                      comment.save();
                      foundBlog.comments.push(comment);
                      foundBlog.save();
                      console.log(comment);
                      req.flash("success","Succesfully added");
                      res.redirect('/feeds/'+foundBlog._id);
                    }
            });
		}
	})
	
})

module.exports = router;    