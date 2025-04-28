import * as w from '@wasmgroundup/emit';
import wabt from 'wabt';

const { instr } = w;

export class Compiler {
  constructor(grammar) {
    this.grammar = grammar;
    this.ruleIdxByName = new Map(
      Object.keys(grammar.rules).map((name, i) => [name, i + 1]),
    );
  }

  compile() {
    return buildModule(
      [],
      this.functionDecls()
    );
  }

  compileRule(name, info) {
    return {
      name: `$${name}`,
      paramTypes: [],
      resultType: w.valtype.i32,
      locals: [],
      body: [info.body.toWasm(this), instr.end],
    }
  }

  functionDecls() {
    return [
      {
        name: 'match',
        paramTypes: [],
        resultType: w.valtype.i32,
        locals: [],
        body: [instr.i32.const, w.i32(1), instr.end],
      },
      ...Object.entries(this.grammar.rules).map(([name, info]) => {
        return this.compileRule(name, info);
      })
    ]
  }
}

export async function buildModule(importDecls, functionDecls) {
  const types = functionDecls.map(f =>
    w.functype(f.paramTypes, [f.resultType]),
  );
  const imports = importDecls.map((f, i) =>
    w.import_(f.module, f.name, w.importdesc.func(i)),
  );
  const funcs = functionDecls.map((f, i) => w.typeidx(i));
  const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));
  const exports = functionDecls.map((f, i) =>
    w.export_(f.name, w.exportdesc.func(i))
  );

  const mod = w.module([
    w.typesec(types),
    w.importsec(imports),
    w.funcsec(funcs),
    w.exportsec(exports),
    w.codesec(codes),
  ]);
  const bytes =Uint8Array.from(mod.flat(Infinity));
  const { readWasm } = await wabt();
  const m = await readWasm(bytes, { check: true });
  m.validate();
  return bytes;
}
