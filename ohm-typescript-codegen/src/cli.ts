import fastGlob from 'fast-glob';
import fs from 'fs';
import minimist from 'minimist';
import path from 'path';

import {generateTypings} from './generateTypings';

export interface Options extends Omit<minimist.ParsedArgs, '_'> {
  cwd?: string;
  dryRun?: boolean;
}

class Plan {
  plan = {filesToWrite: Object.create(null) as {[filename: string]: string}};

  write(filename: string, contents: string): void {
    this.plan.filesToWrite[filename] = contents;
  }
}

const defaultWriter = {
  write(filename: string, contents: string): void {
    console.log(filename);
    fs.writeFileSync(filename, contents);
  }
};

export function main(patterns: string[], {cwd, dryRun}: Options) {
  const plan = new Plan();
  const writer = dryRun ? plan : defaultWriter;

  for (const sourceFilename of fastGlob.sync(patterns, {cwd})) {
    const sourcePath = cwd ? path.join(cwd, sourceFilename) : sourceFilename;
    const grammarSource = fs.readFileSync(sourcePath, 'utf-8');
    const {filename, contents} = generateTypings(grammarSource, sourceFilename);
    writer.write(`${sourceFilename}.d.ts`, contents);
  }

  return plan.plan;
}

const {_: patterns, ...options} = minimist(process.argv.slice(2), {'--': false});
main(patterns, options);
