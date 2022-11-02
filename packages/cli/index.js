#!/usr/bin/env node
/* eslint-env node */

const {ohmCli} = require('./src/cli');
ohmCli(process.argv.slice(2));
