// Adapted from https://github.com/Alligator/sparklines

/*
Copyright (c) 2014 Reece Selwood
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function makeChart(values, height, parent, filled) {
  var width = 80;
  height = height - 2;
  var max = Math.max.apply(null, values);
  var min = Math.min.apply(null, values);

  if (values.length < 2 || max === min) {
    return;
  }

  function c(x) {
    var s = height / (max - min);
    return height - (s * (x - min));
  }

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('transform', 'translate(0,1)');

  var offset = Math.round(width/(values.length - 1));
  var path = 'M0 ' + c(values[0]).toFixed(2);
  for (var i = 0; i < values.length; i++) {
    path += ' L ' + (i * offset) + ' ' + (c(values[i]).toFixed(2));
  }

  var pathElm = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElm.setAttribute('d', path);
  pathElm.setAttribute('fill', 'none');
  pathElm.style.stroke = '#333';
  pathElm.style.strokeWidth = '1px';
  svg.appendChild(pathElm);

  var avg = values.reduce((x, y) => x + y) / values.length;
  pathElm = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElm.setAttribute('d',
      'M0 ' + c(avg).toFixed(2) + ' L ' + (values.length - 1) * offset + ' ' + c(avg).toFixed(2));
  pathElm.setAttribute('fill', 'none');
  pathElm.style.stroke = 'cornflowerblue';
  pathElm.style.strokeWidth = '1px';
  pathElm.style.strokeOpacity = '0.5';
  svg.appendChild(pathElm);

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(svg);
}

function getDefaultFontSize(pa) {
  pa= pa || document.body;
  var who= document.createElement('div');

  who.style.cssText='display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

  who.appendChild(document.createTextNode('M'));
  pa.appendChild(who);
  var fs= [who.offsetWidth, who.offsetHeight];
  pa.removeChild(who);
  return fs;
}

function updateSparklines() {
  var elms = document.querySelectorAll('.sparkline');
  for (var i = 0; i < elms.length; i++) {
    var e = elms[i];
    var values = elms[i].dataset.values.split(',').map(function(d) { return parseFloat(d); });
    var height = getDefaultFontSize(e)[1];
    if (e.classList.contains('sparkline-filled')) {
      makeChart(values, height, e, true);
    } else {
      makeChart(values, height, e, false);
    }
  }
}

