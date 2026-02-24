import {Compiler} from './Compiler.ts';
import {grammars as parseGrammars} from './parseGrammars.ts';

export function compile(source: string): Uint8Array {
  const ns = parseGrammars(source);
  const names = Object.keys(ns).sort();

  if (names.length === 0) {
    throw new Error('No grammars found in source');
  }

  if (names.length > 1) {
    throw new Error(
      `Source contains multiple grammars (${names.join(', ')}). ` +
        `Specify which to compile with compileGrammars().`
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
