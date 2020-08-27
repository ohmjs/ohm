// An example showing how to use Ohm as an ECMAScript module in Node v12+.

import ohm from 'ohm-js';

const g = ohm.grammar('G { start = }');
g.match("");
