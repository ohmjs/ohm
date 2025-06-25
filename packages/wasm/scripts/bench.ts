import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {run, bench, group, summary} from 'mitata';
import * as ohm from 'ohm-js';

import es5js from '../../../examples/ecmascript/index.js';
import {makeEs5Matcher, wasmMatcherForGrammar} from '../test/_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const inputs = {
  bookReview: readFileSync(join(datadir, '_book-review.liquid'), 'utf-8'),
  featuredProduct: readFileSync(join(datadir, '_featured-product.liquid'), 'utf-8'),
  footer: readFileSync(join(datadir, '_footer.liquid'), 'utf-8'),
  html5shiv: readFileSync(join(datadir, '_html5shiv-3.7.3.js'), 'utf-8'),
  underscore: readFileSync(join(datadir, '_underscore-1.8.3.js'), 'utf-8')
};

const es5Matcher = await makeEs5Matcher();

function matchWithInput(m, input) {
  m.setInput(input);
  return m.match();
}

const liquid = ohm.grammars(readFileSync(join(datadir, '_liquid-html.ohm'), 'utf8'));
const liquidMatcher = await wasmMatcherForGrammar(liquid.LiquidHTML);

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
      matchWithInput(liquidMatcher, inputs.bookReview);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.bookReview);
    });
  });
});

group('LiquidHTML: featured-product.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(liquidMatcher, inputs.featuredProduct);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.featuredProduct);
    });
  });
});

group('LiquidHTML: footer.liquid', () => {
  summary(() => {
    bench('Wasm', () => {
      matchWithInput(liquidMatcher, inputs.footer);
    });
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.footer);
    });
  });
});

await run();
