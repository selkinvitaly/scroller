"use strict";

module.exports = function(end, duration, callback) {
  var start   = window.performance && window.performance.now && window.performance.now();
  var begin   = window.pageYOffset;
  var scrollX = window.pageXOffset;
  var raf     = window.requestAnimationFrame;
  var delta   = end - begin;

  switch (!!raf) {
    case true:
      raf(function step(timestamp) {
        var timePassed = timestamp - start;

        if (timePassed > duration || delta === 0) {
          timePassed = duration;
        }

        var progress = timePassed / duration;
        var current  = progress * delta + begin;

        window.scrollTo(scrollX, current + 1); // 1px for firefox

        if (timePassed < duration) {
          raf(step);
        } else if (callback) {
          callback();
        }
      });
      break;

    case false:
      window.scrollTo(scrollX, end);
      if (callback) {
        callback();
      }
      break;
  }
};
