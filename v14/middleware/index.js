
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	 if(req.isAuthenticated()){
	 	return next();
	 }
	 req.flash("error","Please Login first");
	 res.redirect("/login");
}

middlewareObj.isSubscribed  = function(req,res,next){
	var lastSubscribed = req.user.subscription;
	var lastSubscribedTimeStamp = (lastSubscribed).getTime();

	var now = new Date();
	var nowTimeStamp = now.getTime();
    
    var microSecondsDiff = Math.abs(lastSubscribedTimeStamp-nowTimeStamp);
    var daysDiff = Math.floor(microSecondsDiff/(1000*60*60*24));
    
    if(daysDiff<=365){
    	req.flash("success","Valid upto "+(365-daysDiff)+" days");
    	return next();
    }
    req.flash("error","Subscription Expired");
    res.redirect("/sub");
}


module.exports = middlewareObj;