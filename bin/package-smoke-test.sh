#!/bin/bash
set -e

TEMP_DIR=$(mktemp -d)
echo "Running smoke tests in $TEMP_DIR"

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

cd "$TEMP_DIR"

npm init -y > /dev/null

npm install ohm-js @ohm-js/wasm --silent

cat > test-ohm-js.mjs << 'EOF'
import assert from 'node:assert';
import * as ohm from 'ohm-js';

const grammar = ohm.grammar(String.raw`
  Arithmetic {
    Expr = number "+" number
    number = digit+
  }
`);

assert(grammar.match('42+17').succeeded());
assert(grammar.match('hello').failed());
console.log('ohm-js: OK');
EOF

cat > test-wasm.mjs << 'EOF'
import assert from 'node:assert';
import {grammar, createToAst} from '@ohm-js/wasm/compat';

const g = grammar(String.raw`
  Arithmetic {
    Expr = AddExp
    AddExp = number "+" number  -- plus
           | number
    number = digit+
  }
`);

const match = g.match('1+2');
assert(match.succeeded());

const toAst = createToAst({AddExp_plus: {left: 0, right: 2}});
const ast = toAst(match);
assert.deepStrictEqual(ast, {type: 'AddExp_plus', left: '1', right: '2'});
console.log('@ohm-js/wasm: OK');
EOF

node test-ohm-js.mjs
node test-wasm.mjs
