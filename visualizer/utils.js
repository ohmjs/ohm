/* eslint-env browser */
'use strict';

var utils = (function() {

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

    repeat: function(n, fn) {
      if (n < 0) { return; }
      while (n > 0) {
        fn();
        n--;
      }
    },

    shuffle: function(a) {
      var j;
      var x;
      var i;
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
        return b.indexOf(item) === -1;
      });
    },

    includes: function(array, item) {
      return array.indexOf(item) !== -1;
    }
  };
})();

if (typeof exports === 'object') {
  module.exports = utils;
}
