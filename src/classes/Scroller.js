// =================================================
// Scroller class. This class has the following public API:
//    - [method] "init" - binds handler;
//    - [getter and setter] "resized" - necessary to recalculate the coordinates after window resizing;
// =================================================
// ATTENTION: this class has the following dependencies:
//    - helper "scrollTo" (methods: _clickHandler);
// =================================================
"use strict";

var scrollTo = require("../helpers/scrollTo");

module.exports = function(options) {
  // private
  var attributeLink     = options && options.attributeLink || "data-scroller-link";
  var attributeArea     = options && options.attributeArea || "data-scroller-area";
  var attributeDuration = options && options.attributeDuration || "data-scroller-duration";
  var timing            = options && options.duration || 500;
  var self              = this;
  var elements          = {};
  var resized           = false;
  var running           = false;

  // public
  this.init = function() {
    document.addEventListener("click", _clickHandler, false);
  };

  // getter and setter
  Object.defineProperty(this, "resized", {
    get: function() {
      return resized;
    },
    set: function(bool) {
      resized = bool;
    }
  });

  // private
  function _clickHandler(event) {
    var target = self._closest("[" + attributeLink + "]", event.target);

    if (!target) {
      return;
    }
    if (running) {
      self._cancelEvent(event);
      return;
    }

    var nameArea = target.getAttribute(attributeLink);

    self._findAreaByName(nameArea, elements, attributeArea);
    self._calcCoordinates(nameArea, elements);
    running = true;

    var coord    = self._getCoordinateByName(nameArea, elements);
    var duration = self._getDurationScrolling(target, timing, attributeDuration);

    scrollTo(coord, duration, function() { // dependency
      running = false;
    });
    self._cancelEvent(event);
  }
};

// protected
// this method finds and returns the target element
module.exports.prototype._closest = function(selector, target, deep) {
  var deep    = deep || 3;
  var element = target;

  while (deep-- && element !== document && !element.matches(selector)) {
    element = element.parentNode;
  }
  return (element && element !== document && element.matches(selector)) ? element : null;
};

// protected
// this method finds an area in the object of elements or DOM and saves it (if requared)
module.exports.prototype._findAreaByName = function(nameArea, elements, attributeArea) {
  if (nameArea in elements) {
    return elements[nameArea].area;
  }

  var area = document.querySelector("[" + attributeArea + "='" + nameArea + "'" + "]");

  elements[nameArea] = {
    area: area
  };
  return area;
};

// protected
// if the link contains the "duration" attribute than this method returns it
// if the link doesn't contain the "duration" attribute (or invalide value) that this method returns the default timing
module.exports.prototype._getDurationScrolling = function(link, timing, attribute) {
  var duration = link.getAttribute(attribute);

  return (duration !== "0" && (!duration || window.isNaN(+duration))) ? timing : +duration;
};

// protected
module.exports.prototype._cancelEvent = function(event) {
  event.preventDefault();
};

// protected
// this method calculates the coordinate of area by name and saves it (if there wasn't changing the window and this coordinate was cached)
// this method calculates all coordinates of areas (if there was changing the window)
module.exports.prototype._calcCoordinates = function(nameArea, elements) {
  var element = elements[nameArea];
  var resized = this.resized;

  switch (resized) {
    case true:
      this._calcAllCoordinates(elements);
      this.resized = false;
      break;
    case false:
      if (!element.pageY) {
        this._calcCoordinateByName(nameArea, elements);
      }
      break;
    default:
      throw new Error("scroller class: an unknown value resized flag");
  }
};

// protected
// this method calculates all coordinates of areas and saves them
module.exports.prototype._calcAllCoordinates = function(elements) {
  for (var nameArea in elements) {
    this._calcCoordinateByName(nameArea, elements);
  }
};

// protected
// this method calculates the coordinate of the area by name and saves it
module.exports.prototype._calcCoordinateByName = function(nameArea, elements) {
  var element = elements[nameArea];
  var area    = element.area;
  var rect    = area.getBoundingClientRect();
  var scroll  = window.pageYOffset;

  if (!element.pageY) {
    element.pageY = {};
  }

  element.pageY.top       = rect.top + scroll;
  element.pageY.bottom    = rect.bottom + scroll; // just in case :)
  element.pageY.corrected = this._getAdjustedCoordinate(rect.top + scroll);
};

// protected
// this method returns the coordinate of area by name
module.exports.prototype._getCoordinateByName = function(nameArea, elements) {
  return elements[nameArea].pageY.corrected;
};

// protected
// this method returns corrected coordinate
module.exports.prototype._getAdjustedCoordinate = function(coordinate) {
  var heightDoc = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  var restrict  = heightDoc - document.documentElement.clientHeight;

  return (coordinate > restrict) ? restrict : coordinate;
};
