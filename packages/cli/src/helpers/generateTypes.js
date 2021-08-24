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

declare interface ${grammarName}ActionDict<T> extends ActionDict<T> {
  ${actionDecls.join('\n  ')}
}

declare interface ${grammarName}Semantics extends Semantics {
  addOperation<T=any>(name: string, actionDict: ${grammarName}ActionDict<T>): this;
  // TODO: extendOperation, addAttribute, extendAttribute
}

declare interface ${grammarName}Grammar extends Grammar {
  createSemantics(): ${grammarName}Semantics;
  // TODO: extendSemantics
}
`;

const BuiltInRules = ohm.ohmGrammar.superGrammar;

function getActionDecls(grammar) {
  return Object.entries(grammar.rules).map(([ruleName, ruleInfo]) => {
    const argTypes = getNodeTypes(ruleInfo.body).map(t => t.toString());
    const args = argTypes.map((type, i) => `arg${i}: ${type}`).join(', ');
    return `${ruleName}?: (this: NonterminalNode, ${args}) => T;`;
  });
}

function generateTypes(grammarFilename, grammar) {
  const actionDecls = [];
  for (let g = grammar; g !== BuiltInRules; g = g.superGrammar) {
    actionDecls.push(...getActionDecls(g));
  }
  return {
    filename: `${grammarFilename}.d.ts`,
    contents: createDeclarations(grammar.name, actionDecls)
  };
}

module.exports = {
  getActionDecls,
  generateTypes
};
