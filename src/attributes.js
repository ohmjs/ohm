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
      if (actionDict._terminal) {
        return actionDict._terminal.call(v);
      } else {
        return v.value;
      }
    }
  };
  var attribute;
  if (optDoNotMemoize) {
    attribute = function(node) {
      return node.accept(nodeVisitor);
    };
  } else {
    var key = Symbol();
    // TODO: add black hole here to detect cycles.
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
  var nodeVisitor = {
    visitRule: function(r) {
      if (actionDict[r.ctorName]) {
        actionDict[r.ctorName].apply(r, r.args);
      } else if (actionDict._default) {
        actionDict._default.call(r);
/*
      } else if (r.args.length === 1) {
	// We special-case unary rules here, since a very common case
	// when writing actionDicts is to simply tail-recur
	// immediately on the sole child.
	attribute.set(r.args[0], attribute(this));
*/
      } else {
        throw new Error('missing semantic action for ' + r.ctorName);
      }
    },
    visitList: function(l) {
      l.values.forEach(function(node) { node.accept(nodeVisitor) });
    },
    visitValue: function(v) {}
  };
  var key = Symbol();
  var noValue = {};
  var attribute = function(node) {
    if (!(node.hasOwnProperty(key))) {
      if (node.parent) {
        node.parent.args.forEach(function(arg) { arg[key] = noValue; });
        node.parent.accept(nodeVisitor);
      } else {
        node[key] = noValue;
        actionDict._base.call(undefined, node);
      }
    }
    if (node[key] === noValue) {
      // TODO: improve error message (e.g., add index of node, and name specific key in actionDict -- could be _default)
      throw new Error((node.parent ? node.parent.ctorName : '_base') + ' did not supply a value for node type ' + node.ctorName);
    }
    return node[key];
  };
  attribute.set = function(node, value) {
    if (node[key] !== noValue) {
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

