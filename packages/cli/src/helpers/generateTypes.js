import {getNodeTypes} from './getNodeTypes.js';

const getImports = (includeNamespace = false) =>
  `import {
  BaseActionDict,
  Grammar,
  IterationNode,${includeNamespace ? '\n  Namespace,' : ''}
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';`;

const createDeclarations = (grammarName, superGrammarName, actionDecls) => {
  const actionDictType = `${grammarName}ActionDict<T>`;
  const actionDictSuperType = `${superGrammarName || 'Base'}ActionDict<T>`;
  const semanticsType = `${grammarName}Semantics`;
  return `export interface ${actionDictType} extends ${actionDictSuperType} {
  ${actionDecls.join('\n  ')}
}

export interface ${semanticsType} extends Semantics {
  addOperation<T>(name: string, actionDict: ${actionDictType}): this;
  extendOperation<T>(name: string, actionDict: ${actionDictType}): this;
  addAttribute<T>(name: string, actionDict: ${actionDictType}): this;
  extendAttribute<T>(name: string, actionDict: ${actionDictType}): this;
}

export interface ${grammarName}Grammar extends Grammar {
  createSemantics(): ${semanticsType};
  extendSemantics(superSemantics: ${semanticsType}): ${semanticsType};
}
`;
};

export function getActionDecls(grammar) {
  return Object.entries(grammar.rules).map(([ruleName, ruleInfo]) => {
    const argTypes = getNodeTypes(ruleInfo.body).map(t => t.toString());
    const args = argTypes.map((type, i) => `arg${i}: ${type}`).join(', ');
    return `${ruleName}?: (this: NonterminalNode, ${args}) => T;`;
  });
}

const getDefaultExport = typeName =>
  `declare const grammar: ${typeName};
export default grammar;
`;

function generateTypesForGrammar(grammar) {
  let superGrammarName;
  if (!grammar.superGrammar.isBuiltIn()) {
    superGrammarName = grammar.superGrammar.name;
  }
  return createDeclarations(grammar.name, superGrammarName, getActionDecls(grammar));
}

const getNamespaceExport = ns =>
  `declare const ns: {
${Object.keys(ns)
      .map(name => `  ${name}: ${name}Grammar;\n`)
      .join('')}};
export default ns;
`;

export function generateTypes(grammars) {
  const isExactlyOneGrammar = Object.keys(grammars).length === 1;
  const sections = [getImports(!isExactlyOneGrammar), ''];

  for (const grammar of Object.values(grammars)) {
    sections.push(generateTypesForGrammar(grammar));
  }
  if (isExactlyOneGrammar) {
    const grammarName = Object.values(grammars)[0].name;
    sections.push(getDefaultExport(`${grammarName}Grammar`));
  } else {
    sections.push(getNamespaceExport(grammars));
  }
  return sections.join('\n');
}
