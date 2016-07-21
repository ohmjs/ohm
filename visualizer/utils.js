'use strict';

/* eslint-disable no-unused-vars */
var utils = (function() {
  /* eslint-enable no-unused-vars */

  // polyfill for Object.assign (taken from mdn)
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  function objectForEach(obj, func) {
    Object.keys(obj).forEach(function(key) {
      return func(key, obj[key], obj);
    });
  }

  return {
    objectForEach: objectForEach,
    objectMap: function(obj, func) {
      return Object.keys(obj).map(function(key) {
        return func(key, obj[key], obj);
      });
    },

    /* eslint-disable no-undef */
    $: function(query) { return document.querySelector(query); },
    /* eslint-enable no-undef */

    _: function(tagName, attributes) {
      var children = Array.prototype.slice.call(arguments, 2);
      attributes = attributes || {};
      children = children || [];

      /* eslint-disable no-undef */
      var element = document.createElement(tagName);
      /* eslint-enable no-undef */
      objectForEach(attributes, function(attr, val) {
        element.setAttribute(attr, val);
      });
      children.forEach(function(child) {
        element.appendChild(child);
      });
      return element;
    },

    t: function(text) {
      /* eslint-disable no-undef */
      return document.createTextNode(text);
      /* eslint-enable no-undef */
    },

    clearDOMNode: function(domNode) {
      while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }
    },

    repeat: function(n, fn) {
      if (n < 0) { return; }
      while (n > 0) {
        fn(n);
        n--;
      }
    },

    shuffle: function(a) {
      var j, x, i;
      for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    },

    // same as a\b
    difference: function(a, b) {
      return a.filter(function(item) {
        return !b.includes(item);
      });
    }
  };
})();
