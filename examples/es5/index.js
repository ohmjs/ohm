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

function formatTime(timeArr) {
  return timeArr[0] + '.' + Math.round(timeArr[1] / 1000000) + 's';
}

(function main() {
  var grammars = ohm.grammars(fs.readFileSync(path.join(__dirname, 'es5.ohm')));
  var dir = path.resolve(__dirname, '../../src');
  var sourceFiles = fs.readdirSync(dir).filter(isJavaScriptFile);

  var totalLen = 0;
  var startTime = process.hrtime();

  var ok = sourceFiles.every(function(filename) {
    var source = removeShebang(fs.readFileSync(path.join(dir, filename)).toString());
    totalLen += source.length;
    var trace = grammars.ES5.trace(source, 'Program');
    process.stdout.write('.');
    if (trace.result.failed()) {
      console.log(trace.result.message);
      return false;
    }
    return true;
  });
  var elapsedTime = process.hrtime(startTime);
  if (ok) {
    console.log('\nProcessed ' + totalLen + ' bytes in ' + formatTime(elapsedTime));
  }
})();
