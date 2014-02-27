function show(divId, what) {
  if (!(what instanceof Node))
    what = document.createTextNode('' + what)
  var div = document.getElementById(divId)
  while (div.firstChild)
    div.removeChild(div.firstChild)
  div.appendChild(what)
}

Array.prototype.toString = function() {
  var parts = []
  for (var idx = 0; idx < this.length; idx++)
    parts.push(this[idx].toString())
  return ['(', parts.join(' '), ')'].join('')
}

