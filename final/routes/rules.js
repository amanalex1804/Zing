var express  = require('express'),
router       = express.Router(),
middleware   = require("../middleware");


 router.use("/rules/:id/report",function(req,res){
 	 res.render("rules/report");
 });


 module.exports = router;