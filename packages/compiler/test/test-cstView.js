import test from 'ava';
import {readFileSync} from 'node:fs';

import {CstKind} from 'ohm-js/cstView';

import {compileAndLoad, scriptRel} from './_helpers.js';

const jsonSource = readFileSync(scriptRel('../../lang-json/json.ohm'), 'utf-8');

/**
 * Walk the CST via CstView and reconstruct a JS value, exercising unpack,
 * forEachChunk, mapChunks, and the basic accessors (kind, sourceString).
 */
function toJS(cst, handle) {
  const k = cst.kind(handle);
  switch (k) {
    case 'Object_empty':
      return {};

    case 'Object_nonEmpty':
      // "{" Pair ("," Pair)* "}"
      return cst.unpack(handle, (_open, firstPair, restPairs, _close) => {
        const obj = {};
        const [key, val] = parsePair(cst, firstPair);
        obj[key] = val;
        cst.forEachChunk(restPairs, (_comma, pair) => {
          const [k2, v2] = parsePair(cst, pair);
          obj[k2] = v2;
        });
        return obj;
      });

    case 'Array_empty':
      return [];

    case 'Array_nonEmpty':
      // "[" Value ("," Value)* "]"
      return cst.unpack(handle, (_open, firstValue, restValues, _close) => {
        const arr = [toJS(cst, firstValue)];
        cst.forEachChunk(restValues, (_comma, value) => {
          arr.push(toJS(cst, value));
        });
        return arr;
      });

    case 'stringLiteral':
      // "\"" doubleStringCharacter* "\""
      return cst.unpack(handle, (_open, chars, _close) => {
        const parts = cst.mapChunks(chars, char => toJS(cst, char));
        return parts.join('');
      });

    case 'doubleStringCharacter_nonEscaped':
      return cst.sourceString(handle);

    case 'doubleStringCharacter_escaped':
      // "\\" escapeSequence
      return cst.unpack(handle, (_backslash, escSeq) => toJS(cst, escSeq));

    case 'escapeSequence_doubleQuote':
      return '"';
    case 'escapeSequence_reverseSolidus':
      return '\\';
    case 'escapeSequence_solidus':
      return '/';
    case 'escapeSequence_backspace':
      return '\b';
    case 'escapeSequence_formfeed':
      return '\f';
    case 'escapeSequence_newline':
      return '\n';
    case 'escapeSequence_carriageReturn':
      return '\r';
    case 'escapeSequence_horizontalTab':
      return '\t';
    case 'escapeSequence_codePoint':
      // "u" fourHexDigits
      return cst.unpack(handle, (_u, fourHex) => {
        return String.fromCharCode(parseInt(cst.sourceString(fourHex), 16));
      });

    case 'numberLiteral_withExponent':
    case 'numberLiteral_withoutExponent':
    case 'decimal_withFract':
    case 'decimal_withoutFract':
      return Number(cst.sourceString(handle));

    case 'True':
      return true;
    case 'False':
      return false;
    case 'Null':
      return null;

    default:
      // Wrapper nonterminals (Value, Object, Array, String, Number, Pair,
      // doubleStringCharacter, escapeSequence, etc.) — pass through to child.
      if (k === CstKind.Terminal) {
        return cst.sourceString(handle);
      }
      return cst.unpack(handle, (...children) => {
        if (children.length === 1) return toJS(cst, children[0]);
        throw new Error(`Unhandled kind: ${k} with ${children.length} children`);
      });
  }
}

function parsePair(cst, handle) {
  // Pair = String ":" Value
  return cst.unpack(handle, (key, _colon, value) => {
    return [toJS(cst, key), toJS(cst, value)];
  });
}

function parse(g, input) {
  return g.match(input).use(r => {
    if (r.failed()) throw new Error(r.message);
    return toJS(r.cst, r.cst.root);
  });
}

let jsonGrammar;

test.before(async () => {
  jsonGrammar = await compileAndLoad(jsonSource);
});

test('empty object', t => {
  t.deepEqual(parse(jsonGrammar, '{}'), {});
});

test('empty array', t => {
  t.deepEqual(parse(jsonGrammar, '[]'), []);
});

test('strings', t => {
  t.is(parse(jsonGrammar, '"hello"'), 'hello');
  t.is(parse(jsonGrammar, '""'), '');
});

test('numbers', t => {
  t.is(parse(jsonGrammar, '0'), 0);
  t.is(parse(jsonGrammar, '42'), 42);
  t.is(parse(jsonGrammar, '-1'), -1);
  t.is(parse(jsonGrammar, '3.14'), 3.14);
  t.is(parse(jsonGrammar, '1e10'), 1e10);
  t.is(parse(jsonGrammar, '2.5E-3'), 2.5e-3);
});

test('booleans and null', t => {
  t.is(parse(jsonGrammar, 'true'), true);
  t.is(parse(jsonGrammar, 'false'), false);
  t.is(parse(jsonGrammar, 'null'), null);
});

test('simple object', t => {
  t.deepEqual(parse(jsonGrammar, '{"key": "value", "num": 42}'), {
    key: 'value',
    num: 42,
  });
});

test('nested structures', t => {
  const input = '{"a": [1, 2, {"b": true}], "c": null}';
  t.deepEqual(parse(jsonGrammar, input), {
    a: [1, 2, {b: true}],
    c: null,
  });
});

test('string escape sequences', t => {
  t.is(parse(jsonGrammar, '"hello\\nworld"'), 'hello\nworld');
  t.is(parse(jsonGrammar, '"tab\\there"'), 'tab\there');
  t.is(parse(jsonGrammar, '"quote\\"end"'), 'quote"end');
  t.is(parse(jsonGrammar, '"slash\\\\end"'), 'slash\\end');
  t.is(parse(jsonGrammar, '"\\u0041"'), 'A');
});

test('array with mixed types', t => {
  t.deepEqual(parse(jsonGrammar, '[1, "two", true, null, [3]]'), [
    1,
    'two',
    true,
    null,
    [3],
  ]);
});

test('deeply nested', t => {
  const input = '{"a": {"b": {"c": [1, 2, 3]}}}';
  t.deepEqual(parse(jsonGrammar, input), {
    a: {b: {c: [1, 2, 3]}},
  });
});
