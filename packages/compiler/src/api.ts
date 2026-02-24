import {Compiler} from './Compiler.ts';
import {grammars as parseGrammars} from './parseGrammars.ts';

export interface CompileOptions {
  grammarName?: string;
  preallocNodes?: boolean;
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
    return new Compiler(g, {preallocNodes: opts?.preallocNodes}).compile();
  }

  if (names.length > 1) {
    throw new Error(
      `Source contains multiple grammars (${names.join(', ')}). ` +
        `Specify which to compile with {grammarName: '...'}.`
    );
  }

  return new Compiler(ns[names[0]], {preallocNodes: opts?.preallocNodes}).compile();
}

export function compileGrammars(
  source: string,
  opts?: CompileOptions
): Record<string, Uint8Array> {
  const result: Record<string, Uint8Array> = {};
  for (const [name, g] of Object.entries(parseGrammars(source))) {
    result[name] = new Compiler(g, {preallocNodes: opts?.preallocNodes}).compile();
  }
  return result;
}
