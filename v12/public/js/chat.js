$(document).ready(function(){

 	

   console.log("chat ka js me hai");
 	var socket = io();

 	socket.on('connect',function(){
 		console.log('connected to server');
 		var room = document.getElementById("checkRoom").textContent;

 		var username = document.getElementById("checkName").textContent;

 		var params = {room : room,username : username};
 		console.log("params ka val");
 		console.log(params);
 		socket.emit('join',params,function(err){
 			if(err) {
 				alert(err);
 				window.location.href = '/';
 			}else{
 				console.log("joinedthe room");
 			}
 		});


		 socket.on('updateUserList',function(users){
		         console.log("NAHI PAHUCHE KA");
		         console.log('Users List ',users);
		         var ol = jQuery('<ol></ol>');
		         users.forEach(function(user){
		           ol.append(jQuery('<li></li>').text(user));
		          });

		         jQuery('#users').html(ol);


		 });
        

 		socket.on('newMessage',function(message){

 			console.log('new message k andar');
            var formattedTime = moment(message.createdAt).format('h:mm a');
 			var template = jQuery('#messages-template').html();

			  // console.log(typeof template);
			  var html = Mustache.render(template,{
			    text : message.text,
			    from : message.from,
			    createdAt : formattedTime
			  });

			  jQuery('#messages').append(html);
			 // scrollToBottom();


 		})

 		jQuery('#message-form').on('submit',function(e){

                 e.preventDefault();  // remove page refresesh process

                 var messageTextbox = jQuery('[name=message]');
                 console.log("messagebhejrahe");
                 socket.emit('createMessage',{
    
                       text : messageTextbox.val()
                       },function(){
                      messageTextbox.val('');
                      });

                     });



 	});

 
 	socket.on('disconnect',function(){
 		console.log('Disconnected from server');
 	});



});