/**
 * Fill Screen
 * Version: 0.1
 * URL: 
 * Description: Make given elements the same height/width as the browser viewport
 * Requires: JQUERY_VERSION, OTHER_PLUGIN(S), ETC.
 * Author: AUTHOR (AUTHOR_URL)
 * Copyright: Copyright 2013 ElectNext
 * License: LICENSE_INFO
 */
 
/**
 * jQuery plugin template from: https://github.com/geetarista/jquery-plugin-template/blob/master/jquery.plugin-template.js
 * Usage:
 * $('.fill-screen').fillscreen();
 * $('.fill-screen').fillscreen('refresh');
 */

// FillScreen closure wrapper
// Uses dollar, but calls jQuery to prevent conflicts with other libraries
// Semicolon to prevent breakage with concatenation
// Pass in window as local variable for efficiency (could do same for document)
// Pass in undefined to prevent mutation in ES3
;(function($, document, window, undefined) {
  // Optional, but considered best practice by some
  "use strict";

  // Name the plugin so it's only in one place
  var pluginName = 'fillscreen';

  // Default options for the plugin as a simple object
  var defaults = {
    targetSelector: '.fill-screen',
    refresh: false
  };

  // FillScreen constructor
  // This is the boilerplate to set up the plugin to keep our actual logic in one place
  function FillScreen(element, options) {
    this.element = element;

    // Merge the options given by the user with the defaults
    this.options = $.extend({}, defaults, options)

    // Attach data to the elment
    this.$el      = $(element);
    this.$el.data(name, this);

    this._defaults = defaults;

    var meta      = this.$el.data(name + '-opts');
    this.opts     = $.extend(this._defaults, options, meta);

    // Initialization code to get the ball rolling
    // If your plugin is simple, this may not be necessary and
    // you could place your implementation here
    this.init();
  }

  FillScreen.prototype = {
    // Public functions accessible to users
    // Prototype methods are shared across all elements
    // You have access to this.options and this.element
    // If your plugin is complex, you can split functionality into more
    // methods like this one

    init: function() {
      // FillScreen initializer - prepare your plugin
      
      if(this.options.refresh === true) {
        this.reset_size();
      }
      this.reset_size();
    },
    reset_size: function() {
      var screen_width = $(window).width(),
          screen_height = $(window).height();

      this.$el.css({ width: screen_width+'px', 'min-height': screen_height+'px' });
    }
  };

  $.fn[pluginName] = function(options) {
    // Iterate through each DOM element and return it
    return this.each(function() {
      // prevent multiple instantiations
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new FillScreen(this, options));
      } else {
        if(typeof options === 'string') {
          if(options === 'refresh') {
            $.data(this, 'plugin_' + pluginName).reset_size();
          }
        }
      }
    });
  };

})(jQuery, document, window);