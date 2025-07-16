import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {run, bench, group, summary} from 'mitata';
import * as ohm from 'ohm-js';

import es5js from '../../../examples/ecmascript/index.js';
import {wasmMatcherForGrammar} from '../test/_helpers.js';
import es5 from '../test/data/_es5.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const inputs = {
  bookReview: readFileSync(join(datadir, '_book-review.liquid'), 'utf-8'),
  featuredProduct: readFileSync(join(datadir, '_featured-product.liquid'), 'utf-8'),
  footer: readFileSync(join(datadir, '_footer.liquid'), 'utf-8'),
  html5shiv: readFileSync(join(datadir, '_html5shiv-3.7.3.js'), 'utf-8'),
  underscore: readFileSync(join(datadir, '_underscore-1.8.3.js'), 'utf-8')
};

const liquid = ohm.grammars(readFileSync(join(datadir, '_liquid-html.ohm'), 'utf8'));

let liquidHtmlMatcher;
let es5Matcher;

function checkOk(val) {
  if (!val) {
    throw new Error('Expected non-zero value');
  }
  return val;
}

function matchWithInput(m, input) {
  m.setInput(input);
  return checkOk(m.match());
}

group('ES5: html5shiv', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(es5Matcher, inputs.html5shiv);
    });
    bench('JS', () => {
      es5js.grammar.match(inputs.html5shiv);
    });
  });
});

group('ES5: underscore', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(es5Matcher, inputs.underscore);
    });
    bench('JS', () => {
      es5js.grammar.match(inputs.underscore);
    });
  });
});

group('LiquidHTML: book-review.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(liquidHtmlMatcher, inputs.bookReview);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.bookReview);
    });
  });
});

group('LiquidHTML: featured-product.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(liquidHtmlMatcher, inputs.featuredProduct);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.featuredProduct);
    });
  });
});

group('LiquidHTML: footer.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(liquidHtmlMatcher, inputs.footer);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.footer);
    });
  });
});

(async () => {
  // Note: we are deliberately creating one instance of the matcher that's
  // reused. This takes advantage of JIT tier-up, and approximates usage
  // in a long-running process, e.g. LSP server.
  liquidHtmlMatcher = await wasmMatcherForGrammar(
    liquid.LiquidHTML,
    readFileSync(join(__dirname, '../build/liquid-html.wasm'))
  );
  es5Matcher = await wasmMatcherForGrammar(
    es5,
    readFileSync(join(__dirname, '../build/es5.wasm'))
  );

  await run();
})();
