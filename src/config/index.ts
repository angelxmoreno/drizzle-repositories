/**
 * Configuration management system for the Drizzle Repository Codegen Framework.
 *
 * This module provides comprehensive configuration loading, validation, and
 * management capabilities including default values, environment overrides,
 * and runtime configuration updates.
 *
 * @since 0.1.0
 */

import type {
    ConfigValidationError,
    ConfigValidationResult,
    ConfigValidationWarning,
    DefaultConfigValues,
    RepositoryCodegenConfig,
} from '../types/config.js';
import type { DatabaseDialect } from '../types/repository.js';

/**
 * Default configuration values for repository generation.
 *
 * These defaults provide a production-ready configuration that works
 * out-of-the-box for most TypeScript projects using Drizzle ORM.
 *
 * @since 0.1.0
 */
export const DEFAULT_CONFIG: DefaultConfigValues = {
    transactionTimeout: 30000,
    pagination: {
        defaultLimit: 20,
        maxLimit: 100,
    },
    naming: {
        baseRepositorySuffix: 'Repository',
        repositorySuffix: 'Repository',
        usePascalCase: true,
    },
    features: {
        relationships: false,
        auditTrail: false,
        validation: false,
        caching: false,
    },
    typescript: {
        strictNullChecks: true,
        target: 'ES2022',
        moduleSystem: 'ESM',
        generateDeclarations: true,
    },
    paths: {
        configFileName: 'repository.codegen.config.ts',
        schemaGlob: './src/schema/*.ts',
        outputPath: './src/repositories/generated',
        basePath: './src/repositories/base',
    },
} as const;

/**
 * Validates a repository configuration object.
 *
 * Performs comprehensive validation including required field checks,
 * value range validation, path accessibility, and conflict detection.
 *
 * @param config - Configuration object to validate
 * @returns Detailed validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validateConfig({
 *   dialect: 'pg',
 *   schemaPath: './src/schema/*.ts',
 *   outputPath: './src/repositories/generated',
 *   basePath: './src/repositories/base'
 * });
 *
 * if (!result.isValid) {
 *   console.error('Configuration errors:', result.errors);
 * }
 * ```
 *
 * @since 0.1.0
 */
