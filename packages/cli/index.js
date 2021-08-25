#!/usr/bin/env node

'use strict';

const {ohmCli} = require('./src/cli');
ohmCli(process.argv.slice(2));
