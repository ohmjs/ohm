import * as ohm from 'ohm-js';

const createDeclarations = (grammarName: string, actionDecls: string[]) =>
  `
import {ActionDict, Grammar, IterationNode, Node, NonterminalNode, Semantics, TerminalNode} from 'ohm-js';

declare interface ${grammarName}Node extends Node {}

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

declare const ${grammarName.toLowerCase()}: ${grammarName}Grammar;
`.trim();

export function generateTypings(source: string, filename?: string) {
  const grammar = ohm.grammar(source);
  const actionDecls = Object.entries(grammar.rules).map(([ruleName, ruleInfo]) => {
    const argTypes = ruleInfo.body.getNodeTypes().map(t => t.toString());
    const args = argTypes.map((type, i) => `arg${i}: ${type}`).join(', ');
    return `${ruleName}?(${args}): T;`;
  });
  return {
    filename: filename ? `${filename}.d.ts` : `${grammar.name.toLowerCase()}.d.ts`,
    source: createDeclarations(grammar.name, actionDecls)
  };
}
