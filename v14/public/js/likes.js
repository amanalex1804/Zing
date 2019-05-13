       console.log("Reached like js");
      var updatePostStats = {
            Like: function (postId) {
                document.querySelector('#likes-count-' + postId).textContent++;
            },
            Unlike: function(postId) {
                document.querySelector('#likes-count-' + postId).textContent--;
            }
        };

        var toggleButtonText = {
            Like: function(button) {
                button.textContent = "Unlike";
            },
            Unlike: function(button) {
                button.textContent = "Like";
            }
        };
       

       $('#likeButton').click(function(){
            var postId = event.target.dataset.postId;
            var action = event.target.textContent.trim();
             
            toggleButtonText[action](event.target);
            updatePostStats[action](postId);
            axios.post('/feeds/' + postId + '/act/'+action);
       });

      /*
        var actOnPost = function (event) {
            axios.redirect("/why");
         
        };

        */