// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, args, interval) {
  this.interval = interval;
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.args = args;
}

Node.prototype.length = function() {
  return this.args.length;
};

Node.prototype.get = function(idx) {
  return this.args[idx];
};

Node.prototype.indexOf = function(arg) {
  return this.args.indexOf(arg);
};
  
Node.prototype.isEmpty = function() {
  return this.args.length === 0;
};
  
Node.prototype.first = function() {
  if (this.isEmpty()) {
    throw new Error('cannot get first element of empty rule node');
  } else {
    return this.args[0];
  }
};
  
Node.prototype.last = function() {
  if (this.isEmpty()) {
    throw new Error('cannot get last element of empty rule node');
  } else {
    return this.args[this.args.length - 1];
  }
};

Node.prototype.pred = function() {
  if (arg === this.first()) {
    throw new Error('cannot get predecessor of first child node');
  } else {
    return this.args[this.indexOf(arg) - 1];
  }
};

Node.prototype.succ = function() {
  if (arg === this.last()) {
    throw new Error('cannot get successor of last child node');
  } else {
    return this.args[this.indexOf(arg) + 1];
  }
};

Node.prototype.isValue = function() {
  return this.ctorName === '_terminal';
};

Node.prototype.value = function() {
  if (this.isValue()) {
    return this.first();
  } else {
    throw new Error('cannot get value of a non-terminal node');
  }
};

Node.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.args;
  return r;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Node;

