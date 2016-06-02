'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.generateExample = common.abstract;

function categorizeExamples(examples) {
  var examplesNeeded = examples.filter(function(example) {
                                  return example.hasOwnProperty('examplesNeeded');
                                })
                               .map(function(example) { return example.examplesNeeded; });
  examplesNeeded = [].concat.apply([], examplesNeeded)
                            .filter(function(value, index, arr) {
                              return arr.indexOf(value) === index;
                            });

  var successfulExamples = examples.filter(function(example) {
                                      return example.hasOwnProperty('example');
                                    })
                                   .map(function(item) { return item.example; });
  // could check examples here, here's an example that's invalid

  var needHigherExample = examples.some(function(item) { return item.needHigherExample; });

  return {
    examplesNeeded: examplesNeeded,
    successfulExamples: successfulExamples,
    needHigherExample: needHigherExample
  };
}

pexprs.Alt.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  // items -> termExamples
  var termExamples = this.terms.map(function(term) {
    return term.generateExample(grammar, examples, inSyntacticContext);
  });

  var categorizedExamples = categorizeExamples(termExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHigherExample = categorizedExamples.needHigherExample;

  var returnObj = {};

  // Alt can contain both an example and a request for examples
  if (successfulExamples.length > 0) {
    var i = Math.floor(Math.random() * successfulExamples.length);
    returnObj.example = successfulExamples[i];
  }
  if (examplesNeeded.length > 0) {
    returnObj.examplesNeeded = examplesNeeded;
  }
  returnObj.needHigherExample = needHigherExample;

  return returnObj;
};

// safe thing to do might just be to omit whitespace period?
// for lexical rules, should we request their components?

pexprs.Seq.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  var factorExamples = this.factors.map(function(factor) {
    return factor.generateExample(grammar, examples, inSyntacticContext);
  });
  var categorizedExamples = categorizeExamples(factorExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHigherExample = categorizedExamples.needHigherExample;

  var returnObj = {};

  // in a Seq, all pieces must succeed in order to have a successful example
  if (examplesNeeded.length > 0) { // } || needHigherExample){
    returnObj.examplesNeeded = examplesNeeded;
    returnObj.needHigherExample = needHigherExample;
  } else {
    returnObj.example = successfulExamples.join(inSyntacticContext ? ' ' : '');
  }

  return returnObj;
};

// TODO: how to deal with args?
// what we really want is a hierarchical, structured needExamples?
//  but don't want to deal with double-asking

pexprs.Apply.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  var returnObj = {};

  if (!examples.hasOwnProperty(this.ruleName)) {
    returnObj.examplesNeeded = [this.ruleName];
  } else {
    var relevantExamples = examples[this.ruleName];
    var i = Math.floor(Math.random() * relevantExamples.length);
    returnObj.example = relevantExamples[i];
  }

  return returnObj;
};

// assumes that terminal's object is always a string
pexprs.Terminal.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {example: this.obj};
};

pexprs.Range.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  var rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
  return {example: String.fromCharCode(
    this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random())
  )};
};

// these all fail for now
pexprs.Not.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {needHigherExample: true};
};

pexprs.Lookahead.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {needHigherExample: true};
};

pexprs.Param.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {needHigherExample: true};
};

function repeat(n, fn) {
  if (n < 0) { return; }
  while (n > 0) {
    fn(n);
    n--;
  }
}

var generateNExamples = function(that, grammar, examples, inSyntacticContext, numTimes) {
  var items = [];
  repeat(numTimes, function() {
    items.push(that.expr.generateExample(grammar, examples, inSyntacticContext));
  });

  var categorizedExamples = categorizeExamples(items);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHigherExample = categorizedExamples.needHigherExample;

  var returnObj = {};

  // it's always either one or the other
  if (successfulExamples.length > 0) {
    returnObj.example = successfulExamples.join(inSyntacticContext ? ' ' : '');
  }
  if (examplesNeeded.length > 0) {
    returnObj.examplesNeeded = examplesNeeded;
  }

  returnObj.needHigherExample = needHigherExample;
  return returnObj;
};

pexprs.Star.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return generateNExamples(this, grammar, examples, inSyntacticContext,
                           Math.floor(Math.random() * 4));
};

pexprs.Plus.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return generateNExamples(this, grammar, examples, inSyntacticContext,
                           Math.floor(Math.random() * 3 + 1));
};

pexprs.Opt.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return generateNExamples(this, grammar, examples, inSyntacticContext,
                           Math.floor(Math.random() * 2));
};

/*
exports.any = any; //any char
exports.end = end; //end of input (~any)
exports.Terminal = Terminal; *
  yields itself

exports.Range = Range; *
exports.Param = Param; //param *
exports.Alt = Alt; *
  stochastic choose

exports.Extend = Extend;
exports.Seq = Seq; *
  concat

exports.Iter = Iter;*
exports.Star = Star;*
  star, minimum=0 (random from 0 to three)

exports.Plus = Plus;*
  star, minimum=1

exports.Opt = Opt;*
  star, minimum=0, maximum=1

exports.Not = Not; //fail *
exports.Lookahead = Lookahead; //fail *
exports.Lex = Lex; '#' puts you into a lexical context (inside pound, don't skip whitespace)
exports.Apply = Apply; *
  generate application of rule

exports.UnicodeChar = UnicodeChar; //generates itself
*/
