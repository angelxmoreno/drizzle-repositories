/**
 * Dialect-specific type definitions for the Drizzle Repository Codegen Framework.
 *
 * This module provides type definitions specific to each supported database
 * dialect, including connection types, query builders, and dialect-specific
 * features like RETURNING clauses and conflict resolution strategies.
 *
 * @since 0.1.0
 */

import type { DatabaseDialect, Transaction } from './repository.js';

/**
 * PostgreSQL-specific type definitions and interfaces.
 *
 * Provides types for PostgreSQL-specific features including RETURNING clauses,
 * ON CONFLICT resolution, and PostgreSQL connection types.
 *
 * @since 0.1.0
 */
export namespace PostgreSQL {
    /**
     * PostgreSQL database connection type.
     * Represents a Drizzle PostgreSQL database instance.
     *
     * @since 0.1.0
     */
    export interface Database {
        /** Execute a query and return results */
        execute: (query: unknown) => Promise<unknown>;

        /** Begin a new transaction */
        transaction: <T>(fn: (tx: PostgreSQLTransaction) => Promise<T>) => Promise<T>;
    }

    /**
     * PostgreSQL transaction type with PostgreSQL-specific features.
     *
     * @since 0.1.0
     */
    export interface PostgreSQLTransaction extends Transaction {
        /** PostgreSQL-specific query execution */
        execute: (query: unknown) => Promise<unknown>;
    }

    /**
     * PostgreSQL conflict resolution strategies for upsert operations.
     *
     * @since 0.1.0
     */
    export type ConflictStrategy =
        | 'DO_NOTHING'
        | 'DO_UPDATE'
        | { target: string[]; action: 'DO_NOTHING' | 'DO_UPDATE' };

    /**
     * PostgreSQL-specific query options.
     *
     * @since 0.1.0
     */
    export interface QueryOptions {
        /** Use RETURNING clause for INSERT/UPDATE/DELETE */
        returning?: string[] | '*';

        /** Conflict resolution for upsert operations */
        onConflict?: ConflictStrategy;

        /** Enable row-level security */
        rls?: boolean;
    }

    /**
     * PostgreSQL import paths and module references.
     *
     * @since 0.1.0
     */
    export interface ImportPaths {
        /** Main drizzle-orm PostgreSQL import */
        database: 'drizzle-orm/node-postgres' | 'drizzle-orm/postgres-js' | 'drizzle-orm/neon-http';

        /** PostgreSQL-specific operators and functions */
        operators: 'drizzle-orm/pg-core';

        /** Connection library */
        client: 'pg' | 'postgres' | '@neondatabase/serverless';
    }
}

/**
 * MySQL-specific type definitions and interfaces.
 *
 * Provides types for MySQL-specific features including ON DUPLICATE KEY UPDATE,
 * MySQL connection types, and MySQL-specific optimizations.
 *
 * @since 0.1.0
 */
export namespace MySQL {
    /**
     * MySQL database connection type.
     * Represents a Drizzle MySQL database instance.
     *
     * @since 0.1.0
     */
    export interface Database {
        /** Execute a query and return results */
        execute: (query: unknown) => Promise<unknown>;

        /** Begin a new transaction */
        transaction: <T>(fn: (tx: MySQLTransaction) => Promise<T>) => Promise<T>;
    }

    /**
     * MySQL transaction type with MySQL-specific features.
     *
     * @since 0.1.0
     */
    export interface MySQLTransaction extends Transaction {
        /** MySQL-specific query execution */
        execute: (query: unknown) => Promise<unknown>;
    }

    /**
     * MySQL duplicate key resolution strategies.
     *
     * @since 0.1.0
     */
    export type DuplicateKeyStrategy = 'IGNORE' | 'UPDATE' | { action: 'UPDATE'; values: Record<string, unknown> };

    /**
     * MySQL-specific query options.
     *
     * @since 0.1.0
     */
    export interface QueryOptions {
        /** ON DUPLICATE KEY UPDATE behavior */
        onDuplicateKey?: DuplicateKeyStrategy;

