"use strict";

;(function(Scroller) {

  let scroller = new Scroller();

  // Scroller.prototype._closest()
  describe("Method _closest", function() {

    let search;
    let remove;

    beforeAll(function() {

      search = function() {
        let target = document.querySelector("#target");

        return scroller._closest("#search", target);
      };

      remove = function(elem) {
        return document.body.removeChild(elem);
      };

    });

    it("doesn't find the elem with deep more than 3", function() {

      function create() {
        let insert = document.createElement("div");

        insert.id = "search";
        insert.innerHTML = "<div><div><div><span id='target'>target</span></div></div></div>";

        return document.body.appendChild(insert);
      }

      let insert = create();
      let result = search();

      expect(result).toBeNull();

      remove(insert);
    });

    it("find the elem with deep 3", function() {

      function create() {
        let insert = document.createElement("div");

        insert.id = "search";
        insert.innerHTML = "<div><div><span id='target'>target</span></div></div>";

        return document.body.appendChild(insert);
      }

      let insert = create();
      let result = search();
      let look   = document.querySelector("#search");

      expect(result).toBe(look);

      remove(insert);
    });

    it("doesn't return document", function() {

      function create() {
        let insert = document.createElement("div");

        insert.id = "target";
        insert.textContent = "target";

        return document.body.appendChild(insert);
      }

      let insert = create();
      let result = search();

      expect(result).not.toBe(document);

      remove(insert);
    });

  });

  // Scroller.prototype._findAreaByName()
  describe("Method _findAreaByName", function() {

    it("returns the element from the object of elements", function() {
      let area     = document.createElement("div");
      let elements = {
        testName: {
          area: area
        }
      };
      let result   = scroller._findAreaByName("testName", elements);

      expect(result).toBe(area);

    });

    it("returns the element from DOM and saves it", function() {

      function create() {
        let insert = document.createElement("div");

        insert.setAttribute("data-scroller-area", "testName");
        insert.textContent = "test node";

        return document.body.appendChild(insert);
      }

      function remove(elem) {
        return document.body.removeChild(elem);
      }

      let area     = create();
      let elements = {};
      let result   = scroller._findAreaByName("testName", elements, "data-scroller-area");

      expect(result).toBe(area);
      expect(elements.testName.area).toBe(area);

      remove(area);
    });

  });

  // Scroller.prototype._getDurationScrolling()
  describe("Method _getDurationScrolling", function() {

    it("returns the custom duration", function() {
      let elem     = document.createElement("div");
      let duration = 15000;
      let timing   = 10000;

      elem.setAttribute("data-scroller-duration", duration);

      let result = scroller._getDurationScrolling(elem, timing, "data-scroller-duration");

      expect(result).toBe(duration);
    });

    it("returns the default duration", function() {
      let elem     = document.createElement("div");
      let timing   = 10000;
      let duration = "tumba-umba";

      elem.setAttribute("data-scroller-duration", duration);

      let result = scroller._getDurationScrolling(elem, timing, "data-scroller-duration");

      expect(result).toBe(timing);
    });

    it("returns a zero duration", function() {
      let elem     = document.createElement("div");
      let duration = 0;
      let timing   = 10000;

      elem.setAttribute("data-scroller-duration", duration);

      let result = scroller._getDurationScrolling(elem, timing, "data-scroller-duration");

      expect(result).toBe(duration);
    });

  });

  // Scroller.prototype._calcCoordinates()
  describe("Method _calcCoordinates", function() {
    let remove;

    beforeAll(function() {

      remove = function(elem) {
        return document.body.removeChild(elem);
      };

    });

    it("calculates coordinates, but the cache object hasn't coordinates. resized is false", function() {
      let area     = document.createElement("div");
      let elements = {
        nameArea: {
          area: area
        }
      };

      area.style.cssText = "height:300px; width:400px;";
      document.body.appendChild(area);
      scroller._calcCoordinates("nameArea", elements);

      expect(elements.nameArea.pageY).toBeDefined();

      remove(area);
    });

    it("doesn't calculates coordinates, because the cache object has coordinates. resized is false", function() {
      let area     = document.createElement("div");
      let elements = {
        nameArea: {
          area: area,
          pageY: {
            top: 100,
            bottom: 400,
            corrected: 100
          }
        }
      };
      let topCoord = elements.nameArea.pageY.top;

      area.style.cssText = "height:300px; width:400px;";
      scroller._calcCoordinates("nameArea", elements);

      expect(elements.nameArea.pageY.top).toEqual(topCoord);

    });

    it("calculates all coordinates. resized is true", function() {
      let area     = document.createElement("div");
      let area2    = document.createElement("div");
      let elements = {
        nameArea: {
          area: area
        },
        nameArea2: {
          area: area2
        }
      };

      area.style.cssText = area2.style.cssText = "height:300px; width:400px;";
      document.body.appendChild(area);
      document.body.appendChild(area2);

      scroller.resized = true;
      scroller._calcCoordinates("nameArea", elements);

      expect(elements.nameArea.pageY).toBeDefined();
      expect(elements.nameArea2.pageY).toBeDefined();

      remove(area);
      remove(area2);
    });

  });

}(window._));
