// Export CLI functionality
export { createCLI, main } from './cli/index.js';
export {
    applyDefaults,
    createExampleConfig,
    createMinimalConfig,
    DEFAULT_CONFIG,
    validateConfig,
} from './config/index.js';
// Export base repository classes
export { BaseRepository, BaseSoftDeleteRepository } from './repositories/base/BaseRepository.js';
// Export CLI types
export type { CLIOptions } from './types/cli.js';
// Export configuration types and functions
export type {
    ConfigLoadOptions,
    ConfigSchema,
    ConfigurationManager,
    ConfigValidationError,
    ConfigValidationResult,
    ConfigValidationWarning,
    DefaultConfigValues,
    RepositoryCodegenConfig,
} from './types/config.js';

// Export dialect-specific types
export type {
    DatabaseForDialect,
    DialectConfig,
    DialectImportTemplate,
    FeaturesForDialect,
    ImportPathsForDialect,
    MySQL,
    PostgreSQL,
    QueryOptionsForDialect,
    SQLite,
    TransactionForDialect,
} from './types/dialects.js';

export { createDialectImportTemplate } from './types/dialects.js';
// Export core repository types
export type {
    DatabaseDialect,
    IRepository,
    ISoftDeleteRepository,
    PaginatedResult,
    PrimaryKey,
    QueryOptions,
    RepositoryFactoryConfig,
    RepositoryMetadata,
    Transaction,
} from './types/repository.js';
// Export utility types and functions
export type {
    AtLeastOne,
    Brand,
    ColumnType,
    DeepPartial,
    DeepReadonly,
    EntityId,
    ExtractPrimaryKey,
    HasAuditTrail,
    HasCompositePrimaryKey,
    HasSoftDelete,
    JsonValue,
    NonEmptyArray,
    NullableColumns,
    OptionalFields,
    OptionalInsertType,
    PrimaryKeyColumns,
    RepositoryMethod,
    RequiredInsertColumns,
    RequireFields,
    Result,
    TimestampColumns,
    UnionToIntersection,
    UpdateType,
} from './types/utils.js';
export {
    createBrand,
    err,
    extractBrand,
    hasProperty,
    isDefined,
    isErr,
    isNonEmptyString,
    isOk,
    isPrimaryKey,
    ok,
} from './types/utils.js';

// Legacy placeholder for backward compatibility
export interface RepositoryConfig {
    dialect: 'pg' | 'mysql' | 'sqlite';
    schemaPath: string;
    outputPath: string;
}

export function createRepository() {
    // Placeholder implementation
    return {
        hello: () => 'Hello from Drizzle Repositories!',
    };
}
