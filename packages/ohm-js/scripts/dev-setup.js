#!/usr/bin/env node

'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

// Return code from `git config` indicating that the key is invalid.
const RET_CODE_INVALID_KEY = 1;

// Since .npmignore excludes .gitignore, we know that if the .gitignore file is
// present we must be in developer mode (i.e., installed manually).
const inDeveloperMode = fs.existsSync('.gitignore');

if (inDeveloperMode) {
  // "touch" a timestamp file
  fs.writeFileSync('.install-timestamp', '');

  // Install a merge driver called "ours" that is just an alias to `true`.
  // This is referenced by .gitattributes, to prevent conflicts with files
  // that are generated during the build process.

  const execOpts = {stdio: ['inherit', 'ignore', 'inherit']};

  function done() {
    console.log('Developer setup complete.'); // eslint-disable-line no-console
  }

  // If merge.ours.driver is not set, set it to true.
  exec('git config --get merge.ours.driver', execOpts, err => {
    if (!err) {
      done();
    } else if (err.code === RET_CODE_INVALID_KEY) {
      exec('git config --add merge.ours.driver true', execOpts, err2 => {
        if (!err2) {
          done();
        }
      });
    }
  });
}
