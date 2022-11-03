import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getMetaInfo(expr, grammarInterval) {
  const metaInfo = {};
  if (expr.source && grammarInterval) {
    const adjusted = expr.source.relativeTo(grammarInterval);
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
  }
  return metaInfo;
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = abstract('outputRecipe');

pexprs.any.outputRecipe = function(formals, grammarInterval) {
  return ['any', getMetaInfo(this, grammarInterval)];
};

pexprs.end.outputRecipe = function(formals, grammarInterval) {
  return ['end', getMetaInfo(this, grammarInterval)];
};

pexprs.Terminal.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['terminal', getMetaInfo(this, grammarInterval), this.obj];
};

pexprs.Range.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['range', getMetaInfo(this, grammarInterval), this.from, this.to];
};

pexprs.Param.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['param', getMetaInfo(this, grammarInterval), this.index];
};

pexprs.Alt.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['alt', getMetaInfo(this, grammarInterval)].concat(
      this.terms.map(term => term.outputRecipe(formals, grammarInterval)),
  );
};

pexprs.Extend.prototype.outputRecipe = function(formals, grammarInterval) {
  const extension = this.terms[0]; // [extension, original]
  return extension.outputRecipe(formals, grammarInterval);
};

pexprs.Splice.prototype.outputRecipe = function(formals, grammarInterval) {
  const beforeTerms = this.terms.slice(0, this.expansionPos);
  const afterTerms = this.terms.slice(this.expansionPos + 1);
  return [
    'splice',
    getMetaInfo(this, grammarInterval),
    beforeTerms.map(term => term.outputRecipe(formals, grammarInterval)),
    afterTerms.map(term => term.outputRecipe(formals, grammarInterval)),
  ];
};

pexprs.Seq.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['seq', getMetaInfo(this, grammarInterval)].concat(
      this.factors.map(factor => factor.outputRecipe(formals, grammarInterval)),
  );
};

pexprs.Star.prototype.outputRecipe =
  pexprs.Plus.prototype.outputRecipe =
  pexprs.Opt.prototype.outputRecipe =
  pexprs.Not.prototype.outputRecipe =
  pexprs.Lookahead.prototype.outputRecipe =
  pexprs.Lex.prototype.outputRecipe =
    function(formals, grammarInterval) {
      return [
        this.constructor.name.toLowerCase(),
        getMetaInfo(this, grammarInterval),
        this.expr.outputRecipe(formals, grammarInterval),
      ];
    };

pexprs.Apply.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'app',
    getMetaInfo(this, grammarInterval),
    this.ruleName,
    this.args.map(arg => arg.outputRecipe(formals, grammarInterval)),
  ];
};

pexprs.UnicodeChar.prototype.outputRecipe = function(formals, grammarInterval) {
  return ['unicodeChar', getMetaInfo(this, grammarInterval), this.category];
};
