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

function atEnd(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  return state.inputStream.atEnd();
}

var applySpaces_ = new pexprs.Apply('spaces_');

function skipSpacesIfAppropriate(recordFailures, state) {
  var ruleName = state.ruleStack[state.ruleStack.length - 1] || '';
  if (typeof state.inputStream.source === 'string' && common.isSyntactic(ruleName)) {
    skipSpaces(recordFailures, state);
  }
}

// TODO: This method shouldn't just ignore its recordFailures argument.
// The thing is that it's annoying to have the "expected" errors include "space".
// But it would be nice to be able to generate nice errors for, e.g., the closing "*/"
// in a C-style comment, if it's missing. Which just using "false" for recordFailures
// won't do.
function skipSpaces(recordFailures, state) {
  applySpaces_.eval(false, state);
  state.bindings.pop();
}

// The contract of PExpr.prototype.eval:
// * When the return value is true:
//   -- bindings will have expr.arity more elements than before
// * When the return value is false:
//   -- bindings will have exactly the same number of elements as before
//   -- position could be anywhere

pexprs.PExpr.prototype.eval = common.abstract;

pexprs.anything.eval = function(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail) {
    if (recordFailures) {
      state.recordFailure(origPos, this);
    }
    return false;
  } else {
    state.bindings.push(new Node(state.grammar, '_terminal',  [value], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.end.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  if (atEnd(recordFailures, state)) {
    state.bindings.push(new Node(state.grammar, '_terminal', [undefined], inputStream.intervalFrom(inputStream.pos)));
    return true;
  } else {
    if (recordFailures) {
      state.recordFailure(inputStream.pos, this);
    }
    return false;
  }
};

pexprs.fail.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  if (recordFailures) {
    state.recordFailure(inputStream.pos, this);
  }
  return false;
};

pexprs.Prim.prototype.eval = function(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.match(inputStream) === common.fail) {
    if (recordFailures) {
      state.recordFailure(origPos, this);
    }
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

pexprs.RegExpPrim.prototype.eval = function(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    if (recordFailures) {
      state.recordFailure(origPos, this);
    }
    return false;
  } else {
    state.bindings.push(
        new Node(state.grammar, '_terminal', [inputStream.source[origPos]], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.Alt.prototype.eval = function(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  var bindings = state.bindings;
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origNumBindings = bindings.length;
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (this.terms[idx].eval(recordFailures, state)) {
      return true;
    } else {
      inputStream.pos = origPos;
      bindings.length = origNumBindings;
    }
  }
  return false;
};

pexprs.Seq.prototype.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  var origNumBindings = state.bindings.length;
  for (var idx = 0; idx < this.factors.length; idx++) {
    skipSpacesIfAppropriate(recordFailures, state);
    var factor = this.factors[idx];
    if (!factor.eval(recordFailures, state)) {
      state.bindings.length = origNumBindings;
      return false;
    }
  }
  return true;
};

pexprs.Many.prototype.eval = function(recordFailures, state) {
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
    skipSpacesIfAppropriate(recordFailures, state);
    if (this.expr.eval(recordFailures, state)) {
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

pexprs.Opt.prototype.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var row;
  if (this.expr.eval(recordFailures, state)) {
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

pexprs.Not.prototype.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.expr.eval(false, state)) {
    if (recordFailures) {
      state.recordFailure(origPos, this);
    }
    state.bindings.length -= this.getArity();
    return false;
  } else {
    inputStream.pos = origPos;
    return true;
  }
};

pexprs.Lookahead.prototype.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.expr.eval(recordFailures, state)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Listy.prototype.eval = function(recordFailures, state) {
  skipSpacesIfAppropriate(recordFailures, state);
  var inputStream = state.inputStream;
  var obj = inputStream.next();
  if (obj instanceof Array || typeof obj === 'string') {
    var objInputStream = InputStream.newFor(obj);
    state.pushInputStream(objInputStream);
    var ans = this.expr.eval(false, state) && atEnd(recordFailures, state);
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype.eval = function(recordFailures, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  skipSpacesIfAppropriate(recordFailures, state);
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      if (!obj.hasOwnProperty(property.name)) {
        return false;
      }
      var value = obj[property.name];
      var valueInputStream = InputStream.newFor([value]);
      state.pushInputStream(valueInputStream);
      var matched = property.pattern.eval(false, state) && atEnd(recordFailures, state);
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

pexprs.Apply.prototype.eval = function(recordFailures, state) {
  function useMemoizedResult(memoRecOrLR) {
    inputStream.pos = memoRecOrLR.pos;
    if (memoRecOrLR.value) {
      bindings.push(memoRecOrLR.value);
      return true;
    } else {
      return false;
    }
  }

  if (common.isSyntactic(this.ruleName)) {
    skipSpaces(recordFailures, state);
  }

  var ruleName = this.ruleName;
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
      throw new errors.UndeclaredRule(ruleName);
    }
    var origPos = inputStream.pos;
    origPosInfo.enter(ruleName);
    var rf = recordFailures && !body.description;
    var value = this.evalOnce(body, rf, state);
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, rf, state, origPos, currentLR, value);
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value, involvedRules: currentLR.involvedRules};
        origPosInfo.endLeftRecursion(ruleName);
      } else if (!currentLR.involvedRules[ruleName]) {
        // Only memoize if this rule is not involved in the current left recursion
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
      }
    } else {
      origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
    }
    var ans;
    if (value) {
      bindings.push(value);
      ans = true;
    } else {
      if (recordFailures && body.description) {
        inputStream.pos = origPos;
        state.recordFailure(inputStream.pos, this);
      }
      ans = false;
    }
    origPosInfo.exit();
    return ans;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, recordFailures, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (expr.eval(recordFailures, state)) {
    var arity = expr.getArity();
    var bindings = state.bindings.splice(state.bindings.length - arity, arity);
    var ans = new Node(state.grammar, this.ruleName, bindings, inputStream.intervalFrom(origPos));
    return ans;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.handleLeftRecursion = function(body, recordFailures, state, origPos, currentLR, seedValue) {
  if (!seedValue) {
    return seedValue;
  }

  var value = seedValue;
  currentLR.value = seedValue;
  currentLR.pos = state.inputStream.pos;
  var inputStream = state.inputStream;
  while (true) {
    inputStream.pos = origPos;
    value = this.evalOnce(body, recordFailures, state);
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

