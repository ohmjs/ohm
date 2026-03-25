// Stub for ohm-js (v18) — used in the Javy build where WebAssembly is not
// available. Compiler.ts transitively imports parseGrammars.ts which imports
// Grammar from ohm-js, but this code path is never reached when grammars are
// parsed via ohm-js-legacy.

export class Grammar {
  constructor() {
    throw new Error('ohm-js v18 Grammar is not available in this environment');
  }
}
