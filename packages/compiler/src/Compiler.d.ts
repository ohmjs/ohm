import type {Grammar} from 'ohm-js';

export class Compiler {
  grammar: Grammar;

  constructor(grammar: Grammar);
  compile(): Uint8Array<ArrayBuffer>;
}
