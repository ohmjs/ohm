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
    if (!(this.node && this.node.ctorName === '_terminal')) {
      throw new TypeError('ohm.actions.getPrimitiveValue can only be used on _terminal nodes');
    }
    return this.primitiveValue;
  },
  makeArray: function(children) {
    throw new Error('BUG: ohm.actions.makeArray should never be called');
  },
  passThrough: function(childNode) {
    throw new Error('BUG: ohm.actions.passThrough should never be called');
  }
};

// ----------------- Operation -----------------

// An Operation represents a function to be applied to a concrete syntax tree (CST).
// It's very similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern).
// An operation is executed by recursively walking the CST, and at each node, invoking
// the matching semantic action from `actionDict`. See `Operation.prototype.execute`
// for details of how the matching semantic action is determined.
function Operation(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}

Operation.prototype.typeName = 'operation';

Operation.prototype.checkActionDict = function(grammar) {
  grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
};

// Execute this operation on `node` in the context of the given Semantics instance.
Operation.prototype.execute = function(semantics, node) {
  var dict = this.actionDict;

  // First, look for an action whose name matches the node's constructor name -- either
  // the rule name, or a special name like '_many' or '_terminal'.
  var actionFn = dict[node.ctorName];
  if (actionFn) {
    return this.doAction(semantics, node, actionFn, node.ctorName === '_many');
  }
  // If there was no node-specific action, invoke the '_default' action if it exists.
  if (dict._default && node.ctorName !== '_terminal') {
    return this.doAction(semantics, node, dict._default, true);
  }
  throw new Error(
      'missing semantic action for ' + node.ctorName + ' in ' + this.name + ' operation');
};

// Invoke `actionFn` for the given `node` in the context of `semantics`.
// If `optPassChildrenAsArray` is true, `actionFn` will be called with a single argument,
// which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will be
// the same as the number of children that it has.
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

// An Attribute is a value that is computed for a node in a concrete syntax tree (CST).
// It's basically the same as an Operation, except that Attribute values are memoized,
// so the semantic action for a node will be applied no more than once in the context
// of any one Semantics instance.
function Attribute(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}
inherits(Attribute, Operation);

Attribute.prototype.typeName = 'attribute';

Attribute.prototype.execute = function(semantics, node) {
  var key = semantics.attributeKeys[this.name];
  if (!node.hasOwnProperty(key)) {
    node[key] = Operation.prototype.execute.call(this, semantics, node);
  }
  return node[key];
};

// ----------------- Semantics -----------------

// A Semantics object is a container for a family of Operations and/or Attributes.
// They make it possible for an operation to invoke other operations in the same semantics,
// and for operations (and attributes) to be mutually recursive.
// This constructor should not be called directly except from `Semantics.createSemantics`.
// The normal way to create a semantics, given a grammar 'g', is `g.semantics()`.
function Semantics(grammar, optSuperSemantics) {
  this.grammar = grammar;

  var semantics = this;
  var checkedActionDicts = false;

  // Constructor for new wrapper instances, which are passed as the arguments
  // to the semantic actions of an operation or attribute. Operations and attributes require
  // double dispatch: the semantic action is chosen based on both the node and the semantics.
  // Wrappers ensure that `execute` is called with the correct semantics object as an argument.
  this.Wrapper = function SemanticsWrapper(node) {
    if (!checkedActionDicts) {
      checkActionDicts(semantics, grammar);
      checkedActionDicts = true;
    }

    this.node = node;
    this.ctorName = node.ctorName;
    this.interval = node.interval;
    this.primitiveValue = node.primitiveValue;
    this._semantics = semantics;

    // Install all attributes into the wrapper, using Object.defineProperty.
    var wrapper = this;
    var descriptors = {};
    var hasAttributes = false;
    for (var attributeName in semantics.attributes) {
      hasAttributes = true;
      // The following is a work-around for JS's stupid "only functions are lexical scopes" thing.
      // Without it, `attributeName` may not be the same by the time it's used in the getter.
      /* eslint-disable no-loop-func */
      (function(name) {
        descriptors[name] = {
          get: function() {
            return semantics.attributes[name].execute(semantics, wrapper.node);
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

// Check the semantic action dictionary of every operation and attribute in `semantics`, and
// return true if the actions are appropriate for the given grammar, or false if they are not.
function checkActionDicts(semantics, grammar) {
  for (var name in semantics.operations) {
    semantics.operations[name].checkActionDict(grammar);
  }
  for (name in semantics.attributes) {
    semantics.attributes[name].checkActionDict(grammar);
  }
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
  if (name === 'node' || name === 'interval' || name === 'primitiveValue' || name === 'ctorName' ||
      name in this.attributes) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
};

Semantics.prototype.addOperation = function(name, actionDict) {
  this.assertNewName(name, 'operation');
  var op = new Operation(name, actionDict);
  this.operations[name] = op;

  // The following check is not required (it will happen later anyway) but it's better to catch
  // errors early.
  op.checkActionDict(this.grammar);

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
  if (Object.prototype.hasOwnProperty.call(this.operations, name)) {
    throw new Error("Cannot extend operation '" + name + "' again");
  }

  // Create a new operation whose actionDict delegates to the super operation's actionDict,
  // and which has all the keys from `inheritedActionDict`.
  var inheritedActionDict = this.operations[name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });

  var op = new Operation(name, newActionDict);

  // The following check is not required (it will happen later anyway) but it's better to catch
  // errors early.
  op.checkActionDict(this.grammar);

  this.operations[name] = op;
};

Semantics.prototype.addAttribute = function(name, actionDict) {
  this.assertNewName(name, 'attribute');
  var attr = new Attribute(name, actionDict);

  // The following check is not required (it will happen later anyway) but it's better to catch
  // errors early.
  attr.checkActionDict(this.grammar);

  this.attributes[name] = attr;
  this.attributeKeys[name] = Symbol();
};

Semantics.prototype.extendAttribute = function(name, actionDict) {
  if (!(this.super && name in this.super.attributes)) {
    throw new Error(
        "Cannot extend attribute '" + name + "': did not inherit an attribute with that name");
  }
  if (Object.prototype.hasOwnProperty.call(this.attributes, name)) {
    throw new Error("Cannot extend attribute '" + name + "' again");
  }

  // Create a new attribute whose actionDict delegates to the super attribute's actionDict,
  // and which has all the keys from `inheritedActionDict`.
  var inheritedActionDict = this.attributes[name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });

  var attr = new Attribute(name, newActionDict);

  // The following check is not required (it will happen later anyway) but it's better to catch
  // errors early.
  attr.checkActionDict(this.grammar);

  this.attributes[name] = attr;
};

// Given a CST node, return a wrapper for that node in this semantics.
Semantics.prototype.wrap = function(node) {
  return new this.Wrapper(node);
};

// Return an Array of wrappers for each of the given node's children.
Semantics.prototype.wrapChildren = function(node) {
  return node.children.map(this.wrap, this);
};

// Create a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Return a function which acts as a proxy for the
// new Semantics instance. When the function is invoked with a CST node as an argument, it
// returns a wrapper for the Semantics, which gives access to the operations and attributes.
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
