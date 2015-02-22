
//scrollTo
(function($){
  $.fn.scrollTo = function(maxTime, callback){
    if(typeof maxTime === "function"){
      callback = maxTime;
      maxTime = 2000;
    }else if(!maxTime){
      maxTime = 2000;
    }
    if(!callback){ callback = function(){}; } //no-op
    var offset = $(this).offset();
    if(!offset){ return; } //dest doesn't exist
    var dest_pos = offset.top;
    var distance = dest_pos - $(document).scrollTop();//down is positive
    var done = false;
    $('body,html').animate({ scrollTop: dest_pos }, Math.min(maxTime, Math.abs(distance)), function(){
      if(!done){
        done = true;
        callback.call(this);
      }
    });
  };
})(jQuery);


jQuery(document).ready(function($) {


  $('a[href^="#"]').click(function(e){
    e.preventDefault();
    var dest = $(this).attr('href');
    $(dest).scrollTo(700, function(){
      window.location.hash = dest.substr(1);
    });
  });

      //$('#nav-main').scrollspy()

      //pretty photo
      $("a[rel^='prettyPhoto']").prettyPhoto();

      // $('#banner').unslider({
      //   speed: 500,               //  The speed to animate each slide (in milliseconds)
      //   delay: 3000,              //  The delay between slide animations (in milliseconds)
      //   complete: function() {},  //  A function that gets called after every slide animation
      //   keys: true,               //  Enable keyboard (left, right) arrow shortcuts
      //   dots: true,               //  Display dot navigation
      //   fluid: false              //  Support responsive design. May break non-responsive designs
      // });

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