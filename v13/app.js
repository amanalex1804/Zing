
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




/**
 *  importing routes
 */

var indexRoutes       = require("./routes/index");
app.use(indexRoutes);
var registerRoutes    = require("./routes/register");
app.use(registerRoutes);
var blogsRoutes       = require("./routes/blogs");
app.use(blogsRoutes);
var doubtsRoutes      = require("./routes/doubts");
app.use(doubtsRoutes);
var rulesRoutes       = require("./routes/rules");
app.use(rulesRoutes);
var commentRoutes     = require("./routes/comments");
app.use(commentRoutes);

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
        
        console.log("woo");
        console.log(params.username);
        console.log(params.room);
        console.log(typeof params.room);
     if(!isRealString(params.username) || !isRealString(params.room)){
        return callback('name and room name are required');
    }
      console.log("Userss kaa size dekho");
      console.log(users.getUserListsize(params.room));
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
            console.log("lolwa");
            throw err;
          }
          console.log("chacha output");
          console.log(res);
          io.to(params.room).emit('output',res);
        });


        callback();

    });

    // storing messsage : room,name,message 
    
    socket.on('user image',async function(msg){
    console.log("msg");
    var user = users.getUser(socket.id);
    if(user){
       var ok = generateimg(user.name,msg,user.room);
       var docs = await dbo.collection("message").insertOne(ok,function(){
         io.to(user.room).emit('user image',ok);
      });
     }

   });

    socket.on('createMessage',(message,callback) =>{
        console.log('createMessage',message);
       
       // add rule here 
        var user = users.getUser(socket.id);
        console.log("meesage bhej rahe");
        console.log(user);

     if(user && isRealString(message.text)){
        var ok = generateMessage(user.name,message.text,user.room);
        console.log("Ye kya hia");
        console.log(typeof ok);
        dbo.collection("message").insertOne(ok,function(){
          
        io.to(user.room).emit('newMessage',ok);
      });
     }
       
       callback('');


        
    });

    socket.on('disconnect',() =>{
        console.log("user got disconnected");
        var user = users.removeUser(socket.id);
        if(user){
            console.log("ghuso");
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',user.name+"has left"));
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

