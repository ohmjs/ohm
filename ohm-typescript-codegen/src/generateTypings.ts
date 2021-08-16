import * as ohm from 'ohm-js';
import {getNodeTypes} from './getNodeTypes';

const createDeclarations = (grammarName: string, actionDecls: string[]) =>
  `import {ActionDict, Grammar, IterationNode, Node, NonterminalNode, Semantics, TerminalNode} from 'ohm-js';

declare interface ${grammarName}ActionDict<T> extends ActionDict {
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

function getActionDecls(grammar: ohm.Grammar) {
  return Object.entries(grammar.rules).map(([ruleName, ruleInfo]) => {
    const argTypes = getNodeTypes(ruleInfo.body).map(t => t.toString());
    const args = argTypes.map((type, i) => `arg${i}: ${type}`).join(', ');
    return `${ruleName}?(${args}): T;`;
  });
}

export function generateTypings(source: string, filename?: string) {
  const grammar = ohm.grammar(source);
  const actionDecls = [];
  for (let g = grammar; g != null; g = g.superGrammar) {
    actionDecls.push(...getActionDecls(g));
  }
  return {
    filename: filename ? `${filename}.d.ts` : `${grammar.name.toLowerCase()}.d.ts`,
    contents: createDeclarations(grammar.name, actionDecls)
  };
}
