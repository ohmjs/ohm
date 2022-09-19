asdflakj f;askdf;

import ohm from './src/main.js';
import extras from './extras/index.js';

// Make extras is a separate, named export so that consumers of this
// module don't have to bundle it unless they are using it.
export {extras};
export default ohm;
