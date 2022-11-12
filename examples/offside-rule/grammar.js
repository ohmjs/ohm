import {pexprs} from 'ohm-js';
import {TerminalNode} from '../../packages/ohm-js/src/nodes.js';
import {Builder} from '../../packages/ohm-js/src/Builder.js';

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

    const origPos = inputStream.pos;

    let ans = false;
    if (this.isIndent) {
      const count = pseudoTokens[origPos] || 0;
      if (count > 0) {
        ans = true;
        // Consume the indent token.
        state.userData = Object.create(pseudoTokens);
        state.userData[origPos] -= 1;
      }
    } else {
      const count = -pseudoTokens[origPos];
      if (count > 0) {
        ans = true;
        // Consume the dedent token.
        state.userData = Object.create(pseudoTokens);
        state.userData[origPos] += 1;
      }
    }
    if (ans) {
      state.pushBinding(new TerminalNode(0), origPos);
    } else {
      state.processFailure(origPos, this);
    }
    return ans;
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
    /* TODO
    return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
    */
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
    .define('indent', [], new Indentation(true), 'an indented block', undefined, true)
    .define('dedent', [], new Indentation(false), 'a dedent', undefined, true)
    .build();

IndentationSensitive._matchStateInitializer = function(state) {
  state.userData = findIndentationPoints(state.input);
};