        /** MySQL lock modes */
        lockMode?: 'FOR_UPDATE' | 'FOR_SHARE' | 'LOCK_IN_SHARE_MODE';

        /** MySQL isolation level for transaction */
        isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
    }

    /**
     * MySQL import paths and module references.
     *
     * @since 0.1.0
     */
    export interface ImportPaths {
        /** Main drizzle-orm MySQL import */
        database: 'drizzle-orm/mysql2' | 'drizzle-orm/planetscale-serverless';

        /** MySQL-specific operators and functions */
        operators: 'drizzle-orm/mysql-core';

        /** Connection library */
        client: 'mysql2' | '@planetscale/database';
    }
}

/**
 * SQLite-specific type definitions and interfaces.
 *
 * Provides types for SQLite-specific features including simplified transactions,
 * file-based operations, and SQLite connection types.
 *
 * @since 0.1.0
 */
export namespace SQLite {
    /**
     * SQLite database connection type.
     * Represents a Drizzle SQLite database instance.
     *
     * @since 0.1.0
     */
    export interface Database {
        /** Execute a query and return results */
        run: (query: unknown) => Promise<unknown>;

        /** Get query results */
        all: (query: unknown) => Promise<unknown[]>;

        /** Get single result */
        get: (query: unknown) => Promise<unknown>;

        /** Begin a new transaction */
        transaction: <T>(fn: (tx: SQLiteTransaction) => Promise<T>) => Promise<T>;
    }

    /**
     * SQLite transaction type with SQLite-specific features.
     *
     * @since 0.1.0
     */
    export interface SQLiteTransaction extends Transaction {
        /** SQLite-specific query execution */
        run: (query: unknown) => Promise<unknown>;

        /** Get all results */
        all: (query: unknown) => Promise<unknown[]>;

        /** Get single result */
        get: (query: unknown) => Promise<unknown>;
    }

    /**
     * SQLite conflict resolution strategies.
     *
     * @since 0.1.0
     */
    export type ConflictResolution = 'ROLLBACK' | 'ABORT' | 'FAIL' | 'IGNORE' | 'REPLACE';

    /**
     * SQLite-specific query options.
     *
     * @since 0.1.0
     */
    export interface QueryOptions {
        /** SQLite conflict resolution */
        onConflict?: ConflictResolution;

        /** Enable WAL mode */
        walMode?: boolean;

        /** Synchronization mode */
        synchronous?: 'OFF' | 'NORMAL' | 'FULL' | 'EXTRA';
    }

    /**
     * SQLite import paths and module references.
     *
     * @since 0.1.0
     */
    export interface ImportPaths {
        /** Main drizzle-orm SQLite import */
        database: 'drizzle-orm/better-sqlite3' | 'drizzle-orm/bun-sqlite' | 'drizzle-orm/libsql';

        /** SQLite-specific operators and functions */
        operators: 'drizzle-orm/sqlite-core';

        /** Connection library */
        client: 'better-sqlite3' | 'bun:sqlite' | '@libsql/client';
    }
}

/**
 * Dialect-specific configuration mapping.
 *
 * Maps each database dialect to its specific configuration options,
 * import paths, and feature capabilities.
 *
 * @since 0.1.0
 */
export interface DialectConfig {
    /** PostgreSQL configuration */
    pg: {
        database: PostgreSQL.Database;
        transaction: PostgreSQL.PostgreSQLTransaction;
        queryOptions: PostgreSQL.QueryOptions;
        imports: PostgreSQL.ImportPaths;
        features: {
            returning: true;
            onConflict: true;
            arrays: true;
            jsonb: true;
            fullTextSearch: true;
        };
    };

    /** MySQL configuration */
    mysql: {
        database: MySQL.Database;
        transaction: MySQL.MySQLTransaction;
        queryOptions: MySQL.QueryOptions;
        imports: MySQL.ImportPaths;
        features: {
            returning: false;
            onDuplicateKey: true;
            json: true;
            fullTextSearch: true;
        };
    };

