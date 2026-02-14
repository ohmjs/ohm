import {Grammar, Namespace} from 'ohm-js-legacy';

declare function generateTypes(grammars: Namespace): string;
declare function getActionDecls(grammar: Grammar): string[];
