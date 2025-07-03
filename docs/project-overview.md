# 🧱 drizzle-repositories - Project Overview

## 📋 Project Summary

A standalone NPM package that generates type-safe, extensible repository classes for Drizzle ORM projects. Supports PostgreSQL, MySQL, and SQLite with dependency injection, customizable codegen, and strong typing conventions.

## 🎯 Core Objectives

- **Multi-dialect Support**: PostgreSQL, MySQL, and SQLite
- **Type Safety**: Leverages Drizzle's `InferSelectModel` and `InferInsertModel` with native SQL expressions
- **Three-Layer Architecture**: Base → Generated → Custom repositories
- **Dependency Injection**: TSyringe-based with sub-container isolation
- **Developer Experience**: Epic documentation, intuitive CLI, proper TypeScript integration

## 🏗️ Architecture Overview

### Three-Layer Repository Pattern

```
Layer 1: BaseRepository (shared, abstract methods)
├── BasePgRepository (PostgreSQL-specific)
├── BaseMySQLRepository (MySQL-specific) 
└── BaseSQLiteRepository (SQLite-specific)

Layer 2: BaseUserRepository (generated, ephemeral, always overwritten)

Layer 3: UserRepository (developer's custom queries, never overwritten)
```

### Dependency Injection Strategy

- **Primary**: TSyringe with sub-container approach
- **Fallback**: Factory functions for non-DI users
- **Container Isolation**: Dedicated `RepositoryContainer` to avoid conflicts
- **Configuration**: Injectable `RepositoryConfig` service

## 📦 Package Structure

```
drizzle-repo-codegen/
├── src/
│   ├── cli/                      # CLI commands and parsing
│   ├── core/                     # Core business logic
│   │   ├── generators/           # Code generation logic
│   │   ├── parsers/              # Schema file parsing
│   │   └── templates/            # Template generation
│   ├── repositories/             # Base repository classes
│   │   ├── base/                 # Abstract base classes
│   │   ├── dialects/             # Dialect-specific implementations
│   │   └── types/                # Repository type definitions
│   ├── container/                # DI container setup
│   ├── config/                   # Configuration management
│   └── types/                    # Global type definitions
├── templates/                    # Code generation templates
├── examples/                     # Example projects
│   ├── basic-usage/
│   ├── with-dependency-injection/
│   └── multi-dialect/
├── tests/                        # Comprehensive test suite
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docker-compose.yml            # PostgreSQL + MySQL for testing
└── docs/                         # Generated TypeDoc documentation
```

## ⚙️ Configuration System

### Primary Config File: `repository.codegen.config.ts`

```typescript
export interface RepositoryCodegenConfig {
  /** Database dialect - determines imports and table types */
  dialect: 'pg' | 'mysql' | 'sqlite';
  
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
  
  /** Optional: Generation feature flags */
  features?: {
    relationships?: boolean;
    auditTrail?: boolean;
    validation?: boolean;
    caching?: boolean;
  };
}
```

## 🔧 Core Features & Methods

### Base Repository Methods

All repositories inherit these methods:

```typescript
// Query Methods
findById(options: { id: PrimaryKey, tx?: Transaction }): Promise<T | null>
findFirst(options: { where?: SQL, tx?: Transaction }): Promise<T | null>
findMany(options?: { where?: SQL, limit?: number, offset?: number, tx?: Transaction }): Promise<T[]>
findPaginated(options?: { where?: SQL, page?: number, limit?: number, tx?: Transaction }): Promise<PaginatedResult<T>>

// Existence & Counting
exists(options: { where: SQL, tx?: Transaction }): Promise<boolean>
count(options?: { where?: SQL, tx?: Transaction }): Promise<number>

// Mutation Methods
save(options: { data: InsertType<T>, tx?: Transaction }): Promise<T>
update(options: { id: PrimaryKey, data: Partial<InsertType<T>>, tx?: Transaction }): Promise<T>
remove(options: { id: PrimaryKey, tx?: Transaction }): Promise<void>
upsert(options: { where: SQL, create: InsertType<T>, update: Partial<InsertType<T>>, tx?: Transaction }): Promise<T>

// Extensibility
loadRelations(entities: T[], tx?: Transaction): Promise<T[]>
transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>
```

### Dialect-Specific Features

- **PostgreSQL**: Native `NodePgDatabase` types, `RETURNING` clause support, `ON CONFLICT` handling
- **MySQL**: Native `MySql2Database` types, `ON DUPLICATE KEY UPDATE` support, MySQL-specific optimizations
- **SQLite**: Native `BetterSQLite3Database` types, simplified transaction handling, file-based operations

## 🛠️ CLI Interface

### Primary Commands

```bash
# Generate repositories from schema
npx drizzle-repo-codegen generate

# Initialize config file
npx drizzle-repo-codegen init

# Validate existing repositories
npx drizzle-repo-codegen validate

# Show help
npx drizzle-repo-codegen --help
```

### CLI Options

```bash
drizzle-repo-codegen generate [options]

Options:
  -c, --config <path>     Config file path (default: repository.codegen.config.ts)
  -w, --watch            Watch mode for development
  -v, --verbose          Verbose logging
  -d, --dry-run          Preview changes without writing files
  --skip-concrete        Skip generating concrete repository classes
```

