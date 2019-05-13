var express      = require("express"),
    router       = express.Router(),
    passport     = require("passport");


 router.get("/login",function(req,res){

        res.render("login");
 });



 module.exports = router;   