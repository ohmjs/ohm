import BuiltInRules from '../dist/built-in-rules.js';
import {Grammar} from './Grammar.js';
import {announceBuiltInRules} from './util.js';

Grammar.BuiltInRules = BuiltInRules;
announceBuiltInRules(Grammar.BuiltInRules);

// During the bootstrap process, we instantiate some grammars that require
// the built-in rules to be loaded first (e.g., ohm-grammar.ohm). By
// exporting `makeRecipe` here, the recipes for those grammars can encode
// that dependency by importing it from this module.
export {makeRecipe} from './makeRecipe.js';
