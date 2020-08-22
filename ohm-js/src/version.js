/* global browserifyGlobalOhmVersion */

'use strict';

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see bin/build-debug.js).
module.exports = typeof browserifyGlobalOhmVersion === 'string'
    ? browserifyGlobalOhmVersion
    : require('../package.json').version;
