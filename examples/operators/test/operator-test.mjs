import { fixture } from '../operator-example.mjs';
import test from 'ava-spec';

const { describe } = test;

for (const {name, grammar, semantics} of fixture) {

  describe(`The ${name} grammar`, (it) => {
    it('can parse a single integer literal expression', t => {
      const ast = semantics(grammar.match('20')).tree().toString();
      t.is(ast, '20');
    });

    it('can parse a single identifier expression', t => {
      const ast = semantics(grammar.match('dog2358')).tree().toString();
      t.is(ast, 'dog2358');
    });

    it('can parse a single parenthesized expression', t => {
      const ast = semantics(grammar.match('(((hello * 3)))')).tree().toString();
      t.is(ast, '(* hello 3)');
    });

    it('can distinguish precedence levels', t => {
      let ast = semantics(grammar.match('x + 2 * 3')).tree().toString();
      t.is(ast, '(+ x (* 2 3))');
      ast = semantics(grammar.match('x * 2 + 3')).tree().toString();
      t.is(ast, '(+ (* x 2) 3)');
    });

    it('does the right thing with parentheses', t => {
      let ast = semantics(grammar.match('(x + 2) * 3')).tree().toString();
      t.is(ast, '(* (+ x 2) 3)');
      ast = semantics(grammar.match('x * (2 + 3)')).tree().toString();
      t.is(ast, '(* x (+ 2 3))');     
    });

    it('looks at all three levels of precedence', t => {
      let ast = semantics(grammar.match('1 - 2 / 3 ** 4')).tree().toString();
      t.is(ast, '(- 1 (/ 2 (** 3 4)))');
      ast = semantics(grammar.match('1 - 2 ** 3 * 4')).tree().toString();
      t.is(ast, '(- 1 (* (** 2 3) 4))');
      ast = semantics(grammar.match('1 ** 2 + 3 * 4')).tree().toString();
      t.is(ast, '(+ (** 1 2) (* 3 4))');
    });

    it('knows that exponentiation is right associative', t => {
      let ast = semantics(grammar.match('1 ** 2 ** 3 ** 4 ** 5')).tree().toString();
      t.is(ast, '(** 1 (** 2 (** 3 (** 4 5))))');
      ast = semantics(grammar.match('1 ** (2 ** 3) ** 4 - 5')).tree().toString();
      t.is(ast, '(- (** 1 (** (** 2 3) 4)) 5)');
      
    });
    it('can parse a long string without parentheses', t => {
      const source = '10 + 3 * 8 ** 7 - 2 * 50 + 1 + x / 10';
      const ast = semantics(grammar.match(source)).tree().toString();
      t.is(ast, '(+ (+ (- (+ 10 (* 3 (** 8 7))) (* 2 50)) 1) (/ x 10))');
      
    });

    it('can parse a crazy string', t => {
      const source = '5*(3/1-(7**(6-x-1))+8/9*0-2)';
      const ast = semantics(grammar.match(source)).tree().toString();
      t.is(ast, '(* 5 (- (+ (- (/ 3 1) (** 7 (- (- 6 x) 1))) (* (/ 8 9) 0)) 2))');
    });
  });
}
