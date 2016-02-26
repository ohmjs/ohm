'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('..');
var test = require('tape-catch');
var testUtil = require('./testUtil');

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
  var g = testUtil.makeGrammar([
    'G {',
    '  foo = bar<"0", "1">',
    '  bar<x, y> = "a" x -- one',
    '            | "b" y -- two',
    '}'
  ]);
  var recipe = g.toRecipe();
  t.ok(toGrammar(recipe).match('a0').succeeded(), 'matches one paramater');
  t.ok(toGrammar(recipe).match('b1').succeeded(), 'matches multiple parameters');
  t.ok(toGrammar(recipe).match('a2').failed(), 'parameters shadow global rules');
  // .define("bar", ["x", "y"], this.alt(this.app("bar_one", [this.param(0), this.param(1)]), ...
  //   INSTEAD OF
  // .define("bar", ["x", "y"], this.alt(this.app("bar_one", [this.app("x"), this.app("y")]), ...
  t.ok(recipe.match(/define\("bar".*\[this.param/), 'forwards parameters instead of applications');
  t.end();
});

test('recipes with source', function(t) {
  var ns = testUtil.makeGrammars([
    ' G {',  // Deliberately start with leading space.
    '  Start = ident*',
    '  ident = letter /* foo */ identPart*',
    '  identPart = alnum',
    '}',
    ' G2 <: G {',
    '  Start := (ident | number)*',
    '  identPart += "$"',
    '  number = digit+',
    '}'
  ]);
  var g = toGrammar(ns.G.toRecipe());
  t.equal(g.ruleBodies.Start.interval.contents, 'ident*');
  t.equal(g.ruleBodies.ident.interval.contents, 'letter /* foo */ identPart*');

  // Try re-parsing the grammar based on the source retained in the recipe.
  var reconsitutedGrammar = ohm.grammar(g.definitionInterval.contents);
  t.equal(reconsitutedGrammar.toRecipe(), ns.G.toRecipe());

  var g2 = toGrammar(ns.G2.toRecipe());
  t.equal(g2.ruleBodies.Start.interval.contents, '(ident | number)*', 'overridden rule');

  t.equal(g2.ruleBodies.identPart.interval.contents, '"$"', 'extended rule');
  reconsitutedGrammar = ohm.grammar(g2.definitionInterval.contents, {G: ns.G});
  t.equal(reconsitutedGrammar.toRecipe(), ns.G2.toRecipe());

  // Check that recipes without source still work fine.
  g = ohm.makeRecipe(function() {
    return new this.newGrammar('G')  // eslint-disable-line new-cap
        .define('start', [], this.app('any')).build();
  });
  t.equal(g.definitionInterval, undefined, 'grammar definitionInterval is undefined');
  t.equal(g.ruleBodies.start.interval, undefined, 'ruleBodies.start.interval is undefined');
  t.ok(toGrammar(g.toRecipe()), 'recipe still works fine');

  t.end();
});
