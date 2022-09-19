import BuiltInRules from '../dist/built-in-rules.js';
import {Grammar} from './Grammar.js';
import {Namespace} from './Namespace.js';
import * as pexprs from './pexprs.js';
import * as util from './util.js';

Grammar.BuiltInRules = BuiltInRules;
util.announceBuiltInRules(Grammar.BuiltInRules);

export const {createNamespace} = Namespace;
export {makeRecipe} from './makeRecipe.js';
export {pexprs, util};
export {version} from './version.js';
