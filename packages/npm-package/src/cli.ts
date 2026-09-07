#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('anti-slop')
  .description('CLI tool for anti-slop dev')
  .version('0.0.1');

program
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from anti-slop CLI!');
  });

program.parse();
