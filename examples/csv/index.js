/* eslint-env node */

'use strict';

var assert = require('assert');
var join = require('path').join;
var ohm = require('../..');

var g = ohm.grammarFromFile(join(__dirname, 'csv.ohm'));

var semantics = g.semantics().addOperation('value', {
  csv: function(r, _, rs, eol) {
    return [r.value()].concat(rs.value());
  },
  row: function(c, _, cs) {
    return [c.value()].concat(cs.value());
  },
  col: function(_) {
    return this.interval.contents;
  }
});

var someInput =
    'foo,bar,baz\n' +
    'foo,bar\n' +
    '\n' +
    'foo,,baz\n' +
    ',bar,baz\n' +
    'foo';

function parse(input) {
  var match = g.match(input);
  assert(match.succeeded());
  return semantics(match).value();
}

assert.deepEqual(parse(someInput),
    [['foo', 'bar', 'baz'], ['foo', 'bar'], [''],
    ['foo', '', 'baz'], ['', 'bar', 'baz'], ['foo']]);
assert.deepEqual(parse(someInput + '\n'),
    [['foo', 'bar', 'baz'], ['foo', 'bar'], [''],
    ['foo', '', 'baz'], ['', 'bar', 'baz'], ['foo']]);
