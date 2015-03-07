(function($){
  $.fn.scrollTo = function(maxTime, callback){
    if(typeof maxTime === 'function'){
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
})($);

$('a[href^="#"]').click(function(e){
  e.preventDefault();
  var dest = $(this).attr('href');
  $(dest).scrollTo(700, function(){
    window.location.hash = dest.substr(1);
  });
});