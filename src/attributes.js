// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeSynthesizedAttribute(actionDict, optDoNotMemoize) {
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
  var attribute;
  if (optDoNotMemoize) {
    attribute = function(node) {
      return node.accept(nodeVisitor);
    };
  } else {
    var key = Symbol();
    attribute = function(node) {
      if (!(node.hasOwnProperty(key))) {
        node[key] = node.accept(nodeVisitor);
      }
      return node[key];
    };
  }
  attribute.toString = function() { return '[synthesized attribute]'; };
  return attribute;
}

function makeInheritedAttribute(actionDict) {
  // TODO: figure out how to avoid code duplication here (same def. for nodeVisitor as in makeSynthesizedAttribute).
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
  var key = Symbol();
  var attribute = function(node) {
    if (!(node.hasOwnProperty(key))) {
      (node.parent || node).accept(nodeVisitor);
    }
    return node[key];
  };
  attribute.set = function(node, value) {
    if (node.hasOwnProperty(key)) {
      throw new Error('the value of an attribute cannot be set more than once');
    } else {
      node[key] = value;
    }
  };
  attribute.toString = function() { return '[inherited attribute]'; };
  return attribute;
}

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

exports.makeSynthesizedAttribute = makeSynthesizedAttribute;
exports.makeInheritedAttribute = makeInheritedAttribute;
exports.doBottomUp = doBottomUp;

