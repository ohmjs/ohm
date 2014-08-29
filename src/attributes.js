// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeAttribute(grammar, actionDict, optDoNotMemoize) {
  grammar.assertSemanticActionNamesAndAritiesMatch(actionDict);
  var value = Symbol();
  var attribute = function(node) {
    if (optDoNotMemoize) {
      return node.accept(actionDict);
    } else {
      if (!(node.hasOwnProperty(value))) {
        node[value] = node.accept(actionDict);
      }
      return node[value];
    }
  };
  attribute.grammar = grammar;
  attribute.toString = function() { return '[ohm attribute]'; };
  return attribute;
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeAttribute = makeAttribute;

