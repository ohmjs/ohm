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
      if (r.ctorName === '_list') {
        if (r.parent) {
          var actionName = r.parent.ctorName + '$' + (r.parent.args.indexOf(r) + 1);
          if (actionDict[actionName]) {
            return actionDict[actionName].call(r);
          }
        }
        if (!actionDict['_list']) {
          return r.args.map(function(node) { return node.accept(nodeVisitor); });
        }
      }
        
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
      if (r.hasOwnProperty(key)) {
        throw new Error('inherited attribute was set more than once on a node');
      } else if (r.parent) {
        if (r.parent.ctorName === '_list') {
          var grandparent = r.parent.parent;
          var actionName = grandparent.ctorName + '$' + (grandparent.indexOf(r.parent) + 1) + '$each';
          if (actionDict[actionName]) {
            return actionDict[actionName].call(r.parent, r);
          }
        }

        var actionName = r.parent.ctorName + '$' + (r.parent.indexOf(r) + 1);
        if (r.parent.ctorName !== '_list' && actionDict[actionName]) {
          actionDict[actionName].apply(r.parent, r.parent.args);
        } else if (actionDict._default) {
          actionDict._default.call(r.parent, r);
        } else {
          throw new Error('missing case for ' + actionName);
        }
      } else {
        actionDict._base.call(undefined, r);
      }
    },
    visitValue: function(v) {
      return nodeVisitor.visitRule(v);
    }
  };
  var key = Symbol();
  var attribute = function(node) {
    if (!node.hasOwnProperty(key)) {
      node.accept(nodeVisitor);
    }
    if (!node.hasOwnProperty(key)) {
      throw new Error(
        (node.parent ? node.parent.ctorName : '_base') + ' did not supply a value for node ' + JSON.stringify(node));
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

