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

}(window._));
