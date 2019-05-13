
/**
 *  Main file 
 */

/**
 *  npm frameworks
 */

var express      	= require("express"),
    app          	= express(),
    cookieParser 	= require("cookie-parser"),
    session      	= require("express-session"),
    bodyParser   	= require("body-parser"),
    mongoose     	= require("mongoose"),
    passport     	= require("passport"),
    LocalStrategy	= require("passport-local"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");





/**
 * Connecting to  mongoodse database 
 * node cmd -> C:\Program Files\MongoDB\Server\4.0\bin -> mongo ->show dbs
 */

mongoose.connect("mongodb://localhost/zing");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());




/**
 *  Sessions for flash
 */


app.use(require("express-session")({
     	secret: "zing",
        proxy: true,
        resave: true,
        saveUninitialized: true

}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/**
 *  Using middleware in all routes
 */

app.use(function(req,res,next){
		res.locals.currentUser = req.user;
		res.locals.error       = req.flash("error");
		res.locals.success	   = req.flash("success");
		next();
});




/**
 *  importing routes
 */

var indexRoutes       = require("./routes/index");
app.use(indexRoutes);
var registerRoutes    = require("./routes/register");
app.use(registerRoutes);
var blogsRoutes       = require("./routes/blogs");
app.use(blogsRoutes);
var doubtsRoutes       = require("./routes/doubts");
app.use(doubtsRoutes);




/**
 * Port
 */

 app.listen(3000,function(){
 		console.log("Server Started");	
 }) ;  

