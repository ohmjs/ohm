import ohm from 'ohm-js';

declare function generateTypes(grammar: ohm.Grammar): string;
declare function getActionDecls(grammar: ohm.Grammar): string[];
