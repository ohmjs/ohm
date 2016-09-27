'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var ohm = require('..');
var common = require('../src/common');
var testUtil = require('./testUtil');

var makeGrammar = testUtil.makeGrammar;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test.only('basic incremental parsing', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}',
  ]);
  var im = g.incrementalMatcher();
  im.replace(0, 0, 'helloworld');
  t.equal(im.input, 'helloworld');
  im.replace(3, 5, 'X');
  t.equal(im.input, 'helXworld');
  t.ok(im.match('start').succeeded());
  t.ok(im.match().succeeded());
  t.end();
});
