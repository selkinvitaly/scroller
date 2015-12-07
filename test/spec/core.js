"use strict";

;(function(Scroller) {

  describe("Basic requirements", function() {

    let scroller;

    beforeAll(function() {
      scroller = new Scroller();
    });

    it("has getter \"resized\"", function() {
      expect(scroller.resized).toBeDefined();
    });

    it("has init method", function() {
      expect(scroller.init).toBeDefined();
    });

  });

}(window._));
