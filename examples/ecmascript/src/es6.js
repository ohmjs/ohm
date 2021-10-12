/* eslint-env node */

'use strict';

const fs = require('fs');
const path = require('path');

const anyNodesMentionThis = (...nodes) => nodes.some(n => n.mentionsThis);

// Semantic actions for the `mentionsThis` attribute, which returns true for a node
// if the `this` keyword appears anywhere in the node's subtree, and otherwise false.
const mentionsThisActions = {
  this(_) {
    return true;
  },
  _terminal() {
    return false;
  },
  _nonterminal: anyNodesMentionThis,
  _iter: anyNodesMentionThis,
};

const toES5Actions = {
  ArrowFunction(params, _, arrow, body) {
    const source = 'function ' + params.toES5() + ' ' + body.toES5();
    // Only use `bind` if necessary.
    return body.mentionsThis ? source + '.bind(this)' : source;
  },
  ArrowParameters_unparenthesized(id) {
    return '(' + id.toES5() + ')';
  },
  ConciseBody_noBraces(exp) {
    return '{ return ' + exp.toES5() + ' }';
  },
};

module.exports = function(ohm, ns, s) {
  const g = ohm.grammar(fs.readFileSync(path.join(__dirname, 'es6.ohm')).toString(), ns);
  const semantics = g.extendSemantics(s);
  semantics.addAttribute('mentionsThis', mentionsThisActions);
  semantics.extendOperation('toES5', toES5Actions);

  return {
    grammar: g,
    semantics,
  };
};
