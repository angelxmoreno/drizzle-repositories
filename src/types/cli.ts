/**
 * CLI-specific type definitions for the Drizzle Repository Codegen Framework.
 *
 * This module contains all type definitions related to command-line interface
 * operations, options, and configuration structures used throughout the CLI.
 *
 * @since 0.1.0
 */

/**
 * Common CLI options available across all commands.
 *
 * These options provide consistent behavior and configuration capabilities
 * for all CLI commands in the repository generation system.
 *
 * @example
 * ```typescript
 * const options: CLIOptions = {
 *   config: './custom.config.ts',
 *   verbose: true,
 *   dryRun: false
 * };
 * ```
 *
 * @since 0.1.0
 */
export interface CLIOptions {
    /** Path to configuration file (default: repository.codegen.config.ts) */
    config?: string;

    /** Enable verbose logging output */
    verbose?: boolean;

    /** Preview changes without writing files */
    dryRun?: boolean;

    /** Watch mode for development */
    watch?: boolean;

    /** Skip generating concrete repository classes */
    skipConcrete?: boolean;
}

/**
 * Complete configuration structure for repository code generation.
 *
 * This interface defines all available configuration options for the
 * repository generation system, including database settings, file paths,
 * and generation behavior customization.
 *
 * @example
 * ```typescript
 * const config: RepositoryCodegenConfig = {
 *   dialect: 'pg',
 *   schemaPath: './src/schema/*.ts',
 *   outputPath: './src/repositories/generated',
 *   basePath: './src/repositories/base',
 *   logging: true
 * };
 * ```
 *
 * @since 0.1.0
 */
export interface RepositoryCodegenConfig {
    /** Database dialect - determines imports and table types */
    dialect: 'pg' | 'mysql' | 'sqlite';

    /** Path to Drizzle schema files (supports glob patterns) */
    schemaPath: string;

    /** Output directory for generated repositories */
    outputPath: string;

    /** Output directory for base repository classes */
    basePath: string;

    /** Optional: Enable logging */
    logging?: boolean;

    /** Optional: Skip generating concrete repository classes */
    skipConcreteRepositories?: boolean;

    /** Optional: Custom base repository class name */
    baseRepositoryClassName?: string;

    /** Optional: Transaction timeout in milliseconds */
    transactionTimeout?: number;

    /** Optional: Pagination defaults */
    pagination?: {
        defaultLimit: number;
        maxLimit: number;
    };
}
