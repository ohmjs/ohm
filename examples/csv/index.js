/* eslint-env node */

'use strict';

const assert = require('assert');
const fs = require('fs');
const join = require('path').join;
const ohm = require('../../ohm-js');

const contents = fs.readFileSync(join(__dirname, 'csv.ohm'));
const g = ohm.grammar(contents);

const semantics = g.createSemantics().addOperation('value', {
  csv(r, _, rs, eol) {
    return [r.value()].concat(rs.value());
  },
  row(c, _, cs) {
    return [c.value()].concat(cs.value());
  },
  col(_) {
    return this.sourceString;
  }
});

const someInput =
    'foo,bar,baz\n' +
    'foo,bar\n' +
    '\n' +
    'foo,,baz\n' +
    ',bar,baz\n' +
    'foo';

function parse(input) {
  const match = g.match(input);
  assert(match.succeeded());
  return semantics(match).value();
}

assert.deepEqual(parse(someInput),
    [['foo', 'bar', 'baz'], ['foo', 'bar'], [''],
      ['foo', '', 'baz'], ['', 'bar', 'baz'], ['foo']]);
assert.deepEqual(parse(someInput + '\n'),
    [['foo', 'bar', 'baz'], ['foo', 'bar'], [''],
      ['foo', '', 'baz'], ['', 'bar', 'baz'], ['foo']]);
