/* eslint-env node */

// NOTE: This file must parse as ES5, because the 'ecmascript examples' test below tries to
// parse the file itself using our ES5 grammar.

/* eslint-disable no-var, prefer-arrow-callback, object-shorthand, ava/prefer-async-await */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('ava');

var exec = require('child_process').exec;
var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');
var walkSync = require('walk-sync');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var EXAMPLE_ROOT = path.normalize(path.join(__dirname, '../../examples/'));

function runExampleAsync(relativePath) {
  return new Promise(function(resolve, reject) {
    runExample(relativePath, resolve);
  });
}

// Run the example at the given path (relative to `EXAMPLE_ROOT`), calling `cb` on completion.
// The examples are loaded using JSDOM (https://github.com/tmpvar/jsdom), a JavaScript
// implementation of the WHATWG DOM and HTML standards. Some things may behave slightly
// differently than a real browser environment.
function runExample(relativePath, cb) {
  var errors = [];
  jsdom.env({
    file: path.join(EXAMPLE_ROOT, relativePath),
    features: {
      FetchExternalResources: ['script', 'img', 'css', 'frame', 'iframe', 'link'],

      // Block URLs that begin with HTTP. The examples should use only local resources,
      // referenced by relative path.
      SkipExternalResources: /^http/
    },
    created: function(error, window) {
      if (error) {
        cb([error]);
      } else {
        jsdom.getVirtualConsole(window).sendTo(console);
        window.addEventListener('error', function(evt) {
          /* eslint-disable no-console */
          console.error(
              'In ' +
              evt.filename +
              '\n' +
              'at line ' +
              evt.lineno +
              ' (relative to start of script), col ' +
              evt.colno +
              ':'
          );
          /* eslint-enable no-console */
          errors.push(evt.error);
        });
      }
    },
    onload: function(window) {
      // If the example specifies an inline test, run it.
      if (window.test) window.test();
      window.close();
      cb(errors);
    }
  });
}

// Executes `yarn build` if any of the files in src/ are older than the browserified bundle.
function rebuildIfModified() {
  // Get a sorted list of last-modified times for every file in the 'src' dir.
  var srcEntries = walkSync.entries(path.join(__dirname, '../src'));
  var mtimes = srcEntries.map(function(entry) {
    return entry.mtime;
  });
  mtimes.sort(function(a, b) {
    return a - b;
  });

  var srcDate = new Date(mtimes.pop());
  var bundleDate = fs.statSync(path.join(__dirname, '../dist/ohm.js')).mtime;

  if (bundleDate < srcDate) {
    var p = exec('yarn build');
    p.stdout.on('data', function() {
      /* ignore */
    });
    p.stderr.pipe(process.stderr);
  }
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('math example', function(t) {
  rebuildIfModified();
  return runExampleAsync('math/index.html').then(function(errors) {
    t.deepEqual(errors, [], 'runs without errors');
  });
});

test('viz example', function(t) {
  rebuildIfModified();
  return runExampleAsync('viz/index.html').then(function(errors) {
    t.deepEqual(errors, [], 'runs without errors');
  });
});

test('csv example', function(t) {
  t.notThrows(function() {
    require(path.join(EXAMPLE_ROOT, 'csv', 'index.js'));
  });
});
