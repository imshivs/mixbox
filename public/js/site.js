
//scrollTo
// (function($){
//   $.fn.scrollTo = function(maxTime, callback){
//     if(typeof maxTime === "function"){
//       callback = maxTime;
//       maxTime = 2000;
//     }else if(!maxTime){
//       maxTime = 2000;
//     }
//     if(!callback){ callback = function(){}; } //no-op
//     var offset = $(this).offset();
//     if(!offset){ return; } //dest doesn't exist
//     var dest_pos = offset.top;
//     var distance = dest_pos - $(document).scrollTop();//down is positive
//     var done = false;
//     $('body,html').animate({ scrollTop: dest_pos }, Math.min(maxTime, Math.abs(distance)), function(){
//       if(!done){
//         done = true;
//         callback.call(this);
//       }
//     });
//   };
// })(jQuery);

jQuery(document).ready(function($) {

  var EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //scroll to
  // $('a[href^="#"]').click(function(e){
  //   e.preventDefault();
  //   var dest = $(this).attr('href');
  //   $(dest).scrollTo(700, function(){
  //     window.location.hash = dest.substr(1);
  //   });
  // });


  // $('#submit').attr('disabled', true);
  //form submission
  $('#submit').click(function(e){
    e.preventDefault();

    if( !$('input[name=email]').val().match(EMAIL) ){
      $('input[name=email]').attr('placeholder', 'Please enter your email');
      return;
    }

    //show loader
    $(this).find(".loading").show();
    $(this).find("#btn-text").text("");

    $.ajax({
      url: '/signup',
      type: 'POST',
      data: {
        email: $('input[name=email]').val()
      }
    }).done(function(data, status, jqXHR){
      //show quiz
      // $('#submit.hide').hide();
      $('#start-quiz').attr('href', function(i, attr){
        return attr+"?signupid="+(data || "-1")+"&email="+$('input[name=email]').val();
      }).show();
      $('#sub-head').text("Awesome!");
      $('#sub-msg').text("Now start building your taste profile by taking our preferences quiz.");
    })
    .always(function(){
      //hide loader
      $('#submit').hide();
      // $(this).find(".loading").hide();
      // $(this).find("#btn-text").text("");
    });
  });

});