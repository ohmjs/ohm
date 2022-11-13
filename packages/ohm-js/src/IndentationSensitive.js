import BuiltInRules from '../dist/built-in-rules.js';
import {Builder} from '../src/Builder.js';
import {Failure} from '../src/Failure.js';
import {TerminalNode} from '../src/nodes.js';
import {PExpr} from '../src/pexprs.js';
import {findIndentation} from './findIndentation.js';

const INDENT_DESCRIPTION = 'an indented block';
const DEDENT_DESCRIPTION = 'a dedent';

class Indentation extends PExpr {
  constructor(isIndent = true) {
    super();
    this.isIndent = isIndent;
  }

  allowsSkippingPrecedingSpace() {
    return true;
  }

  eval(state) {
    const {inputStream} = state;
    const pseudoTokens = state.userData;
    state.doNotMemoize = true;

    const origPos = inputStream.pos;

    const sign = this.isIndent ? 1 : -1;
    const count = (pseudoTokens[origPos] || 0) * sign;
    if (count > 0) {
      // Update the count to consume the pseudotoken.
      state.userData = Object.create(pseudoTokens);
      state.userData[origPos] -= sign;

      state.pushBinding(new TerminalNode(0), origPos);
      return true;
    } else {
      state.processFailure(origPos, this);
      return false;
    }
  }

  getArity() {
    return 1;
  }

  _assertAllApplicationsAreValid(ruleName, grammar) {}

  _isNullable(grammar, memo) {
    return false;
  }

  assertChoicesHaveUniformArity(ruleName) {}

  assertIteratedExprsAreNotNullable(grammar) {}

  introduceParams(formals) {
    return this;
  }

  substituteParams(actuals) {
    return this;
  }

  toDisplayString() {
    return 'TODO';
  }

  toFailure(grammar) {
    const description = this.isIndent ? INDENT_DESCRIPTION : DEDENT_DESCRIPTION;
    return new Failure(this, description, 'description');
  }
}

export const IndentationSensitive = new Builder()
    .newGrammar('IndentationSensitive')
    .withSuperGrammar(BuiltInRules)
    .define('indent', [], new Indentation(true), INDENT_DESCRIPTION, undefined, true)
    .define('dedent', [], new Indentation(false), DEDENT_DESCRIPTION, undefined, true)
    .build();

Object.assign(IndentationSensitive, {
  _matchStateInitializer(state) {
    state.userData = findIndentation(state.input);
  },
  supportsIncrementalParsing: false,
});