    /** SQLite configuration */
    sqlite: {
        database: SQLite.Database;
        transaction: SQLite.SQLiteTransaction;
        queryOptions: SQLite.QueryOptions;
        imports: SQLite.ImportPaths;
        features: {
            returning: true;
            onConflict: true;
            fts: true;
            json1: true;
        };
    };
}

/**
 * Utility type to get database type for a specific dialect.
 *
 * @template D - Database dialect
 *
 * @since 0.1.0
 */
export type DatabaseForDialect<D extends DatabaseDialect> = DialectConfig[D]['database'];

/**
 * Utility type to get transaction type for a specific dialect.
 *
 * @template D - Database dialect
 *
 * @since 0.1.0
 */
export type TransactionForDialect<D extends DatabaseDialect> = DialectConfig[D]['transaction'];

/**
 * Utility type to get query options for a specific dialect.
 *
 * @template D - Database dialect
 *
 * @since 0.1.0
 */
export type QueryOptionsForDialect<D extends DatabaseDialect> = DialectConfig[D]['queryOptions'];

/**
 * Utility type to get import paths for a specific dialect.
 *
 * @template D - Database dialect
 *
 * @since 0.1.0
 */
export type ImportPathsForDialect<D extends DatabaseDialect> = DialectConfig[D]['imports'];

/**
 * Utility type to get feature flags for a specific dialect.
 *
 * @template D - Database dialect
 *
 * @since 0.1.0
 */
export type FeaturesForDialect<D extends DatabaseDialect> = DialectConfig[D]['features'];

/**
 * Template data for generating dialect-specific imports.
 *
 * Provides the necessary import statements and type references
 * for generating repository classes for a specific dialect.
 *
 * @since 0.1.0
 */
export interface DialectImportTemplate {
    /** Database connection import statement */
    databaseImport: string;

    /** Core operators and functions import */
    operatorsImport: string;

    /** Client library import (if needed) */
    clientImport?: string;

    /** Database type reference */
    databaseType: string;

    /** Transaction type reference */
    transactionType: string;

    /** Additional type imports */
    additionalTypes: string[];
}

/**
 * Generate import template for a specific dialect.
 *
 * Creates the necessary import statements and type references
 * for repository generation based on the target database dialect.
 *
 * @param dialect - Target database dialect
 * @param imports - Dialect-specific import configuration
 * @returns Template data for generating imports
 *
 * @since 0.1.0
 */
export function createDialectImportTemplate(
    dialect: DatabaseDialect,
    imports: ImportPathsForDialect<typeof dialect>
): DialectImportTemplate {
    switch (dialect) {
        case 'pg':
            return {
                databaseImport: `import { drizzle } from '${imports.database}';`,
                operatorsImport: `import { eq, and, or, sql } from '${imports.operators}';`,
                clientImport: `import type { Client } from '${imports.client}';`,
                databaseType: 'PostgreSQL.Database',
                transactionType: 'PostgreSQL.PostgreSQLTransaction',
                additionalTypes: ['eq', 'and', 'or', 'sql'],
            };

        case 'mysql':
            return {
                databaseImport: `import { drizzle } from '${imports.database}';`,
                operatorsImport: `import { eq, and, or, sql } from '${imports.operators}';`,
                clientImport: `import type { Connection } from '${imports.client}';`,
                databaseType: 'MySQL.Database',
                transactionType: 'MySQL.MySQLTransaction',
                additionalTypes: ['eq', 'and', 'or', 'sql'],
            };

        case 'sqlite':
            return {
                databaseImport: `import { drizzle } from '${imports.database}';`,
                operatorsImport: `import { eq, and, or, sql } from '${imports.operators}';`,
                clientImport: `import type { Database } from '${imports.client}';`,
                databaseType: 'SQLite.Database',
                transactionType: 'SQLite.SQLiteTransaction',
                additionalTypes: ['eq', 'and', 'or', 'sql'],
            };

        default:
            throw new Error(`Unsupported dialect: ${dialect}`);
    }
}
