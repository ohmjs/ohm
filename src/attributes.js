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
      } else if (r.args.length === 1) {
	// We special-case unary rules here, since a very common case
	// when writing actionDicts is to simply tail-recur
	// immediately on the sole child.
	return attribute(r.args[0]);
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

var parentStack = [undefined];
var parent = makeAttribute({
  _default: function() {
    parentStack.push(this);
    this.args.forEach(function(arg) { parent(arg); });
    parentStack.pop();
    return parentStack[parentStack.length - 1];
  }
});

function doBottomUp(attribute) {
  return function(node) {
    var postOrder = attribute.grammar.attribute({
      _default: function() {
        this.args.forEach(postOrder);
        return attribute(this);
      }
    });
    return postOrder(node);
  };
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeAttribute = makeAttribute;
exports.parent = parent;
exports.doBottomUp = doBottomUp;

