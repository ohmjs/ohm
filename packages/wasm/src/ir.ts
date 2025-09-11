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
  | Lex
  | LiftedTerminal
  | Lookahead
  | Opt
  | Not
  | Param
  | Plus
  | Range
  | Seq
  | Star
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

type ApplyLike = Extract<Expr, {type: 'Apply' | 'LiftedTerminal' | 'Param'}>;

export interface Apply {
  type: 'Apply';
  ruleName: string;
  children: ApplyLike[];
}

export const apply = (ruleName: string, children: ApplyLike[] = []): Apply => ({
  type: 'Apply',
  ruleName,
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
  outArity: number;
}

export const lookahead = (child: Expr): Lookahead => ({
  type: 'Lookahead',
  child,
  outArity: outArity(child),
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

export const terminal = (value: string, caseInsensitive = false): Terminal => ({
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

// Types that are specific to the IR

export interface LiftedTerminal {
  type: 'LiftedTerminal';
  terminalId: number;
}

export const liftedTerminal = (terminalId: number): LiftedTerminal => ({
  type: 'LiftedTerminal',
  terminalId,
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

function checkApplyLike(exp: Expr): ApplyLike {
  return checkExprType(exp, 'Apply', 'LiftedTerminal', 'Param');
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
    case 'Lex':
    case 'Lookahead':
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'Star':
      return collectParams(exp.child, seen);
    case 'Any':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'LiftedTerminal':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return [];
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

// TODO: Maybe make the types tighter here, to avoid the use checkApplyLike.
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
        exp.children.map((c): ApplyLike => {
          const ans = substituteParams(c, actuals);
          return checkApplyLike(ans);
        })
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
    case 'Lookahead':
      return {
        type: exp.type,
        child: substituteParams(exp.child, actuals),
        outArity: exp.outArity,
      };
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
    case 'LiftedTerminal':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return exp;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export function specializedName(app: Apply | LiftedTerminal): string {
  if (app.type === 'LiftedTerminal') {
    return `$term$${app.terminalId}`;
  }
  const argsNames = app.children
    .map(c => {
      if (c.type === 'Param') throw new Error(`unexpected Param`);
      return specializedName(c);
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
    case 'LiftedTerminal':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return exp;
    case 'Dispatch':
      // We don't use the constructor here, to avoid type checking issues.
      return {type: exp.type, child: rewrite(exp.child, actions), patterns: exp.patterns};
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
    case 'LiftedTerminal':
      return `$term$${exp.terminalId}`;
    case 'Param':
      return `$${exp.index}`;
    case 'Range':
      return `${JSON.stringify(exp.lo)}..${JSON.stringify(exp.hi)}`;
    case 'Terminal':
      return JSON.stringify(exp.value);
    case 'UnicodeChar':
      return `$unicodeChar<${JSON.stringify(exp.categoryOrProp)}>`;
    case 'Dispatch':
      return `$dispatch`; // TODO: Improve this.
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
    case 'Lookahead':
      return exp.outArity;
    case 'Any':
    case 'Apply':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'LiftedTerminal':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
    case 'Dispatch':
      return 1;
    case 'Not':
      return 0;
    case 'Opt':
    case 'Plus':
    case 'Star':
      return 1;
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}
