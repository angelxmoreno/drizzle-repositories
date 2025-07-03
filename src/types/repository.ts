/**
 * Core repository type definitions for the Drizzle Repository Codegen Framework.
 *
 * This module provides comprehensive type definitions for repository operations,
 * query options, pagination, transactions, and other core functionality that
 * supports type-safe database operations across all supported dialects.
 *
 * @since 0.1.0
 */

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
    execute: (query: unknown) => Promise<unknown>;

    /** Rollback the transaction */
    rollback: () => Promise<void>;

    /** Commit the transaction */
    commit: () => Promise<void>;
}

/**
 * Query options for customizing database operations.
 *
 * Provides flexible configuration for sorting, limiting, and controlling
 * query behavior across all repository methods.
 *
 * @example
 * ```typescript
 * const options: QueryOptions = {
 *   orderBy: [{ field: 'createdAt', direction: 'desc' }],
 *   limit: 20,
 *   offset: 0,
 *   includeDeleted: false
 * };
 * ```
 *
 * @since 0.1.0
 */
export interface QueryOptions {
    /** Sorting configuration */
    orderBy?: Array<{
        field: string;
        direction: 'asc' | 'desc';
    }>;

    /** Maximum number of records to return */
    limit?: number;

    /** Number of records to skip */
    offset?: number;

    /** Include soft-deleted records in results */
    includeDeleted?: boolean;
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
 * @template TSelect - The inferred select model type
 * @template TInsert - The inferred insert model type
 * @template TUpdate - The inferred update model type (optional, defaults to Partial<TInsert>)
 *
 * @since 0.1.0
 */
export interface IRepository<_TTable = unknown, TSelect = unknown, TInsert = unknown, TUpdate = Partial<TInsert>> {
    // Query Methods

    /**
     * Find a single entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving to the entity or null if not found
     */
    findById(id: PrimaryKey, tx?: Transaction): Promise<TSelect | null>;

    /**
     * Find the first entity matching the given criteria.
     *
     * @param where - Partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to the first matching entity or null
     */
    findFirst(where: Partial<TSelect>, tx?: Transaction): Promise<TSelect | null>;

    /**
     * Find multiple entities matching the given criteria.
     *
     * @param where - Optional partial entity for filtering
     * @param options - Optional query configuration
     * @param tx - Optional transaction context
     * @returns Promise resolving to array of matching entities
     */
    findMany(where?: Partial<TSelect>, options?: QueryOptions, tx?: Transaction): Promise<TSelect[]>;

    /**
     * Find entities with pagination support.
     *
     * @param where - Optional partial entity for filtering
     * @param page - Page number (1-based, defaults to 1)
     * @param limit - Items per page (defaults to configuration value)
     * @param tx - Optional transaction context
     * @returns Promise resolving to paginated result
     */
    findPaginated(
        where?: Partial<TSelect>,
        page?: number,
        limit?: number,
        tx?: Transaction
    ): Promise<PaginatedResult<TSelect>>;

    // Existence & Counting

    /**
     * Check if any entity exists matching the given criteria.
     *
     * @param where - Partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to boolean indicating existence
     */
    exists(where: Partial<TSelect>, tx?: Transaction): Promise<boolean>;

    /**
     * Count entities matching the given criteria.
     *
     * @param where - Optional partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to count of matching entities
     */
    count(where?: Partial<TSelect>, tx?: Transaction): Promise<number>;

    // Mutation Methods

    /**
     * Create and save a new entity.
     *
     * @param data - Entity data for creation
     * @param tx - Optional transaction context
     * @returns Promise resolving to the created entity
     */
    save(data: TInsert, tx?: Transaction): Promise<TSelect>;

    /**
     * Update an existing entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param data - Partial entity data for update
     * @param tx - Optional transaction context
     * @returns Promise resolving to the updated entity
     */
    update(id: PrimaryKey, data: TUpdate, tx?: Transaction): Promise<TSelect>;

    /**
     * Delete an entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when deletion is complete
     */
    remove(id: PrimaryKey, tx?: Transaction): Promise<void>;

    /**
     * Insert or update an entity (upsert operation).
     *
     * @param data - Entity data for upsert
     * @param tx - Optional transaction context
     * @returns Promise resolving to the upserted entity
     */
    upsert(data: TInsert, tx?: Transaction): Promise<TSelect>;
}

/**
 * Extended repository interface with soft delete support.
 *
 * This interface extends the base repository with soft delete functionality
 * for entities that have a deletedAt timestamp column.
 *
 * @template TTable - The Drizzle table type
 * @template TSelect - The inferred select model type
 * @template TInsert - The inferred insert model type
 * @template TUpdate - The inferred update model type
 *
 * @since 0.1.0
 */
export interface ISoftDeleteRepository<
    TTable = unknown,
    TSelect = unknown,
    TInsert = unknown,
    TUpdate = Partial<TInsert>,
> extends IRepository<TTable, TSelect, TInsert, TUpdate> {
    /**
     * Soft delete an entity by setting its deletedAt timestamp.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when soft deletion is complete
     */
    softDelete(id: PrimaryKey, tx?: Transaction): Promise<void>;

    /**
     * Restore a soft-deleted entity by clearing its deletedAt timestamp.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when restoration is complete
     */
    restore(id: PrimaryKey, tx?: Transaction): Promise<void>;
}

/**
 * Repository factory configuration for creating repository instances.
 *
 * Provides configuration options for repository creation including
 * database connection, table reference, and behavioral settings.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export interface RepositoryFactoryConfig<TTable = unknown> {
    /** Database connection instance */
    db: unknown;

    /** Drizzle table reference */
    table: TTable;

    /** Optional configuration overrides */
    config?: {
        /** Transaction timeout in milliseconds */
        transactionTimeout?: number;

        /** Default pagination limit */
        defaultLimit?: number;

        /** Maximum allowed pagination limit */
        maxLimit?: number;

        /** Enable soft delete functionality */
        softDelete?: boolean;
    };
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

    /** Whether soft delete is enabled */
    hasSoftDelete: boolean;

    /** Primary key column information */
    primaryKey: {
        /** Column names forming the primary key */
        columns: string[];

        /** Whether it's a composite primary key */
        isComposite: boolean;
    };
}
