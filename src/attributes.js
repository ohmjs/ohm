// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function _makeSynthesizedAttribute(actionDict, memoize) {
  function get(node) {
    if (node.ctorName === '_list' && node.parent) {
      // If an action's name is ctorName$idx, where idx is the 1-based index of a child node that happens
      // to be a list, it should override the _list action for that particular list node.
      var actionName = node.parent.ctorName + '$' + (node.parent.args.indexOf(node) + 1);
      if (actionDict[actionName]) {
        return actionDict[actionName].call(node);
      }
    }

    if (actionDict[node.ctorName]) {
      return actionDict[node.ctorName].apply(node, node.args);
    } else if (node.ctorName === '_list') {
      // Default implementation of the _list action
      return node.args.map(get);
    } else if (node.ctorName === '_terminal') {
      // Default implementation of the _terminal action
      return node.value();
    } else if (actionDict._default) {
      return actionDict._default.call(node);
    } else if (node.length() === 1) {
      // We special-case unary rules here, since a very common case when writing actionDicts is to
      // simply tail-recur immediatelky on the sole child.
      return attribute(node.first());
    } else {
      throw new Error('missing semantic action for ' + node.ctorName);
    }
  }
  var attribute;
  if (memoize) {
    var key = Symbol();
    // TODO: add black hole here to detect cycles.
    attribute = function(node) {
      if (!(node.hasOwnProperty(key))) {
        node[key] = get(node);
      }
      return node[key];
    };
    attribute.toString = function() { return '[synthesized attribute]'; };
  } else {
    attribute = get;
    attribute.toString = function() { return '[semantic action]'; };
  }
  return attribute;
}

function makeSemanticAction(actionDict) {
  return _makeSynthesizedAttribute(actionDict, false);
}

function makeSynthesizedAttribute(actionDict) {
  return _makeSynthesizedAttribute(actionDict, true);
}

function makeInheritedAttribute(actionDict) {
  function get(node) {
    if (node.hasOwnProperty(key)) {
      throw new Error('inherited attribute was set more than once on a node');
    } else if (!node.parent) {
      actionDict._base.call(undefined, node);
    } else {
      if (node.parent.ctorName === '_list') {
        // If an action's name is ctorName$idx$each, where idx is the 1-based index of a child node that happens
        // to be a list, it should override the _list action for that particular list node.
        var grandparent = node.parent.parent;
        var actionName = grandparent.ctorName + '$' + (grandparent.indexOf(node.parent) + 1) + '$each';
        if (actionDict[actionName]) {
          return actionDict[actionName].call(node.parent, node);
        }
      }

      var actionName = node.parent.ctorName + '$' + (node.parent.indexOf(node) + 1);
      if (node.parent.ctorName !== '_list' && actionDict[actionName]) {
        actionDict[actionName].apply(node.parent, node.parent.args);
      } else if (actionDict._default) {
        actionDict._default.call(node.parent, node);
      } else {
        throw new Error('missing case for ' + actionName);
      }
    }
  }
  var key = Symbol();
  var attribute = function(node) {
    if (!node.hasOwnProperty(key)) {
      get(node);
    }
    if (!node.hasOwnProperty(key)) {
      throw new Error(
        (node.parent ? node.parent.ctorName : '_base') + ' did not supply a value for node ' + JSON.stringify(node));
    }
    return node[key];
  };
  attribute.set = function(node, value) {
    if (node.hasOwnProperty(key)) {
      throw new Error('the value of an inherited attribute cannot be set more than once');
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

exports.makeSemanticAction = makeSemanticAction;
exports.makeSynthesizedAttribute = makeSynthesizedAttribute;
exports.makeInheritedAttribute = makeInheritedAttribute;
exports.doBottomUp = doBottomUp;

