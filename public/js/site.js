
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

  //scroll to
  $('a[href^="#"]').click(function(e){
    e.preventDefault();
    var dest = $(this).attr('href');
    $(dest).scrollTo(700, function(){
      window.location.hash = dest.substr(1);
    });
  });


  $(this).attr('disabled', true);
  //form submission
  $('#submit').click(function(e){
    //show loader
    $(this).find(".loading").show();
    $(this).find("#btn-text").text("");
    e.preventDefault();

    $.ajax({
      url: '/signup',
      type: 'POST',
      data: {
        email: $('input[name=email]').val()
      }
    }).done(function(data, status, jqXHR){
      //show quiz
      // $('#submit.hide').hide();
      $('#start-quiz').show();
    })
    .always(function(){
      //hide loader
      $('#submit').hide();
      // $(this).find(".loading").hide();
      // $(this).find("#btn-text").text("");
    });
  });



  // $('.get-started').magnificPopup({
  //   src: '#subscribe',
  //   type: 'inline',
  //   preloader: false,
  //   // focus: '#email',

  //   // When elemened is focused, some mobile browsers in some cases zoom in
  //   // It looks not nice, so we disable it:
  //   callbacks: {
  //     beforeOpen: function() {
  //       if($(window).width() < 700) {
  //         this.st.focus = false;
  //       } else {
  //         this.st.focus = '#email';
  //       }
  //     },
  //     open: function() {
  //       // console.log( this.currItem.el ); //$(this.currItem.el).attr('position')
  //     }
  //   }
  // });


});