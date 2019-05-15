
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
    const {Users}   = require('./utils/user');
    const {isRealString} = require('./utils/validation');

    var url = "mongodb://localhost/zingf";
    var nodemailer = require('nodemailer');


// connect to mongodb
   
   const mongo = require('mongodb').MongoClient;


// from the node-chat-app;

const path          = require('path'),
      http          = require('http').Server(app),
      socketIO      = require('socket.io'),
      publicPath    = path.join(__dirname+'./public');

const {generateMessage,generateimg} = require('./utils/message');



const port = process.env.PORT || 3000;
//var server = http.createServer(app);
var io     = socketIO(http);
var users = new Users();

/**
 * Connecting to  mongoose database 
 * node cmd -> C:\Program Files\MongoDB\Server\4.0\bin -> mongo ->show dbs
 */

mongoose.connect(url);
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



var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'kumarrocky436@gmai.com',
        pass: 'alex2468'
    }
});


/**
 *  importing routes
 */

var indexRoutes       = require("./routes/index");
app.use(indexRoutes);
var registerRoutes    = require("./routes/register");
app.use(registerRoutes);

var rulesRoutes       = require("./routes/rules");
app.use(rulesRoutes);
var accountRoutes     = require("./routes/account");
app.use(accountRoutes);

// testing

var askRoutes         = require('./routes/ask');
app.use(askRoutes);




mongo.connect(url,async function(err,db){
  if(err) throw err;
  console.log('MongoDb connected');

  
  

// Server Socket

var docs = await io.on('connection',(socket) =>{

    console.log('new user connrcted');
    //console.log(currentUser);
 
    var dbo = db.db("chatsdb");

    socket.on('join',async (params,callback) =>{

        //check for condition here 
   
     if(!isRealString(params.username) || !isRealString(params.room)){
        return callback('name and room name are required');
    }
      if(users.getUserListsize(params.room) ==2){
        return callback('Already Joined');
      }
        socket.join(params.room);
        
         users.removeUser(socket.id);
        
        users.addUser(socket.id,params.username,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room)); 

        socket.emit('newMessage',generateMessage('Zing','Welcome to chat-app'));
        socket.broadcast.to(params).emit('newMessage',generateMessage('Admin',"has joined room"));

        // previous chats
        
        var docs = await dbo.collection("message").find({room:params.room}).toArray(function(err,res){
          if(err) {
                 throw err;
          }
          io.to(params.room).emit('output',res);
        });


        callback();

    });

    // storing messsage : room,name,message 
    
    socket.on('user image',async function(msg){
    
    var user = users.getUser(socket.id);
    if(user){
       var ok = generateimg(user.name,msg,user.room);
       var docs = await dbo.collection("message").insertOne(ok,function(){
         io.to(user.room).emit('user image',ok);
      });
     }

   });

    socket.on('createMessage',(message,callback) =>{
               
       // add rule here 
        var user = users.getUser(socket.id);
        

     if(user && isRealString(message.text)){
        var ok = generateMessage(user.name,message.text,user.room);
     
        dbo.collection("message").insertOne(ok,function(){
          
        io.to(user.room).emit('newMessage',ok);
      });
     }
       
       callback('');


        
    });

    socket.on('disconnect',() =>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Zing',user.name+"has left"));
        }

    });



});


});


/**
 * Port
 */

 http.listen(port,function(){
 		console.log("Server Started");	
 }) ;  

