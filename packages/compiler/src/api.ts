import {Compiler, grammars as parseGrammars} from './Compiler.js';

interface CompileOptions {
  grammarName?: string;
}

export function compile(source: string, opts?: CompileOptions): Uint8Array {
  const ns = parseGrammars(source);
  const names = Object.keys(ns).sort();

  if (names.length === 0) {
    throw new Error('No grammars found in source');
  }

  if (opts?.grammarName) {
    const g = ns[opts.grammarName];
    if (!g) {
      throw new Error(
        `Grammar '${opts.grammarName}' not found. Available: ${names.join(', ')}`
      );
    }
    return new Compiler(g).compile();
  }

  if (names.length > 1) {
    throw new Error(
      `Source contains multiple grammars (${names.join(', ')}). ` +
        `Specify which to compile with {grammarName: '...'}.`
    );
  }

  return new Compiler(ns[names[0]]).compile();
}

export function compileGrammars(source: string): Record<string, Uint8Array> {
  const result: Record<string, Uint8Array> = {};
  for (const [name, g] of Object.entries(parseGrammars(source))) {
    result[name] = new Compiler(g).compile();
  }
  return result;
}
