/**
 * Configuration type definitions for the Drizzle Repository Codegen Framework.
 *
 * This module provides comprehensive configuration interfaces and validation
 * types for repository generation, supporting all database dialects and
 * customization options.
 *
 * @since 0.1.0
 */

import type { DatabaseDialect } from './repository.js';

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
 *   logging: true,
 *   pagination: {
 *     defaultLimit: 20,
 *     maxLimit: 100
 *   }
 * };
 * ```
 *
 * @since 0.1.0
 */
export interface RepositoryCodegenConfig {
    /** Database dialect - determines imports and table types */
    dialect: DatabaseDialect;

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

    /** Optional: File naming conventions */
    naming?: {
        /** Suffix for generated base repository classes */
        baseRepositorySuffix?: string;

        /** Suffix for concrete repository classes */
        repositorySuffix?: string;

        /** Whether to use PascalCase for class names */
        usePascalCase?: boolean;
    };

    /** Optional: Import path configurations */
    imports?: {
        /** Custom path for Drizzle ORM imports */
        drizzleOrmPath?: string;

        /** Custom path for schema imports */
        schemaImportPath?: string;

        /** Additional custom imports to include */
        additionalImports?: string[];
    };

    /** Optional: Generation feature flags */
    features?: {
        /** Generate relationship loading methods */
        relationships?: boolean;

        /** Generate audit trail methods */
        auditTrail?: boolean;

        /** Generate validation hooks */
        validation?: boolean;

        /** Generate caching methods */
        caching?: boolean;
    };

    /** Optional: TypeScript generation options */
    typescript?: {
        /** Enable strict null checks in generated code */
        strictNullChecks?: boolean;

        /** Target TypeScript version */
        target?: 'ES2020' | 'ES2021' | 'ES2022' | 'ESNext';

        /** Module system to use */
        moduleSystem?: 'ESM' | 'CommonJS';

        /** Generate declaration files */
        generateDeclarations?: boolean;
    };
}

/**
 * Configuration validation result with detailed error information.
 *
 * Provides comprehensive validation feedback including specific errors,
 * warnings, and suggestions for configuration improvements.
 *
 * @since 0.1.0
 */
export interface ConfigValidationResult {
    /** Whether the configuration is valid */
    isValid: boolean;

    /** Array of validation errors that must be fixed */
    errors: ConfigValidationError[];

    /** Array of warnings that should be addressed */
    warnings: ConfigValidationWarning[];

    /** Resolved configuration with defaults applied */
    resolvedConfig?: RepositoryCodegenConfig;
}

/**
 * Detailed validation error with context and suggestions.
 *
 * Provides specific information about configuration errors including
 * the problematic field, error type, and suggested fixes.
 *
 * @since 0.1.0
 */
export interface ConfigValidationError {
    /** Configuration field that has the error */
    field: keyof RepositoryCodegenConfig | string;

    /** Type of validation error */
    type: 'required' | 'invalid' | 'conflict' | 'path' | 'range';

    /** Human-readable error message */
    message: string;

    /** Current value that caused the error */
    currentValue?: unknown;

    /** Expected value or format */
    expectedValue?: unknown;

    /** Suggested fix for the error */
    suggestion?: string;
}

/**
 * Configuration warning for non-critical issues.
 *
 * Provides information about configuration choices that work but
 * may not be optimal or may cause issues in certain scenarios.
 *
 * @since 0.1.0
 */
export interface ConfigValidationWarning {
    /** Configuration field that has the warning */
    field: keyof RepositoryCodegenConfig | string;

    /** Type of warning */
    type: 'deprecated' | 'performance' | 'compatibility' | 'convention';

    /** Human-readable warning message */
    message: string;

    /** Current value that triggered the warning */
    currentValue?: unknown;

    /** Recommended value or approach */
    recommendedValue?: unknown;

    /** Additional context or explanation */
    context?: string;
}

/**
 * Default configuration values for repository generation.
 *
 * Provides sensible defaults that work out-of-the-box for most projects
 * while allowing full customization when needed.
 *
 * @since 0.1.0
 */
export interface DefaultConfigValues {
    /** Default transaction timeout (30 seconds) */
    readonly transactionTimeout: 30000;

    /** Default pagination settings */
    readonly pagination: {
        readonly defaultLimit: 20;
        readonly maxLimit: 100;
    };

    /** Default naming conventions */
    readonly naming: {
        readonly baseRepositorySuffix: 'Repository';
        readonly repositorySuffix: 'Repository';
        readonly usePascalCase: true;
    };

    /** Default feature flags */
    readonly features: {
        readonly relationships: false;
        readonly auditTrail: false;
        readonly validation: false;
        readonly caching: false;
    };

    /** Default TypeScript options */
    readonly typescript: {
        readonly strictNullChecks: true;
        readonly target: 'ES2022';
        readonly moduleSystem: 'ESM';
        readonly generateDeclarations: true;
    };

    /** Default file paths */
    readonly paths: {
        readonly configFileName: 'repository.codegen.config.ts';
        readonly schemaGlob: './src/schema/*.ts';
        readonly outputPath: './src/repositories/generated';
        readonly basePath: './src/repositories/base';
    };
}

/**
 * Runtime configuration state for the repository generation system.
 *
 * Tracks the current configuration state, validation status, and
 * provides access to resolved configuration values during generation.
 *
 * @since 0.1.0
 */
export interface ConfigurationManager {
    /** Currently loaded configuration */
    current: RepositoryCodegenConfig | null;

    /** Last validation result */
    lastValidation: ConfigValidationResult | null;

    /** Configuration file path */
    configPath: string | null;

    /** Whether configuration has been loaded */
    isLoaded: boolean;

    /** Whether configuration has unsaved changes */
    isDirty: boolean;

    /** Load configuration from file */
    load(path?: string): Promise<ConfigValidationResult>;

    /** Validate current configuration */
    validate(): ConfigValidationResult;

    /** Save configuration to file */
    save(path?: string): Promise<void>;

    /** Reset to default configuration */
    reset(): void;

    /** Merge configuration changes */
    merge(partial: Partial<RepositoryCodegenConfig>): ConfigValidationResult;

    /** Get resolved configuration with defaults */
    getResolved(): RepositoryCodegenConfig;
}

/**
 * Configuration loading options for different scenarios.
 *
 * Provides flexible options for loading configuration in different
 * environments and use cases.
 *
 * @since 0.1.0
 */
export interface ConfigLoadOptions {
    /** Path to configuration file */
    path?: string;

    /** Whether to validate after loading */
    validate?: boolean;

    /** Whether to apply defaults for missing values */
    applyDefaults?: boolean;

    /** Whether to create file if it doesn't exist */
    createIfMissing?: boolean;

    /** Environment variables to consider */
    envOverrides?: Record<string, string>;

    /** CLI options to merge */
    cliOverrides?: Partial<RepositoryCodegenConfig>;
}

/**
 * Configuration schema for runtime validation and IDE support.
 *
 * Provides JSON schema definition for configuration validation
 * and IDE autocompletion support.
 *
 * @since 0.1.0
 */
export interface ConfigSchema {
    /** JSON Schema version */
    $schema: string;

    /** Schema title */
    title: string;

    /** Schema description */
    description: string;

    /** Root schema type */
    type: 'object';

    /** Required properties */
    required: (keyof RepositoryCodegenConfig)[];

    /** Property definitions */
    properties: Record<keyof RepositoryCodegenConfig, unknown>;

    /** Additional properties policy */
    additionalProperties: boolean;
}
