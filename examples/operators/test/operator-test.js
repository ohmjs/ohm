'use strict';

const fixture = require('../operator-example');
const assert = require('assert');

for (let {name, grammar, semantics} of fixture) {

  describe(`The ${name} grammar`, () => {

    it('can parse a single integer literal expression', (done) => {
      let ast = semantics(grammar.match('20')).tree().toString();
      assert.strictEqual(ast, '20');
      done();
    });

    it('can parse a single identifier expression', (done) => {
      let ast = semantics(grammar.match('dog2358')).tree().toString();
      assert.strictEqual(ast, 'dog2358');
      done();
    });

    it('can parse a single parenthesized expression', (done) => {
      let ast = semantics(grammar.match('(((hello * 3)))')).tree().toString();
      assert.strictEqual(ast, '(* hello 3)');
      done();
    });

    it('can distinguish precedence levels', (done) => {
      let ast = semantics(grammar.match('x + 2 * 3')).tree().toString();
      assert.strictEqual(ast, '(+ x (* 2 3))');
      ast = semantics(grammar.match('x * 2 + 3')).tree().toString();
      assert.strictEqual(ast, '(+ (* x 2) 3)');
      done();
    });

    it('does the right thing with parentheses', (done) => {
      let ast = semantics(grammar.match('(x + 2) * 3')).tree().toString();
      assert.strictEqual(ast, '(* (+ x 2) 3)');
      ast = semantics(grammar.match('x * (2 + 3)')).tree().toString();
      assert.strictEqual(ast, '(* x (+ 2 3))');
      done();
    });

    it('looks at all three levels of precedence', (done) => {
      let ast = semantics(grammar.match('1 - 2 / 3 ** 4')).tree().toString();
      assert.strictEqual(ast, '(- 1 (/ 2 (** 3 4)))');
      ast = semantics(grammar.match('1 - 2 ** 3 * 4')).tree().toString();
      assert.strictEqual(ast, '(- 1 (* (** 2 3) 4))');
      ast = semantics(grammar.match('1 ** 2 + 3 * 4')).tree().toString();
      assert.strictEqual(ast, '(+ (** 1 2) (* 3 4))');
      done();
    });

    it('knows that exponentiation is right associative', (done) => {
      let ast = semantics(grammar.match('1 ** 2 ** 3 ** 4 ** 5')).tree().toString();
      assert.strictEqual(ast, '(** 1 (** 2 (** 3 (** 4 5))))');
      ast = semantics(grammar.match('1 ** (2 ** 3) ** 4 - 5')).tree().toString();
      assert.strictEqual(ast, '(- (** 1 (** (** 2 3) 4)) 5)');
      done();
    });

    it('can parse a long string without parentheses', (done) => {
      let source = '10 + 3 * 8 ** 7 - 2 * 50 + 1 + x / 10';
      let ast = semantics(grammar.match(source)).tree().toString();
      assert.strictEqual(ast, '(+ (+ (- (+ 10 (* 3 (** 8 7))) (* 2 50)) 1) (/ x 10))');
      done();
    });

    it('can parse a crazy string', (done) => {
      let source = '5*(3/1-(7**(6-x-1))+8/9*0-2)';
      let ast = semantics(grammar.match(source)).tree().toString();
      assert.strictEqual(ast, '(* 5 (- (+ (- (/ 3 1) (** 7 (- (- 6 x) 1))) (* (/ 8 9) 0)) 2))');
      done();
    });
  });
}
