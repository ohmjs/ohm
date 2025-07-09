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
  | MunchUntil
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
}

export const alt = (children: Expr[]): Alt => ({type: 'Alt', children});

export interface Any {
  type: 'Any';
}

export const any = (): Any => ({type: 'Any'});

export interface Apply {
  type: 'Apply';
  ruleName: string;
  children: (Apply | Param)[];
}

export const apply = (ruleName: string, children: (Apply | Param)[] = []): Apply => ({
  type: 'Apply',
  ruleName,
  children
});

export interface ApplyGeneralized {
  type: 'ApplyGeneralized';
  ruleName: string;
  caseIdx: number;
}

export const applyGeneralized = (ruleName: string, caseIdx: number): ApplyGeneralized => ({
  type: 'ApplyGeneralized',
  ruleName,
  caseIdx
});

export interface CaseInsensitive {
  type: 'CaseInsensitive';
  value: string;
}

export const caseInsensitive = (value: string): CaseInsensitive => ({
  type: 'CaseInsensitive',
  value
});

export interface Dispatch {
  type: 'Dispatch';
  child: Expr;
  patterns: Expr[][];
}

export const dispatch = (child: Apply | Param, patterns: Expr[][]): Dispatch => ({
  type: 'Dispatch',
  child,
  patterns
});

// TODO: Eliminate this, and replace with Not(Any())?
export interface End {
  type: 'End';
}

export const end = (): End => ({type: 'End'});

export interface Lex {
  type: 'Lex';
  child: Expr;
}

export const lex = (child: Expr): Lex => ({type: 'Lex', child});

// TODO: Eliminate this, and replace with Not(Not(...))?
export interface Lookahead {
  type: 'Lookahead';
  child: Expr;
}

export const lookahead = (child: Expr): Lookahead => ({type: 'Lookahead', child});

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

export interface MunchUntil {
  type: 'MunchUntil';
  value: string;
}

export const munchUntil = (value: string): MunchUntil => ({type: 'MunchUntil', value});

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
}

export const seq = (children: Expr[]): Seq => ({type: 'Seq', children});

export interface Star {
  type: 'Star';
  child: Expr;
}

export const star = (child: Expr): Star => ({type: 'Star', child});

export interface Terminal {
  type: 'Terminal';
  value: string;
}

export const terminal = (value: string): Terminal => ({type: 'Terminal', value});

export interface UnicodeChar {
  type: 'UnicodeChar';
  value: string;
}

export const unicodeChar = (value: string): UnicodeChar => ({type: 'UnicodeChar', value});

// Types that are specific to the IR

export interface LiftedTerminal {
  type: 'LiftedTerminal';
  terminalId: number;
  value: string;
}

export const liftedTerminal = (terminalId: number, value: string): LiftedTerminal => ({
  type: 'LiftedTerminal',
  terminalId,
  value
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

export function collectParams(exp: Expr, seen = new Set<number>()) {
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

export function substituteParams(exp: Expr, actuals: Expr[]) {
  switch (exp.type) {
    case 'Param':
      return checkNotNull(actuals[exp.index]);
    case 'Apply':
      if (exp.children.length === 0) return exp;
      return apply(
        exp.ruleName,
        exp.children.map(c => substituteParams(c, actuals))
      );
    case 'Dispatch':
      return dispatch(substituteParams(exp.child, actuals), exp.patterns);
    case 'Alt':
    case 'Seq':
      return {
        type: exp.type,
        children: exp.children.map(c => substituteParams(c, actuals))
      };
    case 'Lex':
    case 'Lookahead':
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'Star':
      return {type: exp.type, child: substituteParams(exp.child, actuals)};
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
    case 'Seq':
      return {type: exp.type, children: exp.children.map((e: Expr) => rewrite(e, actions))};
    case 'Any':
    case 'Apply':
    case 'ApplyGeneralized':
    case 'CaseInsensitive':
    case 'End':
    case 'LiftedTerminal':
    case 'MunchUntil':
    case 'Param':
    case 'Range':
    case 'Terminal':
    case 'UnicodeChar':
      return exp;
    case 'Dispatch':
    case 'Lex':
    case 'Lookahead':
    case 'Not':
    case 'Opt':
    case 'Plus':
    case 'Star':
      return {...exp, child: rewrite(exp.child, actions)};
    default:
      unreachable(exp, `not handled: ${exp}`);
  }
}

export function toString(exp: Expr) {
  switch (exp.type) {
    case 'Alt':
      return `(${exp.children.map(toString).join('|')})`;
    case 'Seq':
      return `(${exp.children.map(toString).join(' ')})`;
    case 'Any':
      return 'Any()';
    case 'Apply': {
      const args = exp.children.map(toString);
      return exp.ruleName + (args.length > 0 ? `<${args.join(',')}>` : '');
    }
    case 'ApplyGeneralized':
      return `ApplyGeneralized(${JSON.stringify(exp.ruleName)}, ${exp.caseIdx})`;
    case 'CaseInsensitive':
      return `caseInsensitive<${exp.value}>`;
    case 'End':
      return 'End()';
    case 'LiftedTerminal':
      return `$term$${exp.terminalId}`;
    case 'Param':
      return `$${exp.index}`;
    case 'Range':
      return `${JSON.stringify(exp.lo)}..${JSON.stringify(exp.hi)}`;
    case 'Terminal':
      return JSON.stringify(exp.value);
    case 'UnicodeChar':
      return exp;
    case 'Dispatch':
      return `Dispatch<${toString(exp.child)}>`;
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
