// Pure JS LEB128 decoding, replacing @thi.ng/leb128 (which uses Wasm internally).
// API matches @thi.ng/leb128: (data: Uint8Array, offset?: number) => [bigint, number]

export function decodeULEB128(data: Uint8Array, offset: number = 0): [bigint, number] {
  let result = 0n;
  let shift = 0n;
  let pos = offset;
  while (true) {
    const byte = data[pos++];
    result |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) break;
    shift += 7n;
  }
  return [result, pos - offset];
}

export function decodeSLEB128(data: Uint8Array, offset: number = 0): [bigint, number] {
  let result = 0n;
  let shift = 0n;
  let pos = offset;
  let byte: number;
  do {
    byte = data[pos++];
    result |= BigInt(byte & 0x7f) << shift;
    shift += 7n;
  } while ((byte & 0x80) !== 0);
  // Sign extend if the highest bit of the last byte is set.
  if (shift < 64n && (byte & 0x40) !== 0) {
    result |= -(1n << shift);
  }
  return [result, pos - offset];
}
