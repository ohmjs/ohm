// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function _makeSynthesizedAttribute(actionDict, magic, memoize) {
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
    } else if (magic && node.ctorName === '_list') {
      // Default implementation of the _list action
      return node.args.map(attribute);
    } else if (magic && node.ctorName === '_terminal') {
      // Default implementation of the _terminal action
      return node.value();
    } else if (actionDict._default) {
      return actionDict._default.call(node);
    } else if (magic && node.length() === 1 && node.ctorName !== '_terminal') {
      // We special-case unary rules here, since a very common case when writing actionDicts is to
      // simply tail-recur immediately on the sole child.
      return attribute(node.first());
    } else {
      throw new Error('missing method for ' + node.ctorName);
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
  return _makeSynthesizedAttribute(actionDict, true, false);
}

function makeSynthesizedAttribute(actionDict) {
  return _makeSynthesizedAttribute(actionDict, true, true);
}

function _makeInheritedAttribute(actionDict, magic) {
  function compute(node) {
    if (!node.parent) {
      actionDict._base.call(undefined, node);
      return '_base';
    } else {
      if (node.parent.ctorName === '_list') {
        // If there is an action called <ctorName>$<idx>$each, where <idx> is the 1-based index of a child node
        // that happens to be a list, it should override the _list method for that particular list node.
        var grandparent = node.parent.parent;
        var actionName = grandparent.ctorName + '$' + (grandparent.indexOf(node.parent) + 1) + '$each';
        if (actionDict[actionName]) {
          actionDict[actionName].call(node.parent, node);
          return '_actionName';
        } else if (actionDict._list) {
          actionDict._list.call(node.parent, node, node.parent.indexOf(node));
          return '_list';
        } else if (actionDict._default) {
          actionDict._default.call(node.parent, node);
          return '_default';
        } else {
          throw new Error('missing ' + actionName + ', _list, or _default method');
        }
      } else {
        var actionName = node.parent.ctorName + '$' + (node.parent.indexOf(node) + 1);
        if (actionDict[actionName]) {
          actionDict[actionName].apply(node.parent, node.parent.args);
          return actionName;
        } else if (actionDict._default) {
          actionDict._default.call(node.parent, node, node.parent.indexOf(node));
          return '_default';
        } else if (magic && node.parent.length() === 1) {
          // We special-case unary rules here, since a very common case when writing actionDicts is to
          // have the sole child inherit the parent's value.
          attribute.set(attribute(node.parent));
        } else {
          throw new Error('missing ' + actionName + ' or _default method');
        }
      }
    }
  }
  var key = Symbol();
  var currentChildStack = [];
  var attribute = function(node) {
    if (!node.hasOwnProperty(key)) {
      currentChildStack.push(node);
      try {
        var methodName = compute(node);
        if (!node.hasOwnProperty(key)) {
          throw new Error('method ' + methodName + ' did not set a value for a child node of type ' + node.ctorName);
        }
      } finally {
        currentChildStack.pop();
      }
    }
    return node[key];
  };
  attribute.set = function(value) {
    var node = currentChildStack[currentChildStack.length - 1];
    if (node.hasOwnProperty(key)) {
      throw new Error('the value of an inherited attribute cannot be set more than once');
    } else {
      node[key] = value;
    }
  };
  attribute.toString = function() { return '[inherited attribute]'; };
  return attribute;
}

function makeInheritedAttribute(actionDict) {
  return _makeInheritedAttribute(actionDict, true);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeSemanticAction = makeSemanticAction;
exports.makeSynthesizedAttribute = makeSynthesizedAttribute;
exports.makeInheritedAttribute = makeInheritedAttribute;

