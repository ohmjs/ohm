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

function fakeScriptTag(contents) {
  return {
    type: 'text/ohm-js',
    innerHTML: Array.isArray(contents) ? contents.join('\n') : contents,
    getAttribute: function(name) { return undefined; },
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
  fakeScriptTag: fakeScriptTag,
  makeGrammar: makeGrammar,
  makeGrammars: makeGrammars,
  uniqueId: uniqueId
};
