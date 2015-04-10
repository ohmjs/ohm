/* eslint-env browser */

'use strict';

window.makeElement = function(tagName) {
  var element = document.createElement(tagName);
  for (var idx = 1; idx < arguments.length; idx++) {
    var child = typeof arguments[idx] === 'string' ?
        document.createTextNode(arguments[idx]) :
        arguments[idx];
    element.appendChild(child);
  }
  return element;
};

window.removeChildren = function(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

window.show = function(divId, what) {
  if (!(what instanceof Node)) {
    what = document.createTextNode('' + what);
  }
  var div = document.getElementById(divId);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  div.appendChild(what);
};

window.repeat = function(s, n) {
  var arr = [];
  while (n-- > 0) {
    arr.push(s);
  }
  return arr.join('');
};
