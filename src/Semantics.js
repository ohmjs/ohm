'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = require('symbol');  // eslint-disable-line no-undef
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

Operation.prototype.execute = function(semantics, node) {
  var dict = this.actionDict;

  var actionFn = dict[node.ctorName];
  if (actionFn) {
    return this.doAction(semantics, node, actionFn, node.ctorName === '_many');
  }
  if (dict._default && node.ctorName !== '_terminal') {
    return this.doAction(semantics, node, dict._default, true);
  }
  throw new Error(
      'missing semantic action for ' + node.ctorName + ' in ' + this.name + ' operation');
};

Operation.prototype.doAction = function(semantics, node, actionFn, optPassChildrenAsArray) {
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
  var wrappedChildren = semantics.wrapChildren(node);
  return optPassChildrenAsArray ?
      actionFn.call(semantics.wrap(node), wrappedChildren) :
      actionFn.apply(semantics.wrap(node), wrappedChildren);
};

// ----------------- Attribute -----------------

function Attribute(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}
inherits(Attribute, Operation);

Attribute.prototype.execute = function(semantics, node) {
  var key = semantics.attributeKeys[this.name];
  if (!node.hasOwnProperty(key)) {
    node[key] = Operation.prototype.execute.call(this, semantics, node);
  }
  return node[key];
};

// ----------------- Semantics -----------------

function Semantics(grammar, optSuperSemantics) {
  this.grammar = grammar;

  // Constructor for new wrapper instances, which are passed as the arguments
  // to the semantic action functions of an operation or attribute.
  var semantics = this;
  this.Wrapper = function SemanticsWrapper(node) {
    this.node = node;
    this.interval = node.interval;
    this.primitiveValue = node.primitiveValue;
    this._semantics = semantics;

    // Install all attributes into the wrapper, using Object.defineProperty
    var wrapper = this;
    var descriptors = {};
    var hasAttributes = false;
    for (var attributeName in semantics.attributes) {
      hasAttributes = true;
      // The following is a work-around for JS's stupid "only functions are lexical scopes" thing.
      // Without it, `attributeName` may not be the same by the time it's used in the getter.
      /* eslint-disable no-loop-func */
      (function(attributeName) {
        descriptors[attributeName] = {
          get: function() {
            return semantics.attributes[attributeName].execute(semantics, wrapper.node);
          }
        };
      })(attributeName);
      /* eslint-enable no-loop-func */
    }
    if (hasAttributes) {
      // Only call `Object.defineProperties` if this semantics has attributes.
      // (This speeds things up a little bit.)
      Object.defineProperties(wrapper, descriptors);
    }
  };

  if (optSuperSemantics) {
    this.super = optSuperSemantics._getTarget();
    if (grammar !== this.super.grammar && !grammar._inheritsFrom(this.super.grammar)) {
      throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name +
          "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null);
    inherits(this.Wrapper, this.super.Wrapper);
  } else {
    this.operations = Object.create(null);
    this.attributes = Object.create(null);
    this.attributeKeys = Object.create(null);
    addBuiltInOperationsAndAttributes(this);
  }

  // Assign unique symbols for each of the attributes in this Semantics, so that
  // they are memoized independently of other instances of Semantics (even
  // sub-Semantics of this one).
  for (var attributeName in this.attributes) {
    this.attributeKeys[attributeName] = Symbol();
  }
}

function addBuiltInOperationsAndAttributes(semantics) {
  semantics.addOperation('toString', {
    _default: function(children) {
      return '[semantics wrapper for ' + this.node.grammar.name + ']';
    },
    _terminal: function() {
      return '[semantics wrapper for ' + this.node.grammar.name + ']';
    }
  });
  // `node`, `interval`, and `primitiveValue` could be real attributes, but they're special-cased
  // as real properties so that we can avoid calling `Object.defineProperties` every time we create
  // a wrapper. (That would make it kind of expensive.)
}

Semantics.actions = actions;

Semantics.prototype.toString = function() {
  return '[semantics for ' + this.grammar.name + ']';
};

Semantics.prototype.assertNewName = function(name, type) {
  if (name in this.operations) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an operation with that name already exists");
  }
  if (name === 'node' || name === 'interval' || name === 'primitiveValue' ||
      name in this.attributes) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
};

Semantics.prototype.addOperation = function(name, actionDict) {
  this.assertNewName(name, 'operation');
  this.grammar._assertTopDownActionNamesAndAritiesMatch(actionDict, false);
  var op = new Operation(name, actionDict);
  this.operations[name] = op;
  var opFn = function() {
    return this._semantics.operations[name].execute(this._semantics, this.node);
  };
  opFn.toString = function() {
    return '[' + name + ' operation ]';
  };
  this.Wrapper.prototype[name] = opFn;
};

Semantics.prototype.extendOperation = function(name, actionDict) {
  if (!(this.super && name in this.super.operations)) {
    throw new Error(
        "Cannot extend operation '" + name + "': did not inherit an operation with that name");
  }

  // Create a new operation whose actionDict delegates to the super operation's actionDict,
  // and which has all the keys from `inheritedActionDict`.
  var inheritedActionDict = this.operations[name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });
  this.operations[name] = new Operation(name, newActionDict);

  // TODO: keep the following check here, but also do it (lazily) for all of the operations /
  // attributes in this Semantics the first first time any operation / attribute is used.
  this.grammar._assertTopDownActionNamesAndAritiesMatch(newActionDict, false);
};

Semantics.prototype.addAttribute = function(name, actionDict) {
  this.assertNewName(name, 'attribute');
  this.grammar._assertTopDownActionNamesAndAritiesMatch(actionDict, false);
  this.attributes[name] = new Attribute(name, actionDict);
  this.attributeKeys[name] = Symbol();
};

Semantics.prototype.extendAttribute = function(name, actionDict) {
  if (!(this.super && name in this.super.attributes)) {
    throw new Error(
        "Cannot extend attribute '" + name + "': did not inherit an attribute with that name");
  }

  // Create a new attribute whose actionDict delegates to the super attribute's actionDict,
  // and which has all the keys from `inheritedActionDict`.
  var inheritedActionDict = this.attributes[name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });
  this.attributes[name] = new Attribute(name, newActionDict);

  // TODO: keep the following check here, but also do it (lazily) for all of the operations /
  // attributes in this Semantics the first first time any operation / attribute is used.
  this.grammar._assertTopDownActionNamesAndAritiesMatch(newActionDict, false);
};

Semantics.prototype.wrap = function(node) {
  return new this.Wrapper(node);
};

Semantics.prototype.wrapChildren = function(node) {
  return node.children.map(this.wrap, this);
};

Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(grammar, optSuperSemantics);

  // In order to support invoking a semantics instance like a function, return
  // a function which acts as a proxy for the actual semantics object.
  var proxy = function(cst) {
    if (!(cst instanceof nodes.Node)) {
      throw new TypeError('Semantics expected a CST node, but got ' + cst);
    }
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a CST node created by grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    return s.wrap(cst);
  };

  // Forward public methods from the proxy to the semantics instance.
  ['addOperation', 'extendOperation', 'addAttribute', 'extendAttribute'].forEach(function(name) {
    proxy[name] = function() {
      s[name].apply(s, arguments);
      return proxy;
    };
  });

  // Make the proxy's toString() work.
  proxy.toString = s.toString.bind(s);

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
