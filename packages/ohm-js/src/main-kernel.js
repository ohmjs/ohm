import BuiltInRules from '../dist/built-in-rules.js';
import {Grammar} from './Grammar.js';
import {Namespace} from './Namespace.js';
import {announceBuiltInRules} from './util.js';

Grammar.BuiltInRules = BuiltInRules;
announceBuiltInRules(Grammar.BuiltInRules);

export const createNamespace = Namespace.createNamespace;
export {makeRecipe} from './makeRecipe.js';
export * as pexprs from './pexprs.js';
export {version} from './version.js';
export * as util from './util.js';
