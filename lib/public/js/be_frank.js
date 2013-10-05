// Lightweight scrollTo function
// http://stackoverflow.com/questions/1586341/how-can-i-scroll-to-a-specific-location-on-the-page-using-jquery
$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  });
};

var MarketingHomepage = {
  init: function() {
    MarketingHomepage.setup_contact_form();
    
    // Make the what if slides fill the screen
    var $fill_screens = $('.fill-screen');
    $fill_screens.fillscreen();
    $(window).resize(function() {
      $fill_screens.fillscreen('refresh');
    });
    
    // Reset the what-if slides when the user scrolls to the top of the page.
    $('#title-page').waypoint({
      handler: MarketingHomepage.reset_page
    });
    
    // Fade in the what-if slide text when it comes into view
    $('.what-if-group').waypoint({
      handler: function(dir) {
        if("down" === dir) {
          $(this).find('.what-if-contents').animate({
            opacity: 1
          });
        }
      },
      offset: 50
    });
    
    // Make the fake-chrome scroll when they get to the featured-perspective section
    $('#featured-perspective-page').waypoint({
      handler: function(dir) {
        if("down" === dir) {
          // Scroll in the sample article
          $('.browser-example .window').animate({
            scrollTop: 540
          }, 1000);
        }
      },
      offset: 50 
    });
    
    // Hand-rolled scroll spy that uses the waypoints library
    $('.scroll-spy-section').waypoint({
      handler: function(dir) {
        var target = null, above = null, $that = $(this);
        // Remove the active class from all links
        $('.navbar-nav a.active').removeClass('active');
      
        if("down" === dir) {
          // Going down, it's simple, just light up the link that goes with this waypoint
          target = $(this).attr('id');
        } else {
          // Going up is more difficult. We need to see which waypoint above us is a scroll-spy-section
          // then we use it's ID as our target.
          above = $.waypoints("above");
          $.each(above, function(idx, el) {
            var $el = $(el);
            if($el.hasClass('scroll-spy-section') && $that.attr('id') != $el.attr('id')) {
              target = $el.attr('id');
            }
          });
        }
        $('a[data-target="' + target + '"]').addClass("active");
      },
      offset: 50 
    });
    
    // Override the default link behavior and slide the user to the selected section
    $('.navbar-nav a[data-target]').on('click', function(ev) {
      var target = $(this).attr('data-target');
      ev.preventDefault();
      $('#'+target).scrollView();
    });
    
    // People seem to like clicking the bulb. Let's use that to scroll them down the page.
    $("#light-bulb").on('click', function(ev) {
      $('#what-ifs-page').scrollView();
    });
  },
  setup_contact_form: function() {
    $(document).ajaxStart(function() {
      $('.keep-in-touch-form button').hide();
    });
    
    $('.keep-in-touch-form').bind('ajax:complete', function(ev, xhr, opts) {
      resp = JSON.parse(xhr.responseText);
      if(resp.status == 'ok') {
        MarketingHomepage.reset_form('.keep-in-touch-form')
        $('.keep-in-touch-form').hide();
        $('.sign-up-confirmation').show();
        
      } else if(resp.status == 'error') {
        $('.keep-in-touch-form button').show();
        $.each(resp.errors, function(key, val) {
          $('.contact-signup-'+key).addClass('error');
        });
      }
    });
  },
  reset_form: function(form_selector) {
    var the_form = $(form_selector);
    the_form.find('input[type="text"], textarea').each(function(idx, el) {
      $(el).attr('value', '');
      $(el).removeClass('error');
    });
  },
  reset_page: function () {
    $('.what-if-contents').css('opacity', 0);
    $('.browser-example .window').scrollTop(0);
  }
};