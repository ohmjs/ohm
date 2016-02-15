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

    var dragOverlay = document.querySelector('#dragOverlay');

    handle.onmousedown = function(e) {
      dragging = true;
      dragOverlay.style.display = 'block';
      dragOverlay.style.cursor = isVertical ? 'ew-resize' : 'ns-resize';
    };
    window.addEventListener('mousemove', function(e) {
      if (dragging) {
        var innerSize = isVertical ? window.innerWidth : window.innerHeight;
        var pos = isVertical ? e.clientX : e.clientY;
        nextEl.style.flexGrow = innerSize - pos;
        prevEl.style.flexGrow = pos;
        e.preventDefault();
        e.stopPropagation();

        if (el.id) {
          // Store the positions into localStorage.
          localStorage.setItem(toStorageKey(el, 'next'), nextEl.style.flexGrow);
          localStorage.setItem(toStorageKey(el, 'prev'), prevEl.style.flexGrow);
        }
      }
    });
    window.addEventListener('mouseup', function(e) {
      dragging = false;
      dragOverlay.removeAttribute('style');
    });

    // Restore the positions from localStorage.
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
