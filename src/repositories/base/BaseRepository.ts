/**
 * Abstract base repository class providing common database operations for Drizzle ORM.
 *
 * This abstract class serves as the foundation for all generated repository classes,
 * providing type-safe CRUD operations, transaction support, and extensibility hooks.
 * It implements the core repository interface while leaving dialect-specific
 * implementations to be handled by concrete subclasses.
 *
 * @template TTable - The Drizzle table type
 * @template TSelect - The inferred select model type
 * @template TInsert - The inferred insert model type
 * @template TUpdate - The inferred update model type (defaults to Partial<TInsert>)
 *
 * @example
 * ```typescript
 * class UserRepository extends BaseRepository<typeof users, User, NewUser> {
 *   constructor(db: DrizzleDB) {
 *     super(db, users);
 *   }
 *
 *   // Add custom methods
 *   async findByEmail(email: string): Promise<User | null> {
 *     return this.findFirst({ email });
 *   }
 * }
 * ```
 *
 * @since 0.1.0
 */

import type {
    IRepository,
    ISoftDeleteRepository,
    PaginatedResult,
    PrimaryKey,
    QueryOptions,
    RepositoryFactoryConfig,
    Transaction,
} from '../../types/repository.js';

/**
 * Abstract base repository class implementing core database operations.
 *
 * This class provides a complete implementation of the repository pattern
 * for Drizzle ORM, offering type-safe database operations, transaction
 * support, and extensibility for custom query methods.
 *
 * @template TTable - The Drizzle table type
 * @template TSelect - The inferred select model type
 * @template TInsert - The inferred insert model type
 * @template TUpdate - The inferred update model type
 *
 * @since 0.1.0
 */
