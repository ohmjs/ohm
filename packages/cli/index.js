#!/usr/bin/env node
/* eslint-env node */

'use strict';

const {ohmCli} = require('./src/cli');
ohmCli(process.argv.slice(2));
