'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('..');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var nextId = 0;

function uniqueId() {
  return nextId++;
}

function makeGrammar(source, optNamespace) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.grammar(source, optNamespace);
}

function makeGrammars(source, optNamespace) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.grammars(source, optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  makeGrammar: makeGrammar,
  makeGrammars: makeGrammars,
  uniqueId: uniqueId
};
