'use strict';

const test = require('ava');

const prettyPrint = require('../../../examples/prettyPrint');

test('basic', t => {
  t.is(
      prettyPrint('G { Start=#("a"|b + ) ? }'),
      'G {\n  Start = #("a" | b+)?\n}');
});

test('grammar with supergrammar', t => {
  t.is(
      prettyPrint('G<:Foo{Start=& (~ digit letter)"\\\\n" * }'),
      'G <: Foo {\n  Start = &(~digit letter) "\\\\n"*\n}');
});

test('multiple rules', t => {
  t.is(
      prettyPrint(' G { Start (the start )=a< "b" >--   start\na< arg >=arg "a" .. "z"}'),
      [
        'G {',
        '  Start (the start)',
        '    = a<"b">  -- start',
        '  a<arg> = arg "a".."z"',
        '}'
      ].join('\n'));
});
