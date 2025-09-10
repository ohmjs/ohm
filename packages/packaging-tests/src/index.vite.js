import greeting from './greeting-esm.ohm-bundle';

// eslint-disable-next-line no-console
console.log(greeting.match('Hello!').succeeded() ? 'success!' : 'oh no');
