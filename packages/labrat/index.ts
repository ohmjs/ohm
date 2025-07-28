interface PExpr {
  eval(matcher: Matcher): CstNode;
}

type RuleDict = {
  [name: string]: PExpr;
};

type CstNode = string | true | null | CstNode[];

interface MemoRec {
  cst: CstNode;
  nextPos: number;
  used?: boolean;
}

type MemoCol = {[key: string]: MemoRec};

class Matcher {
  rules: RuleDict;
  input: string = '';
  pos: number = 0;
  memoTable: MemoCol[] = [];

  constructor(rules: RuleDict) {
    this.rules = rules;
  }

  match(input: string): CstNode {
    this.input = input;
    this.pos = 0;
    this.memoTable = [];
    const cst = new RuleApplication('start').eval(this);
    if (this.pos === this.input.length) {
      return cst;
    }
    return null;
  }

  memoTableAt(pos: number): MemoCol {
    let memo = this.memoTable[pos];
    if (!memo) {
      // Lazily initialize the memo column.
      memo = this.memoTable[pos] = {};
    }
    return memo;
  }

  hasMemoizedResult(ruleName: string) {
    return !!this.memoTableAt(this.pos)[ruleName];
  }

  memoizeResult(ruleName: string, pos: number, cst: CstNode): MemoRec {
    const result = {cst, nextPos: this.pos};
    this.memoTableAt(pos)[ruleName] = result;
    return result;
  }

  useMemoizedResult(ruleName: string) {
    const result = this.memoTableAt(this.pos)[ruleName];
    // Unconditionally set the position. If it was a failure, `result.cst`
    // is `null` and the assignment to `this.pos` is a noop.
    this.pos = result.nextPos;
    if ('used' in result) {
      result.used = true; // this result is a left recursion failure!
    }
    return result.cst;
  }

  memoizeLRFailureAtCurrPos(ruleName: string) {
    const lrFailure = {cst: null, nextPos: -1, used: false};
    this.memoTableAt(this.pos)[ruleName] = lrFailure;
    return lrFailure;
  }

  consume(c: string) {
    if (this.input[this.pos] === c) {
      this.pos++;
      return true;
    }
    return false;
  }
}

class RuleApplication implements PExpr {
  ruleName: string;

  constructor(ruleName: string) {
    this.ruleName = ruleName;
  }

  eval(matcher: Matcher) {
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

class Terminal implements PExpr {
  str: string;

  constructor(str: string) {
    this.str = str;
  }

  eval(matcher: Matcher) {
    for (let i = 0; i < this.str.length; i++) {
      if (!matcher.consume(this.str[i])) {
        return null;
      }
    }
    return this.str;
  }
}

class Choice implements PExpr {
  exps: PExpr[];

  constructor(exps: PExpr[]) {
    this.exps = exps;
  }

  eval(matcher: Matcher) {
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

class Sequence implements PExpr {
  exps: PExpr[];

  constructor(exps: PExpr[]) {
    this.exps = exps;
  }

  eval(matcher: Matcher) {
    const ans: CstNode = [];
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

class Not implements PExpr {
  exp: PExpr;

  constructor(exp: PExpr) {
    this.exp = exp;
  }

  eval(matcher: Matcher) {
    const origPos = matcher.pos;
    if (this.exp.eval(matcher) === null) {
      matcher.pos = origPos;
      return true;
    }
    return null;
  }
}

class Repetition implements PExpr {
  exp: PExpr;

  constructor(exp: PExpr) {
    this.exp = exp;
  }

  eval(matcher: Matcher) {
    const ans: CstNode = [];
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
