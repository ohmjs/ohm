import type {Grammar} from 'ohm-js-legacy';

export {grammar, grammars} from './parseGrammars.ts';

export class Compiler {
  grammar: Grammar;

  constructor(grammar: Grammar);
  compile(): Uint8Array<ArrayBuffer>;
}
