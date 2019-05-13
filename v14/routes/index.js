 var express      = require("express"),
    router       = express.Router();


/**
 *   index.html
 */

router.get("/",function(req,res){
		res.render("index");
});



router.get("/why",function(req,res){
	   res.send("WHY");
});






 module.exports = router;   