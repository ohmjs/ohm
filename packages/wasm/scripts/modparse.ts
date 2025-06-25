import {decodeULEB128, decodeSLEB128} from '@thi.ng/leb128';
import * as w from '@wasmgroundup/emit';

import assert from 'node:assert';

// For sanity checking, assume that the number of locals is never
// above a certain number. (We can raise this if necessary.)
const MAX_LOCALS = 64;

const WASM_NUMTYPES = [0x7c, 0x7d, 0x7e, 0x7f];
const WASM_VECTYPE = 0x7b;
const WASM_REFTYPES = [0x6f, 0x70];

function checkNotNull<T>(x): NonNullable<T> {
  assert(x !== null, 'unexpected null value');
  return x;
}

function skipPreamble(bytes: Uint8Array): void {
  // prettier-ignore
  const expected = new Uint8Array([
    0, ...Array.from("asm").map((c) => checkNotNull(c.codePointAt(0))),
    1, 0, 0, 0,
  ])
  for (let i = 0; i < expected.length; i++) {
    assert(
      bytes[i] === expected[i],
      `bad preamble @${i}: expected ${expected[i]}, got ${bytes[i]}`
    );
  }
}

function isValtype(t: number): boolean {
  return WASM_NUMTYPES.includes(t) || WASM_VECTYPE === t || WASM_REFTYPES.includes(t);
}

function checkValtype(t: number): number {
  assert(isValtype(t), `unrecognized valtype: 0x${t.toString(16).padStart(2, '0')}`);
  return t;
}

function checkU32(b: bigint): number {
  assert(b >= 0n && b < 2n ** 32n, `not a valid U32 value: ${b}`);
  return Number(b);
}

function checkI32(b: bigint): number {
  assert(b >= -(2n ** 31n) && b < 2n ** 31n, `not a valid I32 value: ${b}`);
  return Number(b);
}

export type VecContents = {
  entryCount: number;
  contents: Uint8Array;
};

export type ExportSection = {
  [name: string]: number;
};

export type RawContents = {
  contents: Uint8Array;
};

interface ExtractOptions {
  destImportCount?: number;
}

