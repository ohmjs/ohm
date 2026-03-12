import {decodeULEB128} from '@thi.ng/leb128';
import * as w from '@wasmgroundup/emit';

import assert from 'node:assert';

import {rewriteCodesecContents} from '../src/rewriteFuncIdx.ts';

const textDecoder = new TextDecoder();

function checkNotNull<T>(x): NonNullable<T> {
  assert(x !== null, 'unexpected null value');
  return x;
}

function skipPreamble(bytes: Uint8Array): void {
  const expected = new Uint8Array([
    0,
    ...Array.from('asm').map(c => checkNotNull(c.codePointAt(0))),
    1,
    0,
    0,
    0,
  ]);
  for (let i = 0; i < expected.length; i++) {
    assert(
      bytes[i] === expected[i],
      `bad preamble @${i}: expected ${expected[i]}, got ${bytes[i]}`
    );
  }
}

function checkU32(b: bigint): number {
  assert(b >= 0n && b < 2n ** 32n, `not a valid U32 value: ${b}`);
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
  // The number of extra imports int the dest module.
  destImportCountAdjustment?: number;
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

  // Parse the export section. Returns {funcs, globals} maps of {name: idx}.
  // `funcidxAdjustment` adjusts function indices to account for the dest
  // module having more imports than the source module.
  function parseExportSection(expectedId: number, funcidxAdjustment: number) {
    const id = bytes[pos++];
    assert(id === expectedId, `expected section with id ${expectedId}, got ${id}`);
    const size = parseU32();
    const startPos = pos;
    const count = parseU32();
    const funcs: ExportSection = {};
    const globals: ExportSection = {};

    for (let i = 0; i < count; i++) {
      // Parse name (length-prefixed UTF-8 string)
      const nameLen = parseU32();
      const nameBytes = bytes.slice(pos, pos + nameLen);
      pos += nameLen;
      const name = textDecoder.decode(nameBytes);

      // Parse kind (single byte)
      const kind = bytes[pos++];

      // Parse index
      const index = parseU32();

      if (kind === 0x00) {
        // Function export: adjust index for dest import count.
        funcs[name] = index + funcidxAdjustment;
      } else if (kind === 0x03) {
        // Global export: index is unchanged (globals aren't rewritten).
        globals[name] = index;
      }
    }

    assert(
      pos - startPos === size,
      `Export section parsing mismatch: expected ${size} bytes, parsed ${pos - startPos}`
    );
    return {funcs, globals};
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

  // Parse the 'name' custom section and extract global names (subsection id 7).
  // Returns a map of {name: globalIdx}.
  function parseNameSectionGlobals(sectionSize: number): ExportSection {
    const sectionEnd = pos + sectionSize;
    const result: ExportSection = {};
    while (pos < sectionEnd) {
      const subId = bytes[pos++];
      const subSize = parseU32();
      const subEnd = pos + subSize;
      if (subId === 7) {
        // Global names subsection
        const count = parseU32();
        for (let i = 0; i < count; i++) {
          const idx = parseU32();
          const nameLen = parseU32();
          const nameBytes = bytes.slice(pos, pos + nameLen);
          pos += nameLen;
          const fullName = textDecoder.decode(nameBytes);
          // Convert AS internal paths to short names:
          //   "runtime/ohmRuntime/pos" → "pos"
          //   "~lib/rt/stub/offset" → "__offset"
          const baseName = fullName.split('/').pop()!;
          const name =
            fullName.startsWith('~') && !baseName.startsWith('__')
              ? `__${baseName}`
              : baseName;
          result[name] = idx;
        }
      }
      pos = subEnd;
    }
    return result;
  }

  let typesec: VecContents | undefined;
  let importsec: VecContents = {entryCount: 0, contents: new Uint8Array()};
  let funcsec: VecContents | undefined;
  let globalsec: VecContents = {entryCount: 0, contents: new Uint8Array()};
  let exports: {funcs: ExportSection; globals: ExportSection} | undefined;
  let nameGlobals: ExportSection = {};
  let codesec: VecContents | undefined;
  let startFuncidx: number | undefined;

  let srcImportCount = 0;
  let destImportCount = 0;

  const importAdjust = opts.destImportCountAdjustment ?? 0;

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
      srcImportCount = importsec.entryCount;
      destImportCount = srcImportCount + importAdjust;
    } else if (id === 3) {
      funcsec = parseVecSectionOpaque(id);
    } else if (id === 6) {
      globalsec = parseVecSectionOpaque(id);
    } else if (id === 7) {
      exports = parseExportSection(id, destImportCount - srcImportCount);
    } else if (id === 8) {
      startFuncidx = parseStartSection(id) + destImportCount - srcImportCount;
    } else if (id === 10) {
      codesec = parseVecSectionOpaque(id);
      // Rewrite the code section to account for the number of imports that
      // will exist in the final module. If `destImportCount` is not provided,
      // assume that it's the same as srcImportCount.
      codesec.contents = rewriteCodesecContents(
        codesec.contents,
        srcImportCount,
        destImportCount
      );
    } else if (id === 0) {
      // Custom section — check if it's the 'name' section.
      pos++; // consume section id
      const sectionSize = parseU32();
      const sectionEnd = pos + sectionSize;
      const nameLen = parseU32();
      const sectionName = textDecoder.decode(bytes.slice(pos, pos + nameLen));
      pos += nameLen;
      if (sectionName === 'name') {
        nameGlobals = parseNameSectionGlobals(sectionEnd - pos);
      }
      pos = sectionEnd;
    } else {
      skipSection();
    }
  }

  // Build globalidxByName: export names (clean) take precedence over name section names.
  const globalidxByName: ExportSection = {...nameGlobals, ...exports?.globals};

  return {
    typesec: checkNotNull(typesec),
    importsec,
    funcsec: checkNotNull(funcsec),
    globalsec,
    funcidxByName: exports?.funcs,
    globalidxByName,
    codesec: checkNotNull(codesec),
    startFuncidx,
  };
}

