/**
 * Utility types for the Drizzle Repository Codegen Framework.
 *
 * This module provides comprehensive utility types for working with
 * Drizzle ORM schemas, including type inference helpers, validation utilities,
 * and advanced TypeScript type manipulation for repository generation.
 *
 * @since 0.1.0
 */

/**
 * Extract the primary key type from a Drizzle table.
 *
 * This utility type analyzes a Drizzle table definition and extracts
 * the primary key structure, handling both single and composite keys.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type ExtractPrimaryKey<TTable> = TTable extends { [K: string]: infer TColumn }
    ? TColumn extends { primaryKey: true }
        ? TColumn
        : never
    : never;

/**
 * Utility type to check if a table has a composite primary key.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type HasCompositePrimaryKey<TTable> = ExtractPrimaryKey<TTable> extends never
    ? false
    : ExtractPrimaryKey<TTable>[] extends readonly [unknown, ...unknown[]]
      ? true
      : false;

/**
 * Extract column names from a Drizzle table that form the primary key.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type PrimaryKeyColumns<TTable> = {
    [K in keyof TTable]: TTable[K] extends { primaryKey: true } ? K : never;
}[keyof TTable];

/**
 * Check if a table has a soft delete column (deletedAt).
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type HasSoftDelete<TTable> = 'deletedAt' extends keyof TTable ? true : false;

/**
 * Check if a table has audit trail columns (createdAt, updatedAt).
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type HasAuditTrail<TTable> = 'createdAt' extends keyof TTable
    ? 'updatedAt' extends keyof TTable
        ? true
        : false
    : false;

/**
 * Extract timestamp column names from a table.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type TimestampColumns<TTable> = {
    [K in keyof TTable]: TTable[K] extends { dataType: 'timestamp' | 'datetime' } ? K : never;
}[keyof TTable];

/**
 * Extract nullable column names from a table.
 *
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type NullableColumns<TTable> = {
    [K in keyof TTable]: TTable[K] extends { notNull: false } ? K : never;
}[keyof TTable];

/**
 * Extract required columns for insert operations.
 *
 * Excludes auto-increment, default value, and generated columns.
 *
 * @template TInsert - The Drizzle insert type
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type RequiredInsertColumns<TInsert, TTable> = {
    [K in keyof TInsert]: K extends keyof TTable
        ? TTable[K] extends { hasDefault: true } | { generated: true } | { autoIncrement: true }
            ? never
            : TInsert[K] extends undefined
              ? never
              : K
        : K;
}[keyof TInsert];

/**
 * Create an optional insert type with only required fields mandatory.
 *
 * @template TInsert - The Drizzle insert type
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type OptionalInsertType<TInsert, TTable> = Pick<TInsert, RequiredInsertColumns<TInsert, TTable>> &
    Partial<Omit<TInsert, RequiredInsertColumns<TInsert, TTable>>>;

/**
 * Create an update type excluding immutable columns.
 *
 * @template TSelect - The Drizzle select type
 * @template TTable - The Drizzle table type
 *
 * @since 0.1.0
 */
export type UpdateType<TSelect, TTable> = Partial<Omit<TSelect, PrimaryKeyColumns<TTable> | 'createdAt' | 'id'>>;

/**
 * Utility type for deep readonly objects.
 *
 * @template T - Object type to make readonly
 *
 * @since 0.1.0
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Utility type for deep partial objects.
 *
 * @template T - Object type to make partial
 *
 * @since 0.1.0
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Utility type to extract the value type of a union.
 *
 * @template T - Union type
 *
 * @since 0.1.0
 */
export type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (k: infer I) => void
    ? I
    : never;

/**
 * Utility type to make specific properties required.
 *
 * @template T - Object type
 * @template K - Keys to make required
 *
 * @since 0.1.0
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type to make specific properties optional.
 *
 * @template T - Object type
 * @template K - Keys to make optional
 *
 * @since 0.1.0
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for non-empty arrays.
 *
 * @template T - Array element type
 *
 * @since 0.1.0
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Utility type to ensure at least one property is defined.
 *
 * @template T - Object type
 *
 * @since 0.1.0
 */
export type AtLeastOne<T> = {
    [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

/**
 * Utility type for branded primitive types.
 *
 * @template T - Base type
 * @template B - Brand identifier
 *
 * @since 0.1.0
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Branded type for entity IDs.
 *
 * @template T - Entity type name
 *
 * @since 0.1.0
 */
export type EntityId<T extends string> = Brand<number | string, `${T}Id`>;

/**
 * Utility type for JSON-serializable values.
 *
 * @since 0.1.0
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Utility type for database column types.
 *
 * @since 0.1.0
 */
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'json' | 'binary' | 'uuid' | 'enum';

/**
 * Utility type for repository method names.
 *
 * @since 0.1.0
 */
export type RepositoryMethod =
    | 'findById'
    | 'findFirst'
    | 'findMany'
    | 'findPaginated'
    | 'exists'
    | 'count'
    | 'save'
    | 'update'
    | 'remove'
    | 'upsert'
    | 'softDelete'
    | 'restore'
    | 'transaction'
    | 'loadRelations';

/**
 * Type guard to check if a value is defined.
 *
 * @param value - Value to check
 * @returns True if value is not null or undefined
 *
 * @since 0.1.0
 */
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is a non-empty string.
 *
 * @param value - Value to check
 * @returns True if value is a non-empty string
 *
 * @since 0.1.0
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard to check if a value is a valid primary key.
 *
 * @param value - Value to check
 * @returns True if value is a valid primary key
 *
 * @since 0.1.0
 */
export function isPrimaryKey(value: unknown): value is number | string | Record<string, number | string> {
    return (
        typeof value === 'number' ||
        typeof value === 'string' ||
        (typeof value === 'object' && value !== null && !Array.isArray(value))
    );
}

/**
 * Type guard to check if an object has a specific property.
 *
 * @param obj - Object to check
 * @param prop - Property name to check for
 * @returns True if object has the property
 *
 * @since 0.1.0
 */
export function hasProperty<T extends object, K extends string>(obj: T, prop: K): obj is T & Record<K, unknown> {
    return prop in obj;
}

/**
 * Utility function to create a branded type.
 *
 * @param value - Value to brand
 * @returns Branded value
 *
 * @since 0.1.0
 */
export function createBrand<T, B>(value: T): Brand<T, B> {
    return value as Brand<T, B>;
}

/**
 * Utility function to extract the base value from a branded type.
 *
 * @param branded - Branded value
 * @returns Base value
 *
 * @since 0.1.0
 */
export function extractBrand<T, B>(branded: Brand<T, B>): T {
    return branded as T;
}

/**
 * Result type for operations that can succeed or fail.
 *
 * @template T - Success value type
 * @template E - Error type
 *
 * @since 0.1.0
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Create a success result.
 *
 * @param data - Success data
 * @returns Success result
 *
 * @since 0.1.0
 */
export function ok<T>(data: T): Result<T, never> {
    return { success: true, data };
}

/**
 * Create an error result.
 *
 * @param error - Error data
 * @returns Error result
 *
 * @since 0.1.0
 */
export function err<E>(error: E): Result<never, E> {
    return { success: false, error };
}

/**
 * Check if a result is successful.
 *
 * @param result - Result to check
 * @returns True if result is successful
 *
 * @since 0.1.0
 */
export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
}

/**
 * Check if a result is an error.
 *
 * @param result - Result to check
 * @returns True if result is an error
 *
 * @since 0.1.0
 */
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
}
