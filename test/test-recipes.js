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

function makeRecipe(recipeString) {
  return ohm.makeRecipe(eval(recipeString));  // eslint-disable-line no-eval
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('simple grammar recipes', function(t) {
  var g = ohm.grammar('G{}');
  t.ok(ohm.makeRecipe(g.toRecipe()).match('', 'end'), 'grammar with no rules');

  g = ohm.grammar('G { start = end }');
  t.ok(ohm.makeRecipe(g.toRecipe()).match('', 'start').succeeded(), 'grammar with one rule');

  g = ohm.grammar('MyGrammar { start = x\n  x = "a" }');
  t.ok(ohm.makeRecipe(g.toRecipe()).match('a', 'start').succeeded(), 'grammar with multiple rules');

  t.end();
});

test('grammar recipes with supergrammars', function(t) {
  var ns = ohm.createNamespace();
  ns.G = ohm.grammar('G { start = end }');
  ns.G2 = ohm.grammar('G2 <: G { start := "a" }', ns);

  var g2 = ohm.makeRecipe(ns.G2.toRecipe());
  t.ok(g2.match('a', 'start').succeeded(), 'one level of inheritance');
  t.equals(g2.toRecipe(), ns.G2.toRecipe(), 'grammar and grammar from recipe (with override)');

  ns.G3 = ohm.grammar('G3 <: G2 { begin = a b\n  a = "a"\n  b = "b" }', ns);
  var g3 = ohm.makeRecipe(ns.G3.toRecipe());
  t.ok(g3.match('ab', 'begin').succeeded(), 'two levels of inheritance');
  t.equals(g3.toRecipe(), ns.G3.toRecipe(), 'grammar and grammar from recipe (with more rules)');

  ns.G4 = ohm.grammar('G4 <: G { start += "a" }', ns);
  var g4 = ohm.makeRecipe(ns.G4.toRecipe());
  t.ok(g4.match('', 'start').succeeded(), 'original rule matching');
  t.ok(g4.match('a', 'start').succeeded(), 'extended rule mathing');
  t.equals(g4.toRecipe(), ns.G4.toRecipe(), 'grammar and grammar from recipe (with extension)');

  t.end();
});

test('grammar recipes involving parameterized rules', function(t) {
  var g = testUtil.makeGrammar([
    'G {',
    '  foo = bar<"0", "1">',
    '  bar<x, y> = "a" x -- one',
    '            | "b" y -- two',
    '}'
  ]);
  var recipe = g.toRecipe();
  t.ok(ohm.makeRecipe(recipe).match('a0').succeeded(), 'matches one paramater');
  t.ok(ohm.makeRecipe(recipe).match('b1').succeeded(), 'matches multiple parameters');
  t.ok(ohm.makeRecipe(recipe).match('a2').failed(), 'parameters shadow global rules');
  // "bar":["define",...,["alt",{...},["app",{},"bar_one",[["param",{},0],["param",{},1]]]
  //   INSTEAD OF
  // "bar":["define",...,["alt",{...},["app",{},"bar_one",[["app",{},"x"],["app",{},"y"]]]
  t.ok(recipe.match(/\["app",\{.*?\},"bar_one",\[\["param",\{.*?\},0\]/),
    'forwards parameters instead of applications');
  t.end();
});

test('grammar recipes with source', function(t) {
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
  var g = ohm.makeRecipe(ns.G.toRecipe());
  t.equal(g.rules.Start.body.source.contents, 'ident*');
  t.equal(g.rules.ident.body.source.contents, 'letter /* foo */ identPart*');

  // Try re-parsing the grammar based on the source retained in the recipe.
  var reconsitutedGrammar = ohm.grammar(g.source.contents);
  t.equal(reconsitutedGrammar.toRecipe(), ns.G.toRecipe());

  var g2 = ohm.makeRecipe(ns.G2.toRecipe());
  t.equal(g2.rules.Start.body.source.contents, '(ident | number)*', 'overridden rule');

  t.equal(g2.rules.identPart.body.source.contents, '"$"', 'extended rule');
  reconsitutedGrammar = ohm.grammar(g2.source.contents, {G: ns.G});
  t.equal(reconsitutedGrammar.toRecipe(), ns.G2.toRecipe());

  // Check that recipes without source still work fine.
  g = ohm.makeRecipe(
    '["grammar",{},"G",null,"start",{"start":["define",{},null,[],["app",{},"any",[]]]}]');
  t.equal(g.source, undefined);
  t.equal(g.rules.start.body.source, undefined);
  t.ok(ohm.makeRecipe(g.toRecipe()), 'recipe still works fine');

  t.end();
});

test('semantics recipes', function(t) {
  var g1 = ohm.grammar('G { Add = number "+" number  number = digit+ }');
  var s1 = g1.createSemantics()
    .addOperation('eval', {
      Add: function(a, _, b) {
        return a.value + b.value;
      }
    })
    .addOperation('evalWith(inc, factor)', {
      Add: function(a, _, b) {
        return a.evalWith(this.args.inc, this.args.factor) +
          b.evalWith(this.args.inc, this.args.factor);
      },
      number: function(digits) {
        return (this.value + this.args.inc) * this.args.factor;
      }
    })
    .addAttribute('value', {
      number: function(digits) {
        return parseFloat(this.sourceString);
      }
    });

  var s2 = makeRecipe(s1.toRecipe());
  t.equal(s2.name, 'ASemantics', 'semantics created');

  var g2 = s2.getGrammar();
  t.equal(g2.name, 'G', 'semantics from grammar');

  var ops = s2.getOperationNames();
  t.deepEqual(ops, ['eval', 'evalWith'], 'semantics with operation');
  var atts = s2.getAttributeNames();
  t.deepEqual(atts, ['value'], 'semantics with attributes');

  t.equal(s2(g2.match('11+12')).eval(), 23, 'working operation');
  t.equal(s2(g2.match('9+10')).evalWith(+1, 2), 42, 'working operation with arguments');

  t.end();
});

test('semantics recipes (special cases)', function(t) {
  var ns = testUtil.makeGrammars([
    'G { special = "\u2028" }',
    'G2 <: G { special += "\u2029" }'
  ]);

  var s = ns.G.createSemantics();
  t.doesNotThrow(
    function() { makeRecipe(s.toRecipe()); },
    undefined,
    'special handling of line separator characters (U+2028)'
  );

  s = ns.G2.createSemantics();
  t.doesNotThrow(
    function() { makeRecipe(s.toRecipe()); },
    undefined,
    'special handling of paragraph separator characters (U+2029)'
  );

  t.end();
});

test('semantics recipes with extensions', function(t) {
  var ns = testUtil.makeGrammars([
    'G { ',
    '  Add = one "and" two',
    '  one = "one"',
    '  two = "two"',
    '  three = "three"',
    '}',
    'G2 <: G {',
    '}',
    'G3 <: G2 {',
    '  one := "elf"',
    '}']);
  var s = ns.G.createSemantics()
    .addAttribute('value', {
      one: function(_) { return 1; },
      two: function(_) { return 2; },
      _default: function(children) {
        return 'default';
      }
    })
    .addOperation('valueTimesTwo', {
      _nonterminal: function(children) { return this.value * 2; }
    });
  var s2 = ns.G2.extendSemantics(s).addOperation('eval', {
    Add: function(one, _, two) { return one.value + two.value; }
  });
  var s3 = ns.G3.extendSemantics(s2).extendAttribute('value', {
    one: function(str) { return 11; }  // overriding
  });

  var sRe = makeRecipe(s3.toRecipe());
  var gRe = sRe.getGrammar();

  var m1 = gRe.match('elf', 'one');
  var m2 = gRe.match('two', 'two');
  var m3 = gRe.match('three', 'three');
  var m4 = gRe.match('elf and two', 'Add');
  t.equal(sRe(m1).value, 11, 'extended semantics');
  t.equal(sRe(m2).value, 2, 'extended semantics');
  t.equal(sRe(m3).value, 'default', 'extended semantics');
  t.equal(sRe(m1).valueTimesTwo(), 22, 'not-extended semantics');
  t.equal(sRe(m4).eval(), 13, 'intermediate semantics');

  // Check extension of semantic without changing to super grammar
  var s4 = ns.G.extendSemantics(s).extendAttribute('value', {
    two: function(str) { return 22; }   // overriding
  });

  sRe = makeRecipe(s4.toRecipe());
  gRe = sRe.getGrammar();

  m2 = gRe.match('two', 'two');
  t.equal(sRe(m2).value, 22, 'twice extended semantics for one grammar');

  t.end();
});

