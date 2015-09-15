'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

/*
  `FSet`s, or "failure sets", are (immutable) sets of parsing expressions that failed to match the
  input. The interface of `FSets` includes:

  - union(fset) : FSet
  - asFluffy() : FSet
  - isFluffy(PExpr) : bool
  - includes(PExpr) : bool
  - toFailuresArray(grammar) : [Failure]
*/

var empty;

// The FSet "abstract class"

function FSet() {}

FSet.prototype.asFluffy = function() {
  return new Fluffy(this);
};
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
empty.asFluffy = function() {
  return this;
};
empty.isFluffy = function(pexpr) {
  throw new Error('uh-oh');
};
empty.toFailuresArray = function(grammar) {
  return [];
};

// Singleton FSet, i.e., an FSet that contains a single parsing expression.

function Singleton(pexpr) {
  this.pexpr = pexpr;
}
Singleton.prototype = Object.create(FSet.prototype);
Singleton.prototype.includes = function(pexpr) {
  return pexpr === this.pexpr;
};
Singleton.prototype.isFluffy = function(pexpr) {
  return false;
};
Singleton.prototype.toFailuresArray = function(grammar) {
  return [this.pexpr.toFailure(grammar)];
};

// Fluffy FSet

function Fluffy(fs) {
  this.fs = fs;
}
Fluffy.prototype = Object.create(FSet.prototype);
Fluffy.prototype.includes = function(pexpr) {
  return this.fs.includes(pexpr);
};
Fluffy.prototype.asFluffy = function() {
  return this;
};
Fluffy.prototype.isFluffy = function(pexpr) {
  return true;
};
Fluffy.prototype.toFailuresArray = function(grammar) {
  var fs = this.fs.toFailuresArray(grammar);
  fs.forEach(function(f) {
    f.makeFluffy();
  });
  return fs;
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
Union.prototype.isFluffy = function(pexpr) {
  return !(this.fs1.includes(pexpr) && !this.fs1.isFluffy(pexpr) ||
           this.fs2.includes(pexpr) && !this.fs2.isFluffy(pexpr));
};
Union.prototype.toFailuresArray = function(grammar) {
  var arr = this.fs1.toFailuresArray(grammar);
  var fs = this.fs2.toFailuresArray(grammar);
  fs.forEach(function(f) {
    for (var idx = 0; idx < arr.length; idx++) {
      var otherF = arr[idx];
      if (f.subsumes(otherF)) {
        // Replace the failure that is subsumed by f
        arr[idx] = f;
        return;
      }
      if (otherF.subsumes(f)) {
        // f shouldn't be included in the array, since it's subsumed
        return;
      }
    }
    // f is neither subsumed by or subsumes another failure, so add it to the array
    arr.push(f);
  });
  return arr;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.empty = empty;
exports.Singleton = Singleton;