// Extracts the type, import, function, global, and code sections from a Wasm module.
export function extractSections(bytes: Uint8Array, opts: ExtractOptions = {}) {
  skipPreamble(bytes);

  const parseU32 = () => {
    const [val, count] = decodeULEB128(bytes, pos);
    pos += count;
    return checkU32(val);
  };

  function peekSectionId(): number {
    return bytes[pos];
  }

  function skipSection() {
    // @ts-ignore unused variable
    const id = bytes[pos++];
    const size = parseU32();
    pos += size;
  }

  // Parse the export section, and return a map of {funcName: newIdx}.
  // `adjustment` is the difference between the number of dest imports
  // and source imports.
  function parseExportSection(expectedId: number, adjustment): ExportSection {
    const id = bytes[pos++];
    assert(id === expectedId, `expected section with id ${expectedId}, got ${id}`);
    const size = parseU32();
    const startPos = pos;
    const count = parseU32();
    const exports: ExportSection = {};

    for (let i = 0; i < count; i++) {
      // Parse name (length-prefixed UTF-8 string)
      const nameLen = parseU32();
      const nameBytes = bytes.slice(pos, pos + nameLen);
      pos += nameLen;
      const name = new TextDecoder().decode(nameBytes);

      // Parse kind (single byte)
      const kind = bytes[pos++];

      // Parse index
      const index = parseU32();

      // Only collect functions (kind 0x00)
      if (kind === 0x00) {
        exports[name] = index + adjustment;
      }
    }

    assert(
      pos - startPos === size,
      `Export section parsing mismatch: expected ${size} bytes, parsed ${pos - startPos}`
    );
    return exports;
  }

  // Parse the start section, which contains a single function index.
  function parseStartSection(expectedId: number): number {
    const id = bytes[pos++];
    assert(id === expectedId, `expected section with id ${expectedId}, got ${id}`);
    const _size = parseU32();
    return parseU32();
  }

  function parseVecSectionOpaque(expectedId: number) {
    const id = bytes[pos++];
    assert(id === expectedId, `expected section with id ${expectedId}, got ${id}`);
    const size = parseU32();
    return parseVecOpaque(size);
  }

  // Parse a vec without examining its contents.
  // Return the length (# of elements) and the raw contents.
  function parseVecOpaque(size: number) {
    const end = pos + size;
    const entryCount = parseU32();
    const contents = bytes.slice(pos, end);
    pos = end;
    return {entryCount, contents};
  }

  let typesec: VecContents | undefined;
  let importsec: VecContents = {entryCount: 0, contents: new Uint8Array()};
  let funcsec: VecContents | undefined;
  let globalsec: VecContents = {entryCount: 0, contents: new Uint8Array()};
  let exports: ExportSection | undefined;
  let codesec: VecContents | undefined;
  let startFuncidx: number | undefined;

  let pos = 8;
  let lastId = -1;
  while (pos < bytes.length) {
    const id = peekSectionId();
    // Custom sections (id 0) can appear anywhere. Also, the data count
    // section (id 12) appears just before the code section (id 10).
    // All other sections must appear in the prescribed order.
    assert(
      id === 0 || lastId < id || (lastId === 12 && id === 10),
      `@${pos} expected id > ${lastId}, got ${id}`
    );
    lastId = id;
    if (id === 1) {
      typesec = parseVecSectionOpaque(id);
    } else if (id === 2) {
      importsec = parseVecSectionOpaque(id);
    } else if (id === 3) {
      funcsec = parseVecSectionOpaque(id);
    } else if (id === 6) {
      globalsec = parseVecSectionOpaque(id);
    } else if (id === 7) {
      const srcImportCount = importsec?.entryCount ?? 0;
      const destImportCount = opts.destImportCount ?? 0;
      exports = parseExportSection(id, destImportCount - srcImportCount);
    } else if (id === 8) {
      const srcImportCount = importsec?.entryCount ?? 0;
      const destImportCount = opts.destImportCount ?? 0;
      startFuncidx = parseStartSection(id) + destImportCount - srcImportCount;
    } else if (id === 10) {
      codesec = parseVecSectionOpaque(id);
      // Rewrite the code section to account for the number of imports that
      // will exist in the final module.
      const srcImportCount = importsec?.entryCount ?? 0;
      const destImportCount = opts.destImportCount ?? 0;

      codesec.contents = rewriteCodesecContents(
        codesec.contents,
        srcImportCount,
        destImportCount
      );
    } else {
      skipSection();
    }
  }
  return {
    typesec: checkNotNull(typesec),
    importsec,
    funcsec: checkNotNull(funcsec),
    globalsec,
    funcidxByName: exports,
    codesec: checkNotNull(codesec),
    startFuncidx
  };
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
      assert(count < MAX_LOCALS, `too many locals: ${count} @${pos}`);
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
    // From the spec:
    // > Unlike any other occurrence, the type index in a block type is encoded
    // > as a positive signed integer, so that its signed LEB128 bit pattern
    // > cannot collide with the encoding of value types or the special code
    // > 0x40, which correspond to the LEB128 encoding of negative integers.
    const [idx, count] = decodeSLEB128(bytes.slice(pos));
    pos += count;
    assert(idx >= 0, `unexpected typeidx in blocktype: ${idx}`);
  }

  skipLocals();

  const result: number[] = [];
  let sliceStart = 0;
  let nesting = 1;

  // Walk through the function's bytecode.
  while (pos < bytes.length) {
    const bc = bytes[pos++];

    // The cases here are ordered by ascending opcode.
    // See https://pengowray.github.io/wasm-ops/ for an overview.
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
        assert(--nesting >= 0, `bad nesting @${pos - 1}`);
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
        // Rewrite `call` instructions so that the index is valid for the
        // target module.
        result.push(...bytes.slice(sliceStart, pos));
        let idx = parseU32();

        // Function indices in a Wasm bundle are automatically assigned.
        // First come the imports, then the user-defined functions.
        // Since the dest module has additional imports, we need to rewrite
        // the funcidx if and only if it referred to a user function.
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
        assert(count <= 10, `too many bytes (${count}) for i64 @${origPos}`);
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
function rewriteCodesecContents(
  bytes: Uint8Array,
  srcImportCount: number,
  destImportCount: number
): Uint8Array {
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