## 📝 Code Generation Logic

### Schema Discovery Process

1. **Parse Config**: Load and validate configuration file
2. **Scan Schema Files**: Use glob patterns to find schema files
3. **Extract Tables**: Parse TypeScript/JavaScript files for Drizzle table exports
4. **Analyze Columns**: Detect primary keys, soft delete columns, relationships
5. **Generate Code**: Create base and concrete repository classes
6. **Write Files**: Safe, non-destructive file generation

### Template System

- **Simple Template Literals**: No external template engine dependencies
- **Dialect-Aware**: Different imports and methods per database type
- **Type-Safe Generation**: Proper TypeScript types in generated code
- **Formatting**: Automatic code formatting via Biome

## 🧪 Testing Strategy

### Test Databases (Docker Compose)

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_pass
    ports:
      - "5432:5432"
      
  mysql:
    image: mysql:8
    environment:
      MYSQL_DATABASE: test_db
      MYSQL_USER: test_user
      MYSQL_PASSWORD: test_pass
      MYSQL_ROOT_PASSWORD: root_pass
    ports:
      - "3306:3306"
```

### Test Categories

1. **Unit Tests**: Individual method testing with Bun Test
2. **Integration Tests**: Full database operations across all dialects
3. **CLI Tests**: Command-line interface functionality
4. **Generation Tests**: Code generation accuracy and safety
5. **DI Container Tests**: Dependency injection functionality

## 📚 Documentation Standards

### TypeDoc Configuration

- **Epic-level Documentation**: Every class, method, and interface documented
- **JSDoc Comments**: Comprehensive docblocks with examples
- **Type Safety**: Full TypeScript integration
- **Code Examples**: Real-world usage patterns

### Documentation Requirements

```typescript
/**
 * Base repository class providing common database operations for Drizzle ORM.
 * 
 * This abstract class serves as the foundation for all generated repository classes,
 * providing type-safe CRUD operations, transaction support, and extensibility hooks.
 * 
 * @template TTable - The Drizzle table type
 * @template TSelect - The inferred select model type
 * @template TInsert - The inferred insert model type
 * 
 * @example
 * ```typescript
 * class UserRepository extends BaseRepository<typeof users, User, NewUser> {
 *   constructor(db: DrizzleDB) {
 *     super(db, users);
 *   }
 * }
 * ```
 * 
 * @since 0.1.0
 */
export abstract class BaseRepository<TTable, TSelect, TInsert> {
  // Implementation...
}
```

## 🔨 Development Tooling

### Code Quality Stack

- **Biome**: Linting, formatting, and code analysis
- **Lefthook**: Git hooks for pre-commit checks
- **Conventional Commits**: Standardized commit message format
- **TypeScript**: Strict type checking configuration
- **Bun Test**: Testing framework with native TypeScript support and speed

### Git Hooks Configuration

```yaml
# lefthook.yml
pre-commit:
  commands:
    lint:
      run: biome check --apply .
    type-check:
      run: tsc --noEmit
    test:
      run: bun test

commit-msg:
  commands:
    conventional-commits:
      run: commitlint --edit
```

## 🚀 Build & Distribution

### NPM Package Configuration

- **Main Entry**: `dist/index.js` (library)
- **CLI Binary**: `dist/cli.js`
- **TypeScript Definitions**: Full `.d.ts` file generation
- **Peer Dependencies**: `drizzle-orm >= 0.28.0`
- **Node Version**: `>= 18.0.0` (matching modern JavaScript runtime support)
- **Bun Test Runner**: Comprehensive test suite with Bun's fast test runner

### Publishing Strategy

1. **Semantic Versioning**: Automated version bumping
2. **GitHub Actions**: CI/CD pipeline with multi-database testing
3. **NPM Registry**: Public package distribution
4. **Documentation Site**: Auto-generated TypeDoc hosting

## 🔄 Usage Patterns

### Basic Usage (No DI)

```typescript
import { createUserRepository } from './repositories/UserRepository';
import { db } from './db';

const userRepo = createUserRepository(db);
const user = await userRepo.findById(1);
```

### With Dependency Injection

```typescript
import { container } from 'tsyringe';
import { RepositoryModule } from 'drizzle-repo-codegen';

// Setup
RepositoryModule.register(container, { db });

// Usage
const userRepo = container.resolve(UserRepository);
const user = await userRepo.findById(1);
```

### Custom Repository Extensions

```typescript
// Generated: BaseUserRepository.ts (always overwritten)
export class BaseUserRepository extends BasePgRepository<typeof users, User, NewUser> {
  // Auto-generated methods
}

// Developer-maintained: UserRepository.ts (never overwritten)
export class UserRepository extends BaseUserRepository {
  /**
   * Find users by email domain
   */
  async findByEmailDomain(domain: string): Promise<User[]> {
    return this.findMany({
      email: sql`${users.email} LIKE ${'%@' + domain}`
    });
  }
}
```

---

**This project overview serves as the complete specification for building the Drizzle Repository Codegen Framework. All architectural decisions, technical requirements, and implementation details are documented above for development execution.**

For implementation tasks and progress tracking, see [tasks.md](./tasks.md).