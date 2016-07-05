'use strict';

var utils = (function() {
  function objectForEach(obj, func){
    Object.keys(obj).forEach(function(key) {
      return func(key, obj[key], obj);
    });
  }
  
  return {
    objectForEach: objectForEach,
    objectMap: function(obj, func){
      return Object.keys(obj).map(function(key) {
        return func(key, obj[key], obj);
      });
    },

    $: function(query){ return document.querySelector(query) },

    _: function(tagName, attributes){
      var children = Array.prototype.slice.call(arguments, 2);
      attributes = attributes || {};
      children = children || [];
      var element = document.createElement(tagName);
      objectForEach(attributes, function(attr, val) {
        element.setAttribute(attr, val);
      });
      children.forEach(function(child) {
        element.appendChild(child);
      });
      return element;
    },

    t: function(text){
      return document.createTextNode(text);
    },

    clearDOMNode: function(domNode){
      while(domNode.firstChild){
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
  }
})();
