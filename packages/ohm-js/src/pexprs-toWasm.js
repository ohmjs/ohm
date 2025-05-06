import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

import {Assembler} from './wasm.js';

import * as w from '@wasmgroundup/emit';

const cg = new Assembler();

function dbg(x) {
  console.log(x);
  return x;
}

const {instr} = w;
