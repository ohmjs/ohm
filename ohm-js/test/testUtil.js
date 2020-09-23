'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const ohm = require('..');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

let nextId = 0;

function uniqueId() {
  return nextId++;
}

function fakeScriptTag(contents) {
  return {
    type: 'text/ohm-js',
    innerHTML: Array.isArray(contents) ? contents.join('\n') : contents,
    getAttribute(name) { return undefined; },
    nodeType: 1
  };
}

function makeGrammar(source, optNamespace) {
  if (Array.isArray(source)) {
    source = source.join('\n');
  }
  return ohm.grammar(source, optNamespace);
}

function makeGrammars(source, optNamespace) {
  if (Array.isArray(source)) {
    source = source.join('\n');
  }
  return ohm.grammars(source, optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  fakeScriptTag,
  makeGrammar,
  makeGrammars,
  uniqueId
};
