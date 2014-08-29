// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeAttribute(actionDict, optDoNotMemoize) {
  var nodeVisitor = {
    visitRule: function(r) {
      if (actionDict[r.ctorName]) {
        return actionDict[r.ctorName].apply(r, r.args);
      } else if (actionDict._default) {
        return actionDict._default.call(r);
      } else {
        throw new Error('missing semantic action for ' + r.ctorName);
      }
    },
    visitList: function(l) {
      return l.values.map(function(node) { return node.accept(nodeVisitor) });
    },
    visitValue: function(v) {
      return v.value;
    }
  };

  var value = Symbol();
  var attribute = function(node) {
    if (optDoNotMemoize) {
      return node.accept(nodeVisitor);
    } else {
      if (!(node.hasOwnProperty(value))) {
        node[value] = node.accept(nodeVisitor);
      }
      return node[value];
    }
  };
  attribute.toString = function() { return '[ohm attribute]'; };

  return attribute;
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeAttribute = makeAttribute;

