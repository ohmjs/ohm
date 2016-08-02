/* eslint-env browser */

'use strict';

(function() {
  function toStorageKey(el, suffix) {
    return 'splitter-' + el.id + '-' + suffix;
  }

  // Initializes a splitter element by patching the DOM and installing event handlers.
  function initializeSplitter(el) {
    var handle = document.createElement('div');
    handle.classList.add('handle');
    el.appendChild(handle);

    var isVertical = el.classList.contains('vertical');
    var dragging = false;
    var prevEl = el.previousElementSibling;
    var nextEl = el.nextElementSibling;
    var parentEl = el.parentElement;

    var dragOverlay = document.querySelector('#dragOverlay');

    // Set the size of one of the splitter element's siblings to the given value.
    // `which` must be one of 'next' or 'prev'.
    function setSiblingSize(which, value) {
      var node = which === 'prev' ? prevEl : nextEl;
      node.style.flexGrow = value;
      if (el.id) {
        localStorage.setItem(toStorageKey(el, which), value);
      }
    }

    handle.onmousedown = function(e) {
      if (!el.classList.contains('disabled')) {
        dragging = true;
        dragOverlay.style.display = 'block';
        dragOverlay.style.cursor = isVertical ? 'ew-resize' : 'ns-resize';
        e.preventDefault();
      }
    };
    window.addEventListener('mousemove', function(e) {
      var parentElBounds = parentEl.getBoundingClientRect();
      var relativeX = e.clientX - parentElBounds.left;
      var relativeY = e.clientY - parentElBounds.top;

      var innerSize = isVertical ? parentElBounds.width : parentElBounds.height;
      var pos = isVertical ? relativeX : relativeY;

      if (dragging && pos > 0 && pos < innerSize) {
        setSiblingSize('next', innerSize - pos);
        setSiblingSize('prev', pos);
        e.preventDefault();
        e.stopPropagation();
      }
    });
    window.addEventListener('mouseup', function(e) {
      dragging = false;
      dragOverlay.removeAttribute('style');
    });

    // Reset the sizes to 50% when the handle is double-clicked.
    handle.ondblclick = function(e) {
      setSiblingSize('next', 1);
      setSiblingSize('prev', 1);
    };

    // Restore the sizes from localStorage.
    if (el.id) {
      var nextPos = localStorage.getItem(toStorageKey(el, 'next'));
      var prevPos = localStorage.getItem(toStorageKey(el, 'prev'));
      if (nextPos && prevPos) {
        nextEl.style.flexGrow = nextPos;
        prevEl.style.flexGrow = prevPos;
      }
    }
  }

  // Initialize all the splitters on the page.
  // A splitter is a <div> that has the class '.splitter' and no children.
  // If it also has the class '.vertical', it is a vertical splitter (i.e, it splits
  // two columns). Otherwise, it is assumed to be a horizontal splitter.
  var splitters = document.querySelectorAll('.splitter');
  for (var i = 0; i < splitters.length; ++i) {
    initializeSplitter(splitters[i]);
  }

})();
