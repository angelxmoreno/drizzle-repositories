/**
 * Sample test data and fixtures
 * Reusable test data for consistent testing
 */

import type { RepositoryConfig } from '../../src/index';

// Sample repository configurations
export const sampleConfigs: Record<string, RepositoryConfig> = {
    postgresql: {
        dialect: 'pg',
        schemaPath: './src/schema/postgres.ts',
        outputPath: './src/repositories/generated',
    },

    mysql: {
        dialect: 'mysql',
        schemaPath: './src/schema/mysql.ts',
        outputPath: './src/repositories/generated',
    },

    sqlite: {
        dialect: 'sqlite',
        schemaPath: './src/schema/sqlite.ts',
        outputPath: './src/repositories/generated',
    },
};

// Sample schema definitions (as strings for testing parsing)
export const sampleSchemas = {
    simpleTable: `
        import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
        
        export const users = pgTable('users', {
            id: serial('id').primaryKey(),
            name: varchar('name', { length: 100 }).notNull(),
            email: varchar('email', { length: 255 }).notNull().unique(),
            createdAt: timestamp('created_at').defaultNow(),
            updatedAt: timestamp('updated_at').defaultNow(),
        });
    `,

    withRelations: `
        import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
        
        export const users = pgTable('users', {
            id: serial('id').primaryKey(),
            name: varchar('name', { length: 100 }).notNull(),
            email: varchar('email', { length: 255 }).notNull().unique(),
            createdAt: timestamp('created_at').defaultNow(),
        });
        
        export const posts = pgTable('posts', {
            id: serial('id').primaryKey(),
            title: varchar('title', { length: 200 }).notNull(),
            content: varchar('content', { length: 5000 }),
            authorId: integer('author_id').references(() => users.id),
            createdAt: timestamp('created_at').defaultNow(),
        });
    `,
};

// Sample generated repository code (for testing output)
export const expectedRepositoryOutput = {
    baseRepository: `
        export abstract class BaseRepository<TTable, TSelect, TInsert> {
            constructor(
                protected db: DrizzleDB,
                protected table: TTable
            ) {}
            
            async findById(id: number): Promise<TSelect | null> {
                // Implementation...
            }
        }
    `,

    userRepository: `
        export class BaseUserRepository extends BasePgRepository<typeof users, User, NewUser> {
            constructor(db: DrizzleDB) {
                super(db, users);
            }
        }
    `,
};

// Mock file system data
export const mockFiles = {
    'schema.ts': sampleSchemas.simpleTable,
    'schema-with-relations.ts': sampleSchemas.withRelations,
    'package.json': JSON.stringify({
        name: 'test-project',
        dependencies: {
            'drizzle-orm': '^0.28.0',
        },
    }),
};

// Test database records
export const sampleRecords = {
    users: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date('2024-01-02'),
        },
    ],

    posts: [
        {
            id: 1,
            title: 'First Post',
            content: 'This is the first post content',
            authorId: 1,
            createdAt: new Date('2024-01-01'),
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'This is the second post content',
            authorId: 2,
            createdAt: new Date('2024-01-02'),
        },
    ],
};
