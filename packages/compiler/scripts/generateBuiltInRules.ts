// Generates src/built-in-rules.ts from ohm-js-legacy's built-in-rules.ohm.
// Run: node scripts/generateBuiltInRules.ts

import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

import * as ohm from 'ohm-js-legacy';

const {pexprs} = ohm;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ohmFile = join(__dirname, '../../ohm-js/src/built-in-rules.ohm');
const outFile = join(__dirname, '../src/built-in-rules.ts');

const source = readFileSync(ohmFile, 'utf8');
const g = ohm.grammar(source);

function pexprToCode(expr: any): string {
  if (expr instanceof pexprs.Alt) {
    return `new pexprs.Alt([${expr.terms.map(pexprToCode).join(', ')}])`;
  }
  if (expr instanceof pexprs.Seq) {
    return `new pexprs.Seq([${expr.factors.map(pexprToCode).join(', ')}])`;
  }
  if (expr instanceof pexprs.Star) return `new pexprs.Star(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Plus) return `new pexprs.Plus(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Opt) return `new pexprs.Opt(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Not) return `new pexprs.Not(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Lookahead)
    return `new pexprs.Lookahead(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Lex) return `new pexprs.Lex(${pexprToCode(expr.expr)})`;
  if (expr instanceof pexprs.Apply) {
    const args = expr.args.length > 0 ? `, [${expr.args.map(pexprToCode).join(', ')}]` : '';
    return `new pexprs.Apply(${JSON.stringify(expr.ruleName)}${args})`;
  }
  if (expr instanceof pexprs.Terminal)
    return `new pexprs.Terminal(${JSON.stringify(expr.obj)})`;
  if (expr instanceof pexprs.Range) {
    return `new pexprs.Range(${JSON.stringify(expr.from)}, ${JSON.stringify(expr.to)})`;
  }
  if (expr instanceof pexprs.Param) return `new pexprs.Param(${expr.index})`;
  throw new Error(`Unhandled PExpr type: ${expr.constructor.name}`);
}

const lines: string[] = [];
lines.push('// Auto-generated from built-in-rules.ohm — do not edit.');
lines.push('// Regenerate with: node scripts/generateBuiltInRules.ts');
lines.push('');
lines.push("import * as pexprs from 'ohm-js-legacy/src/pexprs-build.js';");
lines.push("import {Grammar} from 'ohm-js-legacy/src/Grammar.js';");
lines.push("import {GrammarDecl} from 'ohm-js-legacy/src/GrammarDecl.js';");
lines.push('');
lines.push("const decl = new GrammarDecl('BuiltInRules');");
lines.push('decl.withSuperGrammar(Grammar.ProtoBuiltInRules);');
lines.push('');

const protoRules = g.superGrammar.rules;
for (const name of Object.keys(g.rules)) {
  if (name in protoRules) continue;
  const {formals, description, body} = g.rules[name];
  const formalsStr = formals.length > 0 ? JSON.stringify(formals) : '[]';
  const descStr = description != null ? JSON.stringify(description) : 'undefined';
  lines.push(
    `decl.define(${JSON.stringify(name)}, ${formalsStr}, ${pexprToCode(body)}, ${descStr});`
  );
}

lines.push('');
lines.push('export default decl.build();');
lines.push('');

writeFileSync(outFile, lines.join('\n'));
console.log(`Wrote ${outFile}`);
