'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape');

var exampleWorker = require('../visualizer/exampleWorker');
var utils = require('../visualizer/utils');
var ohm = require('..');

var makeGrammar = require('./testUtil').makeGrammar;

function makeDummyWorkerGlobalScope() {
  var workerListeners = [];
  var dummyWorkerGlobalScope = {
    postMessage: function() { return; },
    addEventListener: function(name, listener) {
      workerListeners.push(listener);
    },
    emit: function(event) {
      workerListeners.forEach(function(listener) {
        listener(event);
      });
    }
  };

  return dummyWorkerGlobalScope;
}

function makeGeneratorForGrammar(g) {
  var workerGlobalScope = makeDummyWorkerGlobalScope();
  var ExampleGenerator = exampleWorker(ohm, utils,
    workerGlobalScope, {}).ExampleGenerator;
  workerGlobalScope.emit({data: {
    name: 'initialize',
    recipe: g.toRecipe(),
    start: false
  }});

  return new ExampleGenerator({});
}

test('ExampleGenerator constructor', function(t) {
  var g = makeGrammar([
    'G {',
    '  ab = "a" "b"',
    '}'
  ]);

  var generator = makeGeneratorForGrammar(g);

  t.deepEqual(generator.examplePieces, {});
  t.deepEqual(generator.rules, ['ab']);
  t.deepEqual(generator.examplesNeeded, ['ab']);
  t.equal(generator.currentRuleIndex, 0);

  t.end();
});

test('ExampleGenerator processExampleFromUser', function(t) {
  var g = makeGrammar([
    'G {',
    '  ab = a b',
    '  a = "a"',
    '  b = "b"',
    '}'
  ]);

  var generator = makeGeneratorForGrammar(g);
  generator.processExampleFromUser('ab', 'ab');

  t.equal(Object.keys(generator.examplePieces).length, 3);
  t.deepEqual(generator.examplePieces.ab, ['ab']);
  t.deepEqual(generator.examplePieces.a, ['a']);
  t.deepEqual(generator.examplePieces.b, ['b']);
  t.deepEqual(generator.examplesNeeded, []);

  t.end();
});

test('ExampleGenerator next works for a simple example', function(t) {
  var g = makeGrammar([
    'G {',
    '  a = "a"',
    '  b = "b"',
    '}'
  ]);

  var generator = makeGeneratorForGrammar(g);

  t.deepEqual(generator.examplePieces, {});
  t.deepEqual(generator.examplesNeeded, ['a', 'b']);

  generator.next();

  t.equal(Object.keys(generator.examplePieces).length, 1);
  t.deepEqual(generator.examplePieces.a, ['a']);
  t.deepEqual(generator.examplesNeeded, ['b']);

  generator.next();

  t.equal(Object.keys(generator.examplePieces).length, 2);
  t.deepEqual(generator.examplePieces.a, ['a']);
  t.deepEqual(generator.examplePieces.b, ['b']);
  t.deepEqual(generator.examplesNeeded, []);

  t.end();
});