export abstract class BaseRepository<TTable = unknown, TSelect = unknown, TInsert = unknown, TUpdate = Partial<TInsert>>
    implements IRepository<TTable, TSelect, TInsert, TUpdate>
{
    /**
     * Database connection instance.
     * @protected
     */
    protected readonly db: unknown;

    /**
     * Drizzle table reference.
     * @protected
     */
    protected readonly table: TTable;

    /**
     * Repository configuration options.
     * @protected
     */
    protected readonly config: Required<NonNullable<RepositoryFactoryConfig<TTable>['config']>>;

    /**
     * Creates a new BaseRepository instance.
     *
     * @param db - Database connection instance
     * @param table - Drizzle table reference
     * @param config - Optional repository configuration
     *
     * @since 0.1.0
     */
    constructor(db: unknown, table: TTable, config?: RepositoryFactoryConfig<TTable>['config']) {
        this.db = db;
        this.table = table;
        this.config = {
            transactionTimeout: config?.transactionTimeout ?? 30000,
            defaultLimit: config?.defaultLimit ?? 20,
            maxLimit: config?.maxLimit ?? 100,
            softDelete: config?.softDelete ?? false,
        };
    }

    /**
     * Find a single entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving to the entity or null if not found
     *
     * @example
     * ```typescript
     * const user = await userRepo.findById(42);
     * const userWithComposite = await userRepo.findById({ userId: 1, roleId: 2 });
     * ```
     *
     * @since 0.1.0
     */
    abstract findById(id: PrimaryKey, tx?: Transaction): Promise<TSelect | null>;

    /**
     * Find the first entity matching the given criteria.
     *
     * @param where - Partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to the first matching entity or null
     *
     * @example
     * ```typescript
     * const user = await userRepo.findFirst({ email: 'john@example.com' });
     * ```
     *
     * @since 0.1.0
     */
    abstract findFirst(where: Partial<TSelect>, tx?: Transaction): Promise<TSelect | null>;

    /**
     * Find multiple entities matching the given criteria.
     *
     * @param where - Optional partial entity for filtering
     * @param options - Optional query configuration
     * @param tx - Optional transaction context
     * @returns Promise resolving to array of matching entities
     *
     * @example
     * ```typescript
     * const users = await userRepo.findMany(
     *   { status: 'active' },
     *   { limit: 10, orderBy: [{ field: 'createdAt', direction: 'desc' }] }
     * );
     * ```
     *
     * @since 0.1.0
     */
    abstract findMany(where?: Partial<TSelect>, options?: QueryOptions, tx?: Transaction): Promise<TSelect[]>;

    /**
     * Find entities with pagination support.
     *
     * @param where - Optional partial entity for filtering
     * @param page - Page number (1-based, defaults to 1)
     * @param limit - Items per page (defaults to configuration value)
     * @param tx - Optional transaction context
     * @returns Promise resolving to paginated result
     *
     * @example
     * ```typescript
     * const result = await userRepo.findPaginated(
     *   { status: 'active' },
     *   1, // page
     *   20 // limit
     * );
     * console.log(result.pagination.total); // Total count
     * console.log(result.data); // Current page data
     * ```
     *
     * @since 0.1.0
     */
    async findPaginated(
        where?: Partial<TSelect>,
        page: number = 1,
        limit: number = this.config.defaultLimit,
        tx?: Transaction
    ): Promise<PaginatedResult<TSelect>> {
        // Validate and constrain inputs
        const validatedPage = Math.max(1, Math.floor(page));
        const validatedLimit = Math.min(this.config.maxLimit, Math.max(1, Math.floor(limit)));
        const offset = (validatedPage - 1) * validatedLimit;

        // Execute queries in parallel for better performance
        const [data, total] = await Promise.all([
            this.findMany(where, { limit: validatedLimit, offset }, tx),
            this.count(where, tx),
        ]);

        const totalPages = Math.ceil(total / validatedLimit);

        return {
            data,
            pagination: {
                page: validatedPage,
                limit: validatedLimit,
                total,
                totalPages,
                hasNext: validatedPage < totalPages,
                hasPrev: validatedPage > 1,
            },
        };
    }

    /**
     * Check if any entity exists matching the given criteria.
     *
     * @param where - Partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to boolean indicating existence
     *
     * @example
     * ```typescript
     * const emailExists = await userRepo.exists({ email: 'john@example.com' });
     * ```
     *
     * @since 0.1.0
     */
    abstract exists(where: Partial<TSelect>, tx?: Transaction): Promise<boolean>;

    /**
     * Count entities matching the given criteria.
     *
     * @param where - Optional partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to count of matching entities
     *
     * @example
     * ```typescript
     * const activeUserCount = await userRepo.count({ status: 'active' });
     * ```
     *
     * @since 0.1.0
     */
    abstract count(where?: Partial<TSelect>, tx?: Transaction): Promise<number>;

    /**
     * Create and save a new entity.
     *
     * @param data - Entity data for creation
     * @param tx - Optional transaction context
     * @returns Promise resolving to the created entity
     *
     * @example
     * ```typescript
     * const newUser = await userRepo.save({
     *   email: 'john@example.com',
     *   name: 'John Doe'
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract save(data: TInsert, tx?: Transaction): Promise<TSelect>;

    /**
     * Update an existing entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param data - Partial entity data for update
     * @param tx - Optional transaction context
     * @returns Promise resolving to the updated entity
     *
     * @example
     * ```typescript
     * const updatedUser = await userRepo.update(42, {
     *   name: 'John Smith'
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract update(id: PrimaryKey, data: TUpdate, tx?: Transaction): Promise<TSelect>;

    /**
     * Delete an entity by its primary key.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when deletion is complete
     *
     * @example
     * ```typescript
     * await userRepo.remove(42);
     * ```
     *
     * @since 0.1.0
     */
    abstract remove(id: PrimaryKey, tx?: Transaction): Promise<void>;

    /**
     * Insert or update an entity (upsert operation).
     *
     * @param data - Entity data for upsert
     * @param tx - Optional transaction context
     * @returns Promise resolving to the upserted entity
     *
     * @example
     * ```typescript
     * const user = await userRepo.upsert({
     *   email: 'john@example.com',
     *   name: 'John Doe'
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract upsert(data: TInsert, tx?: Transaction): Promise<TSelect>;

    /**
     * Execute a function within a database transaction.
     *
     * Provides a convenient way to execute multiple repository operations
     * within a single transaction with automatic rollback on errors.
     *
     * @param fn - Function to execute within the transaction
     * @returns Promise resolving to the function's return value
     *
     * @example
     * ```typescript
     * const result = await userRepo.transaction(async (tx) => {
     *   const user = await userRepo.save({ email: 'john@example.com' }, tx);
     *   const profile = await profileRepo.save({ userId: user.id }, tx);
     *   return { user, profile };
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

    /**
     * Load related entities for the given entities.
     *
     * This method provides a hook for loading relationships and can be
     * overridden by subclasses to implement specific relationship loading logic.
     *
     * @param entities - Array of entities to load relations for
     * @param tx - Optional transaction context
     * @returns Promise resolving to entities with loaded relations
     *
     * @example
     * ```typescript
     * const usersWithProfiles = await userRepo.loadRelations(users);
     * ```
     *
     * @since 0.1.0
     */
    async loadRelations(entities: TSelect[], _tx?: Transaction): Promise<TSelect[]> {
        // Default implementation returns entities as-is
        // Subclasses can override to implement specific relationship loading
        return entities;
    }

    /**
     * Get the table reference for this repository.
     *
     * @returns The Drizzle table reference
     *
     * @since 0.1.0
     */
    getTable(): TTable {
        return this.table;
    }

    /**
     * Get the repository configuration.
     *
     * @returns The repository configuration object
     *
     * @since 0.1.0
     */
    getConfig(): Required<NonNullable<RepositoryFactoryConfig<TTable>['config']>> {
        return this.config;
    }
}

