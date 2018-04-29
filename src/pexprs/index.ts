import { default as PExpr } from './PExpr';
import { default as any } from './any';
import { default as end } from './end';
import { default as Terminal } from './Terminal';
import { default as Range } from './Range';
import { default as Param } from './Param';
import { default as Alt } from './Alt';
import { default as Extend } from './Extend';
import { default as Seq } from './Seq';
import { default as Iter } from './Iter';
import { default as Star } from './Star';
import { default as Plus } from './Plus';
import { default as Opt } from './Opt';
import { default as Not } from './Not';
import { default as Lookahead } from './Lookahead';
import { default as Lex } from './Lex';
import { default as Apply } from './Apply';
import { default as UnicodeChar } from './UnicodeChar';

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

const pexprs = {
  PExpr,
  any,
  end,
  Terminal,
  Range,
  Param,
  Alt,
  Extend,
  Seq,
  Iter,
  Star,
  Plus,
  Opt,
  Not,
  Lookahead,
  Lex,
  Apply,
  UnicodeChar
};

export default pexprs;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('../pexprs-allowsSkippingPrecedingSpace')(pexprs);
require('../pexprs-assertAllApplicationsAreValid')(pexprs);
require('../pexprs-assertChoicesHaveUniformArity')(pexprs);
require('../pexprs-assertIteratedExprsAreNotNullable')(pexprs);
require('../pexprs-check')(pexprs);
require('../pexprs-eval')(pexprs);
require('../pexprs-getArity')(pexprs);
require('../pexprs-generateExample')(pexprs);
require('../pexprs-outputRecipe')(pexprs);
require('../pexprs-introduceParams')(pexprs);
require('../pexprs-isNullable')(pexprs);
require('../pexprs-substituteParams')(pexprs);
require('../pexprs-toDisplayString')(pexprs);
require('../pexprs-toArgumentNameList')(pexprs);
require('../pexprs-toFailure')(pexprs);
