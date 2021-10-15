/* eslint-env browser */

'use strict';

window.makeElement = function(tagName, ...children) {
  const element = document.createElement(tagName);
  for (const child of children) {
    const childEl = typeof child === 'string' ? document.createTextNode(child) : child;
    element.appendChild(childEl);
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
  const div = document.getElementById(divId);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  div.appendChild(what);
};

window.repeat = function(s, n) {
  const arr = [];
  while (n-- > 0) {
    arr.push(s);
  }
  return arr.join('');
};
