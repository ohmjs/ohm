'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const ohm = require('../..');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

let nextId = 0;

function uniqueId() {
  return nextId++;
}

function makeGrammar(source, optNamespace) {
  if (Array.isArray(source)) {
    source = source.join('\n');
  }
  return ohm.grammar(source, optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  makeGrammar,
  uniqueId,
};
