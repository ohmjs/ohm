// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var errors = require('./errors.js');
var Node = require('./Node.js');
var pexprs = require('./pexprs.js');
var InputStream = require('./InputStream.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

function atEnd(state) {
  skipSpacesIfAppropriate(state);
  return state.inputStream.atEnd();
}

var applySpaces_ = new pexprs.Apply('spaces_');

function skipSpacesIfAppropriate(state) {
  var ruleName = state.ruleStack[state.ruleStack.length - 1] || '';
  if (typeof state.inputStream.source === 'string' && common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }
}

function skipSpaces(state) {
  var origFailureDescriptor = state.failureDescriptor;
  var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
  applySpaces_.eval(state);
  state.bindings.pop();
  state.failureDescriptor = origFailureDescriptor;
}

// The contract of PExpr.prototype.eval:
// * When the return value is true:
//   -- bindings will have expr.arity more elements than before
// * When the return value is false:
//   -- bindings will have exactly the same number of elements as before
//   -- position could be anywhere

pexprs.PExpr.prototype.eval = common.abstract;

pexprs.anything.eval = function(state) {
  skipSpacesIfAppropriate(state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(new Node(state.grammar, '_terminal',  [value], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.end.eval = function(state) {
  var inputStream = state.inputStream;
  if (atEnd(state)) {
    state.bindings.push(new Node(state.grammar, '_terminal', [undefined], inputStream.intervalFrom(inputStream.pos)));
    return true;
  } else {
    state.recordFailure(inputStream.pos, this);
    return false;
  }
};

pexprs.fail.eval = function(state) {
  var inputStream = state.inputStream;
  state.recordFailure(inputStream.pos, this);
  return false;
};

pexprs.Prim.prototype.eval = function(state) {
  skipSpacesIfAppropriate(state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.match(inputStream) === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(new Node(state.grammar, '_terminal', [this.obj], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj);
};

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.RegExpPrim.prototype.eval = function(state) {
  skipSpacesIfAppropriate(state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(
        new Node(state.grammar, '_terminal', [inputStream.source[origPos]], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.Alt.prototype.eval = function(state) {
  skipSpacesIfAppropriate(state);
  var bindings = state.bindings;
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origNumBindings = bindings.length;
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (this.terms[idx].eval(state)) {
      return true;
    } else {
      inputStream.pos = origPos;
      bindings.length = origNumBindings;
    }
  }
  return false;
};

pexprs.Seq.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origNumBindings = state.bindings.length;
  for (var idx = 0; idx < this.factors.length; idx++) {
    skipSpacesIfAppropriate(state);
    var factor = this.factors[idx];
    if (!factor.eval(state)) {
      state.bindings.length = origNumBindings;
      return false;
    }
  }
  return true;
};

pexprs.Many.prototype.eval = function(state) {
  var arity = this.getArity();
  if (arity === 0) {
    // TODO: make this a static check w/ a nice error message, then remove the dynamic check.
    // cf. pexprs-check.js for Many
    throw 'fix me!';
  }

  var columns = common.repeatFn(function() { return []; }, arity);
  var numMatches = 0;
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  while (true) {
    var backtrackPos = inputStream.pos;
    skipSpacesIfAppropriate(state);
    if (this.expr.eval(state)) {
      numMatches++;
      var row = state.bindings.splice(state.bindings.length - arity, arity);
      for (var idx = 0; idx < row.length; idx++) {
        columns[idx].push(row[idx]);
      }
    } else {
      inputStream.pos = backtrackPos;
      break;
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  } else {
    for (var idx = 0; idx < columns.length; idx++) {
      state.bindings.push(new Node(state.grammar, '_list', columns[idx], inputStream.intervalFrom(origPos)));
    }
    return true;
  }
};

pexprs.Opt.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var row;
  if (this.expr.eval(state)) {
    row = state.bindings.splice(state.bindings.length - arity, arity);
  } else {
    inputStream.pos = origPos;
    row = common.repeat(new Node(state.grammar, '_terminal', [undefined], inputStream.intervalFrom(origPos)), arity);
  }
  for (var idx = 0; idx < arity; idx++) {
    state.bindings.push(row[idx]);
  }
  return true;
};

pexprs.Not.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origFailureDescriptor = state.failureDescriptor;
  var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
  var ans = this.expr.eval(state);
  state.failureDescriptor = origFailureDescriptor;
  if (ans) {
    state.recordFailure(origPos, this);
    state.bindings.length -= this.getArity();
    ans = false;
  } else {
    inputStream.pos = origPos;
    ans = true;
  }
  return ans;
};

pexprs.Lookahead.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.expr.eval(state)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Arr.prototype.eval = function(state) {
  skipSpacesIfAppropriate(state);
  var inputStream = state.inputStream;
  var obj = inputStream.next();
  if (obj instanceof Array) {
    var objInputStream = InputStream.newFor(obj);
    state.pushInputStream(objInputStream);
    var ans = this.expr.eval(state) && atEnd(state);
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  skipSpacesIfAppropriate(state);
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      if (!obj.hasOwnProperty(property.name)) {
        return false;
      }
      var value = obj[property.name];
      var valueInputStream = InputStream.newFor(typeof value === 'string' ? value : [value]);
      state.pushInputStream(valueInputStream);
      var matched = property.pattern.eval(state) && atEnd(state);
      state.popInputStream();
      if (!matched) {
        return false;
      }
      numOwnPropertiesMatched++;
    }
    if (this.isLenient) {
      var remainder = {};
      for (var p in obj) {
        if (obj.hasOwnProperty(p) && this.properties.indexOf(p) < 0) {
          remainder[p] = obj[p];
        }
      }
      state.bindings.push(new Node(state.grammar, '_terminal', [remainder], inputStream.intervalFrom(origPos)));
      return true;
    } else {
      return numOwnPropertiesMatched === Object.keys(obj).length;
    }
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function(state) {
  function useMemoizedResult(memoRecOrLR) {
    inputStream.pos = memoRecOrLR.pos;
    if (memoRecOrLR.failureDescriptor) {
      state.recordFailures(memoRecOrLR.failureDescriptor);
    }
    if (memoRecOrLR.value) {
      bindings.push(memoRecOrLR.value);
      return true;
    } else {
      return false;
    }
  }

  var ruleName = this.ruleName;

  if (common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }

  var grammar = state.grammar;
  var bindings = state.bindings;
  var inputStream = state.inputStream;
  var origPosInfo = state.getCurrentPosInfo();

  var memoRec = origPosInfo.memo[ruleName];
  if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
    return useMemoizedResult(memoRec);
  } else if (origPosInfo.isActive(ruleName)) {
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR && currentLR.name === ruleName) {
      origPosInfo.updateInvolvedRules();
      return useMemoizedResult(currentLR);
    } else {
      origPosInfo.startLeftRecursion(ruleName);
      return false;
    }
  } else {
    var body = grammar.ruleDict[ruleName];
    if (!body) {
      // TODO: make this a "static" check
      throw new errors.UndeclaredRule(ruleName);
    }
    var origPos = inputStream.pos;
    var origFailureDescriptor = state.failureDescriptor;
    var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
    origPosInfo.enter(ruleName);
    var value = this.evalOnce(body, state);
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, state, origPos, currentLR, value);
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value, involvedRules: currentLR.involvedRules};
        origPosInfo.endLeftRecursion(ruleName);
      } else if (!currentLR.involvedRules[ruleName]) {
        // Only memoize if this rule is not involved in the current left recursion
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
      }
    } else {
      origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
    }
    if (origPosInfo.memo[ruleName]) {
      origPosInfo.memo[ruleName].failureDescriptor = newFailureDescriptor;
    }
    var ans;
    if (value) {
      bindings.push(value);
      if (state.ruleStack.length === 1) {
        if (common.isSyntactic(ruleName)) {
          skipSpaces(state);
        }
        ans = pexprs.end.eval(state);
        bindings.pop();
      } else {
        ans = true;
      }
    } else {
      ans = false;
    }

    if (body.description) {
      if (value) {
        newFailureDescriptor.pos = -1;  // so that the failures are ignored
      } else if (newFailureDescriptor.pos <= origPos) {
        newFailureDescriptor.pos = origPos;
        newFailureDescriptor.exprs = [this];
      }
    }
/*
    Here's the Brian Ford version (what he describes in his Master's thesis):

    if (body.description && newFailureDescriptor.pos === origPos) {
      newFailureDescriptor.pos = origPos;
      newFailureDescriptor.exprs = [this];
    }
*/

    state.failureDescriptor = origFailureDescriptor;
    state.recordFailures(newFailureDescriptor);
    origPosInfo.exit();
    return ans;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (expr.eval(state)) {
    var arity = expr.getArity();
    var bindings = state.bindings.splice(state.bindings.length - arity, arity);
    var ans = new Node(state.grammar, this.ruleName, bindings, inputStream.intervalFrom(origPos));
    return ans;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.handleLeftRecursion = function(body, state, origPos, currentLR, seedValue) {
  if (!seedValue) {
    return seedValue;
  }

  var value = seedValue;
  currentLR.value = seedValue;
  currentLR.pos = state.inputStream.pos;
  var inputStream = state.inputStream;
  while (true) {
    inputStream.pos = origPos;
    value = this.evalOnce(body, state);
    if (value && inputStream.pos > currentLR.pos) {
      currentLR.value = value;
      currentLR.pos = inputStream.pos;
    } else {
      value = currentLR.value;
      inputStream.pos = currentLR.pos;
      break;
    }
  }
  return value;
};

