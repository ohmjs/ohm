import operationsAndAttributesGrammar from '../dist/operations-and-attributes.js';
import {Grammar} from './Grammar.js';
import {Semantics} from './Semantics.js';

initBuiltInSemantics(Grammar.BuiltInRules);
initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics

function initBuiltInSemantics(builtInRules) {
  const actions = {
    empty() {
      return this.iteration();
    },
    nonEmpty(first, _, rest) {
      return this.iteration([first].concat(rest.children));
    },
    self(..._children) {
      return this;
    },
  };

  Semantics.BuiltInSemantics = Semantics.createSemantics(builtInRules, null).addOperation(
      'asIteration',
      {
        emptyListOf: actions.empty,
        nonemptyListOf: actions.nonEmpty,
        EmptyListOf: actions.empty,
        NonemptyListOf: actions.nonEmpty,
        _iter: actions.self,
      },
  );
}

function initPrototypeParser(grammar) {
  Semantics.prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
    AttributeSignature(name) {
      return {
        name: name.parse(),
        formals: [],
      };
    },
    OperationSignature(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.children.map(c => c.parse())[0] || [],
      };
    },
    Formals(oparen, fs, cparen) {
      return fs.asIteration().children.map(c => c.parse());
    },
    name(first, rest) {
      return this.sourceString;
    },
  });
  Semantics.prototypeGrammar = grammar;
}
