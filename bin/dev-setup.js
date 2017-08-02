#!/usr/bin/env node
'use strict';

/* eslint no-console: 0 */

var fs = require('fs');

// Since .npmignore excludes .gitignore, we know that if the .gitignore file is
// present we must be in developer mode (i.e., installed manually).
var inDeveloperMode = fs.existsSync('.gitignore');

if (inDeveloperMode) {
  // "touch" a timestamp file
  fs.closeSync(fs.openSync('.install-timestamp', 'a'));

  // Install a merge driver called "ours" that is just an alias to `true`.
  // This is referenced by .gitattributes, to prevent conflicts with files
  // that are generated during the build process.
  var gitconfig = require('gitconfig');

  gitconfig
    .set({'merge.ours.driver': 'true'}, {location: 'local'})
    .catch(console.error);

  console.log('Developer setup complete.');
}
