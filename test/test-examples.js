/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');
var jsdom = require('jsdom');
var path = require('path');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var EXAMPLE_ROOT = path.normalize(path.join(__dirname, '../examples/'));

// Run the example at the given path (relative to `EXAMPLE_ROOT`), calling `cb` on completion.
// The examples are loaded using JSDOM (https://github.com/tmpvar/jsdom), a JavaScript
// implementation of the WHATWG DOM and HTML standards. Some things may behave slightly
// differently than a real browser environment.
function runExample(relativePath, testObj, cb) {
  jsdom.env({
    file: path.join(EXAMPLE_ROOT, relativePath),
    features: {
      FetchExternalResources: ['script', 'img', 'css', 'frame', 'iframe', 'link'],

      // Block URLs that begin with HTTP. The examples should use only local resources,
      // referenced by relative path.
      SkipExternalResources: /^http/
    },
    created: function(errors, window) {
      if (errors) {
        cb(errors);
      } else {
        jsdom.getVirtualConsole(window).sendTo(console);
      }
    },
    loaded: function(errors, window) {
      if (errors) {
        errors.forEach(function(e) {
          // Try to print a more useful error message for errors that occur in the
          // example itself.
          if (e.data && e.data.error) {
            console.log(e.data.error);
          } else {
            console.log(e);
          }
        });
      } else {
        // If the example specifies an inline test, run it.
        if (window.test) {
          testObj.test('test in ' + relativePath, window.test);
        }
      }
      cb(errors);
      window.close();
    }
  });
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('math example', function(t) {
  runExample('math/index.html', t, function(errors) {
    t.equal(errors, null, 'runs without errors');
    t.end();
  });
});

test('viz example', function(t) {
  runExample('viz/index.html', t, function(errors) {
    t.equal(errors, null, 'runs without errors');
    t.end();
  });
});

test('csv example', function(t) {
  require(path.join(EXAMPLE_ROOT, 'csv', 'index.js'));
  t.end();
});

/*
TODO: implement new version of inherited attributes,
then update pl0 example and uncomment the following.

test('pl0 example', function(t) {
  runExample('pl0/index.html', t, function(errors) {
    t.equal(errors, null, 'runs without errors');
    t.end();
  });
});
*/
