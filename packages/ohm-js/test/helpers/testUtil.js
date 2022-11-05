import * as ohm from '../../index.mjs';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

let nextId = 0;

export function uniqueId() {
  return nextId++;
}

export function makeGrammar(source, optNamespace) {
  if (Array.isArray(source)) {
    source = source.join('\n');
  }
  return ohm.grammar(source, optNamespace);
}
