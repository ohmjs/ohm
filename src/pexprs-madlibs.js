'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Trace = require('./Trace');
var common = require('./common');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

var TerminalNode = nodes.TerminalNode;
var NonterminalNode = nodes.NonterminalNode;
var IterationNode = nodes.IterationNode;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.madlib = common.abstract;


pexprs.Alt.prototype.madlib = function*(examples){
  let gens = this.terms.map((term)=> term.madlib(examples));
  let weights = gens.map(()=>1);
  while(true){
    let sum = weights.reduce((a, b)=> a+b);

    let choice = Math.random()*sum;
    let i;
    for(i = 0; choice > weights[i]; choice -= weights[i++]){}

    weights[i] /= 2;
    yield gens[i].next().value;
  }
};

pexprs.Seq.prototype.madlib = function*(examples){
  let gens = this.factors.map((factor)=> factor.madlib(examples));
  for(let items of arrayInfGen(gens)){
    yield items.join(" ");
  }
};

function* arrayInfGen(...gens){
  while(true){
    yield gens.map(g=>g.next().value);
  }
}

//TODO: how to deal with args?
pexprs.Apply.prototype.madlib = function*(examples){
  if(!examples.hasOwnProperty(this.ruleName)){
    throw new MadlibError(`no examples available for rule ${this.ruleName}`);
  }
  while(true){ //may want to do something like the old impl where we shuffle array
    let relevantExamples = examples[this.ruleName];
    let i = Math.floor(Math.random()*relevantExamples.length)
    yield relevantExamples[i];
  }
}

pexprs.Terminal.prototype.madlib = function*(examples){
  while(true){
    yield this.obj;
  }
}

/*
exports.any = any;
exports.end = end;
exports.Terminal = Terminal;
  yields itself

exports.Range = Range;
exports.Param = Param;
exports.Alt = Alt;
  stochastic choose

exports.Extend = Extend;
exports.Seq = Seq;
  concat

exports.Iter = Iter;
exports.Star = Star;
  star, minimum=0
  lossy or lossless? should we make sure to use each ex,
  or just jump from len 0 to len 1 to ...?

exports.Plus = Plus;
  star, minimum=1

exports.Opt = Opt;
  star, minimum=0, maximum=1

exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Lex = Lex;
exports.Apply = Apply;
  generate application of rule

exports.UnicodeChar = UnicodeChar;
*/
