/* eslint-env node */

'use strict';

var fs = require('fs');
var path = require('path');

var ohm = require('../..');

function isJavaScriptFile(filename) {
  return path.extname(filename) === '.js';
}

function removeShebang(source) {
  return source.slice(0, 2) === '#!' ? source.replace('#!', '//') : source;
}

(function main() {
  var grammars = ohm.grammars(fs.readFileSync(path.join(__dirname, 'es5.ohm')));
  var dir = path.resolve(__dirname, '../../src');
  var files = fs.readdirSync(dir).filter(isJavaScriptFile).map(function(name) {
    return {
      name: name,
      contents: removeShebang(fs.readFileSync(path.join(dir, name)).toString())
    };
  });

  console.time('Matching time');
  var filename;
  var result;
  var ok = files.every(function(f) {
    filename = f.name;
    result = grammars.ES5.match(f.contents, 'Program');
    return result.succeeded();
  });
  if (ok) {
    console.timeEnd('Matching time');
  } else {
    console.log(filename + ':\n' + result.message);
  }
})();
