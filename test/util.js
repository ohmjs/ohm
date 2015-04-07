// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('..');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var nextFreshNSId = 0;
function freshNamespaceName() {
  return 'ns' + nextFreshNSId++;
}

function makeGrammar(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammar(source, optNamespaceName || freshNamespaceName());
}

function makeGrammars(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammars(source, optNamespaceName || freshNamespaceName());
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  freshNamespaceName: freshNamespaceName,
  makeGrammar: makeGrammar,
  makeGrammars: makeGrammars
};
