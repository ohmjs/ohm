// Rewrites funcidx values in prebuilt WASM code section bytes to account
// for additional imports in the dest module. Used by Compiler.ts at compile
// time to adjust prebuilt code for extra imports (e.g. debug imports).

import {decodeULEB128, decodeSLEB128} from '@thi.ng/leb128';
import * as w from '@wasmgroundup/emit';

// For sanity checking, assume that the number of locals is never
// above a certain number. (We can raise this if necessary.)
const MAX_LOCALS = 64;

const WASM_NUMTYPES = [0x7c, 0x7d, 0x7e, 0x7f];
const WASM_VECTYPE = 0x7b;
const WASM_REFTYPES = [0x6f, 0x70];

function isValtype(t: number): boolean {
  return WASM_NUMTYPES.includes(t) || WASM_VECTYPE === t || WASM_REFTYPES.includes(t);
}

function checkValtype(t: number): number {
  if (!isValtype(t))
    throw new Error(`unrecognized valtype: 0x${t.toString(16).padStart(2, '0')}`);
  return t;
}

function checkU32(b: bigint): number {
  if (!(b >= 0n && b < 2n ** 32n)) throw new Error(`not a valid U32 value: ${b}`);
  return Number(b);
}

function checkI32(b: bigint): number {
  if (!(b >= -(2n ** 31n) && b < 2n ** 31n)) throw new Error(`not a valid I32 value: ${b}`);
  return Number(b);
}

function rewriteCodeEntry(
  bytes: Uint8Array,
  srcImportCount: number,
  destImportCount: number
): number[] {
  const {instr} = w;
  let pos = 0;

  const parseU32 = () => {
    const [val, count] = decodeULEB128(bytes, pos);
    pos += count;
    return checkU32(val);
  };

  const parseI32 = () => {
    const [val, count] = decodeSLEB128(bytes, pos);
    pos += count;
    return checkI32(val);
  };

  function skipLocals() {
    const len = parseU32();
    for (let i = 0; i < len; i++) {
      const count = parseU32();
      if (!(count < MAX_LOCALS)) throw new Error(`too many locals: ${count} @${pos}`);
      checkValtype(bytes[pos++]);
    }
  }

  function skipU32Vec() {
    const len = parseU32();
    for (let i = 0; i < len; i++) {
      parseU32();
    }
  }

  // See https://webassembly.github.io/spec/core/bikeshed/#binary-blocktype
  function skipBlocktype() {
    const b = bytes[pos];
    if (b === 0x40 || isValtype(b)) {
      pos += 1;
      return;
    }
    const [idx, count] = decodeSLEB128(bytes.slice(pos));
    pos += count;
    if (!(idx >= 0)) throw new Error(`unexpected typeidx in blocktype: ${idx}`);
  }

  skipLocals();

  const result: number[] = [];
  let sliceStart = 0;
  let nesting = 1;

  while (pos < bytes.length) {
    const bc = bytes[pos++];

    switch (bc) {
      case instr.unreachable:
      case instr.nop:
        break;
      case instr.block:
      case instr.loop:
      case instr.if:
        skipBlocktype();
        ++nesting;
        break;
      case instr.else:
        break;
      case instr.end:
        if (!(--nesting >= 0)) throw new Error(`bad nesting @${pos - 1}`);
        break;
      case instr.br:
      case instr.br_if:
        parseU32();
        break;
      case instr.br_table:
        skipU32Vec(); // labels
        parseU32(); // default label
        break;
      case instr.return:
        break;
      case instr.call:
        result.push(...bytes.slice(sliceStart, pos));
        let idx = parseU32();
        if (idx >= srcImportCount) {
          idx += destImportCount - srcImportCount;
        }
        result.push(...w.u32(idx));
        sliceStart = pos;
        break;
      case instr.call_indirect:
        parseU32();
        parseU32();
        break;
      case instr.drop:
      case instr.select:
        break;
      case instr.local.get:
      case instr.local.set:
      case instr.local.tee:
      case instr.global.get:
      case instr.global.set:
        parseU32();
        break;
      case instr.i32.const:
        parseI32();
        break;
      case instr.i64.const:
        const origPos = pos;
        const [_, count] = decodeULEB128(bytes.slice(pos));
        if (!(count <= 10)) throw new Error(`too many bytes (${count}) for i64 @${origPos}`);
        pos += count;
        break;
      case instr.f32.const:
        pos += 4;
        break;
      case instr.f64.const:
        pos += 8;
        break;
      // @ts-ignore Fallthrough case in switch
      case 0xfc:
        const bc2 = parseU32();
        if (0 <= bc2 && bc2 <= 7) {
          // i32.trunc_sat_XXX
          break;
        }
        switch (bc2) {
          case 0x0a: // memory.copy
            parseU32();
            parseU32();
            break;
          case 0x0b: // memory.fill
            parseU32();
            break;
          default:
            throw new Error(`unhandled multibyte ${bc2.toString(16)} @${pos - 1}`);
        }
        break;
      default:
        if (instr.i32.load <= bc && bc <= instr.i64.store32) {
          parseU32();
          parseU32();
        } else if (instr.memory.size <= bc && bc <= instr.memory.grow) {
          parseU32();
        } else if (instr.i32.eqz <= bc && bc <= instr.f64.reinterpret_i64) {
          // do nothing
        } else {
          throw new Error(`unhandled bytecode 0x${bc.toString(16)} @${pos - 1}`);
        }
        break;
    }
  }
  result.push(...bytes.slice(sliceStart));
  return result;
}

// Rewrite the contents of the prebuilt code section, changing the funcidx of
// `call` instructions to account for the correct number of imports in the
// final module.
export function rewriteCodesecContents(
  bytes: Uint8Array,
  srcImportCount: number,
  destImportCount: number
): Uint8Array {
  if (destImportCount < srcImportCount) {
    throw new Error(
      `destImportCount (${destImportCount}) < srcImportCount (${srcImportCount})`
    );
  }
  if (srcImportCount === destImportCount) return bytes;

  let pos = 0;

  const parseU32 = () => {
    const [val, count] = decodeULEB128(bytes, pos);
    pos += count;
    return checkU32(val);
  };

  const newBytes: number[] = [];

  while (pos < bytes.length) {
    const size = parseU32();
    const newEntry = rewriteCodeEntry(
      bytes.slice(pos, pos + size),
      srcImportCount,
      destImportCount
    );
    newBytes.push(...w.u32(newEntry.length), ...newEntry);
    pos += size;
  }

  return new Uint8Array(newBytes);
}
