function makeElement(tagName) {
  var element = document.createElement(tagName);
  for (var idx = 1; idx < arguments.length; idx++) {
    var child = typeof arguments[idx] === 'string' ?  document.createTextNode(arguments[idx]) : arguments[idx];
    element.appendChild(child);
  }
  return element;
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function show(divId, what) {
  if (!(what instanceof Node)) {
    what = document.createTextNode('' + what);
  }
  var div = document.getElementById(divId);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  div.appendChild(what);
}

function repeat(s, n) {
  var arr = [];
  while (n-- > 0) {
    arr.push(s);
  }
  return arr.join('');
}

