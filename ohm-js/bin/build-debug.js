'use strict';

var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

var version = require('../package.json').version;

function scriptrel(relpath) {
  return path.join(__dirname, relpath);
}

var b = browserify({
  entries: scriptrel('../src/main.js'),
  debug: true,
  standalone: 'ohm',
  insertGlobalVars: {
    browserifyGlobalOhmVersion: function() {
      return JSON.stringify(version);
    }
  }
});

// Prevent package.json from being included in the bundle -- it is required from version.js, but
// it is only used when `browserifyGlobalOhmVersion` (see above) is not defined.
b.exclude('../package.json');

b.bundle().pipe(fs.createWriteStream(scriptrel('../dist/ohm.js')));
