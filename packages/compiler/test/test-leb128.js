// Cross-check local leb128.ts against @thi.ng/leb128.

import test from 'ava';
import * as thi from '@thi.ng/leb128';

import {decodeULEB128, decodeSLEB128} from '../src/leb128.ts';

function encodeULEB128(value) {
  const bytes = [];
  let v = BigInt(value);
  do {
    let byte = Number(v & 0x7fn);
    v >>= 7n;
    if (v !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (v !== 0n);
  return new Uint8Array(bytes);
}

function encodeSLEB128(value) {
  const bytes = [];
  let v = BigInt(value);
  let more = true;
  while (more) {
    let byte = Number(v & 0x7fn);
    v >>= 7n;
    if ((v === 0n && (byte & 0x40) === 0) || (v === -1n && (byte & 0x40) !== 0)) {
      more = false;
    } else {
      byte |= 0x80;
    }
    bytes.push(byte);
  }
  return new Uint8Array(bytes);
}

const uleb128Cases = [
  0n,
  1n,
  63n,        // max 1-byte value (6 bits + no sign bit concern for unsigned)
  127n,       // 0x7f — largest value fitting in 7 bits
  128n,       // 0x80 — first 2-byte value
  255n,
  256n,
  16383n,     // max 2-byte value
  16384n,     // first 3-byte value
  624485n,    // classic Wikipedia example
  2097151n,   // max 3-byte value
  (1n << 32n) - 1n, // u32 max
  (1n << 32n),      // just over u32
  (1n << 53n) - 1n, // Number.MAX_SAFE_INTEGER as bigint
];

const sleb128Cases = [
  0n,
  1n,
  -1n,
  63n,        // max positive 1-byte value
  64n,        // first positive 2-byte value (bit 6 = sign)
  -64n,       // min negative 1-byte value
  -65n,       // first negative 2-byte value
  127n,
  -128n,
  128n,
  -129n,
  8191n,      // max positive 2-byte value
  -8192n,     // min negative 2-byte value
  (1n << 31n) - 1n,  // i32 max
  -(1n << 31n),      // i32 min
];

for (const value of uleb128Cases) {
  test(`decodeULEB128: ${value}`, t => {
    const encoded = encodeULEB128(value);
    const [localVal, localLen] = decodeULEB128(encoded);
    const [thiVal, thiLen] = thi.decodeULEB128(encoded);
    t.is(localVal, thiVal);
    t.is(localLen, thiLen);
  });
}

for (const value of sleb128Cases) {
  test(`decodeSLEB128: ${value}`, t => {
    const encoded = encodeSLEB128(value);
    const [localVal, localLen] = decodeSLEB128(encoded);
    const [thiVal, thiLen] = thi.decodeSLEB128(encoded);
    t.is(localVal, thiVal);
    t.is(localLen, thiLen);
  });
}

test('decodeULEB128: with offset', t => {
  const prefix = new Uint8Array([0xDE, 0xAD]);
  const encoded = encodeULEB128(624485n);
  const buf = new Uint8Array([...prefix, ...encoded]);
  const [localVal, localLen] = decodeULEB128(buf, 2);
  const [thiVal, thiLen] = thi.decodeULEB128(buf, 2);
  t.is(localVal, thiVal);
  t.is(localLen, thiLen);
});

test('decodeSLEB128: with offset', t => {
  const prefix = new Uint8Array([0xDE, 0xAD, 0xBE]);
  const encoded = encodeSLEB128(-123456n);
  const buf = new Uint8Array([...prefix, ...encoded]);
  const [localVal, localLen] = decodeSLEB128(buf, 3);
  const [thiVal, thiLen] = thi.decodeSLEB128(buf, 3);
  t.is(localVal, thiVal);
  t.is(localLen, thiLen);
});
