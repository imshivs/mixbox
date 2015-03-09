var EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//form submission
function submit_email(e){
  e.preventDefault();

  if( !$('input[name=email]').val().match(EMAIL) ){
    $('input[name=email]').attr('placeholder', 'Please enter your email');
    return;
  }

  /*jshint validthis:true */
  $(this).find('.loading').show();
  $(this).find('#btn-text').text('');

  $.ajax({
    url: 'https://mixbox-rocks.herokuapp.com/signup',
    type: 'POST',
    data: {
      email: $('input[name=email]').val()
    }
  }).always(function(data, status, jqXHR){
    //hide loader
    $('#submit').hide();
    // $(this).find(''.loading'').hide();
    // $(this).find(''#btn-text'').text('');
    if(status !== 'success'){
      data = null;
    }
    //show quiz
    // $('#submit.hide').hide();
    $('#start-quiz').attr('href', function(i, attr){
      return attr+'?signupid='+(data || '-1')+'&email='+$('input[name=email]').val();
    }).show();
    $('#sub-head').text('Awesome!');
    $('#sub-msg').text('Now start building your taste profile by taking our preferences quiz.');
  });
}

// $('#submit').attr('disabled', true);
$('#submit').click(submit_email);
$('#signup').submit(submit_email);