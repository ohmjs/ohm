import greeting from './greeting.ohm-bundle';

// eslint-disable-next-line no-console
console.log(greeting.match('Hello!').succeeded() ? 'success!' : 'oh no');
