import greeting from './greeting.ohm-bundle';

console.log(greeting.match('Hello!').succeeded() ? 'success!' : 'oh no');
