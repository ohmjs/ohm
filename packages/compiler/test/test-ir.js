import test from 'ava';
import * as ir from '../src/ir.ts';

// Helper: build a rules map from an object of {name: body} pairs.
// All rules are treated as lexical (non-syntactic) by default.
function makeRules(obj) {
  const map = new Map();
  for (const [name, body] of Object.entries(obj)) {
    map.set(name, {body});
  }
  return map;
}

// --- computeFirstChars ---

test('computeFirstChars: terminal', t => {
  const rules = makeRules({});
  t.deepEqual(ir.computeFirstChars(ir.terminal('abc'), rules), new Set([97])); // 'a'
});

test('computeFirstChars: empty terminal returns null', t => {
  const rules = makeRules({});
  t.is(ir.computeFirstChars(ir.terminal(''), rules), null);
});

test('computeFirstChars: Alt unions children', t => {
  const rules = makeRules({});
  const expr = ir.alt([ir.terminal('a'), ir.terminal('b'), ir.terminal('c')]);
  t.deepEqual(ir.computeFirstChars(expr, rules), new Set([97, 98, 99]));
});

test('computeFirstChars: Alt returns null if any child is unknown', t => {
  const rules = makeRules({});
  const expr = ir.alt([ir.terminal('a'), ir.any()]);
  t.is(ir.computeFirstChars(expr, rules), null);
});

test('computeFirstChars: Alt early cutoff when exceeding limit', t => {
  const rules = makeRules({});
  // 3 distinct chars, but limit is 2 — should bail early.
  const expr = ir.alt([ir.terminal('a'), ir.terminal('b'), ir.terminal('c')]);
  t.is(ir.computeFirstChars(expr, rules, new Map(), new Set(), 2), null);
});

test('computeFirstChars: Seq returns first child chars', t => {
  const rules = makeRules({});
  const expr = ir.seq([ir.terminal('x'), ir.terminal('y')]);
  t.deepEqual(ir.computeFirstChars(expr, rules), new Set([120])); // 'x'
});

test('computeFirstChars: empty Seq returns null', t => {
  const rules = makeRules({});
  t.is(ir.computeFirstChars(ir.seq([]), rules), null);
});

test('computeFirstChars: Apply follows rule body', t => {
  const rules = makeRules({foo: ir.terminal('z')});
  t.deepEqual(ir.computeFirstChars(ir.apply('foo'), rules), new Set([122])); // 'z'
});

test('computeFirstChars: Apply caches results', t => {
  const rules = makeRules({foo: ir.terminal('z')});
  const cache = new Map();
  ir.computeFirstChars(ir.apply('foo'), rules, cache);
  t.true(cache.has('foo'));
  t.deepEqual(cache.get('foo'), new Set([122]));

  // Second call reuses cache (coverage — no observable difference, but
  // we can verify the cached value is returned).
  t.deepEqual(ir.computeFirstChars(ir.apply('foo'), rules, cache), new Set([122]));
});

test('computeFirstChars: recursive rule returns null', t => {
  // foo = foo (direct left recursion)
  const rules = makeRules({foo: ir.apply('foo')});
  t.is(ir.computeFirstChars(ir.apply('foo'), rules), null);
});

test('computeFirstChars: unknown rule returns null', t => {
  const rules = makeRules({});
  t.is(ir.computeFirstChars(ir.apply('missing'), rules), null);
});

test('computeFirstChars: Lex is transparent', t => {
  const rules = makeRules({});
  const expr = ir.lex(ir.terminal('q'));
  t.deepEqual(ir.computeFirstChars(expr, rules), new Set([113]));
});

test('computeFirstChars: Plus is transparent', t => {
  const rules = makeRules({});
  const expr = ir.plus(ir.terminal('q'));
  t.deepEqual(ir.computeFirstChars(expr, rules), new Set([113]));
});

test('computeFirstChars: Any, Range, End return null', t => {
  const rules = makeRules({});
  t.is(ir.computeFirstChars(ir.any(), rules), null);
  t.is(ir.computeFirstChars(ir.range(48, 57), rules), null);
  t.is(ir.computeFirstChars(ir.end(), rules), null);
});

// --- optimize (GuardedIter lowering) ---

