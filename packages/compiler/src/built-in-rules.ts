// Auto-generated from built-in-rules.ohm — do not edit.
// Regenerate with: node scripts/generateBuiltInRules.ts

import * as pexprs from 'ohm-js-legacy/src/pexprs-build.js';
import {Grammar} from 'ohm-js-legacy/src/Grammar.js';
import {GrammarDecl} from 'ohm-js-legacy/src/GrammarDecl.js';

const decl = new GrammarDecl('BuiltInRules');
decl.withSuperGrammar(Grammar.ProtoBuiltInRules);

decl.define(
  'alnum',
  [],
  new pexprs.Alt([new pexprs.Apply('letter'), new pexprs.Apply('digit')]),
  'an alpha-numeric character'
);
decl.define(
  'letter',
  [],
  new pexprs.Alt([
    new pexprs.Apply('lower'),
    new pexprs.Apply('upper'),
    new pexprs.Apply('unicodeLtmo'),
  ]),
  'a letter'
);
decl.define('digit', [], new pexprs.Range('0', '9'), 'a digit');
decl.define(
  'hexDigit',
  [],
  new pexprs.Alt([
    new pexprs.Apply('digit'),
    new pexprs.Range('a', 'f'),
    new pexprs.Range('A', 'F'),
  ]),
  'a hexadecimal digit'
);
decl.define(
  'ListOf',
  ['elem', 'sep'],
  new pexprs.Alt([
    new pexprs.Apply('NonemptyListOf', [new pexprs.Param(0), new pexprs.Param(1)]),
    new pexprs.Apply('EmptyListOf', [new pexprs.Param(0), new pexprs.Param(1)]),
  ]),
  undefined
);
decl.define(
  'NonemptyListOf',
  ['elem', 'sep'],
  new pexprs.Seq([
    new pexprs.Param(0),
    new pexprs.Star(new pexprs.Seq([new pexprs.Param(1), new pexprs.Param(0)])),
  ]),
  undefined
);
decl.define('EmptyListOf', ['elem', 'sep'], new pexprs.Seq([]), undefined);
decl.define(
  'listOf',
  ['elem', 'sep'],
  new pexprs.Alt([
    new pexprs.Apply('nonemptyListOf', [new pexprs.Param(0), new pexprs.Param(1)]),
    new pexprs.Apply('emptyListOf', [new pexprs.Param(0), new pexprs.Param(1)]),
  ]),
  undefined
);
decl.define(
  'nonemptyListOf',
  ['elem', 'sep'],
  new pexprs.Seq([
    new pexprs.Param(0),
    new pexprs.Star(new pexprs.Seq([new pexprs.Param(1), new pexprs.Param(0)])),
  ]),
  undefined
);
decl.define('emptyListOf', ['elem', 'sep'], new pexprs.Seq([]), undefined);
decl.define('applySyntactic', ['app'], new pexprs.Param(0), undefined);

export default decl.build();
