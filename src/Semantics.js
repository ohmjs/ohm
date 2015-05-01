'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

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

function Operation(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}

Operation.prototype.toString = function() {
  return '[operation ' + this.name + ']';
};

Operation.prototype.execute = function(semantics, node) {
  var dict = this.actionDict;

  var actionFn = dict[node.ctorName];
  if (actionFn) {
    return this._doAction(semantics, node, actionFn, node.ctorName === '_many');
  }
  if (dict._default && node.ctorName !== '_terminal') {
    return this._doAction(semantics, node, dict._default, true);
  }
  throw new Error(
    'missing semantic action for ' + node.ctorName + ' in ' + this.name + ' operation');
};

Operation.prototype._doAction = function(semantics, node, actionFn, optPassChildrenAsArray) {
  if (actionFn === actions.makeArray) {
    if (node.ctorName === '_many') {
      var self = this;
      return node.children.map(function(n) { return self.execute(semantics, n); });
    }
    throw new TypeError('ohm.actions.makeArray expected a _many node, got: ' + node.ctorName);
  } else if (actionFn === actions.passThrough) {
    if (node.ctorName === '_many') {
      throw new TypeError('ohm.actions.passThrough cannot be used with a _many node');
    }
    return this.execute(semantics, node.onlyChild());
  }
  var wrappedChildren = semantics._wrapChildren(node);
  return optPassChildrenAsArray ?
      actionFn.call(semantics._wrap(node), wrappedChildren) :
      actionFn.apply(semantics._wrap(node), wrappedChildren);
};

// ----------------- Semantics -----------------

function Semantics(grammar, optSuperSemantics) {
  this._grammar = grammar;

  // Constructor for new wrapper instances, which are passed as the arguments
  // to the semantic action functions of an operation or attribute.
  var self = this;
  this._wrapperCtor = function(node) {
    // TODO: Make node into an actual attribute to prevent programmers from
    // defining an attribute / semantic action with the same name.
    // TODO: Consider making interval and primitiveValue into attributes, too.
    this.node = node;
    this._semantics = self;
  };

  if (optSuperSemantics) {
    this._super = optSuperSemantics._getTarget();
    // TODO: throw an Error if grammar does not inherit from this._super._grammar
    this._operations = Object.create(this._super._operations);
    inherits(this._wrapperCtor, this._super._wrapperCtor);
  } else {
    this._operations = Object.create(null);
  }
}

Semantics.actions = actions;

Semantics.prototype.addOperation = function(name, actionDict) {
  if (name in this._operations) {
    throw new Error(
        "Cannot add operation '" + name + "': an operation with that name already exists");
  }
  this._grammar._assertTopDownActionNamesAndAritiesMatch(actionDict, false);
  var op = new Operation(name, actionDict);
  this._operations[name] = op;
  this._wrapperCtor.prototype[name] = function() {
    return this._semantics._operations[name].execute(this._semantics, this.node);
  };
};

Semantics.prototype.extendOperation = function(name, actionDict) {
  if (!(this._super && name in this._super._operations)) {
    throw new Error(
        "Cannot extend operation '" + name + "': no inherited operation with that name");
  }

  // Create a new operation whose actionDict delegates to the super operation's actionDict,
  // and which has all the keys from `actionDict`.
  var inheritedActionDict = this._operations[name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });
  this._operations[name] = new Operation(name, newActionDict);

  // TODO: keep the following check here, but also do it (lazily) for all of the operations /
  // attributes in this Semantics the first first time any operation / attribute is used.
  this._grammar._assertTopDownActionNamesAndAritiesMatch(newActionDict, false);
};

Semantics.prototype._wrap = function(node) {
  return new this._wrapperCtor(node);
};

Semantics.prototype._wrapChildren = function(node) {
  return node.children.map(this._wrap, this);
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
    return s._wrap(cst);
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