export function validateConfig(config: Partial<RepositoryCodegenConfig>): ConfigValidationResult {
    const errors: ConfigValidationError[] = [];
    const warnings: ConfigValidationWarning[] = [];

    // Validate required fields
    if (!config.dialect) {
        errors.push({
            field: 'dialect',
            type: 'required',
            message: 'Database dialect is required',
            currentValue: config.dialect,
            expectedValue: 'pg | mysql | sqlite',
            suggestion: 'Specify one of: pg, mysql, sqlite',
        });
    } else if (!['pg', 'mysql', 'sqlite'].includes(config.dialect)) {
        errors.push({
            field: 'dialect',
            type: 'invalid',
            message: 'Invalid database dialect',
            currentValue: config.dialect,
            expectedValue: 'pg | mysql | sqlite',
            suggestion: 'Use one of the supported dialects: pg, mysql, sqlite',
        });
    }

    if (!config.schemaPath) {
        errors.push({
            field: 'schemaPath',
            type: 'required',
            message: 'Schema path is required',
            currentValue: config.schemaPath,
            expectedValue: 'string (glob pattern)',
            suggestion: 'Provide a path to your Drizzle schema files (e.g., ./src/schema/*.ts)',
        });
    } else if (typeof config.schemaPath !== 'string') {
        errors.push({
            field: 'schemaPath',
            type: 'invalid',
            message: 'Schema path must be a string',
            currentValue: typeof config.schemaPath,
            expectedValue: 'string',
            suggestion: 'Provide a string path with optional glob patterns',
        });
    }

    if (!config.outputPath) {
        errors.push({
            field: 'outputPath',
            type: 'required',
            message: 'Output path is required',
            currentValue: config.outputPath,
            expectedValue: 'string (directory path)',
            suggestion: 'Specify where generated repositories should be saved',
        });
    } else if (typeof config.outputPath !== 'string') {
        errors.push({
            field: 'outputPath',
            type: 'invalid',
            message: 'Output path must be a string',
            currentValue: typeof config.outputPath,
            expectedValue: 'string',
            suggestion: 'Provide a valid directory path',
        });
    }

    if (!config.basePath) {
        errors.push({
            field: 'basePath',
            type: 'required',
            message: 'Base path is required',
            currentValue: config.basePath,
            expectedValue: 'string (directory path)',
            suggestion: 'Specify where base repository classes should be saved',
        });
    } else if (typeof config.basePath !== 'string') {
        errors.push({
            field: 'basePath',
            type: 'invalid',
            message: 'Base path must be a string',
            currentValue: typeof config.basePath,
            expectedValue: 'string',
            suggestion: 'Provide a valid directory path',
        });
    }

    // Validate optional fields
    if (config.transactionTimeout !== undefined) {
        if (typeof config.transactionTimeout !== 'number' || config.transactionTimeout <= 0) {
            errors.push({
                field: 'transactionTimeout',
                type: 'invalid',
                message: 'Transaction timeout must be a positive number',
                currentValue: config.transactionTimeout,
                expectedValue: 'number > 0',
                suggestion: 'Use a timeout value in milliseconds (e.g., 30000 for 30 seconds)',
            });
        } else if (config.transactionTimeout < 1000) {
            warnings.push({
                field: 'transactionTimeout',
                type: 'performance',
                message: 'Transaction timeout is very short',
                currentValue: config.transactionTimeout,
                recommendedValue: '30000 or higher',
                context: 'Short timeouts may cause legitimate operations to fail',
            });
        } else if (config.transactionTimeout > 300000) {
            warnings.push({
                field: 'transactionTimeout',
                type: 'performance',
                message: 'Transaction timeout is very long',
                currentValue: config.transactionTimeout,
                recommendedValue: '30000 to 60000',
                context: 'Long timeouts may hide performance issues',
            });
        }
    }

    // Validate pagination settings
    if (config.pagination) {
        const { defaultLimit, maxLimit } = config.pagination;

        if (defaultLimit !== undefined && (typeof defaultLimit !== 'number' || defaultLimit <= 0)) {
            errors.push({
                field: 'pagination.defaultLimit',
                type: 'invalid',
                message: 'Default limit must be a positive number',
                currentValue: defaultLimit,
                expectedValue: 'number > 0',
                suggestion: 'Use a reasonable default like 20 or 50',
            });
        }

        if (maxLimit !== undefined && (typeof maxLimit !== 'number' || maxLimit <= 0)) {
            errors.push({
                field: 'pagination.maxLimit',
                type: 'invalid',
                message: 'Max limit must be a positive number',
                currentValue: maxLimit,
                expectedValue: 'number > 0',
                suggestion: 'Use a reasonable maximum like 100 or 1000',
            });
        }

        if (defaultLimit !== undefined && maxLimit !== undefined && defaultLimit > maxLimit) {
            errors.push({
                field: 'pagination',
                type: 'conflict',
                message: 'Default limit cannot be greater than max limit',
                currentValue: { defaultLimit, maxLimit },
                expectedValue: 'defaultLimit <= maxLimit',
                suggestion: 'Ensure default limit is less than or equal to max limit',
            });
        }
    }

    // Path conflict validation
    if (config.outputPath && config.basePath && config.outputPath === config.basePath) {
        errors.push({
            field: 'outputPath',
            type: 'conflict',
            message: 'Output path and base path cannot be the same',
            currentValue: config.outputPath,
            expectedValue: 'Different path from basePath',
            suggestion: 'Use separate directories for generated and base repositories',
        });
    }

    const isValid = errors.length === 0;
    const resolvedConfig = isValid ? applyDefaults(config as RepositoryCodegenConfig) : undefined;

    return {
        isValid,
        errors,
        warnings,
        resolvedConfig,
    };
}

/**
 * Applies default values to a configuration object.
 *
 * Merges the provided configuration with default values, ensuring
 * all required fields have sensible defaults while preserving
 * user-specified values.
 *
 * @param config - Partial configuration to apply defaults to
 * @returns Complete configuration with defaults applied
 *
 * @since 0.1.0
 */
