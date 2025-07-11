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
  underscore: readFileSync(join(datadir, '_underscore-1.8.3.js'), 'utf-8'),
};

const liquid = ohm.grammars(readFileSync(join(datadir, '_liquid-html.ohm'), 'utf8'));

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

const makeLiquidMatcher = async () => {
  return await wasmMatcherForGrammar(
      liquid.LiquidHTML,
      readFileSync(join(__dirname, '../build/liquid-html.wasm')),
  );
};
const makeEs5Matcher = async () => {
  return await wasmMatcherForGrammar(es5, readFileSync(join(__dirname, '../build/es5.wasm')));
};

function benchWithSetup(name, setupFn, benchFn) {
  bench(name, function* () {
    yield {
      [0]: setupFn,
      bench: benchFn,
    };
  });
}

group('ES5: html5shiv', () => {
  summary(() => {
    benchWithSetup('Wasm', makeEs5Matcher, m => matchWithInput(m, inputs.html5shiv));
    bench('JS', () => {
      es5js.grammar.match(inputs.html5shiv);
    });
  });
});

group('ES5: underscore', () => {
  summary(() => {
    benchWithSetup('Wasm', makeEs5Matcher, m => matchWithInput(m, inputs.underscore));
    bench('JS', () => {
      es5js.grammar.match(inputs.underscore);
    });
  });
});

group('LiquidHTML: book-review.liquid', () => {
  summary(() => {
    benchWithSetup('Wasm', makeLiquidMatcher, m => matchWithInput(m, inputs.bookReview));
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.bookReview);
    });
  });
});

group('LiquidHTML: featured-product.liquid', () => {
  summary(() => {
    benchWithSetup('Wasm', makeLiquidMatcher, m => matchWithInput(m, inputs.featuredProduct));
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.featuredProduct);
    });
  });
});

group('LiquidHTML: footer.liquid', () => {
  summary(() => {
    benchWithSetup('Wasm', makeLiquidMatcher, m => matchWithInput(m, inputs.footer));
    bench('JS', () => {
      liquid.LiquidHTML.match(inputs.footer);
    });
  });
});

(async () => await run())();
