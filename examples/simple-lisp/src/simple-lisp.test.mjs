import { grammar, runLisp, createEnv } from './simple-lisp.mjs';

import test from 'tape';

const LISP_BASIC_TEST = `
(def y 5)

(def add-two (fn (n) (+ n (+ 2 1))))

(def x (add-two y))

(log (str y "plus 3 is" x))
`;

const LISP_QUOTES = `
(log (quote symbol-test))

(def l (quote ((+ 1 1) 2 3)))
(log (first l))
(log (second l))
`;

const LISP_QUASIQUOTES = `
(def lst (quote (b c)))

(log (quasiquote (a lst b)))
(log (quasiquote (a (unquote lst) d)))
(log (quasiquote (a (splice-unquote lst) d)))
`;

const LISP_MACROS = `
(def defn
  (macro (name args body)
    (quasiquote
      (def (unquote name) (fn (unquote args) (unquote body))))))

(defn add (a b) (+ a b))

(log (str "(add 1 2) is" (add 1 2)))
`;

function createLoggingEnv() {
  const env = createEnv();
  const log = [];
  env.bind('log', (...args) => {
    log.push(args.map((x) => JSON.stringify(x)).join(' '));
  });
  return [env, log];
}

test('basic', (t) => {
  const [env, log] = createLoggingEnv();
  runLisp(LISP_BASIC_TEST, env);
  t.deepEqual(log, ['"5 plus 3 is 8"']);
  t.end();
});

test('quotes', (t) => {
  const [env, log] = createLoggingEnv();
  runLisp(LISP_QUOTES, env);
  t.deepEqual(log, ['{"name":"symbol-test"}', '[{"name":"+"},1,1]', '2']);
  t.end();
});

test('quasiquotes', (t) => {
  const [env, log] = createLoggingEnv();
  runLisp(LISP_QUASIQUOTES, env);
  t.deepEqual(log, [
    '[{"name":"a"},{"name":"lst"},{"name":"b"}]',
    '[{"name":"a"},[{"name":"b"},{"name":"c"}],{"name":"d"}]',
    '[{"name":"a"},{"name":"b"},{"name":"c"},{"name":"d"}]'
  ])
  t.end();
});

// TODO: Fix the exception here.
test.skip('macros', (t) => {
  const [env, log] = createLoggingEnv();
  runLisp(LISP_MACROS, env);
  t.fail();
  t.end();
});
