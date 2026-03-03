import {describe, it} from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {grammar} from '@ohm-js/compiler/compat';

import {createMatcher} from '../tokenizer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = relPath => path.join(__dirname, relPath);

const ohmSource = fs.readFileSync(resolve('../python3.ohm'), 'utf-8');
const python = grammar(ohmSource);
const matchPython = createMatcher(python);

describe('Python grammar', () => {
  it('should compile the grammar without errors', () => {
    assert.ok(python);
    assert.ok(
      python.name.endsWith('Python3'),
      `Expected name to end with 'Python3', got: ${JSON.stringify(python.name)}`
    );
  });

  it('should parse a simple assignment', () => {
    const result = matchPython('x = 1\n');
    result.use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse a function with indentation', () => {
    const input = [
      'def greet(name):',
      '    if name == "world":',
      '        print("Hello, world!")',
      '    else:',
      '        print("Hi, " + name)',
      '',
      'x = 42',
      '',
    ].join('\n');
    const result = matchPython(input);
    result.use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse argparse.py', () => {
    const input = fs.readFileSync(resolve('data/argparse.py'), 'utf-8');
    const result = matchPython(input);
    result.use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });
});
