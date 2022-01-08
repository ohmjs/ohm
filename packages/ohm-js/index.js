'use strict';

const ohm = require('./src/main');

// Add the extras on here, rather than in src/main.js, so that the ES
// module (see index.mjs) can make it a separate, named export.
ohm.extras = require('./extras');
module.exports = ohm;
