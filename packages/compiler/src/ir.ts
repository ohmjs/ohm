// Types
// -------

export type Expr =
  | Alt
  | Any
  | Apply
  | ApplyGeneralized
  | CaseInsensitive
  | Dispatch
  | End
  | GuardedIter
  | Lex
  | Lookahead
  | Opt
  | Not
  | Param
  | Plus
  | Range
  | RangeIter
  | Seq
  | Star
  | Terminal
  | UnicodeChar;

// A FailableExpr is one that can contribute to the failure message.
// Note: A Param cannot directly fail (only its concrete substitution can).
export type FailableExpr =
  | Any
  | Apply
  | CaseInsensitive
  | End
  | Range
  | Terminal
  | UnicodeChar;

export interface Alt {
  type: 'Alt';
  children: Expr[];
  outArity: number;
}

export const alt = (children: Expr[]): Alt => ({
  type: 'Alt',
  children,
  outArity: outArity(children[0]),
});

export interface Any {
  type: 'Any';
}

export const any = (): Any => ({type: 'Any'});

export interface Apply {
  type: 'Apply';
  ruleName: string;
  descriptionId?: number;
  children: Expr[];
}

export const apply = (
  ruleName: string,
  descriptionId?: number,
  children: Expr[] = []
): Apply => ({
  type: 'Apply',
  ruleName,
  descriptionId,
  children,
});

export interface ApplyGeneralized {
  type: 'ApplyGeneralized';
  ruleName: string;
  caseIdx: number;
}

export const applyGeneralized = (ruleName: string, caseIdx: number): ApplyGeneralized => ({
  type: 'ApplyGeneralized',
  ruleName,
  caseIdx,
});

export interface CaseInsensitive {
  type: 'CaseInsensitive';
  value: string;
}

export const caseInsensitive = (value: string): CaseInsensitive => ({
  type: 'CaseInsensitive',
  value,
});

export interface Dispatch {
  type: 'Dispatch';
  child: Expr;
  patterns: Expr[][];
}

export const dispatch = (child: Apply | Param, patterns: Expr[][]): Dispatch => ({
  type: 'Dispatch',
  child,
  patterns,
});

// TODO: Eliminate this, and replace with Not(Any())?
export interface End {
  type: 'End';
}

export const end = (): End => ({type: 'End'});

// An optimized iteration over `(~delim any)` patterns. The `guardChars` are
// the possible first characters of `delim`; on each iteration, if the current
// char doesn't match any guard char, we skip the full Not evaluation (fast path).
// `guardChars` is kept sorted for deterministic codegen.
export interface GuardedIter {
  type: 'GuardedIter';
  child: Expr; // Always Seq([Not(delim), Any]).
  guardChars: number[];
  isPlus: boolean;
}

export const guardedIter = (
  child: Expr,
  guardChars: number[],
  isPlus: boolean
): GuardedIter => ({
  type: 'GuardedIter',
  child,
  guardChars,
  isPlus,
});

export interface Lex {
  type: 'Lex';
  child: Expr;
  outArity: number;
}

export const lex = (child: Expr): Lex => ({
  type: 'Lex',
  child,
  outArity: outArity(child),
});

// TODO: Eliminate this, and replace with Not(Not(...))?
export interface Lookahead {
  type: 'Lookahead';
  child: Expr;
}

export const lookahead = (child: Expr): Lookahead => ({
  type: 'Lookahead',
  child,
});

export interface Opt {
  type: 'Opt';
  child: Expr;
}

export const opt = (child: Expr): Opt => ({type: 'Opt', child});

export interface Not {
  type: 'Not';
  child: Expr;
}

export const not = (child: Expr): Not => ({type: 'Not', child});

export interface Param {
  type: 'Param';
  index: number;
}

export const param = (index: number): Param => ({type: 'Param', index});

export interface Plus {
  type: 'Plus';
  child: Expr;
}

export const plus = (child: Expr): Plus => ({type: 'Plus', child});

export interface Range {
  type: 'Range';
  lo: number;
  hi: number;
}

export const range = (lo: number, hi: number): Range => ({type: 'Range', lo, hi});

// An optimized iteration over a Range pattern (e.g. "0".."9"* or "0".."9"+).
// Only applies in lexical context (no space skipping).
export interface RangeIter {
  type: 'RangeIter';
  child: Range;
  isPlus: boolean;
}

