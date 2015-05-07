'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('..');
var test = require('tape-catch');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function toGrammar(recipeString) {
  return ohm.makeRecipe(eval(recipeString));  // eslint-disable-line no-eval
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('simple recipes', function(t) {
  var g = ohm.grammar('G{}');
  t.ok(toGrammar(g.toRecipe()).match('', 'end'), 'grammar with no rules');

  g = ohm.grammar('G { start = end }');
  t.ok(toGrammar(g.toRecipe()).match('', 'start'), 'grammar with one rule');

  g = ohm.grammar('MyGrammar { start = x\n  x = "a" }');
  t.ok(toGrammar(g.toRecipe()).match('a', 'start'), 'grammar with multiple rules');

  t.end();
});

test('recipes with supergrammars', function(t) {
  var ns = ohm.createNamespace();
  ns.G = ohm.grammar('G { start = end }');
  ns.G2 = ohm.grammar('G2 <: G { start := "a" }', ns);

  t.ok(toGrammar(ns.G2.toRecipe()).match('a', 'start'), 'one level of inheritance');

  ns.G3 = ohm.grammar('G3 <: G2 { begin = a b\n  a = "a"\n  b = "b" }', ns);
  t.ok(toGrammar(ns.G3.toRecipe()).match('ab', 'begin'), 'two levels of inheritance');

  t.end();
});
