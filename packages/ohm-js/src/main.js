import ohmGrammar from '../dist/ohm-grammar.js';
import {buildGrammar} from './buildGrammar.js';
import * as common from './common.js';
import * as errors from './errors.js';
import {Grammar} from './Grammar.js';
import {Namespace} from './Namespace.js';
import * as pexprs from './pexprs.js';
import * as util from './util.js';

// Late initialization for stuff that is bootstrapped.

import './semanticsDeferredInit.js'; // TODO: Clean this up.
Grammar.initApplicationParser(ohmGrammar, buildGrammar);

const isBuffer = obj =>
  !!obj.constructor &&
  typeof obj.constructor.isBuffer === 'function' &&
  obj.constructor.isBuffer(obj);

function compileAndLoad(source, namespace) {
  const m = ohmGrammar.match(source, 'Grammars');
  if (m.failed()) {
    throw errors.grammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}

export function grammar(source, optNamespace) {
  const ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  const grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    const secondGrammar = ns[grammarNames[1]];
    const interval = secondGrammar.source;
    throw new Error(
        util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.',
    );
  }
  return ns[grammarNames[0]]; // Return the one and only grammar.
}

export function grammars(source, optNamespace) {
  const ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
          'Expected string as first argument, got ' + common.unexpectedObjToString(source),
      );
    }
  }
  compileAndLoad(source, ns);
  return ns;
}

export function grammarFromScriptElement(optNode) {
  throw new Error(
      'grammarFromScriptElement was removed in Ohm v16.0. See https://ohmjs.org/d/gfs for more info.',
  );
}

export function grammarsFromScriptElements(optNodeOrNodeList) {
  throw new Error(
      'grammarsFromScriptElements was removed in Ohm v16.0. See https://ohmjs.org/d/gfs for more info.',
  );
}

export * from './main-kernel.js';
export const {createNamespace} = Namespace;
export {ohmGrammar};
export {pexprs, util};
export {version} from './version.js';
