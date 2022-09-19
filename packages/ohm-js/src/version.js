/* global __GLOBAL_OHM_VERSION__ */

import {createRequire} from 'module';

const requireJson = createRequire(import.meta.url);

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see webpack.config.js).
export const version =
  typeof __GLOBAL_OHM_VERSION__ === 'string' ?
    __GLOBAL_OHM_VERSION__ :
    requireJson('../package.json').version;
