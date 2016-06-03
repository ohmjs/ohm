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
