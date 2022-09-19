import * as mainExports from './src/main.js';
//import * as extras from './extras/index.js';

// Add the extras on here, rather than in src/main.js, so that the ES
// module (see index.mjs) can make it a separate, named export.

export default {
  ...mainExports
  //  extras
};
