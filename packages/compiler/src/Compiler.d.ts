import type {Grammar} from 'ohm-js-legacy';

export class Compiler {
  grammar: Grammar;

  constructor(grammar: Grammar);
  compile(): Uint8Array<ArrayBuffer>;
}