export const rangeIter = (child: Range, isPlus: boolean): RangeIter => ({
  type: 'RangeIter',
  child,
  isPlus,
});

export interface Seq {
  type: 'Seq';
  children: Expr[];
  outArity: number;
}

export const seq = (children: Expr[]): Seq => ({
  type: 'Seq',
  children,
  outArity: children.reduce((acc, child) => acc + outArity(child), 0),
});

export interface Star {
  type: 'Star';
  child: Expr;
}

export const star = (child: Expr): Star => ({type: 'Star', child});

export interface Terminal {
  type: 'Terminal';
  value: string;
}

export const terminal = (value: string): Terminal => ({
  type: 'Terminal',
  value,
});

export interface UnicodeChar {
  type: 'UnicodeChar';
  categoryOrProp: string;
}

export const unicodeChar = (categoryOrProp: string): UnicodeChar => ({
  type: 'UnicodeChar',
  categoryOrProp,
});

// Helpers
// -------

function unreachable(x: never, msg: string): never {
  throw new Error(msg);
}

function checkNotNull<T>(x: T, msg = 'unexpected null value'): NonNullable<T> {
  if (x == null) throw new Error(msg);
  return x;
}

function checkExprType<T extends Expr['type']>(
  exp: Expr,
  ...types: T[]
): Extract<Expr, {type: T}> {
  if (!types.includes(exp.type as T)) {
    throw new Error(`Expected one of [${types.join(', ')}], but got '${exp.type}'`);
  }
  return exp as Extract<Expr, {type: T}>;
}

