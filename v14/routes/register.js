var express             = require("express"),
    router              = express.Router(),
    passport            = require("passport"),
    passwordValidator   = require('password-validator'),
    Regex               = require("regex"),
    User                = require("../models/user"),
    middleware          = require("../middleware");



var checkPassword = new passwordValidator();

checkPassword
.is().min(4)
.is().max(12)
.has().digits()
.has().uppercase()
.has().not().spaces()
.has().lowercase()
.is().not().oneOf(['admin','zing','Zing']);

var checkUsername = new passwordValidator();

checkUsername
.is().min(4)
.is().max(12)
.has().not().spaces()
.has().not().symbols('*','/','?','.','>','<','.')


router.get("/",function(req,res){
			res.render("index");
});

router.get("/why",function(req,res){

	   res.send("WHY");
});

/**
 *  SIGNUP PART
 */

 router.get("/register",function(req,res){
 	 		res.render("register");
 });


 router.post("/register",function(req,res){
 	  console.log(req.body.username);
 	   console.log(typeof(req.body.username));
 		var username         = req.body.username;
 		var email            = req.body.email;
 		var password         = req.body.password;
 		var confirm_password = req.body.confirm_password;

 		if(checkUsername.validate(username)){

 			 if(checkPassword.validate(password)){

 			 	if(password==confirm_password){
 			 			
 			 			var newUser = new User({username:username,email:email});
 			 			User.register(newUser,password,function(err,user){
 			 					if(err){
 			 						
 			 						// console.log(JSON.stringify(err));
 			 					   
 			 						req.flash("error",err.message);
 			 						return res.redirect("/register");
 			 					}
 			 					
 			 					passport.authenticate("local")(req,res,function(){
 			 						    req.flash("success","Welcome "+username);
 			 							res.redirect("/pre");
 			 							
 			 					});

 			 			});
 			 	}else{

		 			req.flash("error","Confirm Password error");
		 			res.redirect("/register");
 			 	}

 			 }else{

 					req.flash("error","Fill correct password");
 					res.redirect("/register");
 			 }

 		}else{
 			req.flash("error","Fill correct username");
 			res.redirect("/register");
 		}

        

 });


/**
 *  LOGIN PART
 */


 router.get("/login",function(req,res){
        res.render("login");
 });



 router.post("/login",passport.authenticate("local",
 {
 	successRedirect : "/pre",
 	failureRedirect : "/flogin"
 }),
 function(req,res){

 });
 
 router.get("/flogin",function(req,res){
 	req.flash("error","Username or Password is Incorrect");
 	res.redirect("/login");
 })
 
 router.get("/pre",middleware.isSubscribed,function(req,res){
 	res.redirect("/");
 });

/**
 *  LOGOUT
 */

router.get("/logout",function(req,res){
	 req.logout();
	 req.flash("success","Logout Successful");
	 res.redirect("/");
})

 module.exports = router;   