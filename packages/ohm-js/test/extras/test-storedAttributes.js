import test from 'ava';
import fs from 'node:fs';
import {URL} from 'node:url';

import {addStoredAttribute} from '../../extras/storedAttributes.js';
import * as ohm from '../../index.mjs';

const grammarPath = new URL('../data/arithmetic.ohm', import.meta.url);
const g = ohm.grammar(fs.readFileSync(grammarPath));

test('stored attributes', t => {
  const semantics = g.createSemantics();
  const exp = semantics(g.match('3 + 4 - 1'));

  // A meaningless stored attribute, where nodes have a "polarity" depending
  // on the type of operation they are involved in. All nodes pass their
  // polarity downwards, and the default action gives the child the polarity
  // of its parent.
  addStoredAttribute(semantics, 'polarity', 'initPolarity(pol)', setPolarity => ({
    AddExp_plus(expA, _, expB) {
      setPolarity(this, '+');
      // Note that we explicitly skip initializing the operator.
      expA.initPolarity(this.polarity);
      expB.initPolarity(this.polarity);
    },
    AddExp_minus(expA, _, expB) {
      setPolarity(this, '-');
      // Note that we explicitly skip initializing the operator.
      expA.initPolarity(this.polarity);
      expB.initPolarity(this.polarity);
    },
    _default(...children) {
      // By default, inherit polarity from the parent node.
      setPolarity(this, this.args.pol);
      children.forEach(c => c.initPolarity(this.args.pol));
    }
  }));
  exp.initPolarity('=');
  t.is(exp.polarity, '='); // Exp
  t.is(exp.child(0).polarity, '='); // AddExp
  t.is(exp.child(0).child(0).polarity, '-'); // AddExp_minus
  t.is(exp.child(0).child(0).child(0).polarity, '-'); // AddExp
  t.is(exp.child(0).child(0).child(0).child(0).polarity, '+'); // AddExp_plus

  t.throws(() => exp.child(0).child(0).child(1).polarity, {
    message: 'Attribute \'polarity\' not initialized'
  });
});
