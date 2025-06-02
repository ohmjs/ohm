class Matcher {
  constructor(rules) {
    this.rules = rules;
  }

  match(input) {
    this.input = input;
    this.pos = 0;
    this.memoTable = [];
    const cst = new RuleApplication('start').eval(this);
    if (this.pos === this.input.length) {
      return cst;
    }
    return null;
  }

  memoTableAt(pos) {
    let memo = this.memoTable[pos];
    if (!memo) {
      // Lazily initialize the memo column.
      memo = this.memoTable[pos] = {};
    }
    return memo;
  }

  hasMemoizedResult(ruleName) {
    return !!this.memoTableAt(this.pos)[ruleName];
  }

  memoizeResult(ruleName, pos, cst) {
    const result = {cst, nextPos: this.pos};
    this.memoTableAt(pos)[ruleName] = result;
    return result;
  }

  useMemoizedResult(ruleName) {
    const result = this.memoTableAt(this.pos)[ruleName];
    // Unconditionally set the position. If it was a failure, `result.cst`
    // is `null` and the assignment to `this.pos` is a noop.
    this.pos = result.nextPos;
    if ('used' in result) {
      result.used = true; // this result is a left recursion failure!
    }
    return result.cst;
  }

  memoizeLRFailureAtCurrPos(ruleName) {
    const lrFailure = {cst: null, nextPos: -1, used: false};
    this.memoTableAt(this.pos)[ruleName] = lrFailure;
    return lrFailure;
  }

  consume(c) {
    if (this.input[this.pos] === c) {
      this.pos++;
      return true;
    }
    return false;
  }
}

class RuleApplication {
  constructor(ruleName) {
    this.ruleName = ruleName;
  }

  eval(matcher) {
    if (matcher.hasMemoizedResult(this.ruleName)) {
      return matcher.useMemoizedResult(this.ruleName);
    }
    const origPos = matcher.pos;
    const lrFailure = matcher.memoizeLRFailureAtCurrPos(this.ruleName);
    let cst = matcher.rules[this.ruleName].eval(matcher);
    const result = matcher.memoizeResult(this.ruleName, origPos, cst);
    if (lrFailure.used) {
      do {
        result.cst = cst;
        result.nextPos = matcher.pos;
        matcher.pos = origPos;
        cst = matcher.rules[this.ruleName].eval(matcher);
      } while (cst !== null && matcher.pos > result.nextPos);
      matcher.pos = result.nextPos;
    }
    return result.cst;
  }
}

class Terminal {
  constructor(str) {
    this.str = str;
  }

  eval(matcher) {
    for (let i = 0; i < this.str.length; i++) {
      if (!matcher.consume(this.str[i])) {
        return null;
      }
    }
    return this.str;
  }
}

class Choice {
  constructor(exps) {
    this.exps = exps;
  }

  eval(matcher) {
    const origPos = matcher.pos;
    for (let i = 0; i < this.exps.length; i++) {
      matcher.pos = origPos;
      const cst = this.exps[i].eval(matcher);
      if (cst !== null) {
        return cst;
      }
    }
    return null;
  }
}

class Sequence {
  constructor(exps) {
    this.exps = exps;
  }

  eval(matcher) {
    const ans = [];
    for (let i = 0; i < this.exps.length; i++) {
      const exp = this.exps[i];
      const cst = exp.eval(matcher);
      if (cst === null) {
        return null;
      }
      if (!(exp instanceof Not)) {
        ans.push(cst);
      }
    }
    return ans;
  }
}

class Not {
  constructor(exp) {
    this.exp = exp;
  }

  eval(matcher) {
    const origPos = matcher.pos;
    if (this.exp.eval(matcher) === null) {
      matcher.pos = origPos;
      return true;
    }
    return null;
  }
}

class Repetition {
  constructor(exp) {
    this.exp = exp;
  }

  eval(matcher) {
    const ans = [];
    while (true) {
      const origPos = matcher.pos;
      const cst = this.exp.eval(matcher);
      if (cst === null) {
        matcher.pos = origPos;
        break;
      } else {
        ans.push(cst);
      }
    }
    return ans;
  }
}

export {Matcher, RuleApplication, Terminal, Choice, Sequence, Not, Repetition};
