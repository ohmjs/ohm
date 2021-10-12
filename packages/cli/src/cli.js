'use strict';

const {Command} = require('commander');

const {version} = require('../package.json');
const commands = require('./commands');

function ohmCli(userArgs, optsForTesting = {}) {
  const program = new Command();
  program.name('ohm').version(version, '-v, --version').option('-n, --dryRun', '');

  if (optsForTesting.noProcessExit) {
    program.exitOverride();
  }

  commands.forEach(({command, description, options, action}) => {
    const cmd = program.command(command).description(description).action(action);
    if (options) {
      options.forEach(arr => cmd.option(...arr));
    }
  });

  program.parse(userArgs, {from: 'user'});
}

module.exports = {
  ohmCli,
};