/**
 * Abstract base repository class with soft delete support.
 *
 * Extends the base repository with soft delete functionality for entities
 * that have a deletedAt timestamp column. Provides additional methods for
 * soft deletion and restoration while maintaining all base functionality.
 *
 * @template TTable - The Drizzle table type
 * @template TSelect - The inferred select model type (must have deletedAt)
 * @template TInsert - The inferred insert model type
 * @template TUpdate - The inferred update model type
 *
 * @since 0.1.0
 */
export abstract class BaseSoftDeleteRepository<
        TTable = unknown,
        TSelect = unknown,
        TInsert = unknown,
        TUpdate = Partial<TInsert>,
    >
    extends BaseRepository<TTable, TSelect, TInsert, TUpdate>
    implements ISoftDeleteRepository<TTable, TSelect, TInsert, TUpdate>
{
    /**
     * Soft delete an entity by setting its deletedAt timestamp.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when soft deletion is complete
     *
     * @example
     * ```typescript
     * await userRepo.softDelete(42);
     * ```
     *
     * @since 0.1.0
     */
    abstract softDelete(id: PrimaryKey, tx?: Transaction): Promise<void>;

    /**
     * Restore a soft-deleted entity by clearing its deletedAt timestamp.
     *
     * @param id - The primary key value(s)
     * @param tx - Optional transaction context
     * @returns Promise resolving when restoration is complete
     *
     * @example
     * ```typescript
     * await userRepo.restore(42);
     * ```
     *
     * @since 0.1.0
     */
    abstract restore(id: PrimaryKey, tx?: Transaction): Promise<void>;

    /**
     * Override count to exclude soft-deleted entities by default.
     *
     * @param where - Optional partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to count of non-deleted entities
     *
     * @since 0.1.0
     */
    abstract override count(_where?: Partial<TSelect>, _tx?: Transaction): Promise<number>;

    /**
     * Count all entities including soft-deleted ones.
     *
     * @param where - Optional partial entity for filtering
     * @param tx - Optional transaction context
     * @returns Promise resolving to total count including deleted entities
     *
     * @since 0.1.0
     */
    abstract countAll(where?: Partial<TSelect>, tx?: Transaction): Promise<number>;
}
