import {assert} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

export function createError(message, optInterval) {
  let e;
  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message);
    e.shortMessage = message;
    e.interval = optInterval;
  } else {
    e = new Error(message);
  }
  return e;
}

// ----------------- errors about intervals -----------------

export function intervalSourcesDontMatch() {
  return createError("Interval sources don't match");
}

// ----------------- errors about grammars -----------------

// Grammar syntax error

export function grammarSyntaxError(matchFailure) {
  const e = new Error();
  Object.defineProperty(e, 'message', {
    enumerable: true,
    get() {
      return matchFailure.message;
    },
  });
  Object.defineProperty(e, 'shortMessage', {
    enumerable: true,
    get() {
      return 'Expected ' + matchFailure.getExpectedText();
    },
  });
  e.interval = matchFailure.getInterval();
  return e;
}

// Undeclared grammar

export function undeclaredGrammar(grammarName, namespace, interval) {
  const message = namespace ?
    `Grammar ${grammarName} is not declared in namespace '${namespace}'` :
    'Undeclared grammar ' + grammarName;
  return createError(message, interval);
}

// Duplicate grammar declaration

export function duplicateGrammarDeclaration(grammar, namespace) {
  return createError('Grammar ' + grammar.name + ' is already declared in this namespace');
}

export function grammarDoesNotSupportIncrementalParsing(grammar) {
  return createError(`Grammar '${grammar.name}' does not support incremental parsing`);
}

// ----------------- rules -----------------

// Undeclared rule

export function undeclaredRule(ruleName, grammarName, optInterval) {
  return createError(
      'Rule ' + ruleName + ' is not declared in grammar ' + grammarName,
      optInterval,
  );
}

// Cannot override undeclared rule

export function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource,
  );
}

// Cannot extend undeclared rule

export function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource,
  );
}

// Duplicate rule declaration

export function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
  let message =
    "Duplicate declaration for rule '" + ruleName + "' in grammar '" + grammarName + "'";
  if (grammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }
  return createError(message, optSource);
}

// Wrong number of parameters

export function wrongNumberOfParameters(ruleName, expected, actual, source) {
  return createError(
      'Wrong number of parameters for rule ' +
      ruleName +
      ' (expected ' +
      expected +
      ', got ' +
      actual +
      ')',
      source,
  );
}

// Wrong number of arguments

export function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError(
      'Wrong number of arguments for rule ' +
      ruleName +
      ' (expected ' +
      expected +
      ', got ' +
      actual +
      ')',
      expr,
  );
}

// Duplicate parameter names

export function duplicateParameterNames(ruleName, duplicates, source) {
  return createError(
      'Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '),
      source,
  );
}

// Invalid parameter expression

export function invalidParameter(ruleName, expr) {
  return createError(
      'Invalid parameter to rule ' +
      ruleName +
      ': ' +
      expr +
      ' has arity ' +
      expr.getArity() +
      ', but parameter expressions must have arity 1',
      expr.source,
  );
}

// Application of syntactic rule from lexical rule

const syntacticVsLexicalNote =
  'NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. ' +
  'See https://ohmjs.org/d/svl for more details.';

export function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError(
      'Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)',
      applyExpr.source,
  );
}

// Lexical rule application used with applySyntactic

export function applySyntacticWithLexicalRuleApplication(applyExpr) {
  const {ruleName} = applyExpr;
  return createError(
      `applySyntactic is for syntactic rules, but '${ruleName}' is a lexical rule. ` +
      syntacticVsLexicalNote,
      applyExpr.source,
  );
}

// Application of applySyntactic in a syntactic context

export function unnecessaryExperimentalApplySyntactic(applyExpr) {
  return createError(
      'applySyntactic is not required here (in a syntactic context)',
      applyExpr.source,
  );
}

// Incorrect argument type

export function incorrectArgumentType(expectedType, expr) {
  return createError('Incorrect argument type: expected ' + expectedType, expr.source);
}

// Multiple instances of the super-splice operator (`...`) in the rule body.

export function multipleSuperSplices(expr) {
  return createError("'...' can appear at most once in a rule body", expr.source);
}

// Unicode code point escapes

export function invalidCodePoint(applyWrapper) {
  const node = applyWrapper._node;
  assert(node && node.isNonterminal() && node.ctorName === 'escapeChar_unicodeCodePoint');

  // Get an interval that covers all of the hex digits.
  const digitIntervals = applyWrapper.children.slice(1, -1).map(d => d.source);
  const fullInterval = digitIntervals[0].coverageWith(...digitIntervals.slice(1));
  return createError(
      `U+${fullInterval.contents} is not a valid Unicode code point`,
      fullInterval,
  );
}

// ----------------- Kleene operators -----------------

export function kleeneExprHasNullableOperand(kleeneExpr, applicationStack) {
  const actuals =
    applicationStack.length > 0 ? applicationStack[applicationStack.length - 1].args : [];
  const expr = kleeneExpr.expr.substituteParams(actuals);
  let message =
    'Nullable expression ' +
    expr +
    " is not allowed inside '" +
    kleeneExpr.operator +
    "' (possible infinite loop)";
  if (applicationStack.length > 0) {
    const stackTrace = applicationStack
        .map(app => new pexprs.Apply(app.ruleName, app.args))
        .join('\n');
    message += '\nApplication stack (most recent application last):\n' + stackTrace;
  }
  return createError(message, kleeneExpr.expr.source);
}

// ----------------- arity -----------------

export function inconsistentArity(ruleName, expected, actual, expr) {
  return createError(
      'Rule ' +
      ruleName +
      ' involves an alternation which has inconsistent arity ' +
      '(expected ' +
      expected +
      ', got ' +
      actual +
      ')',
      expr.source,
  );
}

// ----------------- properties -----------------

export function duplicatePropertyNames(duplicates) {
  return createError('Object pattern has duplicate property names: ' + duplicates.join(', '));
}

// ----------------- constructors -----------------

export function invalidConstructorCall(grammar, ctorName, children) {
  return createError(
      'Attempt to invoke constructor ' + ctorName + ' with invalid or unexpected arguments',
  );
}

// ----------------- convenience -----------------

export function multipleErrors(errors) {
  const messages = errors.map(e => e.message);
  return createError(['Errors:'].concat(messages).join('\n- '), errors[0].interval);
}

// ----------------- semantic -----------------

export function missingSemanticAction(ctorName, name, type, stack) {
  let stackTrace = stack
      .slice(0, -1)
      .map(info => {
        const ans = '  ' + info[0].name + ' > ' + info[1];
        return info.length === 3 ? ans + " for '" + info[2] + "'" : ans;
      })
      .join('\n');
  stackTrace += '\n  ' + name + ' > ' + ctorName;

  let moreInfo = '';
  if (ctorName === '_iter') {
    moreInfo = [
      '\nNOTE: as of Ohm v16, there is no default action for iteration nodes — see ',
      '  https://ohmjs.org/d/dsa for details.',
    ].join('\n');
  }

  const message = [
    `Missing semantic action for '${ctorName}' in ${type} '${name}'.${moreInfo}`,
    'Action stack (most recent call last):',
    stackTrace,
  ].join('\n');

  const e = createError(message);
  e.name = 'missingSemanticAction';
  return e;
}

export function throwErrors(errors) {
  if (errors.length === 1) {
    throw errors[0];
  }
  if (errors.length > 1) {
    throw multipleErrors(errors);
  }
}
