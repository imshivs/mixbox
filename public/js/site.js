
	jQuery(document).ready(function($) {

		    //$('#nav-main').scrollspy()
		    
		    // Localscrolling 
    		$('#nav-main, .brand').localScroll();
     		$('#news, .container').localScroll();

        $('#banner').unslider({
          speed: 500,               //  The speed to animate each slide (in milliseconds)
          delay: 3000,              //  The delay between slide animations (in milliseconds)
          complete: function() {},  //  A function that gets called after every slide animation
          keys: true,               //  Enable keyboard (left, right) arrow shortcuts
          dots: true,               //  Display dot navigation
          fluid: false              //  Support responsive design. May break non-responsive designs
        });

        //form submission
        $('#signup').submit(function(e){
          //show loader
          e.preventDefault();

          $.ajax({
            url: '/signup',
            type: 'POST',
            data: {
              email: $('input[name=email]').val()
            }
          }).done(function(data, status, jqXHR){
            //show quiz
            $('#start-quiz').show(200);
          })
          .always(function(){
            //hide loader
          });

        });
  });