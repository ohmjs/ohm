/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {convertToOhm} from '../convertToOhm.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const pegSource = fs.readFileSync(path.join(root, 'python-peg-grammar.txt'), 'utf-8');
const ohmSource = convertToOhm(pegSource);
fs.writeFileSync(path.join(root, 'python3.ohm'), ohmSource);
console.error('Wrote python3.ohm');
