'use strict';

const ohm = require('ohm-js');
const {getNodeTypes} = require('./getNodeTypes');

const createDeclarations = (grammarName, actionDecls) =>
  `import {
  ActionDict,
  Grammar,
  IterationNode,
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';

export interface ${grammarName}ActionDict<T> extends ActionDict<T> {
  ${actionDecls.join('\n  ')}
}

export interface ${grammarName}Semantics extends Semantics {
  addOperation<T>(name: string, actionDict: ${grammarName}ActionDict<T>): this;
  extendOperation<T>(name: string, actionDict: ${grammarName}ActionDict<T>): this;
  addAttribute<T>(name: string, actionDict: ${grammarName}ActionDict<T>): this;
  extendAttribute<T>(name: string, actionDict: ${grammarName}ActionDict<T>): this;
}

export interface ${grammarName}Grammar extends Grammar {
  createSemantics(): ${grammarName}Semantics;
  extendSemantics(superSemantics: ${grammarName}Semantics): ${grammarName}Semantics;
}

declare const grammar: ${grammarName}Grammar;
export default grammar;
`;

const BuiltInRules = ohm.ohmGrammar.superGrammar;

function getActionDecls(grammar) {
  return Object.entries(grammar.rules).map(([ruleName, ruleInfo]) => {
    const argTypes = getNodeTypes(ruleInfo.body).map(t => t.toString());
    const args = argTypes.map((type, i) => `arg${i}: ${type}`).join(', ');
    return `${ruleName}?: (this: NonterminalNode, ${args}) => T;`;
  });
}

function generateTypes(grammar) {
  const actionDecls = [];
  for (let g = grammar; g !== BuiltInRules; g = g.superGrammar) {
    actionDecls.push(...getActionDecls(g));
  }
  return createDeclarations(grammar.name, actionDecls);
}

module.exports = {
  getActionDecls,
  generateTypes
};
