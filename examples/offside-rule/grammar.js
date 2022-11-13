import {pexprs} from 'ohm-js';
import {Builder} from '../../packages/ohm-js/src/Builder.js';
import {Failure} from '../../packages/ohm-js/src/Failure.js';
import {TerminalNode} from '../../packages/ohm-js/src/nodes.js';

const INDENT_DESCRIPTION = 'an indented block';
const DEDENT_DESCRIPTION = 'a dedent';

class Indentation extends pexprs.PExpr {
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

function findIndentationPoints(input) {
  let pos = 0;
  const stack = [0];
  const topOfStack = () => stack[stack.length - 1];

  const result = {};

  const regex = /( *).*(?:$|\r?\n|\r)/g;
  let match;
  while ((match = regex.exec(input)) != null) {
    const [line, indent] = match;

    // The last match will always have length 0. In every other case, some
    // characters will be matched (possibly only the end of line chars).
    if (line.length === 0) break;

    const indentSize = indent.length;
    const prevSize = topOfStack();

    const indentPos = pos + indentSize;

    if (indentSize > prevSize) {
      // Indent -- always only 1.
      stack.push(indentSize);
      result[indentPos] = 1;
    } else if (indentSize < prevSize) {
      // Dedent -- can be multiple levels.
      const prevLength = stack.length;
      while (topOfStack() !== indentSize) {
        stack.pop();
      }
      result[indentPos] = -1 * (prevLength - stack.length);
    }
    pos += line.length;
  }
  // Ensure that there is a matching DEDENT for every remaining INDENT.
  if (stack.length > 1) {
    result[pos] = 1 - stack.length;
  }
  return result;
}

export const findIndentationPointsForTesting = findIndentationPoints;

export const IndentationSensitive = new Builder()
    .newGrammar('IndentationSensitive')
    .define('indent', [], new Indentation(true), INDENT_DESCRIPTION, undefined, true)
    .define('dedent', [], new Indentation(false), DEDENT_DESCRIPTION, undefined, true)
    .build();

IndentationSensitive._matchStateInitializer = function(state) {
  state.userData = findIndentationPoints(state.input);
};
