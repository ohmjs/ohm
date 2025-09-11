/* global URL */

import {readFileSync} from 'node:fs';
import * as ohm from 'ohm-js';

const readGrammar = relPath => readFileSync(new URL(relPath, import.meta.url));

export const es2015 = ohm.grammar(readGrammar('gen/es2015.grammar.ohm'));
export const es2016 = ohm.grammar(readGrammar('gen/es2016.grammar.ohm'));
export const es2017 = ohm.grammar(readGrammar('gen/es2017.grammar.ohm'));
export const es2018 = ohm.grammar(readGrammar('gen/es2018.grammar.ohm'));
export const es2019 = ohm.grammar(readGrammar('gen/es2019.grammar.ohm'));
export const es2020 = ohm.grammar(readGrammar('gen/es2020.grammar.ohm'));
export const es2021 = ohm.grammar(readGrammar('gen/es2021.grammar.ohm'));
export const es2022 = ohm.grammar(readGrammar('gen/es2022.grammar.ohm'));
