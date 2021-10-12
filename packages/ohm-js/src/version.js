/* global __GLOBAL_OHM_VERSION__ */

'use strict';

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see webpack.config.js).
module.exports =
  typeof __GLOBAL_OHM_VERSION__ === 'string' ?
    __GLOBAL_OHM_VERSION__ :
    require('../package.json').version;
