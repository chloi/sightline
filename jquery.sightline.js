/*!
 * Sightline: Demonstrate your CLI with animated examples.
 * @version 0.1.1
 * @dependency Works with jQuery.
 * @docs https://github.com/chloi/sightline
 * @license The MIT License. Copyright © 2014–2015 Jorge Pedret, Kenneth Ormandy, and Chloi Inc.
 */

(function ($, window, document, undefined) {

  $.fn.sightline = function(defaultOptions) {
    var args = Array.prototype.slice.call(arguments, 0)
    ,   methods = {}
    ,   opts = $.extend({}, $.fn.sightline.defaults, defaultOptions);

    methods = {
      play: function () {
        var self = this,
            lines = $(self).find("> .js-sightline-line"),
            currentLine = 0,
            isFirstLine = true,
            maxLines = self.options.maxLines||0,
            fadeInLine;

        // Array to hold each line’s info and DOM element reference
        self.lines = [];

        // Setup each line and extract the text before starting the animation
        lines.each(function () {
          var $text = $(this).blast({
            delimiter: 'character'
          });

          // console.log(text);

          self.lines.push({
            textPlain: $text.text(),
            textArr: $text,
            el: this,
            $el: $(this)
          });

          $(this).empty().removeClass("is-visible");
        });

        // Helper function to fade in line
        fadeInLine = function (index) {
          var delay = self.options.lineDelay;
          self.lines[index].$el.addClass("is-visible");
        }

        setTimeout(function () {
          var line;
          // Make sure we still have lines to work with
          if (self.lines[currentLine]) {
            line = self.lines[currentLine];
            // Fade in the line if it’s the first iteration
            if (isFirstLine) {
              // Check if there’s maximum number of lines setup
              if (maxLines > 0 && currentLine >= maxLines) {
                self.lines[currentLine-maxLines].$el.removeClass("is-visible");
              }
              fadeInLine(currentLine);
              isFirstLine = false;
            }
            // Don’t animate if it's a simple output
            if (line.$el.attr('data-term') == 'output') {
              line.$el.html(line.textArr);
              fadeInLine(currentLine);
              currentLine++;
              isFirstLine = true;
              setTimeout(arguments.callee, self.options.lineDelay);
            } else {
              // line.$el.html(line.textArr);
              if (line.textArr.length >= 0) {
                line.textArr.each(function(index, b) {
                  // if (typeof(index) !== 'undefined' || line.textArr.length >= index) {
                  //   console.log('line');
                  //   currentLine++;
                  //   isFirstLine = true;
                  //   line.$el.append(line.textArr.get(index));
                  //   setTimeout(arguments.callee, self.options.lineDelay);
                  // } else {
                  //   console.log('text');
                    line.$el.append(line.textArr.get(index));
                    setTimeout(arguments.callee, self.options.charDelay);
                  // }
                })
              }
            }
          } else {
            if (typeof self.options.onComplete == "function") {
              self.options.onComplete.call(self);
            }
          }
        }, self.options.charDelay);
      }
    }

    return $(this).each(function () {
      if (args.length == 0 || typeof args[0] == "object") {
        this.options = $.extend(opts, args[0]);
        if (this.options.autoplay) {
          methods.play.call(this);
        }
      } else if (typeof args[0] == "string") {
        if (typeof methods[args[0]] == "function") {
          if (!this.options) this.options = opts;
          methods[args[0]].call(this, args.splice(1, args.length-1));
        }
      }
    })
  };

  $.fn.sightline.defaults = {
    maxLines: 0,
    charDelay: 50,
    lineDelay: 300,
    autoplay: true
  };

})(window.jQuery, window, document);
