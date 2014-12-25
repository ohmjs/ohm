// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || require('symbol');
var Node = require('./Node');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var actions = {
  getValue: function(t) {
    if (this.ctorName === '_terminal') {
      return t;
    } else {
      throw new Error('the getValue default action cannot be used with a node of type ' + this.ctorName);
    } 
  },
  map: function() {
    throw new Error('the map default action should never be called (this is a bug)');
  },
  passThrough: function(childNode) {
    throw new Error('the passThrough default action should never be called (this is a bug)');
  }
};

function _makeSynthesizedAttribute(actionDict, memoize) {
  function get(node) {
    if (!(node instanceof Node)) {
      throw new Error('not an Ohm CST node: ' + JSON.stringify(node));
    }

    if (node.ctorName === '_list' && node.parent) {
      // If an action's name is ctorName$idx, where idx is the 1-based index of a child node that happens
      // to be a list, it should override the _list action for that particular list node.
      var actionName = node.parent.ctorName + '$' + (node.parent.args.indexOf(node) + 1);
      if (actionDict[actionName]) {
        return actionDict[actionName].call(node);
      }
    }

    if (actionDict[node.ctorName] === actions.map) {
      if (node.ctorName === '_list') {
        return node.args.map(attribute);
      } else {
        throw new Error('the map default action cannot be used with a ' + node.ctorName + ' node');
      }
    } else if (actionDict[node.ctorName] === actions.passThrough) {
      return attribute(node.onlyArg());
    } else if (actionDict[node.ctorName]) {
      return actionDict[node.ctorName].apply(node, node.args);
    } else if (actionDict._default && node.ctorName !== '_terminal') {
      return actionDict._default.call(node);
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
  return _makeSynthesizedAttribute(actionDict, false);
}

function makeSynthesizedAttribute(actionDict) {
  return _makeSynthesizedAttribute(actionDict, true);
}

function makeInheritedAttribute(actionDict) {
  function compute(node) {
    if (!(node instanceof Node)) {
      throw new Error('not an Ohm CST node: ' + JSON.stringify(node));
    }

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
          return actionName;
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
        if (actionDict[actionName] === actions.passThrough) {
          attribute.set(attribute(node.parent));
          return actionName;
        } else if (actionDict[actionName]) {
          actionDict[actionName].apply(node.parent, node.parent.args);
          return actionName;
        } else if (actionDict._default) {
          actionDict._default.call(node.parent, node, node.parent.indexOf(node));
          return '_default';
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

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeSemanticAction = makeSemanticAction;
exports.makeSynthesizedAttribute = makeSynthesizedAttribute;
exports.makeInheritedAttribute = makeInheritedAttribute;
exports.actions = actions;