export function collectParams(exp: Expr, seen = new Set<number>()): Param[] {
  switch (exp.type) {
    case 'Param':
      if (!seen.has(exp.index)) {
        seen.add(exp.index);
        return [exp];
      }
      return [];
    case 'Alt':
    case 'Apply':
    case 'Seq':
      return exp.children.flatMap(c => collectParams(c, seen));
    case 'Dispatch':
    case 'GuardedIter':
    case 'Lex':
    case 'Lookahead':
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'RangeIter':
    case 'Star':
      return collectParams(exp.child, seen);
    case 'Any':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return [];
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export function substituteParams<T extends Expr>(
  exp: T,
  actuals: Exclude<Expr, Param>[]
): Exclude<Expr, Param> {
  switch (exp.type) {
    case 'Param':
      return checkNotNull(actuals[exp.index]);
    case 'Apply':
      if (exp.children.length === 0) return exp;
      return apply(
        exp.ruleName,
        exp.descriptionId,
        exp.children.map(c => substituteParams(c, actuals))
      );
    case 'Dispatch': {
      const newChild = substituteParams(exp.child, actuals);
      return dispatch(checkExprType(newChild, 'Apply'), exp.patterns);
    }
    case 'Alt':
    case 'Seq':
      return {
        type: exp.type,
        children: exp.children.map(c => substituteParams(c, actuals)),
        outArity: exp.outArity,
      };
    case 'Lex':
      return {
        type: exp.type,
        child: substituteParams(exp.child, actuals),
        outArity: exp.outArity,
      };
    case 'Lookahead':
      return {
        type: exp.type,
        child: substituteParams(exp.child, actuals),
      };
    case 'GuardedIter':
      return guardedIter(substituteParams(exp.child, actuals), exp.guardChars, exp.isPlus);
    case 'RangeIter':
      return rangeIter(substituteParams(exp.child, actuals) as Range, exp.isPlus);
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'Star':
      return {
        type: exp.type,
        child: substituteParams(exp.child, actuals),
      };
    case 'Any':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return exp;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export function specializedName(app: Apply): string {
  const argsNames = app.children
    .map(c => {
      if (c.type === 'Param') throw new Error(`unexpected Param`);
      if (c.type === 'Apply') {
        return specializedName(c);
      }
      return toString(c);
    })
    .join(',');
  return app.ruleName + (argsNames.length > 0 ? `<${argsNames}>` : '');
}

export type ExprType = Expr extends {type: infer U} ? U : never;

export type RewriteActions = {
  [K in ExprType]?: (exp: Extract<Expr, {type: K}>) => Expr;
};

export function rewrite(exp: Expr, actions: RewriteActions): Expr {
  const action = actions[exp.type];
  if (action) {
    return action(exp as any);
  }

  switch (exp.type) {
    case 'Alt':
      return alt(exp.children.map((e: Expr) => rewrite(e, actions)));
    case 'Seq':
      return seq(exp.children.map((e: Expr) => rewrite(e, actions)));
    case 'Any':
    case 'Apply':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return exp;
    case 'Dispatch':
      // We don't use the constructor here, to avoid type checking issues.
      return {type: exp.type, child: rewrite(exp.child, actions), patterns: exp.patterns};
    case 'GuardedIter':
      return guardedIter(rewrite(exp.child, actions), exp.guardChars, exp.isPlus);
    case 'RangeIter':
      return rangeIter(rewrite(exp.child, actions) as Range, exp.isPlus);
    case 'Lex':
      return lex(rewrite(exp.child, actions));
    case 'Lookahead':
      return lookahead(rewrite(exp.child, actions));
    case 'Not':
      return not(rewrite(exp.child, actions));
    case 'Opt':
      return opt(rewrite(exp.child, actions));
    case 'Plus':
      return plus(rewrite(exp.child, actions));
    case 'Star':
      return star(rewrite(exp.child, actions));
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export type VisitActions = {
  [K in ExprType]?: (exp: Extract<Expr, {type: K}>) => void;
};

export function visit(exp: Expr, actions: VisitActions): void {
  const action = actions[exp.type];
  if (action) {
    action(exp as any);
    return;
  }

  switch (exp.type) {
    case 'Alt':
    case 'Seq':
      exp.children.forEach((e: Expr) => visit(e, actions));
      break;
    case 'Any':
    case 'Apply':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      break;
    case 'Dispatch':
    case 'GuardedIter':
    case 'Lex':
    case 'Lookahead':
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'RangeIter':
    case 'Star':
      visit(exp.child, actions);
      break;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export function toString(exp: Expr): string {
  switch (exp.type) {
    case 'Alt':
      return `(${exp.children.map(toString).join(' | ')})`;
    case 'Seq':
      return `(${exp.children.map(toString).join(' ')})`;
    case 'Any':
      return '$any';
    case 'Apply':
      return exp.children.length > 0
        ? `${exp.ruleName}<${exp.children.map(toString).join(',')}>`
        : exp.ruleName;
    case 'ApplyGeneralized':
      return `${exp.ruleName}<#${exp.caseIdx}>`;
    case 'CaseInsensitive':
      return `$caseInsensitive<${JSON.stringify(exp.value)}>`;
    case 'End':
      return '$end';
    case 'Param':
      return `$${exp.index}`;
    case 'Range':
      return `${JSON.stringify(String.fromCodePoint(exp.lo))}..${JSON.stringify(String.fromCodePoint(exp.hi))}`;
    case 'Terminal':
      return JSON.stringify(exp.value);
    case 'UnicodeChar':
      return `$unicodeChar<${JSON.stringify(exp.categoryOrProp)}>`;
    case 'Dispatch':
      return `$dispatch`; // TODO: Improve this.
    case 'GuardedIter':
      return `${toString(exp.child)}${exp.isPlus ? '+' : '*'}[guarded]`;
    case 'RangeIter':
      return `${toString(exp.child)}${exp.isPlus ? '+' : '*'}[rangeIter]`;
    case 'Lex':
      return `#${toString(exp.child)}`;
    case 'Lookahead':
      return `&${toString(exp.child)}`;
    case 'Not':
      return `~${toString(exp.child)}`;
    case 'Opt':
      return `${toString(exp.child)}?`;
    case 'Plus':
      return `${toString(exp.child)}+`;
    case 'Star':
      return `${toString(exp.child)}*`;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

// Returns the number of bindings that `expr` produces in its parent — the
// "out arity" or "upwards arity". Note that there is potential confusion
// with iter nodes: they produce a single binding, but an expression like
// `(letter digit)*` can be said to have "arity 2".
export function outArity(exp: Expr): number {
  switch (exp.type) {
    case 'Alt':
    case 'Seq':
    case 'Lex':
      return exp.outArity;
    case 'Any':
    case 'Apply':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
    case 'Dispatch':
      return 1;
    case 'Lookahead':
    case 'Not':
      return 0;
    case 'GuardedIter':
    case 'Opt':
    case 'Plus':
    case 'RangeIter':
    case 'Star':
      return 1;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

// Returns true if the expression is a leaf node (matched by wrapTerminalLike).
export function isLeaf(expr: Expr): boolean {
  switch (expr.type) {
    case 'Any':
    case 'Terminal':
    case 'Range':
    case 'End':
    case 'UnicodeChar':
    case 'CaseInsensitive':
      return true;
    default:
      return false;
  }
}

// Computes the set of all expressions in the tree that are "failure-safe":
// when they fail, pos and bindings are guaranteed unchanged. Callers of
// failure-safe expressions don't need to save/restore for backtracking.
//
// This does NOT account for implicit space skipping in syntactic context.
// Space skipping can advance pos before the expression is evaluated, so the
// caller must handle that separately.
export function computeFailureSafe(rules: Map<string, {body: Expr}>): Set<Expr> {
  const result = new Set<Expr>();
  const visiting = new Set<string>();

  function check(exp: Expr): boolean {
    switch (exp.type) {
      case 'End':
      case 'UnicodeChar':
        return true;
      case 'Range':
        // BMP ranges check before advancing pos. Supplementary ranges
        // advance pos (past high surrogate) before the range check.
        return exp.hi <= 0xffff;
      case 'Terminal':
        // Single-char terminals check before advancing. Multi-char terminals
        // may advance partway through before a later char fails.
        return exp.value.length <= 1;
      case 'CaseInsensitive':
        return exp.value.length <= 1;
      case 'Not':
      case 'Lookahead':
        // These always save/restore pos and bindings internally.
        return true;
      case 'Apply': {
        const ruleInfo = rules.get(exp.ruleName);
        if (!ruleInfo || visiting.has(exp.ruleName)) return false;
        visiting.add(exp.ruleName);
        const safe = check(ruleInfo.body);
        visiting.delete(exp.ruleName);
        return safe;
      }
      case 'Alt':
        return exp.children.every(check);
      case 'Lex':
        return check(exp.child);
      case 'Plus':
        // Plus fails only when the first iteration fails.
        return check(exp.child);
      case 'Any':
      case 'ApplyGeneralized':
      case 'Dispatch':
      case 'GuardedIter':
      case 'RangeIter':
      case 'Opt':
      case 'Seq':
      case 'Star':
      case 'Param':
        return false;
      default:
        unreachable(exp, `not handled: ${exp}`);
    }
  }

  // Walk every expression in every rule body.
  function markAll(exp: Expr): void {
    if (check(exp)) result.add(exp);
    switch (exp.type) {
      case 'Alt':
      case 'Seq':
        exp.children.forEach(markAll);
        break;
      case 'Dispatch':
      case 'GuardedIter':
      case 'Lex':
      case 'Lookahead':
      case 'Not':
      case 'Opt':
      case 'Plus':
      case 'RangeIter':
      case 'Star':
        markAll(exp.child);
        break;
    }
  }
  for (const {body} of rules.values()) {
    markAll(body);
  }

  return result;
}

// Returns true if `expr` is `Any` or `Apply("any")` — in the grammar,
// `any` is typically lowered as an Apply to the built-in rule, not as
// the `Any` IR node.
export function isAnyExpr(expr: Expr): boolean {
  return expr.type === 'Any' || (expr.type === 'Apply' && expr.ruleName === 'any');
}

// Computes the set of possible first UTF-16 code units that an expression
// can match. Returns null if the set is too broad (e.g. Any, Range).
export function computeFirstChars(
  expr: Expr,
  rules: Map<string, {body: Expr}>,
  cache: Map<string, Set<number> | null> = new Map(),
  visiting: Set<string> = new Set(),
  limit: number = MAX_GUARD_CHARS
): Set<number> | null {
  switch (expr.type) {
    case 'Terminal':
      if (expr.value.length === 0) return null;
      return new Set([expr.value.charCodeAt(0)]);
    case 'Alt': {
      const result = new Set<number>();
      for (const child of expr.children) {
        const childChars = computeFirstChars(child, rules, cache, visiting, limit);
        if (childChars == null) return null;
        for (const c of childChars) result.add(c);
        if (result.size > limit) return null;
      }
      return result;
    }
    case 'Seq':
      return expr.children.length > 0
        ? computeFirstChars(expr.children[0], rules, cache, visiting, limit)
        : null;
    case 'Apply': {
      if (visiting.has(expr.ruleName)) return null;
      if (cache.has(expr.ruleName)) return cache.get(expr.ruleName)!;
      const ruleInfo = rules.get(expr.ruleName);
      if (!ruleInfo) return null;
      visiting.add(expr.ruleName);
      const result = computeFirstChars(ruleInfo.body, rules, cache, visiting, limit);
      visiting.delete(expr.ruleName);
      cache.set(expr.ruleName, result);
      return result;
    }
    case 'Lex':
    case 'Plus':
      return computeFirstChars(expr.child, rules, cache, visiting, limit);
    default:
      return null;
  }
}

const MAX_GUARD_CHARS = 8;

// Detect `(~delim any)` and return the set of first characters of `delim`,
// or null if the pattern doesn't match or the set is too large.
function getNotAnyGuardChars(
  child: Expr,
  rules: Map<string, {body: Expr}>,
  cache: Map<string, Set<number> | null>
): number[] | null {
  if (child.type !== 'Seq') return null;
  const {children} = child;
  if (children.length !== 2) return null;
  if (children[0].type !== 'Not') return null;
  if (!isAnyExpr(children[1])) return null;
  const firstChars = computeFirstChars(children[0].child, rules, cache);
  if (firstChars == null || firstChars.size === 0 || firstChars.size > MAX_GUARD_CHARS)
    return null;
  return [...firstChars].sort((a, b) => a - b);
}

// Rewrite Star/Plus nodes whose child is `(~delim any)` into GuardedIter,
// where the guard optimization applies. Only in lexical context (no space skipping).
function lowerGuardedIters(
  expr: Expr,
  isLexical: boolean,
  rules: Map<string, {body: Expr}>,
  cache: Map<string, Set<number> | null>
): Expr {
  const recur = (e: Expr, lex: boolean) => lowerGuardedIters(e, lex, rules, cache);
  switch (expr.type) {
    case 'Star':
    case 'Plus': {
      const child = recur(expr.child, isLexical);
      if (isLexical) {
        const guardChars = getNotAnyGuardChars(child, rules, cache);
        if (guardChars) return guardedIter(child, guardChars, expr.type === 'Plus');
        if (child.type === 'Range') {
          return rangeIter(child, expr.type === 'Plus');
        }
      }
      return {...expr, child};
    }
    case 'Lex':
      return lex(recur(expr.child, true));
    case 'Alt':
      return alt(expr.children.map(c => recur(c, isLexical)));
    case 'Seq':
      return seq(expr.children.map(c => recur(c, isLexical)));
    case 'Apply':
      if (expr.children.length === 0) return expr;
      return apply(
        expr.ruleName,
        expr.descriptionId,
        expr.children.map(c => recur(c, isLexical))
      );
    case 'Dispatch':
      // Note: patterns are not rewritten here. In practice, Dispatch nodes only
      // appear when EMIT_GENERALIZED_RULES is true (currently disabled), so this
      // is not a real gap. If generalized rules are re-enabled, patterns should
      // be rewritten too.
      return {type: expr.type, child: recur(expr.child, isLexical), patterns: expr.patterns};
    case 'GuardedIter':
      return guardedIter(recur(expr.child, isLexical), expr.guardChars, expr.isPlus);
    case 'RangeIter':
      return rangeIter(recur(expr.child, isLexical) as Range, expr.isPlus);
    case 'Lookahead':
      return lookahead(recur(expr.child, isLexical));
    case 'Not':
      return not(recur(expr.child, isLexical));
    case 'Opt':
      return opt(recur(expr.child, isLexical));
    case 'Any':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return expr;
    default:
      unreachable(expr, `not handled: ${expr}`);
  }
}

// Run optimization passes over all rules, rewriting the IR.
export function optimize(rules: Map<string, {body: Expr; isSyntactic?: boolean}>): void {
  const firstCharCache = new Map<string, Set<number> | null>();
  for (const [name, ruleInfo] of rules) {
    ruleInfo.body = lowerGuardedIters(
      ruleInfo.body,
      !ruleInfo.isSyntactic,
      rules,
      firstCharCache
    );
  }
}
