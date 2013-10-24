$.fn.scrollView = function() {
  return this.each(function() {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  });
};

$(function() {
  // so placeholders will work in IE
  $('input, textarea').placeholder();

  // 3 seconds after the page load, scroll the fake embedded article to its Feature Perspective
  setTimeout(function() {
    $('.browser-example .window').animate({
      scrollTop: 430
    }, 1000);
  },3000);

  // If they click "request a free trial", scroll to the sign-up form
  $('button[data-request-trial="true"]').on('click', function() {
    $('.signup-form-wrapper').scrollView();
  });

  // Handle the sign-up form submission
  $('form[data-remote="true"]').on('submit', function(ev) {
    ev.preventDefault();

    var $form = $(this), method, url, data, options;
    method = $form.attr('method');
    url = $form.attr('action');
    data = $form.serializeArray();

    $form.find('input[type="submit"]').hide();

    options = {
      type: method || 'GET', data: data, url: url,
      complete: function(xhr, status) {
        resp = JSON.parse(xhr.responseText);

        if (resp.status == 'ok') {
          $form.hide();
          $form.find('input[type="text"]').each(function(idx, el) {
            $(el).attr('value', '');
            $(el).removeClass('error');
          });

          $('.sign-up-confirmation').show();
        }

        else if (resp.status == 'error') {
          $form.find('input[type="submit"]').show();

          $.each(resp.errors, function(key, val) {
            $('.contact-signup-'+key).addClass('error');
          });
        }
      }
    };

    var jqxhr = $.ajax(options);
    $form.trigger('ajax:send', jqxhr);
    return jqxhr;
  });
});
