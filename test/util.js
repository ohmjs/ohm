'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('..');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammar(source, optNamespace) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammar(source, optNamespace);
}

function makeGrammars(source, optNamespace) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammars(source, optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  makeGrammar: makeGrammar,
  makeGrammars: makeGrammars
};
