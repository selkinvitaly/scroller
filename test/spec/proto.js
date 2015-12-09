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

    it("calls the method _calcCoordinateByName, because the cache object has coordinates and resized is false", function() {
      let elements = {
        nameArea: {}
      };

      spyOn(scroller, "_calcCoordinateByName");

      scroller._calcCoordinates("nameArea", elements);

      expect(scroller._calcCoordinateByName).toHaveBeenCalled();
      expect(scroller._calcCoordinateByName.calls.argsFor(0)).toEqual(["nameArea", elements]);
    });

    it("does nothing, because the cache object has coordinates and resized is false", function() {
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

      spyOn(scroller, "_calcCoordinateByName");
      spyOn(scroller, "_calcAllCoordinates");

      scroller._calcCoordinates("nameArea", elements);

      expect(scroller._calcCoordinateByName).not.toHaveBeenCalled();
      expect(scroller._calcAllCoordinates).not.toHaveBeenCalled();
    });

    it("calls the method _calcAllCoordinates, because resized is true", function() {
      let elements = {};

      spyOn(scroller, "_calcAllCoordinates");

      scroller.resized = true;
      scroller._calcCoordinates("nameArea", elements);

      expect(scroller._calcAllCoordinates).toHaveBeenCalledWith(elements);
    });

  });

  // Scroller.prototype._getCoordinateByName()
  describe("Method _getCoordinateByName", function() {

    it("returns the corrected coordinate from the cache object", function() {
      let elements  = {
        nameArea: {
          pageY: {
            corrected: 100
          }
        }
      };
      let corrected = elements.nameArea.pageY.corrected;
      let result    = scroller._getCoordinateByName("nameArea", elements);

      expect(result).toEqual(corrected);
    });

  });

  // Scroller.prototype._calcAllCoordinates()
  describe("Method _calcAllCoordinates", function() {

    it("calls the method _calcCoordinateByName several times", function() {
      let elements = {
        nameArea: {},
        nameArea2: {}
      };

      spyOn(scroller, "_calcCoordinateByName");

      scroller._calcAllCoordinates(elements);

      expect(scroller._calcCoordinateByName).toHaveBeenCalled();
      expect(scroller._calcCoordinateByName.calls.argsFor(0)).toEqual(["nameArea", elements]);
      expect(scroller._calcCoordinateByName.calls.argsFor(1)).toEqual(["nameArea2", elements]);
      expect(scroller._calcCoordinateByName.calls.count()).toEqual(2);
    });

  });

  // Scroller.prototype._calcCoordinateByName()
  describe("Method _calcCoordinateByName", function() {
    let remove;

    beforeAll(function() {

      remove = function(elem) {
        return document.body.removeChild(elem);
      };

    });

    it("calculates coordinates", function() {
      let area     = document.createElement("div");
      let elements = {
        nameArea: {
          area: area
        }
      };

      area.style.cssText = "height:300px; width:400px;";
      document.body.appendChild(area);

      spyOn(scroller, "_getAdjustedCoordinate");

      scroller._calcCoordinateByName("nameArea", elements);

      expect(elements.nameArea.pageY).toBeDefined();
      expect(scroller._getAdjustedCoordinate).toHaveBeenCalled();

      remove(area);
    });

  });

}(window._));
