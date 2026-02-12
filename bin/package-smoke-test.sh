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

npm install ohm-js @ohm-js/compiler @ohm-js/runtime webpack webpack-cli --silent

cat > test-ohm-js.mjs << 'EOF'
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
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
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
import {grammar} from '@ohm-js/compiler/compat';
import {createToAst} from '@ohm-js/runtime/compat';

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
assert(ast.type === 'AddExp_plus' && ast.left === '1' && ast.right === '2');
console.log('@ohm-js/compiler: OK');
EOF

node test-ohm-js.mjs
node test-wasm.mjs

# Webpack bundling tests

npx webpack --entry ./test-ohm-js.mjs -o dist/ohm-js --mode production 2>&1
node dist/ohm-js/main.js

npx webpack --entry ./test-wasm.mjs -o dist/wasm --mode production 2>&1
node dist/wasm/main.js
