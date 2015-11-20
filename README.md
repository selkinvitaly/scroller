# Scroller

Scroller is a JavaScript class for scrolling on a web page.

* **Plain JavaScript** - this class hasn't dependencies on external libraries, just plain JS;
* **IE9+ supports** - It works on IE9 and above, but in IE9 without animation, because the browser doesn't support [requestAnimationFrame](http://caniuse.com/#search=requestAnimationFrame);
* **Behavioral pattern** - It use this pattern, so you don't need to pass DOM-elements to the constructor;
* **Recalculates after resizing supports** - It can recalculates coordinates after window resizing.

## Usage

Add the script to a page and initialize the class. For example:

```html
<script src="../build/scroller-0.0.1.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      var scroller = new _({
        duration: 300
      });

      scroller.init();
    });
  </script>
```
Note that you may change namespace (in example `_`) in [webpack.config.js](./webpack.config.js) before building.

Link the link that will take the clicks with the block to which you want to scroll through attributes `data-scroller-area` and `data-scroller-link`:

```html
<ul>
  <li><a href="#sec" data-scroller-link="item1">list item</a></li>
</ul>
...
<section id="sec" data-scroller-area="item1">section</section>
```

You may configure the duration of the animation for each DOM-element via attribute `data-scroller-duration`:

```html
<ul>
  <!-- the default duration -->
  <li><a href="#sec" data-scroller-link="item1">list item</a></li>
  <!-- duration 200ms -->
  <li><a href="#sec2" data-scroller-link="item2" data-scroller-duration="200">list item2</a></li>
</ul>
```

You may see [this example](./example/index.html).

##API and options

**API**:
* `init()` - Initialization method;
* `resized` - It have `true` If there was resizing window, else `false`;

**Constructor options**:
* `attributeLink` - string the attribute name for the link. Default: `"data-scroller-link"`;
* `attributeArea` - string the attribute name for the area. Default: `"data-scroller-area"`;
* `duration` - the duration (ms) of animation. Default: `500`;

## Resized example

If you want the class recalculate the coordinates after each resizing window that you may attach handler on `resize` event:

```js
var scroller = new _();
var handlerResized = throttle(function() {
  scroller.resized = true;
}, 500);

window.addEventListener("resize", handlerResized);

function throttle(doSomething, ms) {
  var running = false;

  return function() {
    if (running) {
      return;
    }

    var self = this;
    var args = arguments;

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(step);
    } else {
      step();
    }

    function step() {
      running = true;
      doSomething.apply(self, args);
      setTimeout(function() {
        running = false;
      }, ms);
    }
  };
};
```

## Building

Run after cloning the repository:

``sh
run-scripts build
``

## License

[MIT](./LICENSE)

Copyright (c) Selkin Vitaly, 2015
