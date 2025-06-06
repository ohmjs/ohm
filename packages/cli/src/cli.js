#!/usr/bin/env node

import {Command} from 'commander';

import fs from 'fs';
import commands from './commands/index.js';
import url from 'url';

const {version} = JSON.parse(fs.readFileSync(new url.URL('../package.json', import.meta.url)));

export function ohmCli(userArgs, optsForTesting = {}) {
  const program = new Command();
  program.name('ohm').version(version, '-v, --version').option('-n, --dryRun', '');

  if (optsForTesting.noProcessExit) {
    program.exitOverride();
  }

  commands.forEach(({command, description, options, requiredOptions, args, action}) => {
    const cmd = program.command(command).description(description).action(action);
    (options || []).forEach(arr => cmd.option(...arr));
    (requiredOptions || []).forEach(arr => cmd.requiredOption(...arr));
    (args || []).forEach(arr => cmd.argument(...arr));
  });

  program.parse(userArgs, {from: 'user'});
}
