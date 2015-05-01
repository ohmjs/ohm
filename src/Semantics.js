'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');
var inherits = require('inherits');

var nodes = require('./nodes');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var actions = {
  getPrimitiveValue: function() {
    // TODO: Change this to `!(this.node && this.node.ctorName === '_terminal')`
    if (this.node && this.node.ctorName !== '_terminal') {
      throw new TypeError('ohm.actions.getPrimitiveValue can only be used on _terminal nodes');
    }
    // TODO: Remove this conditional and just return this.node.primitiveValue
    // as soon as everything is moved from the old-style semantic actions.
    return (this.node && this.node.primitiveValue) || this.primitiveValue;
  },
  makeArray: function(children) {
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
    throw new TypeError('ohm.actions.makeArray expected a _many node, got: ' + node.ctorName);
  } else if (actionFn === actions.passThrough) {
    if (node.ctorName === '_many') {
      throw new TypeError('ohm.actions.passThrough cannot be used with a _many node');
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

function Semantics(grammar, optSuperSemantics) {
  this._grammar = grammar;
  if (optSuperSemantics) {
    this._super = optSuperSemantics._getTarget();
    this._operations = Object.create(this._super._operations);
  } else {
    this._operations = Object.create(null);
  }

  // Constructor for new wrapper instances, which are passed as the arguments
  // to the semantic action functions of an operation or attribute.
  this._wrapperCtor = function(node) {
    this.node = node;
  };
  if (this._super) {
    inherits(this._wrapperCtor, this._super._wrapperCtor);
  }
}

Semantics.actions = actions;

Semantics.prototype.addOperation = function(name, actionDict) {
  if (name in this._wrapperCtor.prototype) {
    throw new Error(
        "Cannot add operation '" + name + "': an operation with that name already exists");
  }
  this._grammar._assertTopDownActionNamesAndAritiesMatch(actionDict, false);
  var op = new Operation(name, actionDict, this);
  this._bindOperation(op);
  this._operations[name] = op;
};

Semantics.prototype.extendOperation = function(name, actionDict) {
  if (!(name in this._operations)) {
    throw new Error(
        "Cannot extend operation '" + name + "': no operation with that name exists");
  }
  var op = this._operations[name];

  // Create a new object which delegates to the super operation's actionDict,
  // and which has all the keys from `actionDict`.
  var actions = Object.create(op.actionDict);
  extend(actions, actionDict);

  this._grammar._assertTopDownActionNamesAndAritiesMatch(actions, false);
  this._bindOperation(new Operation(name, actions, this));
};

Semantics.prototype._bindOperation = function(op) {
  // All wrapper instances inherit a curried version of the operation's
  // `execute`, where the first argument is bound to the wrapper's node.
  this._wrapperCtor.prototype[op.name] = function applyToNode() {
    var args = [this.node].concat(arguments);
    return op.execute.apply(op, args);
  };
};

Semantics.prototype._createWrapper = function(node) {
  return new this._wrapperCtor(node);
};

Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(grammar, optSuperSemantics);

  // In order to support invoking a semantics instance like a function, return
  // a function which acts as a proxy for the actual semantics object.
  var proxy = function semanticsProxy(cst) {
    if (!(cst instanceof nodes.Node)) {
      throw new TypeError('Semantics expected a node, but got: ' + cst);
    }
    if (cst.grammar !== grammar) {
      throw new Error("Cannot use node from grammar '" + cst.grammar.name +
                      "' with semantics from grammar '" + grammar.name + "'");
    }
    return s._createWrapper(cst);
  };
  // Forward public methods from the proxy to the semantics instance.
  ['addOperation', 'extendOperation'].forEach(function(name) {
    proxy[name] = function() {
      s[name].apply(s, arguments);
      return proxy;
    };
  });
  // Return the semantics for the proxy.
  proxy._getTarget = function() {
    return s;
  };
  return proxy;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;
