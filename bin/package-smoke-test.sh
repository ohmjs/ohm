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

npm install ohm-js@beta @ohm-js/compiler@beta webpack webpack-cli --silent

cat > test-ohm-js.mjs << 'EOF'
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
import {grammar} from '@ohm-js/compiler/compat';

const g = grammar(String.raw`
  Arithmetic {
    Expr = number "+" number
    number = digit+
  }
`);

g.match('42+17').use(r => assert(r.succeeded()));
g.match('hello').use(r => assert(r.failed()));
console.log('ohm-js: OK');
EOF

cat > test-wasm.mjs << 'EOF'
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
import {grammar} from '@ohm-js/compiler/compat';
import {createToAst} from 'ohm-js/compat';

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

cat > test-compiler-main.mjs << 'EOF'
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
import {Compiler, Grammar} from '@ohm-js/compiler';

assert(typeof Compiler === 'function', 'Compiler should be exported');
assert(typeof Grammar === 'function', 'Grammar (re-exported from ohm-js) should be exported');
console.log('@ohm-js/compiler (main): OK');
EOF

node test-ohm-js.mjs
node test-wasm.mjs
node test-compiler-main.mjs

# Webpack bundling tests

npx webpack --entry ./test-ohm-js.mjs -o dist/ohm-js --mode production 2>&1
node dist/ohm-js/main.js

npx webpack --entry ./test-wasm.mjs -o dist/wasm --mode production 2>&1
node dist/wasm/main.js

npx webpack --entry ./test-compiler-main.mjs -o dist/compiler-main --mode production 2>&1
node dist/compiler-main/main.js
