var express      = require("express"),
    router       = express.Router();


router.get("/blogs",function(req,res){
		res.send("blogs");
});




 module.exports = router;