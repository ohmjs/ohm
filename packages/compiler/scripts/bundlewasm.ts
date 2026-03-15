/* global process */

import * as fs from 'node:fs';
import {URL} from 'node:url';
import * as w from '@wasmgroundup/emit';

import {extractSections} from './modparse.ts';

/*
  Extracts the code section from the AssemblyScript release build
  and writes it to a .ts module in the same directory.
*/

const inputPath = process.argv[2];
const outputPath = inputPath + '_sections.ts';

const buf = fs.readFileSync(inputPath);
const sections = extractSections(buf);

let output = `const decodeBase64 = (str: string) => Array.from(atob(str), c => c.charCodeAt(0));

export const startFuncidx = ${sections.startFuncidx};
`;

output += `export const funcidxByName = ${JSON.stringify(sections.funcidxByName)};\n`;
output += `export const globalidxByName = ${JSON.stringify(sections.globalidxByName)};\n`;

const {funcidxByName, globalidxByName, startFuncidx, ...sectionEntries} = sections;
for (const [name, payload] of Object.entries(sectionEntries)) {
  const {entryCount, contents} = payload;
  const base64Contents = Buffer.from(contents).toString('base64');
  output += `export const ${name} = {
  entryCount: ${JSON.stringify(entryCount)},
  contents: decodeBase64(${JSON.stringify(base64Contents)})
}
`;
}
fs.writeFileSync(outputPath, output, 'utf8');
