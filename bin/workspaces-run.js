// A simple script to run the same npm command in each workspace.
// Eventually this will be supported by npm: https://github.com/npm/rfcs/pull/117
//
// Sample usage:
//   node workspaces-run.js test

const { spawnSync } = require('child_process');
const path = require('path');

// Read the workspaces from the top-level package.json
const { workspaces } = require('../package.json');

workspaces.forEach(wsPath => {  
  process.chdir(path.join(__dirname, '..', wsPath));

  // If the script exists in that workspace, run it.
  const args = process.argv.slice(2);
  const { scripts } = require(path.join(process.cwd(), 'package.json'));
  if (args[0] in scripts) {
    spawnSync('npm', ['run', ...args], {stdio: 'inherit'});
  }
});
