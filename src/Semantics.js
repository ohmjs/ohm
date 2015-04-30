'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var nodes = require('./nodes');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var actions = {
  getPrimitiveValue: function() {
    return (this.node && this.node.primitiveValue) || this.primitiveValue;
  },
  makeArray: function() {
    throw new Error('BUG: ohm.actions.makeArray should never be called');
  },
  passThrough: function(childNode) {
    throw new Error('BUG: ohm.actions.passThrough should never be called');
  }
};

// ----------------- Operation -----------------

function Operation(name, actionDict, semantics) {
  this.name = name;
  this.actionDict = actionDict;
  this.semantics = semantics;
}

Operation.prototype.toString = function() {
  return '[operation ' + this.name + ']';
};

Operation.prototype.execute = function(node) {
  var dict = this.actionDict;

  // TODO: Is this check necessary? We already check the argument to the semantics proxy.
  if (!node || !(node instanceof nodes.Node)) {
    throw new TypeError('Operation expected a node, but got: ' + node);
  }

  var actionFn = dict[node.ctorName];
  if (actionFn) {
    return this._doAction(node, actionFn, node.ctorName === '_many');
  }
  if (dict._default && node.ctorName !== '_terminal') {
    return this._doAction(node, dict._default, true);
  }
  throw new Error('missing semantic action for ' + node.ctorName);
};

Operation.prototype._doAction = function(node, actionFn, optPassChildrenAsArray) {
  if (actionFn === actions.makeArray) {
    if (node.ctorName === '_many') {
      var self = this;
      return node.children.map(function(n) { return self.execute(n); });
    }
    throw new Error(
        'the makeArray default action cannot be used with a ' + node.ctorName + ' node');
  } else if (actionFn === actions.passThrough) {
    if (node.ctorName === '_many') {
      throw new Error('the passThrough default action cannot be used with a _many node');
    }
    return this.execute(node.onlyChild());
  }
  var wrappedChildren = this._wrapChildren(node);
  return optPassChildrenAsArray ?
      actionFn.call(this.semantics._createWrapper(node), wrappedChildren) :
      actionFn.apply(this.semantics._createWrapper(node), wrappedChildren);
};

Operation.prototype._wrapChildren = function(node) {
  return node.children.map(this.semantics._createWrapper, this.semantics);
};

// ----------------- Semantics -----------------

function Semantics(grammar) {
  this._grammar = grammar;

  // Constructor for new wrapper instances, which are passed as the arguments
  // to the semantic action functions of an operation or attribute.
  this._wrapperCtor = function(node) {
    this.node = node;
  };
}

Semantics.actions = actions;

Semantics.prototype.addOperation = function(name, actionDict) {
  if (name in this._wrapperCtor.prototype) {
    throw new Error(
        "Cannot add operation '" + name + "': an operation with that name already exists");
  }
  this._grammar._assertTopDownActionNamesAndAritiesMatch(actionDict, "operation '" + name + "'");

  var op = new Operation(name, actionDict, this);

  // All wrapper instances inherit a curried version of the operation's
  // `execute`, where the first argument is bound to the wrapper's node.
  this._wrapperCtor.prototype[name] = function applyToNode() {
    var args = [this.node].concat(arguments);
    return op.execute.apply(op, args);
  };
  return this;
};

Semantics.prototype._createWrapper = function(node) {
  return new this._wrapperCtor(node);
};

Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(grammar, optSuperSemantics);

  // In order to support invoking a semantics instance like a function, return
  // a function which acts as a proxy for the actual semantics object.
  var proxy = function semanticsProxy(cst) {
    if (!cst || !(cst instanceof nodes.Node)) {
      throw new TypeError('Semantics expected a node, but got: ' + cst);
    }
    return s._createWrapper(cst);
  };
  proxy.addOperation = function() {
    s.addOperation.apply(s, arguments);
    return this;
  };
  return proxy;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;
