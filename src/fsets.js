'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// TODO: Add a comment explaining these classes, what they're used for, etc.

/*
FSet interface:
-- union(fset) : FSet
-- includes(PExpr) : bool
-- toArray() : [PExpr]
*/

var empty;

// The FSet "abstract class"

function FSet() {}

FSet.prototype.union = function(fs) {
  return fs === empty ?
      this :
      new Union(fs, this);
};

// Empty FSet

empty = new FSet();
empty.union = function(fs) {
  return fs;
};
empty.includes = function(pexpr) {
  return false;
};
empty.toArray = function() {
  return [];
};

// Singleton FSet

function Singleton(pexpr) {
  this.pexpr = pexpr;
}
Singleton.prototype = Object.create(FSet.prototype);
Singleton.prototype.includes = function(pexpr) {
  return pexpr === this.pexpr;
};
Singleton.prototype.toArray = function() {
  return [this.pexpr];
};

// Union FSet

function Union(fs1, fs2) {
  this.fs1 = fs1;
  this.fs2 = fs2;
}
Union.prototype = Object.create(FSet.prototype);
Union.prototype.includes = function(pexpr) {
  return this.fs1.includes(pexpr) || this.fs2.includes(pexpr);
};
Union.prototype.toArray = function() {
  var es1 = this.fs1.toArray();
  var es2 = this.fs2.toArray();
  var ans = es1.slice();
  es2.forEach(function(e) {
    if (ans.indexOf(e) < 0) {
      ans.push(e);
    }
  });
  return ans;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.empty = empty;
exports.Singleton = Singleton;
