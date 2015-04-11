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

var DEMO_ROOT = path.normalize(path.join(__dirname, '../demo/'));

// Run the demo at the given path (relative to `DEMO_ROOT`), calling `cb` on completion.
// The demos are loaded using JSDOM (https://github.com/tmpvar/jsdom), a JavaScript
// implementation of the WHATWG DOM and HTML standards. Some things may behave slightly
// differently than a real browser environment.
function runDemo(relativePath, testObj, cb) {
  jsdom.env({
    file: path.join(DEMO_ROOT, relativePath),
    features: {
      FetchExternalResources: ['script', 'img', 'css', 'frame', 'iframe', 'link'],

      // Block URLs that begin with HTTP. The demos should use only local resources,
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
          // demo itself.
          if (e.data && e.data.error) {
            console.log(e.data.error);
          } else {
            console.log(e);
          }
        });
      } else {
        // If the demo specifies an inline test, run it.
        if (window.test) {
          testObj.test('test in ' + relativePath, window.test);
        }
      }
      cb(errors);
    }
  });
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('math demo', function(t) {
  runDemo('math/index.html', t, function(errors) {
    t.equal(errors, null, 'runs without errors');
    t.end();
  });
});

test('viz demo', function(t) {
  runDemo('viz/index.html', t, function(errors) {
    t.equal(errors, null, 'runs without errors');
    t.end();
  });
});
