var express      = require("express"),
    router       = express.Router(),
    passport     = require("passport");


 router.get("/register",function(req,res){
 		res.render("register");
 });



 module.exports = router;   