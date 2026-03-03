import {describe, it} from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {grammar} from '@ohm-js/compiler/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (relPath: string) => path.join(__dirname, relPath);

const ohmSource = fs.readFileSync(resolve('../json.ohm'), 'utf-8');
const json = grammar(ohmSource);

describe('JSON grammar', () => {
  it('should compile the grammar without errors', () => {
    assert.ok(json);
    assert.ok(
      json.name.endsWith('JSON'),
      `Expected name to end with 'JSON', got: ${JSON.stringify(json.name)}`
    );
  });

  it('should parse an empty object', () => {
    json.match('{}').use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse an empty array', () => {
    json.match('[]').use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse a string', () => {
    json.match('"hello"').use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse numbers', () => {
    for (const input of ['0', '42', '-1', '3.14', '1e10', '2.5E-3']) {
      json.match(input).use(r => {
        assert.ok(r.succeeded(), `Failed to parse ${input}: ${r.failed() ? r.message : ''}`);
      });
    }
  });

  it('should parse true, false, and null', () => {
    for (const input of ['true', 'false', 'null']) {
      json.match(input).use(r => {
        assert.ok(r.succeeded(), `Failed to parse ${input}: ${r.failed() ? r.message : ''}`);
      });
    }
  });

  it('should parse a simple object', () => {
    json.match('{"key": "value", "num": 42}').use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse nested structures', () => {
    const input = '{"a": [1, 2, {"b": true}], "c": null}';
    json.match(input).use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should parse strings with escape sequences', () => {
    const input = '"hello\\nworld\\t\\"escaped\\"\\u0041"';
    json.match(input).use(r => {
      assert.ok(r.succeeded(), r.failed() ? r.message : '');
    });
  });

  it('should reject invalid JSON', () => {
    for (const input of ['{key: "value"}', "'string'", '{,}']) {
      json.match(input).use(r => {
        assert.ok(r.failed(), `Expected parse to fail for: ${input}`);
      });
    }
  });
});
