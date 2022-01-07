'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Semantics = require('./Semantics');
const util = require('./util');

// ----------------- Deferred initialization -----------------

util.awaitBuiltInRules(builtInRules => {
  const operationsAndAttributesGrammar = require('../dist/operations-and-attributes');
  initBuiltInSemantics(builtInRules);
  initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics
});

function initBuiltInSemantics(builtInRules) {
  const actions = {
    empty() {
      return this.iteration();
    },
    nonEmpty(first, _, rest) {
      return this.iteration([first].concat(rest.children));
    },
  };

  Semantics.BuiltInSemantics = Semantics.createSemantics(builtInRules, null).addOperation(
      'asIteration',
      {
        emptyListOf: actions.empty,
        nonemptyListOf: actions.nonEmpty,
        EmptyListOf: actions.empty,
        NonemptyListOf: actions.nonEmpty,
      }
  );
}

function initPrototypeParser(grammar) {
  Semantics.prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
    AttributeSignature(name) {
      return {
        name: name.parse(),
        formals: [],
      };
    },
    OperationSignature(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.children.map(c => c.parse())[0] || [],
      };
    },
    Formals(oparen, fs, cparen) {
      return fs.asIteration().children.map(c => c.parse());
    },
    name(first, rest) {
      return this.sourceString;
    },
  });
  Semantics.prototypeGrammar = grammar;
}