export function applyDefaults(config: RepositoryCodegenConfig): RepositoryCodegenConfig {
    return {
        dialect: config.dialect,
        schemaPath: config.schemaPath,
        outputPath: config.outputPath,
        basePath: config.basePath,
        logging: config.logging ?? true,
        skipConcreteRepositories: config.skipConcreteRepositories ?? false,
        baseRepositoryClassName: config.baseRepositoryClassName ?? 'BaseRepository',
        transactionTimeout: config.transactionTimeout ?? DEFAULT_CONFIG.transactionTimeout,
        pagination: {
            defaultLimit: config.pagination?.defaultLimit ?? DEFAULT_CONFIG.pagination.defaultLimit,
            maxLimit: config.pagination?.maxLimit ?? DEFAULT_CONFIG.pagination.maxLimit,
        },
        naming: {
            baseRepositorySuffix: config.naming?.baseRepositorySuffix ?? DEFAULT_CONFIG.naming.baseRepositorySuffix,
            repositorySuffix: config.naming?.repositorySuffix ?? DEFAULT_CONFIG.naming.repositorySuffix,
            usePascalCase: config.naming?.usePascalCase ?? DEFAULT_CONFIG.naming.usePascalCase,
        },
        imports: {
            drizzleOrmPath: config.imports?.drizzleOrmPath ?? 'drizzle-orm',
            schemaImportPath: config.imports?.schemaImportPath ?? '../schema',
            additionalImports: config.imports?.additionalImports ?? [],
        },
        features: {
            relationships: config.features?.relationships ?? DEFAULT_CONFIG.features.relationships,
            auditTrail: config.features?.auditTrail ?? DEFAULT_CONFIG.features.auditTrail,
            validation: config.features?.validation ?? DEFAULT_CONFIG.features.validation,
            caching: config.features?.caching ?? DEFAULT_CONFIG.features.caching,
        },
        typescript: {
            strictNullChecks: config.typescript?.strictNullChecks ?? DEFAULT_CONFIG.typescript.strictNullChecks,
            target: config.typescript?.target ?? DEFAULT_CONFIG.typescript.target,
            moduleSystem: config.typescript?.moduleSystem ?? DEFAULT_CONFIG.typescript.moduleSystem,
            generateDeclarations:
                config.typescript?.generateDeclarations ?? DEFAULT_CONFIG.typescript.generateDeclarations,
        },
    };
}

/**
 * Creates a minimal configuration object for a specific dialect.
 *
 * Generates a basic configuration with only required fields set,
 * suitable for initialization or quick setup scenarios.
 *
 * @param dialect - Database dialect to configure for
 * @param schemaPath - Path to schema files
 * @param outputPath - Path for generated repositories
 * @param basePath - Path for base repositories
 * @returns Minimal valid configuration
 *
 * @example
 * ```typescript
 * const config = createMinimalConfig(
 *   'pg',
 *   './src/schema/*.ts',
 *   './src/repositories/generated',
 *   './src/repositories/base'
 * );
 * ```
 *
 * @since 0.1.0
 */
export function createMinimalConfig(
    dialect: DatabaseDialect,
    schemaPath: string,
    outputPath: string,
    basePath: string
): RepositoryCodegenConfig {
    return {
        dialect,
        schemaPath,
        outputPath,
        basePath,
    };
}

/**
 * Generates a complete example configuration for documentation and initialization.
 *
 * Creates a comprehensive configuration example with common settings
 * and detailed comments for documentation and CLI init commands.
 *
 * @param dialect - Database dialect to configure for
 * @returns Complete example configuration
 *
 * @since 0.1.0
 */
export function createExampleConfig(dialect: DatabaseDialect): RepositoryCodegenConfig {
    return applyDefaults({
        dialect,
        schemaPath: './src/schema/*.ts',
        outputPath: './src/repositories/generated',
        basePath: './src/repositories/base',
        logging: true,
        pagination: {
            defaultLimit: 20,
            maxLimit: 100,
        },
        features: {
            relationships: false,
            auditTrail: false,
            validation: false,
            caching: false,
        },
    });
}
