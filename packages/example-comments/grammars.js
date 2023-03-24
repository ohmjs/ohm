import fs from 'node:fs';
import * as ohm from 'ohm-js';

const {OhmWithExamples} = ohm.grammars(fs.readFileSync('./ohm-with-examples.ohm', 'utf-8'), {
  Ohm: ohm.ohmGrammar,
});

export {OhmWithExamples};
