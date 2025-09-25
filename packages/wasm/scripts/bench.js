import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {run, bench, group, summary} from 'mitata';
import * as ohm from 'ohm-js';

import * as es5js from '../../../examples/ecmascript/index.js';
import {toWasmGrammar} from '../test/_helpers.js';
import es5 from '../test/data/_es5.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const inputs = {
  bookReview: readFileSync(join(datadir, 'book-review.liquid'), 'utf-8'),
  featuredProduct: readFileSync(join(datadir, 'featured-product.liquid'), 'utf-8'),
  footer: readFileSync(join(datadir, 'footer.liquid'), 'utf-8'),
  mockJSON: readFileSync(join(datadir, 'json-org-examples.json'), 'utf-8'),
  html5shiv: readFileSync(join(datadir, '_html5shiv-3.7.3.js'), 'utf-8'),
  underscore: readFileSync(join(datadir, '_underscore-1.8.3.js'), 'utf-8'),
};

const liquid = ohm.grammars(readFileSync(join(datadir, 'liquid-html.ohm'), 'utf8'));
const json = ohm.grammar(readFileSync(join(__dirname, '../../lang-json/json.ohm'), 'utf8'));

let liquidHtmlWasm;
let es5Wasm;
let jsonWasm;

group('ES5: html5shiv', () => {
  summary(() => {
    bench('Wasm', () => {
      es5Wasm.match(inputs.html5shiv).detach();
    });
    bench('JS', () => {
      es5js.grammar.match(inputs.html5shiv);
    });
  });
});

group('ES5: underscore', () => {
  summary(() => {
    bench('Wasm', () => {
      es5Wasm.match(inputs.underscore).detach();
    });
    bench('JS', () => {
      es5js.grammar.match(inputs.underscore);
    });
  });
});

group('LiquidHTML: book-review.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      liquidHtmlWasm.match(inputs.bookReview).detach();
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.bookReview);
    });
  });
});

group('LiquidHTML: featured-product.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      liquidHtmlWasm.match(inputs.featuredProduct).detach();
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.featuredProduct);
    });
  });
});

group('LiquidHTML: footer.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      liquidHtmlWasm.match(inputs.footer).detach();
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.footer);
    });
  });
});

group('JSON', () => {
  summary(() => {
    bench('Wasm', () => {
      jsonWasm.match(inputs.mockJSON).detach();
    });
    bench('JS', () => {
      json.match(inputs.mockJSON);
    });
  });
});

(async () => {
  // Note: we are deliberately creating one instance of the matcher that's
  // reused. This takes advantage of JIT tier-up, and approximates usage
  // in a long-running process, e.g. LSP server.
  liquidHtmlWasm = await toWasmGrammar(
    liquid.LiquidHTML,
    readFileSync(join(__dirname, '../build/liquid-html.wasm'))
  );
  es5Wasm = await toWasmGrammar(es5, readFileSync(join(__dirname, '../build/es5.wasm')));
  jsonWasm = await toWasmGrammar(json, readFileSync(join(__dirname, '../build/json.wasm')));

  await run();
})();
