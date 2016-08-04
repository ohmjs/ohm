'use strict';

var test = require('tape');

var prettyPrint = require('../../examples/prettyPrint');

test('basic', function(t) {
  t.equal(
    prettyPrint('G { Start=#("a"|b + ) ? }'),
    'G {\n  Start = #("a" | b+)?\n}');
  t.end();
});

test('grammar with supergrammar', function(t) {
  t.equal(
    prettyPrint('G<:Foo{Start=& (~ digit letter)"\\\\n" * }'),
    'G <: Foo {\n  Start = &(~digit letter) "\\\\n"*\n}');
  t.end();
});

test('multiple rules', function(t) {
  t.equal(
    prettyPrint(' G { Start (the start )=a< "b" >--   start\na< arg >=arg "a" .. "z"}'),
    [
      'G {',
      '  Start (the start)',
      '    = a<"b">  -- start',
      '  a<arg> = arg "a".."z"',
      '}'
    ].join('\n'));
  t.end();
});
