$(document).ready(function(){


    
     // for autoscrolling
     
     function scrollToBottom(){

      // selector
      
      var messages = jQuery('#messages');
      var newMessage = messages.children('li:last-child');

      // height
      
      var clientHeight = messages.prop('clientHeight');
      var scrollTop = messages.prop('scrollTop');
      var scrollHeight = messages.prop('scrollHeight');
      var newMessageHeight = newMessage.innerHeight();
      var lastMessageHeight = newMessage.prev().innerHeight();

      if(clientHeight + scrollTop +newMessageHeight+ lastMessageHeight>= scrollHeight){
        messages.scrollTop(scrollHeight);
      }

     }

     function insmsg (message){

     	    var formattedTime = moment(message.createdAt).format('h:mm a');
 			var template = jQuery('#messages-template').html();

			  // console.log(typeof template);
			  var html = Mustache.render(template,{
			    text : message.text,
			    from : message.from,
			    createdAt : formattedTime
			  });

			  jQuery('#messages').append(html);
			  scrollToBottom();

     }

     function insimg(message){

            var formattedTime = moment(message.createdAt).format('h:mm a');
            var template = jQuery('#location-messages-template').html();

		     console.log(message);
		    var html = Mustache.render(template,{
		        from : message.from,
		        text : message.text,
		        createdAt : formattedTime
		    });

		    jQuery('#messages').append(html);
		    scrollToBottom();

     }
 	
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
       

       // load previous messages 
       
       socket.on('output',function(data){
       	console.log("dekho purana chat");
       //	console.log(data);
       
       console.log(data.length);
       
       if(data.length){
       	for(var x=0;x<data.length;++x){
       		// build out message
       		 console.log("koi hai");
       		 console.log(data[x]);
       		 if(data[x].img=="1") {insimg(data[x]);}
       		 else if(data[x].img=="0") {insmsg(data[x]);}
       	}
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
        
        // for image
        

         socket.on('user image',function(message){
           
           insimg(message);


       });


 		socket.on('newMessage',function(message){

 			console.log('new message k andar');
 			insmsg(message);

    //         var formattedTime = moment(message.createdAt).format('h:mm a');
 			// var template = jQuery('#messages-template').html();

			 //  // console.log(typeof template);
			 //  var html = Mustache.render(template,{
			 //    text : message.text,
			 //    from : message.from,
			 //    createdAt : formattedTime
			 //  });

			 //  jQuery('#messages').append(html);
			 //  scrollToBottom();


 		});

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

 		


		 $('#imagefile').bind('change',function(e){
		     console.log("chacha");
		      var data = e.originalEvent.target.files[0];
		      var reader = new FileReader();
		      reader.onload = function(evt){
		       // image('me', evt.target.result);
		        socket.emit('user image', evt.target.result);
		      };
		      reader.readAsDataURL(data);
		 });



 	});

 
 	socket.on('disconnect',function(){
 		console.log('Disconnected from server');
 	});



});