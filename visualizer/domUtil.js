'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.domUtil = initModule(root.document);  // eslint-disable-line no-unused-vars
  }
})(this, function(document) {

  // Exports
  // -------

  return {
    createElement: function(sel, optContent) {
      var parts = sel.split('.');
      var tagName = parts[0];
      if (tagName.length === 0) {
        tagName = 'div';
      }

      var el = document.createElement(tagName);
      el.className = parts.slice(1).join(' ');
      if (optContent) {
        el.textContent = optContent;
      }
      return el;
    },

    closestElementMatching: function(sel, startEl) {
      var el = startEl;
      while (el != null) {
        if (el.matches(sel)) {
          return el;
        }
        el = el.parentElement;
      }
    },

    toggleClasses: function(el, map) {
      for (var k in map) {
        if (map.hasOwnProperty(k)) {
          el.classList.toggle(k, !!map[k]);
        }
      }
    }
  };
});
