/**
 * Core repository type definitions for the Drizzle Repository Codegen Framework.
 *
 * This module provides comprehensive type definitions for repository operations,
 * query options, pagination, transactions, and other core functionality that
 * supports type-safe database operations across all supported dialects.
 *
 * @since 0.1.0
 */

import type { InferInsertModel, InferSelectModel, SQL, Table } from 'drizzle-orm';

/**
 * Supported database dialects for repository generation.
 *
 * Each dialect has specific optimizations and features:
 * - 'pg': PostgreSQL with RETURNING clause and ON CONFLICT support
 * - 'mysql': MySQL with ON DUPLICATE KEY UPDATE support
 * - 'sqlite': SQLite with simplified transaction handling
 *
 * @since 0.1.0
 */
export type DatabaseDialect = 'pg' | 'mysql' | 'sqlite';

/**
 * Primary key type that supports various key formats.
 *
 * Supports single field primary keys (number/string) and composite
 * primary keys (Record<string, number|string>) for complex table structures.
 *
 * @example
 * ```typescript
 * // Single primary key
 * const id: PrimaryKey = 42;
 * const uuid: PrimaryKey = "550e8400-e29b-41d4-a716-446655440000";
 *
 * // Composite primary key
 * const compositeId: PrimaryKey = { userId: 1, roleId: 2 };
 * ```
 *
 * @since 0.1.0
 */
export type PrimaryKey = number | string | Record<string, number | string>;

/**
 * Generic transaction interface that adapts to different Drizzle dialects.
 *
 * This interface provides a common abstraction for database transactions
 * across PostgreSQL, MySQL, and SQLite implementations.
 *
 * @since 0.1.0
 */
export interface Transaction {
    /** Execute a query within the transaction context */
    execute: (query: SQL) => Promise<unknown>;

    /** Rollback the transaction */
    rollback: () => Promise<void>;

    /** Commit the transaction */
    commit: () => Promise<void>;
}

/**
 * Base query options for repository operations.
 *
 * @since 0.1.0
 */
export interface BaseQueryOptions {
    /** Optional transaction context */
    tx?: Transaction;
}

/**
 * Query options for find operations.
 *
 * @since 0.1.0
 */
export interface FindOptions extends BaseQueryOptions {
    /** Maximum number of records to return */
    limit?: number;

    /** Number of records to skip */
    offset?: number;
}

/**
 * Pagination query options.
 *
 * @since 0.1.0
 */
export interface PaginationOptions extends BaseQueryOptions {
    /** Page number (1-based, defaults to 1) */
    page?: number;

    /** Items per page */
    limit?: number;
}

/**
 * Paginated query result with metadata.
 *
 * Provides comprehensive pagination information including total counts,
 * page information, and navigation helpers for building paginated interfaces.
 *
 * @template T - The entity type being paginated
 *
 * @example
 * ```typescript
 * const result: PaginatedResult<User> = {
 *   data: [user1, user2, user3],
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 150,
 *     totalPages: 8,
 *     hasNext: true,
 *     hasPrev: false
 *   }
 * };
 * ```
 *
 * @since 0.1.0
 */
export interface PaginatedResult<T> {
    /** Array of entities for the current page */
    data: T[];

    /** Pagination metadata */
    pagination: {
        /** Current page number (1-based) */
        page: number;

        /** Number of items per page */
        limit: number;

        /** Total number of items across all pages */
        total: number;

        /** Total number of pages */
        totalPages: number;

        /** Whether there is a next page */
        hasNext: boolean;

        /** Whether there is a previous page */
        hasPrev: boolean;
    };
}

/**
 * Base repository interface defining core database operations.
 *
 * This interface establishes the contract that all repository implementations
 * must follow, ensuring consistent API across all database dialects and
 * generated repository classes.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export interface IRepository<TTable extends Table> {
    // Query Methods

    /**
     * Find a single entity by its primary key.
     *
     * @param options - Query options including id and transaction
     * @returns Promise resolving to the entity or null if not found
     */
    findById(options: { id: PrimaryKey } & BaseQueryOptions): Promise<InferSelectModel<TTable> | null>;

    /**
     * Find the first entity matching the given criteria.
     *
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to the first matching entity or null
     */
    findFirst(options: { where?: SQL } & BaseQueryOptions): Promise<InferSelectModel<TTable> | null>;

    /**
     * Find multiple entities matching the given criteria.
     *
     * @param options - Query options including where clause, limit, offset, and transaction
     * @returns Promise resolving to array of matching entities
     */
    findMany(options?: { where?: SQL } & FindOptions): Promise<InferSelectModel<TTable>[]>;

    /**
     * Find entities with pagination support.
     *
     * @param options - Pagination options including where clause, page, limit, and transaction
     * @returns Promise resolving to paginated result
     */
    findPaginated(options?: { where?: SQL } & PaginationOptions): Promise<PaginatedResult<InferSelectModel<TTable>>>;

    // Existence & Counting

    /**
     * Check if any entity exists matching the given criteria.
     *
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to boolean indicating existence
     */
    exists(options: { where: SQL } & BaseQueryOptions): Promise<boolean>;

    /**
     * Count entities matching the given criteria.
     *
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to count of matching entities
     */
    count(options?: { where?: SQL } & BaseQueryOptions): Promise<number>;

    // Mutation Methods

    /**
     * Create and save a new entity.
     *
     * @param options - Options including entity data and transaction
     * @returns Promise resolving to the created entity
     */
    save(options: { data: InferInsertModel<TTable> } & BaseQueryOptions): Promise<InferSelectModel<TTable>>;

    /**
     * Update an existing entity by its primary key.
     *
     * @param options - Options including id, data, and transaction
     * @returns Promise resolving to the updated entity
     */
    update(
        options: { id: PrimaryKey; data: Partial<InferInsertModel<TTable>> } & BaseQueryOptions
    ): Promise<InferSelectModel<TTable>>;

    /**
     * Delete an entity by its primary key.
     *
     * @param options - Options including id and transaction
     * @returns Promise resolving when deletion is complete
     */
    remove(options: { id: PrimaryKey } & BaseQueryOptions): Promise<void>;

    /**
     * Insert or update an entity (upsert operation).
     *
     * @param options - Options including where condition, create data, update data, and transaction
     * @returns Promise resolving to the upserted entity
     */
    upsert(
        options: {
            where: SQL;
            create: InferInsertModel<TTable>;
            update: Partial<InferInsertModel<TTable>>;
        } & BaseQueryOptions
    ): Promise<InferSelectModel<TTable>>;
}

/**
 * Repository instance configuration options.
 *
 * @since 0.1.0
 */
export interface RepositoryInstanceConfig {
    /** Transaction timeout in milliseconds */
    transactionTimeout?: number;

    /** Default pagination limit */
    defaultLimit?: number;

    /** Maximum allowed pagination limit */
    maxLimit?: number;
}

/**
 * Repository metadata for tracking generation and validation.
 *
 * Provides information about repository generation, validation status,
 * and metadata for ensuring repository consistency and up-to-date status.
 *
 * @since 0.1.0
 */
export interface RepositoryMetadata {
    /** Repository class name */
    className: string;

    /** Associated table name */
    tableName: string;

    /** Database dialect */
    dialect: DatabaseDialect;

    /** Generation timestamp */
    generatedAt: Date;

    /** Schema file path that generated this repository */
    schemaPath: string;

    /** Configuration used for generation */
    configHash: string;

    /** Primary key column information */
    primaryKey: {
        /** Column names forming the primary key */
        columns: string[];

        /** Whether it's a composite primary key */
        isComposite: boolean;
    };
}
