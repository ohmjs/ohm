import BuiltInRules from '../dist/built-in-rules.js';
import {Builder} from '../src/Builder.js';
import {Failure} from '../src/Failure.js';
import {TerminalNode} from '../src/nodes.js';
import * as pexprs from '../src/pexprs.js';
import {findIndentation} from './findIndentation.js';
import {InputStream} from './InputStream.js';

const INDENT_DESCRIPTION = 'an indented block';
const DEDENT_DESCRIPTION = 'a dedent';

// A sentinel value that is out of range for both charCodeAt() and codePointAt().
const INVALID_CODE_POINT = 0x10ffff + 1;

class InputStreamWithIndentation extends InputStream {
  constructor(state) {
    super(state.input);
    this.state = state;
  }

  _indentationAt(pos) {
    return this.state.userData[pos] || 0;
  }

  atEnd() {
    return super.atEnd() && this._indentationAt(this.pos) === 0;
  }

  next() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return undefined;
    }
    return super.next();
  }

  nextCharCode() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return INVALID_CODE_POINT;
    }
    return super.nextCharCode();
  }

  nextCodePoint() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return INVALID_CODE_POINT;
    }
    return super.nextCodePoint();
  }
}

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

  toString() {
    return this.isIndent ? 'indent' : 'dedent';
  }

  toDisplayString() {
    return this.toString();
  }

  toFailure(grammar) {
    const description = this.isIndent ? INDENT_DESCRIPTION : DEDENT_DESCRIPTION;
    return new Failure(this, description, 'description');
  }
}

// Create a new definition for `any` that can consume indent & dedent.
const applyIndent = new pexprs.Apply('indent');
const applyDedent = new pexprs.Apply('dedent');
const newAnyBody = new pexprs.Splice(BuiltInRules, 'any', [applyIndent, applyDedent], []);

export const IndentationSensitive = new Builder()
  .newGrammar('IndentationSensitive')
  .withSuperGrammar(BuiltInRules)
  .define('indent', [], new Indentation(true), INDENT_DESCRIPTION, undefined, true)
  .define('dedent', [], new Indentation(false), DEDENT_DESCRIPTION, undefined, true)
  .extend('any', [], newAnyBody, 'any character', undefined)
  .build();

Object.assign(IndentationSensitive, {
  _matchStateInitializer(state) {
    state.userData = findIndentation(state.input);
    state.inputStream = new InputStreamWithIndentation(state);
  },
  supportsIncrementalParsing: false,
});
