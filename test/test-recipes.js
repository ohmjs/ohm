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
  t.ok(toGrammar(g.toRecipe()).match('', 'start').succeeded(), 'grammar with one rule');

  g = ohm.grammar('MyGrammar { start = x\n  x = "a" }');
  t.ok(toGrammar(g.toRecipe()).match('a', 'start').succeeded(), 'grammar with multiple rules');

  t.end();
});

test('recipes with supergrammars', function(t) {
  var ns = ohm.createNamespace();
  ns.G = ohm.grammar('G { start = end }');
  ns.G2 = ohm.grammar('G2 <: G { start := "a" }', ns);

  var g2 = toGrammar(ns.G2.toRecipe());
  t.ok(g2.match('a', 'start').succeeded(), 'one level of inheritance');
  t.equals(ns.G2.toRecipe(), g2.toRecipe(), 'grammar and grammar from recipe (with override)');

  ns.G3 = ohm.grammar('G3 <: G2 { begin = a b\n  a = "a"\n  b = "b" }', ns);
  var g3 = toGrammar(ns.G3.toRecipe());
  t.ok(g3.match('ab', 'begin').succeeded(), 'two levels of inheritance');
  t.equals(ns.G3.toRecipe(), g3.toRecipe(), 'grammar and grammar from recipe (with more rules)');

  ns.G4 = ohm.grammar('G4 <: G { start += "a" }', ns);
  var g4 = toGrammar(ns.G4.toRecipe());
  t.ok(g4.match('', 'start').succeeded(), 'original rule matching');
  t.ok(g4.match('a', 'start').succeeded(), 'extended rule mathing');
  t.equals(ns.G4.toRecipe(), g4.toRecipe(), 'grammar and grammar from recipe (with extension)');

  t.end();
});

test('recipes involving parameterized rules', function(t) {
  var g = ohm.grammar(
      'G {\n' +
      '  foo = bar<"0", "1">\n' +
      '  bar<x, y> = "a" x -- one\n' +
      '            | "b" y -- two\n' +
      '}');
  t.ok(toGrammar(g.toRecipe()).match('a0').succeeded());
  t.ok(toGrammar(g.toRecipe()).match('b1').succeeded());
  t.end();
});
