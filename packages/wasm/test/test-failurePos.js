import test from 'ava';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import {readFileSync} from 'node:fs';
import * as ohm from 'ohm-js';

import {scriptRel, wasmMatcherForGrammar} from './_helpers.js';

const grammarSource = readFileSync(scriptRel('data/liquid-html.ohm'), 'utf8');
const ns = ohm.grammars(grammarSource);

function failurePos(matcher, input) {
  matcher.setInput(input);
  const result = matcher.match();
  // TODO: Unify the APIs.
  if (typeof result === 'number') {
    assert.equal(result, 0);
    return matcher.getRightmostFailurePosition();
  }
  assert.equal(result.failed(), true);
  return result.getRightmostFailurePosition();
}

/* eslint-disable max-len */
const validInput = `{% comment %}
  Renders a swatch component.
  Accepts:
  - swatch: {Object} a swatch object
  - shape: {String} swatch shape. Accepts 'square', defaults to circle.

  Usage:
  {% render 'swatch',
    swatch: value.swatch
    shape: 'square'
  %}
{% endcomment %}

{%- liquid
  assign swatch_value = null
  if swatch.image
    assign image_url = swatch.image | image_url: width: 50
    assign swatch_value = 'url(' | append: image_url | append: ')'
    assign swatch_focal_point = swatch.image.presentation.focal_point
  elsif swatch.color
    assign swatch_value = 'rgb(' | append: swatch.color.rgb | append: ')'
  endif
-%}

<span
  {% if swatch_value %}
    class="swatch{% if shape == 'square' %} swatch--square{% endif %}"
    style="--swatch--background: {{ swatch_value }};{% if swatch_focal_point %} --swatch-focal-point: {{ swatch_focal_point }};{% endif %}"
  {% else %}
    class="swatch swatch--unavailable{% if shape == 'square' %} swatch--square{% endif %}"
  {% endif %}
></span>`;
/* eslint-enable max-len */

// Take some valid input, randomly corrupt it, and then check that the
// rightmostFailurePosition is the same as the JS parser reports.
function arbitraryEdit(input) {
  return fc
      .tuple(
          fc.nat({max: input.length - 1}), // Position to edit
          fc.integer({min: 1, max: 20}), // Number of characters to delete
      )
      .map(([pos, numDeleted]) => {
        return input.slice(0, pos) + input.slice(pos + numDeleted);
      });
}

// A fast-check property that checks that:
// - for some randomly-corrupted input, which fails to parse
// - the rightmostFailurePosition reported by a JS matcher and a Wasm matcher
//   is the same.
function sameFailurePos(wasmMatcher) {
  return fc.property(arbitraryEdit(validInput), input => {
    wasmMatcher.setInput(input);
    fc.pre(wasmMatcher.match() === 0);
    assert.equal(
        ns.LiquidHTML.match(input).getRightmostFailurePosition(),
        wasmMatcher.getRightmostFailurePosition(),
    );
  });
}

test('failure pos (fast-check)', async t => {
  const m = await wasmMatcherForGrammar(ns.LiquidHTML);
  const details = fc.check(sameFailurePos(m), {
    includeErrorInReport: true,
    interruptAfterTimeLimit: 1000,
  });
  t.log(`numRuns: ${details.numRuns}`);
  t.is(details.failed, false, `${fc.defaultReportMessage(details)}`);
});

test('failure pos: basic 1', async t => {
  const g = ohm.grammar(`
    G {
      Start = number+
      number = digit+
    }`);
  const jsMatcher = g.matcher();
  const wasmMatcher = await wasmMatcherForGrammar(g);

  t.is(failurePos(jsMatcher, 'a'), 0);
  t.is(failurePos(wasmMatcher, 'a'), 0);

  t.is(failurePos(jsMatcher, '123a'), 3);
  t.is(failurePos(wasmMatcher, '123a'), 3);

  t.is(failurePos(jsMatcher, '1 99a'), 4);
  t.is(failurePos(wasmMatcher, '1 99a'), 4);
});

test('failure pos: basic 2', async t => {
  const g = ohm.grammar(`
      G {
        Exp = number "+" number ";" -- plus
            | number
        number = digit+
      }`);
  const jsMatcher = g.matcher();
  const wasmMatcher = await wasmMatcherForGrammar(g);

  t.is(failurePos(jsMatcher, '99 + 66'), 7);
  t.is(failurePos(wasmMatcher, '99 + 66'), 7);
});

test('failure pos: basic 3', async t => {
  const g = ohm.grammar(`
    G {
      Start = letter letter
      space := "/*" (~"*/" any)* "*/"
    }`);
  const wasmMatcher = await wasmMatcherForGrammar(g);

  t.is(failurePos(wasmMatcher, '99'), 0);
});

test('failure pos: lookahead', async t => {
  {
    const g = ohm.grammar(`
      G {
        start = ~(anyTwo "!") "a" "b"
        anyTwo = any any
      }`);
    const jsMatcher = g.matcher();
    const wasmMatcher = await wasmMatcherForGrammar(g);

    // Original Ohm behaviour is to ignore failures inside the lookahead, so
    // it produces 'Expected "a"' at pos 0.
    t.is(failurePos(jsMatcher, '99'), 0);
    t.is(failurePos(wasmMatcher, '99'), 0);
  }
});

test('failure pos: memoization', async t => {
  {
    const g = ohm.grammar(`
      G {
        start = ~anyTwo anyTwo
        anyTwo = any any
      }`);
    const jsMatcher = g.matcher();
    const wasmMatcher = await wasmMatcherForGrammar(g);

    // Original Ohm behaviour is to ignore failures inside the lookahead, so
    // it produces 'Expected "a"' at pos 0.
    t.is(failurePos(jsMatcher, '9'), 1);
    t.is(failurePos(wasmMatcher, '9'), 1);
  }
});

test('failure pos: space skipping', async t => {
  {
    const g = ohm.grammar(`
      G {
        Start = digit digit
        space += "/*" (~"*/" any)* "*/" -- comment
      }`);
    const jsMatcher = g.matcher();
    const wasmMatcher = await wasmMatcherForGrammar(g);

    // Failure inside space skipping should be ignored.
    t.is(failurePos(jsMatcher, '9 /* bad'), 2);
    t.is(failurePos(wasmMatcher, '9 /* bad'), 2);
  }
});

test('fast-check zoo', async t => {
  const jsMatcher = ns.LiquidHTML.matcher();
  const wasmMatcher = await wasmMatcherForGrammar(ns.LiquidHTML);

  const input = '< {% if swatch_value %}';
  t.is(failurePos(wasmMatcher, input), failurePos(jsMatcher, input));
});