test('optimize: (~"x" any)* becomes GuardedIter', t => {
  const body = ir.star(ir.seq([ir.not(ir.terminal('x')), ir.any()]));
  const rules = new Map([['r', {body}]]);
  ir.optimize(rules);
  const result = rules.get('r').body;
  t.is(result.type, 'GuardedIter');
  t.deepEqual(result.guardChars, [120]); // 'x'
  t.false(result.isPlus);
});

test('optimize: (~"x" any)+ becomes GuardedIter with isPlus', t => {
  const body = ir.plus(ir.seq([ir.not(ir.terminal('x')), ir.any()]));
  const rules = new Map([['r', {body}]]);
  ir.optimize(rules);
  const result = rules.get('r').body;
  t.is(result.type, 'GuardedIter');
  t.true(result.isPlus);
});

test('optimize: guardChars are sorted', t => {
  // Delimiter is "b" | "a" — guard chars should be sorted [97, 98] not insertion order.
  const delim = ir.alt([ir.terminal('b'), ir.terminal('a')]);
  const body = ir.star(ir.seq([ir.not(delim), ir.any()]));
  const rules = new Map([['r', {body}]]);
  ir.optimize(rules);
  const result = rules.get('r').body;
  t.is(result.type, 'GuardedIter');
  t.deepEqual(result.guardChars, [97, 98]); // sorted: 'a' < 'b'
});

test('optimize: syntactic rules are not guarded', t => {
  const body = ir.star(ir.seq([ir.not(ir.terminal('x')), ir.any()]));
  const rules = new Map([['R', {body, isSyntactic: true}]]);
  ir.optimize(rules);
  t.is(rules.get('R').body.type, 'Star'); // not GuardedIter
});

test('optimize: Lex inside syntactic rule enables guarding', t => {
  const inner = ir.star(ir.seq([ir.not(ir.terminal('x')), ir.any()]));
  const body = ir.lex(inner);
  const rules = new Map([['R', {body, isSyntactic: true}]]);
  ir.optimize(rules);
  const lexChild = rules.get('R').body.child;
  t.is(lexChild.type, 'GuardedIter');
});

test('optimize: delimiter with too many first chars is not guarded', t => {
  // Build an Alt with 9 distinct single-char terminals (exceeds MAX_GUARD_CHARS=8).
  const terms = 'abcdefghi'.split('').map(c => ir.terminal(c));
  const delim = ir.alt(terms);
  const body = ir.star(ir.seq([ir.not(delim), ir.any()]));
  const rules = new Map([['r', {body}]]);
  ir.optimize(rules);
  t.is(rules.get('r').body.type, 'Star');
});

test('optimize: non (~delim any) patterns are not guarded', t => {
  // (~"x" letter)* — second element is not `any`
  const body = ir.star(ir.seq([ir.not(ir.terminal('x')), ir.apply('letter')]));
  const rules = new Map([['r', {body}]]);
  ir.optimize(rules);
  t.is(rules.get('r').body.type, 'Star');
});

test('optimize: delimiter via rule application', t => {
  // r = (~delim any)*, delim = "x" | "y"
  const delimBody = ir.alt([ir.terminal('x'), ir.terminal('y')]);
  const body = ir.star(ir.seq([ir.not(ir.apply('delim')), ir.any()]));
  const rules = new Map([
    ['r', {body}],
    ['delim', {body: delimBody}],
  ]);
  ir.optimize(rules);
  const result = rules.get('r').body;
  t.is(result.type, 'GuardedIter');
  t.deepEqual(result.guardChars, [120, 121]); // 'x', 'y'
});

test('optimize: shared cache across rules', t => {
  // Two rules referencing the same delimiter — cache should be shared.
  const delimBody = ir.terminal('$');
  const body1 = ir.star(ir.seq([ir.not(ir.apply('delim')), ir.any()]));
  const body2 = ir.star(ir.seq([ir.not(ir.apply('delim')), ir.any()]));
  const rules = new Map([
    ['r1', {body: body1}],
    ['r2', {body: body2}],
    ['delim', {body: delimBody}],
  ]);
  ir.optimize(rules);
  // Both should be optimized.
  t.is(rules.get('r1').body.type, 'GuardedIter');
  t.is(rules.get('r2').body.type, 'GuardedIter');
});
