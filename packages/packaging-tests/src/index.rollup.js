import greeting from './greeting-esm.ohm-bundle';

console.log(greeting.match('Hello!').succeeded() ? 'success!' : 'oh no');
