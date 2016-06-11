'use strict';

window.objectForEach = function(obj, func){
  Object.keys(obj).forEach(key=> func(key, obj[key], obj));
}

window.objectMap = function(obj, func){
  return Object.keys(obj).map(key=> func(key, obj[key], obj));
}


window.$ = function(query){ return document.querySelector(query) };
window._ = function(tagName, attributes = {}, ...children){
  children = children || [];
  let element = document.createElement(tagName);
  objectForEach(attributes, (attr, val)=> {
    element.setAttribute(attr, val);
  });
  children.forEach(child=> {
    element.appendChild(child);
  });
  return element;
}
window.t = function(text){
  return document.createTextNode(text);
}
window.clearDOMNode = function(domNode){
  while(domNode.firstChild){
    domNode.removeChild(domNode.firstChild);
  }
}

window.repeat = function(n, fn) {
  if (n < 0) { return; }
  while (n > 0) {
    fn(n);
    n--;
  }
};

window.shuffle = function(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

// same as a\b
window.difference = function(a, b) {
  return a.filter(item=> !b.includes(item));
}
