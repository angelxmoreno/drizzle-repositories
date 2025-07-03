#!/usr/bin/env node

/**
 * Main CLI entry point for the Drizzle Repository Codegen Framework.
 *
 * This module provides the primary command-line interface for generating
 * type-safe, extensible repository classes from Drizzle ORM schema files.
 * It supports multiple database dialects and provides comprehensive
 * code generation capabilities.
 *
 * @since 0.1.0
 */

import { Command } from 'commander';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { InitCommand } from './commands/InitCommand.js';
import { ValidateCommand } from './commands/ValidateCommand.js';

/**
 * Creates and configures the main CLI program with all available commands.
 *
 * This function sets up the Commander.js program with the complete command
 * structure including generate, init, and validate commands. Each command
 * is properly registered with its options and action handlers.
 *
 * @returns Configured Commander.js program ready for argument parsing
 *
 * @example
 * ```typescript
 * const program = createCLI();
 * await program.parseAsync(process.argv);
 * ```
 *
 * @since 0.1.0
 */
export function createCLI(): Command {
    const program = new Command();

    program
        .name('drizzle-repositories')
        .description('Type-safe, extensible repository classes for Drizzle ORM')
        .version('0.1.0');

    // Register commands
    program.addCommand(new GenerateCommand());
    program.addCommand(new InitCommand());
    program.addCommand(new ValidateCommand());

    return program;
}

/**
 * Main CLI execution function.
 *
 * This function creates the CLI program and executes it with the provided
 * command-line arguments. It handles the complete command parsing and
 * execution workflow.
 *
 * @throws {Error} When command execution fails or invalid arguments are provided
 *
 * @example
 * ```typescript
 * // Execute the CLI with current process arguments
 * await main();
 * ```
 *
 * @since 0.1.0
 */
export async function main(): Promise<void> {
    const program = createCLI();
    await program.parseAsync(process.argv);
}

// Note: When used as a binary, execution is handled by src/cli.ts
