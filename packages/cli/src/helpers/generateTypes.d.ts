import {Grammar, Namespace} from 'ohm-js';

declare function generateTypes(grammars: Namespace): string;
declare function getActionDecls(grammar: Grammar): string[];
