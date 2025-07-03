/**
 * Abstract base repository class providing common database operations for Drizzle ORM.
 *
 * This abstract class serves as the foundation for all generated repository classes,
 * providing type-safe CRUD operations, transaction support, and extensibility hooks.
 * It implements the core repository interface while leaving dialect-specific
 * implementations to be handled by concrete subclasses.
 *
 * @template TTable - The Drizzle table type
 *
 * @example
 * ```typescript
 * class UserRepository extends BaseRepository<typeof users> {
 *   constructor(db: DrizzleDB) {
 *     super(db, users);
 *   }
 *
 *   // Add custom methods
 *   async findByEmail(email: string): Promise<User | null> {
 *     return this.findFirst({ where: eq(users.email, email) });
 *   }
 * }
 * ```
 *
 * @since 0.1.0
 */

import type { InferInsertModel, InferSelectModel, SQL, Table } from 'drizzle-orm';
import type {
    BaseQueryOptions,
    FindOptions,
    IRepository,
    PaginatedResult,
    PaginationOptions,
    PrimaryKey,
    RepositoryInstanceConfig,
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
 *
 * @since 0.1.0
 */
export abstract class BaseRepository<TTable extends Table> implements IRepository<TTable> {
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
    protected readonly config: Required<RepositoryInstanceConfig>;

    /**
     * Creates a new BaseRepository instance.
     *
     * @param db - Database connection instance
     * @param table - Drizzle table reference
     * @param config - Optional repository configuration
     *
     * @since 0.1.0
     */
    constructor(db: unknown, table: TTable, config?: RepositoryInstanceConfig) {
        this.db = db;
        this.table = table;
        this.config = {
            transactionTimeout: config?.transactionTimeout ?? 30000,
            defaultLimit: config?.defaultLimit ?? 20,
            maxLimit: config?.maxLimit ?? 100,
        };
    }

    /**
     * Find a single entity by its primary key.
     *
     * @param options - Query options including id and transaction
     * @returns Promise resolving to the entity or null if not found
     *
     * @example
     * ```typescript
     * const user = await userRepo.findById({ id: 42 });
     * const userWithComposite = await userRepo.findById({ id: { userId: 1, roleId: 2 } });
     * ```
     *
     * @since 0.1.0
     */
    abstract findById(options: { id: PrimaryKey } & BaseQueryOptions): Promise<InferSelectModel<TTable> | null>;

    /**
     * Find the first entity matching the given criteria.
     *
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to the first matching entity or null
     *
     * @example
     * ```typescript
     * const user = await userRepo.findFirst({ where: eq(users.email, 'john@example.com') });
     * ```
     *
     * @since 0.1.0
     */
    abstract findFirst(options: { where?: SQL } & BaseQueryOptions): Promise<InferSelectModel<TTable> | null>;

    /**
     * Find multiple entities matching the given criteria.
     *
     * @param options - Query options including where clause, limit, offset, and transaction
     * @returns Promise resolving to array of matching entities
     *
     * @example
     * ```typescript
     * const users = await userRepo.findMany({
     *   where: eq(users.status, 'active'),
     *   limit: 10,
     *   offset: 0
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract findMany(options?: { where?: SQL } & FindOptions): Promise<InferSelectModel<TTable>[]>;

    /**
     * Find entities with pagination support.
     *
     * @param options - Pagination options including where clause, page, limit, and transaction
     * @returns Promise resolving to paginated result
     *
     * @example
     * ```typescript
     * const result = await userRepo.findPaginated({
     *   where: eq(users.status, 'active'),
     *   page: 1,
     *   limit: 20
     * });
     * console.log(result.pagination.total); // Total count
     * console.log(result.data); // Current page data
     * ```
     *
     * @since 0.1.0
     */
    async findPaginated(
        options?: { where?: SQL } & PaginationOptions
    ): Promise<PaginatedResult<InferSelectModel<TTable>>> {
        // Validate and constrain inputs
        const validatedPage = Math.max(1, Math.floor(options?.page ?? 1));
        const validatedLimit = Math.min(
            this.config.maxLimit,
            Math.max(1, Math.floor(options?.limit ?? this.config.defaultLimit))
        );
        const offset = (validatedPage - 1) * validatedLimit;

        // Execute queries in parallel for better performance
        const [data, total] = await Promise.all([
            this.findMany({ where: options?.where, limit: validatedLimit, offset, tx: options?.tx }),
            this.count({ where: options?.where, tx: options?.tx }),
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
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to boolean indicating existence
     *
     * @example
     * ```typescript
     * const emailExists = await userRepo.exists({ where: eq(users.email, 'john@example.com') });
     * ```
     *
     * @since 0.1.0
     */
    abstract exists(options: { where: SQL } & BaseQueryOptions): Promise<boolean>;

    /**
     * Count entities matching the given criteria.
     *
     * @param options - Query options including where clause and transaction
     * @returns Promise resolving to count of matching entities
     *
     * @example
     * ```typescript
     * const activeUserCount = await userRepo.count({ where: eq(users.status, 'active') });
     * ```
     *
     * @since 0.1.0
     */
    abstract count(options?: { where?: SQL } & BaseQueryOptions): Promise<number>;

    /**
     * Create and save a new entity.
     *
     * @param options - Options including entity data and transaction
     * @returns Promise resolving to the created entity
     *
     * @example
     * ```typescript
     * const newUser = await userRepo.save({
     *   data: {
     *     email: 'john@example.com',
     *     name: 'John Doe'
     *   }
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract save(options: { data: InferInsertModel<TTable> } & BaseQueryOptions): Promise<InferSelectModel<TTable>>;

    /**
     * Update an existing entity by its primary key.
     *
     * @param options - Options including id, data, and transaction
     * @returns Promise resolving to the updated entity
     *
     * @example
     * ```typescript
     * const updatedUser = await userRepo.update({
     *   id: 42,
     *   data: { name: 'John Smith' }
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract update(
        options: { id: PrimaryKey; data: Partial<InferInsertModel<TTable>> } & BaseQueryOptions
    ): Promise<InferSelectModel<TTable>>;

    /**
     * Delete an entity by its primary key.
     *
     * @param options - Options including id and transaction
     * @returns Promise resolving when deletion is complete
     *
     * @example
     * ```typescript
     * await userRepo.remove({ id: 42 });
     * ```
     *
     * @since 0.1.0
     */
    abstract remove(options: { id: PrimaryKey } & BaseQueryOptions): Promise<void>;

    /**
     * Insert or update an entity (upsert operation).
     *
     * @param options - Options including where condition, create data, update data, and transaction
     * @returns Promise resolving to the upserted entity
     *
     * @example
     * ```typescript
     * const user = await userRepo.upsert({
     *   where: eq(users.email, 'john@example.com'),
     *   create: { email: 'john@example.com', name: 'John Doe' },
     *   update: { name: 'John Smith' }
     * });
     * ```
     *
     * @since 0.1.0
     */
    abstract upsert(
        options: {
            where: SQL;
            create: InferInsertModel<TTable>;
            update: Partial<InferInsertModel<TTable>>;
        } & BaseQueryOptions
    ): Promise<InferSelectModel<TTable>>;

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
     *   const user = await userRepo.save({ data: { email: 'john@example.com' }, tx });
     *   const profile = await profileRepo.save({ data: { userId: user.id }, tx });
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
     * @param _tx - Optional transaction context
     * @returns Promise resolving to entities with loaded relations
     *
     * @example
     * ```typescript
     * const usersWithProfiles = await userRepo.loadRelations(users);
     * ```
     *
     * @since 0.1.0
     */
    async loadRelations(entities: InferSelectModel<TTable>[], _tx?: Transaction): Promise<InferSelectModel<TTable>[]> {
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
    getConfig(): Required<RepositoryInstanceConfig> {
        return this.config;
    }
}
