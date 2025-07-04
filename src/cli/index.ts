#!/usr/bin/env node

import { Command } from 'commander';
import pino from 'pino';
import { GenerateCommand } from './commands/GenerateCommand.ts';
import { InitCommand } from './commands/InitCommand.ts';

const cliLogger = pino();
const program = new Command();

program
    .name('drizzle-repositories')
    .description('Type-safe, extensible repository classes for Drizzle ORM')
    .version('0.1.0');

// Register commands
program.addCommand(new GenerateCommand(cliLogger));
program.addCommand(new InitCommand(cliLogger));
program.parse();
