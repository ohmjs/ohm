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
const sections = extractSections(buf, {
  destImportCount: 1
});

let output = `function decodeBase64(str: string) {
  const bytes = atob(str)
  const result: number[] = []
  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes.charCodeAt(i)
  }
  return result
}

`;

for (const [secName, {entryCount, contents}] of Object.entries(sections)) {
  const base64Contents = Buffer.from(contents).toString('base64');
  output += `export const ${secName} = {
  entryCount: ${JSON.stringify(entryCount)},
  contents: decodeBase64(${JSON.stringify(base64Contents)})
}
`;
}
fs.writeFileSync(outputPath, output, 'utf8');
