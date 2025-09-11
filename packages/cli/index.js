#!/usr/bin/env node
import process from 'node:process';
import {ohmCli} from './src/cli.js';

ohmCli(process.argv.slice(2));
