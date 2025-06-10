import * as es from 'ohm-grammar-ecmascript';

const es5 = es.grammar;

const m = es5.matcher();
m.getInput(`
function foo() {
  var x = 3;
  new
`).trim();
