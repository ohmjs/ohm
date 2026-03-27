// Entry point for the Javy-compiled Wasm module.
// Protocol: stdin = UTF-8 grammar source, stdout = compiled Wasm bytes.

import {compile} from './javy-api.ts';

declare const Javy: {
  IO: {
    readSync(fd: number, buf: Uint8Array): number;
    writeSync(fd: number, buf: Uint8Array): void;
  };
};

function readStdin(): string {
  const chunks: Uint8Array[] = [];
  const buf = new Uint8Array(4096);
  while (true) {
    const n = Javy.IO.readSync(0, buf);
    if (n === 0) break;
    chunks.push(buf.slice(0, n));
  }
  let total = 0;
  for (const c of chunks) total += c.length;
  const result = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder().decode(result);
}

function stderr(msg: string): void {
  Javy.IO.writeSync(2, new TextEncoder().encode(msg));
}

// Parse an optional "#grammarName <name>" directive from the first line of input.
// If present, returns [grammarName, remainingSource]; otherwise [undefined, source].
function parseHeader(input: string): [string | undefined, string] {
  const match = input.match(/^#grammarName (\S+)\n([\s\S]*)$/);
  if (match) return [match[1], match[2]];
  return [undefined, input];
}

try {
  const raw = readStdin();
  const [grammarName, source] = parseHeader(raw);
  const wasmBytes = compile(source, grammarName);
  Javy.IO.writeSync(1, wasmBytes);
} catch (e: any) {
  const msg = e?.message ?? String(e);
  stderr(msg + '\n');
}
